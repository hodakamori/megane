/**
 * Licorice representation coverage.
 *
 * Inserts a `representation` node into the default pipeline, routes the
 * loader → viewport particle edge through it, and switches the mode to
 * "licorice". The licorice mode renders atoms and bonds at a single equal
 * radius (LICORICE_RADIUS) so the spheres cap the cylinders into one
 * continuous tube (PyMOL/VMD sticks), as opposed to the default ball-and-stick
 * "atoms" mode where atoms are ~3.4× the bond radius.
 *
 * The viewer-region baseline locks down the visual delta between ball-and-stick
 * and licorice; visually inspect `webapp-licorice-viewer.png` before committing.
 *
 * The onboarding tour is suppressed up-front (globalThis.__MEGANE_TEST__) so the
 * welcome modal can't overlay the capture — the webapp `?test=1` path alone does
 * not gate the tour, only the renderer's testMode.
 *
 * Webapp host only — the React Flow store path (`__megane_test_pipeline_store`)
 * is the deterministic way to flip the representation mode without scripting the
 * collapsed node DOM. Widget hosts build their pipeline via set_pipeline() and
 * don't expose this path.
 */

import { test } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectFullPageMatch,
  expectViewerRegionMatch,
  getReadyState,
  stabilizeUi,
  waitForReady,
} from "./lib/setup";
import { bootHost, getHost, type HostBoot } from "./lib/host-fixture";
import { connectEdge, findNodeIdByType, insertNode, setNodeParam } from "./lib/pipeline";

const PLATFORM = "licorice";
const FIXTURE = "caffeine_water.pdb";
const FIXTURE_ATOMS = 3024;

test.describe.configure({ mode: "serial" });

let boot: HostBoot | null = null;

test.beforeAll(async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  // Suppress the onboarding tour before any navigation so the welcome modal
  // never overlays the viewer during capture.
  await page.addInitScript(() => {
    (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
  });
  boot = await bootHost(page, { fixture: FIXTURE, portSeed: info.workerIndex + 47 });
  await assertDomContract(boot.scope, [
    ...defaultViewerContract({ expectedAtoms: FIXTURE_ATOMS, context: boot.context }),
  ]);
});

test.afterAll(async () => {
  if (boot) {
    await boot.teardown();
    boot = null;
  }
});

test("licorice: switching representation renders a continuous equal-radius tube", async () => {
  if (!boot) test.skip(true, "boot not initialised");
  const scope = boot!.scope;

  // Route loader → representation → viewport on the particle stream; connecting
  // to the viewport's particle handle replaces the default direct edge.
  const loaderId = await findNodeIdByType(scope, "load_structure");
  const viewportId = await findNodeIdByType(scope, "viewport");
  const repId = await insertNode(scope, "representation");
  await connectEdge(scope, loaderId, repId, "particle", "in");
  await connectEdge(scope, repId, viewportId, "out", "particle");

  const before = await getReadyState(scope);
  await setNodeParam(scope, repId, { mode: "licorice" });
  await waitForReady(scope, { untilEpoch: before.renderEpoch + 1, timeout: 10_000 }).catch(() => {
    /* mode flip may not bump the epoch if it re-renders synchronously */
  });

  await stabilizeUi(scope);
  await expectFullPageMatch(boot!.scope, PLATFORM, `${getHost()}-licorice`);
  await expectViewerRegionMatch(boot!.scope, PLATFORM, `${getHost()}-licorice-viewer`);
});
