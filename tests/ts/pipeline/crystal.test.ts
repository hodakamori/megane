import { describe, it, expect } from "vitest";
import { expandCrystal } from "@/pipeline/crystal";
import type { Snapshot } from "@/types";

/** A simple orthorhombic 10×10×10 cell with two atoms. */
function makeCubicSnapshot(overrides: Partial<Snapshot> = {}): Snapshot {
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

describe("expandCrystal", () => {
  it("returns the original snapshot when na=nb=nc=1", () => {
    const snap = makeCubicSnapshot();
    const out = expandCrystal(snap, { na: 1, nb: 1, nc: 1 });
    expect(out).toBe(snap);
  });

  it("returns the original when the structure has no cell", () => {
    const snap = makeCubicSnapshot({ box: null });
    const out = expandCrystal(snap, { na: 2, nb: 2, nc: 2 });
    expect(out).toBe(snap);
  });

  it("replicates atoms and bonds across an na×nb×nc grid", () => {
    const snap = makeCubicSnapshot();
    const out = expandCrystal(snap, { na: 2, nb: 1, nc: 1 });
    expect(out.nAtoms).toBe(4); // 2 atoms × 2 cells
    expect(out.bonds.length).toBe(4); // 1 bond × 2 cells × 2 indices
    expect(Array.from(out.bonds)).toEqual([0, 1, 2, 3]);
    // The replicated copy is shifted by one cell along a (+10 in x).
    expect(out.positions[6]).toBeCloseTo(10); // atom0 of image1: x = 0 + 10
    expect(out.positions[9]).toBeCloseTo(11); // atom1 of image1: x = 1 + 10
  });

  it("enlarges the cell box by the repeat counts", () => {
    const snap = makeCubicSnapshot();
    const out = expandCrystal(snap, { na: 2, nb: 3, nc: 1 });
    expect(out.box![0]).toBeCloseTo(20);
    expect(out.box![4]).toBeCloseTo(30);
    expect(out.box![8]).toBeCloseTo(10);
    expect(out.nAtoms).toBe(2 * 6);
  });

  it("tiles per-atom auxiliary arrays when present", () => {
    const snap = makeCubicSnapshot({
      atomChainIds: new Uint8Array([65, 66]),
      atomBFactors: new Float32Array([10, 20]),
    });
    const out = expandCrystal(snap, { na: 2, nb: 1, nc: 1 });
    expect(Array.from(out.atomChainIds!)).toEqual([65, 66, 65, 66]);
    expect(Array.from(out.atomBFactors!)).toEqual([10, 20, 10, 20]);
  });

  it("preserves bond orders across images", () => {
    const snap = makeCubicSnapshot();
    const out = expandCrystal(snap, { na: 1, nb: 2, nc: 1 });
    expect(out.bondOrders).not.toBeNull();
    expect(Array.from(out.bondOrders!)).toEqual([1, 1]);
  });
});
