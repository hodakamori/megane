/**
 * preview-docs.mjs — capture screenshots of the redesigned docs site for
 * visual review. Modeled on scripts/dev-preview.mjs; resolves Playwright via
 * the shared tests/e2e/utils/playwright.mjs helper (Chromium preinstalled at
 * /opt/pw-browsers, launched headless with swiftshader).
 *
 * Usage:
 *   1. Start the docs dev server:  cd docs && npx docusaurus start --port 3210
 *   2. node docs/scripts/preview-docs.mjs [baseUrl]
 *
 * Output: docs/dev-preview/screenshots/*.png
 */
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getChromium } from "../../tests/e2e/utils/playwright.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "dev-preview", "screenshots");
mkdirSync(OUT_DIR, { recursive: true });

const BASE = (process.argv[2] || "http://127.0.0.1:3210/megane").replace(/\/$/, "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Viewport presets. */
const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 812 };

async function shoot(page, name, { fullPage = false } = {}) {
  const path = join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage });
  console.log("  ✓", `${name}.png`);
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, theme);
  await sleep(300);
}

async function main() {
  const chromium = getChromium();
  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=swiftshader", "--no-sandbox", "--enable-webgl"],
  });

  try {
    // ── Landing — each hero mode, desktop ──
    const ctx = await browser.newContext({
      viewport: DESKTOP,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    console.log("Landing (desktop):", `${BASE}/`);
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
    await sleep(2500); // let the hero viewer mount + rotate
    await shoot(page, "landing-protein");

    for (const mode of ["Trajectory", "Pipeline"]) {
      const btn = page.getByRole("button", { name: mode });
      if (await btn.count()) {
        await btn.first().click();
        await sleep(2500);
        await shoot(page, `landing-${mode.toLowerCase()}`);
      }
    }
    await shoot(page, "landing-full", { fullPage: true });
    await ctx.close();

    // ── Landing — mobile ──
    const mctx = await browser.newContext({ viewport: MOBILE, isMobile: true });
    const mpage = await mctx.newPage();
    await mpage.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
    await sleep(2000);
    await shoot(mpage, "landing-mobile");
    await mctx.close();

    // ── Docs pages ──
    const dctx = await browser.newContext({ viewport: DESKTOP });
    const dpage = await dctx.newPage();

    const docPages = [
      ["getting-started", "/getting-started"],
      ["introduction", "/introduction"],
      ["guide-jupyter", "/guide/jupyter"],
      ["platform-support", "/platform-support"],
      ["gallery", "/gallery"],
      ["pipeline-index", "/guide/pipeline/"],
    ];

    for (const [name, path] of docPages) {
      console.log("Docs:", `${BASE}${path}`);
      await dpage.goto(`${BASE}${path}`, {
        waitUntil: "networkidle",
        timeout: 60000,
      });
      await setTheme(dpage, "light");
      await sleep(600);
      await shoot(dpage, `docs-${name}-light`);
      await shoot(dpage, `docs-${name}-light-full`, { fullPage: true });
      await setTheme(dpage, "dark");
      await sleep(600);
      await shoot(dpage, `docs-${name}-dark`);
    }
    await dctx.close();

    // ── Docs — mobile (drawer) ──
    const dmctx = await browser.newContext({ viewport: MOBILE, isMobile: true });
    const dmpage = await dmctx.newPage();
    await dmpage.goto(`${BASE}/getting-started`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await sleep(600);
    await shoot(dmpage, "docs-getting-started-mobile");
    await dmctx.close();

    console.log("\nAll screenshots →", OUT_DIR);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
