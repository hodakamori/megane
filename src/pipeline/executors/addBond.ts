import type {
  PipelineData,
  ParticleData,
  BondData,
  AddBondParams,
} from "../types";
import { inferBondsVdwJS } from "../../parsers/inferBondsJS";
import { invert3x3 } from "./mathUtils";

/**
 * Result of PBC bond processing: normal bonds kept as-is,
 * PBC-crossing bonds replaced with half-bonds to ghost atoms.
 */
interface PbcBondResult {
  bondIndices: Uint32Array;
  bondOrders: Uint8Array | null;
  nBonds: number;
  // Extended positions/elements including ghost atoms (null when no PBC bonds)
  positions: Float32Array | null;
  elements: Uint8Array | null;
  nAtoms: number;
}

/**
 * Process bonds for periodic boundary conditions (OVITO-style).
 *
 * Bonds that cross PBC are replaced with two half-bonds:
 * - atom A → ghost position of B (minimum-image near A)
 * - atom B → ghost position of A (minimum-image near B)
 *
 * Ghost atoms are appended to positions/elements arrays so the existing
 * impostor bond renderer handles them without modification.
 */
export function processPbcBonds(
  bondIndices: Uint32Array,
  bondOrders: Uint8Array | null,
  positions: Float32Array,
  elements: Uint8Array,
  nAtoms: number,
  box: Float32Array | null,
): PbcBondResult {
  if (!box || !box.some((v) => v !== 0)) {
    return { bondIndices, bondOrders, nBonds: bondIndices.length / 2, positions: null, elements: null, nAtoms: 0 };
  }

  const boxInv = invert3x3(box);
  if (!boxInv) {
    return { bondIndices, bondOrders, nBonds: bondIndices.length / 2, positions: null, elements: null, nAtoms: 0 };
  }

  // Threshold: half the shortest cell vector length
  const lenA = Math.sqrt(box[0] * box[0] + box[1] * box[1] + box[2] * box[2]);
  const lenB = Math.sqrt(box[3] * box[3] + box[4] * box[4] + box[5] * box[5]);
  const lenC = Math.sqrt(box[6] * box[6] + box[7] * box[7] + box[8] * box[8]);
  const half = Math.min(lenA, lenB, lenC) / 2;
  const thresholdSq = half * half;

  const nBondsIn = bondIndices.length / 2;

  // First pass: count normal and PBC bonds
  let nNormal = 0;
  let nPbc = 0;
  for (let b = 0; b < nBondsIn; b++) {
    const i = bondIndices[b * 2];
    const j = bondIndices[b * 2 + 1];
    const dx = positions[j * 3] - positions[i * 3];
    const dy = positions[j * 3 + 1] - positions[i * 3 + 1];
    const dz = positions[j * 3 + 2] - positions[i * 3 + 2];
    if (dx * dx + dy * dy + dz * dz > thresholdSq) {
      nPbc++;
    } else {
      nNormal++;
    }
  }

  if (nPbc === 0) {
    // No PBC bonds — return original data unchanged
    return { bondIndices, bondOrders, nBonds: nBondsIn, positions: null, elements: null, nAtoms: 0 };
  }

  // Allocate: normal bonds + 2 half-bonds per PBC bond
  const totalBonds = nNormal + nPbc * 2;
  const outBonds = new Uint32Array(totalBonds * 2);
  const outOrders = bondOrders ? new Uint8Array(totalBonds) : null;

  // Ghost atoms: 2 per PBC bond
  const ghostPositions: number[] = [];
  const ghostElements: number[] = [];
  let ghostIdx = nAtoms;
  let outIdx = 0;

  for (let b = 0; b < nBondsIn; b++) {
    const i = bondIndices[b * 2];
    const j = bondIndices[b * 2 + 1];
    const dx = positions[j * 3] - positions[i * 3];
    const dy = positions[j * 3 + 1] - positions[i * 3 + 1];
    const dz = positions[j * 3 + 2] - positions[i * 3 + 2];
    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq <= thresholdSq) {
      // Normal bond — keep as-is
      outBonds[outIdx * 2] = i;
      outBonds[outIdx * 2 + 1] = j;
      if (outOrders && bondOrders) outOrders[outIdx] = bondOrders[b];
      outIdx++;
    } else {
      // PBC bond — compute minimum-image displacement
      // Convert to fractional coords
      let sx = boxInv[0] * dx + boxInv[3] * dy + boxInv[6] * dz;
      let sy = boxInv[1] * dx + boxInv[4] * dy + boxInv[7] * dz;
      let sz = boxInv[2] * dx + boxInv[5] * dy + boxInv[8] * dz;

      // Wrap to [-0.5, 0.5]
      sx -= Math.round(sx);
      sy -= Math.round(sy);
      sz -= Math.round(sz);

      // Convert back to Cartesian (minimum-image displacement)
      const dxMin = box[0] * sx + box[3] * sy + box[6] * sz;
      const dyMin = box[1] * sx + box[4] * sy + box[7] * sz;
      const dzMin = box[2] * sx + box[5] * sy + box[8] * sz;

      // Ghost B: minimum-image position of j near i
      ghostPositions.push(
        positions[i * 3] + dxMin,
        positions[i * 3 + 1] + dyMin,
        positions[i * 3 + 2] + dzMin,
      );
      ghostElements.push(elements[j]);
      outBonds[outIdx * 2] = i;
      outBonds[outIdx * 2 + 1] = ghostIdx;
      if (outOrders && bondOrders) outOrders[outIdx] = bondOrders[b];
      outIdx++;
      ghostIdx++;

      // Ghost A: minimum-image position of i near j
      ghostPositions.push(
        positions[j * 3] - dxMin,
        positions[j * 3 + 1] - dyMin,
        positions[j * 3 + 2] - dzMin,
      );
      ghostElements.push(elements[i]);
      outBonds[outIdx * 2] = j;
      outBonds[outIdx * 2 + 1] = ghostIdx;
      if (outOrders && bondOrders) outOrders[outIdx] = bondOrders[b];
      outIdx++;
      ghostIdx++;
    }
  }

  // Build extended positions and elements arrays
  const extPositions = new Float32Array(positions.length + ghostPositions.length);
  extPositions.set(positions);
  extPositions.set(new Float32Array(ghostPositions), positions.length);

  const extElements = new Uint8Array(elements.length + ghostElements.length);
  extElements.set(elements);
  extElements.set(new Uint8Array(ghostElements), elements.length);

  return {
    bondIndices: outBonds,
    bondOrders: outOrders,
    nBonds: totalBonds,
    positions: extPositions,
    elements: extElements,
    nAtoms: ghostIdx,
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
      let extPositions: Float32Array | null = null;
      let extElements: Uint8Array | null = null;
      let extNAtoms = 0;

      const result = processPbcBonds(
        bondIndices, bondOrders, snapshot.positions,
        snapshot.elements, snapshot.nAtoms, snapshot.box,
      );
      bondIndices = result.bondIndices;
      bondOrders = result.bondOrders;
      nBonds = result.nBonds;
      extPositions = result.positions;
      extElements = result.elements;
      extNAtoms = result.nAtoms;

      if (nBonds > 0) {
        const bond: BondData = {
          type: "bond",
          bondIndices,
          bondOrders,
          nBonds,
          scale: 1.0,
          opacity: 1.0,
          positions: extPositions,
          elements: extElements,
          nAtoms: extNAtoms,
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
      snapshot.box,
    );

    if (bondIndices.length > 0) {
      let nBonds = bondIndices.length / 2;
      let extPositions: Float32Array | null = null;
      let extElements: Uint8Array | null = null;
      let extNAtoms = 0;

      const result = processPbcBonds(
        bondIndices, null, snapshot.positions,
        snapshot.elements, snapshot.nAtoms, snapshot.box,
      );
      bondIndices = result.bondIndices;
      nBonds = result.nBonds;
      extPositions = result.positions;
      extElements = result.elements;
      extNAtoms = result.nAtoms;

      if (nBonds > 0) {
        const bond: BondData = {
          type: "bond",
          bondIndices,
          bondOrders: null,
          nBonds,
          scale: 1.0,
          opacity: 1.0,
          positions: extPositions,
          elements: extElements,
          nAtoms: extNAtoms,
        };
        outputs.set("bond", bond);
      }
    }
  }

  return outputs;
}
