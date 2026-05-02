import { describe, it, expect, beforeEach, vi } from "vitest";

const STORAGE_KEY = "megane-ai-config";

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

describe("useAIConfigStore", () => {
  it("uses anthropic defaults when no localStorage entry exists", async () => {
    const { useAIConfigStore } = await import("@/ai/config");
    const state = useAIConfigStore.getState();
    expect(state.provider).toBe("anthropic");
    expect(state.model).toBe("claude-sonnet-4-20250514");
    expect(state.apiKey).toBe("");
  });

  it("loads persisted provider and model from localStorage", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ provider: "openai", model: "gpt-4o" }),
    );
    const { useAIConfigStore } = await import("@/ai/config");
    const state = useAIConfigStore.getState();
    expect(state.provider).toBe("openai");
    expect(state.model).toBe("gpt-4o");
  });

  it("never loads apiKey from localStorage even when present", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ provider: "openai", model: "gpt-4o", apiKey: "sk-leak" }),
    );
    const { useAIConfigStore } = await import("@/ai/config");
    expect(useAIConfigStore.getState().apiKey).toBe("");
  });

  it("falls back to defaults when persisted JSON is malformed", async () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    const { useAIConfigStore } = await import("@/ai/config");
    const state = useAIConfigStore.getState();
    expect(state.provider).toBe("anthropic");
    expect(state.model).toBe("claude-sonnet-4-20250514");
  });

  it("setProvider switches to that provider's first model and persists", async () => {
    const { useAIConfigStore } = await import("@/ai/config");
    useAIConfigStore.getState().setProvider("openai");

    const state = useAIConfigStore.getState();
    expect(state.provider).toBe("openai");
    expect(state.model).toBe("gpt-4o");

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
    expect(persisted.provider).toBe("openai");
    expect(persisted.model).toBe("gpt-4o");
  });

  it("setModel updates and persists the new model", async () => {
    const { useAIConfigStore } = await import("@/ai/config");
    useAIConfigStore.getState().setModel("claude-haiku-4-20250514");

    expect(useAIConfigStore.getState().model).toBe("claude-haiku-4-20250514");
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
    expect(persisted.model).toBe("claude-haiku-4-20250514");
  });

  it("setApiKey updates state but does NOT persist the apiKey", async () => {
    const { useAIConfigStore } = await import("@/ai/config");
    useAIConfigStore.getState().setApiKey("sk-secret");

    expect(useAIConfigStore.getState().apiKey).toBe("sk-secret");
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
    expect(persisted.apiKey).toBeUndefined();
  });
});

describe("PROVIDER_MODELS", () => {
  it("declares both anthropic and openai with non-empty model lists", async () => {
    const { PROVIDER_MODELS } = await import("@/ai/config");
    expect(PROVIDER_MODELS.anthropic.length).toBeGreaterThan(0);
    expect(PROVIDER_MODELS.openai.length).toBeGreaterThan(0);
    for (const model of PROVIDER_MODELS.anthropic) {
      expect(model.value).toBeTruthy();
      expect(model.label).toBeTruthy();
    }
    for (const model of PROVIDER_MODELS.openai) {
      expect(model.value).toBeTruthy();
      expect(model.label).toBeTruthy();
    }
  });
});
