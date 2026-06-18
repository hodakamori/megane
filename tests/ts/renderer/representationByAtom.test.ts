import { describe, it, expect } from "vitest";
import { MoleculeRenderer } from "@/renderer/MoleculeRenderer";
import { ImpostorAtomMesh } from "@/renderer/ImpostorAtomMesh";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import { LineRenderer } from "@/renderer/LineRenderer";
import { BOND_SINGLE, BOND_RADIUS } from "@/constants";
import type { Snapshot } from "@/types";

/** Three atoms: 0-1 bonded, atom 2 isolated. */
function makeSnapshot(): Snapshot {
  return {
    nAtoms: 3,
    nBonds: 1,
    positions: new Float32Array([0, 0, 0, 1, 0, 0, 5, 0, 0]),
    elements: new Uint8Array([8, 1, 6]),
    bonds: new Uint32Array([0, 1]),
    bondOrders: null,
  } as Snapshot;
}

function atomScales(mesh: ImpostorAtomMesh): Float32Array {
  return (mesh as unknown as { scaleOverrideBuf: Float32Array }).scaleOverrideBuf;
}

function bondRadii(mesh: ImpostorBondMesh): Float32Array {
  return (mesh as unknown as { radiusBuf: Float32Array }).radiusBuf;
}

describe("ImpostorAtomMesh.setHiddenMask", () => {
  it("collapses hidden atoms to scale 0 and shows the rest", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setHiddenMask(new Uint8Array([1, 1, 0]));
    const s = atomScales(mesh);
    expect(s[0]).toBe(0);
    expect(s[1]).toBe(0);
    expect(s[2]).toBe(1);
  });

  it("restores atoms when the mask is cleared", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setHiddenMask(new Uint8Array([1, 0, 0]));
    mesh.setHiddenMask(null);
    expect(Array.from(atomScales(mesh).slice(0, 3))).toEqual([1, 1, 1]);
  });

  it("composes the hide with a scale override without losing either", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setScaleOverrides(new Float32Array([2, 2, 2]));
    mesh.setHiddenMask(new Uint8Array([1, 0, 0]));
    const s = atomScales(mesh);
    expect(s[0]).toBe(0); // hidden wins
    expect(s[1]).toBe(2); // scale override preserved
    expect(s[2]).toBe(2);
  });

  it("keeps hidden atoms hidden when scale overrides are cleared per frame", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setHiddenMask(new Uint8Array([1, 0, 0]));
    // Simulate the per-frame override reset (no modify node active).
    mesh.clearOverrides();
    expect(atomScales(mesh)[0]).toBe(0);
    expect(atomScales(mesh)[1]).toBe(1);
  });

  it("preserves the hide buffers through a capacity grow", () => {
    // Capacity 1 but 3 atoms → loadSnapshot triggers grow(), which must carry
    // the raw-scale and hidden buffers over to the reallocated arrays.
    const mesh = new ImpostorAtomMesh(1);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setScaleOverrides(new Float32Array([2, 2, 2]));
    mesh.setHiddenMask(new Uint8Array([0, 0, 1]));
    const s = atomScales(mesh);
    expect(s[0]).toBe(2);
    expect(s[2]).toBe(0);
  });

  it("treats a short mask as 'hide only the listed atoms'", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setHiddenMask(new Uint8Array([1])); // shorter than nAtoms
    const s = atomScales(mesh);
    expect(s[0]).toBe(0);
    expect(s[1]).toBe(1);
    expect(s[2]).toBe(1);
  });

  it("resets the hide mask on a new snapshot", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setHiddenMask(new Uint8Array([1, 1, 1]));
    mesh.loadSnapshot(makeSnapshot());
    expect(Array.from(atomScales(mesh).slice(0, 3))).toEqual([1, 1, 1]);
  });
});

describe("ImpostorBondMesh.setHiddenMask", () => {
  it("zeros the radius of bonds touching a hidden atom", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());
    expect(bondRadii(mesh)[0]).toBeCloseTo(BOND_RADIUS, 6);
    mesh.setHiddenMask(new Uint8Array([1, 0, 0])); // atom 0 hidden → bond 0-1 hidden
    expect(bondRadii(mesh)[0]).toBe(0);
  });

  it("restores the bond radius when the mask is cleared", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setHiddenMask(new Uint8Array([1, 0, 0]));
    mesh.setHiddenMask(null);
    expect(bondRadii(mesh)[0]).toBeCloseTo(BOND_RADIUS, 6);
  });

  it("re-applies the mask across a topology reload", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setHiddenMask(new Uint8Array([0, 1, 0])); // atom 1 hidden → bond 0-1 hidden
    mesh.loadSnapshot(makeSnapshot());
    expect(bondRadii(mesh)[0]).toBe(0);
  });

  it("leaves a bond visible when neither endpoint is hidden", () => {
    const mesh = new ImpostorBondMesh(16);
    mesh.loadSnapshot(makeSnapshot());
    mesh.setHiddenMask(new Uint8Array([0, 0, 1])); // only the isolated atom hidden
    expect(bondRadii(mesh)[0]).toBeCloseTo(BOND_RADIUS, 6);
  });
});

describe("MoleculeRenderer.setRepresentationByAtom", () => {
  function makeRenderer(): {
    renderer: MoleculeRenderer;
    atom: ImpostorAtomMesh;
    bond: ImpostorBondMesh;
    line: LineRenderer;
  } {
    const renderer = new MoleculeRenderer();
    const snapshot = makeSnapshot();
    const atom = new ImpostorAtomMesh(8);
    atom.loadSnapshot(snapshot);
    const bond = new ImpostorBondMesh(16);
    bond.loadSnapshot(snapshot);
    const line = new LineRenderer();
    line.loadSnapshot(snapshot);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internals = renderer as any;
    internals.snapshot = snapshot;
    internals.atomRenderer = atom;
    internals.bondRenderer = bond;
    internals.lineRenderer = line;
    return { renderer, atom, bond, line };
  }

  it("draws the line atoms as lines and hides them from the meshes", () => {
    const { renderer, atom, bond, line } = makeRenderer();
    renderer.setRepresentationType("atoms");
    // atoms 0,1 → line; atom 2 → atoms (ball-and-stick).
    renderer.setRepresentationByAtom(["line", "line", "atoms"]);

    const scales = (atom as unknown as { scaleOverrideBuf: Float32Array }).scaleOverrideBuf;
    expect(scales[0]).toBe(0); // line atom hidden from spheres
    expect(scales[1]).toBe(0);
    expect(scales[2]).toBe(1); // ball-and-stick atom still drawn

    // Bond 0-1 (both line atoms) hidden from cylinders.
    expect((bond as unknown as { radiusBuf: Float32Array }).radiusBuf[0]).toBe(0);

    // Line renderer shows just the 0-1 bond (2 segments → 4 verts) and is visible.
    expect(line.mesh.visible).toBe(true);
    expect(line.mesh.geometry.getAttribute("position").count).toBe(4);
  });

  it("reverts to a uniform mesh view when passed null", () => {
    const { renderer, atom, bond, line } = makeRenderer();
    renderer.setRepresentationType("atoms");
    renderer.setRepresentationByAtom(["line", "line", "atoms"]);
    renderer.setRepresentationByAtom(null);

    const scales = (atom as unknown as { scaleOverrideBuf: Float32Array }).scaleOverrideBuf;
    expect(Array.from(scales.slice(0, 3))).toEqual([1, 1, 1]);
    expect((bond as unknown as { radiusBuf: Float32Array }).radiusBuf[0]).toBeCloseTo(
      BOND_RADIUS,
      6,
    );
    expect(line.mesh.visible).toBe(false);
  });
});

describe("constant export sanity", () => {
  it("BOND_SINGLE is the default order", () => {
    expect(BOND_SINGLE).toBeDefined();
  });
});
