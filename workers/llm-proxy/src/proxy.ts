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
}

export const FREE_MODEL = "deepseek/deepseek-chat-v3.1:free";
export const MAX_TOKENS = 2048;
export const MAX_MESSAGES = 10;
export const MAX_MESSAGE_LENGTH = 8000;
export const PER_MINUTE_LIMIT = 3;
export const PER_DAY_LIMIT = 20;

const MINUTE_TTL_SECONDS = 90;
const DAY_TTL_SECONDS = 2 * 24 * 60 * 60;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

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

  log(`forwarding ${messages.length} message(s) to OpenRouter (model=${FREE_MODEL})`);

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
      body: JSON.stringify({
        model: FREE_MODEL,
        messages,
        max_tokens: MAX_TOKENS,
        stream: true,
      }),
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
    const role = (entry as Record<string, unknown>).role;
    const content = (entry as Record<string, unknown>).content;
    if (role !== "system" && role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0 || content.length > MAX_MESSAGE_LENGTH) {
      return null;
    }
    sanitized.push({ role, content });
  }
  return sanitized;
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
