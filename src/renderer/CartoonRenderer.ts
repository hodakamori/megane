/**
 * Cartoon / ribbon representation renderer for proteins.
 *
 * Renders the Cα backbone as secondary-structure-aware geometry:
 *  - Coil (ss=0): thin TubeGeometry
 *  - Helix (ss=1): wide flat ribbon BufferGeometry
 *  - Sheet (ss=2): medium tube + ConeGeometry arrowhead at the C-terminal end
 *
 * Data flows in via loadSnapshot() (first frame) and updatePositions() (trajectory).
 * The renderer owns a THREE.Group that is added to the scene by MoleculeRenderer.
 */

import * as THREE from "three";
import type { Snapshot } from "../types";

/** Secondary structure type constants. */
export const SS_COIL = 0;
export const SS_HELIX = 1;
export const SS_SHEET = 2;

/** Colors used for each secondary structure type. */
const SS_COLORS: Record<number, number> = {
  [SS_COIL]: 0x9ca3af, // gray
  [SS_HELIX]: 0xef4444, // red
  [SS_SHEET]: 0x3b82f6, // blue
};

/** A contiguous run of Cα atoms sharing the same secondary structure type. */
export interface BackboneSegment {
  /** Indices into the caIndices array (not into the atom positions array). */
  caSliceStart: number;
  caSliceEnd: number; // exclusive
  ssType: number;
}

/** Per-chain ordered Cα backbone data extracted from a Snapshot. */
export interface ChainBackbone {
  chainId: number; // ASCII byte of the chain letter
  /** Sorted Cα atom indices (into the full positions array). */
  atomIndices: Uint32Array;
  /** Per-Cα secondary structure type. */
  ssTypes: Uint8Array;
}

// ─── Pure geometry helpers (exported for unit testing) ───────────────────────

/**
 * Extract per-chain backbone data from a Snapshot, sorted by residue number.
 * Returns an empty array when the snapshot has no Cα data.
 */
export function extractChainBackbones(snapshot: Snapshot): ChainBackbone[] {
  const { caIndices, caChainIds, caResNums, caSsType } = snapshot;
  if (!caIndices || !caChainIds || !caResNums || !caSsType || caIndices.length === 0) {
    return [];
  }

  // Group Cα atoms by chain ID.
  const chainMap = new Map<number, number[]>(); // chain → array of ca positions
  for (let i = 0; i < caIndices.length; i++) {
    const chain = caChainIds[i];
    let list = chainMap.get(chain);
    if (!list) {
      list = [];
      chainMap.set(chain, list);
    }
    list.push(i);
  }

  const chains: ChainBackbone[] = [];
  for (const [chainId, caPositions] of chainMap) {
    // Sort by residue number within the chain.
    caPositions.sort((a, b) => caResNums[a] - caResNums[b]);

    const atomIndices = new Uint32Array(caPositions.length);
    const ssTypes = new Uint8Array(caPositions.length);
    for (let k = 0; k < caPositions.length; k++) {
      atomIndices[k] = caIndices[caPositions[k]];
      ssTypes[k] = caSsType[caPositions[k]];
    }
    chains.push({ chainId, atomIndices, ssTypes });
  }
  return chains;
}

/**
 * Split an array of per-Cα SS types into contiguous segments.
 * Each segment has the same ss type and at least one residue.
 */
export function buildSegments(ssTypes: Uint8Array): BackboneSegment[] {
  const segments: BackboneSegment[] = [];
  if (ssTypes.length === 0) return segments;

  let start = 0;
  let current = ssTypes[0];
  for (let i = 1; i < ssTypes.length; i++) {
    if (ssTypes[i] !== current) {
      segments.push({ caSliceStart: start, caSliceEnd: i, ssType: current });
      start = i;
      current = ssTypes[i];
    }
  }
  segments.push({ caSliceStart: start, caSliceEnd: ssTypes.length, ssType: current });
  return segments;
}

// ─── Geometry builders ────────────────────────────────────────────────────────

const COIL_RADIUS = 0.25; // Å
const HELIX_HALF_WIDTH = 0.8; // Å — half-width of the ribbon cross-section
const HELIX_HALF_THICK = 0.15; // Å — half-thickness of the ribbon
const SHEET_RADIUS = 0.3; // Å — tube radius for the arrow shaft
const SHEET_ARROW_RADIUS = 0.75; // Å — arrowhead base radius
const SHEET_ARROW_LENGTH = 2.0; // Å — arrowhead cone height
const CURVE_SEGMENTS = 4; // radial segments for TubeGeometry

/** Extract 3D points for a slice of the chain backbone using current positions. */
function extractPoints(
  atomIndices: Uint32Array,
  start: number,
  end: number,
  positions: Float32Array,
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = start; i < end; i++) {
    const ai = atomIndices[i] * 3;
    pts.push(new THREE.Vector3(positions[ai], positions[ai + 1], positions[ai + 2]));
  }
  return pts;
}

/** Build a smooth CatmullRomCurve3 from control points, adding padding at ends to avoid flat caps. */
function makeCurve(pts: THREE.Vector3[]): THREE.CatmullRomCurve3 | null {
  if (pts.length < 2) return null;
  // Pad the curve with a reflected ghost point at each end so the first/last
  // segment isn't shortened by the catmull-rom tangent computation.
  const padded = [
    pts[0].clone().multiplyScalar(2).sub(pts[1] ?? pts[0]),
    ...pts,
    pts[pts.length - 1].clone().multiplyScalar(2).sub(pts[pts.length - 2] ?? pts[pts.length - 1]),
  ];
  return new THREE.CatmullRomCurve3(padded, false, "catmullrom", 0.5);
}

/** Coil segment: thin TubeGeometry. */
function buildCoilMesh(pts: THREE.Vector3[]): THREE.Mesh | null {
  const curve = makeCurve(pts);
  if (!curve) return null;
  const tubeSeg = Math.max(pts.length * 4, 8);
  const geo = new THREE.TubeGeometry(curve, tubeSeg, COIL_RADIUS, CURVE_SEGMENTS, false);
  const mat = new THREE.MeshPhongMaterial({ color: SS_COLORS[SS_COIL] });
  return new THREE.Mesh(geo, mat);
}

/** Helix segment: flat ribbon using a custom BufferGeometry along the backbone curve. */
function buildHelixMesh(pts: THREE.Vector3[]): THREE.Mesh | null {
  if (pts.length < 2) return null;
  const curve = makeCurve(pts);
  if (!curve) return null;

  const numSamples = Math.max(pts.length * 4, 8);
  const frenetFrames = curve.computeFrenetFrames(numSamples, false);

  const verts: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];

  // Build 4 vertices per sample (2 wide × 2 thick)
  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const pos = curve.getPoint(t);
    const N = frenetFrames.normals[i] ?? frenetFrames.normals[frenetFrames.normals.length - 1];
    const B = frenetFrames.binormals[i] ?? frenetFrames.binormals[frenetFrames.binormals.length - 1];

    // 4 corners of the rectangle cross-section: (±w, ±t)
    for (const sW of [-1, 1]) {
      for (const sT of [-1, 1]) {
        verts.push(
          pos.x + N.x * HELIX_HALF_WIDTH * sW + B.x * HELIX_HALF_THICK * sT,
          pos.y + N.y * HELIX_HALF_WIDTH * sW + B.y * HELIX_HALF_THICK * sT,
          pos.z + N.z * HELIX_HALF_WIDTH * sW + B.z * HELIX_HALF_THICK * sT,
        );
        // Approximate outward normal: blend N * sW + B * sT
        const nx = N.x * sW + B.x * sT;
        const ny = N.y * sW + B.y * sT;
        const nz = N.z * sW + B.z * sT;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        normals.push(nx / len, ny / len, nz / len);
      }
    }
  }

  // Connect each ring of 4 vertices to the next with 4 quads (8 triangles per step)
  for (let i = 0; i < numSamples; i++) {
    const base = i * 4;
    const next = base + 4;
    // top/bottom wide faces
    indices.push(base, next, base + 1, base + 1, next, next + 1);
    indices.push(base + 2, base + 3, next + 2, base + 3, next + 3, next + 2);
    // left/right narrow faces
    indices.push(base, base + 2, next, base + 2, next + 2, next);
    indices.push(base + 1, next + 1, base + 3, base + 3, next + 1, next + 3);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  const mat = new THREE.MeshPhongMaterial({ color: SS_COLORS[SS_HELIX], side: THREE.DoubleSide });
  return new THREE.Mesh(geo, mat);
}

/** Sheet segment: tube shaft + cone arrowhead at the C-terminal end. */
function buildSheetMesh(pts: THREE.Vector3[]): THREE.Group | null {
  if (pts.length < 2) return null;
  const group = new THREE.Group();

  // Shaft — leave room for the arrowhead (exclude last point from tube)
  const shaftPts = pts.length > 2 ? pts.slice(0, pts.length - 1) : pts;
  const curve = makeCurve(shaftPts);
  if (curve) {
    const tubeSeg = Math.max(shaftPts.length * 4, 8);
    const tubeGeo = new THREE.TubeGeometry(curve, tubeSeg, SHEET_RADIUS, CURVE_SEGMENTS, false);
    const tubeMat = new THREE.MeshPhongMaterial({ color: SS_COLORS[SS_SHEET] });
    group.add(new THREE.Mesh(tubeGeo, tubeMat));
  }

  // Arrowhead cone at the last Cα position, pointing toward the last tangent.
  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  const dir = new THREE.Vector3().subVectors(last, prev).normalize();
  const coneGeo = new THREE.ConeGeometry(SHEET_ARROW_RADIUS, SHEET_ARROW_LENGTH, 8);
  const coneMat = new THREE.MeshPhongMaterial({ color: SS_COLORS[SS_SHEET] });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  // THREE ConeGeometry points along +Y; align it to `dir`
  cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  cone.position.copy(last).addScaledVector(dir, SHEET_ARROW_LENGTH / 2);
  group.add(cone);

  return group;
}

// ─── CartoonRenderer class ────────────────────────────────────────────────────

export class CartoonRenderer {
  /** The THREE.Group containing all cartoon meshes; add to scene. */
  readonly mesh: THREE.Group;

  private snapshot: Snapshot | null = null;
  private chains: ChainBackbone[] = [];

  constructor() {
    this.mesh = new THREE.Group();
    this.mesh.visible = false;
  }

  /** Load a new snapshot (topology). Re-builds geometry from snapshot positions. */
  loadSnapshot(snapshot: Snapshot): void {
    this.snapshot = snapshot;
    this.chains = extractChainBackbones(snapshot);
    this._rebuild(snapshot.positions);
  }

  /** Update positions for a new trajectory frame (topology unchanged). */
  updatePositions(positions: Float32Array): void {
    if (!this.snapshot || this.chains.length === 0) return;
    this._rebuild(positions);
  }

  private _rebuild(positions: Float32Array): void {
    // Dispose existing children
    this.mesh.clear();

    for (const chain of this.chains) {
      const segments = buildSegments(chain.ssTypes);
      for (const seg of segments) {
        const pts = extractPoints(chain.atomIndices, seg.caSliceStart, seg.caSliceEnd, positions);
        let obj: THREE.Object3D | null = null;
        switch (seg.ssType) {
          case SS_HELIX:
            obj = buildHelixMesh(pts);
            break;
          case SS_SHEET:
            obj = buildSheetMesh(pts);
            break;
          default:
            obj = buildCoilMesh(pts);
        }
        if (obj) this.mesh.add(obj);
      }
    }
  }

  /** Show or hide the cartoon. */
  setVisible(v: boolean): void {
    this.mesh.visible = v;
  }

  /** Free all Three.js GPU resources. */
  dispose(): void {
    this.mesh.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          (obj.material as THREE.Material).dispose();
        }
      }
    });
    this.mesh.clear();
  }
}
