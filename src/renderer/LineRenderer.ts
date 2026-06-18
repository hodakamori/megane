/**
 * Line / wireframe representation renderer (VMD "Lines" / PyMOL "lines" style).
 *
 * Draws the molecule as thin GL line segments instead of spheres + cylinders:
 *  - Each bond is split at its midpoint into two segments, each colored with the
 *    CPK color of its nearer atom (two-tone, like VMD).
 *  - Atoms that participate in no bond are drawn as a small 3-axis cross so lone
 *    atoms / ions remain visible.
 *
 * GL line width is effectively 1px on most WebGL platforms (the `linewidth`
 * material property is ignored), which matches the thin-line look of VMD/PyMOL.
 *
 * Data flows in via loadSnapshot() (first frame, allocates buffers) and
 * updatePositions() (trajectory frames, rewrites vertex positions in place).
 * The renderer owns a THREE.LineSegments that MoleculeRenderer adds to the scene.
 */

import * as THREE from "three";
import type { Snapshot } from "../types";
import { getColor } from "../constants";

/** Half-length of each arm of the cross drawn for a bondless atom, in Å. */
const LONE_ATOM_CROSS_RADIUS = 0.2;

export class LineRenderer {
  /** The THREE.LineSegments holding all line geometry; add to scene. */
  readonly mesh: THREE.LineSegments;

  private snapshot: Snapshot | null = null;
  /** Pairs of atom indices (a, b) for each two-tone bond half segment, plus the
   *  vertex it owns. We store, per vertex, the atom index it tracks so trajectory
   *  updates can recompute positions. -1 marks the midpoint of a bond. */
  private segmentSpec: SegmentVertex[] = [];
  /** When set, only atoms flagged here (`mask[i] === 1`) are drawn as lines —
   *  used by per-atom representation to render one species as lines while the
   *  rest stays ball-and-stick. `null` draws the whole structure. */
  private lineMask: Uint8Array | null = null;

  constructor() {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ vertexColors: true });
    this.mesh = new THREE.LineSegments(geometry, material);
    this.mesh.visible = false;
    this.mesh.frustumCulled = false;
  }

  /**
   * Load a new snapshot (topology). Allocates buffers and builds geometry.
   * When `lineMask` is given, only atoms flagged in it (and bonds whose *both*
   * endpoints are flagged) are drawn — the rest are left to the mesh renderers.
   */
  loadSnapshot(snapshot: Snapshot, lineMask: Uint8Array | null = null): void {
    this.snapshot = snapshot;
    this.lineMask = lineMask;
    this._build(snapshot);
  }

  /** Update positions for a new trajectory frame (topology unchanged). */
  updatePositions(positions: Float32Array): void {
    if (!this.snapshot) return;
    this._writePositions(positions);
    const attr = this.mesh.geometry.getAttribute("position");
    if (attr) attr.needsUpdate = true;
  }

  /** Show or hide the lines. */
  setVisible(v: boolean): void {
    this.mesh.visible = v;
  }

  /** Free all Three.js GPU resources. */
  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }

  private _build(snapshot: Snapshot): void {
    const { nAtoms, nBonds, bonds, elements } = snapshot;
    const mask = this.lineMask;
    const inMask = (i: number): boolean => !mask || mask[i] === 1;
    // Only bonds whose both endpoints are line atoms are drawn as lines.
    const bondShown = (i: number): boolean => inMask(bonds[i * 2]) && inMask(bonds[i * 2 + 1]);

    // Track which atoms have at least one *shown* bond so we can cross-mark the
    // rest (only line atoms get a cross when masking is active).
    const bonded = new Uint8Array(nAtoms);
    for (let i = 0; i < nBonds; i++) {
      if (!bondShown(i)) continue;
      bonded[bonds[i * 2]] = 1;
      bonded[bonds[i * 2 + 1]] = 1;
    }
    let nLone = 0;
    let nShownBonds = 0;
    for (let i = 0; i < nBonds; i++) if (bondShown(i)) nShownBonds++;
    for (let i = 0; i < nAtoms; i++) if (!bonded[i] && inMask(i)) nLone++;

    // Vertex budget: each shown bond → 2 segments (4 verts); each lone line atom
    // → 3 crosses (6 verts).
    const nVerts = nShownBonds * 4 + nLone * 6;
    const positionsArr = new Float32Array(nVerts * 3);
    const colorsArr = new Float32Array(nVerts * 3);
    const spec: SegmentVertex[] = new Array(nVerts);

    let v = 0;
    const setColor = (idx: number, rgb: [number, number, number]): void => {
      colorsArr[idx * 3] = rgb[0];
      colorsArr[idx * 3 + 1] = rgb[1];
      colorsArr[idx * 3 + 2] = rgb[2];
    };

    // Two-tone bond segments: a→mid (color a), mid→b (color b).
    for (let i = 0; i < nBonds; i++) {
      if (!bondShown(i)) continue;
      const ai = bonds[i * 2];
      const bi = bonds[i * 2 + 1];
      const ca = getColor(elements[ai]);
      const cb = getColor(elements[bi]);
      // segment 1: atom a  → midpoint, colored with atom a
      spec[v] = { atom: ai };
      setColor(v, ca);
      v++;
      spec[v] = { mid: [ai, bi] };
      setColor(v, ca);
      v++;
      // segment 2: midpoint → atom b, colored with atom b
      spec[v] = { mid: [ai, bi] };
      setColor(v, cb);
      v++;
      spec[v] = { atom: bi };
      setColor(v, cb);
      v++;
    }

    // Lone-atom crosses: 3 axis-aligned segments through the atom position.
    for (let i = 0; i < nAtoms; i++) {
      if (bonded[i] || !inMask(i)) continue;
      const c = getColor(elements[i]);
      for (const axis of [0, 1, 2] as const) {
        spec[v] = { atom: i, crossAxis: axis, crossSign: -1 };
        setColor(v, c);
        v++;
        spec[v] = { atom: i, crossAxis: axis, crossSign: 1 };
        setColor(v, c);
        v++;
      }
    }

    this.segmentSpec = spec;
    this.mesh.geometry.setAttribute("position", new THREE.BufferAttribute(positionsArr, 3));
    this.mesh.geometry.setAttribute("color", new THREE.BufferAttribute(colorsArr, 3));
    this._writePositions(snapshot.positions);
    this.mesh.geometry.getAttribute("position").needsUpdate = true;
  }

  private _writePositions(positions: Float32Array): void {
    const attr = this.mesh.geometry.getAttribute("position");
    if (!attr) return;
    const arr = attr.array as Float32Array;
    const spec = this.segmentSpec;
    for (let v = 0; v < spec.length; v++) {
      const s = spec[v];
      let x: number;
      let y: number;
      let z: number;
      if (s.mid) {
        const [a, b] = s.mid;
        x = (positions[a * 3] + positions[b * 3]) * 0.5;
        y = (positions[a * 3 + 1] + positions[b * 3 + 1]) * 0.5;
        z = (positions[a * 3 + 2] + positions[b * 3 + 2]) * 0.5;
      } else {
        const a = s.atom!;
        x = positions[a * 3];
        y = positions[a * 3 + 1];
        z = positions[a * 3 + 2];
        if (s.crossAxis !== undefined) {
          const d = LONE_ATOM_CROSS_RADIUS * (s.crossSign ?? 1);
          if (s.crossAxis === 0) x += d;
          else if (s.crossAxis === 1) y += d;
          else z += d;
        }
      }
      arr[v * 3] = x;
      arr[v * 3 + 1] = y;
      arr[v * 3 + 2] = z;
    }
  }
}

/** Describes how a single line vertex derives its position from atom data. */
interface SegmentVertex {
  /** Atom index this vertex tracks (for atom endpoints and cross marks). */
  atom?: number;
  /** Midpoint between two atoms (bond split point). */
  mid?: [number, number];
  /** For lone-atom crosses: which axis (0=x,1=y,2=z) the arm extends along. */
  crossAxis?: 0 | 1 | 2;
  /** Direction of the cross arm along its axis. */
  crossSign?: -1 | 1;
}
