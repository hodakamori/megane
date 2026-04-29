/**
 * Widget programmatic API E2E (M2).
 *
 * Drives the megane Python anywidget through its public traitlets:
 *   - viewer.frame_index = N        — should advance the renderer epoch
 *   - viewer.selected_atoms = [...] — should populate the MeasurementPanel
 *
 * The test boots a fresh JupyterLab, writes a notebook that exposes the
 * viewer object on `IPython.display`, then drives the kernel via
 * `requestExecute` from the JupyterLab front-end so we can mutate state
 * without scripting raw input cells.
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
const PORT = Number(process.env.MEGANE_LAB_API_PORT ?? 18890);
const TOKEN = "megane-e2e-api";

let lab: JupyterLabHandle | null = null;

const NOTEBOOK_API: NotebookSpec = {
  cells: [
    {
      cell_type: "code",
      source: [
        "import megane\n",
        "viewer = megane.MolecularViewer()\n",
        `viewer.load(\"${REPO}/tests/fixtures/${FIXTURE_PDB}\", \"${REPO}/tests/fixtures/${FIXTURE_XTC}\")\n`,
        "viewer\n",
      ],
    },
  ],
};

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

async function executePython(
  page: import("playwright/test").Page,
  code: string,
): Promise<void> {
  await page.evaluate(async (src: string) => {
    const w = window as unknown as {
      jupyterapp?: {
        serviceManager: {
          sessions: {
            running: () => Iterable<{ kernel?: { id: string } }>;
          };
          kernels: {
            connectTo: (opts: { model: { id: string } }) => {
              requestExecute: (req: { code: string }) => {
                done: Promise<void>;
              };
            };
          };
        };
      };
    };
    const app = w.jupyterapp;
    if (!app) throw new Error("jupyterapp global not present");
    const sessions = Array.from(app.serviceManager.sessions.running());
    const kernelId = sessions.find((s) => s.kernel)?.kernel?.id;
    if (!kernelId) throw new Error("no running kernel");
    const k = app.serviceManager.kernels.connectTo({ model: { id: kernelId } });
    await k.requestExecute({ code: src }).done;
  }, code);
}

test("frame_index assignment advances renderer", async ({ page }) => {
  writeNotebook(NOTEBOOK_DIR, "widget_api", NOTEBOOK_API);
  await openLabNotebook(page, { port: PORT, token: TOKEN, notebook: "widget_api.ipynb" });

  await assertDomContract(page, [
    ...defaultViewerContract({
      expectedAtoms: FIXTURE_PDB_ATOMS,
      context: "widget-simple",
    }),
  ]);

  const before = await getReadyState(page);
  await executePython(page, "viewer.frame_index = 3\n");
  await waitForReady(page, { untilEpoch: before.renderEpoch + 1, timeout: 30_000 });
  const after = await getReadyState(page);
  expect(after.frame).toBe(3);
});

test("selected_atoms assignment shows in MeasurementPanel", async ({ page }) => {
  // Notebook + viewer instance is already alive from the previous test
  // (serial mode). If not, re-open.
  const ready = await getReadyState(page).catch(() => null);
  if (!ready || !ready.dataLoaded) {
    await openLabNotebook(page, { port: PORT, token: TOKEN, notebook: "widget_api.ipynb" });
  }

  await executePython(page, "viewer.selected_atoms = [0, 1]\n");
  // The widget pushes the new selection through the snapshot; the panel
  // should mount with count=2.
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
