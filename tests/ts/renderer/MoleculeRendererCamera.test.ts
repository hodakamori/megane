import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import { MoleculeRenderer, type MeganeCameraState } from "@/renderer/MoleculeRenderer";

/**
 * Tests for the camera-state persistence API added in PR #392:
 *   - getCameraState()        — read current camera/controls into a snapshot
 *   - applyCameraState()      — restore a previously captured snapshot
 *   - setCameraChangeCallback() — hook user-driven camera changes
 *
 * MoleculeRenderer's full mount() requires a real WebGL context and DOM, which
 * jsdom does not supply. These tests instead instantiate the class without
 * mounting and inject minimal stand-ins for `camera` and `controls`. The new
 * methods only touch those two fields, so this is sufficient to exercise the
 * branches added by the patch.
 */

interface ControlsStub {
  target: THREE.Vector3;
  enableDamping: boolean;
  update: ReturnType<typeof vi.fn>;
}

function makeControls(enableDamping = true): ControlsStub {
  return {
    target: new THREE.Vector3(),
    enableDamping,
    update: vi.fn(),
  };
}

/**
 * Build a renderer instance with just enough state for the camera-state API.
 * We bypass mount() (which needs WebGL) by directly assigning the private
 * `camera`/`controls`/`perspectiveMode` fields via a typed cast.
 */
function makeRenderer(opts: {
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  controls: ControlsStub;
  perspectiveMode: boolean;
}): MoleculeRenderer {
  const r = new MoleculeRenderer();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const internals = r as any;
  internals.camera = opts.camera;
  internals.controls = opts.controls;
  internals.perspectiveMode = opts.perspectiveMode;
  return r;
}

describe("MoleculeRenderer.getCameraState", () => {
  it("returns null when camera is missing", () => {
    const r = new MoleculeRenderer();
    expect(r.getCameraState()).toBeNull();
  });

  it("returns null when controls are missing", () => {
    const r = new MoleculeRenderer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r as any).camera = new THREE.OrthographicCamera();
    // controls is still undefined
    expect(r.getCameraState()).toBeNull();
  });

  it("captures orthographic camera position, target, and zoom", () => {
    const cam = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
    cam.position.set(1, 2, 3);
    cam.zoom = 2.5;
    const ctrls = makeControls();
    ctrls.target.set(4, 5, 6);
    const r = makeRenderer({ camera: cam, controls: ctrls, perspectiveMode: false });

    const state = r.getCameraState();
    expect(state).toEqual({
      mode: "orthographic",
      position: [1, 2, 3],
      target: [4, 5, 6],
      zoom: 2.5,
    });
  });

  it("reports perspective mode when perspectiveMode flag is true", () => {
    const cam = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    cam.position.set(0, -10, 0);
    cam.zoom = 1;
    const r = makeRenderer({ camera: cam, controls: makeControls(), perspectiveMode: true });
    expect(r.getCameraState()?.mode).toBe("perspective");
  });
});

describe("MoleculeRenderer.applyCameraState", () => {
  it("is a no-op when camera is missing", () => {
    const r = new MoleculeRenderer();
    // Should not throw even though camera/controls are undefined.
    expect(() =>
      r.applyCameraState({
        mode: "orthographic",
        position: [1, 1, 1],
        target: [0, 0, 0],
        zoom: 1,
      }),
    ).not.toThrow();
  });

  it("writes position, target, and zoom into camera/controls", () => {
    const cam = new THREE.OrthographicCamera();
    const ctrls = makeControls();
    const r = makeRenderer({ camera: cam, controls: ctrls, perspectiveMode: false });

    const state: MeganeCameraState = {
      mode: "orthographic",
      position: [9, 8, 7],
      target: [1, 2, 3],
      zoom: 3.25,
    };
    r.applyCameraState(state);

    expect(cam.position.toArray()).toEqual([9, 8, 7]);
    expect(ctrls.target.toArray()).toEqual([1, 2, 3]);
    expect(cam.zoom).toBe(3.25);
    expect(ctrls.update).toHaveBeenCalled();
  });

  it("temporarily disables damping during the update and restores it", () => {
    const cam = new THREE.OrthographicCamera();
    const ctrls = makeControls(/* enableDamping */ true);
    let dampingDuringUpdate: boolean | null = null;
    ctrls.update.mockImplementation(() => {
      dampingDuringUpdate = ctrls.enableDamping;
    });
    const r = makeRenderer({ camera: cam, controls: ctrls, perspectiveMode: false });

    r.applyCameraState({
      mode: "orthographic",
      position: [0, 0, 0],
      target: [0, 0, 0],
      zoom: 1,
    });

    expect(dampingDuringUpdate).toBe(false);
    // After the call, the previous damping value must be restored.
    expect(ctrls.enableDamping).toBe(true);
  });

  it("resets accumulated frustum pan offsets", () => {
    const cam = new THREE.OrthographicCamera();
    const ctrls = makeControls();
    const r = makeRenderer({ camera: cam, controls: ctrls, perspectiveMode: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internals = r as any;
    internals._frustumPanX = 12;
    internals._frustumPanY = -7;

    r.applyCameraState({
      mode: "orthographic",
      position: [0, 0, 0],
      target: [0, 0, 0],
      zoom: 1,
    });

    expect(internals._frustumPanX).toBe(0);
    expect(internals._frustumPanY).toBe(0);
  });

  it("calls setPerspective when the requested mode differs from the current mode", () => {
    const cam = new THREE.OrthographicCamera();
    const ctrls = makeControls();
    const r = makeRenderer({ camera: cam, controls: ctrls, perspectiveMode: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internals = r as any;

    // Without a container set, setPerspective() flips the flag and early-returns
    // before touching renderer/controls — safe to invoke from an unmounted instance.
    r.applyCameraState({
      mode: "perspective",
      position: [0, 0, 0],
      target: [0, 0, 0],
      zoom: 1,
    });

    expect(internals.perspectiveMode).toBe(true);
  });

  it("skips setPerspective when the requested mode matches the current mode", () => {
    const cam = new THREE.OrthographicCamera();
    const ctrls = makeControls();
    const r = makeRenderer({ camera: cam, controls: ctrls, perspectiveMode: false });
    const setPerspectiveSpy = vi.spyOn(r, "setPerspective");

    r.applyCameraState({
      mode: "orthographic",
      position: [0, 0, 0],
      target: [0, 0, 0],
      zoom: 1,
    });

    expect(setPerspectiveSpy).not.toHaveBeenCalled();
  });
});

describe("MoleculeRenderer.setCameraChangeCallback", () => {
  it("stores the callback so subsequent camera ops can fire it", () => {
    const cam = new THREE.OrthographicCamera();
    const ctrls = makeControls();
    const r = makeRenderer({ camera: cam, controls: ctrls, perspectiveMode: false });

    const cb = vi.fn();
    r.setCameraChangeCallback(cb);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((r as any)._cameraChangeCallback).toBe(cb);
  });

  it("setCameraMode fires the registered callback", () => {
    const cam = new THREE.OrthographicCamera();
    const ctrls = makeControls();
    // Start in orthographic; setCameraMode("orthographic") must still fire the
    // callback because the patch invokes it unconditionally after setPerspective.
    const r = makeRenderer({ camera: cam, controls: ctrls, perspectiveMode: false });
    const cb = vi.fn();
    r.setCameraChangeCallback(cb);

    r.setCameraMode("orthographic");
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("clearing the callback prevents future invocations", () => {
    const cam = new THREE.OrthographicCamera();
    const ctrls = makeControls();
    const r = makeRenderer({ camera: cam, controls: ctrls, perspectiveMode: false });
    const cb = vi.fn();
    r.setCameraChangeCallback(cb);
    r.setCameraChangeCallback(null);

    r.setCameraMode("orthographic");
    expect(cb).not.toHaveBeenCalled();
  });
});
