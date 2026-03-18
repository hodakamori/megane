import { describe, it, expect, vi, afterEach } from "vitest";
import { render, act, cleanup } from "@testing-library/react";
import type { HoverInfo } from "@/types";

// Mock heavy components to avoid WebGL/canvas in jsdom
vi.mock("@/components/Viewport", () => ({
  Viewport: vi.fn(() => null),
}));
vi.mock("@/components/Tooltip", () => ({
  Tooltip: vi.fn(() => null),
}));
vi.mock("@/components/MeasurementPanel", () => ({
  MeasurementPanel: vi.fn(() => null),
}));

import { WidgetViewer } from "@/components/WidgetViewer";
import { Viewport } from "@/components/Viewport";
import { Tooltip } from "@/components/Tooltip";
import { MeasurementPanel } from "@/components/MeasurementPanel";

const mockViewport = vi.mocked(Viewport);
const mockTooltip = vi.mocked(Tooltip);
const mockMeasurementPanel = vi.mocked(MeasurementPanel);

const defaultProps = {
  snapshot: null,
  frame: null,
  currentFrame: 0,
  totalFrames: 1,
  onSeek: vi.fn(),
};

describe("WidgetViewer (simple mode)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("passes non-noop handlers to Viewport", () => {
    render(<WidgetViewer {...defaultProps} />);
    const props = mockViewport.mock.calls[0][0];
    expect(props.onHover).toBeTypeOf("function");
    expect(props.onAtomRightClick).toBeTypeOf("function");
    expect(props.onFrameUpdated).toBeTypeOf("function");
  });

  it("renders Tooltip overlay", () => {
    render(<WidgetViewer {...defaultProps} />);
    expect(mockTooltip).toHaveBeenCalled();
  });

  it("renders MeasurementPanel overlay", () => {
    render(<WidgetViewer {...defaultProps} />);
    expect(mockMeasurementPanel).toHaveBeenCalled();
  });

  it("calling Viewport onHover updates Tooltip info", () => {
    render(<WidgetViewer {...defaultProps} />);
    const viewportProps = mockViewport.mock.calls[0][0];

    const atomInfo: HoverInfo = {
      kind: "atom",
      atomIndex: 3,
      elementSymbol: "N",
      atomicNumber: 7,
      position: [0, 0, 0],
      screenX: 100,
      screenY: 200,
    };

    act(() => {
      viewportProps.onHover(atomInfo);
    });

    const lastTooltipProps = mockTooltip.mock.lastCall?.[0];
    expect(lastTooltipProps?.info).toEqual(atomInfo);
  });

  it("Tooltip starts with null info before any hover", () => {
    render(<WidgetViewer {...defaultProps} />);
    const tooltipProps = mockTooltip.mock.calls[0][0];
    expect(tooltipProps.info).toBeNull();
  });
});

describe("WidgetViewer (pipeline mode)", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("passes non-noop handlers to Viewport", () => {
    render(<WidgetViewer {...defaultProps} pipeline />);
    const props = mockViewport.mock.calls[0][0];
    expect(props.onHover).toBeTypeOf("function");
    expect(props.onAtomRightClick).toBeTypeOf("function");
    expect(props.onFrameUpdated).toBeTypeOf("function");
  });

  it("renders Tooltip and MeasurementPanel in pipeline mode", () => {
    render(<WidgetViewer {...defaultProps} pipeline />);
    expect(mockTooltip).toHaveBeenCalled();
    expect(mockMeasurementPanel).toHaveBeenCalled();
  });
});
