import { describe, it, expect, beforeEach, vi } from "vitest";
import worker from "../src/index";
import {
  isAllowedOrigin,
  corsHeaders,
  sanitizeMessages,
  isRateLimited,
  PER_MINUTE_LIMIT,
  PER_DAY_LIMIT,
  DEFAULT_MODEL,
  DEFAULT_FALLBACK_MODELS,
  buildModelList,
  type Env,
} from "../src/proxy";

const ALLOWED_ORIGIN = "https://hodakamori.github.io";

class FakeKV {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async put(key: string, value: string, _opts?: unknown): Promise<void> {
    this.store.set(key, value);
  }
}

function makeEnv(kv: FakeKV = new FakeKV()): Env {
  return {
    OPENROUTER_API_KEY: "or-test-key",
    ALLOWED_ORIGIN,
    RATE_LIMIT_KV: kv as unknown as Env["RATE_LIMIT_KV"],
  };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

// ─── CORS helpers ────────────────────────────────────────────────────

describe("isAllowedOrigin", () => {
  it("accepts the configured origin", () => {
    expect(isAllowedOrigin(ALLOWED_ORIGIN, makeEnv())).toBe(true);
  });

  it("rejects other origins", () => {
    expect(isAllowedOrigin("https://evil.example", makeEnv())).toBe(false);
  });

  it("rejects a missing origin", () => {
    expect(isAllowedOrigin(null, makeEnv())).toBe(false);
  });
});

describe("corsHeaders", () => {
  it("returns Access-Control headers for the allowed origin", () => {
    const headers = corsHeaders(ALLOWED_ORIGIN, makeEnv());
    expect(headers["Access-Control-Allow-Origin"]).toBe(ALLOWED_ORIGIN);
    expect(headers.Vary).toBe("Origin");
  });

  it("returns no headers for a disallowed origin", () => {
    expect(corsHeaders("https://evil.example", makeEnv())).toEqual({});
  });
});

// ─── Message sanitization ────────────────────────────────────────────

describe("sanitizeMessages", () => {
  it("passes through a well-formed messages array", () => {
    const result = sanitizeMessages({
      messages: [
        { role: "system", content: "You are an assistant." },
        { role: "user", content: "Build me a pipeline." },
      ],
    });
    expect(result).toEqual([
      { role: "system", content: "You are an assistant." },
      { role: "user", content: "Build me a pipeline." },
    ]);
  });

  it("rejects a non-object payload", () => {
    expect(sanitizeMessages("nope")).toBeNull();
    expect(sanitizeMessages(null)).toBeNull();
  });

  it("rejects a missing or empty messages array", () => {
    expect(sanitizeMessages({})).toBeNull();
    expect(sanitizeMessages({ messages: [] })).toBeNull();
    expect(sanitizeMessages({ messages: "not-an-array" })).toBeNull();
  });

  it("rejects more than the maximum number of messages", () => {
    const messages = Array.from({ length: 11 }, () => ({ role: "user", content: "hi" }));
    expect(sanitizeMessages({ messages })).toBeNull();
  });

  it("rejects an unknown role", () => {
    expect(sanitizeMessages({ messages: [{ role: "tool", content: "hi" }] })).toBeNull();
  });

  it("rejects non-string or empty content", () => {
    expect(sanitizeMessages({ messages: [{ role: "user", content: 42 }] })).toBeNull();
    expect(sanitizeMessages({ messages: [{ role: "user", content: "" }] })).toBeNull();
  });

  it("rejects content longer than the maximum length", () => {
    const huge = "x".repeat(8001);
    expect(sanitizeMessages({ messages: [{ role: "user", content: huge }] })).toBeNull();
  });

  it("rejects malformed message entries", () => {
    expect(sanitizeMessages({ messages: [null] })).toBeNull();
    expect(sanitizeMessages({ messages: [{ role: "user" }] })).toBeNull();
  });
});

// ─── Rate limiting ───────────────────────────────────────────────────

describe("isRateLimited", () => {
  it("allows requests under both the per-minute and per-day limits", async () => {
    const env = makeEnv();
    for (let i = 0; i < PER_MINUTE_LIMIT; i++) {
      expect(await isRateLimited("1.2.3.4", env)).toBe(false);
    }
  });

  it("blocks once the per-minute limit is reached", async () => {
    const env = makeEnv();
    for (let i = 0; i < PER_MINUTE_LIMIT; i++) {
      await isRateLimited("1.2.3.4", env);
    }
    expect(await isRateLimited("1.2.3.4", env)).toBe(true);
  });

  it("tracks separate counters per IP", async () => {
    const env = makeEnv();
    for (let i = 0; i < PER_MINUTE_LIMIT; i++) {
      await isRateLimited("1.2.3.4", env);
    }
    expect(await isRateLimited("5.6.7.8", env)).toBe(false);
  });

  it("blocks once the per-day limit is reached even under the per-minute limit", async () => {
    const env = makeEnv();
    const kv = env.RATE_LIMIT_KV as unknown as FakeKV;
    const dayKey = `rl:d:9.9.9.9:${Math.floor(Date.now() / 86_400_000)}`;
    await kv.put(dayKey, String(PER_DAY_LIMIT), {});
    expect(await isRateLimited("9.9.9.9", env)).toBe(true);
  });
});

// ─── fetch handler ───────────────────────────────────────────────────

function makeRequest(init: { method?: string; origin?: string | null; body?: unknown }): Request {
  const headers = new Headers();
  if (init.origin !== undefined && init.origin !== null) headers.set("Origin", init.origin);
  headers.set("CF-Connecting-IP", "1.2.3.4");
  if (init.body !== undefined) headers.set("Content-Type", "application/json");
  return new Request("https://proxy.example/", {
    method: init.method ?? "POST",
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
}

describe("buildModelList", () => {
  it("defaults to the primary model followed by the default fallbacks", () => {
    const list = buildModelList(makeEnv());
    expect(list[0]).toBe(DEFAULT_MODEL);
    expect(list.slice(1)).toEqual(DEFAULT_FALLBACK_MODELS);
  });

  it("puts the OPENROUTER_MODEL override first", () => {
    const list = buildModelList({ ...makeEnv(), OPENROUTER_MODEL: "x/y" });
    expect(list[0]).toBe("x/y");
  });

  it("de-duplicates when the primary also appears in the fallback list", () => {
    const list = buildModelList({
      ...makeEnv(),
      OPENROUTER_MODEL: "a/one",
      OPENROUTER_FALLBACK_MODELS: "a/one, b/two",
    });
    expect(list).toEqual(["a/one", "b/two"]);
  });

  it("ignores blank entries in OPENROUTER_FALLBACK_MODELS", () => {
    const list = buildModelList({
      ...makeEnv(),
      OPENROUTER_MODEL: "p/m",
      OPENROUTER_FALLBACK_MODELS: " , a/one ,, ",
    });
    expect(list).toEqual(["p/m", "a/one"]);
  });

  it("returns only the primary when fallbacks are explicitly empty", () => {
    const list = buildModelList({
      ...makeEnv(),
      OPENROUTER_MODEL: "p/m",
      OPENROUTER_FALLBACK_MODELS: "",
    });
    expect(list).toEqual(["p/m"]);
  });
});

describe("worker fetch handler", () => {
  it("responds to a CORS preflight from the allowed origin", async () => {
    const env = makeEnv();
    const res = await worker.fetch(makeRequest({ method: "OPTIONS", origin: ALLOWED_ORIGIN }), env);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(ALLOWED_ORIGIN);
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("rejects a CORS preflight from a disallowed origin", async () => {
    const env = makeEnv();
    const res = await worker.fetch(
      makeRequest({ method: "OPTIONS", origin: "https://evil.example" }),
      env,
    );
    expect(res.status).toBe(403);
  });

  it("rejects non-POST methods", async () => {
    const env = makeEnv();
    const res = await worker.fetch(makeRequest({ method: "GET", origin: ALLOWED_ORIGIN }), env);
    expect(res.status).toBe(405);
  });

  it("rejects requests from a disallowed origin", async () => {
    const env = makeEnv();
    const res = await worker.fetch(
      makeRequest({ method: "POST", origin: "https://evil.example", body: { messages: [] } }),
      env,
    );
    expect(res.status).toBe(403);
  });

  it("rejects malformed JSON bodies", async () => {
    const env = makeEnv();
    const req = new Request("https://proxy.example/", {
      method: "POST",
      headers: { Origin: ALLOWED_ORIGIN, "CF-Connecting-IP": "1.2.3.4" },
      body: "not json",
    });
    const res = await worker.fetch(req, env);
    expect(res.status).toBe(400);
  });

  it("rejects invalid message payloads", async () => {
    const env = makeEnv();
    const res = await worker.fetch(
      makeRequest({ origin: ALLOWED_ORIGIN, body: { messages: [{ role: "tool", content: "x" }] } }),
      env,
    );
    expect(res.status).toBe(400);
  });

  it("returns 429 once the per-IP rate limit is exceeded", async () => {
    const env = makeEnv();
    const body = { messages: [{ role: "user", content: "hi" }] };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("{}", { status: 200 })),
    );

    for (let i = 0; i < PER_MINUTE_LIMIT; i++) {
      await worker.fetch(makeRequest({ origin: ALLOWED_ORIGIN, body }), env);
    }
    const res = await worker.fetch(makeRequest({ origin: ALLOWED_ORIGIN, body }), env);
    expect(res.status).toBe(429);
  });

  it("forwards sanitized messages to OpenRouter and streams the response back", async () => {
    const env = makeEnv();
    const upstreamBody = "data: hello\n\n";
    const fetchMock = vi.fn(async (url: string, init: RequestInit) => {
      expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
      const sentBody = JSON.parse(init.body as string);
      expect(sentBody.models[0]).toBe(DEFAULT_MODEL);
      expect(sentBody.models.length).toBeGreaterThan(1);
      expect(sentBody.model).toBeUndefined();
      expect(sentBody.stream).toBe(true);
      expect(sentBody.messages).toEqual([{ role: "user", content: "hi" }]);
      const headers = init.headers as Record<string, string>;
      expect(headers.Authorization).toBe(`Bearer ${env.OPENROUTER_API_KEY}`);
      return new Response(upstreamBody, { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await worker.fetch(
      makeRequest({ origin: ALLOWED_ORIGIN, body: { messages: [{ role: "user", content: "hi" }] } }),
      env,
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(ALLOWED_ORIGIN);
    expect(await res.text()).toBe(upstreamBody);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("uses the OPENROUTER_MODEL override as the primary model", async () => {
    const env = { ...makeEnv(), OPENROUTER_MODEL: "anthropic/claude-3.5-sonnet" };
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      const sentBody = JSON.parse(init.body as string);
      expect(sentBody.models[0]).toBe("anthropic/claude-3.5-sonnet");
      return new Response("data: ok\n\n", { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await worker.fetch(
      makeRequest({ origin: ALLOWED_ORIGIN, body: { messages: [{ role: "user", content: "hi" }] } }),
      env,
    );

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("sends only the configured fallback models when OPENROUTER_FALLBACK_MODELS is set", async () => {
    const env = {
      ...makeEnv(),
      OPENROUTER_MODEL: "primary/model",
      OPENROUTER_FALLBACK_MODELS: "a/one, b/two",
    };
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      const sentBody = JSON.parse(init.body as string);
      expect(sentBody.models).toEqual(["primary/model", "a/one", "b/two"]);
      return new Response("data: ok\n\n", { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await worker.fetch(
      makeRequest({ origin: ALLOWED_ORIGIN, body: { messages: [{ role: "user", content: "hi" }] } }),
      env,
    );

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("propagates upstream errors as JSON", async () => {
    const env = makeEnv();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 503 })),
    );

    const res = await worker.fetch(
      makeRequest({ origin: ALLOWED_ORIGIN, body: { messages: [{ role: "user", content: "hi" }] } }),
      env,
    );

    expect(res.status).toBe(503);
    const json = (await res.json()) as { error: string };
    expect(json.error).toContain("boom");
  });
});
