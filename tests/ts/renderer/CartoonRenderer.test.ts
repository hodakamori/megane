import { describe, it, expect } from "vitest";
import * as THREE from "three";
import {
  extractChainBackbones,
  buildSegments,
  CartoonRenderer,
  SS_COIL,
  SS_HELIX,
  SS_SHEET,
} from "@/renderer/CartoonRenderer";
import type { Snapshot } from "@/types";

// Minimal Snapshot factory for testing — only fields used by CartoonRenderer are needed.
function makeSnapshot(
  caIndices: number[],
  caChainIds: number[],
  caResNums: number[],
  caSsType: number[],
): Snapshot {
  return {
    nAtoms: caIndices.length * 2, // not relevant for these tests
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(caIndices.length * 2 * 3),
    elements: new Uint8Array(caIndices.length * 2),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
    caIndices: new Uint32Array(caIndices),
    caChainIds: new Uint8Array(caChainIds),
    caResNums: new Uint32Array(caResNums),
    caSsType: new Uint8Array(caSsType),
  };
}

describe("extractChainBackbones", () => {
  it("returns empty array for snapshot with no Cα data", () => {
    const snap: Snapshot = {
      nAtoms: 1,
      nBonds: 0,
      nFileBonds: 0,
      positions: new Float32Array(3),
      elements: new Uint8Array(1),
      bonds: new Uint32Array(0),
      bondOrders: null,
      box: null,
    };
    expect(extractChainBackbones(snap)).toEqual([]);
  });

  it("returns empty array for snapshot with empty caIndices", () => {
    const snap = makeSnapshot([], [], [], []);
    expect(extractChainBackbones(snap)).toEqual([]);
  });

  it("groups Cα atoms by chain ID", () => {
    // Chain A: resNums 1,2; Chain B: resNum 1
    const snap = makeSnapshot(
      [0, 1, 2],
      [65, 65, 66], // A=65, B=66
      [1, 2, 1],
      [SS_COIL, SS_COIL, SS_COIL],
    );
    const chains = extractChainBackbones(snap);
    expect(chains.length).toBe(2);
    const chainA = chains.find((c) => c.chainId === 65)!;
    const chainB = chains.find((c) => c.chainId === 66)!;
    expect(chainA).toBeDefined();
    expect(chainB).toBeDefined();
    expect(chainA.atomIndices.length).toBe(2);
    expect(chainB.atomIndices.length).toBe(1);
  });

  it("sorts Cα atoms by residue number within each chain", () => {
    // Atoms provided out of order (resNum 3, 1, 2)
    const snap = makeSnapshot(
      [10, 20, 30], // atom indices in positions array
      [65, 65, 65], // all chain A
      [3, 1, 2], // residue numbers — unsorted
      [SS_COIL, SS_HELIX, SS_SHEET],
    );
    const [chain] = extractChainBackbones(snap);
    // After sorting by resNum: residue 1 (atomIndex 20), 2 (atomIndex 30), 3 (atomIndex 10)
    expect(Array.from(chain.atomIndices)).toEqual([20, 30, 10]);
    expect(Array.from(chain.ssTypes)).toEqual([SS_HELIX, SS_SHEET, SS_COIL]);
  });

  it("preserves SS types in sorted order", () => {
    const snap = makeSnapshot(
      [0, 1, 2, 3],
      [65, 65, 65, 65],
      [4, 2, 1, 3],
      [SS_SHEET, SS_HELIX, SS_COIL, SS_HELIX],
    );
    const [chain] = extractChainBackbones(snap);
    // Sorted by resNum: 1→coil, 2→helix, 3→helix, 4→sheet
    expect(Array.from(chain.ssTypes)).toEqual([SS_COIL, SS_HELIX, SS_HELIX, SS_SHEET]);
  });
});

describe("buildSegments", () => {
  it("returns empty array for empty input", () => {
    expect(buildSegments(new Uint8Array(0))).toEqual([]);
  });

  it("single element produces one segment", () => {
    const segs = buildSegments(new Uint8Array([SS_HELIX]));
    expect(segs.length).toBe(1);
    expect(segs[0]).toEqual({ caSliceStart: 0, caSliceEnd: 1, ssType: SS_HELIX });
  });

  it("all same type produces one segment spanning all", () => {
    const segs = buildSegments(new Uint8Array([SS_COIL, SS_COIL, SS_COIL]));
    expect(segs.length).toBe(1);
    expect(segs[0]).toEqual({ caSliceStart: 0, caSliceEnd: 3, ssType: SS_COIL });
  });

  it("transitions produce separate segments", () => {
    // coil(2), helix(3), sheet(2)
    const types = new Uint8Array([
      SS_COIL, SS_COIL,
      SS_HELIX, SS_HELIX, SS_HELIX,
      SS_SHEET, SS_SHEET,
    ]);
    const segs = buildSegments(types);
    expect(segs.length).toBe(3);
    expect(segs[0]).toEqual({ caSliceStart: 0, caSliceEnd: 2, ssType: SS_COIL });
    expect(segs[1]).toEqual({ caSliceStart: 2, caSliceEnd: 5, ssType: SS_HELIX });
    expect(segs[2]).toEqual({ caSliceStart: 5, caSliceEnd: 7, ssType: SS_SHEET });
  });

  it("alternating types produce a segment per residue", () => {
    const types = new Uint8Array([SS_COIL, SS_HELIX, SS_COIL, SS_HELIX]);
    const segs = buildSegments(types);
    expect(segs.length).toBe(4);
    for (let i = 0; i < 4; i++) {
      expect(segs[i].caSliceStart).toBe(i);
      expect(segs[i].caSliceEnd).toBe(i + 1);
    }
  });

  it("all helix then sheet transition", () => {
    const types = new Uint8Array([SS_HELIX, SS_HELIX, SS_SHEET, SS_SHEET]);
    const segs = buildSegments(types);
    expect(segs.length).toBe(2);
    expect(segs[0].ssType).toBe(SS_HELIX);
    expect(segs[1].ssType).toBe(SS_SHEET);
  });
});

// ─── CartoonRenderer class ────────────────────────────────────────────────────

/**
 * Build a snapshot whose Cα atoms form a straight line along the X axis.
 * Positions array has 2 atoms per Cα to keep index math simple.
 */
function makeLinearSnapshot(nCa: number, ssType = SS_COIL): Snapshot {
  const positions = new Float32Array(nCa * 3);
  for (let i = 0; i < nCa; i++) {
    positions[i * 3] = i * 3.8; // typical Cα–Cα distance ~3.8 Å
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
  }
  return {
    nAtoms: nCa,
    nBonds: 0,
    nFileBonds: 0,
    positions,
    elements: new Uint8Array(nCa),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
    caIndices: new Uint32Array(Array.from({ length: nCa }, (_, i) => i)),
    caChainIds: new Uint8Array(nCa).fill(65), // chain 'A'
    caResNums: new Uint32Array(Array.from({ length: nCa }, (_, i) => i + 1)),
    caSsType: new Uint8Array(nCa).fill(ssType),
  };
}

describe("CartoonRenderer", () => {
  it("constructor creates a hidden group", () => {
    const cr = new CartoonRenderer();
    expect(cr.mesh).toBeInstanceOf(THREE.Group);
    expect(cr.mesh.visible).toBe(false);
  });

  it("setVisible toggles group visibility", () => {
    const cr = new CartoonRenderer();
    cr.setVisible(true);
    expect(cr.mesh.visible).toBe(true);
    cr.setVisible(false);
    expect(cr.mesh.visible).toBe(false);
  });

  it("loadSnapshot with no Cα data produces empty mesh", () => {
    const cr = new CartoonRenderer();
    const snap: Snapshot = {
      nAtoms: 1,
      nBonds: 0,
      nFileBonds: 0,
      positions: new Float32Array(3),
      elements: new Uint8Array(1),
      bonds: new Uint32Array(0),
      bondOrders: null,
      box: null,
    };
    cr.loadSnapshot(snap);
    expect(cr.mesh.children.length).toBe(0);
  });

  it("loadSnapshot with coil Cα atoms adds mesh children", () => {
    const cr = new CartoonRenderer();
    cr.loadSnapshot(makeLinearSnapshot(5, SS_COIL));
    expect(cr.mesh.children.length).toBeGreaterThan(0);
  });

  it("loadSnapshot with helix Cα atoms adds mesh children", () => {
    const cr = new CartoonRenderer();
    cr.loadSnapshot(makeLinearSnapshot(6, SS_HELIX));
    expect(cr.mesh.children.length).toBeGreaterThan(0);
  });

  it("loadSnapshot with sheet Cα atoms adds mesh children", () => {
    const cr = new CartoonRenderer();
    cr.loadSnapshot(makeLinearSnapshot(4, SS_SHEET));
    expect(cr.mesh.children.length).toBeGreaterThan(0);
  });

  it("loadSnapshot with mixed SS types renders all segment types", () => {
    const snap = makeSnapshot(
      [0, 1, 2, 3, 4, 5],
      [65, 65, 65, 65, 65, 65],
      [1, 2, 3, 4, 5, 6],
      [SS_COIL, SS_COIL, SS_HELIX, SS_HELIX, SS_SHEET, SS_SHEET],
    );
    // Need matching positions for 6 atoms
    const positions = new Float32Array(6 * 3);
    for (let i = 0; i < 6; i++) positions[i * 3] = i * 3.8;
    const fullSnap = { ...snap, positions };
    const cr = new CartoonRenderer();
    cr.loadSnapshot(fullSnap);
    expect(cr.mesh.children.length).toBeGreaterThan(0);
  });

  it("updatePositions rebuilds geometry for a new frame", () => {
    const cr = new CartoonRenderer();
    const snap = makeLinearSnapshot(4, SS_COIL);
    cr.loadSnapshot(snap);
    const before = cr.mesh.children.length;

    const newPositions = new Float32Array(snap.positions.length);
    for (let i = 0; i < 4; i++) newPositions[i * 3] = i * 4.0;
    cr.updatePositions(newPositions);
    expect(cr.mesh.children.length).toBe(before);
  });

  it("updatePositions does nothing when no snapshot loaded", () => {
    const cr = new CartoonRenderer();
    cr.updatePositions(new Float32Array(12));
    expect(cr.mesh.children.length).toBe(0);
  });

  it("dispose clears mesh children and frees geometry", () => {
    const cr = new CartoonRenderer();
    cr.loadSnapshot(makeLinearSnapshot(5, SS_COIL));
    expect(cr.mesh.children.length).toBeGreaterThan(0);
    cr.dispose();
    expect(cr.mesh.children.length).toBe(0);
  });

  it("single Cα atom produces no geometry (need ≥2 pts for curve)", () => {
    const cr = new CartoonRenderer();
    cr.loadSnapshot(makeLinearSnapshot(1, SS_COIL));
    // With only 1 atom, makeCurve returns null → no meshes added
    expect(cr.mesh.children.length).toBe(0);
  });

  it("loadSnapshot replaces previous geometry on re-call", () => {
    const cr = new CartoonRenderer();
    cr.loadSnapshot(makeLinearSnapshot(4, SS_COIL));
    const first = cr.mesh.children.length;
    cr.loadSnapshot(makeLinearSnapshot(4, SS_HELIX));
    // Children should be rebuilt, not accumulated
    expect(cr.mesh.children.length).toBeGreaterThan(0);
    expect(cr.mesh.children.length).toBeLessThanOrEqual(first + 5);
  });
});
