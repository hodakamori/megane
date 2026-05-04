import { describe, it, expect } from "vitest";
import { executeColor } from "@/pipeline/executors/color";
import type { ColorParams, ParticleData, PipelineData } from "@/pipeline/types";
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
    representationOverride: null,
    ...opts,
  };
}

function baseParams(extra: Partial<ColorParams> = {}): ColorParams {
  return {
    type: "color",
    mode: "uniform",
    uniformColor: "#ff0000",
    ...extra,
  };
}

function inputs(particle: ParticleData): Map<string, PipelineData[]> {
  return new Map([["in", [particle]]]);
}

describe("executeColor", () => {
  it("returns no output when there is no input", () => {
    const out = executeColor(baseParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("returns no output when the input is not a particle", () => {
    const bondInput = new Map<string, PipelineData[]>([
      [
        "in",
        [
          {
            type: "bond",
            sourceNodeId: "src",
            bondIndices: new Uint32Array(),
            bondOrders: null,
            nBonds: 0,
            scale: 1.0,
            opacity: 1.0,
            positions: null,
            elements: null,
            nAtoms: 0,
            atomElements: null,
            selectedBondIndices: null,
            bondOpacityOverrides: null,
          } as PipelineData,
        ],
      ],
    ]);
    const out = executeColor(baseParams(), bondInput);
    expect(out.size).toBe(0);
  });

  it("paints every atom in uniform mode when indices is null", () => {
    const out = executeColor(
      baseParams({ uniformColor: "#ff0000" }),
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
    const out = executeColor(
      baseParams({ uniformColor: "#00ff00" }),
      inputs(particle),
    );
    const result = out.get("out") as ParticleData;
    const buf = result.colorOverrides!;
    expect(buf[1]).toBe(1);
    expect(buf[7]).toBe(1);
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
    const out = executeColor(
      baseParams({ uniformColor: "#ff0000" }),
      inputs(particle),
    );
    const result = out.get("out") as ParticleData;
    const buf = result.colorOverrides!;
    expect(buf[0]).toBe(1);
    expect(buf[3]).toBe(0.5);
    expect(buf[4]).toBe(0.5);
    expect(buf[5]).toBe(0.5);
  });

  it("does not mutate the upstream colorOverrides buffer", () => {
    const upstream = new Float32Array(12);
    upstream.fill(NO_OVERRIDE);
    const particle = makeParticle({ colorOverrides: upstream });
    executeColor(baseParams({ uniformColor: "#ff0000" }), inputs(particle));
    for (let i = 0; i < upstream.length; i++) {
      expect(Number.isNaN(upstream[i])).toBe(true);
    }
  });

  it("byResidue uses the supplied atomLabels to choose a palette entry", () => {
    const labels = ["ALA1", "ALA1", "GLY2", "GLY2"];
    const out = executeColor(
      baseParams({ mode: "byResidue" }),
      inputs(makeParticle()),
      labels,
    );
    const result = out.get("out") as ParticleData;
    const buf = result.colorOverrides!;
    expect(buf[0]).toBeCloseTo(0.78, 5);
    expect(buf[6]).toBeCloseTo(1, 5);
  });

  it("preserves representationOverride from the upstream stream", () => {
    const particle = makeParticle({ representationOverride: "surface" });
    const out = executeColor(baseParams(), inputs(particle));
    const result = out.get("out") as ParticleData;
    expect(result.representationOverride).toBe("surface");
  });
});
