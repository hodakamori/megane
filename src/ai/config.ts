/**
 * AI configuration store with localStorage persistence.
 * Manages provider, model, and API key settings.
 */

import { create } from "zustand";

export type AIProvider = "anthropic" | "openai" | "demo";

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

export const PROVIDER_MODELS: Record<AIProvider, { value: string; label: string }[]> = {
  anthropic: [
    { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
    { value: "claude-haiku-4-20250514", label: "Claude Haiku 4" },
  ],
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  ],
  demo: [{ value: "demo", label: "Free Demo (no API key needed)" }],
};

/**
 * The "demo" provider proxies through a Cloudflare Worker that holds its
 * own server-side API key, so it never needs one from the user.
 */
export function providerRequiresApiKey(provider: AIProvider): boolean {
  return provider !== "demo";
}

/**
 * The demo provider is only usable when the proxy URL was injected at
 * build time (currently only the docs demo build sets this).
 */
export function isDemoProviderAvailable(): boolean {
  return Boolean(import.meta.env.VITE_LLM_PROXY_URL);
}

const STORAGE_KEY = "megane-ai-config";

function loadConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        provider: parsed.provider ?? "anthropic",
        model: parsed.model ?? "claude-sonnet-4-20250514",
        apiKey: "",
      };
    }
  } catch {
    // ignore parse errors
  }
  return { provider: "anthropic", model: "claude-sonnet-4-20250514", apiKey: "" };
}

function saveConfig(config: AIConfig) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      provider: config.provider,
      model: config.model,
    }),
  );
}

interface AIConfigStore extends AIConfig {
  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  setApiKey: (apiKey: string) => void;
}

export const useAIConfigStore = create<AIConfigStore>((set, get) => ({
  ...loadConfig(),

  setProvider: (provider) => {
    const defaultModel = PROVIDER_MODELS[provider][0].value;
    set({ provider, model: defaultModel });
    saveConfig({ ...get(), provider, model: defaultModel });
  },

  setModel: (model) => {
    set({ model });
    saveConfig({ ...get(), model });
  },

  setApiKey: (apiKey) => {
    set({ apiKey });
    saveConfig({ ...get(), apiKey });
  },
}));
