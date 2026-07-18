/**
 * Pure helpers that turn Inspector UI choices — element/residue/chain chips, a
 * distance radius, or a clicked atom — into selection-DSL expression strings
 * (see `selection.ts`). Kept separate from React so they can be unit-tested and
 * reused by both the chip builder and the 3D click "quick expand" actions.
 */

/** Wrap a value in the double quotes the DSL requires for string comparisons. */
export function quoteValue(v: string): string {
  return `"${v.replace(/"/g, '\\"')}"`;
}

/**
 * Build an OR-group comparing `field` against each value, e.g.
 * `element == "C"` for one value or `(element == "C" or element == "N")` for
 * several. Returns "" for an empty value list.
 */
export function orGroup(field: string, values: string[]): string {
  if (values.length === 0) return "";
  const terms = values.map((v) => `${field} == ${quoteValue(v)}`);
  if (terms.length === 1) return terms[0];
  return `(${terms.join(" or ")})`;
}

export interface ChipQueryInput {
  elements?: string[];
  resnames?: string[];
  chains?: string[];
  /** When set (and the base selection is non-empty), wrap it in `within R of (...)`. */
  withinRadius?: number | null;
}

/**
 * Compose a selection query from chip selections. Non-empty category groups are
 * AND-ed together; an optional radius expands the whole selection via `within`.
 * Returns "" when nothing is selected (meaning "all atoms").
 */
export function buildQueryFromChips(input: ChipQueryInput): string {
  const groups: string[] = [];
  const elems = orGroup("element", input.elements ?? []);
  if (elems) groups.push(elems);
  const res = orGroup("resname", input.resnames ?? []);
  if (res) groups.push(res);
  const chains = orGroup("chain", input.chains ?? []);
  if (chains) groups.push(chains);

  const base = groups.join(" and ");
  if (!base) return "";
  const r = input.withinRadius;
  if (r != null && Number.isFinite(r) && r > 0) {
    return `within ${r} of (${base})`;
  }
  return base;
}

/** Which per-atom property a "quick expand" click selects by. */
export type QuickSelectKind = "element" | "resname" | "chain" | "molecule" | "index";

/** Facts about a clicked atom, used to synthesize a quick-select expression. */
export interface ClickedAtom {
  index: number;
  element: string;
  resname?: string | null;
  chain?: string | null;
  moleculeId?: number | null;
}

/**
 * Build an expression selecting atoms that share a property with the clicked
 * atom (or just the atom itself for "index"). Returns "" when the requested
 * property is unavailable for that atom.
 */
export function quickSelectExpression(kind: QuickSelectKind, atom: ClickedAtom): string {
  switch (kind) {
    case "element":
      return atom.element ? `element == ${quoteValue(atom.element)}` : "";
    case "resname":
      return atom.resname ? `resname == ${quoteValue(atom.resname)}` : "";
    case "chain":
      return atom.chain ? `chain == ${quoteValue(atom.chain)}` : "";
    case "molecule":
      return atom.moleculeId != null ? `molecule_id == ${atom.moleculeId}` : "";
    case "index":
      return `index == ${atom.index}`;
  }
}

/** Build an `index == a or index == b ...` expression from a set of indices. */
export function indicesToExpression(indices: number[]): string {
  const uniq = [...new Set(indices)].sort((a, b) => a - b);
  if (uniq.length === 0) return "none";
  return uniq.map((i) => `index == ${i}`).join(" or ");
}
