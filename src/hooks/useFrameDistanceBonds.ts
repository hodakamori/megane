import { useEffect } from "react";
import type { RefObject } from "react";
import type { Node } from "@xyflow/react";
import { computeFrameDistanceBonds } from "../pipeline/executors/addBond";
import type { PipelineNodeData } from "../pipeline/execute";
import type { AddBondParams } from "../pipeline/types";
import type { Frame, Snapshot } from "../types";

/** The renderer surface the per-frame bond refresh needs. */
export interface FrameBondRenderer {
  updateBondsExt(
    bondIndices: Uint32Array,
    bondOrders: Uint8Array | null,
    positions: Float32Array | null,
    elements: Uint8Array | null,
    nAtoms: number,
  ): void;
}

/** True when the pipeline holds an `add_bond` node in distance mode. */
export function hasDistanceBondNode(nodes: ReadonlyArray<Node<PipelineNodeData>>): boolean {
  return nodes.some(
    (n) => n.type === "add_bond" && (n.data.params as AddBondParams).bondSource === "distance",
  );
}

/** VDW scale of the active distance-bond node (undefined → executor default). */
export function distanceBondVdwScale(
  nodes: ReadonlyArray<Node<PipelineNodeData>>,
): number | undefined {
  const node = nodes.find(
    (n) => n.type === "add_bond" && (n.data.params as AddBondParams).bondSource === "distance",
  );
  return node ? (node.data.params as AddBondParams).vdwScale : undefined;
}

/**
 * Refresh distance-mode bonds for the current playback frame through the
 * `add_bond` executor's `computeFrameDistanceBonds`. Shared by every host
 * viewer so the transform has exactly one implementation (CRITICAL RULE #11
 * corollary: hosts call the node executor, they never reimplement it).
 */
export function useFrameDistanceBonds(options: {
  rendererRef: RefObject<FrameBondRenderer | null>;
  snapshot: Snapshot | null;
  frame: Frame | null;
  enabled: boolean;
  vdwScale: number | undefined;
  onBondCount?: (nBonds: number) => void;
}): void {
  const { rendererRef, snapshot, frame, enabled, vdwScale, onBondCount } = options;
  useEffect(() => {
    if (!enabled || !snapshot || !frame) return;
    const renderer = rendererRef.current;
    if (!renderer) return;

    const result = computeFrameDistanceBonds(
      frame.positions,
      snapshot.elements,
      snapshot.nAtoms,
      snapshot.box,
      vdwScale,
    );
    renderer.updateBondsExt(
      result.bondIndices,
      result.bondOrders,
      result.positions,
      result.elements,
      result.nAtoms,
    );
    onBondCount?.(result.nBonds);
  }, [enabled, snapshot, frame, vdwScale, rendererRef, onBondCount]);
}
