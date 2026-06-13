/**
 * Builds a compact, human-readable summary of the structure the user currently
 * has loaded, for injection into the LLM system prompt. Knowing the real
 * element symbols and residue names present lets the model generate accurate
 * `filter` queries instead of guessing (the #1 cause of bad selections).
 */

import type { Snapshot } from "../types";
import { getElementSymbol } from "../constants";
import { parseResname } from "../pipeline/selection";

/** Cap the resname list so a huge structure doesn't blow up the prompt. */
const MAX_RESNAMES = 50;

/**
 * Summarize a loaded structure as a short markdown block, or `null` when no
 * structure is loaded (so the caller can omit the section entirely).
 *
 * The summary lists: atom count and index range, the element symbols present
 * (with per-element counts), the residue names present (unique, capped), the
 * chain IDs present, and whether a unit cell and bonds are available — exactly
 * the facts a `filter` query can reference.
 */
export function summarizeStructure(
  snapshot: Snapshot | null,
  atomLabels: string[] | null,
): string | null {
  if (!snapshot || snapshot.nAtoms === 0) return null;

  const lines: string[] = [];
  lines.push(`- Atoms: ${snapshot.nAtoms} (index 0..${snapshot.nAtoms - 1})`);

  // Elements present, with counts, sorted by descending count.
  const elementCounts = new Map<string, number>();
  for (let i = 0; i < snapshot.nAtoms; i++) {
    const sym = getElementSymbol(snapshot.elements[i]);
    elementCounts.set(sym, (elementCounts.get(sym) ?? 0) + 1);
  }
  const elementList = [...elementCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([sym, n]) => `${sym} (${n})`)
    .join(", ");
  lines.push(`- Elements present: ${elementList}`);

  // Residue names present (unique). Only available when atom labels are loaded.
  if (atomLabels && atomLabels.length > 0) {
    const resnames = new Set<string>();
    const limit = Math.min(atomLabels.length, snapshot.nAtoms);
    for (let i = 0; i < limit; i++) {
      const label = atomLabels[i];
      if (label) resnames.add(parseResname(label));
    }
    if (resnames.size > 0) {
      const all = [...resnames].sort();
      const shown = all.slice(0, MAX_RESNAMES);
      const suffix = all.length > MAX_RESNAMES ? `, … (${all.length - MAX_RESNAMES} more)` : "";
      lines.push(`- Residue names present: ${shown.join(", ")}${suffix}`);
    }
  }

  // Chain IDs present (ASCII bytes → characters).
  if (snapshot.atomChainIds && snapshot.atomChainIds.length > 0) {
    const chains = new Set<string>();
    for (const code of snapshot.atomChainIds) {
      if (code !== 0) chains.add(String.fromCharCode(code));
    }
    if (chains.size > 0) {
      lines.push(`- Chains present: ${[...chains].sort().join(", ")}`);
    }
  }

  lines.push(`- Unit cell: ${snapshot.box ? "yes" : "no"}`);
  lines.push(`- Bonds: ${snapshot.nBonds}`);

  return lines.join("\n");
}
