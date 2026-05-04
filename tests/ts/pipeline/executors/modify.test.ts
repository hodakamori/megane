import { describe, it, expect } from "vitest";
import { executeModify } from "@/pipeline/executors/modify";
import type { ModifyParams, ParticleData, BondData, PipelineData } from "@/pipeline/types";
import type { Snapshot } from "@/types";

function makeSnapshot(): Snapshot {
  return {
    nAtoms: 4,
    nBonds: 0,
    positions: new Float32Array(12),
    elements: new Uint8Array([1, 6, 7, 8]),
    bonds: new Uint32Array(),
    bondOrders: null,
    atomBFactors: new Float32Array([0, 25, 50, 100]),
    atomChainIds: new Uint8Array([65, 65, 66, 66]),
  } as unknown as Snapshot;
}

function makeParticle(opts: Partial<ParticleData> = {}): ParticleData {
  return {
    type: "particle",
    source: makeSnapshot(),
    sourceNodeId: "src",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
    ...opts,
  };
}

function makeBond(opts: Partial<BondData> = {}): BondData {
  return {
    type: "bond",
    sourceNodeId: "src",
    bondIndices: new Uint32Array([0, 1, 2, 3]),
    bondOrders: null,
    nBonds: 2,
    scale: 1.0,
    opacity: 1.0,
    positions: null,
    elements: null,
    nAtoms: 0,
    atomElements: null,
    selectedBondIndices: null,
    bondOpacityOverrides: null,
    ...opts,
  };
}

function baseParams(extra: Partial<ModifyParams> = {}): ModifyParams {
  return {
    type: "modify",
    scale: 1.0,
    opacity: 1.0,
    ...extra,
  };
}

function inputs(data: PipelineData): Map<string, PipelineData[]> {
  return new Map([["in", [data]]]);
}

describe("executeModify — particle scale & opacity", () => {
  it("returns no output when there is no input", () => {
    const out = executeModify(baseParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("paints the scale across all atoms when indices is null and scale != 1.0", () => {
    const out = executeModify(baseParams({ scale: 1.5 }), inputs(makeParticle()));
    const result = out.get("out") as ParticleData;
    expect(result.scaleOverrides).not.toBeNull();
    expect(Array.from(result.scaleOverrides!)).toEqual([1.5, 1.5, 1.5, 1.5]);
  });

  it("does not allocate a scale buffer when scale === 1.0 and indices is null", () => {
    const out = executeModify(baseParams(), inputs(makeParticle()));
    const result = out.get("out") as ParticleData;
    expect(result.scaleOverrides).toBeNull();
  });

  it("paints scale only on the selected indices when indices is non-null", () => {
    const particle = makeParticle({ indices: new Uint32Array([1, 3]) });
    const out = executeModify(baseParams({ scale: 0.5 }), inputs(particle));
    const result = out.get("out") as ParticleData;
    expect(result.scaleOverrides).not.toBeNull();
    expect(Array.from(result.scaleOverrides!)).toEqual([1.0, 0.5, 1.0, 0.5]);
  });

  it("paints opacity only on the selected indices when indices is non-null", () => {
    const particle = makeParticle({ indices: new Uint32Array([0, 2]) });
    const out = executeModify(baseParams({ opacity: 0.3 }), inputs(particle));
    const result = out.get("out") as ParticleData;
    expect(result.opacityOverrides).not.toBeNull();
    const arr = Array.from(result.opacityOverrides!);
    expect(arr[0]).toBeCloseTo(0.3, 6);
    expect(arr[1]).toBeCloseTo(1.0, 6);
    expect(arr[2]).toBeCloseTo(0.3, 6);
    expect(arr[3]).toBeCloseTo(1.0, 6);
  });

  it("preserves the upstream representationOverride", () => {
    const particle = makeParticle({ representationOverride: "cartoon" });
    const out = executeModify(baseParams({ scale: 1.5 }), inputs(particle));
    const result = out.get("out") as ParticleData;
    expect(result.representationOverride).toBe("cartoon");
  });
});

describe("executeModify — bond scale & opacity", () => {
  it("applies scale and opacity to a global bond stream", () => {
    const out = executeModify(baseParams({ scale: 2.0, opacity: 0.5 }), inputs(makeBond()));
    const result = out.get("out") as BondData;
    expect(result.scale).toBe(2.0);
    expect(result.opacity).toBe(0.5);
    expect(result.bondOpacityOverrides).toBeNull();
  });

  it("paints per-bond opacity when selectedBondIndices is set", () => {
    const bond = makeBond({ selectedBondIndices: new Uint32Array([1]) });
    const out = executeModify(baseParams({ scale: 1.0, opacity: 0.25 }), inputs(bond));
    const result = out.get("out") as BondData;
    expect(result.bondOpacityOverrides).not.toBeNull();
    expect(Array.from(result.bondOpacityOverrides!)).toEqual([1.0, 0.25]);
  });
});
