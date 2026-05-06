import { describe, it, expect } from "vitest";
import { expandSelection, toggleAtoms } from "@/selection/granularity";
import type { Snapshot } from "@/types";

function makeSnapshot(overrides: Partial<Snapshot> = {}): Snapshot {
  const n = 6;
  return {
    nAtoms: n,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(n * 3),
    elements: new Uint8Array(n).fill(6),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
    atomChainIds: null,
    atomBFactors: null,
    atomResNums: null,
    ...overrides,
  };
}

// Atoms 0-2: chain A (65), residue 1
// Atoms 3-5: chain B (66), residue 2
function makePdbLikeSnapshot(): Snapshot {
  const chainIds = new Uint8Array([65, 65, 65, 66, 66, 66]);
  const resNums = new Uint32Array([1, 1, 1, 2, 2, 2]);
  return makeSnapshot({ atomChainIds: chainIds, atomResNums: resNums });
}

describe("expandSelection", () => {
  it("atom granularity returns only the picked atom", () => {
    const snap = makePdbLikeSnapshot();
    expect(expandSelection(0, "atom", snap)).toEqual([0]);
    expect(expandSelection(4, "atom", snap)).toEqual([4]);
  });

  it("residue granularity expands to all atoms in same chain+residue", () => {
    const snap = makePdbLikeSnapshot();
    expect(expandSelection(1, "residue", snap)).toEqual([0, 1, 2]);
    expect(expandSelection(4, "residue", snap)).toEqual([3, 4, 5]);
  });

  it("residue granularity falls back to atom when no resNums", () => {
    const snap = makeSnapshot({ atomChainIds: new Uint8Array([65, 65, 65]) });
    expect(expandSelection(1, "residue", snap)).toEqual([1]);
  });

  it("chain granularity expands to all atoms in same chain", () => {
    const snap = makePdbLikeSnapshot();
    expect(expandSelection(0, "chain", snap)).toEqual([0, 1, 2]);
    expect(expandSelection(5, "chain", snap)).toEqual([3, 4, 5]);
  });

  it("chain granularity falls back to atom when no chainIds", () => {
    const snap = makeSnapshot();
    expect(expandSelection(2, "chain", snap)).toEqual([2]);
  });

  it("ss granularity falls back to residue when no caIndices", () => {
    const snap = makePdbLikeSnapshot();
    expect(expandSelection(0, "ss", snap)).toEqual([0, 1, 2]);
  });

  it("ss granularity falls back to residue for coil residues", () => {
    const snap = makePdbLikeSnapshot();
    // Add CA data but mark all as coil (ss=0)
    const snapWithCa: Snapshot = {
      ...snap,
      caIndices: new Uint32Array([0, 3]),
      caChainIds: new Uint8Array([65, 66]),
      caResNums: new Uint32Array([1, 2]),
      caSsType: new Uint8Array([0, 0]),
    };
    expect(expandSelection(0, "ss", snapWithCa)).toEqual([0, 1, 2]);
  });

  it("ss granularity selects all residues in the same helix segment", () => {
    // 9 atoms: atoms 0-2 (chain A, res 1), 3-5 (chain A, res 2), 6-8 (chain A, res 3)
    const n = 9;
    const chainIds = new Uint8Array(n).fill(65);
    const resNums = new Uint32Array([1, 1, 1, 2, 2, 2, 3, 3, 3]);
    const snap: Snapshot = {
      nAtoms: n,
      nBonds: 0,
      nFileBonds: 0,
      positions: new Float32Array(n * 3),
      elements: new Uint8Array(n).fill(6),
      bonds: new Uint32Array(0),
      bondOrders: null,
      box: null,
      atomChainIds: chainIds,
      atomBFactors: null,
      atomResNums: resNums,
      caIndices: new Uint32Array([0, 3, 6]),
      caChainIds: new Uint8Array([65, 65, 65]),
      caResNums: new Uint32Array([1, 2, 3]),
      caSsType: new Uint8Array([1, 1, 0]), // res1+res2 helix, res3 coil
    };
    // Picking atom 0 (res1, helix) → helix atoms = res1 + res2 = atoms 0–5
    const result = expandSelection(0, "ss", snap);
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
  });
});

describe("toggleAtoms", () => {
  it("adds atoms not in current selection", () => {
    expect(toggleAtoms([0, 1], [2, 3])).toEqual([0, 1, 2, 3]);
  });

  it("removes atoms when all are already selected", () => {
    expect(toggleAtoms([0, 1, 2], [1, 2])).toEqual([0]);
  });

  it("adds partial overlap (not all present)", () => {
    expect(toggleAtoms([0, 1], [1, 2])).toEqual([0, 1, 2]);
  });

  it("returns empty when removing last atoms", () => {
    expect(toggleAtoms([0, 1], [0, 1])).toEqual([]);
  });

  it("result is sorted", () => {
    const result = toggleAtoms([5, 3], [1, 4]);
    expect(result).toEqual([1, 3, 4, 5]);
  });
});
