/**
 * Core logic for the LLM proxy Worker, kept out of the entry module
 * (`index.ts`) so that index.ts can have *only* a default export.
 *
 * Cloudflare's runtime (workerd) treats every named export of the entry
 * module as a named entrypoint and requires it to be a function or
 * ExportedHandler — exporting plain constants like FREE_MODEL there makes
 * `wrangler dev` fail to start with "Incorrect type for map entry". The
 * constants and helpers still need to be exported for unit tests, so they
 * live here and the entry module just re-dispatches into handleFetch.
 */

export interface Env {
  OPENROUTER_API_KEY: string;
  ALLOWED_ORIGIN: string;
  RATE_LIMIT_KV: KVNamespace;
  /**
   * Optional override for the primary OpenRouter model slug. Free `:free`
   * models come and go (and occasionally flip to paid-only, returning a
   * 404), so keeping this in config lets you swap models — or move to a
   * paid model like an Anthropic one — without a code change. Falls back
   * to {@link DEFAULT_MODEL}.
   */
  OPENROUTER_MODEL?: string;
  /**
   * Optional comma-separated fallback models. OpenRouter tries the primary
   * first and routes to the next on error (e.g. a free model that is
   * temporarily rate-limited upstream returns 429). Falls back to
   * {@link DEFAULT_FALLBACK_MODELS}.
   */
  OPENROUTER_FALLBACK_MODELS?: string;
}

/**
 * Default primary model when OPENROUTER_MODEL is unset. A currently-
 * available free instruction-following model; update it here (or via the
 * env var) if OpenRouter retires it.
 */
export const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct:free";

/**
 * Free models from different upstream providers, tried in order after the
 * primary. Free tiers are heavily rate-limited per provider, so spreading
 * across providers makes a transient 429 on one fall through to another
 * instead of failing the request.
 */
export const DEFAULT_FALLBACK_MODELS = ["openai/gpt-oss-120b:free", "z-ai/glm-4.5-air:free"];

/**
 * OpenRouter caps its `models` routing array at 3 entries (a 4th yields a
 * 400 "'models' array must have 3 items or fewer.").
 */
export const MAX_MODELS = 3;

/**
 * Builds the ordered, de-duplicated model list sent to OpenRouter as its
 * `models` routing array: the configured primary first, then the
 * fallbacks, capped at {@link MAX_MODELS}.
 */
export function buildModelList(env: Env): string[] {
  const primary = env.OPENROUTER_MODEL || DEFAULT_MODEL;
  const fallbacks =
    env.OPENROUTER_FALLBACK_MODELS !== undefined
      ? env.OPENROUTER_FALLBACK_MODELS.split(",")
          .map((m) => m.trim())
          .filter((m) => m.length > 0)
      : DEFAULT_FALLBACK_MODELS;
  return [...new Set([primary, ...fallbacks])].slice(0, MAX_MODELS);
}
export const MAX_TOKENS = 2048;
export const MAX_MESSAGES = 12;
/**
 * Length cap for user/assistant messages — these carry untrusted input
 * from the public, so keep them tight.
 */
export const MAX_MESSAGE_LENGTH = 8000;
/**
 * Length cap for system and tool messages. The system prompt carries the
 * full pipeline schema (~7.6k chars) and tool messages carry skill
 * templates the frontend feeds back during the tool-call round trip, so
 * both are app-generated and legitimately larger than untrusted
 * user/assistant input.
 */
export const MAX_SYSTEM_MESSAGE_LENGTH = 24000;
/** Bounds on the optional OpenAI tool-calling fields forwarded upstream. */
export const MAX_TOOLS = 16;
export const MAX_TOOL_CALLS = 16;
export const MAX_TOOL_NAME_LENGTH = 64;
export const MAX_TOOL_DESCRIPTION_LENGTH = 1024;
export const MAX_TOOL_CALL_ID_LENGTH = 256;
export const PER_MINUTE_LIMIT = 3;
export const PER_DAY_LIMIT = 20;

const MINUTE_TTL_SECONDS = 90;
const DAY_TTL_SECONDS = 2 * 24 * 60 * 60;

type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
};

type ToolDefinition = {
  type: "function";
  function: { name: string; description?: string; parameters?: Record<string, unknown> };
};

export async function handleFetch(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get("Origin");
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const log = (message: string) => console.log(`[llm-proxy] ${ip} ${message}`);

  log(`${request.method} origin=${origin ?? "none"}`);

  if (request.method === "OPTIONS") {
    return handlePreflight(origin, env);
  }

  if (request.method !== "POST") {
    log(`rejected: method ${request.method} not allowed`);
    return jsonError("Method not allowed", 405, origin, env);
  }

  if (!isAllowedOrigin(origin, env)) {
    log(`rejected: forbidden origin ${origin ?? "none"} (expected ${env.ALLOWED_ORIGIN})`);
    return jsonError("Forbidden origin", 403, origin, env);
  }

  if (await isRateLimited(ip, env)) {
    log("rejected: rate limit exceeded");
    return jsonError("Rate limit exceeded. Please try again later.", 429, origin, env);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    log("rejected: invalid JSON body");
    return jsonError("Invalid JSON body", 400, origin, env);
  }

  const messages = sanitizeMessages(payload);
  if (!messages) {
    log("rejected: missing or invalid 'messages' array");
    return jsonError("Missing or invalid 'messages' array", 400, origin, env);
  }

  const tools = sanitizeTools(payload);
  if (tools === null) {
    log("rejected: invalid 'tools' array");
    return jsonError("Invalid 'tools' array", 400, origin, env);
  }

  const models = buildModelList(env);
  log(
    `forwarding ${messages.length} message(s)` +
      `${tools && tools.length > 0 ? ` + ${tools.length} tool(s)` : ""} to OpenRouter ` +
      `(model=${models[0]}${models.length > 1 ? ` +${models.length - 1} fallback(s)` : ""})`,
  );

  const upstreamBody: Record<string, unknown> = {
    models,
    messages,
    max_tokens: MAX_TOKENS,
    stream: true,
  };
  if (tools && tools.length > 0) {
    upstreamBody.tools = tools;
  }

  let upstream: Response;
  try {
    upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.ALLOWED_ORIGIN,
        "X-Title": "megane demo",
      },
      body: JSON.stringify(upstreamBody),
    });
  } catch (err) {
    console.error(`[llm-proxy] ${ip} upstream fetch failed: ${(err as Error).message}`);
    return jsonError("Upstream request failed", 502, origin, env);
  }

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text();
    console.error(`[llm-proxy] ${ip} upstream error ${upstream.status}: ${text}`);
    return jsonError(`Upstream error: ${text}`, upstream.status || 502, origin, env);
  }

  log(`upstream responded ${upstream.status}, streaming back to client`);

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      ...corsHeaders(origin, env),
    },
  });
}

// ─── CORS ────────────────────────────────────────────────────────────

export function isAllowedOrigin(origin: string | null, env: Env): boolean {
  return origin !== null && origin === env.ALLOWED_ORIGIN;
}

export function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  if (!isAllowedOrigin(origin, env)) return {};
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    Vary: "Origin",
  };
}

function handlePreflight(origin: string | null, env: Env): Response {
  if (!isAllowedOrigin(origin, env)) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(origin, env),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function jsonError(message: string, status: number, origin: string | null, env: Env): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin, env),
    },
  });
}

// ─── Request validation ──────────────────────────────────────────────

/**
 * Validates and narrows the request body to a small, bounded list of
 * chat messages. Returns null for anything malformed or oversized so
 * the worker never forwards untrusted shapes (or huge prompts) upstream.
 *
 * Supports the OpenAI tool-calling round trip: assistant messages may
 * carry `tool_calls` (with null content), and `tool` messages carry a
 * `tool_call_id` plus the skill-result content.
 */
export function sanitizeMessages(payload: unknown): ChatMessage[] | null {
  if (typeof payload !== "object" || payload === null) return null;
  const messages = (payload as Record<string, unknown>).messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return null;
  }

  const sanitized: ChatMessage[] = [];
  for (const entry of messages) {
    if (typeof entry !== "object" || entry === null) return null;
    const e = entry as Record<string, unknown>;
    const role = e.role;
    if (role !== "system" && role !== "user" && role !== "assistant" && role !== "tool") {
      return null;
    }

    // tool_calls are only valid on assistant messages.
    let toolCalls: ToolCall[] | undefined;
    if (e.tool_calls !== undefined) {
      if (role !== "assistant") return null;
      const parsed = sanitizeToolCalls(e.tool_calls);
      if (parsed === null) return null;
      toolCalls = parsed;
    }

    // tool_call_id is required on (and only on) tool messages.
    let toolCallId: string | undefined;
    if (role === "tool") {
      const id = e.tool_call_id;
      if (typeof id !== "string" || id.length === 0 || id.length > MAX_TOOL_CALL_ID_LENGTH) {
        return null;
      }
      toolCallId = id;
    } else if (e.tool_call_id !== undefined) {
      return null;
    }

    // Content may be null only for an assistant message that carries
    // tool_calls; otherwise it must be a bounded non-empty string.
    const content = e.content;
    if (content === null) {
      if (!(role === "assistant" && toolCalls && toolCalls.length > 0)) return null;
    } else {
      const maxLength =
        role === "system" || role === "tool" ? MAX_SYSTEM_MESSAGE_LENGTH : MAX_MESSAGE_LENGTH;
      if (typeof content !== "string" || content.length === 0 || content.length > maxLength) {
        return null;
      }
    }

    const msg: ChatMessage = { role, content: content === null ? null : (content as string) };
    if (toolCalls) msg.tool_calls = toolCalls;
    if (toolCallId) msg.tool_call_id = toolCallId;
    sanitized.push(msg);
  }
  return sanitized;
}

/**
 * Validates an assistant message's `tool_calls` array. Returns null for
 * any malformed or oversized shape.
 */
function sanitizeToolCalls(raw: unknown): ToolCall[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_TOOL_CALLS) return null;

  const out: ToolCall[] = [];
  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) return null;
    const tc = entry as Record<string, unknown>;
    if (tc.type !== "function") return null;
    const id = tc.id;
    if (typeof id !== "string" || id.length === 0 || id.length > MAX_TOOL_CALL_ID_LENGTH) {
      return null;
    }
    const fn = tc.function;
    if (typeof fn !== "object" || fn === null) return null;
    const name = (fn as Record<string, unknown>).name;
    const args = (fn as Record<string, unknown>).arguments;
    if (typeof name !== "string" || name.length === 0 || name.length > MAX_TOOL_NAME_LENGTH) {
      return null;
    }
    if (typeof args !== "string" || args.length > MAX_MESSAGE_LENGTH) return null;
    out.push({ id, type: "function", function: { name, arguments: args } });
  }
  return out;
}

/**
 * Validates the optional `tools` array (OpenAI function definitions).
 * Returns undefined when absent, the sanitized array when valid, or null
 * when present-but-malformed (which the caller turns into a 400).
 */
export function sanitizeTools(payload: unknown): ToolDefinition[] | null | undefined {
  if (typeof payload !== "object" || payload === null) return undefined;
  const tools = (payload as Record<string, unknown>).tools;
  if (tools === undefined) return undefined;
  if (!Array.isArray(tools) || tools.length > MAX_TOOLS) return null;

  const out: ToolDefinition[] = [];
  for (const entry of tools) {
    if (typeof entry !== "object" || entry === null) return null;
    const t = entry as Record<string, unknown>;
    if (t.type !== "function") return null;
    const fn = t.function;
    if (typeof fn !== "object" || fn === null) return null;
    const f = fn as Record<string, unknown>;
    const name = f.name;
    if (typeof name !== "string" || name.length === 0 || name.length > MAX_TOOL_NAME_LENGTH) {
      return null;
    }
    let description: string | undefined;
    if (f.description !== undefined) {
      if (typeof f.description !== "string" || f.description.length > MAX_TOOL_DESCRIPTION_LENGTH) {
        return null;
      }
      description = f.description;
    }
    let parameters: Record<string, unknown> | undefined;
    if (f.parameters !== undefined) {
      if (typeof f.parameters !== "object" || f.parameters === null) return null;
      parameters = f.parameters as Record<string, unknown>;
    }
    out.push({ type: "function", function: { name, description, parameters } });
  }
  return out;
}

// ─── Rate limiting ───────────────────────────────────────────────────

/**
 * Fixed-window per-IP rate limit backed by KV (read-then-write). KV is
 * eventually consistent so concurrent requests can race past the limit
 * by a small margin — acceptable for a low-traffic demo; a Durable
 * Object would be needed for exact counting.
 */
export async function isRateLimited(ip: string, env: Env): Promise<boolean> {
  const now = Date.now();
  const minuteKey = `rl:m:${ip}:${Math.floor(now / 60_000)}`;
  const dayKey = `rl:d:${ip}:${Math.floor(now / 86_400_000)}`;

  const [minuteRaw, dayRaw] = await Promise.all([
    env.RATE_LIMIT_KV.get(minuteKey),
    env.RATE_LIMIT_KV.get(dayKey),
  ]);
  const minuteCount = minuteRaw ? parseInt(minuteRaw, 10) : 0;
  const dayCount = dayRaw ? parseInt(dayRaw, 10) : 0;

  if (minuteCount >= PER_MINUTE_LIMIT || dayCount >= PER_DAY_LIMIT) {
    return true;
  }

  await Promise.all([
    env.RATE_LIMIT_KV.put(minuteKey, String(minuteCount + 1), {
      expirationTtl: MINUTE_TTL_SECONDS,
    }),
    env.RATE_LIMIT_KV.put(dayKey, String(dayCount + 1), { expirationTtl: DAY_TTL_SECONDS }),
  ]);

  return false;
}
