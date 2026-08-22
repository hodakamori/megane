/**
 * Test-mode `framesApplied` counter: E2E capture helpers gate on it to know
 * that at least one trajectory frame's positions were applied via
 * updateFrame() (lazily decoded trajectories apply frame 0 asynchronously,
 * so captures would otherwise race the decode).
 *
 * `_testMode` in MoleculeRenderer is captured at module load, so the flag
 * must be set before the (dynamic) import below.
 */

import { describe, it, expect } from "vitest";
import type { Snapshot, Frame } from "@/types";

(globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
const { MoleculeRenderer } = await import("@/renderer/MoleculeRenderer");
const { ImpostorAtomMesh } = await import("@/renderer/ImpostorAtomMesh");
const { ImpostorBondMesh } = await import("@/renderer/ImpostorBondMesh");

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
  internals.scene = { add: () => {}, remove: () => {} };
  return renderer;
}

function framesApplied(): number {
  const w = window as unknown as { __megane_test_ready?: { framesApplied?: number } };
  return w.__megane_test_ready?.framesApplied ?? 0;
}

describe("MoleculeRenderer — test-mode framesApplied counter", () => {
  it("increments on every applied trajectory frame", () => {
    const renderer = makeRenderer();
    const before = framesApplied();
    const frame: Frame = {
      frameId: 0,
      nAtoms: 2,
      positions: new Float32Array([0, 0, 0, 2, 0, 0]),
    };
    renderer.updateFrame(frame);
    expect(framesApplied()).toBe(before + 1);
    renderer.updateFrame(frame);
    expect(framesApplied()).toBe(before + 2);
  });

  it("does not count frames dropped before a snapshot is bound", () => {
    const renderer = new MoleculeRenderer();
    const before = framesApplied();
    renderer.updateFrame({ frameId: 0, nAtoms: 2, positions: new Float32Array(6) });
    expect(framesApplied()).toBe(before);
  });
});
