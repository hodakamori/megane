import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { Node } from "@xyflow/react";
import {
  distanceBondVdwScale,
  hasDistanceBondNode,
  useFrameDistanceBonds,
  type FrameBondRenderer,
} from "@/hooks/useFrameDistanceBonds";
import type { PipelineNodeData } from "@/pipeline/execute";
import type { Frame, Snapshot } from "@/types";

const snapshot: Snapshot = {
  nAtoms: 3,
  nBonds: 0,
  nFileBonds: 0,
  positions: new Float32Array([0, 0, 0, 1, 0, 0, 10, 0, 0]),
  elements: new Uint8Array([8, 1, 1]),
  bonds: new Uint32Array(0),
  bondOrders: null,
  box: null,
  boxOrigin: null,
  atomChainIds: null,
  atomBFactors: null,
};

// Frame 1 moves the far hydrogen next to the oxygen: O bonds both hydrogens,
// and the two hydrogens (√2 Å apart) also fall inside the default VDW cutoff.
const frame: Frame = {
  frameId: 1,
  nAtoms: 3,
  positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]),
};

function makeRenderer(): FrameBondRenderer {
  return { updateBondsExt: vi.fn() };
}

function bondNode(params: Record<string, unknown>): Node<PipelineNodeData> {
  return {
    id: "b1",
    type: "add_bond",
    position: { x: 0, y: 0 },
    data: { params: { type: "add_bond", ...params } },
  } as Node<PipelineNodeData>;
}

describe("useFrameDistanceBonds", () => {
  it("recomputes bonds through the executor and updates the renderer", () => {
    const renderer = makeRenderer();
    const rendererRef = { current: renderer };
    const onBondCount = vi.fn();

    renderHook(() =>
      useFrameDistanceBonds({
        rendererRef,
        snapshot,
        frame,
        enabled: true,
        vdwScale: undefined,
        onBondCount,
      }),
    );

    expect(renderer.updateBondsExt).toHaveBeenCalledTimes(1);
    const [bondIndices] = vi.mocked(renderer.updateBondsExt).mock.calls[0];
    expect(Array.from(bondIndices)).toEqual([0, 1, 0, 2, 1, 2]);
    expect(onBondCount).toHaveBeenCalledWith(3);
  });

  it("does nothing when no distance-bond node is enabled", () => {
    const renderer = makeRenderer();
    renderHook(() =>
      useFrameDistanceBonds({
        rendererRef: { current: renderer },
        snapshot,
        frame,
        enabled: false,
        vdwScale: undefined,
      }),
    );
    expect(renderer.updateBondsExt).not.toHaveBeenCalled();
  });

  it("does nothing before the renderer is ready", () => {
    const onBondCount = vi.fn();
    renderHook(() =>
      useFrameDistanceBonds({
        rendererRef: { current: null },
        snapshot,
        frame,
        enabled: true,
        vdwScale: undefined,
        onBondCount,
      }),
    );
    expect(onBondCount).not.toHaveBeenCalled();
  });
});

describe("distance-bond node selectors", () => {
  const distance = bondNode({ bondSource: "distance", vdwScale: 0.8 });
  const structure = bondNode({ bondSource: "structure" });

  it("detects a distance-mode add_bond node", () => {
    expect(hasDistanceBondNode([structure, distance])).toBe(true);
    expect(hasDistanceBondNode([structure])).toBe(false);
    expect(hasDistanceBondNode([])).toBe(false);
  });

  it("reads the active node's VDW scale, undefined otherwise", () => {
    expect(distanceBondVdwScale([structure, distance])).toBe(0.8);
    expect(distanceBondVdwScale([bondNode({ bondSource: "distance" })])).toBeUndefined();
    expect(distanceBondVdwScale([structure])).toBeUndefined();
  });
});
