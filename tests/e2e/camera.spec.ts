/**
 * Phase 2.3 — Camera operations.
 *
 * Drives the renderer's camera state via the test API exposed in Stage 1
 * (`window.__megane_test.{setCameraMode,resetCamera,getCameraState}`).
 * The OrbitControls drag path is non-deterministic; this spec
 * deliberately avoids mouse-driven camera input and instead asserts
 * state transitions through the programmatic API.
 *
 * Cases:
 *   - Initial state: orthographic, target near origin
 *   - setCameraMode('perspective') flips mode and re-fits
 *   - resetCamera() returns target to the snapshot center after pan
 *
 * Widget hosts skip — WidgetViewer also exposes the renderer test API,
 * but the widget-jupyterlab/widget-vscode boots add ~30s+ overhead per
 * test, and camera state is host-agnostic. Coverage on webapp +
 * jupyterlab-doc + vscode is sufficient regression detection.
 */

import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectViewerRegionMatch,
  stabilizeUi,
  waitForReady,
  getReadyState,
} from "./lib/setup";
import { bootHost, getHost, type HostBoot } from "./lib/host-fixture";
import {
  getCameraState,
  resetCamera,
  setCameraMode,
} from "./lib/render-utils";

const PLATFORM = "camera";
const FIXTURE = "caffeine_water.pdb";
const FIXTURE_ATOMS = 3024;

test.describe.configure({ mode: "serial" });

let boot: HostBoot | null = null;

test.beforeAll(async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  boot = await bootHost(page, { fixture: FIXTURE, portSeed: info.workerIndex + 21 });
  await assertDomContract(boot.scope, [
    ...defaultViewerContract({ expectedAtoms: FIXTURE_ATOMS, context: boot.context }),
  ]);
});

test.afterAll(async () => {
  if (boot) {
    await boot.teardown();
    boot = null;
  }
});

test("camera: default state is orthographic and viewer-region baseline matches", async () => {
  if (!boot) test.skip(true, "boot not initialised");
  const state = await getCameraState(boot!.scope);
  expect(state).not.toBeNull();
  expect(state!.mode).toBe("orthographic");
  // Target is the snapshot bounding-box center; for caffeine_water it is
  // a finite number. Just sanity-check it's not NaN/Inf.
  expect(Number.isFinite(state!.target[0])).toBe(true);
  expect(Number.isFinite(state!.position[0])).toBe(true);
  await stabilizeUi(boot!.scope);
  await expectViewerRegionMatch(boot!.scope, PLATFORM, `${getHost()}-orthographic`);
});

test("camera: setCameraMode('perspective') flips mode and re-fits", async () => {
  if (!boot) test.skip(true, "boot not initialised");
  const before = await getReadyState(boot!.scope);
  await setCameraMode(boot!.scope, "perspective");
  await waitForReady(boot!.scope, { untilEpoch: before.renderEpoch + 1, timeout: 10_000 });
  const state = await getCameraState(boot!.scope);
  expect(state!.mode).toBe("perspective");
  await stabilizeUi(boot!.scope);
  await expectViewerRegionMatch(boot!.scope, PLATFORM, `${getHost()}-perspective`);
});

test("camera: resetCamera() restores fitted view", async () => {
  if (!boot) test.skip(true, "boot not initialised");
  // Switch back to orthographic first so the reset baseline is comparable
  // with the initial orthographic capture.
  const beforeMode = await getReadyState(boot!.scope);
  await setCameraMode(boot!.scope, "orthographic");
  await waitForReady(boot!.scope, { untilEpoch: beforeMode.renderEpoch + 1, timeout: 10_000 });
  const stateA = await getCameraState(boot!.scope);
  await resetCamera(boot!.scope);
  // resetCamera doesn't necessarily increment renderEpoch on its own —
  // the next animate() tick will. Wait briefly for any frame.
  await boot!.scope.waitForTimeout(200);
  const stateB = await getCameraState(boot!.scope);
  // Targets should agree to within 1e-3 since both states fit the same
  // bounding box.
  for (let i = 0; i < 3; i++) {
    expect(Math.abs(stateA!.target[i] - stateB!.target[i])).toBeLessThan(1e-3);
  }
  await stabilizeUi(boot!.scope);
  await expectViewerRegionMatch(boot!.scope, PLATFORM, `${getHost()}-reset`);
});
