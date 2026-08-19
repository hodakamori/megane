import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

// The renderer is stubbed so we can assert the frustum insets MeganeViewer
// reserves for the pipeline panel — they must collapse to 0 when the panel is
// switched off, not just when it is collapsed.
const { rendererStub, pipelineEditorProps, measurementProps, measurementListProps } = vi.hoisted(
  () => ({
    rendererStub: {
      setBackgroundColor: vi.fn(),
      setViewInsets: vi.fn(),
      setCameraChangeCallback: vi.fn<(cb: () => void) => void>(),
      applyCameraState: vi.fn(),
      resetCamera: vi.fn(),
      updateBondsExt: vi.fn(),
      getStats: vi.fn(() => ({ fps: 60, drawCalls: 3 })),
      getCameraState: vi.fn<() => unknown>(() => null),
    },
    /** Last props the stubbed PipelineEditor received, for callback round-trips. */
    pipelineEditorProps: { current: null as Record<string, unknown> | null },
    /** Last props the stubbed measurement panels received, for layout assertions. */
    measurementProps: { current: null as Record<string, unknown> | null },
    measurementListProps: { current: null as Record<string, unknown> | null },
  }),
);

vi.mock("@/components/Viewport", async () => {
  const { useEffect } = await import("react");
  return {
    Viewport: ({ onRendererReady }: { onRendererReady?: (r: unknown) => void }) => {
      useEffect(() => {
        onRendererReady?.(rendererStub);
      }, [onRendererReady]);
      return <div data-testid="mock-viewport" />;
    },
  };
});

// Tooltip / MeasurementPanel / MeasurementListPanel all render null when they
// have no data, so stub them with always-visible markers to tell "switched
// off" apart from "nothing to show".
vi.mock("@/components/Tooltip", () => ({
  Tooltip: () => <div data-testid="mock-tooltip" />,
}));
vi.mock("@/components/MeasurementPanel", () => ({
  MeasurementPanel: (props: Record<string, unknown>) => {
    measurementProps.current = props;
    return <div data-testid="mock-measurement-panel" />;
  },
}));
vi.mock("@/components/MeasurementListPanel", () => ({
  MeasurementListPanel: (props: Record<string, unknown>) => {
    measurementListProps.current = props;
    return <div data-testid="mock-measurement-list" />;
  },
}));
vi.mock("@/components/Timeline", () => ({
  Timeline: () => <div data-testid="mock-timeline" />,
}));
vi.mock("@/components/PipelineEditor", () => ({
  PipelineEditor: (props: Record<string, unknown>) => {
    pipelineEditorProps.current = props;
    return <div data-testid="mock-pipeline-editor" />;
  },
}));
vi.mock("@/pipeline/apply", () => ({
  applyViewportState: vi.fn(),
  applyVectorsForFrame: vi.fn(),
}));

import { MeganeViewer, DEFAULT_MEGANE_VIEWER_UI } from "@/components/MeganeViewer";
import type { MeganeViewerUiOptions } from "@/components/MeganeViewer";
import { useViewStateStore } from "@/stores/useViewStateStore";
import type { MeganeCameraState } from "@/renderer/MoleculeRenderer";

/** testid rendered by each switchable tool, keyed by its `ui` option. */
const TOOL_TESTIDS: Record<keyof MeganeViewerUiOptions, string[]> = {
  pipelineEditor: ["mock-pipeline-editor"],
  resetView: ["reset-view-btn"],
  perfHud: ["perf-hud"],
  timeline: ["mock-timeline"],
  tooltip: ["mock-tooltip"],
  measurement: ["mock-measurement-panel", "mock-measurement-list"],
};

const TOOL_KEYS = Object.keys(TOOL_TESTIDS) as (keyof MeganeViewerUiOptions)[];

describe("MeganeViewer ui options", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    rendererStub.getCameraState.mockReturnValue(null);
    pipelineEditorProps.current = null;
    measurementProps.current = null;
    measurementListProps.current = null;
  });

  it("defaults every tool to visible", () => {
    expect(DEFAULT_MEGANE_VIEWER_UI).toEqual({
      pipelineEditor: true,
      resetView: true,
      perfHud: true,
      timeline: true,
      tooltip: true,
      measurement: true,
    });
  });

  it("renders all tools when no ui prop is given", () => {
    render(<MeganeViewer onUploadStructure={() => {}} />);
    for (const testid of TOOL_KEYS.flatMap((k) => TOOL_TESTIDS[k])) {
      expect(screen.getByTestId(testid)).toBeTruthy();
    }
  });

  // `ui` is Partial<…> and the project does not enable
  // exactOptionalPropertyTypes, so `ui={{ timeline: someMaybeUndefined }}`
  // typechecks. Present-but-undefined must read as "not specified", not "off".
  it.each(TOOL_KEYS)("treats an explicitly undefined %s as not specified", (key) => {
    render(<MeganeViewer onUploadStructure={() => {}} ui={{ [key]: undefined }} />);
    for (const testid of TOOL_KEYS.flatMap((k) => TOOL_TESTIDS[k])) {
      expect(screen.getByTestId(testid)).toBeTruthy();
    }
  });

  it("renders all tools when ui is an empty object", () => {
    render(<MeganeViewer onUploadStructure={() => {}} ui={{}} />);
    for (const testid of TOOL_KEYS.flatMap((k) => TOOL_TESTIDS[k])) {
      expect(screen.getByTestId(testid)).toBeTruthy();
    }
  });

  it.each(TOOL_KEYS)("hides only %s when that key is false", (key) => {
    render(<MeganeViewer onUploadStructure={() => {}} ui={{ [key]: false }} />);

    for (const testid of TOOL_TESTIDS[key]) {
      expect(screen.queryByTestId(testid)).toBeNull();
    }
    for (const other of TOOL_KEYS.filter((k) => k !== key)) {
      for (const testid of TOOL_TESTIDS[other]) {
        expect(screen.getByTestId(testid)).toBeTruthy();
      }
    }
  });

  it("keeps the Viewport when every tool is switched off", () => {
    const allOff = Object.fromEntries(TOOL_KEYS.map((k) => [k, false])) as MeganeViewerUiOptions;
    render(<MeganeViewer onUploadStructure={() => {}} ui={allOff} />);

    expect(screen.getByTestId("mock-viewport")).toBeTruthy();
    expect(screen.getByTestId("megane-viewer")).toBeTruthy();
    for (const testid of TOOL_KEYS.flatMap((k) => TOOL_TESTIDS[k])) {
      expect(screen.queryByTestId(testid)).toBeNull();
    }
  });

  it("shifts the perf HUD into the Reset View slot when that button is hidden", () => {
    render(<MeganeViewer onUploadStructure={() => {}} ui={{ resetView: false }} />);
    expect(screen.getByTestId("perf-hud")).toHaveStyle({ left: "12px" });
  });

  it("leaves the perf HUD clear of the Reset View button by default", () => {
    render(<MeganeViewer onUploadStructure={() => {}} />);
    expect(screen.getByTestId("perf-hud")).toHaveStyle({ left: "92px" });
  });

  it("reserves a right inset for the pipeline panel by default", () => {
    render(<MeganeViewer onUploadStructure={() => {}} />);
    // Default panel width 480 + 12px gutter.
    expect(rendererStub.setViewInsets).toHaveBeenCalledWith(0, 492);
    expect(rendererStub.setViewInsets).not.toHaveBeenCalledWith(0, 0);
  });

  it("reserves no right inset when the pipeline panel is switched off", () => {
    render(<MeganeViewer onUploadStructure={() => {}} ui={{ pipelineEditor: false }} />);
    expect(rendererStub.setViewInsets).toHaveBeenCalledWith(0, 0);
    expect(rendererStub.setViewInsets).not.toHaveBeenCalledWith(0, 492);
  });

  it("stretches the tour anchor across the full width without the pipeline panel", () => {
    const { container } = render(
      <MeganeViewer onUploadStructure={() => {}} ui={{ pipelineEditor: false, timeline: false }} />,
    );
    const anchor = container.querySelector<HTMLElement>('[data-tour-anchor="viewport"]');
    expect(anchor).not.toBeNull();
    expect(anchor!.style.right).toBe("24px");
    expect(anchor!.style.bottom).toBe("24px");
  });

  it("keeps the tour anchor clear of the pipeline panel and timeline by default", () => {
    const { container } = render(<MeganeViewer onUploadStructure={() => {}} />);
    const anchor = container.querySelector<HTMLElement>('[data-tour-anchor="viewport"]');
    expect(anchor!.style.right).toBe("504px");
    expect(anchor!.style.bottom).toBe("80px");
  });

  it("keeps the measurement panels clear of the timeline by default", () => {
    render(<MeganeViewer onUploadStructure={() => {}} />);
    expect(measurementProps.current?.bottom).toBe(60);
    expect(measurementListProps.current?.bottom).toBe(60);
  });

  it("drops the measurement panels to the corner inset when the timeline is hidden", () => {
    render(<MeganeViewer onUploadStructure={() => {}} ui={{ timeline: false }} />);
    expect(measurementProps.current?.bottom).toBe(12);
    expect(measurementListProps.current?.bottom).toBe(12);
  });

  it("re-applies the inset when the pipeline panel is resized", () => {
    render(<MeganeViewer onUploadStructure={() => {}} />);
    const onWidthChange = pipelineEditorProps.current?.onWidthChange as (w: number) => void;
    rendererStub.setViewInsets.mockClear();

    onWidthChange(300);
    expect(rendererStub.setViewInsets).toHaveBeenCalledWith(0, 312);
  });
});

describe("MeganeViewer camera persistence", () => {
  const CAMERA = { position: [1, 2, 3], target: [0, 0, 0] } as unknown as MeganeCameraState;

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    rendererStub.getCameraState.mockReturnValue(null);
    useViewStateStore.setState({ camera: null });
  });

  /** Invokes the callback MeganeViewer registered on the renderer. */
  const fireCameraChange = () => {
    const cb = rendererStub.setCameraChangeCallback.mock.calls[0]?.[0];
    expect(cb).toBeTypeOf("function");
    cb!();
  };

  it("forwards camera changes to the onCameraStateChange prop when supplied", () => {
    const onCameraStateChange = vi.fn();
    render(<MeganeViewer onUploadStructure={() => {}} onCameraStateChange={onCameraStateChange} />);
    rendererStub.getCameraState.mockReturnValue(CAMERA);

    fireCameraChange();
    expect(onCameraStateChange).toHaveBeenCalledWith(CAMERA);
    expect(useViewStateStore.getState().camera).toBeNull();
  });

  it("falls back to the view-state store when no callback is supplied", () => {
    render(<MeganeViewer onUploadStructure={() => {}} />);
    rendererStub.getCameraState.mockReturnValue(CAMERA);

    fireCameraChange();
    expect(useViewStateStore.getState().camera).toBe(CAMERA);
  });

  it("ignores camera changes while the renderer has no camera state yet", () => {
    const onCameraStateChange = vi.fn();
    render(<MeganeViewer onUploadStructure={() => {}} onCameraStateChange={onCameraStateChange} />);
    rendererStub.getCameraState.mockReturnValue(null);

    fireCameraChange();
    expect(onCameraStateChange).not.toHaveBeenCalled();
    expect(useViewStateStore.getState().camera).toBeNull();
  });
});
