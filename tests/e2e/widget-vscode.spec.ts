/**
 * Widget E2E under VSCode (M3).
 *
 * Runs the same notebook as widget-jupyterlab.spec.ts, but inside the
 * Microsoft Jupyter extension hosted by code-server. The output webview
 * iframe is traversed via Playwright's frameLocator. The renderer's
 * testMode is enabled by MEGANE_E2E_MODE=1 in the spawned env, which the
 * megane VSCode extension reads at webview-creation time. (Note: that
 * mechanism gates the .megane custom editor; the anywidget output cell is
 * controlled by the ms-toolsai.jupyter extension instead, which doesn't
 * read our env var. We therefore also inject __MEGANE_TEST__ via the
 * notebook itself.)
 *
 * Prereqs: see `scripts/install-code-server.sh`. The notebook fixture is
 * written into the workspace from a fixed Python source.
 */

import { copyFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectFullPageMatch,
  expectViewerRegionMatch,
} from "./lib/setup";
import {
  startCodeServer,
  stopCodeServer,
  openVscodeNotebook,
  type CodeServerHandle,
} from "./lib/hosts/code-server";

const PLATFORM = "widget-vscode";
const FIXTURE_PDB = "1crn.pdb";
const FIXTURE_PDB_ATOMS = 327;

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const WORKSPACE = "/workspace";
const PORT = Number(process.env.MEGANE_WIDGET_VSCODE_PORT ?? 18992);
const NOTEBOOK_NAME = "widget_vscode_legacy.ipynb";

let cs: CodeServerHandle | null = null;

test.describe.configure({ timeout: 300_000 });

test.beforeAll(async () => {
  mkdirSync(WORKSPACE, { recursive: true });
  copyFileSync(
    join(REPO, "tests", "fixtures", FIXTURE_PDB),
    join(WORKSPACE, FIXTURE_PDB),
  );
  // Notebook injects __MEGANE_TEST__ into the widget output iframe before
  // mounting the viewer, since the ms-toolsai.jupyter webview isn't gated
  // by our extension's env var.
  const notebook = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: { display_name: "Python 3 (ipykernel)", language: "python", name: "python3" },
    },
    cells: [
      {
        cell_type: "code",
        source: [
          "import megane\n",
          "from IPython.display import display, HTML\n",
          "display(HTML('<script>window.parent.postMessage({type: \"megane-test-mode\"}, \"*\")</script>'))\n",
          "viewer = megane.MolecularViewer()\n",
          `viewer.load(\"${WORKSPACE}/${FIXTURE_PDB}\")\n`,
          "viewer\n",
        ],
        metadata: {},
        outputs: [],
        execution_count: null,
      },
    ],
  };
  writeFileSync(join(WORKSPACE, NOTEBOOK_NAME), JSON.stringify(notebook, null, 2));

  cs = await startCodeServer({ port: PORT, workspace: WORKSPACE, e2eMode: true });
});

test.afterAll(() => {
  stopCodeServer(cs);
  cs = null;
});

test("widget-vscode legacy load() satisfies 3-layer contract", async ({ page }) => {
  // Inject __MEGANE_TEST__ via addInitScript so any iframe spawned within
  // the host page also sees the flag — covers the anywidget output webview
  // that ms-toolsai.jupyter creates without exposing a hook.
  await page.addInitScript(() => {
    (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
  });

  const wv = await openVscodeNotebook(page, {
    port: PORT,
    file: NOTEBOOK_NAME,
    notebook: NOTEBOOK_NAME,
  });

  await assertDomContract(wv, [
    ...defaultViewerContract({
      expectedAtoms: FIXTURE_PDB_ATOMS,
      context: "widget-simple",
    }),
  ]);

  await expectFullPageMatch(page, PLATFORM, "legacy-1crn");
  await expectViewerRegionMatch(wv, PLATFORM, "legacy-1crn-viewer");

  const atomCount = await wv
    .locator('[data-testid="megane-viewer"]')
    .getAttribute("data-atom-count");
  expect(Number(atomCount)).toBe(FIXTURE_PDB_ATOMS);
});
