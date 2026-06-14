/**
 * Regression / feature — Licorice representation mode.
 *
 * Routes the default particle stream through a Representation node set to
 * "licorice" before it reaches the viewport. In licorice mode atoms and
 * bonds are both rendered at `LICORICE_RADIUS` (a thick continuous tube,
 * VMD-style) instead of the default ball-and-stick proportions.
 *
 * Driving the store via setNodeParam/connectEdge/disconnectEdge (not slider
 * DOM) keeps the input deterministic, mirroring modify-node.spec.ts and
 * resname-filter-opacity.spec.ts.
 *
 * Widget hosts skip — the Python widget builds its pipeline via
 * set_pipeline() and doesn't expose the React Flow store path (see
 * modify-node.spec.ts).
 */

import { test } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectFullPageMatch,
  getReadyState,
  stabilizeUi,
  waitForReady,
} from "./lib/setup";
import { bootHost, getHost, type HostBoot } from "./lib/host-fixture";
import {
  connectEdge,
  disconnectEdge,
  findNodeIdByType,
  insertNode,
  setNodeParam,
} from "./lib/pipeline";

const PLATFORM = "representation-licorice";
const FIXTURE = "caffeine_water.pdb";
const FIXTURE_ATOMS = 3024;

test.describe.configure({ mode: "serial" });

let boot: HostBoot | null = null;

test.beforeAll(async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  boot = await bootHost(page, { fixture: FIXTURE, portSeed: info.workerIndex + 51 });
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

test("representation-licorice: switching to Licorice mode renders thick continuous tubes", async () => {
  if (!boot) test.skip(true, "boot not initialised");
  const scope = boot!.scope;

  const replicateId = await findNodeIdByType(scope, "replicate");
  const viewportId = await findNodeIdByType(scope, "viewport");
  const representationId = await insertNode(scope, "representation");

  const before = await getReadyState(scope);

  // Re-route the particle stream: replicate -> representation -> viewport,
  // replacing the direct replicate -> viewport particle edge.
  await disconnectEdge(scope, replicateId, viewportId, "particle", "particle");
  await connectEdge(scope, replicateId, representationId, "particle", "in");
  await connectEdge(scope, representationId, viewportId, "out", "particle");
  await setNodeParam(scope, representationId, { mode: "licorice" });

  await waitForReady(scope, { untilEpoch: before.renderEpoch + 1, timeout: 10_000 });

  await stabilizeUi(scope);
  await expectFullPageMatch(boot!.scope, PLATFORM, `${getHost()}-licorice`);
});
