/**
 * Measurement E2E (M2).
 *
 * Right-click on canvas atoms to drive the MeasurementPanel through 1, 2,
 * 3 and 4 selected atoms (single, distance, angle, dihedral). Verifies the
 * `data-selection-count` attribute on the measurement-panel and that the
 * Clear button resets to zero.
 *
 * Atom-pixel coordinates are not derived from a renderer hook — instead we
 * walk a small grid of viewport positions near the center until each
 * right-click registers a hit. The default caffeine_water scene has the
 * molecule centered, so a 5x5 grid at ±60px from center covers the atoms.
 */

import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectViewerRegionMatch,
  getReadyState,
  waitForReady,
} from "./lib/setup";

const PLATFORM = "measurement";

const GRID_OFFSETS: Array<{ dx: number; dy: number }> = [];
for (const dx of [-80, -40, 0, 40, 80]) {
  for (const dy of [-60, -20, 20, 60]) {
    GRID_OFFSETS.push({ dx, dy });
  }
}

async function rightClickUntilSelectionAdvances(
  page: import("playwright/test").Page,
  expected: number,
): Promise<void> {
  const canvas = page.locator('[data-testid="viewer-root"] canvas').first();
  const box = await canvas.boundingBox();
  if (!box) throw new Error("canvas bounding box unavailable");
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  for (const { dx, dy } of GRID_OFFSETS) {
    await page.mouse.click(cx + dx, cy + dy, { button: "right" });
    // Selection updates synchronously through React state; a single rAF is
    // enough to flush the measurement-panel re-render.
    await page.waitForTimeout(120);
    const count = await page
      .locator('[data-testid="measurement-panel"]')
      .first()
      .getAttribute("data-selection-count");
    if (Number(count) >= expected) return;
  }
  throw new Error(`measurement-panel never reached selection-count ${expected}`);
}

test.describe("measurement: webapp right-click selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  test("right-click 4 atoms drives panel 1 → 2 → 3 → 4 then clears", async ({ page }) => {
    await assertDomContract(page, [
      ...defaultViewerContract({ context: "webapp" }),
    ]);

    const before = await getReadyState(page);

    for (let i = 1; i <= 4; i++) {
      await rightClickUntilSelectionAdvances(page, i);
    }

    const count = await page
      .locator('[data-testid="measurement-panel"]')
      .first()
      .getAttribute("data-selection-count");
    expect(Number(count)).toBe(4);

    // The renderer should have advanced its epoch as selection markers were
    // appended to the scene.
    const afterPick = await getReadyState(page);
    expect(afterPick.renderEpoch).toBeGreaterThan(before.renderEpoch);

    await expectViewerRegionMatch(page, PLATFORM, "selection-4");

    await page.locator('[data-testid="measurement-clear"]').click();
    await page.waitForTimeout(120);

    const remaining = await page
      .locator('[data-testid="measurement-panel"]')
      .count();
    // Panel may still be visible with count=0 OR may unmount entirely; both
    // are valid "cleared" states. Accept either.
    if (remaining > 0) {
      const cleared = await page
        .locator('[data-testid="measurement-panel"]')
        .first()
        .getAttribute("data-selection-count");
      expect(Number(cleared)).toBe(0);
    }
  });
});
