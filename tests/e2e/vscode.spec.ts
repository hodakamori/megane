/**
 * VSCode custom editor E2E (M4).
 *
 * Opens .pdb / .megane.json directly in the VSCode custom editor (the
 * webview registered by `vscode-megane/src/extension.ts`) under code-server.
 * The webview's React root mounts MeganeViewer with
 * `data-megane-context="vscode"` (see vscode-megane/webview/main.tsx).
 *
 * Status: SCAFFOLDED. Real implementation needs:
 *   1. `npm --prefix vscode-megane run build` to produce the bundle
 *   2. `npx vsce package` (in vscode-megane/) to produce a local .vsix
 *   3. `code-server --install-extension <vsix>` to install it
 *   4. Boot code-server, open the file, traverse webview iframes
 *   5. Inject `__MEGANE_TEST__ = true` into the webview window (extension
 *      side: see `vscode-megane/src/extension.ts:226` — that is where the
 *      __MEGANE_CONTEXT__ assignment lives, the test-mode flag should
 *      land in the same place when E2E_MODE env is set).
 *
 * The test is `.skip()`ped until those pieces are wired up.
 */

import { test } from "playwright/test";

test.describe.configure({ timeout: 240_000 });

test.skip("vscode custom editor opens 1crn.pdb (TODO)", async ({ page }) => {
  // TODO(M4-vscode-custom-editor):
  //   spawn code-server with env CODE_SERVER_AUTH=none, install local VSIX,
  //   open file, await waitForReady on the webview iframe, run 3-layer asserts.
  void page;
});
