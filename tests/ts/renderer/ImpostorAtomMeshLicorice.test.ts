import { describe, it, expect } from "vitest";
import { ImpostorAtomMesh } from "@/renderer/ImpostorAtomMesh";
import { getRadius, BALL_STICK_ATOM_SCALE, LICORICE_RADIUS } from "@/constants";
import type { Snapshot } from "@/types";

function makeSnapshot(): Snapshot {
  // 3 atoms: H, C, O
  return {
    nAtoms: 3,
    nBonds: 0,
    positions: new Float32Array([0, 0, 0, 1, 0, 0, 2, 0, 0]),
    elements: new Uint8Array([1, 6, 8]),
    bonds: new Uint32Array(),
    bondOrders: null,
  } as Snapshot;
}

describe("ImpostorAtomMesh.setLicoriceMode", () => {
  it("gives every atom a fixed LICORICE_RADIUS regardless of element", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());

    mesh.setLicoriceMode(true);
    const radii = mesh.getRadiusBuffer();
    expect(radii.length).toBe(3);
    for (const r of radii) {
      expect(r).toBeCloseTo(LICORICE_RADIUS, 6);
    }
  });

  it("reverts to van-der-Waals-scaled radii when disabled", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());

    mesh.setLicoriceMode(true);
    mesh.setLicoriceMode(false);

    const radii = mesh.getRadiusBuffer();
    const elements = [1, 6, 8];
    elements.forEach((z, i) => {
      expect(radii[i]).toBeCloseTo(getRadius(z) * BALL_STICK_ATOM_SCALE, 6);
    });
  });

  it("computes licorice radii directly when loadSnapshot runs while enabled", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.setLicoriceMode(true);
    mesh.loadSnapshot(makeSnapshot());

    const radii = mesh.getRadiusBuffer();
    for (const r of radii) {
      expect(r).toBeCloseTo(LICORICE_RADIUS, 6);
    }
  });

  it("is a no-op when toggled to the same mode", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());
    const before = Array.from(mesh.getRadiusBuffer());

    mesh.setLicoriceMode(false);
    expect(Array.from(mesh.getRadiusBuffer())).toEqual(before);
  });
});
