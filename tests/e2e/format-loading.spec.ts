/**
 * Format loading E2E (M2).
 *
 * Drives the webapp through every supported file format so a regression in
 * the WASM parser entry point is caught before it ships. We exercise the
 * structure-upload dropzone with an in-process File constructed from the
 * fixture bytes — the path the user takes when they drop a file onto the
 * sidebar. Each fixture gets its own viewer-region baseline; on first run
 * the baseline is captured automatically by `compareToBaseline`.
 *
 * Trajectory companion files are exercised separately because they require
 * a structure to be loaded first.
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectViewerRegionMatch,
  getReadyState,
  waitForReady,
} from "./lib/setup";

const PLATFORM = "format-loading";
const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const FIXTURES = join(REPO, "tests", "fixtures");

interface StructureCase {
  name: string;
  file: string;
  mime: string;
  /** Expected atom count, or undefined to skip the strict count assertion. */
  expectedAtoms?: number;
}

const STRUCTURE_CASES: StructureCase[] = [
  { name: "pdb-1crn", file: "1crn.pdb", mime: "chemical/x-pdb", expectedAtoms: 327 },
  { name: "pdb-water-wrapped", file: "water_wrapped.pdb", mime: "chemical/x-pdb" },
  { name: "gro-water", file: "water.gro", mime: "chemical/x-gro" },
  { name: "xyz-perovskite", file: "perovskite_srtio3.xyz", mime: "chemical/x-xyz" },
  { name: "xyz-multiframe", file: "water_multiframe.xyz", mime: "chemical/x-xyz" },
  { name: "mol-methane", file: "methane.mol", mime: "chemical/x-mdl-molfile" },
  { name: "sdf-ethanol", file: "ethanol.sdf", mime: "chemical/x-mdl-sdfile" },
  { name: "cif-nacl", file: "nacl.cif", mime: "chemical/x-cif" },
  { name: "lammps-water", file: "water.lammps", mime: "text/plain" },
  // .lammpstrj is a *trajectory* format, not a structure — the LoadStructure
  // node's file input rejects it by extension, so dropping it here was
  // silently a no-op. Trajectory loading is exercised by the
  // "trajectory companion" suite below.
];

async function dropStructure(
  page: import("playwright/test").Page,
  fixture: StructureCase,
): Promise<void> {
  const bytes = readFileSync(join(FIXTURES, fixture.file));
  // Hidden file input on the LoadStructure node (the seeded graph mounts
  // this node by default).
  const input = page.locator('[data-testid="load-structure-input"]').first();
  await input.setInputFiles({
    name: fixture.file,
    mimeType: fixture.mime,
    buffer: bytes,
  });
}

test.describe("format loading: webapp drag-drop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  for (const c of STRUCTURE_CASES) {
    test(`loads ${c.name}`, async ({ page }) => {
      const before = await getReadyState(page);
      await dropStructure(page, c);
      // The renderer publishes a new epoch as soon as the snapshot rebinds.
      await waitForReady(page, { untilEpoch: before.renderEpoch + 1 });

      const contract = defaultViewerContract({ context: "webapp" });
      if (c.expectedAtoms !== undefined) {
        contract[0].attrs = {
          ...(contract[0].attrs ?? {}),
          "data-atom-count": String(c.expectedAtoms),
        };
      }
      await assertDomContract(page, contract);

      const atomAttr = await page
        .locator('[data-testid="megane-viewer"]')
        .getAttribute("data-atom-count");
      expect(Number(atomAttr)).toBeGreaterThan(0);

      // The pipeline editor's LoadStructure node header must display the
      // file the user actually opened — guards against the
      // `caffeine_water.pdb` ghost-name regression that PR-A2 fixed.
      await expect(
        page.locator('[data-testid="load-structure-filename"]').first(),
      ).toHaveText(c.file);

      await expectViewerRegionMatch(page, PLATFORM, `${c.name}-viewer`);
    });
  }
});

test.describe("format loading: trajectory companion", () => {
  test("loads caffeine_water + xtc", async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);

    // Default load already includes caffeine_water + .xtc. waitForReady
    // returns once the structure snapshot is bound, but the bundled XTC is
    // fetched in a follow-up Promise and the playback provider is wired
    // through a useEffect — so totalFrames lands a few microtasks later.
    // Poll the attribute until the trajectory makes it through the
    // pipeline rather than reading once and racing the load.
    await expect
      .poll(
        async () =>
          Number(
            (await page
              .locator('[data-testid="megane-viewer"]')
              .getAttribute("data-total-frames")) ?? 0,
          ),
        { timeout: 10_000 },
      )
      .toBeGreaterThan(1);

    await assertDomContract(page, [
      ...defaultViewerContract({ context: "webapp" }),
      { testid: "timeline-root", visible: true },
      { testid: "playback-seekbar", visible: true, enabled: true },
    ]);

    // Pipeline must reflect the actually-loaded files — not the seed
    // graph's literal defaults. After demo init both should display the
    // bundled file basenames, but updating via openFile / applyResult is
    // what guarantees the names track real loads going forward.
    await expect(
      page.locator('[data-testid="load-structure-filename"]').first(),
    ).toHaveText("caffeine_water.pdb");
    await expect(
      page.locator('[data-testid="load-trajectory-filename"]').first(),
    ).toHaveText("caffeine_water_vibration.xtc");
  });
});
