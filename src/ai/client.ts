/**
 * LLM API client for pipeline generation.
 * Supports Anthropic (with tool_use for skills) and OpenAI APIs with streaming.
 */

import type { AIConfig } from "./config";
import type { SerializedPipeline } from "../pipeline/types";
import { buildSystemPrompt } from "./prompt";
import {
  getSkills,
  buildToolDefinitions,
  buildOpenAITools,
  executeSkill,
  type PipelineSkill,
  type ToolDefinition,
  type OpenAITool,
} from "./skillLoader";

// ─── Types for Anthropic SSE parsing ─────────────────────────────────

interface ToolUseAccumulator {
  id: string;
  name: string;
  inputJson: string;
}

interface AnthropicStreamResult {
  text: string;
  stopReason: string;
  toolUses: ToolUseAccumulator[];
}

// ─── Public API ──────────────────────────────────────────────────────

/**
 * Generate a pipeline by calling the LLM API with streaming.
 * Returns the full response text.
 */
export async function generatePipeline(
  config: AIConfig,
  userMessage: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const systemPrompt = buildSystemPrompt();
  const skills = getSkills();

  if (config.provider === "anthropic") {
    const tools = buildToolDefinitions(skills);
    return streamAnthropicWithSkills(
      config,
      systemPrompt,
      userMessage,
      skills,
      tools,
      onChunk,
      signal,
    );
  }

  // OpenAI-compatible providers (and the OpenRouter-backed demo proxy)
  // speak the OpenAI tool-calling protocol, so the model fetches skill
  // templates on demand via function calls — the same on-demand behaviour
  // as the Anthropic path, no inlining required.
  const tools = buildOpenAITools(skills);

  if (config.provider === "demo") {
    return streamDemoProxy(systemPrompt, userMessage, skills, tools, onChunk, signal);
  }
  return streamOpenAI(config, systemPrompt, userMessage, skills, tools, onChunk, signal);
}

// ─── Anthropic with tool_use ─────────────────────────────────────────

/**
 * Stream an Anthropic API call, handling tool_use for skills.
 * If Claude calls a skill tool, we execute it locally and send
 * the result back in a follow-up request.
 */
async function streamAnthropicWithSkills(
  config: AIConfig,
  systemPrompt: string,
  userMessage: string,
  skills: PipelineSkill[],
  tools: ToolDefinition[],
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  type Message = { role: string; content: unknown };
  const messages: Message[] = [{ role: "user", content: userMessage }];

  // Allow up to 3 tool-use round trips to prevent infinite loops
  for (let turn = 0; turn < 4; turn++) {
    const body: Record<string, unknown> = {
      model: config.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
      stream: true,
    };

    // Only include tools if we have skills defined
    if (tools.length > 0) {
      body.tools = tools;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      await response.text(); // consume body so the connection is released
      throw new Error("Request failed. Please try again.");
    }

    const result = await readAnthropicSSE(response, onChunk);

    // If the model stopped with end_turn (text response), we're done
    if (result.stopReason !== "tool_use") {
      return result.text;
    }

    // Model wants to use tools — build the assistant message content blocks
    const assistantContent: unknown[] = [];
    if (result.text) {
      assistantContent.push({ type: "text", text: result.text });
    }
    for (const tu of result.toolUses) {
      let parsedInput = {};
      try {
        if (tu.inputJson) {
          parsedInput = JSON.parse(tu.inputJson);
        }
      } catch {
        // empty input is fine for skills with no parameters
      }
      assistantContent.push({
        type: "tool_use",
        id: tu.id,
        name: tu.name,
        input: parsedInput,
      });
    }
    messages.push({ role: "assistant", content: assistantContent });

    // Execute each tool and build tool_result messages
    const toolResults: unknown[] = [];
    for (const tu of result.toolUses) {
      const skillResult = executeSkill(skills, tu.name);
      toolResults.push({
        type: "tool_result",
        tool_use_id: tu.id,
        content: skillResult ?? `Unknown skill: ${tu.name}`,
      });
    }
    messages.push({ role: "user", content: toolResults });
  }

  throw new Error("Too many tool-use rounds. Please try again.");
}

/**
 * Read Anthropic SSE stream, tracking both text deltas and tool_use blocks.
 */
async function readAnthropicSSE(
  response: Response,
  onChunk: (text: string) => void,
): Promise<AnthropicStreamResult> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent = "";

  let text = "";
  let stopReason = "end_turn";
  const toolUses: ToolUseAccumulator[] = [];
  let activeToolUse: ToolUseAccumulator | null = null;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop()!;

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith("data: ")) {
        const data = line.slice(6);
        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(data);
        } catch {
          continue;
        }

        if (currentEvent === "content_block_start") {
          const block = parsed.content_block as Record<string, unknown> | undefined;
          if (block?.type === "tool_use") {
            activeToolUse = {
              id: block.id as string,
              name: block.name as string,
              inputJson: "",
            };
            toolUses.push(activeToolUse);
          }
        } else if (currentEvent === "content_block_delta") {
          const delta = parsed.delta as Record<string, unknown> | undefined;
          if (delta?.type === "text_delta") {
            const chunk = delta.text as string;
            text += chunk;
            onChunk(chunk);
          } else if (delta?.type === "input_json_delta" && activeToolUse) {
            activeToolUse.inputJson += delta.partial_json as string;
          }
        } else if (currentEvent === "content_block_stop") {
          activeToolUse = null;
        } else if (currentEvent === "message_delta") {
          const delta = parsed.delta as Record<string, unknown> | undefined;
          if (delta?.stop_reason) {
            stopReason = delta.stop_reason as string;
          }
        }
      } else if (line === "") {
        currentEvent = "";
      }
    }
  }

  return { text, stopReason, toolUses };
}

// ─── OpenAI-compatible tool calling (OpenAI API + demo proxy) ────────

interface OpenAIToolCallAccumulator {
  index: number;
  id: string;
  name: string;
  argsJson: string;
}

interface OpenAIStreamResult {
  text: string;
  finishReason: string;
  toolCalls: OpenAIToolCallAccumulator[];
}

/** Sends one request body and returns the raw streaming Response. */
type OpenAISender = (body: Record<string, unknown>, signal?: AbortSignal) => Promise<Response>;

interface OpenAIChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: unknown;
  tool_call_id?: string;
}

/**
 * Drive an OpenAI-compatible chat completion with the skill functions,
 * handling the tool-call round trip: when the model emits tool_calls we
 * run each skill locally and feed the result back, just like the Anthropic
 * path. `model` is omitted for the demo proxy, which picks it server-side.
 */
async function streamOpenAICompatWithSkills(
  send: OpenAISender,
  model: string | undefined,
  systemPrompt: string,
  userMessage: string,
  skills: PipelineSkill[],
  tools: OpenAITool[],
  onChunk: (text: string) => void,
  errorLabel: string,
  signal?: AbortSignal,
): Promise<string> {
  const messages: OpenAIChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  // Allow up to 3 tool-call round trips to prevent infinite loops.
  for (let turn = 0; turn < 4; turn++) {
    const body: Record<string, unknown> = { messages, stream: true };
    if (model) body.model = model;
    if (tools.length > 0) body.tools = tools;

    const response = await send(body, signal);
    if (!response.ok) {
      await response.text(); // consume body so the connection is released
      throw new Error("Request failed. Please try again.");
    }

    const result = await readOpenAISSE(response, onChunk);

    if (result.finishReason !== "tool_calls" || result.toolCalls.length === 0) {
      return result.text;
    }

    // Echo the assistant's tool_calls back, then answer each one.
    messages.push({
      role: "assistant",
      content: result.text || null,
      tool_calls: result.toolCalls.map((tc) => ({
        id: tc.id,
        type: "function",
        function: { name: tc.name, arguments: tc.argsJson || "{}" },
      })),
    });

    for (const tc of result.toolCalls) {
      const skillResult = executeSkill(skills, tc.name);
      messages.push({
        role: "tool",
        tool_call_id: tc.id,
        content: skillResult ?? `Unknown skill: ${tc.name}`,
      });
    }
  }

  throw new Error("Too many tool-use rounds. Please try again.");
}

/**
 * Read an OpenAI-compatible SSE stream, accumulating text deltas and any
 * streamed tool_calls (whose `arguments` arrive as fragments keyed by index).
 */
async function readOpenAISSE(
  response: Response,
  onChunk: (text: string) => void,
): Promise<OpenAIStreamResult> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let finishReason = "stop";
  const toolCallsByIndex = new Map<number, OpenAIToolCallAccumulator>();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop()!;

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") continue;

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(data);
      } catch {
        continue;
      }

      const choice = (parsed.choices as Array<Record<string, unknown>> | undefined)?.[0];
      if (!choice) continue;

      const delta = choice.delta as Record<string, unknown> | undefined;
      if (typeof delta?.content === "string" && delta.content) {
        text += delta.content;
        onChunk(delta.content);
      }

      const deltaToolCalls = delta?.tool_calls as Array<Record<string, unknown>> | undefined;
      if (deltaToolCalls) {
        for (const tc of deltaToolCalls) {
          const idx = typeof tc.index === "number" ? tc.index : 0;
          let acc = toolCallsByIndex.get(idx);
          if (!acc) {
            acc = { index: idx, id: "", name: "", argsJson: "" };
            toolCallsByIndex.set(idx, acc);
          }
          if (typeof tc.id === "string") acc.id = tc.id;
          const fn = tc.function as Record<string, unknown> | undefined;
          if (typeof fn?.name === "string") acc.name += fn.name;
          if (typeof fn?.arguments === "string") acc.argsJson += fn.arguments;
        }
      }

      if (typeof choice.finish_reason === "string") {
        finishReason = choice.finish_reason;
      }
    }
  }

  const toolCalls = [...toolCallsByIndex.values()].sort((a, b) => a.index - b.index);
  return { text, finishReason, toolCalls };
}

async function streamOpenAI(
  config: AIConfig,
  systemPrompt: string,
  userMessage: string,
  skills: PipelineSkill[],
  tools: OpenAITool[],
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  return streamOpenAICompatWithSkills(
    (body, sig) =>
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: sig,
      }),
    config.model,
    systemPrompt,
    userMessage,
    skills,
    tools,
    onChunk,
    "OpenAI API error",
    signal,
  );
}

// ─── Demo proxy (no API key required) ────────────────────────────────

/**
 * Stream a chat completion through the docs-demo Cloudflare Worker proxy.
 * The proxy holds its own OpenRouter API key, picks the model server-side,
 * and speaks the OpenAI tool-calling protocol, so the same skill round
 * trip works end to end.
 */
async function streamDemoProxy(
  systemPrompt: string,
  userMessage: string,
  skills: PipelineSkill[],
  tools: OpenAITool[],
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const proxyUrl = import.meta.env.VITE_LLM_PROXY_URL;
  if (!proxyUrl) {
    throw new Error("The free demo is not available in this build.");
  }

  return streamOpenAICompatWithSkills(
    (body, sig) =>
      fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: sig,
      }),
    undefined, // the proxy chooses the model server-side
    systemPrompt,
    userMessage,
    skills,
    tools,
    onChunk,
    "Demo proxy error",
    signal,
  );
}

// ─── Action summary ──────────────────────────────────────────────────

/** Returns a brief user-facing description of the applied pipeline. */
export function formatActionSummary(nodeCount: number): string {
  const noun = nodeCount === 1 ? "node" : "nodes";
  return `Pipeline applied — ${nodeCount} ${noun} added to the editor.`;
}

/**
 * Strip the pipeline JSON (a fenced ```` ```json ```` block, or a raw `{...}`
 * object) from an LLM response, returning just the surrounding natural-language
 * text. Used to show the assistant's explanation in the chat without the
 * machine-readable payload. The system prompt instructs the model to put its
 * one-sentence explanation before the JSON, so cutting at the first code-fence
 * or brace yields that explanation.
 */
export function stripPipelineJSON(text: string): string {
  const fence = text.indexOf("```");
  const brace = text.indexOf("{");
  const markers = [fence, brace].filter((i) => i !== -1);
  if (markers.length === 0) return text.trim();
  return text.slice(0, Math.min(...markers)).trim();
}

// ─── JSON extraction ─────────────────────────────────────────────────

/**
 * Extract a SerializedPipeline JSON from the LLM response text.
 * Looks for ```json ... ``` fenced blocks, falls back to raw JSON extraction.
 */
export function extractPipelineJSON(response: string): SerializedPipeline {
  // Try fenced code block first
  const fenceMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  let jsonStr: string;

  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  } else {
    // Fallback: find first { to last }
    const start = response.indexOf("{");
    const end = response.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("No JSON found in the response. Please try again.");
    }
    jsonStr = response.slice(start, end + 1);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${(e as Error).message}`);
  }

  const pipeline = parsed as SerializedPipeline;
  if (pipeline.version !== 3) {
    throw new Error(`Unexpected pipeline version: ${pipeline.version}`);
  }
  if (!Array.isArray(pipeline.nodes) || !Array.isArray(pipeline.edges)) {
    throw new Error("Invalid pipeline: missing nodes or edges array.");
  }

  return pipeline;
}
