import { describe, it, expect } from "vitest";
import { MoleculeRenderer } from "@/renderer/MoleculeRenderer";
import { ImpostorAtomMesh } from "@/renderer/ImpostorAtomMesh";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
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

describe("MoleculeRenderer — bond visibility composition", () => {
  // Reproduces the user-reported bug: switching from a template that has
  // bonds (Solid) to one that has no bonds (Protein) used to leave the
  // previous structure's bond geometry visible. `setRepresentationType`
  // was unconditionally re-enabling the bond mesh based on the rep mode,
  // overriding the prior `setBondsVisible(false)` call.

  it("hides bonds when the pipeline reports no bonds, even if rep is 'both'", () => {
    const { renderer, bond } = makeRendererWithMeshes();
    // Solid-like state: pipeline emits bonds, rep is atoms.
    renderer.setBondsVisible(true);
    renderer.setRepresentationType("atoms");
    expect(bond.mesh.visible).toBe(true);

    // Switch to a Protein-like state: pipeline emits no bonds, rep is "both".
    renderer.setBondsVisible(false);
    renderer.setRepresentationType("both");
    expect(bond.mesh.visible).toBe(false);
  });

  it("re-enables bonds when the pipeline reports bonds again under atoms/both", () => {
    const { renderer, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(false);
    renderer.setRepresentationType("both");
    expect(bond.mesh.visible).toBe(false);

    renderer.setBondsVisible(true);
    expect(bond.mesh.visible).toBe(true);
  });

  it("hides bonds in cartoon mode regardless of pipeline bond availability", () => {
    const { renderer, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(true);
    renderer.setRepresentationType("cartoon");
    expect(bond.mesh.visible).toBe(false);
  });

  it("hides bonds in surface mode regardless of pipeline bond availability", () => {
    const { renderer, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(true);
    renderer.setRepresentationType("surface");
    expect(bond.mesh.visible).toBe(false);
  });

  it("setBondsVisible(false) hides the mesh immediately even before any rep call", () => {
    const { renderer, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(true);
    expect(bond.mesh.visible).toBe(true);
    renderer.setBondsVisible(false);
    expect(bond.mesh.visible).toBe(false);
  });

  it("setRepresentationType('both') without ever marking bonds available keeps bonds hidden", () => {
    const { renderer, bond } = makeRendererWithMeshes();
    // No setBondsVisible call yet; default bondsAvailable = false.
    renderer.setRepresentationType("both");
    expect(bond.mesh.visible).toBe(false);
  });

  it("'stick' hides the atom mesh but keeps bonds (and joint spheres) visible when bonds are available", () => {
    const { renderer, atom, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(true);
    renderer.setRepresentationType("stick");
    expect(atom.mesh.visible).toBe(false);
    expect(bond.mesh.visible).toBe(true);
  });

  it("'stick' hides bonds when the pipeline reports no bonds", () => {
    const { renderer, atom, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(false);
    renderer.setRepresentationType("stick");
    expect(atom.mesh.visible).toBe(false);
    expect(bond.mesh.visible).toBe(false);
  });

  it("setBondsVisible keeps bonds visible in 'stick' mode after switching from 'atoms'", () => {
    const { renderer, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(true);
    renderer.setRepresentationType("atoms");
    expect(bond.mesh.visible).toBe(true);

    renderer.setRepresentationType("stick");
    expect(bond.mesh.visible).toBe(true);

    renderer.setBondsVisible(false);
    expect(bond.mesh.visible).toBe(false);

    renderer.setBondsVisible(true);
    expect(bond.mesh.visible).toBe(true);
  });
});
