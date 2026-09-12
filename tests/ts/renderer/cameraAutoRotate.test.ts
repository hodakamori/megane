import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";
import {
  rotateCameraAroundTarget,
  startAutoRotate,
  type AutoRotateRenderer,
} from "@/renderer/cameraAutoRotate";

function makeRenderer(
  position: [number, number, number],
  up: [number, number, number],
  target: [number, number, number] | null,
): AutoRotateRenderer & { camera: THREE.OrthographicCamera } {
  const camera = new THREE.OrthographicCamera();
  camera.position.set(...position);
  camera.up.set(...up);
  return {
    camera,
    getCamera: () => camera,
    getCameraState: () => (target ? { target } : null),
  };
}

describe("rotateCameraAroundTarget", () => {
  it("orbits the camera around the target about the up axis", () => {
    const r = makeRenderer([10, 0, 5], [0, 0, 1], [0, 0, 5]);
    rotateCameraAroundTarget(r, Math.PI / 2);
    expect(r.camera.position.x).toBeCloseTo(0, 6);
    expect(r.camera.position.y).toBeCloseTo(10, 6);
    // Height along the up axis and the distance to the target are preserved.
    expect(r.camera.position.z).toBeCloseTo(5, 6);
    expect(r.camera.position.distanceTo(new THREE.Vector3(0, 0, 5))).toBeCloseTo(10, 6);
    expect(r.camera.up.toArray()).toEqual([0, 0, 1]);
  });

  it("uses the camera's own (unnormalized) up vector as the axis", () => {
    const r = makeRenderer([0, 5, 0], [3, 0, 0], [0, 0, 0]);
    rotateCameraAroundTarget(r, Math.PI);
    expect(r.camera.position.x).toBeCloseTo(0, 6);
    expect(r.camera.position.y).toBeCloseTo(-5, 6);
    expect(r.camera.position.z).toBeCloseTo(0, 6);
  });

  it("is a no-op before mount or for a zero angle", () => {
    const unmounted = makeRenderer([1, 2, 3], [0, 0, 1], null);
    rotateCameraAroundTarget(unmounted, 1);
    expect(unmounted.camera.position.toArray()).toEqual([1, 2, 3]);

    const mounted = makeRenderer([1, 2, 3], [0, 0, 1], [0, 0, 0]);
    rotateCameraAroundTarget(mounted, 0);
    expect(mounted.camera.position.toArray()).toEqual([1, 2, 3]);
  });
});

describe("startAutoRotate", () => {
  /** Manual rAF: `frame(t)` runs the pending callback at time `t`. */
  function fakeRaf() {
    let pending: ((t: number) => void) | null = null;
    let next = 1;
    const raf = vi.fn((cb: (t: number) => void) => {
      pending = cb;
      return next++;
    });
    const caf = vi.fn(() => {
      pending = null;
    });
    const frame = (t: number) => {
      const cb = pending;
      pending = null;
      cb?.(t);
    };
    return { raf, caf, frame };
  }

  it("rotates at the requested degrees per second, independent of frame rate", () => {
    const r = makeRenderer([10, 0, 0], [0, 0, 1], [0, 0, 0]);
    const { raf, caf, frame } = fakeRaf();
    const stop = startAutoRotate(r, 90, raf, caf);

    // First frame only sets the time base.
    frame(1000);
    expect(r.camera.position.x).toBeCloseTo(10, 6);

    // 100 ms later at 90°/s → 9°, whatever the frame spacing was before.
    frame(1100);
    let angle = Math.atan2(r.camera.position.y, r.camera.position.x);
    expect((angle * 180) / Math.PI).toBeCloseTo(9, 6);

    // Four more 100 ms frames → 45° total.
    for (const t of [1200, 1300, 1400, 1500]) frame(t);
    expect(r.camera.position.x).toBeCloseTo(10 * Math.SQRT1_2, 6);
    expect(r.camera.position.y).toBeCloseTo(10 * Math.SQRT1_2, 6);

    // Two 25 ms frames advance as much as one 50 ms frame would: 4.5°.
    frame(1525);
    frame(1550);
    angle = Math.atan2(r.camera.position.y, r.camera.position.x);
    expect((angle * 180) / Math.PI).toBeCloseTo(49.5, 6);

    stop();
    expect(caf).toHaveBeenCalledTimes(1);
    frame(1650);
    angle = Math.atan2(r.camera.position.y, r.camera.position.x);
    expect((angle * 180) / Math.PI).toBeCloseTo(49.5, 6);
  });

  it("clamps the step after a long pause so the model never jumps", () => {
    const r = makeRenderer([10, 0, 0], [0, 0, 1], [0, 0, 0]);
    const { raf, caf, frame } = fakeRaf();
    startAutoRotate(r, 90, raf, caf);
    frame(0);
    // A 10 s gap (hidden tab) is treated as 0.1 s → 9°, not 900°.
    frame(10_000);
    const angle = Math.atan2(r.camera.position.y, r.camera.position.x);
    expect((angle * 180) / Math.PI).toBeCloseTo(9, 6);
  });

  it("defaults to window.requestAnimationFrame / cancelAnimationFrame", () => {
    const r = makeRenderer([10, 0, 0], [0, 0, 1], [0, 0, 0]);
    let pending: FrameRequestCallback | null = null;
    const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      pending = cb;
      return 7;
    });
    const caf = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    try {
      const stop = startAutoRotate(r, 90);
      expect(raf).toHaveBeenCalledTimes(1);
      pending!(0);
      pending!(100);
      const angle = Math.atan2(r.camera.position.y, r.camera.position.x);
      expect((angle * 180) / Math.PI).toBeCloseTo(9, 6);
      stop();
      expect(caf).toHaveBeenCalledWith(7);
    } finally {
      raf.mockRestore();
      caf.mockRestore();
    }
  });

  it("stopping twice is safe", () => {
    const r = makeRenderer([10, 0, 0], [0, 0, 1], [0, 0, 0]);
    const { raf, caf } = fakeRaf();
    const stop = startAutoRotate(r, 90, raf, caf);
    stop();
    stop();
    expect(caf).toHaveBeenCalledTimes(1);
  });
});
