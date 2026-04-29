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

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const NOTEBOOK_DIR = join(REPO, "tests", "e2e", "notebooks");
const PORT = Number(process.env.MEGANE_LAB_DOC_PORT ?? 18889);
const TOKEN = "megane-e2e-doc";

interface DocFormatFixture {
  id: string;
  file: string;
  expectedAtoms?: number;
  /** When true, assert that data-total-frames is > 0 (trajectory rendering). */
  expectTrajectory?: boolean;
}

const FORMATS: DocFormatFixture[] = [
  { id: "pdb-1crn", file: "1crn.pdb", expectedAtoms: 327 },
  { id: "gro-water", file: "water.gro" },
  { id: "xyz-perovskite", file: "perovskite_srtio3.xyz" },
  { id: "mol-methane", file: "methane.mol" },
  { id: "sdf-ethanol", file: "ethanol.sdf" },
  { id: "cif-nacl", file: "nacl.cif" },
  { id: "lammps-water", file: "water.lammps" },
  { id: "xyz-water-multiframe", file: "water_multiframe.xyz", expectTrajectory: true },
  { id: "traj-water", file: "water.traj", expectTrajectory: true },
];

let lab: JupyterLabHandle | null = null;

test.describe.configure({ timeout: 180_000 });

test.beforeAll(async () => {
  if (!existsSync(join(REPO, "wheel-share/data/share/jupyter/labextensions/megane-jupyterlab"))) {
    throw new Error("megane labextension not built. Run `npm run build:lab`.");
  }
  mkdirSync(NOTEBOOK_DIR, { recursive: true });
  for (const f of FORMATS) {
    copyFileSync(join(REPO, "tests", "fixtures", f.file), join(NOTEBOOK_DIR, f.file));
  }
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

for (const f of FORMATS) {
  test(`DocWidget renders ${f.id} with jupyterlab-doc context`, async ({ page }) => {
    await openLabFile(page, { port: PORT, token: TOKEN, file: f.file });

    await assertDomContract(page, [
      ...defaultViewerContract({
        expectedAtoms: f.expectedAtoms,
        context: "jupyterlab-doc",
      }),
    ]);

    await expectFullPageMatch(page, PLATFORM, `${f.id}-doc`);
    await expectViewerRegionMatch(page, PLATFORM, `${f.id}-doc-viewer`);

    const viewer = page.locator('[data-testid="megane-viewer"]');
    const ctx = await viewer.getAttribute("data-megane-context");
    expect(ctx).toBe("jupyterlab-doc");

    if (f.expectTrajectory) {
      const totalFrames = Number(await viewer.getAttribute("data-total-frames"));
      expect(totalFrames, `${f.id}: expected trajectory frames`).toBeGreaterThan(0);
    }
  });
}
