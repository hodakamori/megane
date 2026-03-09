import type {
  PipelineData,
  ParticleData,
  BondData,
  AddBondParams,
} from "../types";
import { inferBondsVdwJS } from "../../parsers/inferBondsJS";

/**
 * Filter out bonds that cross periodic boundary conditions.
 * Uses raw Cartesian distance: if the distance between two bonded atoms
 * exceeds half the shortest cell vector length, the bond spans the cell
 * and is suppressed. No filtering when box is unavailable.
 */
function filterPbcBonds(
  bondIndices: Uint32Array,
  bondOrders: Uint8Array | null,
  positions: Float32Array,
  box: Float32Array | null,
): { bondIndices: Uint32Array; bondOrders: Uint8Array | null; nBonds: number } {
  if (!box || !box.some((v) => v !== 0)) {
    return { bondIndices, bondOrders, nBonds: bondIndices.length / 2 };
  }

  // Compute cell vector lengths, threshold = half the shortest
  const lenA = Math.sqrt(box[0] * box[0] + box[1] * box[1] + box[2] * box[2]);
  const lenB = Math.sqrt(box[3] * box[3] + box[4] * box[4] + box[5] * box[5]);
  const lenC = Math.sqrt(box[6] * box[6] + box[7] * box[7] + box[8] * box[8]);
  const half = Math.min(lenA, lenB, lenC) / 2;
  const thresholdSq = half * half;

  const nBondsIn = bondIndices.length / 2;
  const filteredIndices = new Uint32Array(bondIndices.length);
  const filteredOrders = bondOrders ? new Uint8Array(bondOrders.length) : null;
  let count = 0;

  for (let b = 0; b < nBondsIn; b++) {
    const i = bondIndices[b * 2];
    const j = bondIndices[b * 2 + 1];
    const dx = positions[j * 3] - positions[i * 3];
    const dy = positions[j * 3 + 1] - positions[i * 3 + 1];
    const dz = positions[j * 3 + 2] - positions[i * 3 + 2];
    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq > thresholdSq) continue;

    filteredIndices[count * 2] = i;
    filteredIndices[count * 2 + 1] = j;
    if (filteredOrders && bondOrders) {
      filteredOrders[count] = bondOrders[b];
    }
    count++;
  }

  return {
    bondIndices: filteredIndices.subarray(0, count * 2),
    bondOrders: filteredOrders ? filteredOrders.subarray(0, count) : null,
    nBonds: count,
  };
}

export function executeAddBond(
  params: AddBondParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particleData = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particleData) return outputs;

  const snapshot = particleData.source;

  if (params.bondSource === "structure") {
    if (snapshot.nFileBonds > 0) {
      let bondIndices = snapshot.bonds;
      let bondOrders = snapshot.bondOrders;
      let nBonds = snapshot.nBonds;

      if (params.suppressPbcBonds) {
        const filtered = filterPbcBonds(bondIndices, bondOrders, snapshot.positions, snapshot.box);
        bondIndices = filtered.bondIndices;
        bondOrders = filtered.bondOrders;
        nBonds = filtered.nBonds;
      }

      if (nBonds > 0) {
        const bond: BondData = {
          type: "bond",
          bondIndices,
          bondOrders,
          nBonds,
          scale: 1.0,
          opacity: 1.0,
        };
        outputs.set("bond", bond);
      }
    }
  } else if (params.bondSource === "distance") {
    let bondIndices = inferBondsVdwJS(
      snapshot.positions,
      snapshot.elements,
      snapshot.nAtoms,
      0.6,
    );

    if (bondIndices.length > 0) {
      let nBonds = bondIndices.length / 2;

      if (params.suppressPbcBonds) {
        const filtered = filterPbcBonds(bondIndices, null, snapshot.positions, snapshot.box);
        bondIndices = filtered.bondIndices;
        nBonds = filtered.nBonds;
      }

      if (nBonds > 0) {
        const bond: BondData = {
          type: "bond",
          bondIndices,
          bondOrders: null,
          nBonds,
          scale: 1.0,
          opacity: 1.0,
        };
        outputs.set("bond", bond);
      }
    }
  }

  return outputs;
}
