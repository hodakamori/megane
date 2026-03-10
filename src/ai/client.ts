/**
 * LLM API client for pipeline generation.
 * Supports Anthropic and OpenAI APIs with streaming.
 */

import type { AIConfig } from "./config";
import type { SerializedPipeline } from "../pipeline/types";
import { buildSystemPrompt } from "./prompt";

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
    return streamAnthropic(config, systemPrompt, userMessage, onChunk, signal);
  } else {
    return streamOpenAI(config, systemPrompt, userMessage, onChunk, signal);
  }
}

async function streamAnthropic(
  config: AIConfig,
  systemPrompt: string,
  userMessage: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${body}`);
  }

  return readSSE(response, (event, data) => {
    if (event === "content_block_delta") {
      const parsed = JSON.parse(data);
      const text = parsed.delta?.text;
      if (text) {
        onChunk(text);
        return text;
      }
    }
    return null;
  });
}

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

/**
 * Read Server-Sent Events from a streaming response.
 * Calls handler for each event; handler returns text to accumulate or null.
 */
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
