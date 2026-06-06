import { describe, it, expect } from "vitest";
import { MoleculeRenderer } from "@/renderer/MoleculeRenderer";
import { ImpostorAtomMesh } from "@/renderer/ImpostorAtomMesh";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import type { Snapshot } from "@/types";

/** Read the private instance count off a bond mesh's geometry. */
function bondInstanceCount(bond: ImpostorBondMesh): number {
  return (bond as unknown as { geo: { instanceCount: number } }).geo.instanceCount;
}

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

/**
 * Build a renderer with atom + bond meshes attached but no snapshot yet,
 * skipping the WebGL-dependent mount() pipeline. Mirrors the internals-access
 * convention used in MoleculeRendererColor.test.ts.
 */
function makeRendererWithMeshes(): {
  renderer: MoleculeRenderer;
  atom: ImpostorAtomMesh;
  bond: ImpostorBondMesh;
  snapshot: Snapshot;
} {
  const renderer = new MoleculeRenderer();
  const snapshot = makeSnapshot();
  const atom = new ImpostorAtomMesh(8);
  const bond = new ImpostorBondMesh(16);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const internals = renderer as any;
  internals.atomRenderer = atom;
  internals.bondRenderer = bond;
  return { renderer, atom, bond, snapshot };
}

describe("MoleculeRenderer — pending bonds (effect-ordering guard)", () => {
  it("stashes bonds when updateBondsExt runs before a snapshot exists", () => {
    const { renderer, bond, snapshot } = makeRendererWithMeshes();
    // No snapshot set yet — simulates PipelineViewer's parent viewportState
    // effect firing updateBondsExt before the child Viewport's loadSnapshot.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internals = renderer as any;
    expect(internals.snapshot).toBeFalsy();

    renderer.updateBondsExt(snapshot.bonds, null, null, null, snapshot.nAtoms);

    // The bonds were not dropped — they are stashed for replay.
    expect(internals.pendingBonds).not.toBeNull();
    expect(internals.pendingBonds.bonds).toBe(snapshot.bonds);
    expect(internals.pendingBonds.nAtoms).toBe(snapshot.nAtoms);
    // Nothing was pushed into the bond mesh yet.
    expect(bondInstanceCount(bond)).toBe(0);
  });

  it("replays stashed bonds once the snapshot is ready (flushPendingBonds)", () => {
    const { renderer, bond, snapshot } = makeRendererWithMeshes();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internals = renderer as any;

    // 1. updateBondsExt before snapshot → stash, mesh stays empty.
    renderer.updateBondsExt(snapshot.bonds, null, null, null, snapshot.nAtoms);
    expect(internals.pendingBonds).not.toBeNull();
    expect(bondInstanceCount(bond)).toBe(0);

    // 2. loadSnapshot would set this.snapshot and then flush. Emulate that
    //    here (loadSnapshot itself needs a mounted WebGL scene).
    internals.snapshot = snapshot;
    internals.flushPendingBonds();

    // 3. Bonds are now applied and the stash is cleared.
    expect(internals.pendingBonds).toBeNull();
    expect(bondInstanceCount(bond)).toBe(snapshot.nBonds);
  });

  it("does not stash on the live path and clears any prior stash", () => {
    const { renderer, bond, snapshot } = makeRendererWithMeshes();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internals = renderer as any;
    internals.snapshot = snapshot;

    // Live path: snapshot + bondRenderer present → applies immediately.
    renderer.updateBondsExt(snapshot.bonds, null, null, null, snapshot.nAtoms);
    expect(internals.pendingBonds).toBeNull();
    expect(bondInstanceCount(bond)).toBe(snapshot.nBonds);
  });

  it("flushPendingBonds is a no-op when nothing was stashed", () => {
    const { renderer, bond } = makeRendererWithMeshes();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internals = renderer as any;
    internals.snapshot = makeSnapshot();

    internals.flushPendingBonds();
    expect(internals.pendingBonds).toBeNull();
    expect(bondInstanceCount(bond)).toBe(0);
  });
});
