/**
 * Billboard impostor cylinder renderer for bonds.
 *
 * Each bond is a screen-aligned quad stretched between two atom positions.
 * Fragment shader applies cylinder-like shading.
 * Supports bond orders: single, double, triple, aromatic (dashed).
 * Single instanced draw call for all bonds.
 *
 * GPU-optimized: atom positions are uploaded as a DataTexture and bond
 * topology (atom indices + offsets) is stored as static instance attributes.
 * Per-frame update is O(nAtoms) texture copy instead of O(nVisualBonds) vector math.
 */

import * as THREE from "three";
import type { Snapshot } from "../types";
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
} from "../constants";
import { bondVertexShader, bondFragmentShader } from "./shaders";

const TEX_MAX_WIDTH = 4096;

export class ImpostorBondMesh {
  readonly mesh: THREE.Mesh;
  private geo: THREE.InstancedBufferGeometry;
  private bondMaterial: THREE.RawShaderMaterial;

  // Topology buffers (set at loadSnapshot, static per snapshot)
  private atomABuf: Float32Array;
  private atomBBuf: Float32Array;
  private offsetXBuf: Float32Array;
  private offsetYBuf: Float32Array;
  private colorBuf: Float32Array;
  private radiusBuf: Float32Array;
  private dashedBuf: Float32Array;
  private opacityBuf: Float32Array; // per-visual-instance opacity override
  private logicalBondIdx: Float32Array; // CPU-only: maps visual instance → logical bond index

  // Position DataTexture (updated per frame)
  private positionTex: THREE.DataTexture;
  private positionTexData: Float32Array;
  private positionTexWidth: number = 1;
  private positionTexHeight: number = 1;
  private nAtoms: number = 0;

  private capacity: number;

  constructor(maxBonds: number = 3_000_000) {
    this.capacity = maxBonds;

    // Quad: 2 triangles, XY in [-1, 1]
    this.geo = new THREE.InstancedBufferGeometry();
    const verts = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]);
    const uvs = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
    this.geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    this.geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    this.geo.setIndex(new THREE.BufferAttribute(indices, 1));
    this.geo.instanceCount = 0;

    // Instance buffers
    this.atomABuf = new Float32Array(maxBonds);
    this.atomBBuf = new Float32Array(maxBonds);
    this.offsetXBuf = new Float32Array(maxBonds);
    this.offsetYBuf = new Float32Array(maxBonds);
    this.colorBuf = new Float32Array(maxBonds * 3);
    this.radiusBuf = new Float32Array(maxBonds);
    this.dashedBuf = new Float32Array(maxBonds);
    this.opacityBuf = new Float32Array(maxBonds).fill(1.0);
    this.logicalBondIdx = new Float32Array(maxBonds);

    // Initial DataTexture (1x1 placeholder)
    this.positionTexData = new Float32Array(4);
    this.positionTex = new THREE.DataTexture(
      this.positionTexData,
      1,
      1,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    this.positionTex.minFilter = THREE.NearestFilter;
    this.positionTex.magFilter = THREE.NearestFilter;
    this.positionTex.generateMipmaps = false;
    this.positionTex.needsUpdate = true;

    // Register initial attributes
    this.registerAttributes();

    this.bondMaterial = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: bondVertexShader,
      fragmentShader: bondFragmentShader,
      uniforms: {
        uOpacity: { value: 1.0 },
        uBondScaleMultiplier: { value: 1.0 },
        uPositionTex: { value: this.positionTex },
        uPositionTexWidth: { value: 1 },
        uUsePerBondOverrides: { value: 0 },
      },
      depthWrite: true,
      depthTest: true,
    });

    this.mesh = new THREE.Mesh(this.geo, this.bondMaterial);
    this.mesh.frustumCulled = false;
  }

  loadSnapshot(snapshot: Snapshot): void {
    const { nAtoms, nBonds, positions, elements, bonds, bondOrders } = snapshot;
    this.nAtoms = nAtoms;

    // Resize position texture
    this.positionTexWidth = Math.min(nAtoms, TEX_MAX_WIDTH);
    this.positionTexHeight = Math.max(1, Math.ceil(nAtoms / this.positionTexWidth));
    this.positionTexData = new Float32Array(this.positionTexWidth * this.positionTexHeight * 4);
    this.copyPositionsToTexData(positions);

    this.positionTex.dispose();
    this.positionTex = new THREE.DataTexture(
      this.positionTexData,
      this.positionTexWidth,
      this.positionTexHeight,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    this.positionTex.minFilter = THREE.NearestFilter;
    this.positionTex.magFilter = THREE.NearestFilter;
    this.positionTex.generateMipmaps = false;
    this.positionTex.needsUpdate = true;
    this.bondMaterial.uniforms.uPositionTex.value = this.positionTex;
    this.bondMaterial.uniforms.uPositionTexWidth.value = this.positionTexWidth;

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

      // Colors
      const [r1, g1, b1] = getColor(elements[ai]);
      const [r2, g2, b2] = getColor(elements[bi]);
      const cr = (r1 + r2) * 0.5;
      const cg = (g1 + g2) * 0.5;
      const cb = (b1 + b2) * 0.5;

      if (order === BOND_DOUBLE) {
        for (const sign of [-1, 1]) {
          this.setTopology(
            idx,
            ai,
            bi,
            sign * DOUBLE_BOND_OFFSET,
            0,
            DOUBLE_BOND_RADIUS,
            cr,
            cg,
            cb,
            0,
          );
          this.logicalBondIdx[idx] = i;
          this.opacityBuf[idx] = 1.0;
          idx++;
        }
      } else if (order === BOND_TRIPLE) {
        const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
        for (const angle of angles) {
          const ox = Math.cos(angle) * TRIPLE_BOND_OFFSET;
          const oy = Math.sin(angle) * TRIPLE_BOND_OFFSET;
          this.setTopology(idx, ai, bi, ox, oy, TRIPLE_BOND_RADIUS, cr, cg, cb, 0);
          this.logicalBondIdx[idx] = i;
          this.opacityBuf[idx] = 1.0;
          idx++;
        }
      } else if (order === BOND_AROMATIC) {
        // Solid bond
        this.setTopology(idx, ai, bi, 0, 0, AROMATIC_BOND_RADIUS, cr, cg, cb, 0);
        this.logicalBondIdx[idx] = i;
        this.opacityBuf[idx] = 1.0;
        idx++;
        // Dashed offset bond
        this.setTopology(idx, ai, bi, DOUBLE_BOND_OFFSET, 0, AROMATIC_DASH_RADIUS, cr, cg, cb, 1);
        this.logicalBondIdx[idx] = i;
        this.opacityBuf[idx] = 1.0;
        idx++;
      } else {
        // Single bond
        this.setTopology(idx, ai, bi, 0, 0, BOND_RADIUS, cr, cg, cb, 0);
        this.logicalBondIdx[idx] = i;
        this.opacityBuf[idx] = 1.0;
        idx++;
      }
    }

    // Reset per-bond override mode when loading a new snapshot
    this.bondMaterial.uniforms.uUsePerBondOverrides.value = 0;

    // Recreate all InstancedBufferAttributes and re-register them.
    // This forces Three.js to create new GPU buffers, ensuring data
    // is uploaded even when loadSnapshot() is called repeatedly.
    this.registerAttributes();
    this.geo.instanceCount = idx;
  }

  updatePositions(positions: Float32Array, _bonds: Uint32Array, _nBonds: number): void {
    this.copyPositionsToTexData(positions);
    this.positionTex.needsUpdate = true;
  }

  private setTopology(
    idx: number,
    ai: number,
    bi: number,
    offsetX: number,
    offsetY: number,
    radius: number,
    cr: number,
    cg: number,
    cb: number,
    dashed: number,
  ): void {
    this.atomABuf[idx] = ai;
    this.atomBBuf[idx] = bi;
    this.offsetXBuf[idx] = offsetX;
    this.offsetYBuf[idx] = offsetY;

    const i3 = idx * 3;
    this.colorBuf[i3] = cr;
    this.colorBuf[i3 + 1] = cg;
    this.colorBuf[i3 + 2] = cb;

    this.radiusBuf[idx] = radius;
    this.dashedBuf[idx] = dashed;
  }

  private copyPositionsToTexData(positions: Float32Array): void {
    const data = this.positionTexData;
    const n = this.nAtoms;
    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      const i4 = i * 4;
      data[i4] = positions[i3];
      data[i4 + 1] = positions[i3 + 1];
      data[i4 + 2] = positions[i3 + 2];
      // data[i4 + 3] unused (alpha channel)
    }
  }

  /** Recreate all instance attributes and re-register with geometry. */
  private registerAttributes(): void {
    const atomA = new THREE.InstancedBufferAttribute(this.atomABuf, 1);
    const atomB = new THREE.InstancedBufferAttribute(this.atomBBuf, 1);
    const offsetX = new THREE.InstancedBufferAttribute(this.offsetXBuf, 1);
    const offsetY = new THREE.InstancedBufferAttribute(this.offsetYBuf, 1);
    const color = new THREE.InstancedBufferAttribute(this.colorBuf, 3);
    const radius = new THREE.InstancedBufferAttribute(this.radiusBuf, 1);
    const dashed = new THREE.InstancedBufferAttribute(this.dashedBuf, 1);
    const opacity = new THREE.InstancedBufferAttribute(this.opacityBuf, 1);

    this.geo.setAttribute("instanceAtomA", atomA);
    this.geo.setAttribute("instanceAtomB", atomB);
    this.geo.setAttribute("instanceOffsetX", offsetX);
    this.geo.setAttribute("instanceOffsetY", offsetY);
    this.geo.setAttribute("instanceColor", color);
    this.geo.setAttribute("instanceRadius", radius);
    this.geo.setAttribute("instanceDashed", dashed);
    this.geo.setAttribute("instanceBondOpacity", opacity);
  }

  private grow(needed: number): void {
    this.capacity = Math.max(needed, this.capacity * 2);

    const newAtomA = new Float32Array(this.capacity);
    const newAtomB = new Float32Array(this.capacity);
    const newOffsetX = new Float32Array(this.capacity);
    const newOffsetY = new Float32Array(this.capacity);
    const newColor = new Float32Array(this.capacity * 3);
    const newRadius = new Float32Array(this.capacity);
    const newDashed = new Float32Array(this.capacity);
    const newOpacity = new Float32Array(this.capacity).fill(1.0);
    const newLogical = new Float32Array(this.capacity);

    newAtomA.set(this.atomABuf);
    newAtomB.set(this.atomBBuf);
    newOffsetX.set(this.offsetXBuf);
    newOffsetY.set(this.offsetYBuf);
    newColor.set(this.colorBuf);
    newRadius.set(this.radiusBuf);
    newDashed.set(this.dashedBuf);
    newOpacity.set(this.opacityBuf);
    newLogical.set(this.logicalBondIdx);

    this.atomABuf = newAtomA;
    this.atomBBuf = newAtomB;
    this.offsetXBuf = newOffsetX;
    this.offsetYBuf = newOffsetY;
    this.colorBuf = newColor;
    this.radiusBuf = newRadius;
    this.dashedBuf = newDashed;
    this.opacityBuf = newOpacity;
    this.logicalBondIdx = newLogical;

    this.registerAttributes();
  }

  /** Set global bond opacity. */
  setOpacity(opacity: number): void {
    this.bondMaterial.uniforms.uOpacity.value = opacity;
    this.bondMaterial.transparent = opacity < 1;
    this.bondMaterial.depthWrite = opacity >= 1;
    this.bondMaterial.needsUpdate = true;
  }

  /**
   * Apply per-bond opacity overrides (one value per logical bond).
   * Maps logical bond opacities to visual instances and activates per-bond mode.
   */
  setBondOpacityOverrides(logicalOpacities: Float32Array): void {
    const count = this.geo.instanceCount;
    for (let v = 0; v < count; v++) {
      const li = this.logicalBondIdx[v];
      this.opacityBuf[v] = logicalOpacities[li] ?? 1.0;
    }
    const attr = this.geo.getAttribute("instanceBondOpacity") as THREE.InstancedBufferAttribute;
    if (attr) attr.needsUpdate = true;
    this.bondMaterial.uniforms.uUsePerBondOverrides.value = 1;
    this.bondMaterial.transparent = true;
    this.bondMaterial.depthWrite = false;
    this.bondMaterial.needsUpdate = true;
  }

  /** Clear per-bond opacity overrides, reverting to global opacity mode. */
  clearBondOpacityOverrides(): void {
    this.opacityBuf.fill(1.0);
    const attr = this.geo.getAttribute("instanceBondOpacity") as THREE.InstancedBufferAttribute;
    if (attr) attr.needsUpdate = true;
    this.bondMaterial.uniforms.uUsePerBondOverrides.value = 0;
    this.bondMaterial.needsUpdate = true;
  }

  /** Set bond radius scale multiplier (O(1) via shader uniform). */
  setScale(scale: number, _snapshot?: Snapshot): void {
    this.bondMaterial.uniforms.uBondScaleMultiplier.value = scale;
  }

  dispose(): void {
    this.geo.dispose();
    this.bondMaterial.dispose();
    this.positionTex.dispose();
  }
}
