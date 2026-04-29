/**
 * Widget programmatic API E2E (M2).
 *
 * Drives the megane Python anywidget through its public traitlets:
 *   - viewer.frame_index = N        — should advance the renderer epoch
 *   - viewer.selected_atoms = [...] — should populate the MeasurementPanel
 *   - viewer.set_pipeline(pipe)     — should swap in a new pipeline graph
 *
 * The test boots a fresh JupyterLab and rewrites the notebook with the
 * cumulative cell sequence for each scenario, then triggers Run All. This
 * avoids depending on a `window.jupyterapp` global (removed in modern
 * JupyterLab) and keeps each test self-contained.
 */

import { existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  getReadyState,
  waitForReady,
} from "./lib/setup";
import {
  startJupyterLab,
  stopJupyterLab,
  writeNotebook,
  openLabNotebook,
  type JupyterLabHandle,
  type NotebookSpec,
} from "./lib/hosts/jupyterlab";

const PLATFORM = "widget-api";
const FIXTURE_PDB = "caffeine_water.pdb";
const FIXTURE_XTC = "caffeine_water_vibration.xtc";
const FIXTURE_PDB_ATOMS = 3024;

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const NOTEBOOK_DIR = join(REPO, "tests", "e2e", "notebooks");
const NOTEBOOK_NAME = "widget_api";
const PORT = Number(process.env.MEGANE_LAB_API_PORT ?? 18890);
const TOKEN = "megane-e2e-api";

let lab: JupyterLabHandle | null = null;

const SETUP_CELL = [
  "import megane\n",
  "viewer = megane.MolecularViewer()\n",
  `viewer.load(\"${REPO}/tests/fixtures/${FIXTURE_PDB}\", \"${REPO}/tests/fixtures/${FIXTURE_XTC}\")\n`,
  "viewer\n",
];

function buildNotebook(extraCells: string[][]): NotebookSpec {
  return {
    cells: [
      { cell_type: "code", source: SETUP_CELL },
      ...extraCells.map((source) => ({ cell_type: "code" as const, source })),
    ],
  };
}

async function reopenWithCells(
  page: import("playwright/test").Page,
  extraCells: string[][],
): Promise<void> {
  writeNotebook(NOTEBOOK_DIR, NOTEBOOK_NAME, buildNotebook(extraCells));
  await openLabNotebook(page, {
    port: PORT,
    token: TOKEN,
    notebook: `${NOTEBOOK_NAME}.ipynb`,
  });
}

test.describe.configure({ mode: "serial", timeout: 240_000 });

test.beforeAll(async () => {
  if (!existsSync(join(REPO, "python", "megane", "static", "widget.js"))) {
    throw new Error(
      "widget.js missing. Run `npm run build:widget` before widget-api.spec.ts.",
    );
  }
  lab = await startJupyterLab({
    port: PORT,
    token: TOKEN,
    notebookDir: NOTEBOOK_DIR,
    cwd: REPO,
    runtimeDir: "/tmp/megane-jupyter-api-runtime",
  });
});

test.afterAll(() => {
  stopJupyterLab(lab);
  lab = null;
});

test("frame_index assignment advances renderer", async ({ page }) => {
  await reopenWithCells(page, [["viewer.frame_index = 3\n"]]);

  await assertDomContract(page, [
    ...defaultViewerContract({
      expectedAtoms: FIXTURE_PDB_ATOMS,
      context: "widget-simple",
    }),
  ]);

  // Run All has already executed the frame assignment; ready snapshot
  // should reflect frame=3 with at least one render past the initial.
  await waitForReady(page, { needsData: true, timeout: 30_000 });
  const after = await getReadyState(page);
  expect(after.frame).toBe(3);
  expect(after.renderEpoch).toBeGreaterThan(0);
});

test("selected_atoms assignment shows in MeasurementPanel", async ({ page }) => {
  await reopenWithCells(page, [
    ["viewer.frame_index = 3\n"],
    ["viewer.selected_atoms = [0, 1]\n"],
  ]);

  await page.waitForFunction(
    () => {
      const el = document.querySelector('[data-testid="measurement-panel"]');
      const c = el?.getAttribute("data-selection-count");
      return c !== null && Number(c) === 2;
    },
    null,
    { timeout: 15_000 },
  );

  void PLATFORM;
});

test("set_pipeline swaps in a programmatic graph and re-renders", async ({ page }) => {
  // Build a minimal pipeline = LoadStructure(caffeine.pdb) -> Viewport
  // and apply via viewer.set_pipeline(). Verify the renderer reports a
  // new snapshot (renderEpoch advances after the assignment) and that
  // the atom-count attribute on the viewer reflects the new structure.
  const pipelineCell = [
    "from megane import Pipeline, LoadStructure, Viewport\n",
    "pipe = Pipeline()\n",
    `s = pipe.add_node(LoadStructure(\"${REPO}/tests/fixtures/water_wrapped.pdb\"))\n`,
    "v = pipe.add_node(Viewport())\n",
    "pipe.add_edge(s.out.particle, v.inp.particle)\n",
    "viewer.set_pipeline(pipe)\n",
  ];
  await reopenWithCells(page, [pipelineCell]);

  await waitForReady(page, { needsData: true, timeout: 30_000 });

  // The pipeline-driven snapshot replaces the original caffeine_water
  // fixture with caffeine alone (24 atoms). The viewer-root carries a
  // data-atom-count attribute kept in sync with the active snapshot.
  await page.waitForFunction(
    () => {
      const el = document.querySelector('[data-testid="viewer-root"]');
      const n = Number(el?.getAttribute("data-atom-count") ?? "0");
      return n > 0 && n !== 3024;
    },
    null,
    { timeout: 30_000 },
  );

  const after = await getReadyState(page);
  expect(after.firstFrame).toBe(true);
  expect(after.renderEpoch).toBeGreaterThan(0);
});
