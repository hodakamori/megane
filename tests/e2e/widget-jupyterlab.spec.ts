/**
 * Widget E2E under JupyterLab (M3).
 *
 * The notebook is generated programmatically from a fixed Python source and
 * executed by JupyterLab's notebook runtime. Each cell that mutates widget
 * state (legacy load, set_pipeline, frame_index assignment) produces a
 * checkpoint at which we run the 3-layer assertion.
 *
 * Boot is delegated to `lib/hosts/jupyterlab.ts` so that
 * `jupyterlab-doc.spec.ts` and the cross-host feature specs share one
 * implementation of `startJupyterLab` / `openLabNotebook`.
 */

import { existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectFullPageMatch,
  expectViewerRegionMatch,
  getReadyState,
} from "./lib/setup";
import {
  startJupyterLab,
  stopJupyterLab,
  writeNotebook,
  openLabNotebook,
  type JupyterLabHandle,
  type NotebookSpec,
} from "./lib/hosts/jupyterlab";

const PLATFORM = "widget-jupyterlab";
const FIXTURE_PDB = "1crn.pdb";
const FIXTURE_PDB_ATOMS = 327;

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const NOTEBOOK_DIR = join(REPO, "tests", "e2e", "notebooks");
const PORT = Number(process.env.MEGANE_LAB_PORT ?? 18888);
const TOKEN = "megane-e2e-token";

let lab: JupyterLabHandle | null = null;

const NOTEBOOK_LEGACY: NotebookSpec = {
  cells: [
    {
      cell_type: "code",
      source: ["import megane\n", "viewer = megane.MolecularViewer()\n"],
    },
    {
      cell_type: "code",
      source: [`viewer.load("${REPO}/tests/fixtures/${FIXTURE_PDB}")\n`, "viewer\n"],
    },
  ],
};

test.describe.configure({ mode: "serial" });
test.describe.configure({ timeout: 180_000 });

test.beforeAll(async () => {
  test.setTimeout(120_000);
  if (!existsSync(join(REPO, "python", "megane", "static", "widget.js"))) {
    throw new Error(
      "widget.js missing. Run `npm run build:widget` before widget-jupyterlab.spec.ts.",
    );
  }
  lab = await startJupyterLab({
    port: PORT,
    token: TOKEN,
    notebookDir: NOTEBOOK_DIR,
    cwd: REPO,
    runtimeDir: "/tmp/megane-jupyter-runtime",
  });
});

test.afterAll(() => {
  stopJupyterLab(lab);
  lab = null;
});

test("widget legacy load() satisfies 3-layer contract", async ({ page }) => {
  const nb = writeNotebook(NOTEBOOK_DIR, "widget_legacy_1crn", NOTEBOOK_LEGACY);
  await openLabNotebook(page, {
    port: PORT,
    token: TOKEN,
    notebook: "widget_legacy_1crn.ipynb",
  });

  await assertDomContract(page, [
    ...defaultViewerContract({
      expectedAtoms: FIXTURE_PDB_ATOMS,
      context: "widget-simple",
    }),
  ]);

  await expectFullPageMatch(page, PLATFORM, "legacy-1crn");
  await expectViewerRegionMatch(page, PLATFORM, "legacy-1crn-viewer");

  const ready = await getReadyState(page);
  expect(ready.atomCount).toBe(FIXTURE_PDB_ATOMS);

  void nb;
});
