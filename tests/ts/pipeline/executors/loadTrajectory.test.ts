import { describe, it, expect } from "vitest";
import { executeLoadTrajectory } from "@/pipeline/executors/loadTrajectory";
import { MemoryFrameProvider } from "@/pipeline/types";
import type { FrameProvider, TrajectoryData, LoadTrajectoryParams } from "@/pipeline/types";
import type { Frame, TrajectoryMeta } from "@/types";

const meta: TrajectoryMeta = { nFrames: 3, timestepPs: 1, nAtoms: 2 };
const frames: Frame[] = [
  { frameId: 0, nAtoms: 2, positions: new Float32Array(6) },
  { frameId: 1, nAtoms: 2, positions: new Float32Array(6) },
];
const params = {} as LoadTrajectoryParams;
const inputs = new Map();

describe("executeLoadTrajectory", () => {
  it("emits no trajectory when neither frames nor provider are supplied", () => {
    const out = executeLoadTrajectory(params, inputs, null, null, null);
    expect(out.has("trajectory")).toBe(false);
  });

  it("builds a MemoryFrameProvider from eager frames", () => {
    const out = executeLoadTrajectory(params, inputs, frames, meta, null);
    const traj = out.get("trajectory") as TrajectoryData;
    expect(traj.provider).toBeInstanceOf(MemoryFrameProvider);
    expect(traj.meta).toBe(meta);
    expect(traj.source).toBe("file");
  });

  it("prefers a pre-built provider over eager frames", () => {
    const lazyMeta: TrajectoryMeta = { nFrames: 100, timestepPs: 2, nAtoms: 2 };
    const provider: FrameProvider = {
      kind: "stream",
      meta: lazyMeta,
      getFrame: () => null,
    };
    // Even with eager frames present, the provider wins.
    const out = executeLoadTrajectory(params, inputs, frames, meta, provider);
    const traj = out.get("trajectory") as TrajectoryData;
    expect(traj.provider).toBe(provider);
    expect(traj.meta).toBe(lazyMeta);
  });
});
