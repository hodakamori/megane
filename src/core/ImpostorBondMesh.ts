/**
 * Billboard impostor cylinder renderer for bonds.
 *
 * Each bond is a screen-aligned quad stretched between two atom positions.
 * Fragment shader applies cylinder-like shading.
 * Supports bond orders: single, double, triple, aromatic (dashed).
 * Single instanced draw call for all bonds.
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
import { bondVertexShader, bondFragmentShader } from "./shaders";

const _dir = new THREE.Vector3();
const _perp = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _fallback = new THREE.Vector3(1, 0, 0);

/** Per-visual-bond info for trajectory updates. */
interface VisualBondInfo {
  ai: number;
  bi: number;
  radius: number;
  offsetX: number; // perpendicular offset in perp direction
  offsetY: number; // perpendicular offset in cross(dir, perp) direction
  dashed: number; // 0 or 1
}

export class ImpostorBondMesh {
  readonly mesh: THREE.Mesh;
  private geo: THREE.InstancedBufferGeometry;

  private startAttr: THREE.InstancedBufferAttribute;
  private endAttr: THREE.InstancedBufferAttribute;
  private colorAttr: THREE.InstancedBufferAttribute;
  private radiusAttr: THREE.InstancedBufferAttribute;
  private dashedAttr: THREE.InstancedBufferAttribute;

  private startBuf: Float32Array;
  private endBuf: Float32Array;
  private colorBuf: Float32Array;
  private radiusBuf: Float32Array;
  private dashedBuf: Float32Array;

  private visualBonds: VisualBondInfo[] = [];
  private capacity: number;

  constructor(maxBonds: number = 3_000_000) {
    this.capacity = maxBonds;

    // Quad: 2 triangles, XY in [-1, 1]
    this.geo = new THREE.InstancedBufferGeometry();
    const verts = new Float32Array([
      -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0,
    ]);
    const uvs = new Float32Array([
      -1, -1, 1, -1, 1, 1, -1, 1,
    ]);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
    this.geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    this.geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    this.geo.setIndex(new THREE.BufferAttribute(indices, 1));
    this.geo.instanceCount = 0;

    // Instance buffers
    this.startBuf = new Float32Array(maxBonds * 3);
    this.endBuf = new Float32Array(maxBonds * 3);
    this.colorBuf = new Float32Array(maxBonds * 3);
    this.radiusBuf = new Float32Array(maxBonds);
    this.dashedBuf = new Float32Array(maxBonds);

    this.startAttr = new THREE.InstancedBufferAttribute(this.startBuf, 3);
    this.endAttr = new THREE.InstancedBufferAttribute(this.endBuf, 3);
    this.colorAttr = new THREE.InstancedBufferAttribute(this.colorBuf, 3);
    this.radiusAttr = new THREE.InstancedBufferAttribute(this.radiusBuf, 1);
    this.dashedAttr = new THREE.InstancedBufferAttribute(this.dashedBuf, 1);

    this.startAttr.setUsage(THREE.DynamicDrawUsage);
    this.endAttr.setUsage(THREE.DynamicDrawUsage);

    this.geo.setAttribute("instanceStart", this.startAttr);
    this.geo.setAttribute("instanceEnd", this.endAttr);
    this.geo.setAttribute("instanceColor", this.colorAttr);
    this.geo.setAttribute("instanceRadius", this.radiusAttr);
    this.geo.setAttribute("instanceDashed", this.dashedAttr);

    const material = new THREE.RawShaderMaterial({
      vertexShader: bondVertexShader,
      fragmentShader: bondFragmentShader,
      depthWrite: true,
      depthTest: true,
    });

    this.mesh = new THREE.Mesh(this.geo, material);
    this.mesh.frustumCulled = false;
  }

  loadSnapshot(snapshot: Snapshot): void {
    const { nBonds, positions, elements, bonds, bondOrders } = snapshot;
    this.visualBonds = [];

    // Count total visual instances
    let totalInstances = 0;
    for (let i = 0; i < nBonds; i++) {
      const order = bondOrders ? bondOrders[i] : BOND_SINGLE;
      if (order === BOND_DOUBLE) totalInstances += 2;
      else if (order === BOND_TRIPLE) totalInstances += 3;
      else if (order === BOND_AROMATIC) totalInstances += 2;
      else totalInstances += 1;
    }

    if (totalInstances > this.capacity) {
      this.grow(totalInstances);
    }

    let idx = 0;

    for (let i = 0; i < nBonds; i++) {
      const ai = bonds[i * 2];
      const bi = bonds[i * 2 + 1];
      const order = bondOrders ? bondOrders[i] : BOND_SINGLE;

      // Bond direction for perpendicular offset computation
      _dir.set(
        positions[bi * 3] - positions[ai * 3],
        positions[bi * 3 + 1] - positions[ai * 3 + 1],
        positions[bi * 3 + 2] - positions[ai * 3 + 2],
      ).normalize();

      _perp.crossVectors(_dir, _up);
      if (_perp.lengthSq() < 0.001) {
        _perp.crossVectors(_dir, _fallback);
      }
      _perp.normalize();

      // Colors
      const [r1, g1, b1] = getColor(elements[ai]);
      const [r2, g2, b2] = getColor(elements[bi]);
      const cr = (r1 + r2) * 0.5;
      const cg = (g1 + g2) * 0.5;
      const cb = (b1 + b2) * 0.5;

      if (order === BOND_DOUBLE) {
        for (const sign of [-1, 1]) {
          this.visualBonds.push({
            ai, bi,
            radius: DOUBLE_BOND_RADIUS,
            offsetX: sign * DOUBLE_BOND_OFFSET,
            offsetY: 0,
            dashed: 0,
          });
          this.setInstance(idx, positions, ai, bi, DOUBLE_BOND_RADIUS,
            _perp, sign * DOUBLE_BOND_OFFSET, cr, cg, cb, 0);
          idx++;
        }
      } else if (order === BOND_TRIPLE) {
        const perpY = new THREE.Vector3().crossVectors(_dir, _perp).normalize();
        const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
        for (const angle of angles) {
          const ox = Math.cos(angle) * TRIPLE_BOND_OFFSET;
          const oy = Math.sin(angle) * TRIPLE_BOND_OFFSET;
          this.visualBonds.push({
            ai, bi,
            radius: TRIPLE_BOND_RADIUS,
            offsetX: ox,
            offsetY: oy,
            dashed: 0,
          });
          // Combined offset: perp * ox + perpY * oy
          const offDir = _perp.clone().multiplyScalar(ox).addScaledVector(perpY, oy);
          this.setInstanceWithOffset(idx, positions, ai, bi, TRIPLE_BOND_RADIUS,
            offDir, cr, cg, cb, 0);
          idx++;
        }
      } else if (order === BOND_AROMATIC) {
        // Solid bond
        this.visualBonds.push({
          ai, bi,
          radius: AROMATIC_BOND_RADIUS,
          offsetX: 0,
          offsetY: 0,
          dashed: 0,
        });
        this.setInstance(idx, positions, ai, bi, AROMATIC_BOND_RADIUS,
          _perp, 0, cr, cg, cb, 0);
        idx++;

        // Dashed offset bond
        this.visualBonds.push({
          ai, bi,
          radius: AROMATIC_DASH_RADIUS,
          offsetX: DOUBLE_BOND_OFFSET,
          offsetY: 0,
          dashed: 1,
        });
        this.setInstance(idx, positions, ai, bi, AROMATIC_DASH_RADIUS,
          _perp, DOUBLE_BOND_OFFSET, cr, cg, cb, 1);
        idx++;
      } else {
        // Single bond
        this.visualBonds.push({
          ai, bi,
          radius: BOND_RADIUS,
          offsetX: 0,
          offsetY: 0,
          dashed: 0,
        });
        this.setInstance(idx, positions, ai, bi, BOND_RADIUS,
          _perp, 0, cr, cg, cb, 0);
        idx++;
      }
    }

    this.startAttr.needsUpdate = true;
    this.endAttr.needsUpdate = true;
    this.colorAttr.needsUpdate = true;
    this.radiusAttr.needsUpdate = true;
    this.dashedAttr.needsUpdate = true;
    this.geo.instanceCount = idx;
  }

  updatePositions(
    positions: Float32Array,
    bonds: Uint32Array,
    nBonds: number,
  ): void {
    for (let i = 0; i < this.visualBonds.length; i++) {
      const vb = this.visualBonds[i];
      const ai = vb.ai;
      const bi = vb.bi;
      const ai3 = ai * 3;
      const bi3 = bi * 3;
      const i3 = i * 3;

      // Recompute perpendicular for this bond
      _dir.set(
        positions[bi3] - positions[ai3],
        positions[bi3 + 1] - positions[ai3 + 1],
        positions[bi3 + 2] - positions[ai3 + 2],
      ).normalize();
      _perp.crossVectors(_dir, _up);
      if (_perp.lengthSq() < 0.001) {
        _perp.crossVectors(_dir, _fallback);
      }
      _perp.normalize();

      if (vb.offsetX === 0 && vb.offsetY === 0) {
        this.startBuf[i3] = positions[ai3];
        this.startBuf[i3 + 1] = positions[ai3 + 1];
        this.startBuf[i3 + 2] = positions[ai3 + 2];
        this.endBuf[i3] = positions[bi3];
        this.endBuf[i3 + 1] = positions[bi3 + 1];
        this.endBuf[i3 + 2] = positions[bi3 + 2];
      } else {
        const perpY = new THREE.Vector3().crossVectors(_dir, _perp).normalize();
        const ox = _perp.x * vb.offsetX + perpY.x * vb.offsetY;
        const oy = _perp.y * vb.offsetX + perpY.y * vb.offsetY;
        const oz = _perp.z * vb.offsetX + perpY.z * vb.offsetY;
        this.startBuf[i3] = positions[ai3] + ox;
        this.startBuf[i3 + 1] = positions[ai3 + 1] + oy;
        this.startBuf[i3 + 2] = positions[ai3 + 2] + oz;
        this.endBuf[i3] = positions[bi3] + ox;
        this.endBuf[i3 + 1] = positions[bi3 + 1] + oy;
        this.endBuf[i3 + 2] = positions[bi3 + 2] + oz;
      }
    }

    this.startAttr.needsUpdate = true;
    this.endAttr.needsUpdate = true;
  }

  private setInstance(
    idx: number,
    positions: Float32Array,
    ai: number,
    bi: number,
    radius: number,
    perp: THREE.Vector3,
    offset: number,
    cr: number,
    cg: number,
    cb: number,
    dashed: number,
  ): void {
    const ai3 = ai * 3;
    const bi3 = bi * 3;
    const i3 = idx * 3;

    const ox = perp.x * offset;
    const oy = perp.y * offset;
    const oz = perp.z * offset;

    this.startBuf[i3] = positions[ai3] + ox;
    this.startBuf[i3 + 1] = positions[ai3 + 1] + oy;
    this.startBuf[i3 + 2] = positions[ai3 + 2] + oz;

    this.endBuf[i3] = positions[bi3] + ox;
    this.endBuf[i3 + 1] = positions[bi3 + 1] + oy;
    this.endBuf[i3 + 2] = positions[bi3 + 2] + oz;

    this.colorBuf[i3] = cr;
    this.colorBuf[i3 + 1] = cg;
    this.colorBuf[i3 + 2] = cb;

    this.radiusBuf[idx] = radius;
    this.dashedBuf[idx] = dashed;
  }

  private setInstanceWithOffset(
    idx: number,
    positions: Float32Array,
    ai: number,
    bi: number,
    radius: number,
    offsetDir: THREE.Vector3,
    cr: number,
    cg: number,
    cb: number,
    dashed: number,
  ): void {
    const ai3 = ai * 3;
    const bi3 = bi * 3;
    const i3 = idx * 3;

    this.startBuf[i3] = positions[ai3] + offsetDir.x;
    this.startBuf[i3 + 1] = positions[ai3 + 1] + offsetDir.y;
    this.startBuf[i3 + 2] = positions[ai3 + 2] + offsetDir.z;

    this.endBuf[i3] = positions[bi3] + offsetDir.x;
    this.endBuf[i3 + 1] = positions[bi3 + 1] + offsetDir.y;
    this.endBuf[i3 + 2] = positions[bi3 + 2] + offsetDir.z;

    this.colorBuf[i3] = cr;
    this.colorBuf[i3 + 1] = cg;
    this.colorBuf[i3 + 2] = cb;

    this.radiusBuf[idx] = radius;
    this.dashedBuf[idx] = dashed;
  }

  private grow(needed: number): void {
    this.capacity = Math.max(needed, this.capacity * 2);

    this.startBuf = new Float32Array(this.capacity * 3);
    this.endBuf = new Float32Array(this.capacity * 3);
    this.colorBuf = new Float32Array(this.capacity * 3);
    this.radiusBuf = new Float32Array(this.capacity);
    this.dashedBuf = new Float32Array(this.capacity);

    this.startAttr = new THREE.InstancedBufferAttribute(this.startBuf, 3);
    this.endAttr = new THREE.InstancedBufferAttribute(this.endBuf, 3);
    this.colorAttr = new THREE.InstancedBufferAttribute(this.colorBuf, 3);
    this.radiusAttr = new THREE.InstancedBufferAttribute(this.radiusBuf, 1);
    this.dashedAttr = new THREE.InstancedBufferAttribute(this.dashedBuf, 1);

    this.startAttr.setUsage(THREE.DynamicDrawUsage);
    this.endAttr.setUsage(THREE.DynamicDrawUsage);

    this.geo.setAttribute("instanceStart", this.startAttr);
    this.geo.setAttribute("instanceEnd", this.endAttr);
    this.geo.setAttribute("instanceColor", this.colorAttr);
    this.geo.setAttribute("instanceRadius", this.radiusAttr);
    this.geo.setAttribute("instanceDashed", this.dashedAttr);
  }

  dispose(): void {
    this.geo.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
