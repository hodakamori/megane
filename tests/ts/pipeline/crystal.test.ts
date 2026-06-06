import { describe, it, expect } from "vitest";
import { parseSymop, invert3x3, expandCrystal } from "@/pipeline/crystal";
import type { Snapshot } from "@/types";

/** A simple orthorhombic 10×10×10 cell with two atoms in the asymmetric unit. */
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

describe("parseSymop", () => {
  it("parses the identity operation", () => {
    expect(parseSymop("x,y,z")).toEqual({
      rot: [1, 0, 0, 0, 1, 0, 0, 0, 1],
      trans: [0, 0, 0],
    });
  });

  it("parses inversion", () => {
    expect(parseSymop("-x,-y,-z")).toEqual({
      rot: [-1, 0, 0, 0, -1, 0, 0, 0, -1],
      trans: [0, 0, 0],
    });
  });

  it("parses fractional translations and mixed order", () => {
    const op = parseSymop("-x+1/2,y+1/2,-z")!;
    expect(op.rot).toEqual([-1, 0, 0, 0, 1, 0, 0, 0, -1]);
    expect(op.trans[0]).toBeCloseTo(0.5);
    expect(op.trans[1]).toBeCloseTo(0.5);
    expect(op.trans[2]).toBeCloseTo(0);
  });

  it("handles constant-before-variable ordering", () => {
    const op = parseSymop("1/2-y,x,z")!;
    expect(op.rot).toEqual([0, -1, 0, 1, 0, 0, 0, 0, 1]);
    expect(op.trans[0]).toBeCloseTo(0.5);
  });

  it("returns null for malformed operations", () => {
    expect(parseSymop("x,y")).toBeNull();
  });
});

describe("invert3x3", () => {
  it("inverts a diagonal matrix", () => {
    const inv = invert3x3([2, 0, 0, 0, 4, 0, 0, 0, 5])!;
    expect(inv[0]).toBeCloseTo(0.5);
    expect(inv[4]).toBeCloseTo(0.25);
    expect(inv[8]).toBeCloseTo(0.2);
  });

  it("returns null for a singular matrix", () => {
    expect(invert3x3([1, 2, 3, 2, 4, 6, 0, 0, 0])).toBeNull();
  });
});

describe("expandCrystal", () => {
  it("returns the original snapshot when there is nothing to do", () => {
    const snap = makeCubicSnapshot();
    const out = expandCrystal(snap, { na: 1, nb: 1, nc: 1, applySymmetry: false });
    expect(out).toBe(snap);
  });

  it("returns the original when the structure has no cell", () => {
    const snap = makeCubicSnapshot({ box: null });
    const out = expandCrystal(snap, { na: 2, nb: 2, nc: 2, applySymmetry: false });
    expect(out).toBe(snap);
  });

  it("returns the original when the cell matrix is singular", () => {
    // A degenerate (zero-volume) cell cannot be inverted to fractional space.
    const snap = makeCubicSnapshot({
      box: new Float32Array([10, 0, 0, 0, 10, 0, 0, 0, 0]),
    });
    const out = expandCrystal(snap, { na: 2, nb: 1, nc: 1, applySymmetry: false });
    expect(out).toBe(snap);
  });

  it("replicates atoms and bonds across an na×nb×nc grid", () => {
    const snap = makeCubicSnapshot();
    const out = expandCrystal(snap, { na: 2, nb: 1, nc: 1, applySymmetry: false });
    expect(out.nAtoms).toBe(4); // 2 atoms × 2 cells
    expect(out.bonds.length).toBe(4); // 1 bond × 2 cells × 2 indices
    // Second image bond indices offset by nBase (2).
    expect(Array.from(out.bonds)).toEqual([0, 1, 2, 3]);
    // The replicated copy is shifted by one cell along a (+10 in x).
    expect(out.positions[6]).toBeCloseTo(10); // atom0 of image1: x = 0 + 10
    expect(out.positions[9]).toBeCloseTo(11); // atom1 of image1: x = 1 + 10
  });

  it("enlarges the cell box by the repeat counts", () => {
    const snap = makeCubicSnapshot();
    const out = expandCrystal(snap, { na: 2, nb: 3, nc: 1, applySymmetry: false });
    expect(out.box![0]).toBeCloseTo(20);
    expect(out.box![4]).toBeCloseTo(30);
    expect(out.box![8]).toBeCloseTo(10);
  });

  it("clears symmetryOps so a downstream node cannot re-expand", () => {
    const snap = makeCubicSnapshot({ symmetryOps: ["x,y,z", "-x,-y,-z"] });
    const out = expandCrystal(snap, { na: 2, nb: 1, nc: 1, applySymmetry: true });
    expect(out.symmetryOps).toBeUndefined();
  });

  it("applies symmetry operations to fill the cell (P-1 doubles the atoms)", () => {
    // Asymmetric unit at a general position; inversion -x,-y,-z generates a
    // second, distinct molecule within the cell.
    const snap = makeCubicSnapshot({
      positions: new Float32Array([3, 3, 3, 4, 4, 4]),
      symmetryOps: ["x,y,z", "-x,-y,-z"],
    });
    const out = expandCrystal(snap, { na: 1, nb: 1, nc: 1, applySymmetry: true });
    expect(out.nAtoms).toBe(4); // 2 symmetry images × 2 atoms
    expect(out.bonds.length).toBe(4); // bond replicated per image
  });

  it("ignores symmetry when applySymmetry is false", () => {
    const snap = makeCubicSnapshot({ symmetryOps: ["x,y,z", "-x,-y,-z"] });
    const out = expandCrystal(snap, { na: 1, nb: 1, nc: 1, applySymmetry: false });
    expect(out).toBe(snap); // identity-only + no tiling = no-op
  });

  it("tiles per-atom auxiliary arrays when present", () => {
    const snap = makeCubicSnapshot({
      atomChainIds: new Uint8Array([65, 66]),
      atomBFactors: new Float32Array([10, 20]),
    });
    const out = expandCrystal(snap, { na: 2, nb: 1, nc: 1, applySymmetry: false });
    expect(Array.from(out.atomChainIds!)).toEqual([65, 66, 65, 66]);
    expect(Array.from(out.atomBFactors!)).toEqual([10, 20, 10, 20]);
  });
});
