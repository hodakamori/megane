#!/usr/bin/env node
/**
 * Tiny static file server for E2E tests.
 *
 * Used by `playwright.config.ts` instead of `vite preview` to serve
 * `python/megane/static/app/` (the production webapp build) on a known
 * port. Vite preview was unreliable in CI — its module-graph startup
 * occasionally aborts the process within seconds with no actionable
 * error, while Node's built-in http module is rock-stable.
 *
 * Usage:
 *   node tests/e2e/lib/serve-static.mjs <dir> <port> [host]
 */

import { createServer } from "http";
import { readFile, stat } from "fs/promises";
import { join, extname, normalize, resolve } from "path";

const dir = resolve(process.argv[2] ?? "python/megane/static/app");
const port = Number(process.argv[3] ?? 15173);
const host = process.argv[4] ?? "127.0.0.1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".pdb": "text/plain; charset=utf-8",
  ".xtc": "application/octet-stream",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${host}:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    // Prevent path traversal.
    pathname = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    let filePath = join(dir, pathname);

    let s;
    try {
      s = await stat(filePath);
    } catch {
      // SPA fallback to index.html for unknown paths.
      filePath = join(dir, "index.html");
      s = await stat(filePath).catch(() => null);
      if (!s) {
        res.writeHead(404, { "content-type": "text/plain" });
        res.end("Not Found");
        return;
      }
    }

    if (s.isDirectory()) {
      filePath = join(filePath, "index.html");
    }

    const buf = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": MIME[ext] ?? "application/octet-stream",
      "content-length": buf.byteLength,
      "cache-control": "no-store",
    });
    res.end(buf);
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain" });
    res.end(`Server error: ${err && err.message ? err.message : String(err)}`);
  }
});

server.listen(port, host, () => {
  // Playwright Test detects readiness by the port being open, but having
  // an explicit log line also helps in failure-mode debugging.
  // eslint-disable-next-line no-console
  console.log(`[serve-static] http://${host}:${port}/  →  ${dir}`);
});

server.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("[serve-static] error:", err);
  process.exitCode = 1;
});

const shutdown = () => server.close(() => process.exit(0));
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
