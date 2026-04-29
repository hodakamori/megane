/**
 * Collapsible-panel E2E (M2).
 *
 * The webapp surfaces its main host UI as a "Pipeline" panel built from
 * CollapsiblePanel. This spec verifies:
 *   - default state is open  (data-collapsed="false")
 *   - clicking the toggle flips the attribute
 *   - the full-page differs (the panel chrome is gone) — the viewer-region
 *     intentionally re-flows into the freed space, so we don't assert
 *     viewer pixels here.
 */

import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectFullPageMatch,
  expectViewerRegionMatch,
  waitForReady,
} from "./lib/setup";

const PLATFORM = "sidebar";

test.describe("collapsible panel: webapp pipeline panel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  test("pipeline panel default open, toggle collapses", async ({ page }) => {
    await assertDomContract(page, [
      ...defaultViewerContract({ context: "webapp" }),
      { testid: "panel-pipeline", visible: true, attrs: { "data-collapsed": "false" } },
      { testid: "panel-pipeline-toggle", visible: true, enabled: true },
    ]);

    await expectFullPageMatch(page, PLATFORM, "pipeline-open");
    await expectViewerRegionMatch(page, PLATFORM, "viewer-default");

    await page.locator('[data-testid="panel-pipeline-toggle"]').click();

    // After collapse the toggle button still exists, but the container is
    // a different element with data-collapsed="true".
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[data-testid="panel-pipeline"]');
        return el?.getAttribute("data-collapsed") === "true";
      },
      null,
      { timeout: 5_000 },
    );

    await expectFullPageMatch(page, PLATFORM, "pipeline-collapsed");

    const collapsed = await page
      .locator('[data-testid="panel-pipeline"]')
      .getAttribute("data-collapsed");
    expect(collapsed).toBe("true");
  });
});
