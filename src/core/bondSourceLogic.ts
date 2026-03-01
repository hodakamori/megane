/**
 * Shared bond source logic used by both useMeganeLocal and useMeganeWebSocket.
 */

import { inferBondsVdw, parseTopBonds, parsePdbBonds } from "./parsers/structure";
import type { Snapshot, BondSource } from "./types";

/** Rebuild a snapshot with different bonds. */
export function withBonds(
  base: Snapshot,
  bonds: Uint32Array,
  bondOrders: Uint8Array | null,
): Snapshot {
  return {
    ...base,
    nBonds: bonds.length / 2,
    bonds,
    bondOrders,
  };
}

/** Mutable refs that both hooks share for bond caching. */
export interface BondSourceRefs {
  baseSnapshot: Snapshot | null;
  fileBonds: Uint32Array | null;
  vdwBonds: Uint32Array | null;
}

/**
 * Compute the snapshot for a given bond source.
 * Returns the new snapshot, or null if no change is needed (e.g. "none").
 */
export async function computeBondsForSource(
  source: BondSource,
  refs: BondSourceRefs,
): Promise<Snapshot | null> {
  const base = refs.baseSnapshot;
  if (!base) return null;
  if (source === "none") return null;

  switch (source) {
    case "structure":
      return base;
    case "file":
      if (refs.fileBonds) {
        return withBonds(base, refs.fileBonds, null);
      }
      return withBonds(base, new Uint32Array(0), null);
    case "distance": {
      if (!refs.vdwBonds) {
        refs.vdwBonds = await inferBondsVdw(
          base.positions,
          base.elements,
          base.nAtoms,
        );
      }
      return withBonds(base, refs.vdwBonds, null);
    }
  }
}

/**
 * Parse a bond file (.pdb or .top) and return the bond array and file name.
 */
export async function loadBondFileData(
  file: File,
  nAtoms: number,
): Promise<{ bonds: Uint32Array; fileName: string }> {
  const text = await file.text();
  const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";

  let bonds: Uint32Array;
  if (ext === ".top") {
    bonds = await parseTopBonds(text, nAtoms);
  } else {
    bonds = await parsePdbBonds(text, nAtoms);
  }

  return { bonds, fileName: file.name };
}
