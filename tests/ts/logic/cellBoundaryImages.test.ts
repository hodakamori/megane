import { describe, expect, it } from "vitest";
import {
  generateCellBoundaryImages,
  generateDrawingBoundaryImages,
} from "../../../src/logic/cellBoundaryImages";
import type { Snapshot } from "../../../src/types";

function snapshot(positions: number[], box: number[] = [10, 0, 0, 0, 10, 0, 0, 0, 10]): Snapshot {
  const nAtoms = positions.length / 3;
  return {
    nAtoms,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(positions),
    elements: new Uint8Array(nAtoms).fill(8),
    bonds: new Uint32Array(),
    bondOrders: null,
    box: new Float32Array(box),
    boxOrigin: null,
    atomChainIds: null,
    atomBFactors: null,
  };
}

describe("generateCellBoundaryImages", () => {
  it("adds one periodic copy for a site on a cell face", () => {
    const result = generateCellBoundaryImages(snapshot([0, 5, 5]));
    expect(Array.from(result.positions)).toEqual([10, 5, 5]);
    expect(Array.from(result.sourceIndices)).toEqual([0]);
    expect(Array.from(result.latticeShifts)).toEqual([1, 0, 0]);
  });

  it("adds three periodic copies for a site on a cell edge", () => {
    const result = generateCellBoundaryImages(snapshot([0, 0, 5]));
    expect(result.positions.length / 3).toBe(3);
    expect(Array.from(result.positions)).toEqual([0, 10, 5, 10, 0, 5, 10, 10, 5]);
  });

  it("adds seven periodic copies for a site on a cell corner", () => {
    const result = generateCellBoundaryImages(snapshot([0, 0, 0]));
    expect(result.positions.length / 3).toBe(7);
    expect(new Set(result.sourceIndices)).toEqual(new Set([0]));
  });

  it("does not copy an interior site", () => {
    const result = generateCellBoundaryImages(snapshot([2, 3, 4]));
    expect(result.positions).toHaveLength(0);
  });

  it("does not duplicate a target position already present in the file", () => {
    const result = generateCellBoundaryImages(snapshot([0, 5, 5, 10, 5, 5]));
    expect(result.positions).toHaveLength(0);
  });

  it("uses full triclinic lattice-vector translations", () => {
    const result = generateCellBoundaryImages(
      snapshot([0.25, 0.125, 2.5], [4, 0, 0, 1, 3, 0, 0.5, 0.25, 5]),
    );
    expect(Array.from(result.positions)).toEqual([
      1.25, 3.125, 2.5, 4.25, 0.125, 2.5, 5.25, 3.125, 2.5,
    ]);
  });

  it("supports arbitrary inclusive fractional ranges", () => {
    const result = generateDrawingBoundaryImages(snapshot([2.5, 5, 5]), [0, 0, 0], [2, 1, 1]);
    expect(result.min).toEqual([0, 0, 0]);
    expect(result.max).toEqual([2, 1, 1]);
    expect(Array.from(result.sourceVisibleMask)).toEqual([1]);
    expect(Array.from(result.images.positions)).toEqual([12.5, 5, 5]);
    expect(Array.from(result.images.latticeShifts)).toEqual([1, 0, 0]);
  });

  it("uses a periodic image when the untranslated atom lies outside the range", () => {
    const result = generateDrawingBoundaryImages(snapshot([7.5, 5, 5]), [-0.5, 0, 0], [0.5, 1, 1]);
    expect(Array.from(result.sourceVisibleMask)).toEqual([0]);
    expect(Array.from(result.images.positions)).toEqual([-2.5, 5, 5]);
    expect(Array.from(result.images.sourceIndices)).toEqual([0]);
    expect(Array.from(result.images.latticeShifts)).toEqual([-1, 0, 0]);
  });
});
