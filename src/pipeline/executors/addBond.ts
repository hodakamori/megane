import type { PipelineData, ParticleData, BondData, AddBondParams } from "../types";
import { inferBondsVdwJS, DEFAULT_VDW_BOND_FACTOR } from "../../parsers/inferBondsJS";
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

interface DrawingSite {
  sourceIndex: number;
  dataIndex: number;
  shiftA: number;
  shiftB: number;
  shiftC: number;
}

function drawingSiteKey(source: number, a: number, b: number, c: number): string {
  return `${source}:${a}:${b}:${c}`;
}

/** Repeat an existing structural bond table over Drawing Boundary atom copies. */
function expandTopologyBondsForDrawingBoundary(
  particle: ParticleData,
  bondIndices: Uint32Array,
  bondOrders: Uint8Array | null,
): PbcBondResult {
  const boundary = particle.drawingBoundary!;
  const snapshot = particle.source;
  const positions = new Float32Array(snapshot.positions.length + boundary.images.positions.length);
  positions.set(snapshot.positions);
  positions.set(boundary.images.positions, snapshot.positions.length);
  const elements = new Uint8Array(snapshot.elements.length + boundary.images.elements.length);
  elements.set(snapshot.elements);
  elements.set(boundary.images.elements, snapshot.elements.length);

  const sitesByKey = new Map<string, DrawingSite>();
  const sitesBySource = new Map<number, DrawingSite[]>();
  const addSite = (site: DrawingSite) => {
    sitesByKey.set(drawingSiteKey(site.sourceIndex, site.shiftA, site.shiftB, site.shiftC), site);
    const sites = sitesBySource.get(site.sourceIndex) ?? [];
    sites.push(site);
    sitesBySource.set(site.sourceIndex, sites);
  };
  for (let atom = 0; atom < snapshot.nAtoms; atom++) {
    if (boundary.sourceVisibleMask[atom]) {
      addSite({ sourceIndex: atom, dataIndex: atom, shiftA: 0, shiftB: 0, shiftC: 0 });
    }
  }
  for (let image = 0; image < boundary.images.sourceIndices.length; image++) {
    const i3 = image * 3;
    addSite({
      sourceIndex: boundary.images.sourceIndices[image],
      dataIndex: snapshot.nAtoms + image,
      shiftA: boundary.images.latticeShifts[i3],
      shiftB: boundary.images.latticeShifts[i3 + 1],
      shiftC: boundary.images.latticeShifts[i3 + 2],
    });
  }

  const box = snapshot.box;
  const inverse = box ? invert3x3(box) : null;
  const expanded: number[] = [];
  const orders: number[] = [];
  const seen = new Set<string>();
  for (let bond = 0; bond < bondIndices.length / 2; bond++) {
    const sourceA = bondIndices[bond * 2];
    const sourceB = bondIndices[bond * 2 + 1];
    let relativeA = 0;
    let relativeB = 0;
    let relativeC = 0;
    if (box && inverse) {
      const dx = snapshot.positions[sourceB * 3] - snapshot.positions[sourceA * 3];
      const dy = snapshot.positions[sourceB * 3 + 1] - snapshot.positions[sourceA * 3 + 1];
      const dz = snapshot.positions[sourceB * 3 + 2] - snapshot.positions[sourceA * 3 + 2];
      const fx = inverse[0] * dx + inverse[3] * dy + inverse[6] * dz;
      const fy = inverse[1] * dx + inverse[4] * dy + inverse[7] * dz;
      const fz = inverse[2] * dx + inverse[5] * dy + inverse[8] * dz;
      relativeA = -Math.round(fx);
      relativeB = -Math.round(fy);
      relativeC = -Math.round(fz);
    }
    for (const siteA of sitesBySource.get(sourceA) ?? []) {
      const siteB = sitesByKey.get(
        drawingSiteKey(
          sourceB,
          siteA.shiftA + relativeA,
          siteA.shiftB + relativeB,
          siteA.shiftC + relativeC,
        ),
      );
      if (!siteB) continue;
      const key =
        siteA.dataIndex < siteB.dataIndex
          ? `${siteA.dataIndex}:${siteB.dataIndex}`
          : `${siteB.dataIndex}:${siteA.dataIndex}`;
      if (seen.has(key)) continue;
      seen.add(key);
      expanded.push(siteA.dataIndex, siteB.dataIndex);
      if (bondOrders) orders.push(bondOrders[bond]);
    }
  }
  return {
    bondIndices: new Uint32Array(expanded),
    bondOrders: bondOrders ? new Uint8Array(orders) : null,
    nBonds: expanded.length / 2,
    positions,
    elements,
    nAtoms: elements.length,
  };
}

/** Infer distance bonds directly among the atoms visible in Drawing Boundary. */
function inferDrawingBoundaryBonds(particle: ParticleData, vdwScale: number): PbcBondResult {
  const boundary = particle.drawingBoundary!;
  const snapshot = particle.source;
  const compactPositions: number[] = [];
  const compactElements: number[] = [];
  const dataIndices: number[] = [];
  for (let atom = 0; atom < snapshot.nAtoms; atom++) {
    if (!boundary.sourceVisibleMask[atom]) continue;
    compactPositions.push(
      snapshot.positions[atom * 3],
      snapshot.positions[atom * 3 + 1],
      snapshot.positions[atom * 3 + 2],
    );
    compactElements.push(snapshot.elements[atom]);
    dataIndices.push(atom);
  }
  for (let image = 0; image < boundary.images.sourceIndices.length; image++) {
    compactPositions.push(
      boundary.images.positions[image * 3],
      boundary.images.positions[image * 3 + 1],
      boundary.images.positions[image * 3 + 2],
    );
    compactElements.push(boundary.images.elements[image]);
    dataIndices.push(snapshot.nAtoms + image);
  }
  const inferred = inferBondsVdwJS(
    new Float32Array(compactPositions),
    new Uint8Array(compactElements),
    compactElements.length,
    vdwScale,
    null,
  );
  const remapped = new Uint32Array(inferred.length);
  for (let index = 0; index < inferred.length; index++) {
    remapped[index] = dataIndices[inferred[index]];
  }
  const positions = new Float32Array(snapshot.positions.length + boundary.images.positions.length);
  positions.set(snapshot.positions);
  positions.set(boundary.images.positions, snapshot.positions.length);
  const elements = new Uint8Array(snapshot.elements.length + boundary.images.elements.length);
  elements.set(snapshot.elements);
  elements.set(boundary.images.elements, snapshot.elements.length);
  return {
    bondIndices: remapped,
    bondOrders: null,
    nBonds: remapped.length / 2,
    positions,
    elements,
    nAtoms: elements.length,
  };
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
    return {
      bondIndices,
      bondOrders,
      nBonds: bondIndices.length / 2,
      positions: null,
      elements: null,
      nAtoms: 0,
    };
  }

  const boxInv = invert3x3(box);
  if (!boxInv) {
    return {
      bondIndices,
      bondOrders,
      nBonds: bondIndices.length / 2,
      positions: null,
      elements: null,
      nAtoms: 0,
    };
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
    return {
      bondIndices,
      bondOrders,
      nBonds: nBondsIn,
      positions: null,
      elements: null,
      nAtoms: 0,
    };
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

      const result = particleData.drawingBoundary
        ? expandTopologyBondsForDrawingBoundary(particleData, bondIndices, bondOrders)
        : processPbcBonds(
            bondIndices,
            bondOrders,
            snapshot.positions,
            snapshot.elements,
            snapshot.nAtoms,
            snapshot.box,
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
          sourceNodeId: particleData.sourceNodeId,
          bondIndices,
          bondOrders,
          nBonds,
          scale: 1.0,
          opacity: 1.0,
          positions: extPositions,
          elements: extElements,
          nAtoms: extNAtoms,
          atomElements: snapshot.elements,
          selectedBondIndices: null,
          bondOpacityOverrides: null,
        };
        outputs.set("bond", bond);
      }
    }
  } else if (params.bondSource === "file") {
    const raw = params.bondFileData;
    if (raw && raw.length >= 2) {
      // Filter bond indices to valid atom range
      const nAtoms = snapshot.nAtoms;
      const validPairs: number[] = [];
      for (let i = 0; i < raw.length; i += 2) {
        const a = raw[i];
        const b = raw[i + 1];
        if (a < nAtoms && b < nAtoms) {
          validPairs.push(a, b);
        }
      }
      let bondIndices: Uint32Array = new Uint32Array(validPairs);
      let nBonds = bondIndices.length / 2;

      if (nBonds > 0) {
        let extPositions: Float32Array | null = null;
        let extElements: Uint8Array | null = null;
        let extNAtoms = 0;

        const result = particleData.drawingBoundary
          ? expandTopologyBondsForDrawingBoundary(particleData, bondIndices, null)
          : processPbcBonds(
              bondIndices,
              null,
              snapshot.positions,
              snapshot.elements,
              snapshot.nAtoms,
              snapshot.box,
            );
        bondIndices = result.bondIndices;
        nBonds = result.nBonds;
        extPositions = result.positions;
        extElements = result.elements;
        extNAtoms = result.nAtoms;

        const bond: BondData = {
          type: "bond",
          sourceNodeId: particleData.sourceNodeId,
          bondIndices,
          bondOrders: null,
          nBonds,
          scale: 1.0,
          opacity: 1.0,
          positions: extPositions,
          elements: extElements,
          nAtoms: extNAtoms,
          atomElements: snapshot.elements,
          selectedBondIndices: null,
          bondOpacityOverrides: null,
        };
        outputs.set("bond", bond);
      }
    }
  } else if (params.bondSource === "distance") {
    const drawingResult = particleData.drawingBoundary
      ? inferDrawingBoundaryBonds(particleData, params.vdwScale ?? DEFAULT_VDW_BOND_FACTOR)
      : null;
    let bondIndices = drawingResult
      ? drawingResult.bondIndices
      : inferBondsVdwJS(
          snapshot.positions,
          snapshot.elements,
          snapshot.nAtoms,
          params.vdwScale ?? DEFAULT_VDW_BOND_FACTOR,
          snapshot.box,
        );

    if (bondIndices.length > 0) {
      let nBonds = bondIndices.length / 2;
      let extPositions: Float32Array | null = null;
      let extElements: Uint8Array | null = null;
      let extNAtoms = 0;

      const result =
        drawingResult ??
        processPbcBonds(
          bondIndices,
          null,
          snapshot.positions,
          snapshot.elements,
          snapshot.nAtoms,
          snapshot.box,
        );
      bondIndices = result.bondIndices;
      nBonds = result.nBonds;
      extPositions = result.positions;
      extElements = result.elements;
      extNAtoms = result.nAtoms;

      if (nBonds > 0) {
        const bond: BondData = {
          type: "bond",
          sourceNodeId: particleData.sourceNodeId,
          bondIndices,
          bondOrders: null,
          nBonds,
          scale: 1.0,
          opacity: 1.0,
          positions: extPositions,
          elements: extElements,
          nAtoms: extNAtoms,
          atomElements: snapshot.elements,
          selectedBondIndices: null,
          bondOpacityOverrides: null,
        };
        outputs.set("bond", bond);
      }
    }
  }

  return outputs;
}
