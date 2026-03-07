/**
 * Pipeline execution engine.
 * Topologically sorts the graph and folds nodes into a RenderState.
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeParams, RenderState } from "./types";
import { DEFAULT_RENDER_STATE } from "./types";

export interface PipelineNodeData {
  params: PipelineNodeParams;
  enabled: boolean;
  [key: string]: unknown;
}

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
 */
function applyNode(state: RenderState, params: PipelineNodeParams): RenderState {
  switch (params.type) {
    case "load_structure":
      return {
        ...state,
        bondSource: params.bondSource,
        trajectorySource: params.trajectorySource,
      };
    case "set_atom_scale":
      return { ...state, atomScale: params.scale };
    case "set_atom_opacity":
      return { ...state, atomOpacity: params.opacity };
    case "set_bond_source":
      return {
        ...state,
        bondSource: params.source,
        bondsVisible: params.source !== "none",
        vdwScale: params.vdwScale,
      };
    case "set_bond_scale":
      return { ...state, bondScale: params.scale };
    case "set_bond_opacity":
      return { ...state, bondOpacity: params.opacity };
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
 * Execute the pipeline by topologically sorting the graph
 * and folding node parameters into a RenderState.
 * Disabled nodes are skipped.
 */
export function executePipeline(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
): RenderState {
  const sortedIds = topologicalSort(nodes, edges);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  let state = { ...DEFAULT_RENDER_STATE };

  for (const id of sortedIds) {
    const node = nodeMap.get(id);
    if (!node) continue;
    const data = node.data;
    if (!data.enabled) continue;
    state = applyNode(state, data.params);
  }

  return state;
}
