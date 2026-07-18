/**
 * Unit tests for MoleculeRenderer's heterogeneous-trajectory slow path in
 * updateFrame: when a Frame carries per-frame elements/bonds/box, the atom mesh
 * is re-topologised (instanceCount follows the frame's atom count), the bond
 * mesh is rebuilt, and the unit cell is redrawn. A frame that carries only
 * positions must stay on the allocation-free fast path.
 */

import { describe, it, expect } from "vitest";
import { MoleculeRenderer } from "@/renderer/MoleculeRenderer";
import { ImpostorAtomMesh } from "@/renderer/ImpostorAtomMesh";
import { ImpostorBondMesh } from "@/renderer/ImpostorBondMesh";
import type { Snapshot, Frame } from "@/types";

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

function makeRenderer() {
  const renderer = new MoleculeRenderer();
  const snapshot = makeSnapshot();
  const atom = new ImpostorAtomMesh(64);
  atom.loadSnapshot(snapshot);
  const bond = new ImpostorBondMesh(64);
  bond.loadSnapshot(snapshot);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const internals = renderer as any;
  internals.snapshot = snapshot;
  internals.atomRenderer = atom;
  internals.bondRenderer = bond;
  // The scene is normally created during canvas init; stub it so lazy
  // renderers (e.g. the per-frame cell) can attach without a WebGL context.
  internals.scene = { add: () => {}, remove: () => {} };
  return { renderer, atom, bond, internals };
}

function instanceCount(atom: ImpostorAtomMesh): number {
  // InstancedBufferGeometry.instanceCount, set by loadSnapshot/updateTopology.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (atom.mesh.geometry as any).instanceCount as number;
}

describe("MoleculeRenderer — heterogeneous frame slow path", () => {
  it("re-topologises the atom mesh when a frame grows the atom count", () => {
    const { renderer, atom } = makeRenderer();
    expect(instanceCount(atom)).toBe(2);

    const frame: Frame = {
      frameId: 1,
      nAtoms: 3,
      positions: new Float32Array([0, 0, 0, 1, 0, 0, 2, 0, 0]),
      elements: new Uint8Array([6, 7, 8]),
      bonds: new Uint32Array([0, 1, 1, 2]),
      nBonds: 2,
    };
    renderer.updateFrame(frame);

    // Atom mesh now renders 3 instances.
    expect(instanceCount(atom)).toBe(3);
  });

  it("redraws the unit cell for a per-frame box", () => {
    const { renderer, internals } = makeRenderer();
    expect(internals.cellRenderer).toBeFalsy();

    const frame: Frame = {
      frameId: 1,
      nAtoms: 2,
      positions: new Float32Array([0, 0, 0, 1, 0, 0]),
      box: new Float32Array([12, 0, 0, 0, 12, 0, 0, 0, 12]),
    };
    renderer.updateFrame(frame);

    // A cell renderer was lazily created and given the per-frame box.
    expect(internals.cellRenderer).toBeTruthy();
  });

  it("anchors the per-frame cell at the frame's box origin", () => {
    const { renderer, internals } = makeRenderer();

    const frame: Frame = {
      frameId: 1,
      nAtoms: 2,
      positions: new Float32Array([165, 10, 605, 200, 75, 750]),
      box: new Float32Array([80, 0, 0, 0, 150, 0, 0, 0, 300]),
      boxOrigin: new Float32Array([160, 0, 600]),
    };
    renderer.updateFrame(frame);

    const buf = internals.cellRenderer.mesh.geometry.getAttribute("position")
      .array as Float32Array;
    // The wireframe's origin corner sits at the frame's box origin.
    expect([buf[0], buf[1], buf[2]]).toEqual([160, 0, 600]);
    expect([buf[69], buf[70], buf[71]]).toEqual([240, 150, 900]);
  });

  it("keeps a positions-only frame on the fast path (no re-topology)", () => {
    const { renderer, atom } = makeRenderer();
    const before = instanceCount(atom);

    const frame: Frame = {
      frameId: 1,
      nAtoms: 2,
      positions: new Float32Array([0.5, 0, 0, 1.5, 0, 0]),
    };
    renderer.updateFrame(frame);

    // instanceCount unchanged; positions updated in place.
    expect(instanceCount(atom)).toBe(before);
  });
});
