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

/** Bidirectional Plotly ↔ megane sync, mirroring external_events.ipynb
 *  cell 16. Setting `viewer.frame_index = N` from Python must:
 *
 *    1. update the megane viewer's `data-current-frame` attribute, AND
 *    2. fire the `frame_change` callback registered on the viewer, which
 *       in turn moves the red marker on the Plotly chart to (N, energy[N]).
 *
 *  The notebook ends with `viewer.frame_index = 50` so we can assert both
 *  effects after Run All without scripting any browser interaction.
 *  numpy.random is seeded for deterministic energy values. */
function bidirectionalSyncNotebook(targetFrame: number): NotebookSpec {
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
          "sync_pipe = megane.Pipeline()\n",
          `s = sync_pipe.add_node(megane.LoadStructure("${FIXTURES}/caffeine_water.pdb"))\n`,
          `t = sync_pipe.add_node(megane.LoadTrajectory(xtc="${FIXTURES}/caffeine_water_vibration.xtc"))\n`,
          'bonds = sync_pipe.add_node(megane.AddBonds(source="structure"))\n',
          "vp = sync_pipe.add_node(megane.Viewport())\n",
          "sync_pipe.add_edge(s.out.particle, t.inp.particle)\n",
          "sync_pipe.add_edge(s.out.particle, bonds.inp.particle)\n",
          "sync_pipe.add_edge(s.out.particle, vp.inp.particle)\n",
          "sync_pipe.add_edge(t.out.traj, vp.inp.traj)\n",
          "sync_pipe.add_edge(bonds.out.bond, vp.inp.bond)\n",
          "\n",
          "sync_viewer = megane.MolecularViewer()\n",
          'sync_viewer.layout = widgets.Layout(width="500px", height="400px")\n',
          "sync_viewer.set_pipeline(sync_pipe)\n",
        ],
      },
      {
        cell_type: "code",
        source: [
          "n = sync_viewer.total_frames\n",
          "x = np.arange(n)\n",
          "y = -500 + 10 * np.sin(x * 0.1) + np.random.randn(n) * 2\n",
          "\n",
          "sync_fig = go.FigureWidget(\n",
          "    data=[\n",
          '        go.Scatter(x=x, y=y, mode="lines", name="Energy"),\n',
          '        go.Scatter(x=[0], y=[y[0]], mode="markers",\n',
          '                   marker=dict(size=12, color="red"), name="Current"),\n',
          "    ],\n",
          "    layout=go.Layout(\n",
          '        title="Bidirectional sync",\n',
          "        height=300,\n",
          '        xaxis_title="Frame",\n',
          '        yaxis_title="Energy (kJ/mol)",\n',
          "    ),\n",
          ")\n",
          "\n",
          "def on_click(trace, points, state):\n",
          "    if points.point_inds:\n",
          "        sync_viewer.frame_index = points.point_inds[0]\n",
          "\n",
          "sync_fig.data[0].on_click(on_click)\n",
          "\n",
          '@sync_viewer.on_event("frame_change")\n',
          "def update_marker(data):\n",
          '    idx = data["frame_index"]\n',
          "    with sync_fig.batch_update():\n",
          "        sync_fig.data[1].x = [idx]\n",
          "        sync_fig.data[1].y = [y[idx]]\n",
          "\n",
          "widgets.VBox([sync_fig, sync_viewer])\n",
        ],
      },
      {
        cell_type: "code",
        source: [`sync_viewer.frame_index = ${targetFrame}\n`],
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

test("examples/external_events.ipynb bidirectional sync — frame_index drives Plotly marker (round-trip regression)", async ({
  page,
}) => {
  const TARGET_FRAME = 50;

  writeNotebook(
    NOTEBOOK_DIR,
    "widget_examples_bidirectional_sync",
    bidirectionalSyncNotebook(TARGET_FRAME),
  );
  await openLabNotebook(page, {
    port: PORT,
    token: TOKEN,
    notebook: "widget_examples_bidirectional_sync.ipynb",
    waitTimeoutMs: 120_000,
  });

  // The viewer must reflect the Python-side frame assignment.
  const viewer = page.locator('[data-testid="megane-viewer"]');
  await expect(viewer).toHaveCount(1, { timeout: 60_000 });
  await expect(viewer).toHaveAttribute("data-current-frame", String(TARGET_FRAME), {
    timeout: 30_000,
  });

  // The frame_change event must have fired the registered callback,
  // which moves the red marker (Scatter trace #1) to x=[TARGET_FRAME].
  // FigureWidget keeps `data` in sync via ipywidgets, so reading the
  // live Plotly graph div gives us the post-event state without any
  // browser interaction.
  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const gd = document.querySelector(
            'div[class*="js-plotly-plot"], div[class*="plotly-graph-div"]',
          ) as
            | (HTMLElement & {
                data?: Array<{ x?: ArrayLike<number>; y?: ArrayLike<number> }>;
              })
            | null;
          if (!gd?.data || gd.data.length < 2) return null;
          const marker = gd.data[1];
          if (!marker.x || marker.x.length === 0) return null;
          return Number(marker.x[0]);
        }),
      { timeout: 30_000, message: "Plotly marker x must update to target frame" },
    )
    .toBe(TARGET_FRAME);

  await waitForReady(page, { needsData: true, timeout: 30_000 });
  await expectViewerRegionMatch(page, PLATFORM, "bidirectional-sync-viewer");
});
