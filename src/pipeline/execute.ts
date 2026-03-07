/**
 * Pipeline execution engine.
 * Topologically sorts the graph and folds nodes into a RenderState.
 * Supports selection context propagation for per-atom overrides.
 */

import type { Node, Edge } from "@xyflow/react";
import type { Snapshot } from "../types";
import type { PipelineNodeParams, RenderState, SelectionParams } from "./types";
import { DEFAULT_RENDER_STATE } from "./types";
import { evaluateSelection } from "./selection";

export interface PipelineNodeData {
  params: PipelineNodeParams;
  enabled: boolean;
  [key: string]: unknown;
}

/** null means "all atoms selected" */
type SelectionSet = Set<number> | null;

/**
 * Topologically sort nodes based on edges.
 * Returns ordered node IDs from sources to sinks.
 */
function topologicalSort(nodes: Node<PipelineNodeData>[], edges: Edge[]): string[] {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    const prev = inDegree.get(edge.target) ?? 0;
    inDegree.set(edge.target, prev + 1);
    adjacency.get(edge.source)?.push(edge.target);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);
    for (const next of adjacency.get(current) ?? []) {
      const newDeg = (inDegree.get(next) ?? 1) - 1;
      inDegree.set(next, newDeg);
      if (newDeg === 0) queue.push(next);
    }
  }

  return sorted;
}

/**
 * Apply a single node's parameters to the render state.
 * When a selection is active, set_atom writes per-atom overrides instead of global values.
 */
function applyNode(
  state: RenderState,
  params: PipelineNodeParams,
  selection: SelectionSet,
  snapshot: Snapshot | null,
): RenderState {
  switch (params.type) {
    case "load_structure":
      return {
        ...state,
        bondSource: params.bondSource,
        trajectorySource: params.trajectorySource,
      };
    case "selection":
      // Selection nodes don't modify render state directly
      return state;
    case "set_atom": {
      if (selection === null || !snapshot) {
        // No selection active: set global values (backward compatible)
        return { ...state, atomScale: params.scale, atomOpacity: params.opacity };
      }
      // Selection active: create per-atom overrides
      let scaleArr = state.atomScaleOverrides;
      let opacityArr = state.atomOpacityOverrides;
      if (!scaleArr) {
        scaleArr = new Float32Array(snapshot.nAtoms).fill(state.atomScale);
      } else {
        scaleArr = new Float32Array(scaleArr); // copy to avoid mutation
      }
      if (!opacityArr) {
        opacityArr = new Float32Array(snapshot.nAtoms).fill(state.atomOpacity);
      } else {
        opacityArr = new Float32Array(opacityArr);
      }
      for (const idx of selection) {
        scaleArr[idx] = params.scale;
        opacityArr[idx] = params.opacity;
      }
      return { ...state, atomScaleOverrides: scaleArr, atomOpacityOverrides: opacityArr };
    }
    case "set_bond_source":
      return {
        ...state,
        bondSource: params.source,
        bondsVisible: params.source !== "none",
        vdwScale: params.vdwScale,
      };
    case "set_bond":
      return { ...state, bondScale: params.scale, bondOpacity: params.opacity };
    case "set_labels":
      return { ...state, labelSource: params.source };
    case "set_vectors":
      return {
        ...state,
        vectorSource: params.source,
        vectorScale: params.scale,
      };
    case "set_display":
      return {
        ...state,
        perspective: params.perspective,
        cellAxesVisible: params.cellAxesVisible,
      };
    case "set_cell_visibility":
      return { ...state, cellVisible: params.cellVisible };
    default:
      return state;
  }
}

/**
 * Compute the set of node IDs reachable from any load_structure node via BFS.
 */
function reachableFromSources(nodes: Node<PipelineNodeData>[], edges: Edge[]): Set<string> {
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) adjacency.set(node.id, []);
  for (const edge of edges) adjacency.get(edge.source)?.push(edge.target);

  const reachable = new Set<string>();
  const queue: string[] = [];
  for (const node of nodes) {
    if (node.data.params.type === "load_structure") {
      reachable.add(node.id);
      queue.push(node.id);
    }
  }
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of adjacency.get(current) ?? []) {
      if (!reachable.has(next)) {
        reachable.add(next);
        queue.push(next);
      }
    }
  }
  return reachable;
}

/**
 * Intersect multiple selection sets. null means "all atoms".
 * Returns null if all inputs are null, otherwise the intersection of concrete sets.
 */
function intersectSelections(sets: SelectionSet[]): SelectionSet {
  if (sets.length === 0) return null;
  const concrete = sets.filter((s): s is Set<number> => s !== null);
  if (concrete.length === 0) return null;
  let result = new Set(concrete[0]);
  for (let i = 1; i < concrete.length; i++) {
    const other = concrete[i];
    result = new Set([...result].filter((x) => other.has(x)));
  }
  return result;
}

/**
 * Build reverse adjacency map: for each node, which nodes are its parents.
 */
function buildParentMap(edges: Edge[]): Map<string, string[]> {
  const parents = new Map<string, string[]>();
  for (const edge of edges) {
    if (!parents.has(edge.target)) parents.set(edge.target, []);
    parents.get(edge.target)!.push(edge.source);
  }
  return parents;
}

/**
 * Execute the pipeline by topologically sorting the graph
 * and folding node parameters into a RenderState.
 * Only nodes reachable from load_structure are executed.
 * Disabled nodes are skipped.
 * Selection context propagates through the graph for per-atom overrides.
 */
export function executePipeline(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
  snapshot?: Snapshot | null,
  atomLabels?: string[] | null,
): RenderState {
  const sortedIds = topologicalSort(nodes, edges);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const reachable = reachableFromSources(nodes, edges);
  const parentMap = buildParentMap(edges);

  // Track selection context per node
  const selectionMap = new Map<string, SelectionSet>();

  let state: RenderState = { ...DEFAULT_RENDER_STATE };

  for (const id of sortedIds) {
    if (!reachable.has(id)) continue;
    const node = nodeMap.get(id);
    if (!node) continue;
    const data = node.data;

    // Compute incoming selection from parent nodes
    const parentIds = parentMap.get(id) ?? [];
    const parentSelections = parentIds
      .filter((pid) => selectionMap.has(pid))
      .map((pid) => selectionMap.get(pid)!);
    const incomingSelection = parentIds.length > 0
      ? intersectSelections(parentSelections)
      : null;

    if (!data.enabled) {
      // Disabled nodes pass through parent selection unchanged
      selectionMap.set(id, incomingSelection);
      continue;
    }

    // Handle selection nodes
    if (data.params.type === "selection" && snapshot) {
      const selParams = data.params as SelectionParams;
      try {
        const queryResult = evaluateSelection(
          selParams.query,
          snapshot,
          atomLabels ?? null,
        );
        // Intersect query result with incoming selection
        if (queryResult === null) {
          // "all" or empty query: pass through incoming selection
          selectionMap.set(id, incomingSelection);
        } else if (incomingSelection === null) {
          // No incoming filter: use query result directly
          selectionMap.set(id, queryResult);
        } else {
          // Intersect both
          selectionMap.set(
            id,
            new Set([...queryResult].filter((x) => incomingSelection.has(x))),
          );
        }
      } catch {
        // Invalid query: select nothing
        selectionMap.set(id, new Set());
      }
    } else {
      // Non-selection nodes inherit parent selection
      selectionMap.set(id, incomingSelection);
    }

    const currentSelection = selectionMap.get(id) ?? null;
    state = applyNode(state, data.params, currentSelection, snapshot ?? null);
  }

  return state;
}
