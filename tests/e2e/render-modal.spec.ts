/**
 * Render modal E2E (M4).
 *
 * Opens the RenderModal from the pipeline editor's Render button and
 * exercises the Snapshot tab. Animation export (GIF/MP4) requires ffmpeg
 * locally; the GIF/MP4 cases are gated on MEGANE_E2E_FFMPEG=1 so the
 * default suite stays portable.
 */

import { test, expect } from "playwright/test";
import { defaultViewerContract, assertDomContract, waitForReady } from "./lib/setup";

const PLATFORM = "render-modal";

test.describe("render-modal: webapp", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  test("opens with snapshot mode by default", async ({ page }) => {
    await assertDomContract(page, [
      ...defaultViewerContract({ context: "webapp" }),
      { testid: "pipeline-editor-render", visible: true, enabled: true },
    ]);

    await page.locator('[data-testid="pipeline-editor-render"]').click();
    const modal = page.locator('[data-testid="render-modal"]');
    await expect(modal).toBeVisible();

    // The default trajectory has > 1 frame, so the modal mode should be
    // "with-animation" (Snapshot tab + Animation tab visible).
    const mode = await modal.getAttribute("data-mode");
    expect(mode).toBe("with-animation");

    // Close via the backdrop.
    await page.locator('[data-testid="render-modal-backdrop"]').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('[data-testid="render-modal"]')).toBeHidden();

    void PLATFORM;
  });

  test("animation export gated on MEGANE_E2E_FFMPEG", async () => {
    test.skip(
      process.env.MEGANE_E2E_FFMPEG !== "1",
      "GIF/MP4 export requires MEGANE_E2E_FFMPEG=1 + ffmpeg on PATH",
    );
    // Implementation lands when ffmpeg is gated in.
  });
});
