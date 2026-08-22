import { describe, expect, it } from "vitest";
import { executeDrawingBoundary } from "@/pipeline/executors/drawingBoundary";
import type { DrawingBoundaryParams, ParticleData, PipelineData } from "@/pipeline/types";
import type { Snapshot } from "@/types";

function particle(box: Float32Array | null): ParticleData {
  const source: Snapshot = {
    nAtoms: 1,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array([0, 5, 5]),
    elements: new Uint8Array([8]),
    bonds: new Uint32Array(),
    bondOrders: null,
    box,
    boxOrigin: null,
    atomChainIds: null,
    atomBFactors: null,
  };
  return {
    type: "particle",
    source,
    sourceNodeId: "load",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
  };
}

const params: DrawingBoundaryParams = {
  type: "drawing_boundary",
  xMin: 0,
  xMax: 1,
  yMin: 0,
  yMax: 1,
  zMin: 0,
  zMax: 1,
};

describe("executeDrawingBoundary", () => {
  it("attaches copy data without changing the structural atom count", () => {
    const input = particle(new Float32Array([10, 0, 0, 0, 10, 0, 0, 0, 10]));
    const output = executeDrawingBoundary(
      params,
      new Map<string, PipelineData[]>([["particle", [input]]]),
    ).get("particle") as ParticleData;

    expect(output.source).toBe(input.source);
    expect(output.source.nAtoms).toBe(1);
    expect(output.drawingBoundary?.images.sourceIndices).toEqual(new Uint32Array([0]));
    expect(Array.from(output.drawingBoundary!.images.positions)).toEqual([10, 5, 5]);
  });

  it("passes non-periodic structures through without copy data", () => {
    const input = particle(null);
    const output = executeDrawingBoundary(
      params,
      new Map<string, PipelineData[]>([["particle", [input]]]),
    ).get("particle") as ParticleData;
    expect(output.source).toBe(input.source);
    expect(output.drawingBoundary).toBeNull();
  });
});
