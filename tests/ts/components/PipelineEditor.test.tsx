import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// Mock heavy children that depend on Three.js / WebGL / WASM so the editor
// chrome (toolbar, theme button, dropdowns) renders cleanly under jsdom.
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
  PipelineChatBox: () => null,
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
import { useThemeStore } from "@/stores/useThemeStore";

afterEach(() => {
  cleanup();
  // Reset the theme store between tests.
  useThemeStore.setState({ theme: "system", resolvedTheme: "light" });
});

describe("PipelineEditor — theme button", () => {
  it("renders the theme cycle button with the current label", () => {
    useThemeStore.setState({ theme: "light", resolvedTheme: "light" });

    render(<PipelineEditor collapsed={false} onToggleCollapse={() => {}} />);

    const themeBtn = screen.getByTestId("pipeline-editor-theme");
    expect(themeBtn.textContent).toContain("Light");
    expect(themeBtn.getAttribute("aria-label")).toContain("Light");
  });

  it("cycles light → dark → system → light when clicked", () => {
    useThemeStore.setState({ theme: "light", resolvedTheme: "light" });

    render(<PipelineEditor collapsed={false} onToggleCollapse={() => {}} />);
    const themeBtn = screen.getByTestId("pipeline-editor-theme");

    fireEvent.click(themeBtn);
    expect(useThemeStore.getState().theme).toBe("dark");

    fireEvent.click(themeBtn);
    expect(useThemeStore.getState().theme).toBe("system");

    fireEvent.click(themeBtn);
    expect(useThemeStore.getState().theme).toBe("light");
  });

  it("renders 'Auto' label when theme is system", () => {
    useThemeStore.setState({ theme: "system", resolvedTheme: "light" });
    render(<PipelineEditor collapsed={false} onToggleCollapse={() => {}} />);
    const themeBtn = screen.getByTestId("pipeline-editor-theme");
    expect(themeBtn.textContent).toContain("Auto");
  });
});

describe("PipelineEditor — collapsed state", () => {
  it("renders only the collapsed toggle when collapsed", () => {
    render(<PipelineEditor collapsed={true} onToggleCollapse={() => {}} />);
    expect(screen.queryByTestId("pipeline-editor-theme")).toBeNull();
    expect(screen.getByTestId("panel-pipeline-toggle")).toBeTruthy();
  });
});
