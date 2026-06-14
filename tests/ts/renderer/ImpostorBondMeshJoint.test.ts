import { describe, it, expect } from "vitest";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import { BOND_RADIUS, BOND_SINGLE, getColor } from "@/constants";
import type { Snapshot } from "@/types";

function makeSnapshot(): Snapshot {
  return {
    nAtoms: 2,
    nBonds: 1,
    positions: new Float32Array([0, 0, 0, 1, 0, 0]),
    elements: new Uint8Array([6, 8]),
    bonds: new Uint32Array([0, 1]),
    bondOrders: new Uint8Array([BOND_SINGLE]),
  } as Snapshot;
}

interface JointInternals {
  jointMesh: object;
  jointGeo: { instanceCount: number; dispose: () => void };
  jointMaterial: {
    uniforms: {
      uBondScaleMultiplier: { value: number };
      uOpacity: { value: number };
      uJointRadius: { value: number };
    };
    transparent: boolean;
    depthWrite: boolean;
    dispose: () => void;
  };
  jointAtomABuf: Float32Array;
  jointAtomBBuf: Float32Array;
  jointOffsetXBuf: Float32Array;
  jointOffsetYBuf: Float32Array;
  jointColorBuf: Float32Array;
  jointRadiusBuf: Float32Array;
  jointEndBuf: Float32Array;
  positionTexData: Float32Array;
}

function joint(mesh: ImpostorBondMesh): JointInternals {
  return mesh as unknown as JointInternals;
}

describe("ImpostorBondMesh joint sphere mesh", () => {
  it("is added as a child of the bond mesh so visibility/scene placement is inherited", () => {
    const mesh = new ImpostorBondMesh(16);
    const j = joint(mesh);
    expect(mesh.mesh.children).toContain(j.jointMesh);
  });

  it("loadSnapshot populates two joint caps per bond instance, one per clipped end", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());

    const j = joint(mesh);
    // One visual instance (single bond) -> 2 joint caps.
    expect(j.jointGeo.instanceCount).toBe(2);
    // Both caps reference the same bond's atom pair.
    expect(Array.from(j.jointAtomABuf.subarray(0, 2))).toEqual([0, 0]);
    expect(Array.from(j.jointAtomBBuf.subarray(0, 2))).toEqual([1, 1]);
    expect(Array.from(j.jointOffsetXBuf.subarray(0, 2))).toEqual([0, 0]);
    expect(Array.from(j.jointOffsetYBuf.subarray(0, 2))).toEqual([0, 0]);
    // Cap radius matches this instance's own cylinder radius (tangent-continuous).
    expect(j.jointRadiusBuf[0]).toBeCloseTo(BOND_RADIUS, 6);
    expect(j.jointRadiusBuf[1]).toBeCloseTo(BOND_RADIUS, 6);
    // instanceEnd alternates: cap 0 is the "A" end, cap 1 the "B" end.
    expect(j.jointEndBuf[0]).toBe(0);
    expect(j.jointEndBuf[1]).toBe(1);
  });

  it("loadSnapshot colors each joint cap by its endpoint atom's element color (no color context)", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());

    const j = joint(mesh);
    const carbon = getColor(6);
    const oxygen = getColor(8);
    // Cap 0 ("A" end, atom 0 = carbon)
    expect(j.jointColorBuf[0]).toBeCloseTo(carbon[0], 6);
    expect(j.jointColorBuf[1]).toBeCloseTo(carbon[1], 6);
    expect(j.jointColorBuf[2]).toBeCloseTo(carbon[2], 6);
    // Cap 1 ("B" end, atom 1 = oxygen)
    expect(j.jointColorBuf[3]).toBeCloseTo(oxygen[0], 6);
    expect(j.jointColorBuf[4]).toBeCloseTo(oxygen[1], 6);
    expect(j.jointColorBuf[5]).toBeCloseTo(oxygen[2], 6);
  });

  it("updatePositions refreshes the shared position texture used by joint caps", () => {
    const mesh = new ImpostorBondMesh(16);
    const snapshot = makeSnapshot();
    mesh.loadSnapshot(snapshot);

    const newPositions = new Float32Array([5, 6, 7, 8, 9, 10]);
    mesh.updatePositions(newPositions, snapshot.bonds, snapshot.nBonds);

    const j = joint(mesh);
    expect(Array.from(j.positionTexData.subarray(0, 3))).toEqual([5, 6, 7]);
    expect(Array.from(j.positionTexData.subarray(4, 7))).toEqual([8, 9, 10]);
  });

  it("setScale updates both the bond and joint material's scale multiplier", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());

    mesh.setScale(2.5);

    const j = joint(mesh);
    expect(j.jointMaterial.uniforms.uBondScaleMultiplier.value).toBe(2.5);
  });

  it("setOpacity mirrors opacity/transparency onto the joint material", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());

    mesh.setOpacity(0.5);

    const j = joint(mesh);
    expect(j.jointMaterial.uniforms.uOpacity.value).toBe(0.5);
    expect(j.jointMaterial.transparent).toBe(true);
    expect(j.jointMaterial.depthWrite).toBe(false);

    mesh.setOpacity(1.0);
    expect(j.jointMaterial.transparent).toBe(false);
    expect(j.jointMaterial.depthWrite).toBe(true);
  });

  it("recomputeColorsFromAtomBuffer rewrites joint cap colors from the atom color buffer", () => {
    const mesh = new ImpostorBondMesh(16);
    const snapshot = makeSnapshot();
    mesh.loadSnapshot(snapshot);

    const atomColors = new Float32Array([1, 0, 0, 0, 0, 1]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, snapshot);

    const j = joint(mesh);
    expect(Array.from(j.jointColorBuf.subarray(0, 3))).toEqual([1, 0, 0]);
    expect(Array.from(j.jointColorBuf.subarray(3, 6))).toEqual([0, 0, 1]);
  });

  it("recomputeColorsFromAtomBuffer falls back to element color for ghost atoms", () => {
    // 2 real atoms + 1 ghost (carbon, Z=6) appended at index 2.
    const extSnap = {
      nAtoms: 3,
      nBonds: 1,
      positions: new Float32Array([0, 0, 0, 1, 0, 0, 2, 0, 0]),
      elements: new Uint8Array([6, 8, 6]),
      bonds: new Uint32Array([1, 2]),
      bondOrders: null,
    } as Snapshot;

    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(extSnap);

    const atomColors = new Float32Array([1, 0, 0, 0, 1, 0]);
    mesh.recomputeColorsFromAtomBuffer(atomColors, extSnap);

    const j = joint(mesh);
    const carbon = getColor(6);
    // Cap 1 ("B" end, atom 2 = ghost carbon, out of range of atomColors)
    expect(j.jointColorBuf[3]).toBeCloseTo(carbon[0], 6);
    expect(j.jointColorBuf[4]).toBeCloseTo(carbon[1], 6);
    expect(j.jointColorBuf[5]).toBeCloseTo(carbon[2], 6);
    expect(Number.isNaN(j.jointColorBuf[3])).toBe(false);
  });

  it("dispose disposes the joint geometry and material without throwing", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());
    expect(() => mesh.dispose()).not.toThrow();
  });
});
