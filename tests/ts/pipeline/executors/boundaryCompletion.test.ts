import { describe, expect, it } from "vitest";
import type { Snapshot } from "@/types";
import type { BondData, ParticleData } from "@/pipeline/types";
import { generateDrawingBoundaryImages } from "@/logic/cellBoundaryImages";
import { executeAddBond } from "@/pipeline/executors/addBond";
import { executeBoundaryCompletion } from "@/pipeline/executors/boundaryCompletion";

function particle(snapshot: Snapshot, minX: number, maxX: number): ParticleData {
  return {
    type: "particle",
    source: snapshot,
    sourceNodeId: "load",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
    drawingBoundary: generateDrawingBoundaryImages(snapshot, [minX, -0.1, -0.1], [maxX, 0.1, 0.1]),
  };
}

function addStructureBonds(value: ParticleData): BondData {
  const result = executeAddBond(
    { type: "add_bond", bondSource: "structure" },
    new Map([["particle", [value]]]),
  );
  return result.get("bond") as BondData;
}

describe("Boundary Completion", () => {
  it("completes a finite molecule with display copies without moving structural atoms", () => {
    const snapshot: Snapshot = {
      nAtoms: 2,
      nBonds: 1,
      nFileBonds: 1,
      positions: new Float32Array([0.5, 0, 0, 9.5, 0, 0]),
      elements: new Uint8Array([6, 8]),
      bonds: new Uint32Array([0, 1]),
      bondOrders: null,
      box: new Float32Array([10, 0, 0, 0, 10, 0, 0, 0, 10]),
      boxOrigin: null,
    };
    const input = particle(snapshot, 0, 0.1);
    const bond = addStructureBonds(input);
    expect(Array.from(bond.periodicTopology!.targetLatticeShifts)).toEqual([-1, 0, 0]);

    const result = executeBoundaryCompletion(
      { type: "boundary_completion", mode: "components" },
      new Map([
        ["particle", [input]],
        ["bond", [bond]],
      ]),
    );
    const completed = result.get("particle") as ParticleData;
    const completedBond = result.get("bond") as BondData;

    expect(Array.from(snapshot.positions)).toEqual([0.5, 0, 0, 9.5, 0, 0]);
    expect(Array.from(completed.drawingBoundary!.sourceVisibleMask)).toEqual([1, 0]);
    expect(Array.from(completed.drawingBoundary!.images.sourceIndices)).toEqual([1]);
    expect(Array.from(completed.drawingBoundary!.images.latticeShifts)).toEqual([-1, 0, 0]);
    expect(Array.from(completed.drawingBoundary!.images.positions)).toEqual([-0.5, 0, 0]);
    expect(completedBond.nBonds).toBe(1);
  });

  it("does not component-expand a network with non-zero lattice winding", () => {
    const snapshot: Snapshot = {
      nAtoms: 3,
      nBonds: 3,
      nFileBonds: 3,
      positions: new Float32Array([0.3, 0, 0, 1.5, 0, 0, 2.7, 0, 0]),
      elements: new Uint8Array([6, 6, 6]),
      bonds: new Uint32Array([0, 1, 1, 2, 0, 2]),
      bondOrders: null,
      box: new Float32Array([3, 0, 0, 0, 3, 0, 0, 0, 3]),
      boxOrigin: null,
    };
    const input = particle(snapshot, 0.09, 0.11);
    const bond = addStructureBonds(input);
    const result = executeBoundaryCompletion(
      { type: "boundary_completion", mode: "components" },
      new Map([
        ["particle", [input]],
        ["bond", [bond]],
      ]),
    );
    const completed = result.get("particle") as ParticleData;

    expect(Array.from(completed.drawingBoundary!.sourceVisibleMask)).toEqual([1, 0, 0]);
    expect(completed.drawingBoundary!.images.sourceIndices).toHaveLength(0);
  });

  it("can complete one neighbor shell even for a periodic network", () => {
    const snapshot: Snapshot = {
      nAtoms: 3,
      nBonds: 3,
      nFileBonds: 3,
      positions: new Float32Array([0.3, 0, 0, 1.5, 0, 0, 2.7, 0, 0]),
      elements: new Uint8Array([6, 6, 6]),
      bonds: new Uint32Array([0, 1, 1, 2, 0, 2]),
      bondOrders: null,
      box: new Float32Array([3, 0, 0, 0, 3, 0, 0, 0, 3]),
      boxOrigin: null,
    };
    const input = particle(snapshot, 0.09, 0.11);
    const bond = addStructureBonds(input);
    const result = executeBoundaryCompletion(
      { type: "boundary_completion", mode: "neighbors" },
      new Map([
        ["particle", [input]],
        ["bond", [bond]],
      ]),
    );
    const completed = result.get("particle") as ParticleData;

    expect(Array.from(completed.drawingBoundary!.sourceVisibleMask)).toEqual([1, 1, 0]);
    expect(Array.from(completed.drawingBoundary!.images.sourceIndices)).toEqual([2]);
    expect(Array.from(completed.drawingBoundary!.images.latticeShifts)).toEqual([-1, 0, 0]);
  });

  it("retains multiple periodic images of the same distance-inferred pair", () => {
    const snapshot: Snapshot = {
      nAtoms: 2,
      nBonds: 0,
      nFileBonds: 0,
      positions: new Float32Array([0.5, 0, 0, 1.5, 0, 0]),
      elements: new Uint8Array([6, 6]),
      bonds: new Uint32Array(),
      bondOrders: null,
      box: new Float32Array([2, 0, 0, 0, 5, 0, 0, 0, 5]),
      boxOrigin: null,
    };
    const input = particle(snapshot, 0, 1);
    const result = executeAddBond(
      { type: "add_bond", bondSource: "distance", vdwScale: 0.6 },
      new Map([["particle", [input]]]),
    );
    const bond = result.get("bond") as BondData;

    expect(Array.from(bond.periodicTopology!.bondIndices)).toEqual([0, 1, 0, 1]);
    expect(Array.from(bond.periodicTopology!.targetLatticeShifts)).toEqual([-1, 0, 0, 0, 0, 0]);
  });
});
