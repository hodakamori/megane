import type { Snapshot } from "../../types";
import type { PipelineData, ParticleData, CellData, ReplicateParams } from "../types";

/**
 * Replicate node — OVITO/VESTA-style supercell builder.
 *
 * Copies every atom (and its bonds) into an `nx × ny × nz` grid of cell
 * images (images placed in the +a/+b/+c directions, the original cell
 * included) and enlarges the simulation cell to `nx·a, ny·b, nz·c` so the
 * viewport draws the full supercell boundary.
 *
 * Requires a unit cell on the input particle stream — without lattice
 * vectors there is no way to place images, so the input is passed through
 * unchanged (the dispatcher surfaces a warning in that case). An identity
 * replication (1×1×1) is likewise a pass-through.
 */
export function executeReplicate(
  params: ReplicateParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particle = inputs.get("particle")?.[0] as ParticleData | undefined;
  const cellIn = inputs.get("cell")?.[0] as CellData | undefined;
  if (!particle) return outputs;

  const nx = Math.max(1, Math.floor(params.nx));
  const ny = Math.max(1, Math.floor(params.ny));
  const nz = Math.max(1, Math.floor(params.nz));
  const box = particle.source.box;

  // Pass-through: identity replication, or no cell to replicate along.
  if ((nx === 1 && ny === 1 && nz === 1) || !box) {
    outputs.set("particle", particle);
    if (cellIn) outputs.set("cell", cellIn);
    return outputs;
  }

  const src = particle.source;
  const total = nx * ny * nz;
  const nAtomsOld = src.nAtoms;
  const nAtomsNew = nAtomsOld * total;
  const nBondsOld = src.nBonds;

  // Lattice vectors a, b, c (rows of the row-major 3×3 box matrix).
  const ax = box[0],
    ay = box[1],
    az = box[2];
  const bx = box[3],
    by = box[4],
    bz = box[5];
  const cx = box[6],
    cy = box[7],
    cz = box[8];

  const positions = new Float32Array(nAtomsNew * 3);
  const elements = new Uint8Array(nAtomsNew);
  const atomChainIds = src.atomChainIds ? new Uint8Array(nAtomsNew) : null;
  const atomBFactors = src.atomBFactors ? new Float32Array(nAtomsNew) : null;

  let img = 0;
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      for (let k = 0; k < nz; k++, img++) {
        const offX = i * ax + j * bx + k * cx;
        const offY = i * ay + j * by + k * cy;
        const offZ = i * az + j * bz + k * cz;
        const atomBase = img * nAtomsOld;
        for (let a = 0; a < nAtomsOld; a++) {
          const dst = (atomBase + a) * 3;
          const s = a * 3;
          positions[dst] = src.positions[s] + offX;
          positions[dst + 1] = src.positions[s + 1] + offY;
          positions[dst + 2] = src.positions[s + 2] + offZ;
          elements[atomBase + a] = src.elements[a];
          if (atomChainIds) atomChainIds[atomBase + a] = src.atomChainIds![a];
          if (atomBFactors) atomBFactors[atomBase + a] = src.atomBFactors![a];
        }
      }
    }
  }

  // Bonds: tile with an index offset of img·nAtomsOld per image.
  const bonds = new Uint32Array(nBondsOld * total * 2);
  const bondOrders = src.bondOrders ? new Uint8Array(nBondsOld * total) : null;
  for (let m = 0; m < total; m++) {
    const atomOffset = m * nAtomsOld;
    const bondBase = m * nBondsOld;
    for (let bd = 0; bd < nBondsOld; bd++) {
      bonds[(bondBase + bd) * 2] = src.bonds[bd * 2] + atomOffset;
      bonds[(bondBase + bd) * 2 + 1] = src.bonds[bd * 2 + 1] + atomOffset;
      if (bondOrders) bondOrders[bondBase + bd] = src.bondOrders![bd];
    }
  }

  // Cα backbone arrays (optional): caIndices shift per image, the rest tile.
  let caIndices: Uint32Array | undefined;
  let caChainIds: Uint8Array | undefined;
  let caResNums: Uint32Array | undefined;
  let caSsType: Uint8Array | undefined;
  if (src.caIndices) {
    const nCa = src.caIndices.length;
    caIndices = new Uint32Array(nCa * total);
    caChainIds = src.caChainIds ? new Uint8Array(nCa * total) : undefined;
    caResNums = src.caResNums ? new Uint32Array(nCa * total) : undefined;
    caSsType = src.caSsType ? new Uint8Array(nCa * total) : undefined;
    for (let m = 0; m < total; m++) {
      const atomOffset = m * nAtomsOld;
      const caBase = m * nCa;
      for (let c = 0; c < nCa; c++) {
        caIndices[caBase + c] = src.caIndices[c] + atomOffset;
        if (caChainIds) caChainIds[caBase + c] = src.caChainIds![c];
        if (caResNums) caResNums[caBase + c] = src.caResNums![c];
        if (caSsType) caSsType[caBase + c] = src.caSsType![c];
      }
    }
  }

  // Enlarge the cell to span the full supercell.
  const newBox = new Float32Array([
    nx * ax,
    nx * ay,
    nx * az,
    ny * bx,
    ny * by,
    ny * bz,
    nz * cx,
    nz * cy,
    nz * cz,
  ]);

  const newSnapshot: Snapshot = {
    nAtoms: nAtomsNew,
    nBonds: nBondsOld * total,
    nFileBonds: src.nFileBonds * total,
    positions,
    elements,
    bonds,
    bondOrders,
    box: newBox,
    atomChainIds,
    atomBFactors,
    caIndices,
    caChainIds,
    caResNums,
    caSsType,
  };

  const newParticle: ParticleData = {
    ...particle,
    source: newSnapshot,
    indices: tileIndices(particle.indices, nAtomsOld, total),
    scaleOverrides: tileFloat(particle.scaleOverrides, total),
    opacityOverrides: tileFloat(particle.opacityOverrides, total),
    colorOverrides: tileFloat(particle.colorOverrides, total),
  };
  outputs.set("particle", newParticle);

  const newCell: CellData = {
    type: "cell",
    sourceNodeId: cellIn?.sourceNodeId ?? particle.sourceNodeId,
    box: newBox,
    visible: cellIn?.visible ?? true,
    axesVisible: cellIn?.axesVisible ?? true,
  };
  outputs.set("cell", newCell);

  return outputs;
}

/** Tile a per-atom selection index array, shifting each copy by img·nAtomsOld. */
function tileIndices(
  indices: Uint32Array | null,
  nAtomsOld: number,
  total: number,
): Uint32Array | null {
  if (indices === null) return null;
  const out = new Uint32Array(indices.length * total);
  for (let m = 0; m < total; m++) {
    const offset = m * nAtomsOld;
    const base = m * indices.length;
    for (let i = 0; i < indices.length; i++) {
      out[base + i] = indices[i] + offset;
    }
  }
  return out;
}

/** Tile a per-atom (or per-atom×channel) float override array `total` times. */
function tileFloat(arr: Float32Array | null, total: number): Float32Array | null {
  if (arr === null) return null;
  const out = new Float32Array(arr.length * total);
  for (let m = 0; m < total; m++) out.set(arr, m * arr.length);
  return out;
}
