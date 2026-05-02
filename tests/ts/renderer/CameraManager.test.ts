import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import {
  computeViewBounds,
  fitCameraToView,
  applyFrustumInsets,
  createSwitchedCamera,
} from "@/renderer/CameraManager";
import type { Snapshot } from "@/types";

function makeSnapshot(opts: {
  positions: number[];
  elements?: number[];
  box?: number[] | null;
}): Snapshot {
  const positions = new Float32Array(opts.positions);
  const nAtoms = positions.length / 3;
  const elements = new Uint8Array(opts.elements ?? new Array(nAtoms).fill(6));
  return {
    nAtoms,
    nBonds: 0,
    nFileBonds: 0,
    positions,
    elements,
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: opts.box === null || opts.box === undefined ? null : new Float32Array(opts.box),
  };
}

/** Mock OrbitControls — only the surface used by fitCameraToView. */
function makeMockControls() {
  return {
    target: new THREE.Vector3(),
    update: vi.fn(),
  };
}

describe("computeViewBounds", () => {
  it("returns atom-centroid center when no box is present", () => {
    const snap = makeSnapshot({ positions: [-1, -2, -3, 1, 2, 3] });
    const { center, extent } = computeViewBounds(snap);
    expect(center).toEqual([0, 0, 0]);
    expect(extent.extentX).toBeCloseTo(2, 5);
    expect(extent.extentY).toBeCloseTo(4, 5);
    expect(extent.maxExtent).toBeCloseTo(6, 5);
  });

  it("uses simulation cell when box is non-zero", () => {
    // Cubic box of side 10, axes aligned, origin at world origin.
    const snap = makeSnapshot({
      positions: [0, 0, 0], // single atom near origin (ignored for centering)
      box: [10, 0, 0, 0, 10, 0, 0, 0, 10],
    });
    const { center, extent } = computeViewBounds(snap);
    expect(center).toEqual([5, 5, 5]);
    expect(extent.extentX).toBeCloseTo(10, 5);
    expect(extent.extentY).toBeCloseTo(10, 5);
    expect(extent.maxExtent).toBeCloseTo(10, 5);
  });

  it("treats all-zero box as 'no box' (falls back to atom bounds)", () => {
    const snap = makeSnapshot({
      positions: [-1, 0, 0, 1, 0, 0],
      box: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    });
    const { center, extent } = computeViewBounds(snap);
    expect(center).toEqual([0, 0, 0]);
    expect(extent.extentX).toBeCloseTo(2, 5);
  });

  it("returns center=(0,0,0) for a snapshot with zero atoms", () => {
    const snap = makeSnapshot({ positions: [], elements: [] });
    const { center, extent } = computeViewBounds(snap);
    expect(center).toEqual([0, 0, 0]);
    expect(Number.isFinite(extent.maxExtent)).toBe(false); // -Infinity from empty extents
  });

  it("handles a triclinic cell (non-orthogonal vectors)", () => {
    const snap = makeSnapshot({
      positions: [0, 0, 0],
      // a=(4,0,0), b=(2,4,0), c=(0,0,5) — sheared parallelepiped
      box: [4, 0, 0, 2, 4, 0, 0, 0, 5],
    });
    const { center, extent } = computeViewBounds(snap);
    // Center is (a+b+c)/2 = (3, 2, 2.5)
    expect(center[0]).toBeCloseTo(3, 5);
    expect(center[1]).toBeCloseTo(2, 5);
    expect(center[2]).toBeCloseTo(2.5, 5);
    // x extent spans 0..6 (from i=ic=0,ib=1 → x=2; ia=1,ib=1 → x=6)
    expect(extent.extentX).toBeCloseTo(6, 5);
    expect(extent.extentY).toBeCloseTo(4, 5);
  });
});

describe("fitCameraToView", () => {
  it("centers controls.target on the structure", () => {
    const cam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    const controls = makeMockControls();
    const snap = makeSnapshot({ positions: [-1, -2, -3, 1, 2, 3] });
    fitCameraToView(cam, controls as never, snap);
    expect(controls.target.x).toBeCloseTo(0, 5);
    expect(controls.target.y).toBeCloseTo(0, 5);
    expect(controls.target.z).toBeCloseTo(0, 5);
    expect(controls.update).toHaveBeenCalled();
  });

  it("places camera offset along -y by 1.2× max extent", () => {
    const cam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    const controls = makeMockControls();
    const snap = makeSnapshot({ positions: [-1, -1, -1, 1, 1, 1] });
    fitCameraToView(cam, controls as never, snap);
    // Max extent = 2, distance = 2 × 1.2 = 2.4
    expect(cam.position.x).toBeCloseTo(0, 5);
    expect(cam.position.y).toBeCloseTo(-2.4, 5);
    expect(cam.position.z).toBeCloseTo(0, 5);
  });

  it("enforces a minimum distance of 0.1 for tiny structures", () => {
    const cam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    const controls = makeMockControls();
    const snap = makeSnapshot({ positions: [0, 0, 0] }); // single atom → maxExtent=0
    fitCameraToView(cam, controls as never, snap);
    expect(cam.position.y).toBeCloseTo(-0.1, 5);
    expect(cam.near).toBeCloseTo(-1, 5); // -distance * 10
    expect(cam.far).toBeCloseTo(1, 5);
  });

  it("resets ortho zoom and sets near/far from distance", () => {
    const cam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    cam.zoom = 5;
    const controls = makeMockControls();
    const snap = makeSnapshot({ positions: [-1, -1, -1, 1, 1, 1] });
    fitCameraToView(cam, controls as never, snap);
    expect(cam.zoom).toBe(1);
    expect(cam.near).toBeCloseTo(-24, 5); // -2.4 × 10
    expect(cam.far).toBeCloseTo(24, 5);
  });

  it("updates perspective camera near/far and projection matrix", () => {
    const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const before = cam.projectionMatrix.elements.slice();
    const controls = makeMockControls();
    const snap = makeSnapshot({ positions: [-5, -5, -5, 5, 5, 5] });
    fitCameraToView(cam, controls as never, snap);
    // distance = 10 × 1.2 = 12
    expect(cam.near).toBeCloseTo(0.12, 5);
    expect(cam.far).toBeCloseTo(120, 5);
    // projection matrix should have been recomputed
    expect(cam.projectionMatrix.elements).not.toEqual(before);
  });

  it("returns the computed extent so callers can drive frustum insets", () => {
    const cam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    const controls = makeMockControls();
    const snap = makeSnapshot({ positions: [-3, -2, -1, 3, 2, 1] });
    const extent = fitCameraToView(cam, controls as never, snap);
    expect(extent.extentX).toBeCloseTo(6, 5);
    expect(extent.extentY).toBeCloseTo(4, 5);
    expect(extent.maxExtent).toBeCloseTo(6, 5);
  });
});

describe("applyFrustumInsets", () => {
  it("no-ops if the container is degenerate (0 width or height)", () => {
    const cam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    const before = { left: cam.left, right: cam.right, top: cam.top, bottom: cam.bottom };
    applyFrustumInsets(cam, 0, 100, 0, 0, { maxExtent: 10, extentX: 10, extentY: 10 });
    expect(cam.left).toBe(before.left);
    expect(cam.right).toBe(before.right);

    applyFrustumInsets(cam, 100, 0, 0, 0, { maxExtent: 10, extentX: 10, extentY: 10 });
    expect(cam.top).toBe(before.top);
    expect(cam.bottom).toBe(before.bottom);
  });

  it("centers the frustum (no shift) when left/right insets are equal", () => {
    const cam = new THREE.OrthographicCamera();
    applyFrustumInsets(cam, 200, 100, 20, 20, { maxExtent: 10, extentX: 10, extentY: 10 });
    expect(cam.left + cam.right).toBeCloseTo(0, 5);
    expect(cam.top).toBeCloseTo(-cam.bottom, 5);
  });

  it("shifts the frustum when insets are asymmetric", () => {
    const cam = new THREE.OrthographicCamera();
    applyFrustumInsets(cam, 200, 100, 40, 0, { maxExtent: 10, extentX: 10, extentY: 10 });
    // shift = ((40 - 0) / (2*200)) * frustumWidth = 0.1 * frustumWidth
    // → left and right both decrease by `shift`, so center moves to negative x.
    const center = (cam.left + cam.right) / 2;
    expect(center).toBeLessThan(0);
  });

  it("scales frustum height with extent (padding factor 1.2)", () => {
    const cam = new THREE.OrthographicCamera();
    applyFrustumInsets(cam, 200, 100, 0, 0, { maxExtent: 10, extentX: 10, extentY: 10 });
    // halfH = max(extentY/2, extentX/(2·aspect)) × 1.2; aspect = 200/100 = 2
    //       = max(5, 2.5) × 1.2 = 6 → frustumHeight = 12
    expect(cam.top - cam.bottom).toBeCloseTo(12, 4);
  });

  it("enforces a minimum frustum height of 0.1", () => {
    const cam = new THREE.OrthographicCamera();
    applyFrustumInsets(cam, 200, 100, 0, 0, { maxExtent: 0, extentX: 0, extentY: 0 });
    expect(cam.top - cam.bottom).toBeCloseTo(0.1, 5);
  });

  it("clamps effective width to at least 30% of container or 100px", () => {
    const cam = new THREE.OrthographicCamera();
    // Insets eat almost the entire width; effective width should clamp.
    applyFrustumInsets(cam, 200, 100, 90, 90, { maxExtent: 10, extentX: 10, extentY: 10 });
    // With extentY=10, halfH = max(5, 10/(2·effectiveAspect)) × 1.2.
    // Without clamp, effectiveAspect would collapse and halfH would explode.
    // Verify result is finite and reasonable.
    const h = cam.top - cam.bottom;
    expect(Number.isFinite(h)).toBe(true);
    expect(h).toBeLessThan(50);
  });
});

describe("createSwitchedCamera", () => {
  it("creates a perspective camera when enabled=true", () => {
    const ortho = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    ortho.position.set(1, 2, 3);
    const next = createSwitchedCamera(ortho, true, 200, 100);
    expect(next).toBeInstanceOf(THREE.PerspectiveCamera);
    expect((next as THREE.PerspectiveCamera).aspect).toBeCloseTo(2, 5);
  });

  it("creates an orthographic camera when enabled=false", () => {
    const persp = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const next = createSwitchedCamera(persp, false, 100, 200);
    expect(next).toBeInstanceOf(THREE.OrthographicCamera);
    const o = next as THREE.OrthographicCamera;
    expect(o.right - o.left).toBeCloseTo(25, 4); // frustumSize=50, aspect=0.5
    expect(o.top - o.bottom).toBeCloseTo(50, 4);
  });

  it("preserves position and up vector across the switch", () => {
    const ortho = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    ortho.position.set(7, 8, 9);
    ortho.up.set(0, 0, 1);
    const persp = createSwitchedCamera(ortho, true, 100, 100);
    expect(persp.position.toArray()).toEqual([7, 8, 9]);
    expect(persp.up.toArray()).toEqual([0, 0, 1]);
  });

  it("does not mutate the input camera's position vector", () => {
    const ortho = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 1000);
    ortho.position.set(1, 2, 3);
    const persp = createSwitchedCamera(ortho, true, 100, 100);
    persp.position.set(99, 99, 99);
    expect(ortho.position.toArray()).toEqual([1, 2, 3]);
  });
});
