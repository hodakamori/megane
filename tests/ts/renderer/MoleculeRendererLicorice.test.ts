import { describe, it, expect } from "vitest";
import { MoleculeRenderer } from "@/renderer/MoleculeRenderer";
import { ImpostorAtomMesh } from "@/renderer/ImpostorAtomMesh";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import {
  LICORICE_RADIUS,
  BOND_RADIUS,
  getRadius,
  BALL_STICK_ATOM_SCALE,
} from "@/constants";
import type { Snapshot } from "@/types";

function makeSnapshot(): Snapshot {
  return {
    // Carbon (Z=6) — Oxygen (Z=8): distinct vdW radii so ball-and-stick is
    // visibly different from the equal-radius licorice tube.
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
  atomRadii: () => Float32Array;
  bondRadii: () => Float32Array;
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
  return {
    renderer,
    atom,
    bond,
    atomRadii: () => (atom as unknown as { radiusBuf: Float32Array }).radiusBuf,
    bondRadii: () => (bond as unknown as { radiusBuf: Float32Array }).radiusBuf,
  };
}

describe("MoleculeRenderer — licorice representation", () => {
  it("shows both atoms and bonds in licorice mode", () => {
    const { renderer, atom, bond } = makeRendererWithMeshes();
    renderer.setBondsVisible(true);
    renderer.setRepresentationType("licorice");
    expect(atom.mesh.visible).toBe(true);
    expect(bond.mesh.visible).toBe(true);
  });

  it("collapses atom and bond radii to a single licorice value", () => {
    const { renderer, atomRadii, bondRadii } = makeRendererWithMeshes();
    renderer.setRepresentationType("licorice");

    const ar = atomRadii();
    expect(ar[0]).toBeCloseTo(LICORICE_RADIUS, 6);
    expect(ar[1]).toBeCloseTo(LICORICE_RADIUS, 6);
    expect(bondRadii()[0]).toBeCloseTo(LICORICE_RADIUS, 6);
  });

  it("restores ball-and-stick radii when switching back to atoms", () => {
    const { renderer, atomRadii, bondRadii } = makeRendererWithMeshes();
    renderer.setRepresentationType("licorice");
    renderer.setRepresentationType("atoms");

    const ar = atomRadii();
    expect(ar[0]).toBeCloseTo(getRadius(6) * BALL_STICK_ATOM_SCALE, 6);
    expect(ar[1]).toBeCloseTo(getRadius(8) * BALL_STICK_ATOM_SCALE, 6);
    expect(bondRadii()[0]).toBeCloseTo(BOND_RADIUS, 6);
  });
});
