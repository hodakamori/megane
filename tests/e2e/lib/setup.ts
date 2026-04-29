/**
 * Shared E2E test helpers for megane (M1 foundation).
 *
 * Provides three layers of assertion that all platform specs use:
 *
 *   1. assertDomContract  — required test-ids (presence, attributes, count)
 *   2. captureFullPage    — full-window pixel-diff baseline (incl. host UI)
 *   3. captureViewerRegion — pixel-diff of the viewer-root rectangle only,
 *                             used for cross-platform Parity assertions
 *
 * It also exposes a shared waitForReady() that synchronizes against the
 * deterministic ready signal exposed by MoleculeRenderer when the page is
 * loaded with `?test=1` (or globalThis.__MEGANE_TEST__ === true).
 *
 * The smoke-level "canvas exists + non-white pixel ratio" check from earlier
 * E2E suites is intentionally absent here — it is the regression-detection
 * gap this rewrite is meant to close.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import type { Frame, Locator, Page } from "playwright/test";
import { expect } from "playwright/test";

// pixelmatch / pngjs are project devDeps and resolve from the project's
// node_modules. The dynamic import lets this module compile under tsc even
// when tests are not being run.
async function loadPixelMatch(): Promise<{
  pixelmatch: (
    img1: Uint8Array,
    img2: Uint8Array,
    out: Uint8Array | null,
    w: number,
    h: number,
    opts?: { threshold?: number },
  ) => number;
  PNG: typeof import("pngjs").PNG;
}> {
  const pm = await import("pixelmatch");
  const pngMod = await import("pngjs");
  return {
    pixelmatch: (pm as { default: typeof pm }).default ?? (pm as never),
    PNG: pngMod.PNG,
  };
}

const PIXEL_THRESHOLD = 0.15;
const DEFAULT_MAX_DIFF_PERCENT = 2.0;

/* ─── Ready signal ─────────────────────────────────────────────── */

/**
 * Wait for the renderer's `window.__megane_test_ready` to satisfy the given
 * gates. Set when the page is loaded with `?test=1`.
 *
 * - `firstFrame: true`           — at least one render with a snapshot bound
 * - `dataLoaded: true`           — loadSnapshot() was called
 * - `untilEpoch: <n>`            — wait until renderEpoch >= n (post-interaction)
 * - `inFrame`                    — search inside an iframe (Widget/VSCode webview)
 */
export async function waitForReady(
  scope: Page | Frame,
  opts: {
    needsData?: boolean;
    untilEpoch?: number;
    timeout?: number;
  } = {},
): Promise<void> {
  const { needsData = true, untilEpoch, timeout = 30_000 } = opts;
  try {
    await scope.waitForFunction(
      ([needsData, minEpoch]: [boolean, number | undefined]) => {
        const w = window as unknown as {
          __megane_test_ready?: {
            firstFrame: boolean;
            dataLoaded: boolean;
            renderEpoch: number;
          };
        };
        const r = w.__megane_test_ready;
        if (!r) return false;
        if (!r.firstFrame) return false;
        if (needsData && !r.dataLoaded) return false;
        if (typeof minEpoch === "number" && r.renderEpoch < minEpoch) return false;
        return true;
      },
      [needsData, untilEpoch],
      { timeout },
    );
  } catch (e) {
    // Best-effort diagnostic: dump what the page sees so the test
    // log shows whether testMode never engaged vs data never loaded.
    const state = await scope
      .evaluate(() => {
        const w = window as unknown as {
          __megane_test_ready?: unknown;
          __MEGANE_TEST__?: unknown;
          location?: { search?: string; href?: string };
        };
        return {
          ready: w.__megane_test_ready ?? null,
          testFlag: w.__MEGANE_TEST__ ?? null,
          search: w.location?.search ?? null,
          href: w.location?.href ?? null,
        };
      })
      .catch(() => null);
    // eslint-disable-next-line no-console
    console.error("waitForReady timeout. State:", JSON.stringify(state));
    throw e;
  }
}

/** Read the current ready state — used to snapshot epoch before an interaction. */
export async function getReadyState(scope: Page | Frame): Promise<{
  firstFrame: boolean;
  dataLoaded: boolean;
  renderEpoch: number;
  frame?: number;
  atomCount?: number;
}> {
  return scope.evaluate(() => {
    const w = window as unknown as {
      __megane_test_ready?: {
        firstFrame: boolean;
        dataLoaded: boolean;
        renderEpoch: number;
        frame?: number;
        atomCount?: number;
      };
    };
    return (
      w.__megane_test_ready ?? {
        firstFrame: false,
        dataLoaded: false,
        renderEpoch: 0,
      }
    );
  });
}

/* ─── DOM contract ─────────────────────────────────────────────── */

export interface DomContractItem {
  /** test id required by the contract */
  testid: string;
  /** must be present and visible */
  visible?: boolean;
  /** exact text content (trimmed) */
  text?: string;
  /** must be enabled (not have the disabled attribute) */
  enabled?: boolean;
  /** required count of elements with this testid (default 1) */
  count?: number;
  /** required attribute key/value pairs on the element */
  attrs?: Record<string, string | number>;
}

/**
 * Assert that all required test-ids (and their attributes) are present and
 * in the expected state. This is the cheapest layer in the 3-layer stack
 * and catches regressions like "menu item disappeared in widget but still
 * exists in webapp" before any pixel comparison runs.
 */
export async function assertDomContract(
  scope: Page | Frame,
  contract: DomContractItem[],
): Promise<void> {
  for (const item of contract) {
    const sel = `[data-testid="${item.testid}"]`;
    const expectedCount = item.count ?? 1;
    const handles = scope.locator(sel);
    await expect(
      handles,
      `data-testid="${item.testid}" expected count=${expectedCount}`,
    ).toHaveCount(expectedCount);

    const target = handles.first();
    if (item.visible !== false) {
      await expect(target, `data-testid="${item.testid}" should be visible`).toBeVisible();
    }
    if (item.text !== undefined) {
      await expect(target, `data-testid="${item.testid}" text mismatch`).toHaveText(item.text);
    }
    if (item.enabled === true) {
      await expect(target, `data-testid="${item.testid}" should be enabled`).toBeEnabled();
    } else if (item.enabled === false) {
      await expect(target, `data-testid="${item.testid}" should be disabled`).toBeDisabled();
    }
    if (item.attrs) {
      for (const [k, v] of Object.entries(item.attrs)) {
        await expect(
          target,
          `data-testid="${item.testid}" attribute ${k} mismatch`,
        ).toHaveAttribute(k, String(v));
      }
    }
  }
}

/** Common contract that EVERY platform must satisfy when a structure is loaded. */
export function defaultViewerContract(opts: {
  expectedAtoms?: number;
  context?: string;
} = {}): DomContractItem[] {
  const items: DomContractItem[] = [
    { testid: "megane-viewer", visible: true },
    { testid: "viewer-root", visible: true },
  ];
  if (opts.context) {
    items[0].attrs = { "data-megane-context": opts.context };
  }
  if (opts.expectedAtoms !== undefined) {
    items[0] = {
      ...items[0],
      attrs: { ...(items[0].attrs ?? {}), "data-atom-count": String(opts.expectedAtoms) },
    };
  }
  return items;
}

/* ─── Capture helpers ──────────────────────────────────────────── */

/**
 * Take a full-page screenshot. Defaults are tuned to suppress accidental
 * sources of pixel jitter (animations, blinking caret, scrollbars).
 */
export async function captureFullPage(
  page: Page,
  outPath: string,
  opts: { mask?: Locator[] } = {},
): Promise<Buffer> {
  await stabilizeUi(page);
  const buf = await page.screenshot({
    path: outPath,
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    mask: opts.mask,
  });
  return buf;
}

/**
 * Take a screenshot of just the viewer-root region. Used as the
 * cross-platform Parity baseline (the same fixed input should produce the
 * same viewer pixels regardless of host UI chrome).
 */
export async function captureViewerRegion(
  scope: Page | Frame,
  outPath: string,
): Promise<Buffer> {
  if ("evaluate" in scope && typeof (scope as Page).screenshot === "function") {
    await stabilizeUi(scope as Page);
  }
  const target = scope.locator('[data-testid="viewer-root"]').first();
  const buf = await target.screenshot({
    path: outPath,
    animations: "disabled",
    caret: "hide",
  });
  return buf;
}

/**
 * Compare a freshly captured PNG against an on-disk baseline. On first run
 * the baseline is created. On size mismatch or pixel-diff exceeding
 * `maxDiffPercent`, a `.new.png` and `.diff.png` are written next to the
 * baseline and the function returns `ok: false` so callers can throw with a
 * test-aware message.
 */
export interface ComparisonResult {
  isNew: boolean;
  diffPixels: number;
  totalPixels: number;
  diffPercent: number;
  sizeMismatch?: boolean;
  ok: boolean;
}

export async function compareToBaseline(
  baselinePath: string,
  current: Buffer,
  opts: { maxDiffPercent?: number; threshold?: number } = {},
): Promise<ComparisonResult> {
  const maxDiff = opts.maxDiffPercent ?? DEFAULT_MAX_DIFF_PERCENT;
  const threshold = opts.threshold ?? PIXEL_THRESHOLD;

  mkdirSync(dirname(baselinePath), { recursive: true });

  if (!existsSync(baselinePath)) {
    writeFileSync(baselinePath, current);
    return { isNew: true, diffPixels: 0, totalPixels: 0, diffPercent: 0, ok: true };
  }

  const { pixelmatch, PNG } = await loadPixelMatch();
  const baseline = PNG.sync.read(readFileSync(baselinePath));
  const cur = PNG.sync.read(current);

  if (baseline.width !== cur.width || baseline.height !== cur.height) {
    writeFileSync(baselinePath.replace(/\.png$/, ".new.png"), current);
    return {
      isNew: false,
      diffPixels: baseline.width * baseline.height,
      totalPixels: baseline.width * baseline.height,
      diffPercent: 100,
      sizeMismatch: true,
      ok: false,
    };
  }

  const { width, height } = baseline;
  const diff = new PNG({ width, height });
  const numDiff = pixelmatch(
    baseline.data,
    cur.data,
    diff.data,
    width,
    height,
    { threshold },
  );
  const total = width * height;
  const diffPercent = (numDiff / total) * 100;

  if (diffPercent > maxDiff) {
    writeFileSync(baselinePath.replace(/\.png$/, ".diff.png"), PNG.sync.write(diff));
    writeFileSync(baselinePath.replace(/\.png$/, ".new.png"), current);
  }

  return {
    isNew: false,
    diffPixels: numDiff,
    totalPixels: total,
    diffPercent,
    ok: diffPercent <= maxDiff,
  };
}

/**
 * Convenience wrapper: capture full page and compare to baseline at
 * `<repoRoot>/tests/e2e/baselines/<platform>/<name>.png`.
 */
export async function expectFullPageMatch(
  page: Page,
  platform: string,
  name: string,
  opts: { maxDiffPercent?: number; mask?: Locator[]; updateBaselines?: boolean } = {},
): Promise<void> {
  const baseline = baselinePath(platform, name);
  const shouldUpdate = opts.updateBaselines || process.env.MEGANE_E2E_UPDATE === "1";
  if (shouldUpdate && existsSync(baseline)) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { unlinkSync } = await import("fs");
      unlinkSync(baseline);
    } catch {}
  }
  const tmp = baseline.replace(/\.png$/, ".current.png");
  const buf = await captureFullPage(page, tmp, { mask: opts.mask });
  const r = await compareToBaseline(baseline, buf, { maxDiffPercent: opts.maxDiffPercent });
  expect(
    r.ok,
    r.sizeMismatch
      ? `${platform}/${name}: full-page size mismatch with baseline`
      : `${platform}/${name}: full-page diff ${r.diffPercent.toFixed(2)}% > ${opts.maxDiffPercent ?? DEFAULT_MAX_DIFF_PERCENT}%`,
  ).toBe(true);
}

/** Same as expectFullPageMatch but for the viewer-root rectangle only. */
export async function expectViewerRegionMatch(
  scope: Page | Frame,
  platform: string,
  name: string,
  opts: { maxDiffPercent?: number; updateBaselines?: boolean } = {},
): Promise<void> {
  const baseline = baselinePath(platform, name);
  const shouldUpdate = opts.updateBaselines || process.env.MEGANE_E2E_UPDATE === "1";
  if (shouldUpdate && existsSync(baseline)) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { unlinkSync } = await import("fs");
      unlinkSync(baseline);
    } catch {}
  }
  const tmp = baseline.replace(/\.png$/, ".current.png");
  const buf = await captureViewerRegion(scope, tmp);
  const r = await compareToBaseline(baseline, buf, { maxDiffPercent: opts.maxDiffPercent });
  expect(
    r.ok,
    r.sizeMismatch
      ? `${platform}/${name}: viewer-region size mismatch`
      : `${platform}/${name}: viewer-region diff ${r.diffPercent.toFixed(2)}%`,
  ).toBe(true);
}

export function baselinePath(platform: string, name: string): string {
  const repo = repoRoot();
  return join(repo, "tests", "e2e", "baselines", platform, `${name}.png`);
}

function repoRoot(): string {
  // tests/e2e/lib/setup.ts → repo root is three levels up.
  return join(dirname(new URL(import.meta.url).pathname), "..", "..", "..");
}

/* ─── Stabilization ────────────────────────────────────────────── */

/**
 * Reduce sources of pixel jitter before screenshotting. Per the plan, we do
 * NOT loosen pixel diff tolerance to hide flakiness — we mask it.
 */
export async function stabilizeUi(page: Page): Promise<void> {
  await page.mouse.move(0, 0).catch(() => {});
  await page
    .evaluate(() => {
      try {
        window.scrollTo(0, 0);
      } catch {}
      // Disable CSS animations/transitions globally
      const style = document.createElement("style");
      style.id = "megane-test-stabilize";
      style.textContent = `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
          caret-color: transparent !important;
        }
        ::-webkit-scrollbar { display: none !important; }
      `;
      document.head.appendChild(style);
    })
    .catch(() => {});
}

/* ─── Cross-platform Parity ─────────────────────────────────────── */

/**
 * Compare a captured viewer region against the contract baseline. Used by
 * `contract.spec.ts` to assert "viewer pixels are equivalent across all
 * platforms" — the assertion that catches "WebApp で動くものが Widget で動かない".
 */
export async function expectParityWithContract(
  scope: Page | Frame,
  contractName: string,
  opts: { maxDiffPercent?: number } = {},
): Promise<void> {
  // Slightly looser threshold than within-platform comparison: anti-aliasing
  // around shaded sphere/cylinder edges differs by a small amount across
  // host browsers (Chromium-in-VSCode vs Chromium-in-JupyterLab), and we
  // explicitly want regressions to be caught at the platform level too.
  const maxDiff = opts.maxDiffPercent ?? 4.0;
  const baseline = baselinePath("contract", contractName);
  const tmp = baseline.replace(/\.png$/, ".current.png");
  const buf = await captureViewerRegion(scope, tmp);
  const r = await compareToBaseline(baseline, buf, { maxDiffPercent: maxDiff });
  expect(
    r.ok,
    r.sizeMismatch
      ? `parity:${contractName} size mismatch (viewer-root rect differs)`
      : `parity:${contractName} viewer-region diff ${r.diffPercent.toFixed(2)}% > ${maxDiff}%`,
  ).toBe(true);
}
