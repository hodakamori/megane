import { describe, it, expect } from "vitest";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import { BOND_RADIUS, getColor } from "@/constants";
import type { Snapshot } from "@/types";

function makeSnapshot(): Snapshot {
  return {
    nAtoms: 2,
    nBonds: 1,
    positions: new Float32Array([0, 0, 0, 1, 0, 0]),
    elements: new Uint8Array([6, 8]),
    bonds: new Uint32Array([0, 1]),
    bondOrders: null,
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
  jointCenterBuf: Float32Array;
  jointColorBuf: Float32Array;
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

  it("loadSnapshot populates one joint sphere per atom, centered at the atom position", () => {
    const mesh = new ImpostorBondMesh(16);
    const snapshot = makeSnapshot();
    mesh.loadSnapshot(snapshot);

    const j = joint(mesh);
    expect(j.jointGeo.instanceCount).toBe(snapshot.nAtoms);
    expect(Array.from(j.jointCenterBuf.subarray(0, 3))).toEqual([0, 0, 0]);
    expect(Array.from(j.jointCenterBuf.subarray(3, 6))).toEqual([1, 0, 0]);
    // Joint radius is the constant BOND_RADIUS via uJointRadius (not per-instance).
    expect(j.jointMaterial.uniforms.uJointRadius.value).toBeCloseTo(BOND_RADIUS, 6);
  });

  it("loadSnapshot colors each joint sphere by its atom's element color (no color context)", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());

    const j = joint(mesh);
    const carbon = getColor(6);
    const oxygen = getColor(8);
    expect(j.jointColorBuf[0]).toBeCloseTo(carbon[0], 6);
    expect(j.jointColorBuf[1]).toBeCloseTo(carbon[1], 6);
    expect(j.jointColorBuf[2]).toBeCloseTo(carbon[2], 6);
    expect(j.jointColorBuf[3]).toBeCloseTo(oxygen[0], 6);
    expect(j.jointColorBuf[4]).toBeCloseTo(oxygen[1], 6);
    expect(j.jointColorBuf[5]).toBeCloseTo(oxygen[2], 6);
  });

  it("updatePositions refreshes the per-atom joint sphere centers for a new frame", () => {
    const mesh = new ImpostorBondMesh(16);
    const snapshot = makeSnapshot();
    mesh.loadSnapshot(snapshot);

    const newPositions = new Float32Array([5, 6, 7, 8, 9, 10]);
    mesh.updatePositions(newPositions, snapshot.bonds, snapshot.nBonds);

    const j = joint(mesh);
    expect(Array.from(j.jointCenterBuf.subarray(0, 3))).toEqual([5, 6, 7]);
    expect(Array.from(j.jointCenterBuf.subarray(3, 6))).toEqual([8, 9, 10]);
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

  it("recomputeColorsFromAtomBuffer rewrites joint sphere colors from the atom color buffer", () => {
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
    // Ghost atom (index 2, out of range of atomColors) falls back to element color.
    expect(j.jointColorBuf[6]).toBeCloseTo(carbon[0], 6);
    expect(j.jointColorBuf[7]).toBeCloseTo(carbon[1], 6);
    expect(j.jointColorBuf[8]).toBeCloseTo(carbon[2], 6);
    expect(Number.isNaN(j.jointColorBuf[6])).toBe(false);
  });

  it("dispose disposes the joint geometry and material without throwing", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());
    expect(() => mesh.dispose()).not.toThrow();
  });
});
