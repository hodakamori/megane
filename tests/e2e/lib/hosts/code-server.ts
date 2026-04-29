/**
 * code-server host emulator for E2E specs.
 *
 * Spawns code-server (a browser-hosted VSCode) with a fixed --user-data-dir,
 * --auth=none, and a per-project workspace, then exposes helpers to drive
 * the resulting Playwright `Page` into opening a file in the megane custom
 * editor or running the Jupyter extension's notebook output.
 *
 * Prereqs: `scripts/install-code-server.sh` must have already installed the
 * binary, the ms-toolsai.jupyter extension, and the megane VSIX. The spec
 * sets MEGANE_E2E_MODE=1 in the spawned env so the extension's webview
 * preamble flips `window.__MEGANE_TEST__ = true` before the bundle loads.
 *
 * The webview iframe traversal is wrapped in `getWebviewFrame()` because
 * code-server's webview shell varies between releases.
 */

import { spawn, ChildProcess } from "child_process";
import { mkdirSync } from "fs";
import { join } from "path";
import type { FrameLocator, Page } from "playwright/test";

import { waitForReady } from "../setup";

export interface CodeServerHandle {
  proc: ChildProcess;
  port: number;
  workspace: string;
  userDataDir: string;
}

export interface StartCodeServerOpts {
  port: number;
  workspace: string;
  userDataDir?: string;
  bin?: string;
  e2eMode?: boolean;
  timeoutMs?: number;
}

export function startCodeServer(opts: StartCodeServerOpts): Promise<CodeServerHandle> {
  return new Promise((resolve, reject) => {
    mkdirSync(opts.workspace, { recursive: true });
    const userDataDir = opts.userDataDir ?? `/tmp/megane-code-server-${opts.port}`;
    mkdirSync(userDataDir, { recursive: true });
    const bin = opts.bin ?? process.env.MEGANE_CODE_SERVER_BIN ?? "code-server";

    const proc = spawn(
      bin,
      [
        "--auth", "none",
        "--bind-addr", `127.0.0.1:${opts.port}`,
        "--user-data-dir", userDataDir,
        "--disable-telemetry",
        "--disable-update-check",
        opts.workspace,
      ],
      {
        env: {
          ...process.env,
          MEGANE_E2E_MODE: opts.e2eMode === false ? "0" : "1",
        },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );

    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) reject(new Error(`code-server did not start in ${opts.timeoutMs ?? 90_000}ms`));
    }, opts.timeoutMs ?? 90_000);

    const onData = (data: Buffer) => {
      const line = data.toString();
      if (
        !resolved &&
        (line.includes(`HTTP server listening`) ||
          line.includes(`http://127.0.0.1:${opts.port}`) ||
          line.includes(`http://localhost:${opts.port}`))
      ) {
        resolved = true;
        clearTimeout(timer);
        // code-server needs a beat after the listen log before /healthz is up.
        setTimeout(
          () => resolve({ proc, port: opts.port, workspace: opts.workspace, userDataDir }),
          2000,
        );
      }
    };
    proc.stdout?.on("data", onData);
    proc.stderr?.on("data", onData);
    proc.on("error", (err) => {
      if (!resolved) {
        clearTimeout(timer);
        reject(err);
      }
    });
  });
}

export function stopCodeServer(handle: CodeServerHandle | null): void {
  if (handle && handle.proc && !handle.proc.killed) {
    handle.proc.kill("SIGTERM");
  }
}

/**
 * Resolve the megane webview iframe inside a code-server Page. code-server
 * versions differ on the inner iframe selector, so we try the newer form
 * first and fall back to the older one.
 */
export function getWebviewFrame(page: Page): FrameLocator {
  // Newer (>=4.x) — outer .webview iframe wraps an inner active-frame.
  return page.frameLocator("iframe.webview").frameLocator("iframe");
}

export interface OpenVscodeFileOpts {
  port: number;
  /** Path relative to the workspace root, with forward slashes. */
  file: string;
  waitTimeoutMs?: number;
}

/**
 * Navigate to code-server, ensure the workspace is open, and request that
 * the file be opened in the megane custom editor (the default for .pdb /
 * .gro / .xyz / .mol / .sdf / .megane.json given the contributes block in
 * vscode-megane/package.json).
 */
export async function openVscodeFile(page: Page, opts: OpenVscodeFileOpts): Promise<FrameLocator> {
  const url = `http://127.0.0.1:${opts.port}/?folder=${encodeURIComponent("/workspace")}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  // code-server takes a few seconds to settle the workbench shell.
  await page.waitForSelector(".monaco-workbench", { timeout: 30_000 });

  // Open file via the explorer's quick-open input. Trigger Ctrl+P to bring
  // it up, then type the file path and Enter — code-server interprets that
  // as "open file" and respects the registered custom editor.
  await page.keyboard.press("Control+P");
  await page.keyboard.type(opts.file);
  await page.keyboard.press("Enter");

  const wv = getWebviewFrame(page);
  await waitForReady(wv, { needsData: true, timeout: opts.waitTimeoutMs ?? 60_000 });
  return wv;
}

export interface OpenVscodeNotebookOpts extends OpenVscodeFileOpts {
  /** Notebook filename (relative to workspace). */
  notebook: string;
}

/**
 * Open a notebook in code-server, run all cells via the command palette,
 * and return the output cell's webview frame containing the megane
 * widget. Used by widget-vscode.spec.ts.
 */
export async function openVscodeNotebook(
  page: Page,
  opts: OpenVscodeNotebookOpts,
): Promise<FrameLocator> {
  const url = `http://127.0.0.1:${opts.port}/?folder=${encodeURIComponent("/workspace")}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".monaco-workbench", { timeout: 30_000 });

  await page.keyboard.press("Control+P");
  await page.keyboard.type(opts.notebook);
  await page.keyboard.press("Enter");
  // Wait for the notebook editor to mount.
  await page.waitForSelector(".notebook-editor", { timeout: 30_000 });

  // Trigger the "Run All" command via the palette.
  await page.keyboard.press("F1");
  await page.keyboard.type("Notebook: Run All");
  await page.keyboard.press("Enter");

  const wv = getWebviewFrame(page);
  await waitForReady(wv, { needsData: true, timeout: opts.waitTimeoutMs ?? 90_000 });
  return wv;
}
