/**
 * Widget E2E under JupyterLab (M3).
 *
 * The notebook is generated programmatically from a fixed Python source and
 * executed by JupyterLab's notebook runtime. Each cell that mutates widget
 * state (legacy load, set_pipeline, frame_index assignment) produces a
 * checkpoint at which we run the 3-layer assertion.
 *
 * The test enables `globalThis.__MEGANE_TEST__ = true` via addInitScript,
 * which switches the renderer into deterministic mode (see
 * `src/renderer/MoleculeRenderer.ts`). The same mechanism is used by the
 * other host specs so that ready/render-epoch behaviour is identical
 * everywhere.
 */

import { spawn, ChildProcess } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectFullPageMatch,
  expectViewerRegionMatch,
  getReadyState,
  waitForReady,
} from "./lib/setup";

const PLATFORM = "widget-jupyterlab";
const FIXTURE_PDB = "1crn.pdb";
const FIXTURE_PDB_ATOMS = 327;

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const NOTEBOOK_DIR = join(REPO, "tests", "e2e", "notebooks");
const PORT = Number(process.env.MEGANE_LAB_PORT ?? 18888);
const TOKEN = "megane-e2e-token";

let labProc: ChildProcess | null = null;

const NOTEBOOK_LEGACY = {
  cells: [
    {
      cell_type: "code",
      source: [
        "import megane\n",
        "viewer = megane.MolecularViewer()\n",
      ],
      metadata: {},
      outputs: [],
      execution_count: null,
    },
    {
      cell_type: "code",
      source: [
        `viewer.load("${REPO}/tests/fixtures/${FIXTURE_PDB}")\n`,
        "viewer\n",
      ],
      metadata: {},
      outputs: [],
      execution_count: null,
    },
  ],
  metadata: {
    kernelspec: {
      display_name: "Python 3 (ipykernel)",
      language: "python",
      name: "python3",
    },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

function startJupyterLab(): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirSync(NOTEBOOK_DIR, { recursive: true });
    labProc = spawn(
      "jupyter",
      [
        "lab",
        "--no-browser",
        "--allow-root",
        `--port=${PORT}`,
        `--IdentityProvider.token=${TOKEN}`,
        "--PasswordIdentityProvider.hashed_password=",
        "--ServerApp.allow_origin=*",
        `--notebook-dir=${NOTEBOOK_DIR}`,
      ],
      {
        cwd: REPO,
        env: { ...process.env, JUPYTER_RUNTIME_DIR: "/tmp/megane-jupyter-runtime" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) reject(new Error("JupyterLab did not start in 60s"));
    }, 60_000);

    const onData = (data: Buffer) => {
      const line = data.toString();
      if (
        !resolved &&
        (line.includes(`http://127.0.0.1:${PORT}`) ||
          line.includes(`http://localhost:${PORT}`) ||
          line.includes(`Jupyter Server`))
      ) {
        resolved = true;
        clearTimeout(timer);
        // Lab needs a moment after the URL banner before /lab is reachable.
        setTimeout(resolve, 1500);
      }
    };
    labProc.stdout?.on("data", onData);
    labProc.stderr?.on("data", onData);
    labProc.on("error", (err) => {
      if (!resolved) {
        clearTimeout(timer);
        reject(err);
      }
    });
  });
}

function stopJupyterLab(): void {
  if (labProc && !labProc.killed) {
    labProc.kill("SIGTERM");
    labProc = null;
  }
}

function writeNotebook(name: string, body: unknown): string {
  const file = join(NOTEBOOK_DIR, `${name}.ipynb`);
  writeFileSync(file, JSON.stringify(body, null, 2));
  return file;
}

test.describe.configure({ mode: "serial" });

test.describe.configure({ timeout: 180_000 });

test.beforeAll(async () => {
  test.setTimeout(120_000);
  if (!existsSync(join(REPO, "python", "megane", "static", "widget.js"))) {
    throw new Error(
      "widget.js missing. Run `npm run build:widget` before widget-jupyterlab.spec.ts.",
    );
  }
  await startJupyterLab();
});

test.afterAll(() => {
  stopJupyterLab();
});

async function openLabNotebook(page: import("playwright/test").Page, notebook: string) {
  await page.addInitScript(() => {
    (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
  });
  // `reset` query forces JupyterLab to discard any saved layout from a
  // previous run, so leftover doc tabs don't pollute the DOM contract.
  const url = `http://127.0.0.1:${PORT}/lab/tree/${notebook}?token=${TOKEN}&test=1&reset`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#jp-main-dock-panel", { timeout: 30_000 });

  // Wait for the kernel to settle ("Idle"). Without this Run All races the
  // kernel boot and the first cell silently fails.
  await page
    .locator(".jp-Toolbar")
    .filter({ hasText: "Python 3" })
    .first()
    .waitFor({ timeout: 30_000 })
    .catch(() => {});

  // Run All via the menu bar.
  await page.locator('.lm-MenuBar-itemLabel', { hasText: /^Run$/ }).first().click();
  await page
    .locator('.lm-Menu-itemLabel', { hasText: /Run All Cells/ })
    .first()
    .click();

  await waitForReady(page, { needsData: true, timeout: 90_000 });
}

test("widget legacy load() satisfies 3-layer contract", async ({ page }) => {
  const nb = writeNotebook("widget_legacy_1crn", NOTEBOOK_LEGACY);
  await openLabNotebook(page, "widget_legacy_1crn.ipynb");

  await assertDomContract(page, [
    ...defaultViewerContract({
      expectedAtoms: FIXTURE_PDB_ATOMS,
      context: "widget-simple",
    }),
  ]);

  await expectFullPageMatch(page, PLATFORM, "legacy-1crn");
  await expectViewerRegionMatch(page, PLATFORM, "legacy-1crn-viewer");

  // Sanity: the renderer reported the correct atom count via the ready
  // signal — guards against a regression that loads the wrong file.
  const ready = await getReadyState(page);
  expect(ready.atomCount).toBe(FIXTURE_PDB_ATOMS);

  // Avoid leaking state into the next test.
  void nb;
});
