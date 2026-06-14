import { describe, it, expect } from "vitest";
import { MoleculeRenderer } from "@/renderer/MoleculeRenderer";
import { ImpostorAtomMesh } from "@/renderer/ImpostorAtomMesh";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import { LICORICE_RADIUS, LICORICE_BOND_SCALE, BOND_RADIUS } from "@/constants";
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

function makeRendererWithMeshes(): {
  renderer: MoleculeRenderer;
  atom: ImpostorAtomMesh;
  bond: ImpostorBondMesh;
} {
  const renderer = new MoleculeRenderer();
  const snapshot = makeSnapshot();
  const atom = new ImpostorAtomMesh(8);
  atom.loadSnapshot(snapshot);
  const bond = new ImpostorBondMesh(16);
  bond.loadSnapshot(snapshot);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const internals = renderer as any;
  internals.snapshot = snapshot;
  internals.atomRenderer = atom;
  internals.bondRenderer = bond;
  return { renderer, atom, bond };
}

describe("MoleculeRenderer — licorice representation", () => {
  it("shows atoms and bonds and sets licorice radii", () => {
    const { renderer, atom, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(true);
    renderer.setRepresentationType("licorice");

    expect(atom.mesh.visible).toBe(true);
    expect(bond.mesh.visible).toBe(true);

    for (const r of atom.getRadiusBuffer()) {
      expect(r).toBeCloseTo(LICORICE_RADIUS, 6);
    }
    for (const r of bond.getRadiusBuffer()) {
      expect(r).toBeCloseTo(BOND_RADIUS * LICORICE_BOND_SCALE, 6);
    }
  });

  it("hides bonds in licorice mode when the pipeline reports no bonds", () => {
    const { renderer, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(false);
    renderer.setRepresentationType("licorice");
    expect(bond.mesh.visible).toBe(false);
  });

  it("reverts radii when switching back to atoms mode", () => {
    const { renderer, atom, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(true);
    renderer.setRepresentationType("licorice");
    renderer.setRepresentationType("atoms");

    for (const r of bond.getRadiusBuffer()) {
      expect(r).toBeCloseTo(BOND_RADIUS, 6);
    }
    expect(Array.from(atom.getRadiusBuffer())).not.toEqual(
      Array.from({ length: atom.getRadiusBuffer().length }, () => LICORICE_RADIUS),
    );
  });
});
