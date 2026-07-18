import { describe, it, expect, beforeEach } from "vitest";
import * as THREE from "three";
import { atomsInRect } from "@/renderer/Picking";
import type { Snapshot } from "@/types";

/** 100×100 container anchored at the client origin. */
const container = {
  getBoundingClientRect: () => ({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
    right: 100,
    bottom: 100,
    x: 0,
    y: 0,
    toJSON() {},
  }),
} as unknown as HTMLElement;

function orthoCamera(): THREE.OrthographicCamera {
  const cam = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 1000);
  cam.position.set(0, 0, 50);
  cam.lookAt(0, 0, 0);
  cam.updateMatrixWorld(true);
  cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
  cam.updateProjectionMatrix();
  return cam;
}

function snap(): Snapshot {
  // index 0 at origin (screen x=50), 1 at +x (x=75), 2 at -x (x=25)
  return {
    nAtoms: 3,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array([0, 0, 0, 5, 0, 0, -5, 0, 0]),
    elements: new Uint8Array([6, 6, 6]),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
    boxOrigin: null,
    atomChainIds: null,
    atomBFactors: null,
  };
}

describe("atomsInRect", () => {
  let cam: THREE.OrthographicCamera;
  let s: Snapshot;

  beforeEach(() => {
    cam = orthoCamera();
    s = snap();
  });

  it("selects only atoms whose projected center is inside the rect", () => {
    // Left band (x 0..40) captures the -x atom (screen x≈25) only.
    const got = atomsInRect(cam, container, s, s.positions, { x0: 0, y0: 0, x1: 40, y1: 100 });
    expect(got).toEqual([2]);
  });

  it("selects everything when the rect covers the whole viewport", () => {
    const got = atomsInRect(cam, container, s, s.positions, { x0: 0, y0: 0, x1: 100, y1: 100 });
    expect(got.sort()).toEqual([0, 1, 2]);
  });

  it("is corner-order independent", () => {
    const a = atomsInRect(cam, container, s, s.positions, { x0: 0, y0: 0, x1: 40, y1: 100 });
    const b = atomsInRect(cam, container, s, s.positions, { x0: 40, y0: 100, x1: 0, y1: 0 });
    expect(a).toEqual(b);
  });

  it("returns nothing for a rect over empty space", () => {
    const got = atomsInRect(cam, container, s, s.positions, { x0: 0, y0: 0, x1: 5, y1: 5 });
    expect(got).toEqual([]);
  });
});
