/**
 * Cell axes indicator renderer.
 * Draws colored arrows (a/b/c or x/y/z) in a small inset viewport
 * that rotates in sync with the main camera.
 */

import * as THREE from "three";

const INSET_SIZE = 120;
const INSET_MARGIN = 8;
const AXIS_COLORS = [0xdd3333, 0x33aa33, 0x3366dd];
const ORTHO_EPS = 1e-4;

export class CellAxesRenderer {
  private axesScene: THREE.Scene;
  private axesCamera: THREE.PerspectiveCamera;
  private arrowGroup: THREE.Group;
  private visible = true;

  constructor() {
    this.axesScene = new THREE.Scene();

    this.axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.axesCamera.position.set(0, 0, 3);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.axesScene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(2, 2, 2);
    this.axesScene.add(dirLight);

    this.arrowGroup = new THREE.Group();
    this.axesScene.add(this.arrowGroup);
  }

  /**
   * Update from the 3x3 cell matrix (row-major Float32Array of length 9).
   */
  loadBox(box: Float32Array): void {
    const va = new THREE.Vector3(box[0], box[1], box[2]);
    const vb = new THREE.Vector3(box[3], box[4], box[5]);
    const vc = new THREE.Vector3(box[6], box[7], box[8]);

    // Determine orthogonality
    const lenA = va.length();
    const lenB = vb.length();
    const lenC = vc.length();
    const isOrthogonal =
      Math.abs(va.dot(vb)) < ORTHO_EPS * lenA * lenB &&
      Math.abs(va.dot(vc)) < ORTHO_EPS * lenA * lenC &&
      Math.abs(vb.dot(vc)) < ORTHO_EPS * lenB * lenC;

    const labels = isOrthogonal ? ["x", "y", "z"] : ["a", "b", "c"];
    const directions = [va.normalize(), vb.normalize(), vc.normalize()];

    this.buildArrows(directions, labels);
  }

  private buildArrows(directions: THREE.Vector3[], labels: string[]): void {
    // Clear existing arrows
    while (this.arrowGroup.children.length > 0) {
      const child = this.arrowGroup.children[0];
      this.arrowGroup.remove(child);
      this.disposeObject(child);
    }

    for (let i = 0; i < 3; i++) {
      const arrow = new THREE.ArrowHelper(
        directions[i],
        new THREE.Vector3(0, 0, 0),
        1.0,
        AXIS_COLORS[i],
        0.25,
        0.1,
      );
      this.arrowGroup.add(arrow);

      // Label sprite
      const sprite = this.makeTextSprite(labels[i], AXIS_COLORS[i]);
      sprite.position.copy(directions[i]).multiplyScalar(1.25);
      sprite.scale.set(0.3, 0.3, 1);
      this.arrowGroup.add(sprite);
    }
  }

  private makeTextSprite(text: string, color: number): THREE.Sprite {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true }));
    }

    ctx.clearRect(0, 0, size, size);

    const c = new THREE.Color(color);
    ctx.fillStyle = `rgb(${(c.r * 255) | 0},${(c.g * 255) | 0},${(c.b * 255) | 0})`;
    ctx.font = "bold 48px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      depthTest: false,
      transparent: true,
    });
    return new THREE.Sprite(material);
  }

  /**
   * Render the axes inset in the bottom-left corner.
   * Must be called AFTER the main scene render.
   */
  render(
    renderer: THREE.WebGLRenderer,
    mainCamera: THREE.Camera,
    containerWidth: number,
    containerHeight: number,
    pixelRatio: number,
  ): void {
    if (!this.visible || this.arrowGroup.children.length === 0) return;

    // Sync camera rotation with main camera
    this.axesCamera.quaternion.copy(mainCamera.quaternion);
    this.axesCamera.position
      .set(0, 0, 3)
      .applyQuaternion(mainCamera.quaternion);

    // Compute inset viewport (bottom-left, in device pixels)
    const s = INSET_SIZE * pixelRatio;
    const m = INSET_MARGIN * pixelRatio;
    const x = m;
    const y = m; // WebGL y=0 is bottom

    // Render into inset viewport
    const prevAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setViewport(x, y, s, s);
    renderer.setScissor(x, y, s, s);
    renderer.setScissorTest(true);
    renderer.clearDepth();
    renderer.render(this.axesScene, this.axesCamera);

    // Restore
    renderer.autoClear = prevAutoClear;
    const fullW = containerWidth * pixelRatio;
    const fullH = containerHeight * pixelRatio;
    renderer.setViewport(0, 0, fullW, fullH);
    renderer.setScissorTest(false);
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
  }

  isVisible(): boolean {
    return this.visible;
  }

  private disposeObject(obj: THREE.Object3D): void {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          (child.material as THREE.Material)?.dispose();
        }
      }
      if (child instanceof THREE.Sprite) {
        child.material.map?.dispose();
        child.material.dispose();
      }
    });
  }

  dispose(): void {
    while (this.arrowGroup.children.length > 0) {
      const child = this.arrowGroup.children[0];
      this.arrowGroup.remove(child);
      this.disposeObject(child);
    }
  }
}
