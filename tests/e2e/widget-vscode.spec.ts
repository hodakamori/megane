/**
 * Widget E2E under VSCode (code-server, M3).
 *
 * Runs the same notebook as widget-jupyterlab.spec.ts, but inside the
 * Microsoft Jupyter extension hosted by code-server. The output webview
 * iframe is traversed via Playwright's `frameLocator`. This spec uses the
 * SAME ready signal (`window.__megane_test_ready`) as the other platforms;
 * the renderer's testMode is enabled by `__MEGANE_TEST__ = true` set via
 * `page.addInitScript`.
 *
 * Status: SCAFFOLDED. The real implementation needs:
 *   1. code-server installed (see scripts/install-code-server.sh)
 *   2. ms-toolsai.jupyter + ms-python.python extensions installed
 *   3. A workspace with the notebook + the megane Python package on PATH
 *   4. `__MEGANE_TEST__ = true` injected into the webview iframe (probably
 *      via a notebook init cell that sets it on the iframe's window).
 *
 * The test is `.skip()`ped until those pieces are wired up. The CI matrix
 * includes a job for this project that is gated behind a setup step; once
 * the gate clears we'll remove the .skip().
 */

import { test } from "playwright/test";

test.describe.configure({ timeout: 240_000 });

test.skip("widget-vscode legacy load() satisfies 3-layer contract (TODO)", async ({ page }) => {
  // TODO(M3-vscode):
  //   const url = `http://127.0.0.1:${PORT}/?folder=...&tkn=...`;
  //   await page.addInitScript(() => { (globalThis as any).__MEGANE_TEST__ = true; });
  //   await page.goto(url);
  //   ... open .ipynb in VSCode notebook editor ...
  //   ... Run All ...
  //   const wv = page.frameLocator('iframe.webview').frameLocator('iframe');
  //   await waitForReady(wv, { needsData: true });
  //   await assertDomContract(wv, [...]);
  //   await expectFullPageMatch(page, "widget-vscode", "legacy-1crn");
  void page;
});
