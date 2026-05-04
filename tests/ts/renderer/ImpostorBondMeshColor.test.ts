import { describe, it, expect } from "vitest";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import { BOND_DOUBLE, BOND_TRIPLE, BOND_AROMATIC, BOND_SINGLE } from "@/constants";
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

describe("ImpostorBondMesh.recomputeColorsFromAtomBuffer", () => {
  it("averages endpoint colors for a single bond", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_SINGLE));

    // Atom 0 = red, atom 1 = blue
    const atomColors = new Float32Array([1, 0, 0, 0, 0, 1]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_SINGLE));

    const colorBuf = (mesh as unknown as { colorBuf: Float32Array }).colorBuf;
    // Single bond → 1 instance, expect midpoint (0.5, 0, 0.5)
    expect(colorBuf[0]).toBeCloseTo(0.5, 6);
    expect(colorBuf[1]).toBeCloseTo(0, 6);
    expect(colorBuf[2]).toBeCloseTo(0.5, 6);
  });

  it("paints all double-bond instances with the same averaged color", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_DOUBLE));

    const atomColors = new Float32Array([1, 1, 0, 0, 1, 1]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_DOUBLE));

    const colorBuf = (mesh as unknown as { colorBuf: Float32Array }).colorBuf;
    // BOND_DOUBLE fans out to 2 visual instances
    for (let inst = 0; inst < 2; inst++) {
      const i3 = inst * 3;
      expect(colorBuf[i3]).toBeCloseTo(0.5, 6);
      expect(colorBuf[i3 + 1]).toBeCloseTo(1, 6);
      expect(colorBuf[i3 + 2]).toBeCloseTo(0.5, 6);
    }
  });

  it("paints all triple-bond instances with the same averaged color", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_TRIPLE));

    const atomColors = new Float32Array([0.2, 0.4, 0.6, 0.8, 0.6, 0.4]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_TRIPLE));

    const colorBuf = (mesh as unknown as { colorBuf: Float32Array }).colorBuf;
    for (let inst = 0; inst < 3; inst++) {
      const i3 = inst * 3;
      expect(colorBuf[i3]).toBeCloseTo(0.5, 6);
      expect(colorBuf[i3 + 1]).toBeCloseTo(0.5, 6);
      expect(colorBuf[i3 + 2]).toBeCloseTo(0.5, 6);
    }
  });

  it("paints both aromatic-bond instances with the averaged color", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_AROMATIC));

    const atomColors = new Float32Array([1, 0, 0, 0, 1, 0]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_AROMATIC));

    const colorBuf = (mesh as unknown as { colorBuf: Float32Array }).colorBuf;
    for (let inst = 0; inst < 2; inst++) {
      const i3 = inst * 3;
      expect(colorBuf[i3]).toBeCloseTo(0.5, 6);
      expect(colorBuf[i3 + 1]).toBeCloseTo(0.5, 6);
      expect(colorBuf[i3 + 2]).toBeCloseTo(0, 6);
    }
  });

  it("bumps the color attribute's version so the GPU buffer re-uploads", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_SINGLE));
    const colorAttr = (mesh as unknown as { colorAttr: { version: number } }).colorAttr;
    const before = colorAttr.version;

    const atomColors = new Float32Array([1, 0, 0, 0, 0, 1]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, makeSnapshot(BOND_SINGLE));

    expect(colorAttr.version).toBeGreaterThan(before);
  });
});
