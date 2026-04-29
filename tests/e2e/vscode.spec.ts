/**
 * VSCode custom editor E2E (M3).
 *
 * Opens .pdb directly in the megane custom editor (registered by
 * vscode-megane/src/extension.ts as `megane.structureViewer`) under
 * code-server. The webview's React root mounts MeganeViewer with
 * `data-megane-context="vscode"`.
 *
 * Prereqs (run once per machine):
 *   - `bash scripts/install-code-server.sh`
 *   - `npm --prefix vscode-megane run build && npm --prefix vscode-megane run package`
 *
 * Test-mode injection: MEGANE_E2E_MODE=1 is plumbed through to the
 * extension host via env, which causes the webview HTML preamble to set
 * `window.__MEGANE_TEST__ = true` before the bundle loads.
 */

import { copyFileSync, mkdirSync } from "fs";
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
  openVscodeFile,
  type CodeServerHandle,
} from "./lib/hosts/code-server";

const PLATFORM = "vscode";

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const WORKSPACE = "/workspace";
const PORT = Number(process.env.MEGANE_VSCODE_PORT ?? 18991);

interface FormatFixture {
  /** Slug used in baseline filenames. */
  id: string;
  /** Filename inside `tests/fixtures/`. */
  file: string;
  /** Atom count exposed via data-atom-count when the parser succeeds. */
  expectedAtoms?: number;
}

/**
 * Each format the megane custom editor advertises in
 * `vscode-megane/package.json` (`customEditors[].selector`). Atom counts
 * mirror the fixtures used by `format-loading.spec.ts` so a regression
 * in the WASM parser surfaces here too.
 */
const FORMATS: FormatFixture[] = [
  { id: "pdb-1crn", file: "1crn.pdb", expectedAtoms: 327 },
  { id: "gro-water", file: "water.gro" },
  { id: "xyz-perovskite", file: "perovskite_srtio3.xyz" },
  { id: "mol-methane", file: "methane.mol" },
  { id: "sdf-ethanol", file: "ethanol.sdf" },
];

let cs: CodeServerHandle | null = null;

test.describe.configure({ timeout: 300_000 });

test.beforeAll(async () => {
  mkdirSync(WORKSPACE, { recursive: true });
  for (const f of FORMATS) {
    copyFileSync(join(REPO, "tests", "fixtures", f.file), join(WORKSPACE, f.file));
  }
  cs = await startCodeServer({ port: PORT, workspace: WORKSPACE, e2eMode: true });
});

test.afterAll(() => {
  stopCodeServer(cs);
  cs = null;
});

for (const f of FORMATS) {
  test(`vscode custom editor opens ${f.id} with vscode context`, async ({ page }) => {
    const wv = await openVscodeFile(page, { port: PORT, file: f.file });

    await assertDomContract(wv, [
      ...defaultViewerContract({
        expectedAtoms: f.expectedAtoms,
        context: "vscode",
      }),
    ]);

    await expectFullPageMatch(page, PLATFORM, `${f.id}-vscode`);
    await expectViewerRegionMatch(wv, PLATFORM, `${f.id}-vscode-viewer`);

    const ctx = await wv
      .locator('[data-testid="megane-viewer"]')
      .getAttribute("data-megane-context");
    expect(ctx).toBe("vscode");
  });
}
