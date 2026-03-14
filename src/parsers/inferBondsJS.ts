/**
 * Pure JavaScript VDW bond inference.
 * Mirrors the Rust implementation in crates/megane-core/src/bonds.rs
 * but runs entirely in JS — no WASM dependency.
 *
 * Uses a cell-list spatial data structure for O(N) performance.
 * Supports periodic boundary conditions (PBC) via minimum-image convention.
 */

import { VDW_RADII, DEFAULT_RADIUS } from "../constants";
import { invert3x3 } from "../pipeline/executors/mathUtils";

const DEFAULT_VDW_BOND_FACTOR = 0.6;
const MIN_BOND_DIST = 0.4;
const CELL_SIZE = 2.0;

/**
 * Infer bonds based on van der Waals radii.
 * Two atoms are bonded if:
 *   MIN_BOND_DIST < distance <= (vdw_i + vdw_j) * VDW_BOND_FACTOR
 *
 * When a periodic box is provided, uses minimum-image convention
 * so bonds across cell boundaries are correctly detected.
 */
export function inferBondsVdwJS(
  positions: Float32Array,
  elements: Uint8Array,
  nAtoms: number,
  vdwScale: number = DEFAULT_VDW_BOND_FACTOR,
  box: Float32Array | null = null,
): Uint32Array {
  if (nAtoms < 2) return new Uint32Array(0);

  const hasBox = box !== null && box.some((v) => v !== 0);
  const boxInv = hasBox ? invert3x3(box!) : null;
  const usePbc = hasBox && boxInv !== null;

  let nx: number, ny: number, nz: number;

  if (usePbc) {
    // Use box vector lengths for grid dimensions
    const lx = Math.sqrt(box![0] * box![0] + box![1] * box![1] + box![2] * box![2]);
    const ly = Math.sqrt(box![3] * box![3] + box![4] * box![4] + box![5] * box![5]);
    const lz = Math.sqrt(box![6] * box![6] + box![7] * box![7] + box![8] * box![8]);
    nx = Math.max(1, Math.floor(lx / CELL_SIZE));
    ny = Math.max(1, Math.floor(ly / CELL_SIZE));
    nz = Math.max(1, Math.floor(lz / CELL_SIZE));
  } else {
    // Compute bounding box
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity;
    for (let i = 0; i < nAtoms; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (z < minZ) minZ = z;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      if (z > maxZ) maxZ = z;
    }
    nx = Math.max(1, Math.floor((maxX - minX) / CELL_SIZE) + 1);
    ny = Math.max(1, Math.floor((maxY - minY) / CELL_SIZE) + 1);
    nz = Math.max(1, Math.floor((maxZ - minZ) / CELL_SIZE) + 1);
  }

  // Build cell list: for each cell, store array of atom indices
  const nCells = nx * ny * nz;
  const cells: number[][] = new Array(nCells);
  for (let c = 0; c < nCells; c++) cells[c] = [];

  if (usePbc) {
    // Assign atoms using fractional coordinates wrapped to [0, 1)
    for (let i = 0; i < nAtoms; i++) {
      const px = positions[i * 3];
      const py = positions[i * 3 + 1];
      const pz = positions[i * 3 + 2];
      // Convert to fractional
      let fx = boxInv![0] * px + boxInv![3] * py + boxInv![6] * pz;
      let fy = boxInv![1] * px + boxInv![4] * py + boxInv![7] * pz;
      let fz = boxInv![2] * px + boxInv![5] * py + boxInv![8] * pz;
      // Wrap to [0, 1)
      fx = fx - Math.floor(fx);
      fy = fy - Math.floor(fy);
      fz = fz - Math.floor(fz);
      const cx = Math.min(Math.floor(fx * nx), nx - 1);
      const cy = Math.min(Math.floor(fy * ny), ny - 1);
      const cz = Math.min(Math.floor(fz * nz), nz - 1);
      cells[cx * ny * nz + cy * nz + cz].push(i);
    }
  } else {
    // Original bounding-box assignment
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity;
    for (let i = 0; i < nAtoms; i++) {
      if (positions[i * 3] < minX) minX = positions[i * 3];
      if (positions[i * 3 + 1] < minY) minY = positions[i * 3 + 1];
      if (positions[i * 3 + 2] < minZ) minZ = positions[i * 3 + 2];
    }
    for (let i = 0; i < nAtoms; i++) {
      const cx = Math.min(Math.floor((positions[i * 3] - minX) / CELL_SIZE), nx - 1);
      const cy = Math.min(Math.floor((positions[i * 3 + 1] - minY) / CELL_SIZE), ny - 1);
      const cz = Math.min(Math.floor((positions[i * 3 + 2] - minZ) / CELL_SIZE), nz - 1);
      cells[cx * ny * nz + cy * nz + cz].push(i);
    }
  }

  // Half-shell neighbor offsets (13 neighbors + self)
  const offsets: [number, number, number][] = [
    [0, 0, 1],
    [0, 1, -1],
    [0, 1, 0],
    [0, 1, 1],
    [1, -1, -1],
    [1, -1, 0],
    [1, -1, 1],
    [1, 0, -1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, -1],
    [1, 1, 0],
    [1, 1, 1],
  ];

  const minDistSq = MIN_BOND_DIST * MIN_BOND_DIST;
  const bondPairs: number[] = [];

  function checkPair(i: number, j: number): void {
    const ri = VDW_RADII[elements[i]] ?? DEFAULT_RADIUS;
    const rj = VDW_RADII[elements[j]] ?? DEFAULT_RADIUS;
    const threshold = (ri + rj) * vdwScale;
    const thresholdSq = threshold * threshold;

    let dx = positions[j * 3] - positions[i * 3];
    let dy = positions[j * 3 + 1] - positions[i * 3 + 1];
    let dz = positions[j * 3 + 2] - positions[i * 3 + 2];

    if (usePbc) {
      // Minimum-image convention
      let sx = boxInv![0] * dx + boxInv![3] * dy + boxInv![6] * dz;
      let sy = boxInv![1] * dx + boxInv![4] * dy + boxInv![7] * dz;
      let sz = boxInv![2] * dx + boxInv![5] * dy + boxInv![8] * dz;
      sx -= Math.round(sx);
      sy -= Math.round(sy);
      sz -= Math.round(sz);
      dx = box![0] * sx + box![3] * sy + box![6] * sz;
      dy = box![1] * sx + box![4] * sy + box![7] * sz;
      dz = box![2] * sx + box![5] * sy + box![8] * sz;
    }

    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq > minDistSq && distSq <= thresholdSq) {
      const a = i < j ? i : j;
      const b = i < j ? j : i;
      bondPairs.push(a, b);
    }
  }

  // Self-cell pairs + neighbor-cell pairs
  for (let ix = 0; ix < nx; ix++) {
    for (let iy = 0; iy < ny; iy++) {
      for (let iz = 0; iz < nz; iz++) {
        const cellIdx = ix * ny * nz + iy * nz + iz;
        const cell = cells[cellIdx];

        // Pairs within the same cell
        for (let a = 0; a < cell.length; a++) {
          for (let b = a + 1; b < cell.length; b++) {
            checkPair(cell[a], cell[b]);
          }
        }

        // Pairs with neighbor cells (half-shell)
        for (const [dx, dy, dz] of offsets) {
          const jx = ix + dx;
          const jy = iy + dy;
          const jz = iz + dz;

          if (usePbc) {
            // Wrap neighbor cell indices with modular arithmetic
            const jxW = ((jx % nx) + nx) % nx;
            const jyW = ((jy % ny) + ny) % ny;
            const jzW = ((jz % nz) + nz) % nz;
            const neighborIdx = jxW * ny * nz + jyW * nz + jzW;
            // Skip if wrapped cell is the same as current cell (small boxes)
            if (neighborIdx === cellIdx) continue;
            const neighbor = cells[neighborIdx];
            for (const ai of cell) {
              for (const bi of neighbor) {
                checkPair(ai, bi);
              }
            }
          } else {
            if (jx < 0 || jx >= nx || jy < 0 || jy >= ny || jz < 0 || jz >= nz) continue;
            const neighborIdx = jx * ny * nz + jy * nz + jz;
            const neighbor = cells[neighborIdx];
            for (const ai of cell) {
              for (const bi of neighbor) {
                checkPair(ai, bi);
              }
            }
          }
        }
      }
    }
  }

  return new Uint32Array(bondPairs);
}
