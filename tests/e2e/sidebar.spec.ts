/**
 * Sidebar E2E (M2).
 *
 * Verifies the collapsible left panel (sidebar-root + sidebar-toggle):
 *   - default state is open (data-collapsed="false")
 *   - toggle flips the attribute
 *   - the viewer-root pixels do NOT change when the sidebar collapses
 *     (camera and renderer are unaffected by host UI chrome)
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

test.describe("sidebar: webapp", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  test("default open, toggle collapses, full-page diffs", async ({ page }) => {
    await assertDomContract(page, [
      ...defaultViewerContract({ context: "webapp" }),
      { testid: "sidebar-root", visible: true, attrs: { "data-collapsed": "false" } },
      { testid: "sidebar-toggle", visible: true, enabled: true },
    ]);

    await expectFullPageMatch(page, PLATFORM, "open");
    await expectViewerRegionMatch(page, PLATFORM, "viewer-default");

    await page.locator('[data-testid="sidebar-toggle"]').click();

    await assertDomContract(page, [
      ...defaultViewerContract({ context: "webapp" }),
      { testid: "sidebar-root", visible: true, attrs: { "data-collapsed": "true" } },
    ]);

    await expectFullPageMatch(page, PLATFORM, "collapsed");

    // The viewer region pixels should be (close to) identical: collapsing
    // the sidebar resizes the viewer rect on screen, but the viewer-region
    // capture clips to the rect itself, so the rendered scene matches.
    await expectViewerRegionMatch(page, PLATFORM, "viewer-default");

    const collapsed = await page
      .locator('[data-testid="sidebar-root"]')
      .getAttribute("data-collapsed");
    expect(collapsed).toBe("true");
  });
});
