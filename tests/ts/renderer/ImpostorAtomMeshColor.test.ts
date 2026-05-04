import { describe, it, expect } from "vitest";
import { ImpostorAtomMesh } from "@/renderer/ImpostorAtomMesh";
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

describe("ImpostorAtomMesh.applyColorOverrides", () => {
  it("writes per-atom RGB into the color buffer for non-NaN entries", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());

    const overrides = new Float32Array(9);
    overrides.fill(NaN);
    overrides[3] = 1.0;
    overrides[4] = 0.5;
    overrides[5] = 0.25;

    mesh.applyColorOverrides(overrides);
    const buf = mesh.getColorBuffer();
    expect(buf[3]).toBeCloseTo(1.0, 6);
    expect(buf[4]).toBeCloseTo(0.5, 6);
    expect(buf[5]).toBeCloseTo(0.25, 6);
  });

  it("leaves atoms whose r-channel is NaN at their base color", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());
    const buf = mesh.getColorBuffer();
    const baseR = buf[0];
    const baseG = buf[1];
    const baseB = buf[2];

    const overrides = new Float32Array(9);
    overrides.fill(NaN);
    // override only atom 1, leave atom 0 + 2 untouched (NaN sentinel)
    overrides[3] = 0.9;
    overrides[4] = 0.1;
    overrides[5] = 0.1;

    mesh.applyColorOverrides(overrides);
    const after = mesh.getColorBuffer();
    expect(after[0]).toBe(baseR);
    expect(after[1]).toBe(baseG);
    expect(after[2]).toBe(baseB);
  });

  it("ignores entries beyond nAtoms", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());

    // Buffer larger than nAtoms*3 (e.g. stale buffer from a bigger snapshot)
    const overrides = new Float32Array(15);
    overrides.fill(0.7);

    expect(() => mesh.applyColorOverrides(overrides)).not.toThrow();
    const buf = mesh.getColorBuffer();
    // First 3 atoms are written; nothing past atom 3 should be touched.
    expect(buf[0]).toBeCloseTo(0.7, 6);
    expect(buf[8]).toBeCloseTo(0.7, 6);
    expect(buf.length).toBe(9);
  });

  it("getColorBuffer length tracks the loaded atom count", () => {
    const mesh = new ImpostorAtomMesh(8);
    mesh.loadSnapshot(makeSnapshot());
    expect(mesh.getColorBuffer().length).toBe(9);
  });
});
