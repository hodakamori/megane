/**
 * Capture widget screenshots for documentation.
 *
 * Launches Vite dev server, renders the megane viewer in Playwright,
 * and captures screenshots for embedding in nbconvert notebook outputs.
 *
 * Usage:
 *   node docs/scripts/capture-widget-screenshots.mjs
 */

import { spawn } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const OUTPUT_DIR = join(ROOT, "docs", "public", "images");

const _require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = _require("playwright");

const PORT = 16173 + Math.floor(Math.random() * 100);

function startViteServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn("npx", ["vite", "--port", String(PORT), "--host", "127.0.0.1"], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NODE_ENV: "development" },
    });

    const timeout = setTimeout(() => {
      reject(new Error("Vite dev server did not start in time"));
    }, 30000);

    const handler = (data) => {
      const line = data.toString();
      if (line.includes("Local:") && line.includes(String(PORT))) {
        clearTimeout(timeout);
        resolve(proc);
      }
    };

    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
    proc.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

let server = null;
let browser = null;

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("Starting Vite dev server...");
  server = await startViteServer();
  console.log(`Vite dev server running on port ${PORT}`);

  browser = await chromium.launch({ headless: true });

  // --- widget-basic.png: default viewer (sidebar collapsed for cleaner look) ---
  {
    const ctx = await browser.newContext({ viewport: { width: 900, height: 500 } });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(3000);

    // Collapse both panels for a clean widget-like view
    const sidebarBtn = await page.$('button[title="Collapse sidebar"]');
    if (sidebarBtn) await sidebarBtn.click();
    const panelBtn = await page.$('button[title="Collapse panel"]');
    if (panelBtn) await panelBtn.click();
    await page.waitForTimeout(1000);

    const shot = await page.screenshot({ type: "png" });
    writeFileSync(join(OUTPUT_DIR, "widget-basic.png"), shot);
    console.log("  Saved widget-basic.png");
    await ctx.close();
  }

  // --- widget-full.png: full viewer with all panels ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1100, height: 600 } });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(3000);

    const shot = await page.screenshot({ type: "png" });
    writeFileSync(join(OUTPUT_DIR, "widget-full.png"), shot);
    console.log("  Saved widget-full.png");
    await ctx.close();
  }

  // --- widget-trajectory.png: viewer with timeline visible ---
  {
    const ctx = await browser.newContext({ viewport: { width: 900, height: 550 } });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(3000);

    // The demo app auto-loads trajectory, so timeline should be visible
    const shot = await page.screenshot({ type: "png" });
    writeFileSync(join(OUTPUT_DIR, "widget-trajectory.png"), shot);
    console.log("  Saved widget-trajectory.png");
    await ctx.close();
  }

  // --- widget-mobile.png: mobile-sized view ---
  {
    const ctx = await browser.newContext({ viewport: { width: 400, height: 500 } });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page.waitForTimeout(3000);

    const shot = await page.screenshot({ type: "png" });
    writeFileSync(join(OUTPUT_DIR, "widget-mobile.png"), shot);
    console.log("  Saved widget-mobile.png");
    await ctx.close();
  }

  console.log("\nAll screenshots captured successfully.");

} catch (err) {
  console.error("Screenshot capture failed:", err.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.kill();
}
