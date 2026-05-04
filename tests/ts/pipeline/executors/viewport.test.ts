import { describe, it, expect } from "vitest";
import { executeViewport } from "@/pipeline/executors/viewport";
import type {
  ParticleData,
  PipelineData,
  ViewportParams,
  RepresentationMode,
} from "@/pipeline/types";
import type { Snapshot } from "@/types";

function makeSnapshot(): Snapshot {
  return {
    nAtoms: 2,
    nBonds: 0,
    positions: new Float32Array(6),
    elements: new Uint8Array([6, 6]),
    bonds: new Uint32Array(),
    bondOrders: null,
  } as unknown as Snapshot;
}

function makeParticle(
  sourceNodeId: string,
  representationOverride: RepresentationMode | null = null,
): ParticleData {
  return {
    type: "particle",
    source: makeSnapshot(),
    sourceNodeId,
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride,
  };
}

const baseParams: ViewportParams = {
  type: "viewport",
  perspective: false,
  cellAxesVisible: true,
  pivotMarkerVisible: true,
};

function inputs(particles: ParticleData[]): Map<string, PipelineData[]> {
  return new Map([["particle", particles as PipelineData[]]]);
}

describe("executeViewport — representation pickup", () => {
  it('falls back to "atoms" when no particle stream carries an override', () => {
    const state = executeViewport(baseParams, inputs([makeParticle("a")]));
    expect(state.representationMode).toBe("atoms");
  });

  it("picks the first particle stream's override (Ovito-style)", () => {
    const state = executeViewport(
      baseParams,
      inputs([makeParticle("a", "cartoon"), makeParticle("b", "surface")]),
    );
    expect(state.representationMode).toBe("cartoon");
  });

  it("ignores null overrides and uses the first non-null one", () => {
    const state = executeViewport(
      baseParams,
      inputs([makeParticle("a", null), makeParticle("b", "surface")]),
    );
    expect(state.representationMode).toBe("surface");
  });

  it('returns "atoms" when there are no particle inputs at all', () => {
    const state = executeViewport(baseParams, new Map());
    expect(state.representationMode).toBe("atoms");
  });
});
