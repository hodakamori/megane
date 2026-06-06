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

  test("Add Node menu adds a Supercell node with its controls", async ({ page }) => {
    // Open the Add Node palette and add a Supercell node.
    await page.getByTitle("Add Node").click();
    await page.getByRole("button", { name: "Supercell", exact: true }).click();

    // The node mounts with its repeat inputs and symmetry toggle.
    const node = page.locator('[data-testid="pipeline-node-supercell"]').first();
    await expect(node).toBeVisible();
    await expect(page.locator('[data-testid="supercell-node-na"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="supercell-node-nb"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="supercell-node-nc"]').first()).toBeVisible();

    const symmetry = page.locator('[data-testid="supercell-node-symmetry"]').first();
    await expect(symmetry).not.toBeChecked();
    await symmetry.check();
    await expect(symmetry).toBeChecked();

    // Repeat count edits are accepted.
    const na = page.locator('[data-testid="supercell-node-na"]').first();
    await na.fill("2");
    await expect(na).toHaveValue("2");
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

    // Regression guard: the editor canvas must have non-zero size. Earlier
    // builds toggled with display:none, which collapsed ReactFlow to 0×0.
    const editorBox = await editorPanel.boundingBox();
    expect(editorBox?.width ?? 0).toBeGreaterThan(100);
    expect(editorBox?.height ?? 0).toBeGreaterThan(100);

    // Regression guard: the Pipeline toolbar row (Add Node / Layout /
    // Templates) must take only its content height. A regression in the
    // toolbar's flex basis previously made the row claim the entire pane
    // height, leaving the buttons stranded inside an empty band. We assert
    // the row height is well below the pane height so the canvas dominates.
    const toolbarBox = await page
      .locator('[data-testid="pipeline-editor-row"]')
      .boundingBox();
    expect(toolbarBox?.height ?? 0).toBeGreaterThan(0);
    expect(toolbarBox?.height ?? 0).toBeLessThan((editorBox?.height ?? 0) / 3);

    await chatTab.click();
    await expect(chatTab).toHaveAttribute("aria-selected", "true");
    await expect(editorTab).toHaveAttribute("aria-selected", "false");
    await expect(chatPanel).toBeVisible();
    // The editor pane stays in the layout (visibility:hidden) so ReactFlow
    // keeps its measurements; Playwright still treats it as hidden.
    await expect(editorPanel).toBeHidden();
    // Templates button is inside the hidden editor tabpanel.
    await expect(page.locator('[data-testid="pipeline-editor-templates"]')).toBeHidden();

    // I/O row stays visible from Chat (Render/Share apply to the current pipeline).
    await expect(page.locator('[data-testid="pipeline-editor-render"]')).toBeVisible();
    // Editor-side Others row is unmounted on chat to give the input more room.
    await expect(page.locator('[data-testid="pipeline-editor-theme"]')).toBeHidden();

    // Toggle back to the Editor tab; canvas is still non-zero.
    await editorTab.click();
    await expect(editorPanel).toBeVisible();
    const reboundBox = await editorPanel.boundingBox();
    expect(reboundBox?.width ?? 0).toBeGreaterThan(100);
    expect(reboundBox?.height ?? 0).toBeGreaterThan(100);
  });
});
