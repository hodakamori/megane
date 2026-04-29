/**
 * Playwright configuration for megane cross-platform E2E.
 *
 * Projects:
 *   - webapp           — Vite dev server (initial render + interaction matrix)
 *   - widget-jupyterlab — anywidget under JupyterLab
 *   - widget-vscode    — anywidget under code-server (Jupyter extension)
 *   - jupyterlab-doc   — JupyterLab DocWidget direct-open path
 *   - vscode           — VSCode custom editor under code-server
 *   - contract         — minimal Viewport contract baseline + Parity
 *
 * Notes:
 *   - retries: 0 — flake is not papered over with retries; failures must
 *     surface and be addressed at the source (mask UI noise, fix race).
 *   - fullyParallel: 'webapp' and 'contract' only. Host-emulator projects
 *     (code-server, JupyterLab) run with workers: 1 to keep ports stable.
 */

import { defineConfig } from "playwright/test";

const PORT_WEBAPP = Number(process.env.MEGANE_E2E_PORT_WEBAPP ?? 15173);

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: process.env.CI ? [["list"], ["junit", { outputFile: "playwright-report/junit.xml" }], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    launchOptions: {
      args: [
        // GitHub Actions ubuntu-latest runners only allocate 64MB to
        // /dev/shm, which headless Chromium can exhaust when loading
        // our ~300KB WASM bundle alongside Three.js textures. The
        // resulting silent renderer crash leaves __megane_test_ready
        // never set, which is what was causing the webapp / contract
        // specs to time out on waitForReady in CI.
        "--disable-dev-shm-usage",
      ],
    },
  },

  projects: [
    {
      name: "webapp",
      testMatch: /webapp\.spec\.ts$/,
      use: {
        baseURL: `http://127.0.0.1:${PORT_WEBAPP}`,
      },
    },
    {
      name: "contract",
      testMatch: /contract\.spec\.ts$/,
      use: {
        baseURL: `http://127.0.0.1:${PORT_WEBAPP}`,
      },
    },
    {
      name: "widget-jupyterlab",
      testMatch: /widget-jupyterlab\.spec\.ts$/,
      timeout: 180_000,
    },
    {
      name: "widget-vscode",
      testMatch: /widget-vscode\.spec\.ts$/,
      timeout: 240_000,
    },
    {
      name: "jupyterlab-doc",
      testMatch: /jupyterlab-doc\.spec\.ts$/,
      timeout: 180_000,
    },
    {
      name: "vscode",
      testMatch: /vscode\.spec\.ts$/,
      timeout: 240_000,
    },
  ],

  webServer: process.env.MEGANE_E2E_NO_WEBSERVER
    ? undefined
    : {
        // Tiny Node static server over the prebuilt webapp. We deliberately
        // do NOT use `vite` (dev mode) here because in CI the on-demand
        // module / WASM transformation aborts the process within seconds
        // for reasons we can't diagnose from outside the runner. The
        // bundled output in `python/megane/static/app/` is fully static —
        // serving it via Node's built-in http module is rock-stable.
        command: `node tests/e2e/lib/serve-static.mjs python/megane/static/app ${PORT_WEBAPP} 127.0.0.1`,
        port: PORT_WEBAPP,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
        stdout: "pipe",
        stderr: "pipe",
      },
});
