import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("@/ai/skillLoader", () => ({
  getSkills: vi.fn(() => []),
  buildToolDefinitions: vi.fn(() => []),
  executeSkill: vi.fn((_skills: unknown, name: string) =>
    name === "known_skill" ? "skill content" : null,
  ),
}));

import { extractPipelineJSON, generatePipeline } from "@/ai/client";
import type { AIConfig } from "@/ai/config";

type SSEEvent = { event: string; data: unknown };

function makeSSEResponse(events: SSEEvent[], status = 200): Response {
  const encoder = new TextEncoder();
  const text = events
    .map((e) => {
      const data = typeof e.data === "string" ? e.data : JSON.stringify(e.data);
      return `event: ${e.event}\ndata: ${data}\n\n`;
    })
    .join("");
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
  return new Response(stream, { status });
}

function makeJSONResponse(body: unknown, status = 200): Response {
  const encoder = new TextEncoder();
  const text = typeof body === "string" ? body : JSON.stringify(body);
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
  return new Response(stream, { status });
}

const ANTHROPIC_CONFIG: AIConfig = {
  provider: "anthropic",
  model: "claude-sonnet-4-20250514",
  apiKey: "sk-test",
};

const OPENAI_CONFIG: AIConfig = {
  provider: "openai",
  model: "gpt-4o",
  apiKey: "sk-test",
};

const MINIMAL_PIPELINE_JSON = JSON.stringify({
  version: 3,
  nodes: [{ id: "v1", type: "viewport", position: { x: 0, y: 0 } }],
  edges: [],
});

describe("extractPipelineJSON", () => {
  it("parses a fenced ```json block", () => {
    const result = extractPipelineJSON(`Here you go:\n\`\`\`json\n${MINIMAL_PIPELINE_JSON}\n\`\`\``);
    expect(result.version).toBe(3);
    expect(result.nodes).toHaveLength(1);
  });

  it("parses a fenced ``` block with no language tag", () => {
    const result = extractPipelineJSON(`\`\`\`\n${MINIMAL_PIPELINE_JSON}\n\`\`\``);
    expect(result.version).toBe(3);
  });

  it("parses raw JSON between the first { and last } when no fence is present", () => {
    const result = extractPipelineJSON(`prefix ${MINIMAL_PIPELINE_JSON} suffix`);
    expect(result.version).toBe(3);
  });

  it("throws when no JSON-like content is found", () => {
    expect(() => extractPipelineJSON("no json here")).toThrow(/No JSON found/);
  });

  it("throws when the JSON is malformed", () => {
    expect(() => extractPipelineJSON("```json\n{ not json }\n```")).toThrow(
      /Failed to parse JSON/,
    );
  });

  it("throws when version is not 3", () => {
    const wrong = JSON.stringify({ version: 2, nodes: [], edges: [] });
    expect(() => extractPipelineJSON(`\`\`\`json\n${wrong}\n\`\`\``)).toThrow(
      /Unexpected pipeline version/,
    );
  });

  it("throws when nodes or edges are missing", () => {
    const noNodes = JSON.stringify({ version: 3, edges: [] });
    expect(() => extractPipelineJSON(`\`\`\`json\n${noNodes}\n\`\`\``)).toThrow(
      /Invalid pipeline/,
    );

    const noEdges = JSON.stringify({ version: 3, nodes: [] });
    expect(() => extractPipelineJSON(`\`\`\`json\n${noEdges}\n\`\`\``)).toThrow(
      /Invalid pipeline/,
    );
  });
});

describe("generatePipeline (Anthropic)", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("streams text deltas via onChunk and returns the concatenated text", async () => {
    fetchMock.mockResolvedValueOnce(
      makeSSEResponse([
        { event: "content_block_delta", data: { delta: { type: "text_delta", text: "hello " } } },
        { event: "content_block_delta", data: { delta: { type: "text_delta", text: "world" } } },
        { event: "message_delta", data: { delta: { stop_reason: "end_turn" } } },
      ]),
    );

    const chunks: string[] = [];
    const result = await generatePipeline(ANTHROPIC_CONFIG, "user msg", (c) => chunks.push(c));

    expect(chunks).toEqual(["hello ", "world"]);
    expect(result).toBe("hello world");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.anthropic.com/v1/messages");
  });

  it("sets the required Anthropic headers", async () => {
    fetchMock.mockResolvedValueOnce(
      makeSSEResponse([
        { event: "message_delta", data: { delta: { stop_reason: "end_turn" } } },
      ]),
    );

    await generatePipeline(ANTHROPIC_CONFIG, "msg", () => {});

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers["x-api-key"]).toBe("sk-test");
    expect(headers["anthropic-version"]).toBe("2023-06-01");
    expect(headers["content-type"]).toBe("application/json");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("claude-sonnet-4-20250514");
    expect(body.stream).toBe(true);
    expect(body.system).toContain("Megane");
  });

  it("performs a tool-use round trip when stop_reason is tool_use", async () => {
    const { buildToolDefinitions } = await import("@/ai/skillLoader");
    (buildToolDefinitions as ReturnType<typeof vi.fn>).mockReturnValueOnce([
      { name: "known_skill", description: "x", input_schema: { type: "object", properties: {} } },
    ]);

    // First response: tool_use
    fetchMock.mockResolvedValueOnce(
      makeSSEResponse([
        {
          event: "content_block_start",
          data: { content_block: { type: "tool_use", id: "tu_1", name: "known_skill" } },
        },
        {
          event: "content_block_delta",
          data: { delta: { type: "input_json_delta", partial_json: "" } },
        },
        { event: "content_block_stop", data: {} },
        { event: "message_delta", data: { delta: { stop_reason: "tool_use" } } },
      ]),
    );
    // Second response: end_turn with text
    fetchMock.mockResolvedValueOnce(
      makeSSEResponse([
        { event: "content_block_delta", data: { delta: { type: "text_delta", text: "done" } } },
        { event: "message_delta", data: { delta: { stop_reason: "end_turn" } } },
      ]),
    );

    const result = await generatePipeline(ANTHROPIC_CONFIG, "msg", () => {});
    expect(result).toBe("done");
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // The second request body should include the assistant tool_use and a user tool_result.
    const secondBody = JSON.parse(
      (fetchMock.mock.calls[1][1] as RequestInit).body as string,
    );
    expect(Array.isArray(secondBody.messages)).toBe(true);
    const lastTwo = secondBody.messages.slice(-2);
    expect(lastTwo[0].role).toBe("assistant");
    expect(
      (lastTwo[0].content as { type: string }[]).some((c) => c.type === "tool_use"),
    ).toBe(true);
    expect(lastTwo[1].role).toBe("user");
    const toolResult = (lastTwo[1].content as { type: string; content: string }[])[0];
    expect(toolResult.type).toBe("tool_result");
    expect(toolResult.content).toBe("skill content");
  });

  it("throws when the API returns a non-OK status", async () => {
    fetchMock.mockResolvedValueOnce(makeJSONResponse("rate limited", 429));
    await expect(
      generatePipeline(ANTHROPIC_CONFIG, "msg", () => {}),
    ).rejects.toThrow(/Anthropic API error \(429\)/);
  });
});

describe("generatePipeline (OpenAI)", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("streams content deltas and returns concatenated text", async () => {
    fetchMock.mockResolvedValueOnce(
      makeSSEResponse([
        { event: "", data: { choices: [{ delta: { content: "hi " } }] } },
        { event: "", data: { choices: [{ delta: { content: "there" } }] } },
        { event: "", data: "[DONE]" },
      ]),
    );

    const chunks: string[] = [];
    const result = await generatePipeline(OPENAI_CONFIG, "msg", (c) => chunks.push(c));
    expect(chunks).toEqual(["hi ", "there"]);
    expect(result).toBe("hi there");
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.openai.com/v1/chat/completions");
  });

  it("sets the OpenAI Authorization header and body", async () => {
    fetchMock.mockResolvedValueOnce(
      makeSSEResponse([{ event: "", data: "[DONE]" }]),
    );
    await generatePipeline(OPENAI_CONFIG, "msg", () => {});

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer sk-test");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("gpt-4o");
    expect(body.stream).toBe(true);
    expect(body.messages[0].role).toBe("system");
    expect(body.messages[1].role).toBe("user");
    expect(body.messages[1].content).toBe("msg");
  });

  it("ignores unparseable SSE data lines", async () => {
    fetchMock.mockResolvedValueOnce(
      makeSSEResponse([
        { event: "", data: "not json" },
        { event: "", data: { choices: [{ delta: { content: "ok" } }] } },
        { event: "", data: "[DONE]" },
      ]),
    );
    const result = await generatePipeline(OPENAI_CONFIG, "msg", () => {});
    expect(result).toBe("ok");
  });

  it("throws when OpenAI returns a non-OK status", async () => {
    fetchMock.mockResolvedValueOnce(makeJSONResponse("bad request", 400));
    await expect(generatePipeline(OPENAI_CONFIG, "msg", () => {})).rejects.toThrow(
      /OpenAI API error \(400\)/,
    );
  });
});
