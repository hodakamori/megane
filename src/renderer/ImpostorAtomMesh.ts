/**
 * Billboard impostor sphere renderer.
 *
 * Instead of rendering N SphereGeometries (32+ triangles each),
 * each atom is a single screen-aligned quad (2 triangles) with a
 * fragment shader that ray-traces a perfect sphere with correct depth.
 *
 * Memory: 7 floats/atom (x,y,z, r, cr,cg,cb) vs 100s of vertices.
 * Draw calls: 1 (single instanced draw).
 * Scales to 1M+ atoms on mid-range GPUs.
 */

import * as THREE from "three";
import type { Snapshot } from "../types";
import { getColor, getRadius, BALL_STICK_ATOM_SCALE } from "../constants";
import { atomVertexShader, atomFragmentShader } from "./shaders";
import { type ColorContext, getAtomColorForScheme } from "../colorSchemes";

export class ImpostorAtomMesh {
  readonly mesh: THREE.Mesh;
  private geo: THREE.InstancedBufferGeometry;
  private material: THREE.RawShaderMaterial;

  private centerAttr: THREE.InstancedBufferAttribute;
  private radiusAttr: THREE.InstancedBufferAttribute;
  private colorAttr: THREE.InstancedBufferAttribute;
  private scaleOverrideAttr: THREE.InstancedBufferAttribute;
  private opacityOverrideAttr: THREE.InstancedBufferAttribute;

  private centerBuf: Float32Array;
  private radiusBuf: Float32Array;
  private colorBuf: Float32Array;
  private scaleOverrideBuf: Float32Array;
  private opacityOverrideBuf: Float32Array;
  private nAtoms = 0;
  private capacity: number;

  constructor(maxAtoms: number = 1_000_000) {
    this.capacity = maxAtoms;

    // Billboard quad: 2 triangles, [-1,1] in XY
    this.geo = new THREE.InstancedBufferGeometry();
    const verts = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
    this.geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    this.geo.setIndex(new THREE.BufferAttribute(indices, 1));
    this.geo.instanceCount = 0;

    // Instance buffers (pre-allocated for maxAtoms)
    this.centerBuf = new Float32Array(maxAtoms * 3);
    this.radiusBuf = new Float32Array(maxAtoms);
    this.colorBuf = new Float32Array(maxAtoms * 3);
    this.scaleOverrideBuf = new Float32Array(maxAtoms).fill(1.0);
    this.opacityOverrideBuf = new Float32Array(maxAtoms).fill(1.0);

    this.centerAttr = new THREE.InstancedBufferAttribute(this.centerBuf, 3);
    this.radiusAttr = new THREE.InstancedBufferAttribute(this.radiusBuf, 1);
    this.colorAttr = new THREE.InstancedBufferAttribute(this.colorBuf, 3);
    this.scaleOverrideAttr = new THREE.InstancedBufferAttribute(this.scaleOverrideBuf, 1);
    this.opacityOverrideAttr = new THREE.InstancedBufferAttribute(this.opacityOverrideBuf, 1);

    this.centerAttr.setUsage(THREE.DynamicDrawUsage);
    this.radiusAttr.setUsage(THREE.StaticDrawUsage);
    this.colorAttr.setUsage(THREE.StaticDrawUsage);
    this.scaleOverrideAttr.setUsage(THREE.DynamicDrawUsage);
    this.opacityOverrideAttr.setUsage(THREE.DynamicDrawUsage);

    this.geo.setAttribute("instanceCenter", this.centerAttr);
    this.geo.setAttribute("instanceRadius", this.radiusAttr);
    this.geo.setAttribute("instanceColor", this.colorAttr);
    this.geo.setAttribute("instanceScaleOverride", this.scaleOverrideAttr);
    this.geo.setAttribute("instanceOpacityOverride", this.opacityOverrideAttr);

    // Custom shader material with uniforms for scale and opacity
    this.material = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: atomVertexShader,
      fragmentShader: atomFragmentShader,
      uniforms: {
        uScaleMultiplier: { value: 1.0 },
        uOpacity: { value: 1.0 },
        uUsePerAtomOverrides: { value: 0 },
      },
      depthWrite: true,
      depthTest: true,
    });

    this.mesh = new THREE.Mesh(this.geo, this.material);
    this.mesh.frustumCulled = false;
  }

  loadSnapshot(snapshot: Snapshot, colorCtx?: ColorContext): void {
    const { nAtoms, positions, elements } = snapshot;
    this.nAtoms = nAtoms;

    // Grow buffers if needed
    if (nAtoms > this.capacity) {
      this.grow(nAtoms);
    }

    // Fill buffers directly (no object allocation)
    for (let i = 0; i < nAtoms; i++) {
      const i3 = i * 3;
      this.centerBuf[i3] = positions[i3];
      this.centerBuf[i3 + 1] = positions[i3 + 1];
      this.centerBuf[i3 + 2] = positions[i3 + 2];

      this.radiusBuf[i] = getRadius(elements[i]) * BALL_STICK_ATOM_SCALE;

      const [r, g, b] = colorCtx
        ? getAtomColorForScheme(i, snapshot, colorCtx)
        : getColor(elements[i]);
      this.colorBuf[i3] = r;
      this.colorBuf[i3 + 1] = g;
      this.colorBuf[i3 + 2] = b;
    }

    // Reset overrides on new snapshot
    this.scaleOverrideBuf.fill(1.0, 0, nAtoms);
    this.opacityOverrideBuf.fill(1.0, 0, nAtoms);

    this.centerAttr.needsUpdate = true;
    this.radiusAttr.needsUpdate = true;
    this.colorAttr.needsUpdate = true;
    this.scaleOverrideAttr.needsUpdate = true;
    this.opacityOverrideAttr.needsUpdate = true;
    this.geo.instanceCount = nAtoms;
  }

  updatePositions(positions: Float32Array): void {
    // Direct memcpy - no Matrix4 or Vector3 allocation
    this.centerBuf.set(positions.subarray(0, this.nAtoms * 3));
    this.centerAttr.needsUpdate = true;
  }

  /** Update atom radius scale (O(1) via shader uniform). */
  setScale(_scale: number, _snapshot: Snapshot): void {
    this.material.uniforms.uScaleMultiplier.value = _scale;
  }

  /** Set global atom opacity. */
  setOpacity(opacity: number): void {
    this.material.uniforms.uOpacity.value = opacity;
    this.material.transparent = opacity < 1;
    this.material.depthWrite = opacity >= 1;
    this.material.needsUpdate = true;
  }

  /** Set per-atom scale overrides. */
  setScaleOverrides(overrides: Float32Array): void {
    this.scaleOverrideBuf.set(overrides.subarray(0, this.nAtoms));
    this.scaleOverrideAttr.needsUpdate = true;
    this.material.uniforms.uUsePerAtomOverrides.value = 1;
  }

  /** Set per-atom opacity overrides. */
  setOpacityOverrides(overrides: Float32Array): void {
    this.opacityOverrideBuf.set(overrides.subarray(0, this.nAtoms));
    this.opacityOverrideAttr.needsUpdate = true;
    this.material.uniforms.uUsePerAtomOverrides.value = 1;
    // Enable transparency if any atom has opacity < 1
    let hasTransparent = false;
    for (let i = 0; i < this.nAtoms; i++) {
      if (this.opacityOverrideBuf[i] < 1.0) {
        hasTransparent = true;
        break;
      }
    }
    if (hasTransparent) {
      this.material.transparent = true;
      this.material.depthWrite = false;
      this.material.needsUpdate = true;
    }
  }

  /** Clear all per-atom overrides, reverting to global uniforms. */
  clearOverrides(): void {
    this.scaleOverrideBuf.fill(1.0, 0, this.nAtoms);
    this.opacityOverrideBuf.fill(1.0, 0, this.nAtoms);
    this.scaleOverrideAttr.needsUpdate = true;
    this.opacityOverrideAttr.needsUpdate = true;
    this.material.uniforms.uUsePerAtomOverrides.value = 0;
  }

  /**
   * Overlay per-atom RGB overrides onto the existing color buffer.
   * `overrides` length must be `nAtoms*3`. Atoms whose r-channel is NaN keep
   * the current (base) color; other atoms are rewritten. The caller is
   * responsible for re-running `loadSnapshot` first when the previous
   * overrides need to be cleared, since this method only writes — it never
   * reverts to base.
   */
  applyColorOverrides(overrides: Float32Array): void {
    const limit = Math.min(this.nAtoms, Math.floor(overrides.length / 3));
    for (let i = 0; i < limit; i++) {
      const i3 = i * 3;
      const r = overrides[i3];
      if (Number.isNaN(r)) continue;
      this.colorBuf[i3] = r;
      this.colorBuf[i3 + 1] = overrides[i3 + 1];
      this.colorBuf[i3 + 2] = overrides[i3 + 2];
    }
    this.colorAttr.needsUpdate = true;
  }

  /**
   * Read-only handle on the per-atom RGB buffer (length `nAtoms*3`).
   * Used by the bond mesh to derive per-bond colors after overrides are
   * applied; do not mutate the returned subarray.
   */
  getColorBuffer(): Float32Array {
    return this.colorBuf.subarray(0, this.nAtoms * 3);
  }

  private grow(needed: number): void {
    this.capacity = Math.max(needed, this.capacity * 2);

    const newCenter = new Float32Array(this.capacity * 3);
    const newRadius = new Float32Array(this.capacity);
    const newColor = new Float32Array(this.capacity * 3);
    const newScaleOverride = new Float32Array(this.capacity).fill(1.0);
    const newOpacityOverride = new Float32Array(this.capacity).fill(1.0);

    newCenter.set(this.centerBuf);
    newRadius.set(this.radiusBuf);
    newColor.set(this.colorBuf);
    newScaleOverride.set(this.scaleOverrideBuf);
    newOpacityOverride.set(this.opacityOverrideBuf);

    this.centerBuf = newCenter;
    this.radiusBuf = newRadius;
    this.colorBuf = newColor;
    this.scaleOverrideBuf = newScaleOverride;
    this.opacityOverrideBuf = newOpacityOverride;

    this.centerAttr = new THREE.InstancedBufferAttribute(this.centerBuf, 3);
    this.radiusAttr = new THREE.InstancedBufferAttribute(this.radiusBuf, 1);
    this.colorAttr = new THREE.InstancedBufferAttribute(this.colorBuf, 3);
    this.scaleOverrideAttr = new THREE.InstancedBufferAttribute(this.scaleOverrideBuf, 1);
    this.opacityOverrideAttr = new THREE.InstancedBufferAttribute(this.opacityOverrideBuf, 1);

    this.centerAttr.setUsage(THREE.DynamicDrawUsage);
    this.radiusAttr.setUsage(THREE.StaticDrawUsage);
    this.colorAttr.setUsage(THREE.StaticDrawUsage);
    this.scaleOverrideAttr.setUsage(THREE.DynamicDrawUsage);
    this.opacityOverrideAttr.setUsage(THREE.DynamicDrawUsage);

    this.geo.setAttribute("instanceCenter", this.centerAttr);
    this.geo.setAttribute("instanceRadius", this.radiusAttr);
    this.geo.setAttribute("instanceColor", this.colorAttr);
    this.geo.setAttribute("instanceScaleOverride", this.scaleOverrideAttr);
    this.geo.setAttribute("instanceOpacityOverride", this.opacityOverrideAttr);
  }

  dispose(): void {
    this.geo.dispose();
    this.material.dispose();
  }
}
