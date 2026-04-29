/**
 * Widget API helpers for Phase 2 E2E specs.
 *
 * The megane Python anywidget exposes traitlets that JS observes via the
 * model: viewer.frame_index, viewer.selected_atoms, viewer._pipeline_json.
 * On widget-jupyterlab and widget-vscode these can only be mutated from
 * Python — there is no JS-side setter.
 *
 * Stage 2 of Phase 2 replaced the legacy `window.jupyterapp` shim with a
 * "rewrite-the-notebook + Run All" pattern. This module exports the same
 * pattern as a reusable helper so cross-host specs (appearance, camera,
 * measurement, subsystem-rendering) can drive widget hosts uniformly.
 *
 * For non-widget hosts (webapp / jupyterlab-doc / vscode), the renderer
 * exposes the same state via window.__megane_test directly — no widget
 * round-trip needed. Specs decide which path to use based on host.
 */

import type { Page } from "playwright/test";
import { writeNotebook, openLabNotebook, type NotebookSpec } from "./hosts/jupyterlab";

export interface WidgetNotebookOpts {
  port: number;
  token: string;
  notebookDir: string;
  /** Slug used for the .ipynb filename (no extension). */
  notebookName: string;
  /** Cell groups appended to the setup cell, in order. */
  cells: string[][];
}

/**
 * Rewrite a JupyterLab notebook with the given setup + extra cells, then
 * Run All. Caller provides the setup cell (typically the viewer
 * construction). The cumulative cell sequence is what gets executed —
 * each test that calls this with N cells re-runs all N for full
 * reproducibility.
 */
export async function reopenWithCells(
  page: Page,
  opts: WidgetNotebookOpts,
  setupCell: string[],
): Promise<void> {
  const nb: NotebookSpec = {
    cells: [
      { cell_type: "code", source: setupCell },
      ...opts.cells.map((source) => ({ cell_type: "code" as const, source })),
    ],
  };
  writeNotebook(opts.notebookDir, opts.notebookName, nb);
  await openLabNotebook(page, {
    port: opts.port,
    token: opts.token,
    notebook: `${opts.notebookName}.ipynb`,
  });
}

/** Build the Python source that mutates frame_index. */
export function setFrameIndex(n: number): string[] {
  return [`viewer.frame_index = ${n}\n`];
}

/** Build the Python source that mutates selected_atoms. */
export function setSelectedAtoms(atoms: number[]): string[] {
  return [`viewer.selected_atoms = ${JSON.stringify(atoms)}\n`];
}

/**
 * Build the Python source that creates a minimal LoadStructure → Viewport
 * pipeline pointing at *fixturePath* and applies it via set_pipeline().
 */
export function setPipelineCells(fixturePath: string): string[] {
  return [
    "from megane import Pipeline, LoadStructure, Viewport\n",
    "_p = Pipeline()\n",
    `_s = _p.add_node(LoadStructure(\"${fixturePath}\"))\n`,
    "_v = _p.add_node(Viewport())\n",
    "_p.add_edge(_s.out.particle, _v.inp.particle)\n",
    "viewer.set_pipeline(_p)\n",
  ];
}
