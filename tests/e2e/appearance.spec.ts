/**
 * Appearance E2E (M2).
 *
 * Drives the AppearancePanel sliders for atom radius, atom opacity, bond
 * thickness and bond opacity. Each slider must (a) accept the new value,
 * (b) cause the renderer to advance the renderEpoch (so the change is
 * actually applied to the scene), (c) shift the viewer-region pixels.
 */

import { test, expect } from "playwright/test";
import {
  defaultViewerContract,
  assertDomContract,
  expectViewerRegionMatch,
  getReadyState,
  waitForReady,
} from "./lib/setup";

const PLATFORM = "appearance";

async function setSlider(
  page: import("playwright/test").Page,
  testid: string,
  value: number,
): Promise<void> {
  const el = page.locator(`[data-testid="${testid}"]`).first();
  await el.evaluate((node, v: number) => {
    const input = node as HTMLInputElement;
    input.value = String(v);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

test.describe("appearance: webapp sliders", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
    await assertDomContract(page, [
      ...defaultViewerContract({ context: "webapp" }),
      { testid: "appearance-atom-scale", visible: true },
      { testid: "appearance-atom-opacity", visible: true },
      { testid: "appearance-bond-scale", visible: true },
      { testid: "appearance-bond-opacity", visible: true },
    ]);
  });

  test("atom radius slider advances renderer", async ({ page }) => {
    const before = await getReadyState(page);
    await setSlider(page, "appearance-atom-scale", 1.6);
    await waitForReady(page, { untilEpoch: before.renderEpoch + 1 });
    const v = await page
      .locator('[data-testid="appearance-atom-scale"]')
      .inputValue();
    expect(parseFloat(v)).toBeCloseTo(1.6, 2);
    await expectViewerRegionMatch(page, PLATFORM, "atom-scale-1.6");
  });

  test("atom opacity slider advances renderer", async ({ page }) => {
    const before = await getReadyState(page);
    await setSlider(page, "appearance-atom-opacity", 0.4);
    await waitForReady(page, { untilEpoch: before.renderEpoch + 1 });
    await expectViewerRegionMatch(page, PLATFORM, "atom-opacity-0.4");
  });

  test("bond thickness slider advances renderer", async ({ page }) => {
    const before = await getReadyState(page);
    await setSlider(page, "appearance-bond-scale", 2.4);
    await waitForReady(page, { untilEpoch: before.renderEpoch + 1 });
    await expectViewerRegionMatch(page, PLATFORM, "bond-scale-2.4");
  });
});
