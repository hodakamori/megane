/**
 * JupyterLab DocWidget E2E (M4).
 *
 * Opens a .pdb file directly via the megane DocWidget (the "MeganeReactView"
 * code path, not the anywidget/notebook path). Tests that the same
 * MeganeViewer renders correctly under JupyterLab and that the
 * "data-megane-context" attribute is set to "jupyterlab-doc" — proving the
 * test will catch a regression where the host context is misreported.
 */

import { existsSync, mkdirSync, copyFileSync } from "fs";
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
  startJupyterLab,
  stopJupyterLab,
  openLabFile,
  type JupyterLabHandle,
} from "./lib/hosts/jupyterlab";

const PLATFORM = "jupyterlab-doc";
const FIXTURE_PDB = "1crn.pdb";
const FIXTURE_PDB_ATOMS = 327;

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const NOTEBOOK_DIR = join(REPO, "tests", "e2e", "notebooks");
const PORT = Number(process.env.MEGANE_LAB_DOC_PORT ?? 18889);
const TOKEN = "megane-e2e-doc";

let lab: JupyterLabHandle | null = null;

test.describe.configure({ timeout: 180_000 });

test.beforeAll(async () => {
  if (!existsSync(join(REPO, "wheel-share/data/share/jupyter/labextensions/megane-jupyterlab"))) {
    throw new Error("megane labextension not built. Run `npm run build:lab`.");
  }
  mkdirSync(NOTEBOOK_DIR, { recursive: true });
  copyFileSync(
    join(REPO, "tests", "fixtures", FIXTURE_PDB),
    join(NOTEBOOK_DIR, FIXTURE_PDB),
  );
  lab = await startJupyterLab({
    port: PORT,
    token: TOKEN,
    notebookDir: NOTEBOOK_DIR,
    cwd: REPO,
    runtimeDir: "/tmp/megane-jupyter-doc-runtime",
  });
});

test.afterAll(() => {
  stopJupyterLab(lab);
  lab = null;
});

test("DocWidget renders 1crn.pdb with jupyterlab-doc context", async ({ page }) => {
  await openLabFile(page, { port: PORT, token: TOKEN, file: FIXTURE_PDB });

  await assertDomContract(page, [
    ...defaultViewerContract({
      expectedAtoms: FIXTURE_PDB_ATOMS,
      context: "jupyterlab-doc",
    }),
  ]);

  await expectFullPageMatch(page, PLATFORM, "1crn-doc");
  await expectViewerRegionMatch(page, PLATFORM, "1crn-doc-viewer");

  const ctx = await page
    .locator('[data-testid="megane-viewer"]')
    .getAttribute("data-megane-context");
  expect(ctx).toBe("jupyterlab-doc");
});
