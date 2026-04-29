/**
 * Cross-platform Viewer Contract & Parity (M5).
 *
 * The contract baseline is a "viewer-region pixel image" of the standard
 * fixture (caffeine_water default load) captured from the WebApp at a fixed
 * viewport. Other platform specs use `expectParityWithContract()` from
 * `lib/setup.ts` to assert that their own viewer-region matches the same
 * pixels (within a small tolerance), which is the assertion that catches
 * "WebApp で動くものが Widget で動かない" cross-platform drift.
 *
 * This spec is also the place where DOM-contract Parity is checked: the
 * required test-id set must be identical across all hosts. Each host spec
 * exposes its contract via the "data-megane-context" attribute; this spec
 * doesn't reach into the other platforms — it captures the WebApp baseline
 * and the per-platform specs assert against it.
 */

import { test, expect } from "playwright/test";
import {
  captureViewerRegion,
  compareToBaseline,
  baselinePath,
  defaultViewerContract,
  assertDomContract,
  waitForReady,
} from "./lib/setup";

const ATOM_COUNT_CAFFEINE = 3024;

test("contract baseline: webapp viewer-region default", async ({ page }) => {
  await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
  await waitForReady(page);

  // Sanity: the fixture is the expected one; otherwise the "contract"
  // would be wrong before it's even captured.
  await assertDomContract(page, [
    ...defaultViewerContract({
      expectedAtoms: ATOM_COUNT_CAFFEINE,
      context: "webapp",
    }),
  ]);

  const target = baselinePath("contract", "caffeine-default-viewer");
  const tmp = target.replace(/\.png$/, ".current.png");
  const buf = await captureViewerRegion(page, tmp);
  const r = await compareToBaseline(target, buf, { maxDiffPercent: 4.0 });
  expect(
    r.ok,
    r.sizeMismatch
      ? "contract baseline size mismatch (Viewport region rect changed)"
      : `contract baseline drift ${r.diffPercent.toFixed(2)}%`,
  ).toBe(true);
});
