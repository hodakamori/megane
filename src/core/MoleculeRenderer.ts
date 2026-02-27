/**
 * Main molecular viewer class.
 * Owns the Three.js scene, camera, renderer, and controls.
 * Imperative API - framework agnostic.
 *
 * Automatically selects rendering strategy based on atom count:
 *   ≤5,000 atoms  → InstancedMesh (sphere/cylinder geometry)
 *   >5,000 atoms  → Billboard impostors (2-triangle quads + shader)
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Snapshot, Frame } from "./types";
import { AtomMesh } from "./AtomMesh";
import { BondMesh } from "./BondMesh";
import { ImpostorAtomMesh } from "./ImpostorAtomMesh";
import { ImpostorBondMesh } from "./ImpostorBondMesh";

/** Threshold above which we use impostor rendering. */
const IMPOSTOR_THRESHOLD = 5_000;

interface AtomRenderer {
  readonly mesh: THREE.Object3D;
  loadSnapshot(snapshot: Snapshot): void;
  updatePositions(positions: Float32Array): void;
  dispose(): void;
}

interface BondRenderer {
  readonly mesh: THREE.Object3D;
  loadSnapshot(snapshot: Snapshot): void;
  updatePositions(positions: Float32Array, bonds: Uint32Array, nBonds: number): void;
  dispose(): void;
}

export class MoleculeRenderer {
  private container: HTMLElement | null = null;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private atomRenderer: AtomRenderer | null = null;
  private bondRenderer: BondRenderer | null = null;
  private useImpostor = false;
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

    // Lighting - 3-point setup (used by InstancedMesh path)
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

    // Resize observer
    const resizeObserver = new ResizeObserver(() => this.onResize());
    resizeObserver.observe(container);

    // Start render loop
    this.animate();
  }

  /** Load a molecular snapshot (topology + positions). */
  loadSnapshot(snapshot: Snapshot): void {
    this.snapshot = snapshot;

    // Pick rendering strategy based on atom count
    const shouldUseImpostor = snapshot.nAtoms > IMPOSTOR_THRESHOLD;

    // Rebuild renderers if strategy changed or first load
    if (
      this.atomRenderer === null ||
      shouldUseImpostor !== this.useImpostor
    ) {
      this.swapRenderers(shouldUseImpostor);
    }

    this.atomRenderer!.loadSnapshot(snapshot);
    this.bondRenderer!.loadSnapshot(snapshot);
    this.fitToView(snapshot);
  }

  /** Update positions from a trajectory frame. */
  updateFrame(frame: Frame): void {
    if (!this.snapshot || !this.atomRenderer || !this.bondRenderer) return;
    this.atomRenderer.updatePositions(frame.positions);
    this.bondRenderer.updatePositions(
      frame.positions,
      this.snapshot.bonds,
      this.snapshot.nBonds
    );
  }

  /** Swap between InstancedMesh and Impostor renderers. */
  private swapRenderers(impostor: boolean): void {
    // Remove old renderers
    if (this.atomRenderer) {
      this.scene.remove(this.atomRenderer.mesh);
      this.atomRenderer.dispose();
    }
    if (this.bondRenderer) {
      this.scene.remove(this.bondRenderer.mesh);
      this.bondRenderer.dispose();
    }

    this.useImpostor = impostor;

    if (impostor) {
      const atoms = new ImpostorAtomMesh();
      const bonds = new ImpostorBondMesh();
      this.atomRenderer = atoms;
      this.bondRenderer = bonds;
    } else {
      const atoms = new AtomMesh();
      const bonds = new BondMesh();
      this.atomRenderer = atoms;
      this.bondRenderer = bonds;
    }

    this.scene.add(this.atomRenderer.mesh);
    this.scene.add(this.bondRenderer.mesh);
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
    if (this.atomRenderer) this.atomRenderer.dispose();
    if (this.bondRenderer) this.bondRenderer.dispose();
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
