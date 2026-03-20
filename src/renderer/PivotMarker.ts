/**
 * 3D crosshair marker displayed at the rotation center (orbit pivot).
 *
 * Three colored line segments (X = red, Y = green, Z = blue) drawn without
 * depth testing so the marker is always visible through atoms.  The scale is
 * updated each frame so the marker occupies a fixed fraction of the viewport.
 */

import * as THREE from "three";

export class PivotMarker {
  readonly group: THREE.Group;
  private lines: THREE.LineSegments;

  constructor() {
    this.group = new THREE.Group();

    // Each axis: two vertices at ±0.5 in local space.
    const positions = new Float32Array([
      -0.5, 0, 0,  0.5, 0, 0, // X axis
       0, -0.5, 0,  0, 0.5, 0, // Y axis
       0, 0, -0.5,  0, 0, 0.5, // Z axis
    ]);

    // Vertex colors: X = red, Y = green, Z = blue
    const colors = new Float32Array([
      0.9, 0.2, 0.2,  0.9, 0.2, 0.2,
      0.2, 0.8, 0.2,  0.2, 0.8, 0.2,
      0.2, 0.5, 1.0,  0.2, 0.5, 1.0,
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      depthTest: false,
      transparent: true,
      opacity: 0.85,
      linewidth: 1,
    });

    this.lines = new THREE.LineSegments(geo, mat);
    this.lines.renderOrder = 999;
    this.group.add(this.lines);
  }

  /**
   * Update the marker position and scale each frame.
   *
   * For orthographic cameras the visible world width equals
   * `camera.right - camera.left`, so we take a fixed fraction of that.
   * For perspective cameras we use the distance to the target and the FOV.
   */
  update(target: THREE.Vector3, camera: THREE.Camera): void {
    this.group.position.copy(target);

    let size: number;
    if (camera instanceof THREE.OrthographicCamera) {
      // World-space width of the frustum (independent of the frustum shift)
      const frustumWidth = camera.right - camera.left;
      size = frustumWidth * 0.04;
    } else if (camera instanceof THREE.PerspectiveCamera) {
      const distance = camera.position.distanceTo(target);
      size = distance * Math.tan((camera.fov * Math.PI) / 360) * 0.12;
    } else {
      size = 1;
    }

    this.group.scale.setScalar(Math.max(size, 0.001));
  }

  setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  isVisible(): boolean {
    return this.group.visible;
  }

  dispose(): void {
    this.lines.geometry.dispose();
    (this.lines.material as THREE.Material).dispose();
  }
}
