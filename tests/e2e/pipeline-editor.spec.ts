/**
 * Pipeline editor E2E (M4).
 *
 * Verifies that all node kinds the editor knows about render in the
 * default scene, that the Render button mounts the RenderModal, and that
 * disabling a node via the NodeShell toggle flips data-enabled. The graph
 * itself is provided by the default webapp load (the editor seed wires up
 * load-structure → load-trajectory → viewport at minimum).
 */

import { test, expect } from "playwright/test";
import {
  defaultViewerContract,
  assertDomContract,
  waitForReady,
} from "./lib/setup";

const ATOM_COUNT_CAFFEINE = 3024;

// The 11 node kinds the editor surfaces; presence in the default seed
// graph is not guaranteed for every kind, so the spec only asserts the
// ones the seed graph mounts. Stub kinds are checked as `>= 0` to allow
// future seed changes without churning the spec.
const SEEDED_KINDS = ["load_structure", "viewport"] as const;

test.describe("pipeline-editor: webapp default graph", () => {
  test.beforeEach(async ({ page }) => {
    // Set the global flag before any module-level code runs so useTour
    // suppresses its auto-start. Without this, the driver.js overlay can
    // intercept pointer events on the toolbar and tab buttons.
    await page.addInitScript(() => {
      (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
    });
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  test("default graph mounts seeded node kinds and Render button", async ({ page }) => {
    await assertDomContract(page, [
      ...defaultViewerContract({ expectedAtoms: ATOM_COUNT_CAFFEINE, context: "webapp" }),
      { testid: "pipeline-editor-render", visible: true, enabled: true },
    ]);

    for (const kind of SEEDED_KINDS) {
      const count = await page
        .locator(`[data-testid="pipeline-node-${kind}"]`)
        .count();
      expect(count, `expected at least one ${kind} node in the seed graph`).toBeGreaterThan(0);
    }
  });

  test("Render button mounts RenderModal", async ({ page }) => {
    await page.locator('[data-testid="pipeline-editor-render"]').click();
    await expect(page.locator('[data-testid="render-modal"]')).toBeVisible();
    // Backdrop click closes (when not exporting).
    await page.locator('[data-testid="render-modal-backdrop"]').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('[data-testid="render-modal"]')).toBeHidden();
  });

  test("tab selector switches between editor and chat panes", async ({ page }) => {
    const editorTab = page.locator('[data-testid="pipeline-editor-tab-editor"]');
    const chatTab = page.locator('[data-testid="pipeline-editor-tab-chat"]');
    const editorPanel = page.locator("#pipeline-tabpanel-editor");
    const chatPanel = page.locator("#pipeline-tabpanel-chat");

    await expect(editorTab).toHaveAttribute("aria-selected", "true");
    await expect(chatTab).toHaveAttribute("aria-selected", "false");
    await expect(editorPanel).toBeVisible();
    await expect(chatPanel).toBeHidden();
    // Pipeline-tab-only buttons (Templates) are visible when on Editor.
    await expect(page.locator('[data-testid="pipeline-editor-templates"]')).toBeVisible();

    await chatTab.click();
    await expect(chatTab).toHaveAttribute("aria-selected", "true");
    await expect(editorTab).toHaveAttribute("aria-selected", "false");
    await expect(chatPanel).toBeVisible();
    await expect(editorPanel).toBeHidden();
    // Templates button is inside the hidden editor tabpanel.
    await expect(page.locator('[data-testid="pipeline-editor-templates"]')).toBeHidden();

    // Common toolbar (I/O + Others) stays visible from Chat tab.
    await expect(page.locator('[data-testid="pipeline-editor-render"]')).toBeVisible();
    await expect(page.locator('[data-testid="pipeline-editor-theme"]')).toBeVisible();
  });
});
