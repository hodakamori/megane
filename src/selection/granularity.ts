/**
 * Utilities for expanding a picked atom index to a set of atoms based on
 * selection granularity (atom / residue / chain / secondary-structure unit).
 */

import type { Snapshot, SelectionGranularity } from "../types";

/**
 * Expand a single atom index to the full set of atoms that match the
 * requested granularity.  Returns a sorted array of unique atom indices.
 */
export function expandSelection(
  atomIndex: number,
  granularity: SelectionGranularity,
  snapshot: Snapshot,
): number[] {
  if (granularity === "atom") return [atomIndex];

  const n = snapshot.nAtoms;

  if (granularity === "chain") {
    const chainIds = snapshot.atomChainIds;
    if (!chainIds) return [atomIndex];
    const target = chainIds[atomIndex];
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      if (chainIds[i] === target) result.push(i);
    }
    return result;
  }

  if (granularity === "residue") {
    const resNums = snapshot.atomResNums;
    const chainIds = snapshot.atomChainIds;
    if (!resNums) return [atomIndex];
    const targetRes = resNums[atomIndex];
    const targetChain = chainIds ? chainIds[atomIndex] : 0;
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      const sameRes = resNums[i] === targetRes;
      const sameChain = !chainIds || chainIds[i] === targetChain;
      if (sameRes && sameChain) result.push(i);
    }
    return result;
  }

  if (granularity === "ss") {
    // Expand to all atoms whose Cα belongs to the same SS run as the picked atom's Cα.
    const caIndices = snapshot.caIndices;
    const caSsType = snapshot.caSsType;
    const caResNums = snapshot.caResNums;
    const caChainIds = snapshot.caChainIds;
    const atomResNums = snapshot.atomResNums;
    const atomChainIds = snapshot.atomChainIds;

    if (!caIndices || !caSsType || !atomResNums || !caResNums) {
      return expandSelection(atomIndex, "residue", snapshot);
    }

    // Find which Cα corresponds to the picked atom (same residue + chain)
    const targetRes = atomResNums[atomIndex];
    const targetChain = atomChainIds ? atomChainIds[atomIndex] : 0;
    let targetSs = 0; // default coil
    let targetCaIdx = -1;
    for (let c = 0; c < caIndices.length; c++) {
      const sameRes = caResNums[c] === targetRes;
      const sameChain = !caChainIds || caChainIds[c] === targetChain;
      if (sameRes && sameChain) {
        targetSs = caSsType[c];
        targetCaIdx = c;
        break;
      }
    }

    if (targetCaIdx < 0 || targetSs === 0) {
      // Coil: just return the residue
      return expandSelection(atomIndex, "residue", snapshot);
    }

    // Collect all Cα indices in the same SS segment (contiguous run of same ss type in same chain)
    const ssResSet = new Set<number>();
    // Walk outward from targetCaIdx collecting same-chain same-ssType Cα
    for (let c = 0; c < caIndices.length; c++) {
      const sameChain = !caChainIds || caChainIds[c] === targetChain;
      if (sameChain && caSsType[c] === targetSs) {
        ssResSet.add(caResNums[c]);
      }
    }

    // Collect all atoms whose residue is in ssResSet and same chain
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      const sameChain = !atomChainIds || atomChainIds[i] === targetChain;
      if (sameChain && ssResSet.has(atomResNums[i])) result.push(i);
    }
    return result.length > 0 ? result : [atomIndex];
  }

  return [atomIndex];
}

/**
 * Toggle a set of atoms into/out of an existing selection.
 * If all atoms in `toToggle` are already selected, they are removed.
 * Otherwise they are added (additive / shift-click behaviour).
 */
export function toggleAtoms(current: number[], toToggle: number[]): number[] {
  const currentSet = new Set(current);
  const allPresent = toToggle.every((a) => currentSet.has(a));
  if (allPresent) {
    toToggle.forEach((a) => currentSet.delete(a));
  } else {
    toToggle.forEach((a) => currentSet.add(a));
  }
  return Array.from(currentSet).sort((a, b) => a - b);
}
