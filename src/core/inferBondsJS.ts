/**
 * Pure JavaScript VDW bond inference.
 * Mirrors the Rust implementation in crates/megane-core/src/bonds.rs
 * but runs entirely in JS — no WASM dependency.
 *
 * Uses a cell-list spatial data structure for O(N) performance.
 */

import { VDW_RADII, DEFAULT_RADIUS } from "./constants";

const DEFAULT_VDW_BOND_FACTOR = 0.6;
const MIN_BOND_DIST = 0.4;
const CELL_SIZE = 2.0;

/**
 * Infer bonds based on van der Waals radii.
 * Two atoms are bonded if:
 *   MIN_BOND_DIST < distance <= (vdw_i + vdw_j) * VDW_BOND_FACTOR
 */
export function inferBondsVdwJS(
  positions: Float32Array,
  elements: Uint8Array,
  nAtoms: number,
  vdwScale: number = DEFAULT_VDW_BOND_FACTOR,
): Uint32Array {
  if (nAtoms < 2) return new Uint32Array(0);

  // Compute bounding box
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
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

  const nx = Math.max(1, Math.floor((maxX - minX) / CELL_SIZE) + 1);
  const ny = Math.max(1, Math.floor((maxY - minY) / CELL_SIZE) + 1);
  const nz = Math.max(1, Math.floor((maxZ - minZ) / CELL_SIZE) + 1);

  // Build cell list: for each cell, store array of atom indices
  const nCells = nx * ny * nz;
  const cells: number[][] = new Array(nCells);
  for (let c = 0; c < nCells; c++) cells[c] = [];

  for (let i = 0; i < nAtoms; i++) {
    const cx = Math.min(Math.floor((positions[i * 3] - minX) / CELL_SIZE), nx - 1);
    const cy = Math.min(Math.floor((positions[i * 3 + 1] - minY) / CELL_SIZE), ny - 1);
    const cz = Math.min(Math.floor((positions[i * 3 + 2] - minZ) / CELL_SIZE), nz - 1);
    cells[cx * ny * nz + cy * nz + cz].push(i);
  }

  // Half-shell neighbor offsets (13 neighbors + self)
  const offsets: [number, number, number][] = [
    [0, 0, 1], [0, 1, -1], [0, 1, 0], [0, 1, 1],
    [1, -1, -1], [1, -1, 0], [1, -1, 1],
    [1, 0, -1], [1, 0, 0], [1, 0, 1],
    [1, 1, -1], [1, 1, 0], [1, 1, 1],
  ];

  const minDistSq = MIN_BOND_DIST * MIN_BOND_DIST;
  const bondPairs: number[] = [];

  function checkPair(i: number, j: number): void {
    const ri = VDW_RADII[elements[i]] ?? DEFAULT_RADIUS;
    const rj = VDW_RADII[elements[j]] ?? DEFAULT_RADIUS;
    const threshold = (ri + rj) * vdwScale;
    const thresholdSq = threshold * threshold;

    const dx = positions[j * 3] - positions[i * 3];
    const dy = positions[j * 3 + 1] - positions[i * 3 + 1];
    const dz = positions[j * 3 + 2] - positions[i * 3 + 2];
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

  return new Uint32Array(bondPairs);
}
