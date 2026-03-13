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
  executeSkill,
  type PipelineSkill,
  type ToolDefinition,
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

  if (config.provider === "anthropic") {
    const skills = getSkills();
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
  } else {
    return streamOpenAI(config, systemPrompt, userMessage, onChunk, signal);
  }
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
      const errBody = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errBody}`);
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

// ─── OpenAI (unchanged) ─────────────────────────────────────────────

async function streamOpenAI(
  config: AIConfig,
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${body}`);
  }

  return readSSE(response, (_event, data) => {
    if (data === "[DONE]") return null;
    try {
      const parsed = JSON.parse(data);
      const text = parsed.choices?.[0]?.delta?.content;
      if (text) {
        onChunk(text);
        return text;
      }
    } catch {
      // skip unparseable lines
    }
    return null;
  });
}

// ─── Shared SSE reader (used by OpenAI path) ────────────────────────

async function readSSE(
  response: Response,
  handler: (event: string, data: string) => string | null,
): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";
  let buffer = "";
  let currentEvent = "";

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
        const text = handler(currentEvent, data);
        if (text) accumulated += text;
      } else if (line === "") {
        currentEvent = "";
      }
    }
  }

  return accumulated;
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
