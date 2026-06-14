import { describe, it, expect } from "vitest";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import {
  BOND_SINGLE,
  BOND_DOUBLE,
  BOND_TRIPLE,
  BOND_AROMATIC,
  LICORICE_BOND_SCALE,
} from "@/constants";
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

describe("ImpostorBondMesh.setLicoriceMode", () => {
  it("scales single-bond radii by LICORICE_BOND_SCALE", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_SINGLE));
    const before = Array.from(mesh.getRadiusBuffer());

    mesh.setLicoriceMode(true);
    const after = mesh.getRadiusBuffer();
    expect(after.length).toBe(before.length);
    after.forEach((r, i) => {
      expect(r).toBeCloseTo(before[i] * LICORICE_BOND_SCALE, 6);
    });
  });

  it("scales every visual instance of double/triple/aromatic bonds", () => {
    for (const order of [BOND_DOUBLE, BOND_TRIPLE, BOND_AROMATIC]) {
      const mesh = new ImpostorBondMesh(16);
      mesh.loadSnapshot(makeSnapshot(order));
      const before = Array.from(mesh.getRadiusBuffer());

      mesh.setLicoriceMode(true);
      const after = mesh.getRadiusBuffer();
      after.forEach((r, i) => {
        expect(r).toBeCloseTo(before[i] * LICORICE_BOND_SCALE, 6);
      });
    }
  });

  it("reverts to the original radii when disabled", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_SINGLE));
    const before = Array.from(mesh.getRadiusBuffer());

    mesh.setLicoriceMode(true);
    mesh.setLicoriceMode(false);

    expect(Array.from(mesh.getRadiusBuffer())).toEqual(before);
  });

  it("is a no-op when toggled to the same mode", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot(BOND_SINGLE));
    const before = Array.from(mesh.getRadiusBuffer());

    mesh.setLicoriceMode(false);
    expect(Array.from(mesh.getRadiusBuffer())).toEqual(before);
  });

  it("applies licorice scaling to bonds loaded while enabled", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.setLicoriceMode(true);
    mesh.loadSnapshot(makeSnapshot(BOND_SINGLE));

    // getRadiusBuffer() is a view; snapshot the value before mutating.
    const radius = mesh.getRadiusBuffer()[0];
    mesh.setLicoriceMode(false);
    const reverted = mesh.getRadiusBuffer()[0];
    expect(reverted).toBeCloseTo(radius / LICORICE_BOND_SCALE, 6);
  });
});
