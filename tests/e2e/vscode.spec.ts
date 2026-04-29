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
const FIXTURE_PDB = "1crn.pdb";
const FIXTURE_PDB_ATOMS = 327;

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const WORKSPACE = "/workspace";
const PORT = Number(process.env.MEGANE_VSCODE_PORT ?? 18991);

let cs: CodeServerHandle | null = null;

test.describe.configure({ timeout: 300_000 });

test.beforeAll(async () => {
  // Stage the fixture into the workspace so the relative path works.
  mkdirSync(WORKSPACE, { recursive: true });
  copyFileSync(
    join(REPO, "tests", "fixtures", FIXTURE_PDB),
    join(WORKSPACE, FIXTURE_PDB),
  );
  cs = await startCodeServer({ port: PORT, workspace: WORKSPACE, e2eMode: true });
});

test.afterAll(() => {
  stopCodeServer(cs);
  cs = null;
});

test("vscode custom editor opens 1crn.pdb with vscode context", async ({ page }) => {
  const wv = await openVscodeFile(page, { port: PORT, file: FIXTURE_PDB });

  await assertDomContract(wv, [
    ...defaultViewerContract({
      expectedAtoms: FIXTURE_PDB_ATOMS,
      context: "vscode",
    }),
  ]);

  await expectFullPageMatch(page, PLATFORM, "1crn-vscode");
  await expectViewerRegionMatch(wv, PLATFORM, "1crn-vscode-viewer");

  const ctx = await wv
    .locator('[data-testid="megane-viewer"]')
    .getAttribute("data-megane-context");
  expect(ctx).toBe("vscode");
});
