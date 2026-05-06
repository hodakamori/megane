import { describe, it, expect } from "vitest";
import { computeRmsf, executeRmsf } from "@/pipeline/executors/rmsf";
import type { RmsfParams, ParticleData, TrajectoryData, PipelineData } from "@/pipeline/types";
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

function defaultParams(extra: Partial<RmsfParams> = {}): RmsfParams {
  return { type: "rmsf", selection: "", ...extra };
}

// ─── computeRmsf tests ───────────────────────────────────────────────────────

describe("computeRmsf", () => {
  it("returns zero for a static atom (same position every frame)", () => {
    const frames = [
      new Float32Array([1, 2, 3]),
      new Float32Array([1, 2, 3]),
      new Float32Array([1, 2, 3]),
    ];
    const result = computeRmsf(frames, null, 1);
    expect(result[0]).toBeCloseTo(0, 6);
  });

  it("returns zero for all atoms when frames array is empty", () => {
    const result = computeRmsf([], null, 3);
    expect(Array.from(result)).toEqual([0, 0, 0]);
  });

  it("computes correct RMSF for 1D oscillation", () => {
    // Atom 0 oscillates between -1 and +1 in x; mean = 0, RMSF = 1
    const frames = [new Float32Array([-1, 0, 0]), new Float32Array([1, 0, 0])];
    const result = computeRmsf(frames, null, 1);
    expect(result[0]).toBeCloseTo(1.0, 6);
  });

  it("computes RMSF only for selected atom indices", () => {
    // 2 atoms: atom 0 oscillates, atom 1 is static
    const frames = [
      new Float32Array([-1, 0, 0, 5, 5, 5]),
      new Float32Array([1, 0, 0, 5, 5, 5]),
    ];
    const resultAll = computeRmsf(frames, null, 2);
    expect(resultAll[0]).toBeCloseTo(1.0, 6);
    expect(resultAll[1]).toBeCloseTo(0.0, 6);

    // Only atom 0 selected
    const resultSel = computeRmsf(frames, new Uint32Array([0]), 2);
    expect(resultSel[0]).toBeCloseTo(1.0, 6);
    expect(resultSel[1]).toBeCloseTo(0.0, 6); // unchanged for unselected
  });

  it("handles 3D fluctuation", () => {
    // Atom oscillates (1,1,1) → (-1,-1,-1); mean = 0, distance = sqrt(3) per frame → RMSF = sqrt(3)
    const frames = [
      new Float32Array([1, 1, 1]),
      new Float32Array([-1, -1, -1]),
    ];
    const result = computeRmsf(frames, null, 1);
    expect(result[0]).toBeCloseTo(Math.sqrt(3), 6);
  });
});

// ─── executeRmsf tests ───────────────────────────────────────────────────────

describe("executeRmsf", () => {
  it("returns empty output when particle is missing", () => {
    const meta = makeMeta(1, 2);
    const traj = makeTrajectory([makeFrame(0, [0, 0, 0]), makeFrame(1, [1, 0, 0])], meta);
    const inputs = new Map<string, PipelineData[]>([["trajectory", [traj]]]);
    const out = executeRmsf(defaultParams(), inputs);
    expect(out.size).toBe(0);
  });

  it("returns empty output when trajectory is missing", () => {
    const particle = makeParticle([0, 0, 0]);
    const inputs = new Map<string, PipelineData[]>([["particle", [particle]]]);
    const out = executeRmsf(defaultParams(), inputs);
    expect(out.size).toBe(0);
  });

  it("returns empty output when inputs map is empty", () => {
    const out = executeRmsf(defaultParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("returns empty output when trajectory has zero frames", () => {
    const meta = makeMeta(2, 0);
    const traj = makeTrajectory([], meta);
    const particle = makeParticle([0, 0, 0, 0, 0, 0]);
    const out = executeRmsf(defaultParams(), makeInputs(particle, traj));
    expect(out.size).toBe(0);
  });

  it("produces plot with nAtoms data points (all atoms)", () => {
    const nAtoms = 3;
    const meta = makeMeta(nAtoms, 2);
    const frames = [
      makeFrame(0, [0, 0, 0, 1, 0, 0, 2, 0, 0]),
      makeFrame(1, [1, 0, 0, 1, 0, 0, 3, 0, 0]),
    ];
    const traj = makeTrajectory(frames, meta);
    const particle = makeParticle([0, 0, 0, 1, 0, 0, 2, 0, 0]);
    const out = executeRmsf(defaultParams(), makeInputs(particle, traj));
    const plot = out.get("plot");
    expect(plot).toBeDefined();
    if (plot?.type === "plot") {
      expect(plot.xValues.length).toBe(nAtoms);
      expect(plot.yValues.length).toBe(nAtoms);
      expect(plot.title).toBe("RMSF");
      expect(plot.xLabel).toBe("Atom Index");
      expect(plot.yLabel).toBe("RMSF (Å)");
    }
  });

  it("x values are atom indices", () => {
    const meta = makeMeta(3, 1);
    const frames = [makeFrame(0, [0, 0, 0, 1, 0, 0, 2, 0, 0])];
    const traj = makeTrajectory(frames, meta);
    const particle = makeParticle([0, 0, 0, 1, 0, 0, 2, 0, 0]);
    const out = executeRmsf(defaultParams(), makeInputs(particle, traj));
    const plot = out.get("plot");
    if (plot?.type === "plot") {
      expect(Array.from(plot.xValues)).toEqual([0, 1, 2]);
    }
  });

  it("static trajectory yields zero RMSF for all atoms", () => {
    const meta = makeMeta(2, 3);
    const pos = [1, 2, 3, 4, 5, 6];
    const frames = [makeFrame(0, pos), makeFrame(1, pos), makeFrame(2, pos)];
    const traj = makeTrajectory(frames, meta);
    const particle = makeParticle(pos);
    const out = executeRmsf(defaultParams(), makeInputs(particle, traj));
    const plot = out.get("plot");
    if (plot?.type === "plot") {
      for (let i = 0; i < plot.yValues.length; i++) {
        expect(plot.yValues[i]).toBeCloseTo(0, 6);
      }
    }
  });

  it("respects particle index selection (subset of atoms)", () => {
    const meta = makeMeta(3, 2);
    const frames = [
      makeFrame(0, [0, 0, 0, 0, 0, 0, 0, 0, 0]),
      makeFrame(1, [1, 0, 0, 2, 0, 0, 3, 0, 0]),
    ];
    const traj = makeTrajectory(frames, meta);
    // Only atoms 0 and 2 selected
    const particle = makeParticle([0, 0, 0, 0, 0, 0, 0, 0, 0], new Uint32Array([0, 2]));
    const out = executeRmsf(defaultParams(), makeInputs(particle, traj));
    const plot = out.get("plot");
    if (plot?.type === "plot") {
      // 2 selected atoms → 2 data points
      expect(plot.xValues.length).toBe(2);
      expect(plot.yValues.length).toBe(2);
      // x = atom indices [0, 2]
      expect(plot.xValues[0]).toBe(0);
      expect(plot.xValues[1]).toBe(2);
    }
  });
});
