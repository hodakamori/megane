/**
 * InstancedMesh-based 3D arrow renderer for per-atom vector quantities.
 * Each arrow consists of a shaft (cylinder) + head (cone), rendered as
 * two separate InstancedMeshes within a Group.
 *
 * Arrows originate from atom positions and point in the vector direction.
 * Arrow length = |vector| * scale.
 */

import * as THREE from "three";

const ARROW_COLOR = 0xe74c3c; // red
const SHAFT_RADIUS = 0.04;
const HEAD_RADIUS = 0.1;
const HEAD_HEIGHT = 0.2;
const SHAFT_SEGMENTS = 6;
const HEAD_SEGMENTS = 8;
const EPSILON = 1e-6;

// Reusable temporaries
const _dir = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3();
const _mat = new THREE.Matrix4();

export class ArrowRenderer {
  readonly mesh: THREE.Group;
  private shaftMesh: THREE.InstancedMesh;
  private headMesh: THREE.InstancedMesh;
  private nAtoms = 0;
  private positions: Float32Array | null = null;
  private vectors: Float32Array | null = null;
  private arrowScale = 1.0;
  private capacity: number;

  constructor(maxAtoms = 100_000) {
    this.capacity = maxAtoms;
    this.mesh = new THREE.Group();
    this.mesh.visible = false;

    // Shaft geometry: cylinder along Y, bottom at y=0, top at y=1
    const shaftGeo = new THREE.CylinderGeometry(SHAFT_RADIUS, SHAFT_RADIUS, 1, SHAFT_SEGMENTS);
    // Shift so bottom is at origin, top at y=1
    shaftGeo.translate(0, 0.5, 0);

    // Head geometry: cone along Y, bottom at y=0, top at y=HEAD_HEIGHT
    const headGeo = new THREE.ConeGeometry(HEAD_RADIUS, HEAD_HEIGHT, HEAD_SEGMENTS);
    headGeo.translate(0, HEAD_HEIGHT / 2, 0);

    const shaftMat = new THREE.MeshPhongMaterial({
      color: ARROW_COLOR,
      transparent: true,
      opacity: 0.85,
    });
    const headMat = new THREE.MeshPhongMaterial({
      color: ARROW_COLOR,
      transparent: true,
      opacity: 0.85,
    });

    this.shaftMesh = new THREE.InstancedMesh(shaftGeo, shaftMat, maxAtoms);
    this.headMesh = new THREE.InstancedMesh(headGeo, headMat, maxAtoms);
    this.shaftMesh.count = 0;
    this.headMesh.count = 0;

    this.mesh.add(this.shaftMesh);
    this.mesh.add(this.headMesh);
  }

  setAtomPositions(positions: Float32Array, nAtoms: number): void {
    this.positions = positions;
    this.nAtoms = nAtoms;
    if (this.vectors) this.update();
  }

  setVectors(vectors: Float32Array | null): void {
    this.vectors = vectors;
    if (vectors) {
      this.mesh.visible = true;
      this.update();
    } else {
      this.mesh.visible = false;
      this.shaftMesh.count = 0;
      this.headMesh.count = 0;
    }
  }

  setScale(scale: number): void {
    this.arrowScale = scale;
    if (this.vectors) this.update();
  }

  private update(): void {
    if (!this.positions || !this.vectors) return;

    const n = Math.min(this.nAtoms, this.capacity);
    this.shaftMesh.count = n;
    this.headMesh.count = n;

    for (let i = 0; i < n; i++) {
      const ox = this.positions[i * 3];
      const oy = this.positions[i * 3 + 1];
      const oz = this.positions[i * 3 + 2];

      const vx = this.vectors[i * 3];
      const vy = this.vectors[i * 3 + 1];
      const vz = this.vectors[i * 3 + 2];

      const mag = Math.sqrt(vx * vx + vy * vy + vz * vz);

      if (mag < EPSILON) {
        // Zero vector: hide this instance by scaling to 0
        _mat.makeScale(0, 0, 0);
        this.shaftMesh.setMatrixAt(i, _mat);
        this.headMesh.setMatrixAt(i, _mat);
        continue;
      }

      // Direction vector
      _dir.set(vx / mag, vy / mag, vz / mag);

      // Rotation from Y-up to direction
      _quat.setFromUnitVectors(_up, _dir);

      const arrowLen = mag * this.arrowScale;
      const shaftLen = Math.max(arrowLen - HEAD_HEIGHT, arrowLen * 0.7);

      // Shaft: position at atom, scale Y to shaft length
      _pos.set(ox, oy, oz);
      _scale.set(1, shaftLen, 1);
      _mat.compose(_pos, _quat, _scale);
      this.shaftMesh.setMatrixAt(i, _mat);

      // Head: position at tip of shaft
      _pos.set(ox + _dir.x * shaftLen, oy + _dir.y * shaftLen, oz + _dir.z * shaftLen);
      _scale.set(1, 1, 1);
      _mat.compose(_pos, _quat, _scale);
      this.headMesh.setMatrixAt(i, _mat);
    }

    this.shaftMesh.instanceMatrix.needsUpdate = true;
    this.headMesh.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.shaftMesh.geometry.dispose();
    this.headMesh.geometry.dispose();
    (this.shaftMesh.material as THREE.Material).dispose();
    (this.headMesh.material as THREE.Material).dispose();
    this.mesh.remove(this.shaftMesh);
    this.mesh.remove(this.headMesh);
  }
}
