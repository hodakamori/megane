/**
 * Structural validation of a generated SerializedPipeline. Complements the
 * selection-query validation in validatePipeline.ts: where that checks the DSL
 * inside filter nodes, this checks the *shape* of the graph the LLM produced
 * (known node types, well-formed positions, exactly one viewport, edges that
 * reference real nodes). Errors feed the same repair round trip.
 *
 * Implemented as a small hand-rolled validator rather than pulling in a JSON
 * Schema library — it keeps the dependency footprint flat and emits the same
 * `node "<id>": <reason>` style messages as collectQueryErrors so the repair
 * prompt reads uniformly.
 */

import type { SerializedPipeline } from "../pipeline/types";
import { NODE_TYPE_LABELS } from "../pipeline/types";

/** The set of valid node `type` strings, sourced from the type-label record. */
const KNOWN_NODE_TYPES = new Set(Object.keys(NODE_TYPE_LABELS));

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

/**
 * Validate the structure of a pipeline. Returns a list of human-readable error
 * strings (empty when the graph is well-formed). Assumes the caller already
 * confirmed `version: 3` with `nodes`/`edges` arrays (see isSerializedPipeline
 * in client.ts); re-checks defensively so it is safe to call standalone.
 */
export function collectSchemaErrors(pipeline: SerializedPipeline): string[] {
  const errors: string[] = [];

  if (pipeline.version !== 3) {
    errors.push(`pipeline version must be 3 (got ${JSON.stringify(pipeline.version)})`);
  }
  if (!Array.isArray(pipeline.nodes) || !Array.isArray(pipeline.edges)) {
    errors.push("pipeline must have `nodes` and `edges` arrays");
    return errors; // can't validate further without the arrays
  }

  const nodeIds = new Set<string>();
  let viewportCount = 0;

  pipeline.nodes.forEach((node, i) => {
    const n = node as {
      id?: unknown;
      type?: unknown;
      position?: unknown;
    };
    const where = typeof n.id === "string" && n.id ? `node "${n.id}"` : `node[${i}]`;

    if (typeof n.id !== "string" || n.id === "") {
      errors.push(`${where}: missing string "id"`);
    } else if (nodeIds.has(n.id)) {
      errors.push(`${where}: duplicate node id`);
    } else {
      nodeIds.add(n.id);
    }

    if (typeof n.type !== "string" || !KNOWN_NODE_TYPES.has(n.type)) {
      errors.push(`${where}: unknown node type ${JSON.stringify(n.type)}`);
    } else if (n.type === "viewport") {
      viewportCount++;
    }

    const pos = n.position as { x?: unknown; y?: unknown } | undefined;
    if (!pos || !isFiniteNumber(pos.x) || !isFiniteNumber(pos.y)) {
      errors.push(`${where}: "position" must have numeric x and y`);
    }
  });

  if (viewportCount === 0) {
    errors.push("pipeline must contain exactly one viewport node (found none)");
  } else if (viewportCount > 1) {
    errors.push(`pipeline must contain exactly one viewport node (found ${viewportCount})`);
  }

  pipeline.edges.forEach((edge, i) => {
    const e = edge as {
      source?: unknown;
      target?: unknown;
      sourceHandle?: unknown;
      targetHandle?: unknown;
    };
    const where = `edge[${i}]`;

    for (const key of ["source", "target", "sourceHandle", "targetHandle"] as const) {
      if (typeof e[key] !== "string" || e[key] === "") {
        errors.push(`${where}: missing string "${key}"`);
      }
    }

    if (typeof e.source === "string" && e.source && !nodeIds.has(e.source)) {
      errors.push(`${where}: source "${e.source}" does not reference an existing node`);
    }
    if (typeof e.target === "string" && e.target && !nodeIds.has(e.target)) {
      errors.push(`${where}: target "${e.target}" does not reference an existing node`);
    }
  });

  return errors;
}
