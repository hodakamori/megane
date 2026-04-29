/**
 * Phase 2.2 — Modify-node slider coverage.
 *
 * Inserts a Modify node into the default pipeline graph, re-routes the
 * loader-1 → viewport-1 particle edge through it, then sweeps the
 * scale / opacity parameters via the test-only pipeline store. Each
 * parameter change is verified by (a) the renderer's epoch advancing
 * and (b) a viewer-region baseline.
 *
 * Using setNodeParam over actual slider drag gives deterministic input
 * and avoids the React Flow node-rendered DOM (which is collapsed by
 * default). The corresponding testids (modify-node-scale,
 * modify-node-opacity) defined in src/components/nodes/ModifyNode.tsx
 * are still exercised end-to-end by the panel-driven appearance.spec.
 *
 * Widget hosts skip — the Python widget builds its pipeline via
 * set_pipeline() and doesn't expose the React Flow store path. A
 * widget-equivalent spec belongs in widget-api.spec.ts (set_pipeline
 * already exercises the basic case).
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
import { connectEdge, findNodeIdByType, insertNode, setNodeParam } from "./lib/pipeline";

const PLATFORM = "modify-node";
const FIXTURE = "caffeine_water.pdb";
const FIXTURE_ATOMS = 3024;

test.describe.configure({ mode: "serial" });

let boot: HostBoot | null = null;
let modifyId: string | null = null;

test.beforeAll(async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  boot = await bootHost(page, { fixture: FIXTURE, portSeed: info.workerIndex + 11 });
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

test("modify-node: insert + route + default scale=1 baseline", async () => {
  if (!boot) test.skip(true, "boot not initialised");
  const scope = boot!.scope;

  // Resolve loader/viewport ids by type so this works against either
  // the React Flow default (loader-1 / viewport-1) or pipelines that
  // come from Python's set_pipeline (load_structure-1 / viewport-3).
  const loaderId = await findNodeIdByType(scope, "load_structure");
  const viewportId = await findNodeIdByType(scope, "viewport");
  modifyId = await insertNode(scope, "modify");
  await connectEdge(scope, loaderId, modifyId, "particle", "in");
  await connectEdge(scope, modifyId, viewportId, "out", "particle");

  await stabilizeUi(scope);
  await expectFullPageMatch(boot!.scope, PLATFORM, `${getHost()}-default`);
});

test("modify-node: scale=0.5 shrinks atoms", async () => {
  if (!boot || !modifyId) test.skip(true, "modifyId not seeded");
  const scope = boot!.scope;
  const before = await getReadyState(scope);
  await setNodeParam(scope, modifyId!, { scale: 0.5 });
  await waitForReady(scope, { untilEpoch: before.renderEpoch + 1, timeout: 10_000 });
  await stabilizeUi(scope);
  await expectFullPageMatch(boot!.scope, PLATFORM, `${getHost()}-scale-0_5`);
});

test("modify-node: opacity=0.4 fades atoms", async () => {
  if (!boot || !modifyId) test.skip(true, "modifyId not seeded");
  const scope = boot!.scope;
  // Reset scale so the opacity baseline isn't confounded.
  await setNodeParam(scope, modifyId!, { scale: 1.0 });
  const before = await getReadyState(scope);
  await setNodeParam(scope, modifyId!, { opacity: 0.4 });
  await waitForReady(scope, { untilEpoch: before.renderEpoch + 1, timeout: 10_000 });
  await stabilizeUi(scope);
  await expectFullPageMatch(boot!.scope, PLATFORM, `${getHost()}-opacity-0_4`);
});
