import { describe, it, expect } from "vitest";
import { executeReplicate } from "@/pipeline/executors/replicate";
import type {
  ReplicateParams,
  ParticleData,
  CellData,
  PipelineData,
  TrajectoryData,
} from "@/pipeline/types";
import { MemoryFrameProvider } from "@/pipeline/types";
import type { Snapshot, Frame, TrajectoryMeta } from "@/types";

/** Two atoms at (1,1,1) and (2,2,2) with one bond, in a 10 Å cubic cell. */
function makeSnapshot(box: Float32Array | null): Snapshot {
  return {
    nAtoms: 2,
    nBonds: 1,
    nFileBonds: 1,
    positions: new Float32Array([1, 1, 1, 2, 2, 2]),
    elements: new Uint8Array([6, 8]),
    bonds: new Uint32Array([0, 1]),
    bondOrders: new Uint8Array([2]),
    box,
    atomChainIds: new Uint8Array([65, 66]),
    atomBFactors: new Float32Array([10, 20]),
  } as unknown as Snapshot;
}

const CUBIC = () => new Float32Array([10, 0, 0, 0, 10, 0, 0, 0, 10]);

function makeParticle(box: Float32Array | null, opts: Partial<ParticleData> = {}): ParticleData {
  return {
    type: "particle",
    source: makeSnapshot(box),
    sourceNodeId: "loader-1",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
    ...opts,
  };
}

function makeCell(box: Float32Array): CellData {
  return { type: "cell", sourceNodeId: "loader-1", box, visible: true, axesVisible: true };
}

function params(nx: number, ny: number, nz: number): ReplicateParams {
  return { type: "replicate", nx, ny, nz };
}

/**
 * Two-frame trajectory of the 2-atom snapshot. Frame 0 is the base, frame 1
 * shifts both atoms by +5 in x so we can confirm per-frame motion replicates.
 */
function makeTrajectory(): TrajectoryData {
  const meta: TrajectoryMeta = { nFrames: 2, timestepPs: 1, nAtoms: 2 };
  const frames: Frame[] = [
    { frameId: 0, nAtoms: 2, positions: new Float32Array([1, 1, 1, 2, 2, 2]) },
    { frameId: 1, nAtoms: 2, positions: new Float32Array([6, 1, 1, 7, 2, 2]) },
  ];
  return {
    type: "trajectory",
    provider: new MemoryFrameProvider(frames, meta),
    meta,
    source: "file",
  };
}

function inputs(
  particle?: ParticleData,
  cell?: CellData,
  trajectory?: TrajectoryData,
): Map<string, PipelineData[]> {
  const m = new Map<string, PipelineData[]>();
  if (particle) m.set("particle", [particle]);
  if (cell) m.set("cell", [cell]);
  if (trajectory) m.set("trajectory", [trajectory]);
  return m;
}

describe("executeReplicate", () => {
  it("returns empty output when no particle input", () => {
    const out = executeReplicate(params(2, 2, 2), new Map());
    expect(out.size).toBe(0);
  });

  it("passes the input through unchanged for 1×1×1 (identity)", () => {
    const particle = makeParticle(CUBIC());
    const cell = makeCell(CUBIC());
    const out = executeReplicate(params(1, 1, 1), inputs(particle, cell));
    expect(out.get("particle")).toBe(particle);
    expect(out.get("cell")).toBe(cell);
  });

  it("passes through unchanged when there is no unit cell and counts > 1", () => {
    const particle = makeParticle(null);
    const out = executeReplicate(params(2, 1, 1), inputs(particle));
    expect(out.get("particle")).toBe(particle);
    expect(out.has("cell")).toBe(false);
  });

  it("duplicates atoms and bonds along x for 2×1×1", () => {
    const particle = makeParticle(CUBIC());
    const out = executeReplicate(params(2, 1, 1), inputs(particle, makeCell(CUBIC())));
    const result = out.get("particle") as ParticleData;
    const s = result.source;

    expect(s.nAtoms).toBe(4);
    expect(s.nBonds).toBe(2);
    expect(s.nFileBonds).toBe(2);

    // Second image is the original shifted by +a (10 in x).
    expect(Array.from(s.positions.slice(0, 6))).toEqual([1, 1, 1, 2, 2, 2]);
    expect(Array.from(s.positions.slice(6, 12))).toEqual([11, 1, 1, 12, 2, 2]);

    // Elements + per-atom arrays tiled.
    expect(Array.from(s.elements)).toEqual([6, 8, 6, 8]);
    expect(Array.from(s.atomChainIds!)).toEqual([65, 66, 65, 66]);
    expect(Array.from(s.atomBFactors!)).toEqual([10, 20, 10, 20]);

    // Bonds tiled with +nAtomsOld offset; bond orders tiled.
    expect(Array.from(s.bonds)).toEqual([0, 1, 2, 3]);
    expect(Array.from(s.bondOrders!)).toEqual([2, 2]);
  });

  it("enlarges the cell box to the supercell", () => {
    const particle = makeParticle(CUBIC());
    const out = executeReplicate(params(2, 3, 1), inputs(particle, makeCell(CUBIC())));
    const cell = out.get("cell") as CellData;
    expect(Array.from(cell.box)).toEqual([20, 0, 0, 0, 30, 0, 0, 0, 10]);
    // Snapshot box is enlarged consistently.
    const s = (out.get("particle") as ParticleData).source;
    expect(Array.from(s.box!)).toEqual([20, 0, 0, 0, 30, 0, 0, 0, 10]);
  });

  it("produces nx·ny·nz copies for 2×2×2", () => {
    const particle = makeParticle(CUBIC());
    const out = executeReplicate(params(2, 2, 2), inputs(particle, makeCell(CUBIC())));
    const s = (out.get("particle") as ParticleData).source;
    expect(s.nAtoms).toBe(2 * 8);
    expect(s.nBonds).toBe(1 * 8);
  });

  it("tiles selection indices and overrides with shifted indices", () => {
    const particle = makeParticle(CUBIC(), {
      indices: new Uint32Array([1]),
      scaleOverrides: new Float32Array([1, 2]),
    });
    const out = executeReplicate(params(2, 1, 1), inputs(particle, makeCell(CUBIC())));
    const result = out.get("particle") as ParticleData;
    expect(Array.from(result.indices!)).toEqual([1, 3]);
    expect(Array.from(result.scaleOverrides!)).toEqual([1, 2, 1, 2]);
  });

  it("replicates Cα backbone arrays for cartoon rendering", () => {
    const snap = makeSnapshot(CUBIC());
    snap.caIndices = new Uint32Array([0]);
    snap.caChainIds = new Uint8Array([65]);
    snap.caResNums = new Uint32Array([7]);
    snap.caSsType = new Uint8Array([1]);
    const particle = makeParticle(CUBIC(), { source: snap });
    const out = executeReplicate(params(2, 1, 1), inputs(particle, makeCell(CUBIC())));
    const s = (out.get("particle") as ParticleData).source;
    // caIndices shifted by +nAtomsOld (2) for the second image; rest tiled.
    expect(Array.from(s.caIndices!)).toEqual([0, 2]);
    expect(Array.from(s.caChainIds!)).toEqual([65, 65]);
    expect(Array.from(s.caResNums!)).toEqual([7, 7]);
    expect(Array.from(s.caSsType!)).toEqual([1, 1]);
  });

  it("synthesizes a cell output when none is wired in", () => {
    const particle = makeParticle(CUBIC());
    const out = executeReplicate(params(2, 1, 1), inputs(particle));
    const cell = out.get("cell") as CellData;
    expect(cell.type).toBe("cell");
    expect(Array.from(cell.box)).toEqual([20, 0, 0, 0, 10, 0, 0, 0, 10]);
  });

  it("emits no trajectory output when none is wired in", () => {
    const particle = makeParticle(CUBIC());
    const out = executeReplicate(params(2, 1, 1), inputs(particle, makeCell(CUBIC())));
    expect(out.has("trajectory")).toBe(false);
  });

  it("replicates trajectory frames with the same per-image offsets as the snapshot", () => {
    const particle = makeParticle(CUBIC());
    const out = executeReplicate(
      params(2, 1, 1),
      inputs(particle, makeCell(CUBIC()), makeTrajectory()),
    );
    const traj = out.get("trajectory") as TrajectoryData;
    expect(traj.type).toBe("trajectory");

    // Frame 0: original two atoms, then the +a (10 in x) image.
    const f0 = traj.provider.getFrame(0)!;
    expect(f0.nAtoms).toBe(4);
    expect(Array.from(f0.positions.slice(0, 6))).toEqual([1, 1, 1, 2, 2, 2]);
    expect(Array.from(f0.positions.slice(6, 12))).toEqual([11, 1, 1, 12, 2, 2]);

    // Frame 1 (atoms shifted +5 in x): the image is still shifted by +a on top.
    const f1 = traj.provider.getFrame(1)!;
    expect(Array.from(f1.positions.slice(0, 6))).toEqual([6, 1, 1, 7, 2, 2]);
    expect(Array.from(f1.positions.slice(6, 12))).toEqual([16, 1, 1, 17, 2, 2]);
  });

  it("scales trajectory meta nAtoms by the image count, preserving nFrames", () => {
    const particle = makeParticle(CUBIC());
    const out = executeReplicate(
      params(2, 2, 2),
      inputs(particle, makeCell(CUBIC()), makeTrajectory()),
    );
    const traj = out.get("trajectory") as TrajectoryData;
    expect(traj.meta.nAtoms).toBe(2 * 8);
    expect(traj.meta.nFrames).toBe(2);
    expect(traj.source).toBe("file");
  });

  it("preserves the provider's streaming kind", () => {
    const particle = makeParticle(CUBIC());
    const out = executeReplicate(
      params(2, 1, 1),
      inputs(particle, makeCell(CUBIC()), makeTrajectory()),
    );
    const traj = out.get("trajectory") as TrajectoryData;
    expect(traj.provider.kind).toBe("memory");
  });

  it("returns null from the replicated provider when the source has no frame", () => {
    const particle = makeParticle(CUBIC());
    const out = executeReplicate(
      params(2, 1, 1),
      inputs(particle, makeCell(CUBIC()), makeTrajectory()),
    );
    const traj = out.get("trajectory") as TrajectoryData;
    expect(traj.provider.getFrame(99)).toBeNull();
  });

  it("passes the trajectory through unchanged for 1×1×1 (identity)", () => {
    const particle = makeParticle(CUBIC());
    const trajectory = makeTrajectory();
    const out = executeReplicate(params(1, 1, 1), inputs(particle, makeCell(CUBIC()), trajectory));
    expect(out.get("trajectory")).toBe(trajectory);
  });

  it("passes the trajectory through unchanged when there is no unit cell", () => {
    const particle = makeParticle(null);
    const trajectory = makeTrajectory();
    const out = executeReplicate(params(2, 1, 1), inputs(particle, undefined, trajectory));
    expect(out.get("trajectory")).toBe(trajectory);
  });
});
