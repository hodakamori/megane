/**
 * Instanced mesh for rendering bonds as cylinders.
 * Each bond is a cylinder oriented along the bond vector.
 */

import * as THREE from "three";
import type { Snapshot } from "./types";
import { getColor, BOND_RADIUS } from "./constants";

const _va = new THREE.Vector3();
const _vb = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _matrix = new THREE.Matrix4();
const _color = new THREE.Color();

export class BondMesh {
  readonly mesh: THREE.InstancedMesh;
  private nBonds = 0;

  constructor(maxBonds: number = 1_000_000) {
    // Unit cylinder: radius=1, height=1, centered at origin, along Y axis
    const geometry = new THREE.CylinderGeometry(1, 1, 1, 6, 1);
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.4,
      metalness: 0.1,
    });

    this.mesh = new THREE.InstancedMesh(geometry, material, maxBonds);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
  }

  /** Build bond instances from snapshot data. */
  loadSnapshot(snapshot: Snapshot): void {
    const { nBonds, positions, elements, bonds } = snapshot;
    this.nBonds = nBonds;
    this.mesh.count = nBonds;

    for (let i = 0; i < nBonds; i++) {
      const ai = bonds[i * 2];
      const bi = bonds[i * 2 + 1];

      this.computeBondMatrix(positions, ai, bi, i);

      // Bond color: average of the two atom colors
      const [r1, g1, b1] = getColor(elements[ai]);
      const [r2, g2, b2] = getColor(elements[bi]);
      _color.setRGB((r1 + r2) / 2, (g1 + g2) / 2, (b1 + b2) / 2);
      this.mesh.setColorAt(i, _color);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }
  }

  /** Update bond positions for a new frame. */
  updatePositions(
    positions: Float32Array,
    bonds: Uint32Array,
    nBonds: number
  ): void {
    for (let i = 0; i < nBonds; i++) {
      const ai = bonds[i * 2];
      const bi = bonds[i * 2 + 1];
      this.computeBondMatrix(positions, ai, bi, i);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  /** Compute the transform matrix for a single bond cylinder. */
  private computeBondMatrix(
    positions: Float32Array,
    ai: number,
    bi: number,
    instanceIdx: number
  ): void {
    _va.set(positions[ai * 3], positions[ai * 3 + 1], positions[ai * 3 + 2]);
    _vb.set(positions[bi * 3], positions[bi * 3 + 1], positions[bi * 3 + 2]);

    _mid.addVectors(_va, _vb).multiplyScalar(0.5);
    _dir.subVectors(_vb, _va);
    const length = _dir.length();
    _dir.normalize();

    // Quaternion that rotates Y-axis to bond direction
    _quat.setFromUnitVectors(_up, _dir);

    _matrix.compose(
      _mid,
      _quat,
      new THREE.Vector3(BOND_RADIUS, length, BOND_RADIUS)
    );

    this.mesh.setMatrixAt(instanceIdx, _matrix);
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
