import { describe, it, expect } from "vitest";
import { executeModify } from "@/pipeline/executors/modify";
import type { ModifyParams, ParticleData, PipelineData } from "@/pipeline/types";
import { NO_OVERRIDE } from "@/pipeline/colorWriter";
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
    ...opts,
  };
}

function baseParams(extra: Partial<ModifyParams> = {}): ModifyParams {
  return {
    type: "modify",
    scale: 1.0,
    opacity: 1.0,
    colorEnabled: false,
    colorMode: "uniform",
    uniformColor: "#ff8800",
    ...extra,
  };
}

function inputs(particle: ParticleData): Map<string, PipelineData[]> {
  return new Map([["in", [particle as PipelineData]]]);
}

describe("executeModify — color branch", () => {
  it("emits null colorOverrides when colorEnabled is false", () => {
    const out = executeModify(baseParams(), inputs(makeParticle()));
    const result = out.get("out") as ParticleData;
    expect(result.colorOverrides).toBeNull();
  });

  it("paints every atom in uniform mode when indices is null", () => {
    const out = executeModify(
      baseParams({ colorEnabled: true, colorMode: "uniform", uniformColor: "#ff0000" }),
      inputs(makeParticle()),
    );
    const result = out.get("out") as ParticleData;
    const buf = result.colorOverrides!;
    expect(buf.length).toBe(12);
    for (let i = 0; i < 4; i++) {
      const i3 = i * 3;
      expect(buf[i3]).toBe(1);
      expect(buf[i3 + 1]).toBe(0);
      expect(buf[i3 + 2]).toBe(0);
    }
  });

  it("paints only the selected indices when indices is non-null", () => {
    const particle = makeParticle({ indices: new Uint32Array([0, 2]) });
    const out = executeModify(
      baseParams({ colorEnabled: true, colorMode: "uniform", uniformColor: "#00ff00" }),
      inputs(particle),
    );
    const result = out.get("out") as ParticleData;
    const buf = result.colorOverrides!;
    // atoms 0 and 2 painted green
    expect(buf[0]).toBe(0);
    expect(buf[1]).toBe(1);
    expect(buf[2]).toBe(0);
    expect(buf[6]).toBe(0);
    expect(buf[7]).toBe(1);
    expect(buf[8]).toBe(0);
    // atoms 1 and 3 untouched (NaN sentinel)
    expect(Number.isNaN(buf[3])).toBe(true);
    expect(Number.isNaN(buf[9])).toBe(true);
  });

  it("preserves upstream colorOverrides for unselected atoms", () => {
    const upstream = new Float32Array(12);
    upstream.fill(NO_OVERRIDE);
    upstream[3] = 0.5;
    upstream[4] = 0.5;
    upstream[5] = 0.5;

    const particle = makeParticle({
      indices: new Uint32Array([0]),
      colorOverrides: upstream,
    });
    const out = executeModify(
      baseParams({ colorEnabled: true, colorMode: "uniform", uniformColor: "#ff0000" }),
      inputs(particle),
    );
    const result = out.get("out") as ParticleData;
    const buf = result.colorOverrides!;
    // Atom 0: newly painted red.
    expect(buf[0]).toBe(1);
    // Atom 1: upstream gray preserved (writer never visited it).
    expect(buf[3]).toBe(0.5);
    expect(buf[4]).toBe(0.5);
    expect(buf[5]).toBe(0.5);
  });

  it("does not mutate the upstream colorOverrides buffer", () => {
    const upstream = new Float32Array(12);
    upstream.fill(NO_OVERRIDE);

    const particle = makeParticle({ colorOverrides: upstream });
    executeModify(
      baseParams({ colorEnabled: true, colorMode: "uniform", uniformColor: "#ff0000" }),
      inputs(particle),
    );
    // Upstream still all-NaN — executor must clone.
    for (let i = 0; i < upstream.length; i++) {
      expect(Number.isNaN(upstream[i])).toBe(true);
    }
  });

  it("byResidue uses the supplied atomLabels to choose a palette entry", () => {
    const labels = ["ALA1", "ALA1", "GLY2", "GLY2"];
    const out = executeModify(
      baseParams({ colorEnabled: true, colorMode: "byResidue" }),
      inputs(makeParticle()),
      labels,
    );
    const result = out.get("out") as ParticleData;
    const buf = result.colorOverrides!;
    // atom 0 (ALA) palette = [0.78,0.78,0.78]; atom 2 (GLY) palette = [1,1,1]
    expect(buf[0]).toBeCloseTo(0.78, 5);
    expect(buf[6]).toBeCloseTo(1, 5);
  });

  it("still propagates scale and opacity overrides alongside the color branch", () => {
    const particle = makeParticle({ indices: new Uint32Array([1]) });
    const out = executeModify(
      baseParams({
        scale: 1.5,
        opacity: 0.3,
        colorEnabled: true,
        colorMode: "uniform",
        uniformColor: "#0000ff",
      }),
      inputs(particle),
    );
    const result = out.get("out") as ParticleData;
    expect(result.scaleOverrides![1]).toBeCloseTo(1.5, 6);
    expect(result.opacityOverrides![1]).toBeCloseTo(0.3, 6);
    expect(result.colorOverrides![3]).toBe(0);
    expect(result.colorOverrides![5]).toBe(1);
  });
});
