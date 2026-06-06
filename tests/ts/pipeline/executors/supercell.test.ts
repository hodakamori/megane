import { describe, it, expect } from "vitest";
import { executeSupercell } from "@/pipeline/executors/supercell";
import type { SupercellParams, ParticleData, PipelineData } from "@/pipeline/types";
import type { Snapshot } from "@/types";

function makeSnapshot(overrides: Partial<Snapshot> = {}): Snapshot {
  return {
    nAtoms: 2,
    nBonds: 1,
    nFileBonds: 1,
    positions: new Float32Array([0, 0, 0, 1, 2, 3]),
    elements: new Uint8Array([11, 17]),
    bonds: new Uint32Array([0, 1]),
    bondOrders: new Uint8Array([1]),
    box: new Float32Array([10, 0, 0, 0, 10, 0, 0, 0, 10]),
    atomChainIds: null,
    atomBFactors: null,
    ...overrides,
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
    representationOverride: "atoms",
  };
}

function makeInputs(particle: ParticleData): Map<string, PipelineData[]> {
  return new Map([["in", [particle]]]);
}

const params = (over: Partial<SupercellParams> = {}): SupercellParams => ({
  type: "supercell",
  na: 1,
  nb: 1,
  nc: 1,
  ...over,
});

describe("executeSupercell", () => {
  it("returns no output when there is no input", () => {
    const out = executeSupercell(params(), new Map());
    expect(out.size).toBe(0);
  });

  it("ignores non-particle input", () => {
    const inputs = new Map<string, PipelineData[]>([
      ["in", [{ type: "bond" } as unknown as PipelineData]],
    ]);
    const out = executeSupercell(params({ na: 2 }), inputs);
    expect(out.size).toBe(0);
  });

  it("passes the particle through unchanged when na=nb=nc=1 and symmetry off", () => {
    const particle = makeParticle(makeSnapshot());
    const out = executeSupercell(params(), makeInputs(particle));
    expect(out.get("out")).toBe(particle);
  });

  it("produces an expanded particle with a fresh snapshot", () => {
    const particle = makeParticle(makeSnapshot());
    const out = executeSupercell(params({ na: 2, nb: 2, nc: 1 }), makeInputs(particle));
    const result = out.get("out") as ParticleData;
    expect(result.type).toBe("particle");
    expect(result.source).not.toBe(particle.source);
    expect(result.source.nAtoms).toBe(8); // 2 atoms × 4 cells
    // Per-atom overrides are reset because indices no longer map.
    expect(result.indices).toBeNull();
    expect(result.scaleOverrides).toBeNull();
    // Representation opinion is preserved.
    expect(result.representationOverride).toBe("atoms");
  });
});
