/**
 * Cross-host fixture for Phase 2 E2E specs.
 *
 * Reads the MEGANE_HOST env var (defaults to "webapp") and boots the
 * matching host emulator, returning a uniform `{ scope, context, host }`
 * triple plus a teardown handle. The `scope` is whatever Playwright
 * surface the spec should drive (a Page for webapp, a FrameLocator for
 * the VSCode webview, a Page for JupyterLab variants).
 *
 * Each Phase 2 spec calls `bootHost()` from its `beforeAll` hook to get
 * a viewer that already loaded the standard caffeine_water.pdb fixture
 * (or whichever the spec passes via `opts.fixture`). Cleanup is the
 * caller's responsibility via the returned `teardown()`.
 */

import { existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, type Page, type Frame } from "playwright/test";

import { waitForReady } from "./setup";
import {
  startJupyterLab,
  stopJupyterLab,
  writeNotebook,
  openLabFile,
  openLabNotebook,
  type JupyterLabHandle,
  type NotebookSpec,
} from "./hosts/jupyterlab";
import {
  startCodeServer,
  stopCodeServer,
  openVscodeFile,
  openVscodeNotebook,
  type CodeServerHandle,
} from "./hosts/code-server";

export type HostName =
  | "webapp"
  | "jupyterlab-doc"
  | "vscode"
  | "widget-jupyterlab"
  | "widget-vscode";

export const ALL_HOSTS: HostName[] = [
  "webapp",
  "jupyterlab-doc",
  "vscode",
  "widget-jupyterlab",
  "widget-vscode",
];

/** data-megane-context value each host emits on the viewer root. */
export const HOST_CONTEXT: Record<HostName, string> = {
  webapp: "webapp",
  "jupyterlab-doc": "jupyterlab-doc",
  vscode: "vscode",
  // Widget hosts boot in set_pipeline mode so the React Flow store is
  // populated (modify-node + subsystem-rendering specs need it). That
  // path renders WidgetViewerPipeline which emits "widget-pipeline".
  "widget-jupyterlab": "widget-pipeline",
  "widget-vscode": "widget-pipeline",
};

export interface HostBoot {
  host: HostName;
  /** Playwright surface to drive — the outer Page or the webview Frame. */
  scope: Page | Frame;
  context: string;
  teardown: () => Promise<void> | void;
}

export interface BootOpts {
  /** Override MEGANE_HOST (defaults to env var). */
  host?: HostName;
  /** Fixture filename relative to tests/fixtures/ (default caffeine_water.pdb). */
  fixture?: string;
  /** Optional XTC trajectory companion (only valid for PDB fixtures + widget hosts). */
  xtc?: string;
  /** Test-id label used to derive the JupyterLab port (so parallel projects don't clash). */
  portSeed?: number;
  /** Repository root override. */
  repo?: string;
}

const DEFAULT_FIXTURE = "caffeine_water.pdb";

function resolveHost(opt?: HostName): HostName {
  if (opt) return opt;
  // Prefer per-project metadata (set by playwright.config.ts's phase2Matrix)
  // so a single `playwright test --project=appearance__vscode` run picks up
  // the right host without callers having to set MEGANE_HOST manually.
  try {
    const md = test.info().project.metadata as { meganeHost?: HostName } | undefined;
    if (md?.meganeHost && ALL_HOSTS.includes(md.meganeHost)) return md.meganeHost;
  } catch {
    /* outside a Playwright test context — fall back to env */
  }
  const env = (process.env.MEGANE_HOST ?? "webapp") as HostName;
  if (!ALL_HOSTS.includes(env)) {
    throw new Error(`MEGANE_HOST=${env!} is not one of ${ALL_HOSTS.join(", ")}`);
  }
  return env;
}

/** Read the resolved host without booting anything (useful for test.skip gates). */
export function getHost(opt?: HostName): HostName {
  return resolveHost(opt);
}

function repoRoot(): string {
  return join(fileURLToPath(import.meta.url), "..", "..", "..", "..");
}

/**
 * Boot the host indicated by MEGANE_HOST and load `opts.fixture`. Returns
 * the scope a spec should drive plus a teardown to call in `afterAll`.
 */
export async function bootHost(page: Page, opts: BootOpts = {}): Promise<HostBoot> {
  const host = resolveHost(opts.host);
  const repo = opts.repo ?? repoRoot();
  const fixture = opts.fixture ?? DEFAULT_FIXTURE;
  const seed = opts.portSeed ?? 0;
  const context = HOST_CONTEXT[host];

  switch (host) {
    case "webapp": {
      // Static webServer is started by playwright.config.ts; just open the page.
      await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
      // Drag the fixture into the dropzone — same path the existing webapp
      // spec uses. We avoid touching files; instead inject through the
      // hidden input the dropzone exposes.
      const fixturePath = join(repo, "tests", "fixtures", fixture);
      const input = page.locator('input[type="file"]').first();
      await input.setInputFiles(fixturePath);
      await waitForReady(page, { needsData: true, timeout: 30_000 });
      return {
        host,
        scope: page,
        context,
        teardown: async () => {
          /* webServer is shared, no per-test teardown */
        },
      };
    }

    case "jupyterlab-doc": {
      const port = 18889 + seed;
      const token = `megane-e2e-doc-${seed}`;
      const notebookDir = join(repo, "tests", "e2e", "notebooks");
      mkdirSync(notebookDir, { recursive: true });
      copyFileSync(join(repo, "tests", "fixtures", fixture), join(notebookDir, fixture));
      const lab = await startJupyterLab({
        port,
        token,
        notebookDir,
        cwd: repo,
        runtimeDir: `/tmp/megane-jupyter-doc-runtime-${seed}`,
      });
      try {
        await openLabFile(page, { port, token, file: fixture });
      } catch (e) {
        stopJupyterLab(lab);
        throw e;
      }
      return {
        host,
        scope: page,
        context,
        teardown: () => stopJupyterLab(lab),
      };
    }

    case "vscode": {
      const port = 18991 + seed;
      // openVscodeFile() in lib/hosts/code-server.ts hard-codes
      // /workspace as the folder URL — keep parity so the explorer
      // tree finds the fixture.
      const workspace = "/workspace";
      mkdirSync(workspace, { recursive: true });
      copyFileSync(join(repo, "tests", "fixtures", fixture), join(workspace, fixture));
      const cs = await startCodeServer({ port, workspace, e2eMode: true });
      try {
        const wv = await openVscodeFile(page, { port, file: fixture });
        return {
          host,
          scope: wv,
          context,
          teardown: () => stopCodeServer(cs),
        };
      } catch (e) {
        stopCodeServer(cs);
        throw e;
      }
    }

    case "widget-jupyterlab": {
      const port = 18888 + seed;
      const token = `megane-e2e-widget-${seed}`;
      const notebookDir = join(repo, "tests", "e2e", "notebooks");
      if (!existsSync(join(repo, "python", "megane", "static", "widget.js"))) {
        throw new Error("widget.js missing. Run `npm run build:widget`.");
      }
      const lab = await startJupyterLab({
        port,
        token,
        notebookDir,
        cwd: repo,
        runtimeDir: `/tmp/megane-jupyter-widget-runtime-${seed}`,
      });
      try {
        // set_pipeline boot: ensures the React Flow store is populated
        // with LoadStructure + AddBond + Viewport so modify-node /
        // subsystem-rendering specs can attach overlays. Bonds via
        // distance metric so the rendered output stays comparable to
        // the legacy load() default.
        // For multi-frame XYZ fixtures we additionally inject a
        // LoadTrajectory(xyz=...) node — Python's LoadStructure path
        // only retains frame 0, so without the companion node the
        // seekbar would be stuck at one frame.
        const trajCells = fixture.endsWith(".xyz")
          ? [
              `_t = _pipe.add_node(LoadTrajectory(xyz=\"${repo}/tests/fixtures/${fixture}\"))\n`,
              "_pipe.add_edge(_s.out.particle, _t.inp.particle)\n",
              "_pipe.add_edge(_t.out.traj, _v.inp.traj)\n",
            ]
          : [];
        const nb: NotebookSpec = {
          cells: [
            {
              cell_type: "code",
              source: [
                "import megane\n",
                "from megane import Pipeline, LoadStructure, LoadTrajectory, AddBonds, Viewport\n",
                "viewer = megane.MolecularViewer()\n",
                "_pipe = Pipeline()\n",
                `_s = _pipe.add_node(LoadStructure(\"${repo}/tests/fixtures/${fixture}\"))\n`,
                "_b = _pipe.add_node(AddBonds(source=\"distance\"))\n",
                "_v = _pipe.add_node(Viewport())\n",
                "_pipe.add_edge(_s.out.particle, _b.inp.particle)\n",
                "_pipe.add_edge(_s.out.particle, _v.inp.particle)\n",
                "_pipe.add_edge(_s.out.cell, _v.inp.cell)\n",
                "_pipe.add_edge(_b.out.bond, _v.inp.bond)\n",
                ...trajCells,
                "viewer.set_pipeline(_pipe)\n",
                "viewer\n",
              ],
            },
          ],
        };
        const slug = `phase2_widget_${fixture.replace(/[^a-z0-9]/gi, "_")}`;
        writeNotebook(notebookDir, slug, nb);
        await openLabNotebook(page, { port, token, notebook: `${slug}.ipynb` });
        return {
          host,
          scope: page,
          context,
          teardown: () => stopJupyterLab(lab),
        };
      } catch (e) {
        stopJupyterLab(lab);
        throw e;
      }
    }

    case "widget-vscode": {
      const port = 18992 + seed;
      // Same /workspace pin as the "vscode" case — openVscodeNotebook
      // navigates through code-server's explorer, which is rooted there.
      const workspace = "/workspace";
      mkdirSync(workspace, { recursive: true });
      const slug = `phase2_widget_${fixture.replace(/[^a-z0-9]/gi, "_")}`;
      const notebookPath = join(workspace, `${slug}.ipynb`);
      const json = JSON.stringify({
        nbformat: 4,
        nbformat_minor: 5,
        metadata: {
          kernelspec: { display_name: "Python 3 (ipykernel)", language: "python", name: "python3" },
        },
        cells: [
          {
            cell_type: "code",
            source: [
              "import megane\n",
              "from megane import Pipeline, LoadStructure, LoadTrajectory, AddBonds, Viewport\n",
              "from IPython.display import display, HTML\n",
              "display(HTML('<script>window.parent.postMessage({type: \"megane-test-mode\"}, \"*\")</script>'))\n",
              "viewer = megane.MolecularViewer()\n",
              "_pipe = Pipeline()\n",
              `_s = _pipe.add_node(LoadStructure(\"${workspace}/${fixture}\"))\n`,
              "_b = _pipe.add_node(AddBonds(source=\"distance\"))\n",
              "_v = _pipe.add_node(Viewport())\n",
              "_pipe.add_edge(_s.out.particle, _b.inp.particle)\n",
              "_pipe.add_edge(_s.out.particle, _v.inp.particle)\n",
              "_pipe.add_edge(_s.out.cell, _v.inp.cell)\n",
              "_pipe.add_edge(_b.out.bond, _v.inp.bond)\n",
              ...(fixture.endsWith(".xyz")
                ? [
                    `_t = _pipe.add_node(LoadTrajectory(xyz=\"${workspace}/${fixture}\"))\n`,
                    "_pipe.add_edge(_s.out.particle, _t.inp.particle)\n",
                    "_pipe.add_edge(_t.out.traj, _v.inp.traj)\n",
                  ]
                : []),
              "viewer.set_pipeline(_pipe)\n",
              "viewer\n",
            ],
            metadata: {},
            outputs: [],
            execution_count: null,
          },
        ],
      });
      const fs = await import("fs/promises");
      await fs.writeFile(notebookPath, json);
      copyFileSync(join(repo, "tests", "fixtures", fixture), join(workspace, fixture));
      const cs = await startCodeServer({ port, workspace, e2eMode: true });
      try {
        // ms-toolsai.jupyter renders the cell output in a srcdoc iframe
        // that does NOT inherit MEGANE_E2E_MODE from the extension host.
        // The renderer falls back to reading __MEGANE_TEST__ from the
        // parent window, so seed it via addInitScript on every frame.
        await page.addInitScript(() => {
          (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
        });
        const wv = await openVscodeNotebook(page, { port, notebook: `${slug}.ipynb` });
        return {
          host,
          scope: wv,
          context,
          teardown: () => stopCodeServer(cs),
        };
      } catch (e) {
        stopCodeServer(cs);
        throw e;
      }
    }
  }
}

/**
 * Slug that callers can use when constructing per-host baseline names.
 * Always returns the host name (matches MEGANE_HOST so baselines stay
 * predictable across local + CI runs).
 */
export function hostSlug(host: HostName): string {
  return host;
}
