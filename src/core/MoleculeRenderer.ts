/**
 * Main molecular viewer class.
 * Owns the Three.js scene, camera, renderer, and controls.
 * Imperative API - framework agnostic.
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Snapshot, Frame } from "./types";
import { AtomMesh } from "./AtomMesh";
import { BondMesh } from "./BondMesh";

export class MoleculeRenderer {
  private container: HTMLElement | null = null;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private atomMesh!: AtomMesh;
  private bondMesh!: BondMesh;
  private animationId: number | null = null;
  private snapshot: Snapshot | null = null;

  /** Mount the viewer into a DOM element. */
  mount(container: HTMLElement): void {
    this.container = container;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setClearColor(0xf8f9fa, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 0, 50);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 1.2;

    // Lighting - 3-point setup
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(50, 50, 50);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-30, 20, -20);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, -30, -50);
    this.scene.add(rimLight);

    // Meshes
    this.atomMesh = new AtomMesh();
    this.scene.add(this.atomMesh.mesh);

    this.bondMesh = new BondMesh();
    this.scene.add(this.bondMesh.mesh);

    // Resize observer
    const resizeObserver = new ResizeObserver(() => this.onResize());
    resizeObserver.observe(container);

    // Start render loop
    this.animate();
  }

  /** Load a molecular snapshot (topology + positions). */
  loadSnapshot(snapshot: Snapshot): void {
    this.snapshot = snapshot;
    this.atomMesh.loadSnapshot(snapshot);
    this.bondMesh.loadSnapshot(snapshot);
    this.fitToView(snapshot);
  }

  /** Update positions from a trajectory frame. */
  updateFrame(frame: Frame): void {
    if (!this.snapshot) return;
    this.atomMesh.updatePositions(frame.positions);
    this.bondMesh.updatePositions(
      frame.positions,
      this.snapshot.bonds,
      this.snapshot.nBonds
    );
  }

  /** Fit camera to show all atoms. */
  private fitToView(snapshot: Snapshot): void {
    const { positions, nAtoms } = snapshot;

    // Compute bounding box center and extent
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity;

    for (let i = 0; i < nAtoms; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      maxZ = Math.max(maxZ, z);
    }

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const cz = (minZ + maxZ) / 2;
    const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ);

    this.controls.target.set(cx, cy, cz);
    const distance = extent * 1.2;
    this.camera.position.set(cx, cy, cz + distance);
    this.camera.near = distance * 0.01;
    this.camera.far = distance * 10;
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  /** Reset view to fit all atoms. */
  resetView(): void {
    if (this.snapshot) {
      this.fitToView(this.snapshot);
    }
  }

  private onResize(): void {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  /** Clean up all resources. */
  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.atomMesh.dispose();
    this.bondMesh.dispose();
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
