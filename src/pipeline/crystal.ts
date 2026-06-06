/**
 * Translational replication for the Supercell pipeline node.
 *
 * Tiles the unit cell across an `na × nb × nc` grid — a true supercell. Each
 * image is a rigid copy, so bonds are replicated by index offset rather than
 * re-inferred, and the cell box is enlarged to a single enclosing cell.
 *
 * Crystallographic symmetry expansion (asymmetric unit → full unit cell) is
 * NOT done here: it is applied automatically when a CIF is parsed
 * (`megane-core::crystal`), so by the time a snapshot reaches this node it
 * already contains the full unit-cell contents.
 */

import type { Snapshot } from "../types";

export interface ExpandParams {
  na: number;
  nb: number;
  nc: number;
}

/**
 * Replicate a snapshot across an `na × nb × nc` grid of unit cells. Returns the
 * input unchanged when there is nothing to do (na=nb=nc=1) or the structure has
 * no cell to translate by.
 */
export function expandCrystal(snapshot: Snapshot, params: ExpandParams): Snapshot {
  const na = Math.max(1, Math.floor(params.na));
  const nb = Math.max(1, Math.floor(params.nb));
  const nc = Math.max(1, Math.floor(params.nc));

  if ((na === 1 && nb === 1 && nc === 1) || !snapshot.box) {
    return snapshot;
  }

  const box = snapshot.box;
  const nBase = snapshot.nAtoms;
  const basePos = snapshot.positions;
  const baseElems = snapshot.elements;
  const nImages = na * nb * nc;

  const positions = new Float32Array(nBase * nImages * 3);
  const elements = new Uint8Array(nBase * nImages);

  let im = 0;
  for (let i = 0; i < na; i++) {
    for (let j = 0; j < nb; j++) {
      for (let k = 0; k < nc; k++) {
        // Cartesian offset = i·va + j·vb + k·vc (cell vectors are box rows).
        const ox = i * box[0] + j * box[3] + k * box[6];
        const oy = i * box[1] + j * box[4] + k * box[7];
        const oz = i * box[2] + j * box[5] + k * box[8];
        const base = im * nBase;
        for (let a = 0; a < nBase; a++) {
          const o = (base + a) * 3;
          positions[o] = basePos[a * 3] + ox;
          positions[o + 1] = basePos[a * 3 + 1] + oy;
          positions[o + 2] = basePos[a * 3 + 2] + oz;
          elements[base + a] = baseElems[a];
        }
        im++;
      }
    }
  }

  // Replicate bonds with a per-image atom-index offset.
  const baseBonds = snapshot.bonds;
  const nBaseBonds = baseBonds.length / 2;
  const bonds = new Uint32Array(nBaseBonds * nImages * 2);
  const baseOrders = snapshot.bondOrders;
  const bondOrders = baseOrders ? new Uint8Array(nBaseBonds * nImages) : null;
  for (let m = 0; m < nImages; m++) {
    const atomOff = m * nBase;
    const bondOff = m * nBaseBonds;
    for (let b = 0; b < nBaseBonds; b++) {
      bonds[(bondOff + b) * 2] = baseBonds[b * 2] + atomOff;
      bonds[(bondOff + b) * 2 + 1] = baseBonds[b * 2 + 1] + atomOff;
      if (bondOrders && baseOrders) bondOrders[bondOff + b] = baseOrders[b];
    }
  }

  // Enlarge the cell box to the single enclosing supercell (na·va, nb·vb, nc·vc).
  const newBox = new Float32Array(9);
  for (let r = 0; r < 3; r++) {
    const mult = r === 0 ? na : r === 1 ? nb : nc;
    newBox[r * 3] = box[r * 3] * mult;
    newBox[r * 3 + 1] = box[r * 3 + 1] * mult;
    newBox[r * 3 + 2] = box[r * 3 + 2] * mult;
  }

  const atomChainIds = snapshot.atomChainIds ? tileU8(snapshot.atomChainIds, nImages) : null;
  const atomBFactors = snapshot.atomBFactors ? tileF32(snapshot.atomBFactors, nImages) : null;

  return {
    nAtoms: nBase * nImages,
    nBonds: bonds.length / 2,
    nFileBonds: snapshot.nFileBonds * nImages,
    positions,
    elements,
    bonds,
    bondOrders,
    box: newBox,
    atomChainIds,
    atomBFactors,
  };
}

function tileU8(arr: Uint8Array, n: number): Uint8Array {
  const out = new Uint8Array(arr.length * n);
  for (let i = 0; i < n; i++) out.set(arr, i * arr.length);
  return out;
}

function tileF32(arr: Float32Array, n: number): Float32Array {
  const out = new Float32Array(arr.length * n);
  for (let i = 0; i < n; i++) out.set(arr, i * arr.length);
  return out;
}
