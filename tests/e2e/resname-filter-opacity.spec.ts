/**
 * Regression — resname filter + opacity ("make the water semi-transparent").
 *
 * Reproduces the caffeine-in-water scenario from the AI pipeline chat: keep
 * the solute (CAF) fully visible while fading the water (HOH). We insert a
 * Filter (`resname == "HOH"`) → Modify (opacity 0.2) branch off the existing
 * particle stream and route it into the viewport.
 *
 * The bug this guards: `resname` selections evaluate against the structure's
 * parsed residue labels, but those were only wired in when the user manually
 * switched the display label source. With the default source ("none"), the
 * pipeline executor used a null label array, so `resname == "HOH"` matched
 * nothing and the water never faded. The fix (src/pipeline/execute.ts) falls
 * back to the load_structure node's parsed labels via the stream's
 * sourceNodeId, so resname filtering works out of the box.
 *
 * Driving the store via setNodeParam/connectEdge (not slider DOM) keeps the
 * input deterministic, mirroring modify-node.spec.ts.
 *
 * Widget hosts skip — the Python widget builds its pipeline via set_pipeline()
 * and doesn't expose the React Flow store path (see modify-node.spec.ts).
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

const PLATFORM = "resname-filter-opacity";
const FIXTURE = "caffeine_water.pdb";
const FIXTURE_ATOMS = 3024;

test.describe.configure({ mode: "serial" });

let boot: HostBoot | null = null;

test.beforeAll(async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  boot = await bootHost(page, { fixture: FIXTURE, portSeed: info.workerIndex + 17 });
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

test("resname-filter-opacity: water (resname == HOH) fades, caffeine stays opaque", async () => {
  if (!boot) test.skip(true, "boot not initialised");
  const scope = boot!.scope;

  // Tap the existing particle stream just before the viewport. The default
  // graph carries the full structure (caffeine + water) at full opacity; this
  // branch fades only the water atoms.
  const replicateId = await findNodeIdByType(scope, "replicate");
  const viewportId = await findNodeIdByType(scope, "viewport");
  const filterId = await insertNode(scope, "filter");
  const modifyId = await insertNode(scope, "modify");

  await setNodeParam(scope, filterId, { query: 'resname == "HOH"' });
  await setNodeParam(scope, modifyId, { scale: 1.0, opacity: 0.2 });

  const before = await getReadyState(scope);
  await connectEdge(scope, replicateId, filterId, "particle", "in");
  await connectEdge(scope, filterId, modifyId, "out", "in");
  await connectEdge(scope, modifyId, viewportId, "out", "particle");
  await waitForReady(scope, { untilEpoch: before.renderEpoch + 1, timeout: 10_000 });

  await stabilizeUi(scope);
  await expectFullPageMatch(boot!.scope, PLATFORM, `${getHost()}-water-faded`);
});

test("resname-filter-opacity: molecule_id fades water atoms and bonds together, caffeine stays opaque", async () => {
  if (!boot) test.skip(true, "boot not initialised");
  const scope = boot!.scope;

  // molecule_id == 0 is the connected component containing atom 0 (the
  // caffeine molecule, atoms 0-23 — see CONECT records in
  // caffeine_water.pdb). Every water molecule gets its own molecule_id >= 1.
  // `not molecule_id == 0` therefore selects every water atom/bond, letting a
  // single query fade both the particle and bond streams of the solvent.
  const replicateId = await findNodeIdByType(scope, "replicate");
  const addBondId = await findNodeIdByType(scope, "add_bond");
  const viewportId = await findNodeIdByType(scope, "viewport");

  const particleFilterId = await insertNode(scope, "filter");
  const particleModifyId = await insertNode(scope, "modify");
  const bondFilterId = await insertNode(scope, "filter");
  const bondModifyId = await insertNode(scope, "modify");

  await setNodeParam(scope, particleFilterId, { query: "not molecule_id == 0" });
  await setNodeParam(scope, particleModifyId, { scale: 1.0, opacity: 0.2 });
  await setNodeParam(scope, bondFilterId, { bond_query: "not molecule_id == 0" });
  await setNodeParam(scope, bondModifyId, { scale: 1.0, opacity: 0.2 });

  const before = await getReadyState(scope);
  await connectEdge(scope, replicateId, particleFilterId, "particle", "in");
  await connectEdge(scope, particleFilterId, particleModifyId, "out", "in");
  await connectEdge(scope, particleModifyId, viewportId, "out", "particle");
  await connectEdge(scope, addBondId, bondFilterId, "bond", "in");
  await connectEdge(scope, bondFilterId, bondModifyId, "out", "in");
  await connectEdge(scope, bondModifyId, viewportId, "out", "bond");
  await waitForReady(scope, { untilEpoch: before.renderEpoch + 1, timeout: 10_000 });

  await stabilizeUi(scope);
  await expectFullPageMatch(boot!.scope, PLATFORM, `${getHost()}-molecule-id-faded`);
});
