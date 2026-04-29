/**
 * Programmatic pipeline editing helpers for Phase 2 E2E specs.
 *
 * These helpers drive the Zustand pipeline store directly via
 * `window.__megane_test_pipeline_store`, which is exposed by
 * src/pipeline/store.ts whenever testMode is detected. Specs use this to
 * insert nodes / connect edges / set parameters without scripting React
 * Flow's mouse paths (which were the main source of flakiness in earlier
 * pipeline-editor experiments).
 *
 * The scope passed in must be a Playwright Page or Frame whose underlying
 * window has the megane bundle loaded — i.e. one returned by
 * `bootHost()` from host-fixture.ts.
 */

import type { Page, Frame } from "playwright/test";

export type Scope = Page | Frame;

export interface InsertedNode {
  id: string;
  type: string;
}

/**
 * Insert a new node of the given type into the active pipeline graph.
 * Returns the freshly-generated node id.
 */
export async function insertNode(
  scope: Scope,
  type: string,
  position?: { x: number; y: number },
): Promise<string> {
  return await scope.evaluate(
    ({ t, p }) => {
      const w = window as Window & {
        __megane_test_pipeline_store?: { getState: () => { addNode: (t: string, p?: { x: number; y: number }) => string } };
      };
      const store = w.__megane_test_pipeline_store;
      if (!store) throw new Error("__megane_test_pipeline_store not exposed; testMode off?");
      return store.getState().addNode(t, p);
    },
    { t: type, p: position },
  );
}

/**
 * Connect two existing nodes by id. Optional handle names disambiguate
 * which port to use when a node has more than one (defaults: "out" → "in").
 */
export async function connectEdge(
  scope: Scope,
  sourceId: string,
  targetId: string,
  sourceHandle: string = "out",
  targetHandle: string = "in",
): Promise<void> {
  await scope.evaluate(
    ({ s, t, sh, th }) => {
      const w = window as Window & {
        __megane_test_pipeline_store?: {
          getState: () => {
            onConnect: (c: {
              source: string;
              target: string;
              sourceHandle: string | null;
              targetHandle: string | null;
            }) => void;
          };
        };
      };
      const store = w.__megane_test_pipeline_store;
      if (!store) throw new Error("__megane_test_pipeline_store not exposed; testMode off?");
      store.getState().onConnect({
        source: s,
        target: t,
        sourceHandle: sh,
        targetHandle: th,
      });
    },
    { s: sourceId, t: targetId, sh: sourceHandle, th: targetHandle },
  );
}

/** Set a single parameter on a node, then re-execute the pipeline. */
export async function setNodeParam(
  scope: Scope,
  id: string,
  patch: Record<string, unknown>,
): Promise<void> {
  await scope.evaluate(
    ({ i, p }) => {
      const w = window as Window & {
        __megane_test_pipeline_store?: {
          getState: () => {
            updateNodeParams: (i: string, p: Record<string, unknown>) => void;
          };
        };
      };
      const store = w.__megane_test_pipeline_store;
      if (!store) throw new Error("__megane_test_pipeline_store not exposed; testMode off?");
      store.getState().updateNodeParams(i, p);
    },
    { i: id, p: patch },
  );
}

/** Remove a node by id. Edges connected to it are dropped automatically. */
export async function removeNode(scope: Scope, id: string): Promise<void> {
  await scope.evaluate(
    ({ i }) => {
      const w = window as Window & {
        __megane_test_pipeline_store?: {
          getState: () => { removeNode: (i: string) => void };
        };
      };
      const store = w.__megane_test_pipeline_store;
      if (!store) throw new Error("__megane_test_pipeline_store not exposed; testMode off?");
      store.getState().removeNode(i);
    },
    { i: id },
  );
}

/** List all node ids currently in the graph (helpful for debugging spec failures). */
export async function listNodes(scope: Scope): Promise<InsertedNode[]> {
  return await scope.evaluate(() => {
    const w = window as Window & {
      __megane_test_pipeline_store?: {
        getState: () => { nodes: Array<{ id: string; type?: string }> };
      };
    };
    const store = w.__megane_test_pipeline_store;
    if (!store) return [];
    return store.getState().nodes.map((n) => ({ id: n.id, type: n.type ?? "" }));
  });
}
