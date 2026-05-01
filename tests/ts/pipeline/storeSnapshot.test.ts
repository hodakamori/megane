/**
 * Coverage for the per-document pipeline-store snapshot helpers used by the
 * JupyterLab DocWidgets to avoid re-parsing on tab activation.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { capturePipelineStore } from "@/pipeline/storeSnapshot";
import { usePipelineStore } from "@/pipeline/store";
import { createMinimalStructurePipeline } from "@/pipeline/defaults";
import type { Snapshot } from "@/types";

function makeSnapshot(nAtoms = 3, withBox = false): Snapshot {
  return {
    nAtoms,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(nAtoms * 3),
    elements: new Uint8Array(nAtoms),
    bonds: new Uint32Array(0),
    bondOrders: new Uint8Array(0),
    box: withBox ? new Float32Array([10, 0, 0, 0, 10, 0, 0, 0, 10]) : null,
  };
}

beforeEach(() => {
  usePipelineStore.getState().reset();
});

describe("capturePipelineStore + setState restore", () => {
  it("round-trips the renderer-relevant slice of the pipeline store", () => {
    const minimal = createMinimalStructurePipeline();
    usePipelineStore.setState({ nodes: minimal.nodes, edges: minimal.edges });

    const loader = usePipelineStore
      .getState()
      .nodes.find((n) => n.type === "load_structure")!;
    usePipelineStore.getState().setNodeSnapshot(loader.id, {
      snapshot: makeSnapshot(7, true),
      frames: null,
      meta: null,
      labels: null,
    });

    const snap = capturePipelineStore(usePipelineStore.getState());
    expect(snap.nodes.length).toBe(usePipelineStore.getState().nodes.length);
    expect(snap.nodeSnapshots[loader.id]?.snapshot.nAtoms).toBe(7);
    const capturedViewport = snap.viewportState;

    // Mutate the live store to simulate a different document tab taking
    // over the singleton.
    usePipelineStore.getState().reset();
    expect(usePipelineStore.getState().nodes).not.toBe(snap.nodes);

    // Restore via zustand setState — every captured slice must come back
    // by reference (no deep clone).
    usePipelineStore.setState(snap);
    const restored = usePipelineStore.getState();
    expect(restored.nodes).toBe(snap.nodes);
    expect(restored.edges).toBe(snap.edges);
    expect(restored.viewportState).toBe(capturedViewport);
    expect(restored.nodeSnapshots).toBe(snap.nodeSnapshots);
    expect(restored.nodeSnapshots[loader.id]?.snapshot.nAtoms).toBe(7);
  });
});
