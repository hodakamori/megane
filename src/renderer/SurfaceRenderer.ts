/**
 * Solvent-Accessible Surface (SAS) renderer.
 *
 * Computes the union of probe-inflated atom spheres (VDW radius + probe radius)
 * as a signed-distance field, then extracts the isosurface with Three.js
 * MarchingCubes and renders it as a semi-transparent THREE.Mesh.
 *
 * The SAS is defined as the surface traced by the center of a probe sphere
 * (default 1.4 Å, approximating water) rolling over the VDW surface.  This
 * is equivalent to inflating each atom by the probe radius and taking the
 * union isosurface at zero signed-distance.
 */

import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import type { Snapshot } from "../types";

// ─── Van der Waals radii (Å) ─────────────────────────────────────────────────
// Bondi 1964 / Alvarez 2013 values for common atomic numbers.

/** VDW radii in Å keyed by atomic number. */
export const VDW_RADII: Readonly<Record<number, number>> = {
  1: 1.2, // H
  2: 1.4, // He
  5: 1.92, // B
  6: 1.7, // C
  7: 1.55, // N
  8: 1.52, // O
  9: 1.47, // F
  10: 1.54, // Ne
  11: 2.27, // Na
  12: 1.73, // Mg
  14: 2.1, // Si
  15: 1.8, // P
  16: 1.8, // S
  17: 1.75, // Cl
  18: 1.88, // Ar
  19: 2.75, // K
  20: 2.31, // Ca
  34: 1.9, // Se
  35: 1.85, // Br
  53: 1.98, // I
};

/** Fallback VDW radius for unknown elements. */
export const DEFAULT_VDW_RADIUS = 1.7;

/** Default probe radius (Å). Water ≈ 1.4 Å. */
export const DEFAULT_PROBE_RADIUS = 1.4;

/** Default marching-cubes grid resolution (cubed). 48 balances speed and quality. */
export const DEFAULT_SURFACE_RESOLUTION = 48;

/** Return the VDW radius (Å) for a given atomic number. */
export function getVdwRadius(atomicNumber: number): number {
  return VDW_RADII[atomicNumber] ?? DEFAULT_VDW_RADIUS;
}

// ─── SDF grid ────────────────────────────────────────────────────────────────

/** Result of buildSdf: a 3-D signed-distance-field grid. */
export interface SdfResult {
  /** Flat [gz*res² + gy*res + gx] signed-distance values (Å). Negative = inside SAS. */
  sdf: Float32Array;
  /** World-space X coordinate of grid cell 0. */
  originX: number;
  /** World-space Y coordinate of grid cell 0. */
  originY: number;
  /** World-space Z coordinate of grid cell 0. */
  originZ: number;
  /** Edge length (Å) of each cubic voxel. */
  cellSize: number;
  /** Number of cells per axis. */
  res: number;
}

/**
 * Build a signed-distance field for the SAS of the given atoms.
 *
 * Values are negative inside the surface and positive outside.
 * Exported for unit testing.
 */
export function buildSdf(
  positions: Float32Array,
  elements: Uint8Array,
  nAtoms: number,
  probeRadius = DEFAULT_PROBE_RADIUS,
  res = DEFAULT_SURFACE_RESOLUTION,
): SdfResult {
  // Empty structure: return a trivially "outside" grid.
  if (nAtoms === 0) {
    return {
      sdf: new Float32Array(res * res * res).fill(1),
      originX: 0,
      originY: 0,
      originZ: 0,
      cellSize: 1,
      res,
    };
  }

  // ── Compute bounding box expanded by the effective radius of each atom ──
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  for (let a = 0; a < nAtoms; a++) {
    const x = positions[a * 3];
    const y = positions[a * 3 + 1];
    const z = positions[a * 3 + 2];
    const r = getVdwRadius(elements[a]) + probeRadius;
    if (x - r < minX) minX = x - r;
    if (x + r > maxX) maxX = x + r;
    if (y - r < minY) minY = y - r;
    if (y + r > maxY) maxY = y + r;
    if (z - r < minZ) minZ = z - r;
    if (z + r > maxZ) maxZ = z + r;
  }

  // Uniform cell size derived from the longest axis.
  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
  const cellSize = span / (res - 1);

  // Centre the grid on the structure's bounding box.
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;
  const halfGrid = ((res - 1) * cellSize) / 2;
  const originX = cx - halfGrid;
  const originY = cy - halfGrid;
  const originZ = cz - halfGrid;

  // ── Initialise SDF to +Infinity (everything "outside"). ──
  const sdf = new Float32Array(res * res * res).fill(Infinity);

  // ── Per-atom update: iterate only over voxels in the atom's bounding box. ──
  for (let a = 0; a < nAtoms; a++) {
    const ax = positions[a * 3];
    const ay = positions[a * 3 + 1];
    const az = positions[a * 3 + 2];
    const r = getVdwRadius(elements[a]) + probeRadius;

    // Grid-space bounding box of this atom (+1 cell margin for smooth normals).
    const gxMin = Math.max(0, Math.floor((ax - r - originX) / cellSize) - 1);
    const gxMax = Math.min(res - 1, Math.ceil((ax + r - originX) / cellSize) + 1);
    const gyMin = Math.max(0, Math.floor((ay - r - originY) / cellSize) - 1);
    const gyMax = Math.min(res - 1, Math.ceil((ay + r - originY) / cellSize) + 1);
    const gzMin = Math.max(0, Math.floor((az - r - originZ) / cellSize) - 1);
    const gzMax = Math.min(res - 1, Math.ceil((az + r - originZ) / cellSize) + 1);

    for (let gz = gzMin; gz <= gzMax; gz++) {
      const wz = originZ + gz * cellSize;
      const dz = wz - az;
      const dz2 = dz * dz;
      for (let gy = gyMin; gy <= gyMax; gy++) {
        const wy = originY + gy * cellSize;
        const dy = wy - ay;
        const dy2 = dy * dy;
        for (let gx = gxMin; gx <= gxMax; gx++) {
          const wx = originX + gx * cellSize;
          const dx = wx - ax;
          const dist = Math.sqrt(dx * dx + dy2 + dz2) - r;
          const idx = gz * res * res + gy * res + gx;
          if (dist < sdf[idx]) sdf[idx] = dist;
        }
      }
    }
  }

  return { sdf, originX, originY, originZ, cellSize, res };
}

// ─── Geometry extraction ──────────────────────────────────────────────────────

/**
 * Convert an SdfResult into a Three.js BufferGeometry of the SAS isosurface
 * in world-space coordinates.
 *
 * Uses Three.js MarchingCubes with directly-set field values so that the
 * isosurface is at the exact SDF zero-crossing.
 */
export function sdfToGeometry(sdfResult: SdfResult): THREE.BufferGeometry {
  const { sdf, originX, originY, originZ, cellSize, res } = sdfResult;

  // The marching-cubes field value that defines the isosurface.
  const isolation = 0.5;

  // Transition half-width: how many Å over which the field blends from 1
  // (deep inside) to 0 (far outside).  Two cell-widths gives smooth normals.
  const smooth = cellSize * 2;

  // Create a MarchingCubes object solely to use its marching-cubes kernel.
  // We don't actually render this mesh – we extract the geometry then discard it.
  // maxPolyCount=50000 avoids truncation for typical molecular surfaces at res 48.
  const mc = new MarchingCubes(res, new THREE.MeshBasicMaterial(), false, false, 50000);
  mc.isolation = isolation;
  mc.reset();

  for (let gz = 0; gz < res; gz++) {
    for (let gy = 0; gy < res; gy++) {
      for (let gx = 0; gx < res; gx++) {
        const sdv = sdf[gz * res * res + gy * res + gx];
        // Map SDF → field: surface (sdf=0) → isolation, inside < 0 → above isolation,
        // outside > 0 → below isolation.
        const fieldValue =
          sdv === Infinity ? 0 : Math.max(0, Math.min(1, (-sdv / smooth) * isolation + isolation));
        mc.setCell(gx, gy, gz, fieldValue);
      }
    }
  }

  // Run marching cubes.  Three.js r0.183+ uses update() to fill pre-allocated
  // position / normal arrays rather than a generateGeometry() factory method.
  mc.update();

  // mc.count == number of vertex positions written (incremented by 3 per triangle).
  // Each position is a vec3, so positionArray[0 .. count*3) holds all data.
  const vertexCount = mc.count;
  const geom = new THREE.BufferGeometry();

  if (vertexCount > 0) {
    geom.setAttribute(
      "position",
      new THREE.BufferAttribute(mc.positionArray.slice(0, vertexCount * 3), 3),
    );
    geom.setAttribute(
      "normal",
      new THREE.BufferAttribute(mc.normalArray.slice(0, vertexCount * 3), 3),
    );

    // Transform from MC local space to world space.
    // Three.js MC maps grid index i to local position: f = (i − halfsize) / halfsize
    //   → f = 2·i/res − 1   (for halfsize = res/2)
    // Inverting: world = originX + i·cellSize = originX + (f+1)·res/2·cellSize
    //   → world = f · (res·cellSize/2) + (originX + res·cellSize/2)
    const halfTotal = (res * cellSize) / 2;
    const worldCX = originX + halfTotal;
    const worldCY = originY + halfTotal;
    const worldCZ = originZ + halfTotal;

    geom.applyMatrix4(new THREE.Matrix4().makeScale(halfTotal, halfTotal, halfTotal));
    geom.applyMatrix4(new THREE.Matrix4().makeTranslation(worldCX, worldCY, worldCZ));
  }

  return geom;
}

// ─── Renderer class ───────────────────────────────────────────────────────────

/** Options that control SAS surface appearance. */
export interface SurfaceOptions {
  color?: number;
  opacity?: number;
  probeRadius?: number;
}

/**
 * Renders the Solvent-Accessible Surface (SAS) of the loaded structure as a
 * semi-transparent Three.js mesh.
 *
 * Follows the same lifecycle as CartoonRenderer: create → add mesh to scene →
 * call loadSnapshot() on first data → call updatePositions() on each frame →
 * call dispose() on teardown.
 */
export class SurfaceRenderer {
  /** The Three.js group added to the scene by MoleculeRenderer. */
  readonly mesh: THREE.Group;

  private surfaceMesh: THREE.Mesh | null = null;
  private material: THREE.MeshPhongMaterial;
  private probeRadius: number;
  private snapshot: Snapshot | null = null;

  constructor(options: SurfaceOptions = {}) {
    this.probeRadius = options.probeRadius ?? DEFAULT_PROBE_RADIUS;
    this.material = new THREE.MeshPhongMaterial({
      color: options.color ?? 0x4488ff,
      transparent: true,
      opacity: options.opacity ?? 0.5,
      side: THREE.DoubleSide,
      shininess: 60,
      depthWrite: false,
    });
    this.mesh = new THREE.Group();
    this.mesh.visible = false;
  }

  /** (Re)build the surface geometry from a snapshot. */
  loadSnapshot(snapshot: Snapshot): void {
    this.snapshot = snapshot;
    this._rebuild(snapshot);
  }

  /**
   * Update positions from a trajectory frame and rebuild the surface.
   *
   * For large systems, surface recomputation can be slow.  The surface is
   * recomputed unconditionally to stay in sync with the current frame.
   */
  updatePositions(positions: Float32Array): void {
    if (!this.snapshot) return;
    // Splice new positions into a copy of the snapshot for SDF computation.
    const updated: Snapshot = { ...this.snapshot, positions };
    this._rebuild(updated);
  }

  /** Show or hide the surface mesh. */
  setVisible(visible: boolean): void {
    this.mesh.visible = visible;
  }

  /** Update surface colour. */
  setColor(color: number): void {
    this.material.color.set(color);
  }

  /** Update surface opacity (0–1). */
  setOpacity(opacity: number): void {
    this.material.opacity = opacity;
  }

  /** Update the probe radius (Å) and rebuild the surface. */
  setProbeRadius(r: number): void {
    this.probeRadius = r;
    if (this.snapshot) this._rebuild(this.snapshot);
  }

  dispose(): void {
    this._clearMesh();
    this.material.dispose();
  }

  // ── private ──────────────────────────────────────────────────────────────

  private _rebuild(snapshot: Snapshot): void {
    const sdfResult = buildSdf(
      snapshot.positions,
      snapshot.elements,
      snapshot.nAtoms,
      this.probeRadius,
    );
    const geom = sdfToGeometry(sdfResult);

    this._clearMesh();

    if (geom.attributes.position && geom.attributes.position.count > 0) {
      this.surfaceMesh = new THREE.Mesh(geom, this.material);
      this.mesh.add(this.surfaceMesh);
    }
  }

  private _clearMesh(): void {
    if (this.surfaceMesh) {
      this.mesh.remove(this.surfaceMesh);
      this.surfaceMesh.geometry.dispose();
      this.surfaceMesh = null;
    }
  }
}
