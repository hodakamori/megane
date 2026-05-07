import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";

vi.mock("@xyflow/react", async () => {
  const React = await import("react");
  return {
    ReactFlow: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "react-flow" }, children),
    ReactFlowProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", null, children),
    MiniMap: () => null,
    Controls: () => null,
    Background: () => null,
    BackgroundVariant: { Dots: "dots" },
    useReactFlow: () => ({
      screenToFlowPosition: () => ({ x: 0, y: 0 }),
      fitView: () => {},
      getZoom: () => 1,
    }),
    Handle: () => null,
    Position: { Left: "left", Right: "right", Top: "top", Bottom: "bottom" },
  };
});

vi.mock("@/components/PipelineChatBox", () => ({
  PipelineChatBox: () => <div data-testid="chat-stub">chat</div>,
}));
vi.mock("@/components/RenderModal", () => ({
  RenderModal: () => null,
}));
vi.mock("@/tour/MeganeTour", () => ({
  startTour: vi.fn(),
  startPipelineTutorial: vi.fn(),
}));
vi.mock("@/renderer/RenderCapture", () => ({
  downloadBlob: vi.fn(),
}));

import { PipelineEditor } from "@/components/PipelineEditor";
import { usePipelineUIStore } from "@/stores/usePipelineUIStore";

afterEach(() => {
  cleanup();
  usePipelineUIStore.setState({ mode: "editor", pendingNotice: null });
  localStorage.clear();
});

describe("PipelineEditor — tab switching", () => {
  beforeEach(() => {
    usePipelineUIStore.setState({ mode: "editor", pendingNotice: null });
  });

  it("renders both tab buttons with the editor selected by default", () => {
    render(<PipelineEditor collapsed={false} onToggleCollapse={() => {}} />);

    const editorTab = screen.getByTestId("pipeline-editor-tab-editor");
    const chatTab = screen.getByTestId("pipeline-editor-tab-chat");
    expect(editorTab.getAttribute("aria-selected")).toBe("true");
    expect(chatTab.getAttribute("aria-selected")).toBe("false");

    expect(screen.getByTestId("pipeline-editor-templates")).toBeTruthy();
    expect(screen.getByTestId("react-flow")).toBeTruthy();
  });

  it("hides the editor pane and reveals the chat pane when the chat tab is clicked", () => {
    render(<PipelineEditor collapsed={false} onToggleCollapse={() => {}} />);

    fireEvent.click(screen.getByTestId("pipeline-editor-tab-chat"));

    expect(usePipelineUIStore.getState().mode).toBe("chat");
    expect(screen.getByTestId("pipeline-editor-tab-chat").getAttribute("aria-selected")).toBe(
      "true",
    );

    const editorPanel = document.getElementById("pipeline-tabpanel-editor");
    const chatPanel = document.getElementById("pipeline-tabpanel-chat");
    expect(editorPanel?.style.display).toBe("none");
    expect(chatPanel?.style.display).toBe("flex");
  });

  it("keeps the I/O and Others toolbar rows visible from both tabs", () => {
    render(<PipelineEditor collapsed={false} onToggleCollapse={() => {}} />);

    expect(screen.getByTestId("pipeline-editor-share")).toBeTruthy();
    expect(screen.getByTestId("pipeline-editor-render")).toBeTruthy();
    expect(screen.getByTestId("pipeline-editor-theme")).toBeTruthy();

    fireEvent.click(screen.getByTestId("pipeline-editor-tab-chat"));

    expect(screen.getByTestId("pipeline-editor-share")).toBeTruthy();
    expect(screen.getByTestId("pipeline-editor-render")).toBeTruthy();
    expect(screen.getByTestId("pipeline-editor-theme")).toBeTruthy();
  });

  it("hides Pipeline-tab-only buttons (Templates) when the chat tab is active", () => {
    render(<PipelineEditor collapsed={false} onToggleCollapse={() => {}} />);

    fireEvent.click(screen.getByTestId("pipeline-editor-tab-chat"));

    const editorPanel = document.getElementById("pipeline-tabpanel-editor")!;
    expect(editorPanel.style.display).toBe("none");
    // The Templates button lives inside the Editor tab — it is still in the
    // DOM (display:none parent) so we assert its containing tabpanel is hidden.
    expect(editorPanel.contains(screen.getByTestId("pipeline-editor-templates"))).toBe(true);
  });

  it("auto-switches back to editor and shows the applied notice when chat applies a pipeline", () => {
    usePipelineUIStore.setState({ mode: "chat", pendingNotice: null });
    render(<PipelineEditor collapsed={false} onToggleCollapse={() => {}} />);

    expect(screen.getByTestId("pipeline-editor-tab-chat").getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.queryByTestId("pipeline-editor-applied-notice")).toBeNull();

    act(() => {
      usePipelineUIStore.getState().markPipelineApplied();
    });

    expect(usePipelineUIStore.getState().mode).toBe("editor");
    expect(screen.getByTestId("pipeline-editor-tab-editor").getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.getByTestId("pipeline-editor-applied-notice")).toBeTruthy();
  });
});
