import { describe, expect, it } from "vitest";
import { generateDrawingBoundaryImages } from "@/logic/cellBoundaryImages";
import { executeAddBond } from "@/pipeline/executors/addBond";
import type { BondData, ParticleData, PipelineData } from "@/pipeline/types";
import type { Snapshot } from "@/types";

describe("AddBond with Drawing Boundary copies", () => {
  it("repeats topology bonds over the shared periodic atom collection", () => {
    const snapshot: Snapshot = {
      nAtoms: 2,
      nBonds: 1,
      nFileBonds: 1,
      positions: new Float32Array([0, 1, 1, 0, 2, 1]),
      elements: new Uint8Array([8, 1]),
      bonds: new Uint32Array([0, 1]),
      bondOrders: new Uint8Array([1]),
      box: new Float32Array([4, 0, 0, 0, 4, 0, 0, 0, 4]),
      boxOrigin: null,
      atomChainIds: null,
      atomBFactors: null,
    };
    const particle: ParticleData = {
      type: "particle",
      source: snapshot,
      sourceNodeId: "load",
      indices: null,
      scaleOverrides: null,
      opacityOverrides: null,
      colorOverrides: null,
      representationOverride: null,
      drawingBoundary: generateDrawingBoundaryImages(snapshot),
    };
    const output = executeAddBond(
      { type: "add_bond", bondSource: "structure" },
      new Map<string, PipelineData[]>([["particle", [particle]]]),
    ).get("bond") as BondData;

    expect(output.nBonds).toBe(2);
    expect(Array.from(output.bondIndices)).toEqual([0, 1, 2, 3]);
    expect(output.nAtoms).toBe(4);
    expect(Array.from(output.positions!)).toEqual([0, 1, 1, 0, 2, 1, 4, 1, 1, 4, 2, 1]);
  });
});
