/**
 * Instanced mesh for rendering bonds as cylinders.
 * Supports bond orders: single (1 cylinder), double (2 parallel),
 * triple (3 in triangle), aromatic (1 solid + 1 lighter offset).
 */

import * as THREE from "three";
import type { Snapshot } from "./types";
import {
  getColor,
  BOND_RADIUS,
  BOND_SINGLE,
  BOND_DOUBLE,
  BOND_TRIPLE,
  BOND_AROMATIC,
  DOUBLE_BOND_OFFSET,
  DOUBLE_BOND_RADIUS,
  TRIPLE_BOND_OFFSET,
  TRIPLE_BOND_RADIUS,
  AROMATIC_BOND_RADIUS,
  AROMATIC_DASH_RADIUS,
} from "./constants";

const _va = new THREE.Vector3();
const _vb = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _perp = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _fallback = new THREE.Vector3(1, 0, 0);
const _quat = new THREE.Quaternion();
const _matrix = new THREE.Matrix4();
const _color = new THREE.Color();
const _scale = new THREE.Vector3();
const _offset = new THREE.Vector3();

/** Per-visual-bond info for trajectory updates. */
interface VisualBond {
  ai: number;
  bi: number;
  radius: number;
  offsetDir: THREE.Vector3; // perpendicular offset direction
  offsetMag: number; // offset magnitude
}

export class BondMesh {
  readonly mesh: THREE.InstancedMesh;
  private visualBonds: VisualBond[] = [];

  constructor(maxInstances: number = 3_000_000) {
    const geometry = new THREE.CylinderGeometry(1, 1, 1, 6, 1);
    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.35,
      metalness: 0.05,
      clearcoat: 0.1,
    });

    this.mesh = new THREE.InstancedMesh(geometry, material, maxInstances);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
  }

  /** Build bond instances from snapshot data. */
  loadSnapshot(snapshot: Snapshot): void {
    const { nBonds, positions, elements, bonds, bondOrders } = snapshot;
    this.visualBonds = [];

    let instanceIdx = 0;

    for (let i = 0; i < nBonds; i++) {
      const ai = bonds[i * 2];
      const bi = bonds[i * 2 + 1];
      const order = bondOrders ? bondOrders[i] : BOND_SINGLE;

      // Compute bond direction for perpendicular offset
      _va.set(positions[ai * 3], positions[ai * 3 + 1], positions[ai * 3 + 2]);
      _vb.set(positions[bi * 3], positions[bi * 3 + 1], positions[bi * 3 + 2]);
      _dir.subVectors(_vb, _va).normalize();

      // Perpendicular direction
      _perp.crossVectors(_dir, _up);
      if (_perp.lengthSq() < 0.001) {
        _perp.crossVectors(_dir, _fallback);
      }
      _perp.normalize();

      // Bond color
      const [r1, g1, b1] = getColor(elements[ai]);
      const [r2, g2, b2] = getColor(elements[bi]);
      const cr = (r1 + r2) / 2;
      const cg = (g1 + g2) / 2;
      const cb = (b1 + b2) / 2;

      if (order === BOND_DOUBLE) {
        // Two parallel cylinders
        for (const sign of [-1, 1]) {
          const perpDir = _perp.clone();
          this.visualBonds.push({
            ai,
            bi,
            radius: DOUBLE_BOND_RADIUS,
            offsetDir: perpDir,
            offsetMag: sign * DOUBLE_BOND_OFFSET,
          });
          this.setCylinderAt(
            instanceIdx,
            positions,
            ai,
            bi,
            DOUBLE_BOND_RADIUS,
            perpDir,
            sign * DOUBLE_BOND_OFFSET,
          );
          _color.setRGB(cr, cg, cb);
          this.mesh.setColorAt(instanceIdx, _color);
          instanceIdx++;
        }
      } else if (order === BOND_TRIPLE) {
        // Three cylinders in triangular arrangement
        const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
        const perpX = _perp.clone();
        const perpY = new THREE.Vector3().crossVectors(_dir, perpX).normalize();
        for (const angle of angles) {
          const offDir = perpX
            .clone()
            .multiplyScalar(Math.cos(angle))
            .addScaledVector(perpY, Math.sin(angle));
          this.visualBonds.push({
            ai,
            bi,
            radius: TRIPLE_BOND_RADIUS,
            offsetDir: offDir,
            offsetMag: TRIPLE_BOND_OFFSET,
          });
          this.setCylinderAt(
            instanceIdx,
            positions,
            ai,
            bi,
            TRIPLE_BOND_RADIUS,
            offDir,
            TRIPLE_BOND_OFFSET,
          );
          _color.setRGB(cr, cg, cb);
          this.mesh.setColorAt(instanceIdx, _color);
          instanceIdx++;
        }
      } else if (order === BOND_AROMATIC) {
        // Solid cylinder
        const zeroDir = new THREE.Vector3(0, 0, 0);
        this.visualBonds.push({
          ai,
          bi,
          radius: AROMATIC_BOND_RADIUS,
          offsetDir: zeroDir,
          offsetMag: 0,
        });
        this.setCylinderAt(
          instanceIdx,
          positions,
          ai,
          bi,
          AROMATIC_BOND_RADIUS,
          zeroDir,
          0,
        );
        _color.setRGB(cr, cg, cb);
        this.mesh.setColorAt(instanceIdx, _color);
        instanceIdx++;

        // Second lighter/thinner offset cylinder (represents aromatic)
        const perpDir = _perp.clone();
        this.visualBonds.push({
          ai,
          bi,
          radius: AROMATIC_DASH_RADIUS,
          offsetDir: perpDir,
          offsetMag: DOUBLE_BOND_OFFSET,
        });
        this.setCylinderAt(
          instanceIdx,
          positions,
          ai,
          bi,
          AROMATIC_DASH_RADIUS,
          perpDir,
          DOUBLE_BOND_OFFSET,
        );
        // Lighter color for aromatic "dashed" bond
        _color.setRGB(
          Math.min(1, cr + 0.3),
          Math.min(1, cg + 0.3),
          Math.min(1, cb + 0.3),
        );
        this.mesh.setColorAt(instanceIdx, _color);
        instanceIdx++;
      } else {
        // Single bond
        const zeroDir = new THREE.Vector3(0, 0, 0);
        this.visualBonds.push({
          ai,
          bi,
          radius: BOND_RADIUS,
          offsetDir: zeroDir,
          offsetMag: 0,
        });
        this.setCylinderAt(
          instanceIdx,
          positions,
          ai,
          bi,
          BOND_RADIUS,
          zeroDir,
          0,
        );
        _color.setRGB(cr, cg, cb);
        this.mesh.setColorAt(instanceIdx, _color);
        instanceIdx++;
      }
    }

    this.mesh.count = instanceIdx;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }
  }

  /** Update bond positions for a new frame. */
  updatePositions(
    positions: Float32Array,
    bonds: Uint32Array,
    nBonds: number,
  ): void {
    for (let i = 0; i < this.visualBonds.length; i++) {
      const vb = this.visualBonds[i];
      this.setCylinderAt(
        i,
        positions,
        vb.ai,
        vb.bi,
        vb.radius,
        vb.offsetDir,
        vb.offsetMag,
      );
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  /** Set a cylinder instance at the given index. */
  private setCylinderAt(
    instanceIdx: number,
    positions: Float32Array,
    ai: number,
    bi: number,
    radius: number,
    offsetDir: THREE.Vector3,
    offsetMag: number,
  ): void {
    _va.set(positions[ai * 3], positions[ai * 3 + 1], positions[ai * 3 + 2]);
    _vb.set(positions[bi * 3], positions[bi * 3 + 1], positions[bi * 3 + 2]);

    // Apply perpendicular offset
    if (offsetMag !== 0) {
      _offset.copy(offsetDir).multiplyScalar(offsetMag);
      _va.add(_offset);
      _vb.add(_offset);
    }

    _mid.addVectors(_va, _vb).multiplyScalar(0.5);
    _dir.subVectors(_vb, _va);
    const length = _dir.length();
    _dir.normalize();

    _quat.setFromUnitVectors(_up, _dir);
    _scale.set(radius, length, radius);
    _matrix.compose(_mid, _quat, _scale);

    this.mesh.setMatrixAt(instanceIdx, _matrix);
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
