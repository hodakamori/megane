/**
 * Billboard impostor cylinder renderer for bonds.
 *
 * Each bond is a screen-aligned quad stretched between two atom positions.
 * Fragment shader applies cylinder-like shading.
 * Single instanced draw call for all bonds.
 */

import * as THREE from "three";
import type { Snapshot } from "./types";
import { getColor, BOND_RADIUS } from "./constants";
import { bondVertexShader, bondFragmentShader } from "./shaders";

export class ImpostorBondMesh {
  readonly mesh: THREE.Mesh;
  private geo: THREE.InstancedBufferGeometry;

  private startAttr: THREE.InstancedBufferAttribute;
  private endAttr: THREE.InstancedBufferAttribute;
  private colorAttr: THREE.InstancedBufferAttribute;
  private radiusAttr: THREE.InstancedBufferAttribute;

  private startBuf: Float32Array;
  private endBuf: Float32Array;
  private colorBuf: Float32Array;
  private radiusBuf: Float32Array;

  private nBonds = 0;
  private capacity: number;

  constructor(maxBonds: number = 1_000_000) {
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

    this.startAttr = new THREE.InstancedBufferAttribute(this.startBuf, 3);
    this.endAttr = new THREE.InstancedBufferAttribute(this.endBuf, 3);
    this.colorAttr = new THREE.InstancedBufferAttribute(this.colorBuf, 3);
    this.radiusAttr = new THREE.InstancedBufferAttribute(this.radiusBuf, 1);

    this.startAttr.setUsage(THREE.DynamicDrawUsage);
    this.endAttr.setUsage(THREE.DynamicDrawUsage);

    this.geo.setAttribute("instanceStart", this.startAttr);
    this.geo.setAttribute("instanceEnd", this.endAttr);
    this.geo.setAttribute("instanceColor", this.colorAttr);
    this.geo.setAttribute("instanceRadius", this.radiusAttr);

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
    const { nBonds, positions, elements, bonds } = snapshot;
    this.nBonds = nBonds;

    if (nBonds > this.capacity) {
      this.grow(nBonds);
    }

    for (let i = 0; i < nBonds; i++) {
      const ai = bonds[i * 2];
      const bi = bonds[i * 2 + 1];
      const ai3 = ai * 3;
      const bi3 = bi * 3;
      const i3 = i * 3;

      this.startBuf[i3] = positions[ai3];
      this.startBuf[i3 + 1] = positions[ai3 + 1];
      this.startBuf[i3 + 2] = positions[ai3 + 2];

      this.endBuf[i3] = positions[bi3];
      this.endBuf[i3 + 1] = positions[bi3 + 1];
      this.endBuf[i3 + 2] = positions[bi3 + 2];

      // Average color
      const [r1, g1, b1] = getColor(elements[ai]);
      const [r2, g2, b2] = getColor(elements[bi]);
      this.colorBuf[i3] = (r1 + r2) * 0.5;
      this.colorBuf[i3 + 1] = (g1 + g2) * 0.5;
      this.colorBuf[i3 + 2] = (b1 + b2) * 0.5;

      this.radiusBuf[i] = BOND_RADIUS;
    }

    this.startAttr.needsUpdate = true;
    this.endAttr.needsUpdate = true;
    this.colorAttr.needsUpdate = true;
    this.radiusAttr.needsUpdate = true;
    this.geo.instanceCount = nBonds;
  }

  updatePositions(
    positions: Float32Array,
    bonds: Uint32Array,
    nBonds: number,
  ): void {
    for (let i = 0; i < nBonds; i++) {
      const ai = bonds[i * 2];
      const bi = bonds[i * 2 + 1];
      const ai3 = ai * 3;
      const bi3 = bi * 3;
      const i3 = i * 3;

      this.startBuf[i3] = positions[ai3];
      this.startBuf[i3 + 1] = positions[ai3 + 1];
      this.startBuf[i3 + 2] = positions[ai3 + 2];

      this.endBuf[i3] = positions[bi3];
      this.endBuf[i3 + 1] = positions[bi3 + 1];
      this.endBuf[i3 + 2] = positions[bi3 + 2];
    }

    this.startAttr.needsUpdate = true;
    this.endAttr.needsUpdate = true;
  }

  private grow(needed: number): void {
    this.capacity = Math.max(needed, this.capacity * 2);

    this.startBuf = new Float32Array(this.capacity * 3);
    this.endBuf = new Float32Array(this.capacity * 3);
    this.colorBuf = new Float32Array(this.capacity * 3);
    this.radiusBuf = new Float32Array(this.capacity);

    this.startAttr = new THREE.InstancedBufferAttribute(this.startBuf, 3);
    this.endAttr = new THREE.InstancedBufferAttribute(this.endBuf, 3);
    this.colorAttr = new THREE.InstancedBufferAttribute(this.colorBuf, 3);
    this.radiusAttr = new THREE.InstancedBufferAttribute(this.radiusBuf, 1);

    this.startAttr.setUsage(THREE.DynamicDrawUsage);
    this.endAttr.setUsage(THREE.DynamicDrawUsage);

    this.geo.setAttribute("instanceStart", this.startAttr);
    this.geo.setAttribute("instanceEnd", this.endAttr);
    this.geo.setAttribute("instanceColor", this.colorAttr);
    this.geo.setAttribute("instanceRadius", this.radiusAttr);
  }

  dispose(): void {
    this.geo.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
