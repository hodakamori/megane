/**
 * JupyterLab DocWidget E2E (M4).
 *
 * Opens a .pdb file directly via the megane DocWidget (the "MeganeReactView"
 * code path, not the anywidget/notebook path). Tests that the same
 * MeganeViewer renders correctly under JupyterLab and that the
 * "data-megane-context" attribute is set to "jupyterlab-doc" — proving the
 * test will catch a regression where the host context is misreported.
 */

import { spawn, ChildProcess } from "child_process";
import { existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectFullPageMatch,
  expectViewerRegionMatch,
  waitForReady,
} from "./lib/setup";

const PLATFORM = "jupyterlab-doc";
const FIXTURE_PDB = "1crn.pdb";
const FIXTURE_PDB_ATOMS = 327;

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const NOTEBOOK_DIR = join(REPO, "tests", "e2e", "notebooks");
const PORT = Number(process.env.MEGANE_LAB_DOC_PORT ?? 18889);
const TOKEN = "megane-e2e-doc";

let labProc: ChildProcess | null = null;

function startJupyterLab(): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirSync(NOTEBOOK_DIR, { recursive: true });
    // Ensure the fixture is reachable from the notebook root.
    copyFileSync(
      join(REPO, "tests", "fixtures", FIXTURE_PDB),
      join(NOTEBOOK_DIR, FIXTURE_PDB),
    );
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
        env: { ...process.env, JUPYTER_RUNTIME_DIR: "/tmp/megane-jupyter-doc-runtime" },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) reject(new Error("JupyterLab did not start"));
    }, 60_000);
    const onData = (data: Buffer) => {
      const line = data.toString();
      if (
        !resolved &&
        (line.includes(`http://127.0.0.1:${PORT}`) ||
          line.includes(`http://localhost:${PORT}`) ||
          line.includes("Jupyter Server"))
      ) {
        resolved = true;
        clearTimeout(timer);
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

test.describe.configure({ timeout: 180_000 });

test.beforeAll(async () => {
  if (!existsSync(join(REPO, "wheel-share/data/share/jupyter/labextensions/megane-jupyterlab"))) {
    throw new Error("megane labextension not built. Run `npm run build:lab`.");
  }
  await startJupyterLab();
});

test.afterAll(() => {
  stopJupyterLab();
});

test("DocWidget renders 1crn.pdb with jupyterlab-doc context", async ({ page }) => {
  await page.addInitScript(() => {
    (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
  });
  const url = `http://127.0.0.1:${PORT}/lab/tree/${FIXTURE_PDB}?token=${TOKEN}&test=1&reset`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#jp-main-dock-panel", { timeout: 30_000 });

  await waitForReady(page, { needsData: true, timeout: 60_000 });

  await assertDomContract(page, [
    ...defaultViewerContract({
      expectedAtoms: FIXTURE_PDB_ATOMS,
      context: "jupyterlab-doc",
    }),
  ]);

  await expectFullPageMatch(page, PLATFORM, "1crn-doc");
  await expectViewerRegionMatch(page, PLATFORM, "1crn-doc-viewer");

  // Cross-host parity: the viewer pixels should be (close to) identical
  // to the WebApp's caffeine_water-default contract baseline... except
  // here the fixture is 1crn, not caffeine_water. We therefore add a
  // 1crn-specific contract baseline to compare other platforms against.
  // (This is generated on first run via `compareToBaseline` in setup.ts.)
  const ctx = await page
    .locator('[data-testid="megane-viewer"]')
    .getAttribute("data-megane-context");
  expect(ctx).toBe("jupyterlab-doc");
});
