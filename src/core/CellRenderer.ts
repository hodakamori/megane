/**
 * Wireframe renderer for the simulation cell (unit cell box).
 * Renders 12 edges of a parallelepiped defined by 3 cell vectors.
 */

import * as THREE from "three";

export class CellRenderer {
  readonly mesh: THREE.LineSegments;
  private geometry: THREE.BufferGeometry;

  constructor() {
    this.geometry = new THREE.BufferGeometry();
    // 12 edges × 2 vertices × 3 components = 72 floats
    const positions = new Float32Array(72);
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const material = new THREE.LineBasicMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.5,
    });

    this.mesh = new THREE.LineSegments(this.geometry, material);
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
  }

  /**
   * Update the cell box from a 3x3 matrix (row-major Float32Array of length 9).
   * Cell vectors: va = box[0..2], vb = box[3..5], vc = box[6..8].
   */
  loadBox(box: Float32Array): void {
    const va = new THREE.Vector3(box[0], box[1], box[2]);
    const vb = new THREE.Vector3(box[3], box[4], box[5]);
    const vc = new THREE.Vector3(box[6], box[7], box[8]);

    // 8 vertices of the parallelepiped
    const o = new THREE.Vector3(0, 0, 0);
    const a = va.clone();
    const b = vb.clone();
    const c = vc.clone();
    const ab = va.clone().add(vb);
    const ac = va.clone().add(vc);
    const bc = vb.clone().add(vc);
    const abc = va.clone().add(vb).add(vc);

    // 12 edges as pairs
    const edges: [THREE.Vector3, THREE.Vector3][] = [
      // Bottom face
      [o, a],
      [o, b],
      [a, ab],
      [b, ab],
      // Top face
      [c, ac],
      [c, bc],
      [ac, abc],
      [bc, abc],
      // Vertical edges
      [o, c],
      [a, ac],
      [b, bc],
      [ab, abc],
    ];

    const attr = this.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const buf = attr.array as Float32Array;

    for (let i = 0; i < 12; i++) {
      const [p0, p1] = edges[i];
      buf[i * 6] = p0.x;
      buf[i * 6 + 1] = p0.y;
      buf[i * 6 + 2] = p0.z;
      buf[i * 6 + 3] = p1.x;
      buf[i * 6 + 4] = p1.y;
      buf[i * 6 + 5] = p1.z;
    }

    attr.needsUpdate = true;
    this.geometry.computeBoundingSphere();
    this.mesh.visible = true;
  }

  setVisible(visible: boolean): void {
    this.mesh.visible = visible;
  }

  dispose(): void {
    this.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}
