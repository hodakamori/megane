/**
 * Live LLM providers for the benchmark.
 *
 * These mirror the production request shapes in `src/ai/client.ts` (same system
 * prompt via `buildSystemPrompt`, same on-demand skill tool round trips) but
 * use non-streaming requests for simplicity — the benchmark only needs the
 * final text. Supports Anthropic, OpenAI, and the demo proxy.
 *
 * API credentials come from the environment:
 *   - ANTHROPIC_API_KEY  (provider "anthropic")
 *   - OPENAI_API_KEY     (provider "openai")
 *   - MEGANE_LLM_PROXY_URL (provider "demo")
 */

import { buildSystemPrompt } from "@/ai/prompt";
import {
  buildOpenAITools,
  buildToolDefinitions,
  executeSkill,
  loadSkills,
  type BenchSkill,
} from "./skills";

export type ProviderName = "anthropic" | "openai" | "demo";

export interface ProviderConfig {
  provider: ProviderName;
  /** Model id; ignored for the demo proxy (it picks server-side). */
  model: string;
  /** API key (anthropic/openai). */
  apiKey?: string;
  /** Demo proxy URL. */
  proxyUrl?: string;
}

/** Pluggable fetch (defaults to global fetch) — lets tests inject a stub. */
export type FetchLike = typeof fetch;

const MAX_TOOL_ROUNDS = 4;

/** Resolve a provider config from environment variables. */
export function configFromEnv(
  env: Record<string, string | undefined> = process.env,
): ProviderConfig {
  const provider = (env.MEGANE_LLM_PROVIDER as ProviderName) || "anthropic";
  if (provider === "anthropic") {
    return {
      provider,
      model: env.MEGANE_LLM_MODEL || "claude-sonnet-4-20250514",
      apiKey: env.ANTHROPIC_API_KEY,
    };
  }
  if (provider === "openai") {
    return {
      provider,
      model: env.MEGANE_LLM_MODEL || "gpt-4o",
      apiKey: env.OPENAI_API_KEY,
    };
  }
  return { provider: "demo", model: "demo", proxyUrl: env.MEGANE_LLM_PROXY_URL };
}

/** Throw a clear error if the config is missing required credentials. */
export function assertConfig(config: ProviderConfig): void {
  if (config.provider === "anthropic" && !config.apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  if (config.provider === "openai" && !config.apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  if (config.provider === "demo" && !config.proxyUrl) {
    throw new Error("MEGANE_LLM_PROXY_URL is not set");
  }
}

/**
 * Generate a pipeline response for one prompt. Returns the full model text
 * (JSON code block + trailing explanation), ready to hand to the scorer.
 */
export async function generatePipelineLive(
  config: ProviderConfig,
  userMessage: string,
  fetchImpl: FetchLike = fetch,
): Promise<string> {
  const system = buildSystemPrompt();
  const skills = loadSkills();
  if (config.provider === "anthropic") {
    return runAnthropic(config, system, userMessage, skills, fetchImpl);
  }
  return runOpenAICompat(config, system, userMessage, skills, fetchImpl);
}

// ─── Anthropic ────────────────────────────────────────────────────────

interface AnthropicContentBlock {
  type: string;
  text?: string;
  id?: string;
  name?: string;
  input?: unknown;
}

async function runAnthropic(
  config: ProviderConfig,
  system: string,
  userMessage: string,
  skills: BenchSkill[],
  fetchImpl: FetchLike,
): Promise<string> {
  const tools = buildToolDefinitions(skills);
  const messages: Array<{ role: string; content: unknown }> = [
    { role: "user", content: userMessage },
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const body: Record<string, unknown> = {
      model: config.model,
      max_tokens: 4096,
      system,
      messages,
    };
    if (tools.length > 0) body.tools = tools;

    const res = await fetchImpl("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": config.apiKey ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`Anthropic request failed (${res.status}): ${await res.text()}`);
    }

    const data = (await res.json()) as {
      content: AnthropicContentBlock[];
      stop_reason: string;
    };
    const text = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text ?? "")
      .join("");

    if (data.stop_reason !== "tool_use") return text;

    // Echo assistant content, answer each tool_use with the skill body.
    messages.push({ role: "assistant", content: data.content });
    const toolResults = data.content
      .filter((b) => b.type === "tool_use")
      .map((b) => ({
        type: "tool_result",
        tool_use_id: b.id,
        content: executeSkill(skills, b.name ?? "") ?? `Unknown skill: ${b.name}`,
      }));
    messages.push({ role: "user", content: toolResults });
  }

  throw new Error("Too many tool-use rounds");
}

// ─── OpenAI-compatible (OpenAI + demo proxy) ──────────────────────────

interface OpenAIToolCall {
  id: string;
  function: { name: string; arguments: string };
}

interface OpenAIMessage {
  role: string;
  content: string | null;
  tool_calls?: OpenAIToolCall[];
  tool_call_id?: string;
}

async function runOpenAICompat(
  config: ProviderConfig,
  system: string,
  userMessage: string,
  skills: BenchSkill[],
  fetchImpl: FetchLike,
): Promise<string> {
  const tools = buildOpenAITools(skills);
  const messages: OpenAIMessage[] = [
    { role: "system", content: system },
    { role: "user", content: userMessage },
  ];
  const isDemo = config.provider === "demo";
  const url = isDemo ? config.proxyUrl! : "https://api.openai.com/v1/chat/completions";

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const body: Record<string, unknown> = { messages };
    if (!isDemo) body.model = config.model;
    if (tools.length > 0) body.tools = tools;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (!isDemo) headers.Authorization = `Bearer ${config.apiKey ?? ""}`;

    const res = await fetchImpl(url, { method: "POST", headers, body: JSON.stringify(body) });
    if (!res.ok) {
      throw new Error(`${config.provider} request failed (${res.status}): ${await res.text()}`);
    }

    const data = (await res.json()) as {
      choices: Array<{ message: OpenAIMessage; finish_reason: string }>;
    };
    const choice = data.choices[0];
    const msg = choice.message;

    if (choice.finish_reason !== "tool_calls" || !msg.tool_calls?.length) {
      return msg.content ?? "";
    }

    messages.push({ role: "assistant", content: msg.content ?? null, tool_calls: msg.tool_calls });
    for (const tc of msg.tool_calls) {
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: executeSkill(skills, tc.function.name) ?? `Unknown skill: ${tc.function.name}`,
      });
    }
  }

  throw new Error("Too many tool-use rounds");
}
