import { describe, it, expect } from "vitest";
import { executeContactMap } from "@/pipeline/executors/contactMap";
import type { ContactMapParams, ParticleData, TrajectoryData, PipelineData, PlotData } from "@/pipeline/types";
import type { Snapshot, Frame, TrajectoryMeta } from "@/types";
import { MemoryFrameProvider } from "@/pipeline/types";

// ─── Helpers ──────────────────────────────────────────────────────────

function makeSnapshot(opts: Partial<Snapshot> = {}): Snapshot {
  return {
    nAtoms: 3,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array([0, 0, 0, 4, 0, 0, 8, 0, 0]),
    elements: new Uint8Array([6, 6, 6]),
    bonds: new Uint32Array(),
    bondOrders: null,
    box: null,
    atomChainIds: null,
    atomBFactors: null,
    caIndices: new Uint32Array([0, 1, 2]),
    caResNums: new Uint32Array([1, 2, 3]),
    ...opts,
  } as unknown as Snapshot;
}

function makeParticle(snapshot: Snapshot): ParticleData {
  return {
    type: "particle",
    source: snapshot,
    sourceNodeId: "src",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
  };
}

function makeInputs(particle: ParticleData, traj?: TrajectoryData): Map<string, PipelineData[]> {
  const m = new Map<string, PipelineData[]>([["particle", [particle]]]);
  if (traj) m.set("trajectory", [traj]);
  return m;
}

function baseParams(extra: Partial<ContactMapParams> = {}): ContactMapParams {
  return { type: "contact_map", distanceCutoff: 8.0, frameIndex: 0, ...extra };
}

// ─── Tests ────────────────────────────────────────────────────────────

describe("executeContactMap", () => {
  it("returns empty when no particle input", () => {
    const out = executeContactMap(baseParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("returns empty when snapshot has no caIndices", () => {
    const snap = makeSnapshot({ caIndices: undefined });
    const out = executeContactMap(baseParams(), makeInputs(makeParticle(snap)));
    expect(out.size).toBe(0);
  });

  it("returns empty when caIndices is empty", () => {
    const snap = makeSnapshot({ caIndices: new Uint32Array([]) });
    const out = executeContactMap(baseParams(), makeInputs(makeParticle(snap)));
    expect(out.size).toBe(0);
  });

  it("produces a heatmap PlotData for a valid structure", () => {
    const snap = makeSnapshot();
    const out = executeContactMap(baseParams(), makeInputs(makeParticle(snap)));
    expect(out.has("plot")).toBe(true);
    const plot = out.get("plot") as PlotData;
    expect(plot.type).toBe("plot");
    expect(plot.kind).toBe("heatmap");
    expect(plot.nResidues).toBe(3);
    expect(plot.threshold).toBe(8.0);
  });

  it("computes correct pairwise Cα distances (diagonal is 0)", () => {
    const snap = makeSnapshot();
    const out = executeContactMap(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.matrix).toBeDefined();
    const mat = plot.matrix!;
    // Diagonal must be 0
    expect(mat[0]).toBeCloseTo(0);
    expect(mat[4]).toBeCloseTo(0);
    expect(mat[8]).toBeCloseTo(0);
    // Distance between atom 0 (0,0,0) and atom 1 (4,0,0) = 4
    expect(mat[1]).toBeCloseTo(4);
    expect(mat[3]).toBeCloseTo(4);
    // Distance between atom 0 and atom 2 (8,0,0) = 8
    expect(mat[2]).toBeCloseTo(8);
    expect(mat[6]).toBeCloseTo(8);
  });

  it("uses caResNums for residue labels when available", () => {
    const snap = makeSnapshot({ caResNums: new Uint32Array([10, 20, 30]) });
    const out = executeContactMap(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.residueLabels).toEqual(["10", "20", "30"]);
  });

  it("falls back to 1-based index labels when caResNums is missing", () => {
    const snap = makeSnapshot({ caResNums: undefined });
    const out = executeContactMap(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.residueLabels).toEqual(["1", "2", "3"]);
  });

  it("honours distanceCutoff in the output", () => {
    const snap = makeSnapshot();
    const out = executeContactMap(baseParams({ distanceCutoff: 5.0 }), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.threshold).toBe(5.0);
  });

  it("uses trajectory frame positions when trajectory is provided", () => {
    const snap = makeSnapshot();
    const framePositions = new Float32Array([0, 0, 0, 1, 0, 0, 2, 0, 0]);
    const frame: Frame = { frameId: 0, nAtoms: 3, positions: framePositions };
    const meta: TrajectoryMeta = { nFrames: 1, timestepPs: 1, nAtoms: 3 };
    const provider = new MemoryFrameProvider([frame], meta);
    const traj: TrajectoryData = { type: "trajectory", provider, meta, source: "file" };
    const out = executeContactMap(baseParams({ frameIndex: 0 }), makeInputs(makeParticle(snap), traj));
    const plot = out.get("plot") as PlotData;
    // With frame positions: atoms at 0,1,2 Å apart
    expect(plot.matrix![1]).toBeCloseTo(1);
    expect(plot.matrix![2]).toBeCloseTo(2);
  });

  it("averages over frames when frameIndex is -1", () => {
    const snap = makeSnapshot();
    // Frame 0: distances 4 and 8; Frame 1: distances 1 and 2 → average 2.5 and 5
    const f0: Frame = { frameId: 0, nAtoms: 3, positions: new Float32Array([0,0,0, 4,0,0, 8,0,0]) };
    const f1: Frame = { frameId: 1, nAtoms: 3, positions: new Float32Array([0,0,0, 1,0,0, 2,0,0]) };
    const meta: TrajectoryMeta = { nFrames: 2, timestepPs: 1, nAtoms: 3 };
    const provider = new MemoryFrameProvider([f0, f1], meta);
    const traj: TrajectoryData = { type: "trajectory", provider, meta, source: "file" };
    const out = executeContactMap(baseParams({ frameIndex: -1 }), makeInputs(makeParticle(snap), traj));
    const plot = out.get("plot") as PlotData;
    expect(plot.matrix![1]).toBeCloseTo(2.5);
    expect(plot.matrix![2]).toBeCloseTo(5);
  });

  it("title is 'Contact Map'", () => {
    const snap = makeSnapshot();
    const out = executeContactMap(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.title).toBe("Contact Map");
  });
});
