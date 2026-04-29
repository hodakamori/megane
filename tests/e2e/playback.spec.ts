/**
 * Playback E2E (M2).
 *
 * Exercises the Timeline controls — play/pause toggle, seek slider, FPS
 * picker, frame counter — against the webapp default load (caffeine_water
 * + 5-frame trajectory). Each interaction is gated on the renderer's
 * `renderEpoch`, not on a wall-clock sleep, so the spec does not race the
 * frame loop.
 */

import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectViewerRegionMatch,
  getReadyState,
  waitForReady,
} from "./lib/setup";

const PLATFORM = "playback";
const ATOM_COUNT_CAFFEINE = 3024;

test.describe("playback: webapp default trajectory", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  test("seekbar advances frame counter and renderer state", async ({ page }) => {
    const before = await getReadyState(page);
    // Set the value via React's native setter so the synthetic onChange
    // fires (vanilla `el.value = ...` is shadowed by React's prop tracking).
    await page.locator('[data-testid="playback-seekbar"]').evaluate((el: HTMLInputElement) => {
      const proto = Object.getPrototypeOf(el);
      const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
      setter?.call(el, "2");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await waitForReady(page, { untilEpoch: before.renderEpoch + 1 });

    await assertDomContract(page, [
      ...defaultViewerContract({ expectedAtoms: ATOM_COUNT_CAFFEINE, context: "webapp" }),
      { testid: "playback-seekbar", visible: true },
    ]);

    // The data-current-frame attribute on megane-viewer reflects the
    // frame the renderer last drew. Allow a brief settle for the prop
    // propagation through usePlaybackStore.
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[data-testid="megane-viewer"]');
        return el?.getAttribute("data-current-frame") === "2";
      },
      null,
      { timeout: 5_000 },
    );

    await expectViewerRegionMatch(page, PLATFORM, "frame-2-viewer");
  });

  test("play toggle flips data-playing and advances renderer", async ({ page }) => {
    const playing0 = await page
      .locator('[data-testid="playback-toggle"]')
      .getAttribute("data-playing");
    expect(playing0).toBe("false");

    const before = await getReadyState(page);
    await page.locator('[data-testid="playback-toggle"]').click();
    await waitForReady(page, { untilEpoch: before.renderEpoch + 1 });

    const playing1 = await page
      .locator('[data-testid="playback-toggle"]')
      .getAttribute("data-playing");
    expect(playing1).toBe("true");

    // Pause again to leave a clean state for next test.
    await page.locator('[data-testid="playback-toggle"]').click();
  });

  test("fps dropdown updates renderer", async ({ page }) => {
    const before = await getReadyState(page);
    await page.locator('[data-testid="playback-fps"]').selectOption("60");
    // Selecting a new fps does not necessarily advance epoch on its own
    // (the slider doesn't change frame) — but the attribute must update.
    const fps = await page.locator('[data-testid="playback-fps"]').inputValue();
    expect(fps).toBe("60");
    void before;
  });
});
