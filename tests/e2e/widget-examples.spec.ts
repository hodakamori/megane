/**
 * Regression coverage for the two example notebooks (`examples/demo.ipynb`
 * and `examples/external_events.ipynb`) that were broken before the
 * per-instance pipeline store fix.
 *
 *   1. multi-viewer    — two MolecularViewer widgets in an HBox; previously
 *      the second viewer's set_pipeline() clobbered the first viewer's
 *      shared singleton store and the first canvas went blank.
 *   2. plotly-link     — a Plotly FigureWidget stacked above a viewer,
 *      mirroring the "click-to-jump-frame" cell. plotly was not even in
 *      the dev dependencies before this PR; this spec guards both the dep
 *      and the integration shape.
 *
 * Mirrors the structure of widget-jupyterlab.spec.ts (programmatic notebook
 * generation + Run All + 3-layer assertions). The notebooks are written to
 * `tests/e2e/notebooks/` so they share the same Jupyter runtime as the
 * other widget specs.
 */

import { existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, expect } from "playwright/test";
import {
  assertDomContract,
  expectFullPageMatch,
  expectViewerRegionMatch,
  waitForReady,
} from "./lib/setup";
import {
  startJupyterLab,
  stopJupyterLab,
  writeNotebook,
  openLabNotebook,
  type JupyterLabHandle,
  type NotebookSpec,
} from "./lib/hosts/jupyterlab";

const PLATFORM = "widget-examples";

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const NOTEBOOK_DIR = join(REPO, "tests", "e2e", "notebooks");
const FIXTURES = join(REPO, "tests", "fixtures");
const PORT = Number(process.env.MEGANE_LAB_PORT ?? 18890);
const TOKEN = "megane-e2e-token";

let lab: JupyterLabHandle | null = null;

/** Minimal repro of the demo.ipynb "Multiple Viewers" cell.
 *
 *  Each viewer is given an explicit ipywidgets.Layout width/height so the
 *  HBox children are sized — anywidget defers React mount until the
 *  container has non-zero dimensions, and HBox itself does not stretch
 *  flex children to a useful size on its own. The actual example in
 *  demo.ipynb relies on the JupyterLab default cell width to size the
 *  HBox (which works there but not in our headless 1280×800 viewport
 *  without explicit layout). */
function multiViewerNotebook(): NotebookSpec {
  return {
    cells: [
      {
        cell_type: "code",
        source: ["import megane\n", "import ipywidgets as widgets\n"],
      },
      {
        cell_type: "code",
        source: [
          "pipe1 = megane.Pipeline()\n",
          `s1 = pipe1.add_node(megane.LoadStructure("${FIXTURES}/caffeine_water.pdb"))\n`,
          'b1 = pipe1.add_node(megane.AddBonds(source="distance"))\n',
          "vp1 = pipe1.add_node(megane.Viewport())\n",
          "pipe1.add_edge(s1.out.particle, b1.inp.particle)\n",
          "pipe1.add_edge(s1.out.particle, vp1.inp.particle)\n",
          "pipe1.add_edge(b1.out.bond, vp1.inp.bond)\n",
          "\n",
          "pipe2 = megane.Pipeline()\n",
          `s2 = pipe2.add_node(megane.LoadStructure("${FIXTURES}/caffeine_water.pdb"))\n`,
          'b2 = pipe2.add_node(megane.AddBonds(source="distance"))\n',
          "vp2 = pipe2.add_node(megane.Viewport())\n",
          "pipe2.add_edge(s2.out.particle, b2.inp.particle)\n",
          "pipe2.add_edge(s2.out.particle, vp2.inp.particle)\n",
          "pipe2.add_edge(b2.out.bond, vp2.inp.bond)\n",
          "\n",
          "v1 = megane.MolecularViewer()\n",
          'v1.layout = widgets.Layout(width="500px", height="400px")\n',
          "v1.set_pipeline(pipe1)\n",
          "v2 = megane.MolecularViewer()\n",
          'v2.layout = widgets.Layout(width="500px", height="400px")\n',
          "v2.set_pipeline(pipe2)\n",
          "widgets.HBox([v1, v2])\n",
        ],
      },
    ],
  };
}

/** Plotly + viewer cell, mirroring external_events.ipynb cell 4 with a
 *  fixed RNG seed so the chart pixels are deterministic. */
function plotlyLinkNotebook(): NotebookSpec {
  return {
    cells: [
      {
        cell_type: "code",
        source: [
          "import megane\n",
          "import numpy as np\n",
          "import plotly.graph_objects as go\n",
          "import ipywidgets as widgets\n",
          "np.random.seed(0)\n",
        ],
      },
      {
        cell_type: "code",
        source: [
          "pipe = megane.Pipeline()\n",
          `s = pipe.add_node(megane.LoadStructure("${FIXTURES}/caffeine_water.pdb"))\n`,
          `t = pipe.add_node(megane.LoadTrajectory(xtc="${FIXTURES}/caffeine_water_vibration.xtc"))\n`,
          'bonds = pipe.add_node(megane.AddBonds(source="structure"))\n',
          "vp = pipe.add_node(megane.Viewport())\n",
          "pipe.add_edge(s.out.particle, t.inp.particle)\n",
          "pipe.add_edge(s.out.particle, bonds.inp.particle)\n",
          "pipe.add_edge(s.out.particle, vp.inp.particle)\n",
          "pipe.add_edge(t.out.traj, vp.inp.traj)\n",
          "pipe.add_edge(bonds.out.bond, vp.inp.bond)\n",
          "\n",
          "viewer = megane.MolecularViewer()\n",
          "viewer.set_pipeline(pipe)\n",
        ],
      },
      {
        cell_type: "code",
        source: [
          'viewer.layout = widgets.Layout(width="500px", height="400px")\n',
          "n_frames = viewer.total_frames\n",
          "frames = np.arange(n_frames)\n",
          "energy = -500 + 10 * np.sin(frames * 0.1) + np.random.randn(n_frames) * 2\n",
          "fig = go.FigureWidget(\n",
          '    data=[go.Scatter(x=frames, y=energy, mode="lines+markers", name="Energy")],\n',
          "    layout=go.Layout(\n",
          '        title="Energy vs Frame",\n',
          '        xaxis_title="Frame",\n',
          '        yaxis_title="Energy (kJ/mol)",\n',
          "        height=300,\n",
          "    ),\n",
          ")\n",
          "\n",
          "def on_plotly_click(trace, points, state):\n",
          "    if points.point_inds:\n",
          "        viewer.frame_index = points.point_inds[0]\n",
          "\n",
          "fig.data[0].on_click(on_plotly_click)\n",
          "widgets.VBox([fig, viewer])\n",
        ],
      },
    ],
  };
}

test.describe.configure({ timeout: 240_000 });

test.beforeAll(async () => {
  test.setTimeout(120_000);
  if (!existsSync(join(REPO, "python", "megane", "static", "widget.js"))) {
    throw new Error(
      "widget.js missing. Run `npm run build:widget` before widget-examples.spec.ts.",
    );
  }
  lab = await startJupyterLab({
    port: PORT,
    token: TOKEN,
    notebookDir: NOTEBOOK_DIR,
    cwd: REPO,
    runtimeDir: "/tmp/megane-jupyter-runtime-examples",
  });
});

test.afterAll(() => {
  stopJupyterLab(lab);
  lab = null;
});

test("examples/demo.ipynb HBox of two viewers — both render (multi-viewport regression)", async ({
  page,
}) => {
  writeNotebook(NOTEBOOK_DIR, "widget_examples_multi_viewer", multiViewerNotebook());
  await openLabNotebook(page, {
    port: PORT,
    token: TOKEN,
    notebook: "widget_examples_multi_viewer.ipynb",
    waitTimeoutMs: 120_000,
  });

  // Both viewers must mount with non-zero atoms. This is the precise
  // assertion that failed before the per-instance store fix: the second
  // viewer's loadPipeline() left the first viewer's data-atom-count="0"
  // and the first canvas blank.
  const viewers = page.locator('[data-testid="megane-viewer"]');
  await expect(viewers).toHaveCount(2, { timeout: 60_000 });
  for (let i = 0; i < 2; i++) {
    const v = viewers.nth(i);
    await expect(v).toBeVisible();
    await expect(v).toHaveAttribute("data-megane-context", "widget-pipeline");
    const atomCount = await v.getAttribute("data-atom-count");
    expect(Number(atomCount), `viewer ${i} atom count`).toBeGreaterThan(0);
  }

  await assertDomContract(page, [{ testid: "viewer-root", visible: true, count: 2 }]);

  await expectFullPageMatch(page, PLATFORM, "multi-viewer");
  await expectViewerRegionMatch(page, PLATFORM, "multi-viewer-first");
});

test("examples/external_events.ipynb plotly + viewer VBox — mounts and renders (plotly regression)", async ({
  page,
}) => {
  writeNotebook(NOTEBOOK_DIR, "widget_examples_plotly_link", plotlyLinkNotebook());
  await openLabNotebook(page, {
    port: PORT,
    token: TOKEN,
    notebook: "widget_examples_plotly_link.ipynb",
    waitTimeoutMs: 120_000,
  });

  // Confirm the viewer mounted with non-zero atoms (regression: plotly was
  // missing from the dev deps so the import failed before the viewer cell
  // ever ran).
  const viewer = page.locator('[data-testid="megane-viewer"]');
  await expect(viewer).toHaveCount(1, { timeout: 60_000 });
  await expect(viewer).toBeVisible();
  const atomCount = await viewer.getAttribute("data-atom-count");
  expect(Number(atomCount), "viewer atom count").toBeGreaterThan(0);
  const totalFrames = await viewer.getAttribute("data-total-frames");
  expect(Number(totalFrames), "trajectory frames loaded").toBeGreaterThan(1);

  // Plotly's FigureWidget renders the chart with a "plotly-logomark" link
  // back to plotly.com — a stable marker across plotly versions. plotly
  // lazy-loads its bundle in JupyterLab so allow generous time after
  // the megane viewer is already up.
  const plotlyLogo = page.locator('a.plotly-logomark, a[href="https://plotly.com/"]');
  await expect(plotlyLogo.first()).toBeAttached({ timeout: 60_000 });
  // Title text guards "the chart actually populated the layout we
  // configured", not just "plotly imported".
  await expect(page.getByText("Energy vs Frame").first()).toBeAttached({
    timeout: 30_000,
  });

  // Viewer-region snapshot only — Plotly's SVG rendering and font metrics
  // are not stable enough across hosts for a full-page pixel diff to be
  // useful here. The viewer surface is the part we actually own.
  await waitForReady(page, { needsData: true, timeout: 30_000 });
  await expectViewerRegionMatch(page, PLATFORM, "plotly-viewer");
});
