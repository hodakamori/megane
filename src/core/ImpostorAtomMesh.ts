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
import type { Snapshot } from "./types";
import { getColor, getRadius, BALL_STICK_ATOM_SCALE } from "./constants";
import { atomVertexShader, atomFragmentShader } from "./shaders";

export class ImpostorAtomMesh {
  readonly mesh: THREE.Mesh;
  private geo: THREE.InstancedBufferGeometry;

  private centerAttr: THREE.InstancedBufferAttribute;
  private radiusAttr: THREE.InstancedBufferAttribute;
  private colorAttr: THREE.InstancedBufferAttribute;

  private centerBuf: Float32Array;
  private radiusBuf: Float32Array;
  private colorBuf: Float32Array;
  private nAtoms = 0;
  private capacity: number;

  constructor(maxAtoms: number = 1_000_000) {
    this.capacity = maxAtoms;

    // Billboard quad: 2 triangles, [-1,1] in XY
    this.geo = new THREE.InstancedBufferGeometry();
    const verts = new Float32Array([
      -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0,
    ]);
    const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
    this.geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    this.geo.setIndex(new THREE.BufferAttribute(indices, 1));
    this.geo.instanceCount = 0;

    // Instance buffers (pre-allocated for maxAtoms)
    this.centerBuf = new Float32Array(maxAtoms * 3);
    this.radiusBuf = new Float32Array(maxAtoms);
    this.colorBuf = new Float32Array(maxAtoms * 3);

    this.centerAttr = new THREE.InstancedBufferAttribute(this.centerBuf, 3);
    this.radiusAttr = new THREE.InstancedBufferAttribute(this.radiusBuf, 1);
    this.colorAttr = new THREE.InstancedBufferAttribute(this.colorBuf, 3);

    this.centerAttr.setUsage(THREE.DynamicDrawUsage);
    this.radiusAttr.setUsage(THREE.StaticDrawUsage);
    this.colorAttr.setUsage(THREE.StaticDrawUsage);

    this.geo.setAttribute("instanceCenter", this.centerAttr);
    this.geo.setAttribute("instanceRadius", this.radiusAttr);
    this.geo.setAttribute("instanceColor", this.colorAttr);

    // Custom shader material
    const material = new THREE.RawShaderMaterial({
      vertexShader: atomVertexShader,
      fragmentShader: atomFragmentShader,
      depthWrite: true,
      depthTest: true,
    });

    this.mesh = new THREE.Mesh(this.geo, material);
    this.mesh.frustumCulled = false;
  }

  loadSnapshot(snapshot: Snapshot): void {
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

      const [r, g, b] = getColor(elements[i]);
      this.colorBuf[i3] = r;
      this.colorBuf[i3 + 1] = g;
      this.colorBuf[i3 + 2] = b;
    }

    this.centerAttr.needsUpdate = true;
    this.radiusAttr.needsUpdate = true;
    this.colorAttr.needsUpdate = true;
    this.geo.instanceCount = nAtoms;
  }

  updatePositions(positions: Float32Array): void {
    // Direct memcpy - no Matrix4 or Vector3 allocation
    this.centerBuf.set(positions.subarray(0, this.nAtoms * 3));
    this.centerAttr.needsUpdate = true;
  }

  private grow(needed: number): void {
    this.capacity = Math.max(needed, this.capacity * 2);

    this.centerBuf = new Float32Array(this.capacity * 3);
    this.radiusBuf = new Float32Array(this.capacity);
    this.colorBuf = new Float32Array(this.capacity * 3);

    this.centerAttr = new THREE.InstancedBufferAttribute(this.centerBuf, 3);
    this.radiusAttr = new THREE.InstancedBufferAttribute(this.radiusBuf, 1);
    this.colorAttr = new THREE.InstancedBufferAttribute(this.colorBuf, 3);

    this.centerAttr.setUsage(THREE.DynamicDrawUsage);

    this.geo.setAttribute("instanceCenter", this.centerAttr);
    this.geo.setAttribute("instanceRadius", this.radiusAttr);
    this.geo.setAttribute("instanceColor", this.colorAttr);
  }

  dispose(): void {
    this.geo.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
