/**
 * Polyhedron renderer using Three.js.
 * Renders coordination polyhedra as semi-transparent face meshes
 * with optional wireframe edge overlay.
 */

import * as THREE from "three";
import type { MeshData } from "../pipeline/types";

export class PolyhedronRenderer {
  readonly group: THREE.Group;
  private faceMesh: THREE.Mesh | null = null;
  private edgeLines: THREE.LineSegments | null = null;

  constructor() {
    this.group = new THREE.Group();
    this.group.frustumCulled = false;
  }

  loadMeshData(data: MeshData): void {
    this.clear();

    const nVertices = data.positions.length / 3;
    if (nVertices === 0 || data.indices.length === 0) return;

    // Face mesh
    const faceGeo = new THREE.BufferGeometry();
    faceGeo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    faceGeo.setAttribute("normal", new THREE.BufferAttribute(data.normals, 3));

    // Convert RGBA vertex colors to separate color + alpha attributes
    const colorRGB = new Float32Array(nVertices * 3);
    for (let i = 0; i < nVertices; i++) {
      colorRGB[i * 3] = data.colors[i * 4];
      colorRGB[i * 3 + 1] = data.colors[i * 4 + 1];
      colorRGB[i * 3 + 2] = data.colors[i * 4 + 2];
    }
    faceGeo.setAttribute("color", new THREE.BufferAttribute(colorRGB, 3));
    faceGeo.setIndex(new THREE.BufferAttribute(data.indices, 1));

    const faceMat = new THREE.MeshPhongMaterial({
      vertexColors: true,
      transparent: true,
      opacity: data.opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
      shininess: 30,
    });

    this.faceMesh = new THREE.Mesh(faceGeo, faceMat);
    this.faceMesh.renderOrder = 1;
    this.group.add(this.faceMesh);

    // Edge wireframe
    if (data.showEdges && data.edgePositions && data.edgePositions.length > 0) {
      const edgeGeo = new THREE.BufferGeometry();
      edgeGeo.setAttribute("position", new THREE.BufferAttribute(data.edgePositions, 3));
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x333333,
        opacity: 0.7,
        transparent: true,
      });
      this.edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      this.edgeLines.renderOrder = 2;
      this.group.add(this.edgeLines);
    }
  }

  clear(): void {
    if (this.faceMesh) {
      this.faceMesh.geometry.dispose();
      (this.faceMesh.material as THREE.Material).dispose();
      this.group.remove(this.faceMesh);
      this.faceMesh = null;
    }
    if (this.edgeLines) {
      this.edgeLines.geometry.dispose();
      (this.edgeLines.material as THREE.Material).dispose();
      this.group.remove(this.edgeLines);
      this.edgeLines = null;
    }
  }

  setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  dispose(): void {
    this.clear();
  }
}
