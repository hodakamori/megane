import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, act, cleanup } from "@testing-library/react";
import type { Frame, HoverInfo, Snapshot } from "@/types";

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

// Spy on bond inference so we can assert the per-frame effect fires.
vi.mock("@/parsers/inferBondsJS", () => ({
  inferBondsVdwJS: vi.fn(() => new Uint32Array(0)),
}));
// Stub PBC post-processing only — preserve other exports (executeAddBond etc.)
// that the pipeline store's execute() depends on.
vi.mock("@/pipeline/executors/addBond", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/pipeline/executors/addBond")>();
  return {
    ...actual,
    processPbcBonds: vi.fn((bondIndices: Uint32Array, bondOrders: Uint8Array | null) => ({
      bondIndices,
      bondOrders,
      nBonds: bondIndices.length / 2,
      positions: null,
      elements: null,
      nAtoms: 0,
    })),
  };
});

import { WidgetViewer } from "@/components/WidgetViewer";
import { Viewport } from "@/components/Viewport";
import { Tooltip } from "@/components/Tooltip";
import { MeasurementPanel } from "@/components/MeasurementPanel";
import { inferBondsVdwJS } from "@/parsers/inferBondsJS";
import { usePipelineStore } from "@/pipeline/store";

const mockViewport = vi.mocked(Viewport);
const mockTooltip = vi.mocked(Tooltip);
const mockMeasurementPanel = vi.mocked(MeasurementPanel);
const mockInferBondsVdwJS = vi.mocked(inferBondsVdwJS);

const defaultProps = {
  snapshot: null,
  frame: null,
  currentFrame: 0,
  totalFrames: 1,
  onSeek: vi.fn(),
};

describe("WidgetViewer", () => {
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

describe("WidgetViewer — per-frame bond recalc", () => {
  // Build a minimal O–H snapshot (no bonds yet — distance mode infers them).
  function makeSnapshot(): Snapshot {
    return {
      nAtoms: 2,
      nBonds: 0,
      nFileBonds: 0,
      positions: new Float32Array([0, 0, 0, 1, 0, 0]),
      elements: new Uint8Array([8, 1]),
      bonds: new Uint32Array(0),
      bondOrders: null,
      box: null,
    };
  }

  function seedDistanceBondPipeline(snapshot: Snapshot | null) {
    // Replace the default pipeline with a single add_bond(distance) node.
    usePipelineStore.setState({
      nodes: [
        {
          id: "bond-test",
          type: "add_bond",
          position: { x: 0, y: 0 },
          data: {
            params: { type: "add_bond", bondSource: "distance" },
            enabled: true,
          },
        },
      ],
      edges: [],
      snapshot,
      atomLabels: null,
      structureFrames: null,
      structureMeta: null,
      fileFrames: null,
      fileMeta: null,
      fileVectors: null,
      nodeSnapshots: {},
      nodeParseErrors: {},
      nodeStreamingData: {},
      nodeErrors: {},
    });
  }

  /**
   * MoleculeRenderer has many methods (setAtomsVisible, setCellVisible, ...).
   * Return a Proxy whose properties are all no-op spies so any call succeeds.
   * The bond-recalc effect only needs `updateBondsExt` to be spyable.
   */
  function makeFakeRenderer(): { renderer: unknown; updateBondsExt: ReturnType<typeof vi.fn> } {
    const updateBondsExt = vi.fn();
    const renderer = new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === "updateBondsExt") return updateBondsExt;
          return vi.fn();
        },
      },
    );
    return { renderer, updateBondsExt };
  }

  beforeEach(() => {
    mockInferBondsVdwJS.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    // Restore the default pipeline so we don't leak state to other test files.
    usePipelineStore.getState().reset();
  });

  it("recomputes bonds per frame when store snapshot is set and prop snapshot is null", () => {
    // Reproduce the bug: in pipeline mode `snapshot` prop is null,
    // but the store snapshot is populated from `_node_snapshots_data`.
    seedDistanceBondPipeline(null);

    const frame1: Frame = {
      frameId: 0,
      nAtoms: 2,
      positions: new Float32Array([0, 0, 0, 1, 0, 0]),
    };

    const { rerender } = render(
      <WidgetViewer
        {...defaultProps}
        snapshot={null}
        frame={frame1}
        currentFrame={0}
        totalFrames={6}
      />,
    );

    // Wire up a fake renderer — the effect bails if rendererRef.current is null.
    const viewportProps = mockViewport.mock.calls[0][0];
    const { renderer, updateBondsExt } = makeFakeRenderer();
    act(() => {
      viewportProps.onRendererReady?.(renderer as any);
    });

    // Now populate the store snapshot as `nodeSnapshotsData` would in prod.
    // This must happen AFTER the initial mount effect — otherwise the
    // legacy-fallback effect resets store.snapshot to the (null) prop.
    const storeSnap = makeSnapshot();
    act(() => {
      usePipelineStore.getState().setSnapshot(storeSnap);
    });

    // Advance to a new frame where the O–H distance has grown past the cutoff.
    const frame2: Frame = {
      frameId: 1,
      nAtoms: 2,
      positions: new Float32Array([0, 0, 0, 5, 0, 0]),
    };
    act(() => {
      rerender(
        <WidgetViewer
          {...defaultProps}
          snapshot={null}
          frame={frame2}
          currentFrame={1}
          totalFrames={6}
        />,
      );
    });

    // The effect must reach inferBondsVdwJS (not early-return on null prop).
    expect(mockInferBondsVdwJS).toHaveBeenCalled();
    const calls = mockInferBondsVdwJS.mock.calls;
    // The most recent call must use the advanced frame positions and the
    // store snapshot's elements (not the null prop).
    const last = calls[calls.length - 1];
    expect(last[0]).toBe(frame2.positions);
    expect(last[1]).toBe(storeSnap.elements);
    expect(last[2]).toBe(storeSnap.nAtoms);
    // And updateBondsExt must be invoked so stick geometry refreshes.
    expect(updateBondsExt).toHaveBeenCalled();
  });

  it("does not call inferBondsVdwJS when both prop and store snapshot are null", () => {
    // Guards must still work: no snapshot from either source → no bond recalc.
    seedDistanceBondPipeline(null);

    const frame1: Frame = {
      frameId: 0,
      nAtoms: 2,
      positions: new Float32Array([0, 0, 0, 1, 0, 0]),
    };
    const { rerender } = render(
      <WidgetViewer
        {...defaultProps}
        snapshot={null}
        frame={frame1}
        currentFrame={0}
        totalFrames={6}
      />,
    );

    const viewportProps = mockViewport.mock.calls[0][0];
    const { renderer } = makeFakeRenderer();
    act(() => {
      viewportProps.onRendererReady?.(renderer as any);
    });

    const frame2: Frame = {
      frameId: 1,
      nAtoms: 2,
      positions: new Float32Array([0, 0, 0, 5, 0, 0]),
    };
    act(() => {
      rerender(
        <WidgetViewer
          {...defaultProps}
          snapshot={null}
          frame={frame2}
          currentFrame={1}
          totalFrames={6}
        />,
      );
    });

    expect(mockInferBondsVdwJS).not.toHaveBeenCalled();
  });
});
