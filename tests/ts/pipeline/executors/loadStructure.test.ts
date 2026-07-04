import { describe, it, expect } from "vitest";
import { executeLoadStructure } from "@/pipeline/executors/loadStructure";
import { MemoryFrameProvider } from "@/pipeline/types";
import type { FrameProvider, TrajectoryData, LoadStructureParams } from "@/pipeline/types";
import type { Snapshot, Frame, TrajectoryMeta } from "@/types";

const params = {} as LoadStructureParams;
const snapshot: Snapshot = {
  nAtoms: 2,
  nBonds: 0,
  nFileBonds: 0,
  positions: new Float32Array([1, 2, 3, 4, 5, 6]),
  elements: new Uint8Array([1, 8]),
  bonds: new Uint32Array(0),
  bondOrders: new Uint8Array(0),
  box: null,
  atomChainIds: null,
  atomBFactors: null,
};
const meta: TrajectoryMeta = { nFrames: 3, timestepPs: 1, nAtoms: 2 };
const frames: Frame[] = [
  { frameId: 1, nAtoms: 2, positions: new Float32Array(6) },
  { frameId: 2, nAtoms: 2, positions: new Float32Array(6) },
];

describe("executeLoadStructure", () => {
  it("emits no trajectory when neither frames nor provider are supplied", () => {
    const out = executeLoadStructure(params, snapshot, null, null, "n1");
    expect(out.has("particle")).toBe(true);
    expect(out.has("trajectory")).toBe(false);
  });

  it("builds a MemoryFrameProvider from eager structure frames", () => {
    const out = executeLoadStructure(params, snapshot, frames, meta, "n1");
    const traj = out.get("trajectory") as TrajectoryData;
    expect(traj.provider).toBeInstanceOf(MemoryFrameProvider);
    expect(traj.meta).toBe(meta);
    expect(traj.source).toBe("structure");
  });

  it("prefers a pre-built structure provider over eager frames", () => {
    const lazyMeta: TrajectoryMeta = { nFrames: 500, timestepPs: 1, nAtoms: 2 };
    const provider: FrameProvider = {
      kind: "stream",
      meta: lazyMeta,
      getFrame: () => null,
    };
    // Even with eager frames present, the provider wins.
    const out = executeLoadStructure(params, snapshot, frames, meta, "n1", provider);
    const traj = out.get("trajectory") as TrajectoryData;
    expect(traj.provider).toBe(provider);
    expect(traj.meta).toBe(lazyMeta);
    expect(traj.source).toBe("structure");
  });
});
