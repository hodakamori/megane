import { describe, it, expect } from "vitest";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import { BOND_DOUBLE, BOND_TRIPLE, BOND_AROMATIC, BOND_SINGLE, getColor } from "@/constants";
import type { Snapshot } from "@/types";

function makeSnapshot(bondOrder: number = BOND_SINGLE): Snapshot {
  return {
    nAtoms: 2,
    nBonds: 1,
    positions: new Float32Array([0, 0, 0, 1, 0, 0]),
    elements: new Uint8Array([6, 8]),
    bonds: new Uint32Array([0, 1]),
    bondOrders: bondOrder === BOND_SINGLE ? null : new Uint8Array([bondOrder]),
  } as Snapshot;
}

function buffers(mesh: ImpostorBondMesh): { a: Float32Array; b: Float32Array } {
  const m = mesh as unknown as { colorABuf: Float32Array; colorBBuf: Float32Array };
  return { a: m.colorABuf, b: m.colorBBuf };
}

describe("ImpostorBondMesh.recomputeColorsFromAtomBuffer", () => {
  it("stores each endpoint color on its own half for a single bond", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_SINGLE));

    // Atom 0 = red, atom 1 = blue
    const atomColors = new Float32Array([1, 0, 0, 0, 0, 1]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_SINGLE));

    const { a, b } = buffers(mesh);
    // Single bond → 1 instance. A half = atom 0 (red), B half = atom 1 (blue).
    expect(Array.from(a.subarray(0, 3))).toEqual([1, 0, 0]);
    expect(Array.from(b.subarray(0, 3))).toEqual([0, 0, 1]);
  });

  it("paints all double-bond instances with the same split colors", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_DOUBLE));

    const atomColors = new Float32Array([1, 1, 0, 0, 1, 1]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_DOUBLE));

    const { a, b } = buffers(mesh);
    // BOND_DOUBLE fans out to 2 visual instances
    for (let inst = 0; inst < 2; inst++) {
      const i3 = inst * 3;
      expect(Array.from(a.subarray(i3, i3 + 3))).toEqual([1, 1, 0]);
      expect(Array.from(b.subarray(i3, i3 + 3))).toEqual([0, 1, 1]);
    }
  });

  it("paints all triple-bond instances with the same split colors", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_TRIPLE));

    const atomColors = new Float32Array([0.2, 0.4, 0.6, 0.8, 0.6, 0.4]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_TRIPLE));

    const { a, b } = buffers(mesh);
    for (let inst = 0; inst < 3; inst++) {
      const i3 = inst * 3;
      expect(a[i3]).toBeCloseTo(0.2, 6);
      expect(a[i3 + 1]).toBeCloseTo(0.4, 6);
      expect(a[i3 + 2]).toBeCloseTo(0.6, 6);
      expect(b[i3]).toBeCloseTo(0.8, 6);
      expect(b[i3 + 1]).toBeCloseTo(0.6, 6);
      expect(b[i3 + 2]).toBeCloseTo(0.4, 6);
    }
  });

  it("paints both aromatic-bond instances with the split colors", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_AROMATIC));

    const atomColors = new Float32Array([1, 0, 0, 0, 1, 0]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_AROMATIC));

    const { a, b } = buffers(mesh);
    for (let inst = 0; inst < 2; inst++) {
      const i3 = inst * 3;
      expect(Array.from(a.subarray(i3, i3 + 3))).toEqual([1, 0, 0]);
      expect(Array.from(b.subarray(i3, i3 + 3))).toEqual([0, 1, 0]);
    }
  });

  it("bumps both color attributes' versions so the GPU buffers re-upload", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_SINGLE));
    const m = mesh as unknown as {
      colorAAttr: { version: number };
      colorBAttr: { version: number };
    };
    const beforeA = m.colorAAttr.version;
    const beforeB = m.colorBAttr.version;

    const atomColors = new Float32Array([1, 0, 0, 0, 0, 1]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_SINGLE));

    expect(m.colorAAttr.version).toBeGreaterThan(beforeA);
    expect(m.colorBAttr.version).toBeGreaterThan(beforeB);
  });
});

describe("ImpostorBondMesh.loadSnapshot split coloring", () => {
  it("derives each half from its endpoint element color (no color context)", () => {
    const mesh = new ImpostorBondMesh(16);
    // Carbon (Z=6) — Oxygen (Z=8) single bond.
    mesh.loadSnapshot(makeSnapshot(BOND_SINGLE));

    const { a, b } = buffers(mesh);
    const carbon = getColor(6);
    const oxygen = getColor(8);
    expect(a[0]).toBeCloseTo(carbon[0], 6);
    expect(a[1]).toBeCloseTo(carbon[1], 6);
    expect(a[2]).toBeCloseTo(carbon[2], 6);
    expect(b[0]).toBeCloseTo(oxygen[0], 6);
    expect(b[1]).toBeCloseTo(oxygen[1], 6);
    expect(b[2]).toBeCloseTo(oxygen[2], 6);
  });
});
