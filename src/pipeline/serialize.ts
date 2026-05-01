/**
 * Pipeline serialization / deserialization.
 * Converts between xyflow nodes/edges and the JSON format (version 2).
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";
import type { SerializedPipeline, PipelineNodeType } from "./types";
import { defaultParams } from "./types";

const VALID_NODE_TYPES: Set<string> = new Set([
  "load_structure",
  "load_trajectory",
  "load_vector",
  "streaming",
  "add_bond",
  "viewport",
  "filter",
  "modify",
  "label_generator",
  "polyhedron_generator",
  "vector_overlay",
]);

/**
 * Serialize xyflow nodes and edges into the portable JSON format.
 */
export function serializePipeline(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
): SerializedPipeline {
  return {
    version: 3,
    nodes: nodes.map((n) => {
      // Strip ephemeral (non-serializable) fields from params
      const { bondFileData, ...params } = n.data.params as typeof n.data.params & {
        bondFileData?: unknown;
      };
      return {
        ...params,
        id: n.id,
        position: n.position,
        enabled: n.data.enabled,
      };
    }),
    edges: edges.map((e) => ({
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? "",
      targetHandle: e.targetHandle ?? "",
    })),
  };
}

/**
 * Deserialize the portable JSON format into xyflow nodes and edges.
 *
 * Also normalizes the graph to the canonical "LoadStructure → AddBond →
 * Viewport" shape: if the saved pipeline lacks an AddBond node connecting a
 * LoadStructure to the Viewport, one is injected with the standard wiring
 * (particle, cell, bond, and — when the loader carries a trajectory —
 * trajectory edges). This guards against older / hand-written .megane.json
 * files that only wired LoadStructure.particle → Viewport.particle and
 * therefore rendered without bonds.
 */
export function deserializePipeline(json: SerializedPipeline): {
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
} {
  if (json.version !== 3) {
    throw new Error(`Unsupported pipeline version: ${json.version}`);
  }

  const nodes: Node<PipelineNodeData>[] = json.nodes.map((serialized) => {
    if (!VALID_NODE_TYPES.has(serialized.type)) {
      throw new Error(`Unknown node type: ${serialized.type}`);
    }
    const nodeType = serialized.type as PipelineNodeType;
    const defaults = defaultParams(nodeType);
    const { id, position, enabled, ...paramFields } = serialized;
    const params = { ...defaults, ...paramFields, type: nodeType } as typeof defaults;

    return {
      id,
      type: nodeType,
      position: position ?? { x: 0, y: 0 },
      data: {
        params,
        enabled: enabled !== false,
      },
    };
  });

  const edges: Edge[] = (json.edges ?? []).map((e, i) => ({
    id: `e-${e.source}-${e.sourceHandle}-${e.target}-${e.targetHandle}-${i}`,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle || null,
    targetHandle: e.targetHandle || null,
  }));

  return normalizePipeline(nodes, edges);
}

/**
 * Ensure the deserialized graph has the canonical
 * `LoadStructure → AddBond → Viewport` shape.
 *
 * For every (loader, viewport) pair where loader.particle reaches viewport
 * (directly or via filter/modify chains), this helper guarantees:
 *   - an AddBond node is wired in (loader.particle → addbond.particle,
 *     addbond.bond → viewport.bond);
 *   - the viewport receives loader.cell on the cell port;
 *   - the viewport receives loader.trajectory on the trajectory port iff
 *     the loader was saved with `hasTrajectory: true`.
 *
 * Existing edges and nodes are never removed; we only add what is missing.
 */
function normalizePipeline(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
): { nodes: Node<PipelineNodeData>[]; edges: Edge[] } {
  const loaders = nodes.filter((n) => n.type === "load_structure");
  const viewports = nodes.filter((n) => n.type === "viewport");
  if (loaders.length === 0 || viewports.length === 0) {
    return { nodes, edges };
  }

  const outNodes = [...nodes];
  const outEdges = [...edges];
  const usedIds = new Set(outNodes.map((n) => n.id));

  function uniqueId(prefix: string): string {
    let i = 1;
    while (usedIds.has(`${prefix}-${i}`)) i++;
    const id = `${prefix}-${i}`;
    usedIds.add(id);
    return id;
  }

  function hasEdge(
    source: string,
    sourceHandle: string,
    target: string,
    targetHandle: string,
  ): boolean {
    return outEdges.some(
      (e) =>
        e.source === source &&
        (e.sourceHandle ?? "") === sourceHandle &&
        e.target === target &&
        (e.targetHandle ?? "") === targetHandle,
    );
  }

  function pushEdge(
    source: string,
    sourceHandle: string,
    target: string,
    targetHandle: string,
  ): void {
    if (hasEdge(source, sourceHandle, target, targetHandle)) return;
    outEdges.push({
      id: `e-${source}-${sourceHandle}-${target}-${targetHandle}-norm`,
      source,
      target,
      sourceHandle,
      targetHandle,
    });
  }

  for (const loader of loaders) {
    // Match this loader to the first viewport its particle ultimately
    // feeds. We follow filter/modify chains so user-customised graphs
    // aren't double-wired.
    const reach = findReachableViewport(outNodes, outEdges, loader.id, viewports);
    if (!reach) continue;
    const { viewport, particleConnected } = reach;

    // Existing AddBond node consuming this loader's particles?
    let addBondId: string | null = null;
    for (const e of outEdges) {
      if (e.source !== loader.id) continue;
      if ((e.sourceHandle ?? "") !== "particle") continue;
      const target = outNodes.find((n) => n.id === e.target);
      if (target?.type === "add_bond") {
        addBondId = target.id;
        break;
      }
    }

    if (!addBondId) {
      addBondId = uniqueId("addbond");
      const params = defaultParams("add_bond");
      outNodes.push({
        id: addBondId,
        type: "add_bond",
        position: {
          x: loader.position.x,
          y: loader.position.y + 255,
        },
        data: { params, enabled: true },
      });
      pushEdge(loader.id, "particle", addBondId, "particle");
    }

    pushEdge(addBondId, "bond", viewport.id, "bond");
    // Only add the direct loader.particle → viewport.particle edge when the
    // loader doesn't already reach the viewport via a particle path
    // (filter / modify chain). Otherwise we'd double-render the unfiltered
    // particle stream alongside the user's filtered subset.
    if (!particleConnected) {
      pushEdge(loader.id, "particle", viewport.id, "particle");
    }
    pushEdge(loader.id, "cell", viewport.id, "cell");

    const loaderParams = loader.data.params as { hasTrajectory?: boolean };
    if (loaderParams.hasTrajectory) {
      pushEdge(loader.id, "trajectory", viewport.id, "trajectory");
    }
  }

  return { nodes: outNodes, edges: outEdges };
}

/**
 * Walk the particle graph forward from `loaderId` (transparently traversing
 * filter/modify nodes) and return the first viewport reachable via a
 * particle edge, plus a flag indicating whether such a path actually
 * exists. When no path exists we fall back to the first viewport so the
 * bond/cell/trajectory ports can still be wired up.
 */
function findReachableViewport(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
  loaderId: string,
  viewports: Node<PipelineNodeData>[],
): { viewport: Node<PipelineNodeData>; particleConnected: boolean } | null {
  const viewportIds = new Set(viewports.map((v) => v.id));
  const visited = new Set<string>([loaderId]);
  const stack: string[] = [loaderId];
  while (stack.length > 0) {
    const id = stack.pop()!;
    for (const e of edges) {
      if (e.source !== id) continue;
      // Only follow particle-bearing edges (particle / filter "out" / modify "out").
      const sh = e.sourceHandle ?? "";
      if (sh !== "particle" && sh !== "out") continue;
      if (viewportIds.has(e.target)) {
        // Only count as "particle-connected" if the destination port on
        // the viewport is actually `particle` — a stray edge into another
        // viewport input doesn't satisfy the canonical wiring.
        const th = e.targetHandle ?? "";
        const viewport = viewports.find((v) => v.id === e.target) ?? null;
        if (!viewport) continue;
        if (th === "particle") {
          return { viewport, particleConnected: true };
        }
        continue;
      }
      const tgt = nodes.find((n) => n.id === e.target);
      if (!tgt) continue;
      if (tgt.type !== "filter" && tgt.type !== "modify") continue;
      if (!visited.has(tgt.id)) {
        visited.add(tgt.id);
        stack.push(tgt.id);
      }
    }
  }
  return viewports[0] ? { viewport: viewports[0], particleConnected: false } : null;
}
