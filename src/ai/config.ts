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

/**
 * Default to the no-setup-required demo proxy when this build has one
 * configured (currently only the docs demo); otherwise fall back to
 * Anthropic, which still requires the user to bring their own key.
 */
function defaultProviderAndModel(): { provider: AIProvider; model: string } {
  const provider: AIProvider = isDemoProviderAvailable() ? "demo" : "anthropic";
  return { provider, model: PROVIDER_MODELS[provider][0].value };
}

function loadConfig(): AIConfig {
  const fallback = defaultProviderAndModel();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        provider: parsed.provider ?? fallback.provider,
        model: parsed.model ?? fallback.model,
        apiKey: "",
      };
    }
  } catch {
    // ignore parse errors
  }
  return { ...fallback, apiKey: "" };
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
