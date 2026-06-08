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
  useAIConfigStore.setState({ provider: "anthropic", model: "claude-sonnet-4-20250514", apiKey: "" });
});

describe("PipelineChatBox — provider selection", () => {
  it("hides the Free Demo option when no proxy URL is configured for this build", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "");
    render(<PipelineChatBox />);
    openConfigPanel();

    expect(screen.queryByRole("option", { name: "Free Demo" })).toBeNull();
  });

  it("shows the Free Demo option when a proxy URL is configured for this build", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "https://proxy.example.com/chat");
    render(<PipelineChatBox />);
    openConfigPanel();

    expect(screen.getByRole("option", { name: "Free Demo" })).toBeTruthy();
  });

  it("hides the API key field and shows a notice when the demo provider is selected", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "https://proxy.example.com/chat");
    useAIConfigStore.setState({ provider: "demo", model: "demo", apiKey: "" });
    render(<PipelineChatBox />);
    openConfigPanel();

    expect(screen.queryByPlaceholderText(/sk-/)).toBeNull();
    expect(screen.getByText(/shared proxy/)).toBeTruthy();
  });

  it("shows the API key field for providers other than demo", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "https://proxy.example.com/chat");
    useAIConfigStore.setState({ provider: "anthropic", model: "claude-sonnet-4-20250514", apiKey: "" });
    render(<PipelineChatBox />);
    openConfigPanel();

    expect(screen.getByPlaceholderText("sk-ant-...")).toBeTruthy();
    expect(screen.queryByText(/shared proxy/)).toBeNull();
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

  it("requires an API key before submitting for providers other than demo", () => {
    useAIConfigStore.setState({ provider: "anthropic", model: "claude-sonnet-4-20250514", apiKey: "" });
    render(<PipelineChatBox />);

    fireEvent.change(screen.getByPlaceholderText("Describe the pipeline you want..."), {
      target: { value: "build me a pipeline" },
    });
    fireEvent.click(screen.getByText("Generate"));

    expect(screen.getByText("Please set your API key in the config panel.")).toBeTruthy();
    expect(generatePipeline).not.toHaveBeenCalled();
  });

  it("submits without requiring an API key when the demo provider is selected", () => {
    vi.stubEnv("VITE_LLM_PROXY_URL", "https://proxy.example.com/chat");
    useAIConfigStore.setState({ provider: "demo", model: "demo", apiKey: "" });
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
