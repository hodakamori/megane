/**
 * Post-generation validation of a SerializedPipeline's selection queries, plus
 * a repair-prompt builder. The LLM frequently emits `filter` queries that use
 * unsupported syntax (VMD/PyMOL idioms, unquoted strings, etc.); these parse to
 * "select all" or throw at runtime, silently breaking the selection. We catch
 * them up front with the same validators the Filter node UI uses, then ask the
 * model to fix only the broken queries.
 */

import type { SerializedPipeline } from "../pipeline/types";
import { validateQuery, validateBondQuery } from "../pipeline/selection";

/**
 * Validate every `filter` node's `query` / `bond_query` against the selection
 * DSL grammar. Returns a list of human-readable error strings (one per invalid
 * query), or an empty array when all queries are syntactically valid.
 */
export function collectQueryErrors(pipeline: SerializedPipeline): string[] {
  const errors: string[] = [];
  for (const node of pipeline.nodes) {
    if (node.type !== "filter") continue;
    const n = node as { id: string; query?: unknown; bond_query?: unknown };

    if (typeof n.query === "string") {
      const r = validateQuery(n.query);
      if (!r.valid) {
        errors.push(`node "${n.id}" query \`${n.query}\`: ${r.error ?? "invalid query"}`);
      }
    }

    if (typeof n.bond_query === "string" && n.bond_query.trim() !== "") {
      const r = validateBondQuery(n.bond_query);
      if (!r.valid) {
        errors.push(
          `node "${n.id}" bond_query \`${n.bond_query}\`: ${r.error ?? "invalid bond query"}`,
        );
      }
    }
  }
  return errors;
}

/**
 * Build a follow-up user message asking the model to fix the invalid selection
 * queries it just produced. Includes the original request, the broken pipeline,
 * and the specific errors so the model can correct only what's wrong.
 */
export function buildRepairPrompt(
  originalRequest: string,
  brokenPipeline: SerializedPipeline,
  errors: string[],
): string {
  return [
    "The pipeline you generated has invalid filter selection queries.",
    "Only the megane selection DSL documented in the system prompt is supported",
    "(fields element/index/x/y/z/resname/mass, quoted string values, and/or/not).",
    "",
    "Errors:",
    ...errors.map((e) => `- ${e}`),
    "",
    `Original request: ${originalRequest}`,
    "",
    "Here is the pipeline you produced:",
    "```json",
    JSON.stringify(brokenPipeline),
    "```",
    "",
    "Return the corrected pipeline as a single JSON code block first, fixing the",
    "invalid queries (rewrite them using only the supported DSL), then one short",
    "sentence describing what it does.",
  ].join("\n");
}
