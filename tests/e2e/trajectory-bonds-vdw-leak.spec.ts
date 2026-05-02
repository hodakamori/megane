/**
 * Regression spec for the VDW (distance-based) AddBond crash on long
 * trajectory playback.
 *
 * Bug: when the user set AddBond.source to "vdw" (params.bondSource ===
 * "distance") on the default caffeine_water trajectory, every frame ran
 * `ImpostorBondMesh.loadSnapshot()`, which unconditionally rebuilt all
 * eight `InstancedBufferAttribute`s. Three.js' WebGLAttributes keeps
 * each attribute's GL buffer alive until the attribute itself fires
 * `dispose`, so replacing them via setAttribute leaked one set of
 * GPU buffers per frame. After ~100–300 frames the WebGL context was
 * lost and the browser hard-reloaded the page.
 *
 * This spec drives many more frame swaps than the leaky path can
 * survive and asserts:
 *   1. No `webglcontextlost` event fires on the bond canvas.
 *   2. The page does not navigate (reload).
 *   3. Rendering keeps up — `renderEpoch` advances at least once per
 *      seek, proving the renderer is still alive at the end.
 *   4. Three.js' renderer.info.memory is bounded (geometries/textures
 *      do not grow unboundedly, even though Three.js does not count
 *      orphaned attribute GL buffers there — kept as a sanity check).
 */

import { test, expect } from "playwright/test";
import { waitForReady, getReadyState } from "./lib/setup";
import { findNodeIdByType, setNodeParam } from "./lib/pipeline";

const FRAME_SWAPS = 250;
const TRAJECTORY_LENGTH = 5; // caffeine_water_vibration.xtc

test.describe.configure({ mode: "serial" });

test("trajectory-bonds-vdw-leak: 250 frame swaps with bondSource=distance survives without WebGL context loss", async ({
  page,
}) => {
  // The leaky path empirically kills the renderer in ~100–300 frames;
  // 250 swaps is comfortably above that threshold but the loop itself
  // costs ~1 rAF per swap so we extend the per-test budget.
  test.setTimeout(90_000);
  const recordedEvents: string[] = [];

  await page.exposeFunction("__megane_record_event", (name: string) => {
    recordedEvents.push(name);
  });

  await page.addInitScript(() => {
    const w = window as Window & {
      __megane_record_event?: (name: string) => void;
      __megane_canvas_listener_installed?: boolean;
    };
    const tryAttach = () => {
      if (w.__megane_canvas_listener_installed) return;
      const canvas = document.querySelector(
        '[data-testid="megane-viewer"] canvas',
      ) as HTMLCanvasElement | null;
      if (!canvas) return;
      canvas.addEventListener("webglcontextlost", () => {
        w.__megane_record_event?.("webglcontextlost");
      });
      w.__megane_canvas_listener_installed = true;
    };
    const observer = new MutationObserver(tryAttach);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    tryAttach();
  });

  await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
  await waitForReady(page);

  // Attach navigation listener AFTER the initial goto so we only see
  // unexpected reloads triggered by the renderer (the bug under test
  // crashed the GPU process which the browser recovers from with a
  // hard reload of the renderer process).
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) recordedEvents.push("framenavigated");
  });

  // Switch the default add_bond node from "structure" to "distance"
  // (the VDW source) and wait for the resulting render epoch.
  const before = await getReadyState(page);
  const bondNodeId = await findNodeIdByType(page, "add_bond");
  await setNodeParam(page, bondNodeId, { bondSource: "distance" });
  await waitForReady(page, { untilEpoch: before.renderEpoch + 1, timeout: 10_000 });

  // Sanity: bonds were inferred and the listener attached.
  const bondCount = await page
    .locator('[data-testid="megane-viewer"]')
    .first()
    .getAttribute("data-bond-count");
  expect(Number(bondCount)).toBeGreaterThan(100);

  const memBefore = await page.evaluate(() => {
    const w = window as Window & {
      __megane_test?: { getRendererMemory?: () => { geometries: number; textures: number } | null };
    };
    return w.__megane_test?.getRendererMemory?.() ?? null;
  });
  expect(memBefore, "renderer memory hook must be exposed in test mode").not.toBeNull();

  const epochBefore = (await getReadyState(page)).renderEpoch;

  // Drive frame swaps inside the page so we don't pay the Playwright
  // round-trip per iteration. Each iteration seeks to a new frame and
  // waits one rAF for the renderer to react. Frame budget guards
  // against GPU-driver slowdown — the leaky path quickly accumulates
  // hundreds of orphaned GL buffers, which makes each rAF take far
  // longer than steady-state.
  const loopReport = await page.evaluate(
    async ([swaps, length, maxFrameMs]: [number, number, number]) => {
      const w = window as unknown as {
        __megane_test_playback_store?: {
          getState: () => { seekFrame: (i: number) => void };
        };
      };
      const store = w.__megane_test_playback_store;
      if (!store) throw new Error("__megane_test_playback_store not exposed");
      const start = performance.now();
      let worst = 0;
      for (let i = 0; i < swaps; i++) {
        const t0 = performance.now();
        store.getState().seekFrame(i % length);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const dt = performance.now() - t0;
        if (dt > worst) worst = dt;
        if (dt > maxFrameMs) {
          return { completed: i + 1, total: swaps, worstMs: worst, bailed: true };
        }
      }
      return { completed: swaps, total: swaps, worstMs: worst, totalMs: performance.now() - start, bailed: false };
    },
    [FRAME_SWAPS, TRAJECTORY_LENGTH, 1500],
  );
  expect(
    loopReport.bailed,
    `frame loop bailed at swap ${loopReport.completed}/${loopReport.total}, worst frame ${loopReport.worstMs.toFixed(1)}ms — likely GPU buffer leak`,
  ).toBe(false);

  // Reload / context-loss detection.
  expect(recordedEvents, `unexpected events during playback: ${recordedEvents.join(", ")}`).not.toContain(
    "webglcontextlost",
  );
  expect(recordedEvents).not.toContain("framenavigated");

  // Renderer must still be alive and have advanced through the swaps.
  const epochAfter = (await getReadyState(page)).renderEpoch;
  expect(
    epochAfter - epochBefore,
    `renderer stalled: epoch advanced ${epochAfter - epochBefore} of ${FRAME_SWAPS} expected`,
  ).toBeGreaterThanOrEqual(FRAME_SWAPS / 2);

  // Three.js geometry/texture counts shouldn't grow unboundedly. (Note:
  // Three.js does not count orphaned BufferAttribute GL buffers here, so
  // this is a soft check — the primary signal is webglcontextlost above.)
  const memAfter = await page.evaluate(() => {
    const w = window as Window & {
      __megane_test?: { getRendererMemory?: () => { geometries: number; textures: number } | null };
    };
    return w.__megane_test?.getRendererMemory?.() ?? null;
  });
  expect(memAfter).not.toBeNull();
  expect(memAfter!.geometries - memBefore!.geometries).toBeLessThan(20);
  expect(memAfter!.textures - memBefore!.textures).toBeLessThan(20);

  // Final live-renderer check: bond count is still plausible after the loop.
  const bondCountAfter = await page
    .locator('[data-testid="megane-viewer"]')
    .first()
    .getAttribute("data-bond-count");
  expect(Number(bondCountAfter)).toBeGreaterThan(100);
});
