/**
 * Builds a compact, human-readable summary of the structure the user currently
 * has loaded, for injection into the LLM system prompt. Knowing the real
 * element symbols and residue names present lets the model generate accurate
 * `filter` queries instead of guessing (the #1 cause of bad selections).
 *
 * The same underlying facts (`getStructureFacts`) drive the Selection Inspector
 * UI, which turns them into clickable element/residue/chain chips so the user
 * never has to type a raw expression against values they can't see.
 */

import type { Snapshot } from "../types";
import { getElementSymbol } from "../constants";
import { parseResname } from "../pipeline/selection";

/** Cap the resname list so a huge structure doesn't blow up the prompt. */
const MAX_RESNAMES = 50;

/** One element symbol and how many atoms carry it. */
export interface ElementFact {
  symbol: string;
  count: number;
}

/**
 * Structured facts about a loaded structure — the values a `filter` query (and
 * the Inspector chip UI) can reference. Element counts are sorted descending;
 * resnames and chains are sorted ascending and de-duplicated.
 */
export interface StructureFacts {
  nAtoms: number;
  /** Element symbols present with per-element counts, most common first. */
  elements: ElementFact[];
  /** Unique residue names present (empty when no labels are loaded). */
  resnames: string[];
  /** Unique chain IDs present (empty when the format carries no chain info). */
  chains: string[];
  hasCell: boolean;
  nBonds: number;
}

/**
 * Extract structured facts from a loaded structure, or `null` when nothing is
 * loaded. Shared by the LLM prompt summary and the Inspector's selection chips.
 */
export function getStructureFacts(
  snapshot: Snapshot | null,
  atomLabels: string[] | null,
): StructureFacts | null {
  if (!snapshot || snapshot.nAtoms === 0) return null;

  // Elements present, with counts, sorted by descending count.
  const elementCounts = new Map<string, number>();
  for (let i = 0; i < snapshot.nAtoms; i++) {
    const sym = getElementSymbol(snapshot.elements[i]);
    elementCounts.set(sym, (elementCounts.get(sym) ?? 0) + 1);
  }
  const elements: ElementFact[] = [...elementCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([symbol, count]) => ({ symbol, count }));

  // Residue names present (unique). Only available when atom labels are loaded.
  const resnameSet = new Set<string>();
  if (atomLabels && atomLabels.length > 0) {
    const limit = Math.min(atomLabels.length, snapshot.nAtoms);
    for (let i = 0; i < limit; i++) {
      const label = atomLabels[i];
      if (label) resnameSet.add(parseResname(label));
    }
  }
  const resnames = [...resnameSet].sort();

  // Chain IDs present (ASCII bytes → characters; 0 = no chain).
  const chainSet = new Set<string>();
  if (snapshot.atomChainIds && snapshot.atomChainIds.length > 0) {
    for (const code of snapshot.atomChainIds) {
      if (code !== 0) chainSet.add(String.fromCharCode(code));
    }
  }
  const chains = [...chainSet].sort();

  return {
    nAtoms: snapshot.nAtoms,
    elements,
    resnames,
    chains,
    hasCell: snapshot.box != null,
    nBonds: snapshot.nBonds,
  };
}

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
  const facts = getStructureFacts(snapshot, atomLabels);
  if (!facts) return null;

  const lines: string[] = [];
  lines.push(`- Atoms: ${facts.nAtoms} (index 0..${facts.nAtoms - 1})`);

  const elementList = facts.elements.map((e) => `${e.symbol} (${e.count})`).join(", ");
  lines.push(`- Elements present: ${elementList}`);

  if (facts.resnames.length > 0) {
    const shown = facts.resnames.slice(0, MAX_RESNAMES);
    const suffix =
      facts.resnames.length > MAX_RESNAMES
        ? `, … (${facts.resnames.length - MAX_RESNAMES} more)`
        : "";
    lines.push(`- Residue names present: ${shown.join(", ")}${suffix}`);
  }

  if (facts.chains.length > 0) {
    lines.push(`- Chains present: ${facts.chains.join(", ")}`);
  }

  lines.push(`- Unit cell: ${facts.hasCell ? "yes" : "no"}`);
  lines.push(`- Bonds: ${facts.nBonds}`);

  return lines.join("\n");
}
