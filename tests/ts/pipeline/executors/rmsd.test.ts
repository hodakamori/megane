import { describe, it, expect } from "vitest";
import { computeRmsd, executeRmsd } from "@/pipeline/executors/rmsd";
import type { RmsdParams, ParticleData, TrajectoryData, PipelineData } from "@/pipeline/types";
import { MemoryFrameProvider } from "@/pipeline/types";
import type { Snapshot, Frame, TrajectoryMeta } from "@/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSnapshot(positions: number[]): Snapshot {
  const nAtoms = positions.length / 3;
  return {
    nAtoms,
    nBonds: 0,
    positions: new Float32Array(positions),
    elements: new Uint8Array(nAtoms).fill(6),
    bonds: new Uint32Array(),
    bondOrders: null,
    atomBFactors: null,
    atomChainIds: null,
  } as unknown as Snapshot;
}

function makeParticle(positions: number[], indices: Uint32Array | null = null): ParticleData {
  return {
    type: "particle",
    source: makeSnapshot(positions),
    sourceNodeId: "src",
    indices,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
  };
}

function makeMeta(nAtoms: number, nFrames: number): TrajectoryMeta {
  return { nAtoms, nFrames, timestepPs: 1.0 };
}

function makeFrame(frameId: number, positions: number[]): Frame {
  return { frameId, nAtoms: positions.length / 3, positions: new Float32Array(positions) };
}

function makeTrajectory(frames: Frame[], meta: TrajectoryMeta): TrajectoryData {
  return {
    type: "trajectory",
    provider: new MemoryFrameProvider(frames, meta),
    meta,
    source: "file",
  };
}

function makeInputs(particle: ParticleData, trajectory: TrajectoryData): Map<string, PipelineData[]> {
  return new Map<string, PipelineData[]>([
    ["particle", [particle]],
    ["trajectory", [trajectory]],
  ]);
}

function defaultParams(extra: Partial<RmsdParams> = {}): RmsdParams {
  return { type: "rmsd", selection: "", referenceFrame: 0, ...extra };
}

// ─── computeRmsd tests ────────────────────────────────────────────────────────

describe("computeRmsd", () => {
  it("returns 0 when positions are identical", () => {
    const pos = new Float32Array([1, 2, 3, 4, 5, 6]);
    expect(computeRmsd(pos, pos, null, 2)).toBe(0);
  });

  it("computes correct RMSD for simple displacement along x", () => {
    // 2 atoms each displaced by 1 Å in x → RMSD = 1.0
    const ref = new Float32Array([0, 0, 0, 0, 0, 0]);
    const frame = new Float32Array([1, 0, 0, 1, 0, 0]);
    expect(computeRmsd(ref, frame, null, 2)).toBeCloseTo(1.0, 6);
  });

  it("computes RMSD only for selected atom indices", () => {
    const ref = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    // Atom 0: displaced by 3 in x; atoms 1,2: not displaced
    const frame = new Float32Array([3, 0, 0, 0, 0, 0, 0, 0, 0]);
    // With all atoms: sqrt(9/3) = sqrt(3)
    expect(computeRmsd(ref, frame, null, 3)).toBeCloseTo(Math.sqrt(3), 6);
    // With only atom 0 selected: sqrt(9/1) = 3
    expect(computeRmsd(ref, frame, new Uint32Array([0]), 3)).toBeCloseTo(3.0, 6);
    // With atoms 1,2 selected: 0
    expect(computeRmsd(ref, frame, new Uint32Array([1, 2]), 3)).toBeCloseTo(0.0, 6);
  });

  it("returns 0 when atomIndices is empty", () => {
    const ref = new Float32Array([1, 2, 3]);
    const frame = new Float32Array([4, 5, 6]);
    expect(computeRmsd(ref, frame, new Uint32Array([]), 1)).toBe(0);
  });

  it("handles 3D displacement correctly", () => {
    // displacement (1,1,1) for one atom → RMSD = sqrt(3)
    const ref = new Float32Array([0, 0, 0]);
    const frame = new Float32Array([1, 1, 1]);
    expect(computeRmsd(ref, frame, null, 1)).toBeCloseTo(Math.sqrt(3), 6);
  });
});

// ─── executeRmsd tests ───────────────────────────────────────────────────────

describe("executeRmsd", () => {
  it("returns empty output when particle is missing", () => {
    const meta = makeMeta(2, 2);
    const traj = makeTrajectory(
      [makeFrame(0, [0, 0, 0, 0, 0, 0]), makeFrame(1, [1, 0, 0, 1, 0, 0])],
      meta,
    );
    const inputs = new Map<string, PipelineData[]>([["trajectory", [traj]]]);
    const out = executeRmsd(defaultParams(), inputs);
    expect(out.size).toBe(0);
  });

  it("returns empty output when trajectory is missing", () => {
    const particle = makeParticle([0, 0, 0, 0, 0, 0]);
    const inputs = new Map<string, PipelineData[]>([["particle", [particle]]]);
    const out = executeRmsd(defaultParams(), inputs);
    expect(out.size).toBe(0);
  });

  it("returns empty output when inputs map is empty", () => {
    const out = executeRmsd(defaultParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("produces plot with nFrames data points", () => {
    const nAtoms = 2;
    const nFrames = 3;
    const meta = makeMeta(nAtoms, nFrames);
    const frames = [
      makeFrame(0, [0, 0, 0, 0, 0, 0]),
      makeFrame(1, [1, 0, 0, 1, 0, 0]),
      makeFrame(2, [2, 0, 0, 2, 0, 0]),
    ];
    const traj = makeTrajectory(frames, meta);
    const particle = makeParticle([0, 0, 0, 0, 0, 0]);
    const out = executeRmsd(defaultParams(), makeInputs(particle, traj));
    const plot = out.get("plot");
    expect(plot).toBeDefined();
    expect(plot?.type).toBe("plot");
    if (plot?.type === "plot") {
      expect(plot.xValues.length).toBe(nFrames);
      expect(plot.yValues.length).toBe(nFrames);
      expect(plot.title).toBe("RMSD");
      expect(plot.xLabel).toBe("Frame");
      expect(plot.yLabel).toBe("RMSD (Å)");
    }
  });

  it("computes zero RMSD at the reference frame", () => {
    const nAtoms = 2;
    const meta = makeMeta(nAtoms, 3);
    const refPos = [1, 2, 3, 4, 5, 6];
    const frames = [
      makeFrame(0, refPos),
      makeFrame(1, [1, 0, 0, 1, 0, 0]),
      makeFrame(2, [2, 0, 0, 2, 0, 0]),
    ];
    const traj = makeTrajectory(frames, meta);
    const particle = makeParticle(refPos);
    const out = executeRmsd(defaultParams({ referenceFrame: 0 }), makeInputs(particle, traj));
    const plot = out.get("plot");
    if (plot?.type === "plot") {
      expect(plot.yValues[0]).toBeCloseTo(0, 6);
    }
  });

  it("frame indices are stored as x values", () => {
    const meta = makeMeta(1, 3);
    const frames = [
      makeFrame(0, [0, 0, 0]),
      makeFrame(1, [1, 0, 0]),
      makeFrame(2, [2, 0, 0]),
    ];
    const traj = makeTrajectory(frames, meta);
    const particle = makeParticle([0, 0, 0]);
    const out = executeRmsd(defaultParams(), makeInputs(particle, traj));
    const plot = out.get("plot");
    if (plot?.type === "plot") {
      expect(Array.from(plot.xValues)).toEqual([0, 1, 2]);
    }
  });

  it("clamps referenceFrame to valid range", () => {
    const meta = makeMeta(1, 2);
    const frames = [makeFrame(0, [0, 0, 0]), makeFrame(1, [1, 0, 0])];
    const traj = makeTrajectory(frames, meta);
    const particle = makeParticle([0, 0, 0]);
    // referenceFrame = 999 should clamp to last frame (1)
    const out = executeRmsd(defaultParams({ referenceFrame: 999 }), makeInputs(particle, traj));
    const plot = out.get("plot");
    expect(plot).toBeDefined();
  });
});
