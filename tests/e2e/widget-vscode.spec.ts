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

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const WORKSPACE = "/workspace";
const PORT = Number(process.env.MEGANE_WIDGET_VSCODE_PORT ?? 18992);

interface WidgetVscodeFixture {
  id: string;
  file: string;
  expectedAtoms?: number;
}

// `MolecularViewer.load()` is PDB-only — see widget-jupyterlab.spec.ts
// for the same constraint. Cross-format coverage is exercised on the
// `vscode` custom editor instead.
const FORMATS: WidgetVscodeFixture[] = [
  { id: "pdb-1crn", file: "1crn.pdb", expectedAtoms: 327 },
  { id: "pdb-water-wrapped", file: "water_wrapped.pdb" },
];

let cs: CodeServerHandle | null = null;

function widgetNotebook(fileName: string): object {
  return {
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
          `viewer.load(\"${WORKSPACE}/${fileName}\")\n`,
          "viewer\n",
        ],
        metadata: {},
        outputs: [],
        execution_count: null,
      },
    ],
  };
}

test.describe.configure({ mode: "serial" });
test.describe.configure({ timeout: 360_000 });

test.beforeAll(async () => {
  mkdirSync(WORKSPACE, { recursive: true });
  for (const f of FORMATS) {
    copyFileSync(join(REPO, "tests", "fixtures", f.file), join(WORKSPACE, f.file));
    const nbName = `widget_vscode_${f.id}.ipynb`;
    writeFileSync(join(WORKSPACE, nbName), JSON.stringify(widgetNotebook(f.file), null, 2));
  }

  cs = await startCodeServer({ port: PORT, workspace: WORKSPACE, e2eMode: true });
});

test.afterAll(() => {
  stopCodeServer(cs);
  cs = null;
});

for (const f of FORMATS) {
  test(`widget-vscode legacy load() ${f.id} satisfies 3-layer contract`, async ({ page }) => {
    // Propagate __MEGANE_TEST__ to every frame the host opens. The
    // megane renderer also reads this from `window.parent` (see
    // src/renderer/MoleculeRenderer.ts), so the widget output iframe
    // picks it up even when ms-toolsai.jupyter wraps the cell output in
    // a srcdoc iframe that doesn't honour Page.addInitScript.
    await page.addInitScript(() => {
      (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
    });

    const nbName = `widget_vscode_${f.id}.ipynb`;
    const wv = await openVscodeNotebook(page, {
      port: PORT,
      file: nbName,
      notebook: nbName,
    });

    await assertDomContract(wv, [
      ...defaultViewerContract({
        expectedAtoms: f.expectedAtoms,
        context: "widget-simple",
      }),
    ]);

    await expectFullPageMatch(page, PLATFORM, `legacy-${f.id}`);
    await expectViewerRegionMatch(wv, PLATFORM, `legacy-${f.id}-viewer`);

    if (f.expectedAtoms !== undefined) {
      const atomCount = await wv
        .locator('[data-testid="megane-viewer"]')
        .getAttribute("data-atom-count");
      expect(Number(atomCount)).toBe(f.expectedAtoms);
    }
  });
}
