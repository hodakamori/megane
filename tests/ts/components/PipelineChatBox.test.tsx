import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

vi.mock("@/ai/client", () => ({
  generatePipeline: vi.fn(),
  extractPipelineJSON: vi.fn(),
}));
vi.mock("@/pipeline/store", () => ({
  usePipelineStore: (selector: (s: { deserialize: () => void; autoLayout: () => void }) => unknown) =>
    selector({ deserialize: vi.fn(), autoLayout: vi.fn() }),
}));
vi.mock("@/stores/usePipelineUIStore", () => ({
  usePipelineUIStore: { getState: () => ({ markPipelineApplied: vi.fn() }) },
}));

import { PipelineChatBox } from "@/components/PipelineChatBox";
import { useAIConfigStore } from "@/ai/config";
import { generatePipeline } from "@/ai/client";

function openConfigPanel() {
  fireEvent.click(screen.getByTitle("AI Settings"));
}

// jsdom does not implement scrollIntoView; the component calls it on every
// message update to keep the chat scrolled to the bottom.
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

beforeEach(() => {
  useAIConfigStore.setState({
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    apiKey: "",
    useOwnKey: false,
  });
});

describe("PipelineChatBox — use-own-key checkbox", () => {
  it("hides the checkbox and BYOK fields and shows the demo notice when no proxy is configured", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "");
    useAIConfigStore.setState({ useOwnKey: false });
    render(<PipelineChatBox />);
    openConfigPanel();

    expect(screen.queryByText("Use my own API key")).toBeNull();
    expect(screen.queryByPlaceholderText(/sk-/)).toBeTruthy();
  });

  it("shows the checkbox and the demo notice (no API key field) when unchecked and a proxy is configured", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "https://proxy.example.com/chat");
    useAIConfigStore.setState({ useOwnKey: false });
    render(<PipelineChatBox />);
    openConfigPanel();

    expect(screen.getByText("Use my own API key")).toBeTruthy();
    expect(screen.queryByPlaceholderText(/sk-/)).toBeNull();
    expect(screen.getByText(/shared proxy/)).toBeTruthy();
  });

  it("reveals provider/model/API key fields when the checkbox is checked", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "https://proxy.example.com/chat");
    useAIConfigStore.setState({ useOwnKey: false });
    render(<PipelineChatBox />);
    openConfigPanel();

    fireEvent.click(screen.getByRole("checkbox"));

    expect(useAIConfigStore.getState().useOwnKey).toBe(true);
    expect(screen.getByPlaceholderText("sk-ant-...")).toBeTruthy();
    expect(screen.queryByText(/shared proxy/)).toBeNull();
  });

  it("does not offer 'demo' as a provider option in the BYOK dropdown", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "https://proxy.example.com/chat");
    useAIConfigStore.setState({ useOwnKey: true });
    render(<PipelineChatBox />);
    openConfigPanel();

    expect(screen.queryByRole("option", { name: /demo/i })).toBeNull();
  });
});

describe("PipelineChatBox — submission", () => {
  beforeEach(() => {
    (generatePipeline as ReturnType<typeof vi.fn>).mockImplementation(
      async (_config, _msg, onChunk: (c: string) => void) => {
        onChunk("partial");
        return "partial";
      },
    );
  });

  it("requires an API key before submitting when using your own key", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "");
    useAIConfigStore.setState({
      provider: "anthropic",
      model: "claude-sonnet-4-20250514",
      apiKey: "",
      useOwnKey: true,
    });
    render(<PipelineChatBox />);

    fireEvent.change(screen.getByPlaceholderText("Describe the pipeline you want..."), {
      target: { value: "build me a pipeline" },
    });
    fireEvent.click(screen.getByText("Generate"));

    expect(screen.getByText("Please set your API key in the config panel.")).toBeTruthy();
    expect(generatePipeline).not.toHaveBeenCalled();
  });

  it("submits without requiring an API key when using the free demo", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "https://proxy.example.com/chat");
    useAIConfigStore.setState({
      provider: "anthropic",
      model: "claude-sonnet-4-20250514",
      apiKey: "",
      useOwnKey: false,
    });
    render(<PipelineChatBox />);

    fireEvent.change(screen.getByPlaceholderText("Describe the pipeline you want..."), {
      target: { value: "build me a pipeline" },
    });
    fireEvent.click(screen.getByText("Generate"));

    expect(screen.queryByText("Please set your API key in the config panel.")).toBeNull();
    expect(generatePipeline).toHaveBeenCalledWith(
      expect.objectContaining({ provider: "demo" }),
      "build me a pipeline",
      expect.any(Function),
      expect.anything(),
    );
  });
});
