/**
 * Instanced mesh for rendering atoms as spheres.
 * Uses InstancedMesh with direct Float32Array buffer manipulation for performance.
 */

import * as THREE from "three";
import type { Snapshot } from "./types";
import { getColor, getRadius, BALL_STICK_ATOM_SCALE } from "./constants";

export class AtomMesh {
  readonly mesh: THREE.InstancedMesh;
  private nAtoms = 0;

  constructor(maxAtoms: number = 1_000_000) {
    const segments = this.selectLOD(maxAtoms);
    const geometry = new THREE.SphereGeometry(1, segments, segments);
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.4,
      metalness: 0.1,
    });

    this.mesh = new THREE.InstancedMesh(geometry, material, maxAtoms);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
  }

  /** Select sphere segment count based on atom count (LOD). */
  private selectLOD(nAtoms: number): number {
    if (nAtoms > 500_000) return 4;
    if (nAtoms > 100_000) return 8;
    return 16;
  }

  /** Update atom positions and colors from a snapshot. */
  loadSnapshot(snapshot: Snapshot): void {
    const { nAtoms, positions, elements } = snapshot;
    this.nAtoms = nAtoms;

    // Rebuild if LOD should change
    if (this.mesh.count > 0) {
      const oldLOD = this.selectLOD(this.mesh.count);
      const newLOD = this.selectLOD(nAtoms);
      if (oldLOD !== newLOD) {
        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.SphereGeometry(1, newLOD, newLOD);
      }
    }

    this.mesh.count = nAtoms;

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    for (let i = 0; i < nAtoms; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const r = getRadius(elements[i]) * BALL_STICK_ATOM_SCALE;

      matrix.makeScale(r, r, r);
      matrix.setPosition(x, y, z);
      this.mesh.setMatrixAt(i, matrix);

      const [cr, cg, cb] = getColor(elements[i]);
      color.setRGB(cr, cg, cb);
      this.mesh.setColorAt(i, color);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }
  }

  /** Update only positions (for trajectory frames). */
  updatePositions(positions: Float32Array): void {
    const matrix = new THREE.Matrix4();
    const tmpMatrix = new THREE.Matrix4();

    for (let i = 0; i < this.nAtoms; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      // Get existing matrix to preserve scale
      this.mesh.getMatrixAt(i, tmpMatrix);
      const sx = new THREE.Vector3();
      tmpMatrix.decompose(new THREE.Vector3(), new THREE.Quaternion(), sx);

      matrix.makeScale(sx.x, sx.y, sx.z);
      matrix.setPosition(x, y, z);
      this.mesh.setMatrixAt(i, matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
