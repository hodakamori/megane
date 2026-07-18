/**
 * Selection Inspector E2E (webapp).
 *
 * Verifies the third pipeline tab: building a selection from element chips
 * writes the expression, the live selected-count updates, and — crucially —
 * the selection + appearance are reflected as real pipeline nodes (a
 * filter → color chain) visible in the Editor tab. Asserts DOM and store
 * state rather than pixels to stay robust against font/GL drift.
 */

import { test, expect } from "playwright/test";
import { waitForReady } from "./lib/setup";

test.describe("inspector: webapp", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
    });
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  test("builds a selection layer reflected as pipeline nodes", async ({ page }) => {
    await page.locator('[data-testid="pipeline-editor-tab-inspector"]').click();
    await expect(page.locator('[data-testid="pipeline-inspector"]')).toBeVisible();

    // Add a layer, then select carbons via the element chip.
    await page.locator('[data-testid="inspector-add-layer"]').click();
    const carbon = page.locator('[data-testid="inspector-chip-element-C"]');
    await expect(carbon).toBeVisible();
    await carbon.click();

    // Expression and live count reflect the chip choice.
    await expect(page.locator('[data-testid="inspector-query"]')).toHaveValue('element == "C"');
    await expect(page.locator('[data-testid="inspector-selected-count"]')).toContainText("atom");

    // Reflection: the Editor tab now shows the generated filter + color nodes.
    await page.locator('[data-testid="pipeline-editor-tab-editor"]').click();
    await expect(page.locator('[data-testid="pipeline-node-filter"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="pipeline-node-color"]').first()).toBeVisible();

    // The generated nodes are Inspector-owned and carry the selection query.
    const info = await page.evaluate(() => {
      const store = (
        window as unknown as {
          __megane_test_pipeline_store?: {
            getState: () => {
              nodes: {
                id: string;
                type?: string;
                data: { params: Record<string, unknown> };
              }[];
            };
          };
        }
      ).__megane_test_pipeline_store;
      const nodes = store?.getState().nodes ?? [];
      const insp = nodes.filter((n) => n.id.startsWith("insp-"));
      const filter = insp.find((n) => n.type === "filter");
      const color = insp.find((n) => n.type === "color");
      return {
        count: insp.length,
        query: filter?.data.params.query,
        colorMode: color?.data.params.mode,
      };
    });
    expect(info.count).toBeGreaterThanOrEqual(2);
    expect(info.query).toBe('element == "C"');
    expect(info.colorMode).toBe("uniform");
  });

  test("editing the raw expression drives the live count and filter node", async ({ page }) => {
    await page.locator('[data-testid="pipeline-editor-tab-inspector"]').click();
    await page.locator('[data-testid="inspector-add-layer"]').click();

    const query = page.locator('[data-testid="inspector-query"]');
    await query.fill('element != "H"');
    await expect(page.locator('[data-testid="inspector-selected-count"]')).toContainText("atom");

    const filterQuery = await page.evaluate(() => {
      const store = (
        window as unknown as {
          __megane_test_pipeline_store?: {
            getState: () => {
              nodes: { id: string; type?: string; data: { params: Record<string, unknown> } }[];
            };
          };
        }
      ).__megane_test_pipeline_store;
      const nodes = store?.getState().nodes ?? [];
      return nodes.find((n) => n.id.startsWith("insp-") && n.type === "filter")?.data.params.query;
    });
    expect(filterQuery).toBe('element != "H"');
  });
});
