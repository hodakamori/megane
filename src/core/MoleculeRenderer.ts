/**
 * Main molecular viewer class.
 * Owns the Three.js scene, camera, renderer, and controls.
 * Imperative API - framework agnostic.
 *
 * Automatically selects rendering strategy based on atom count:
 *   <=5,000 atoms  -> InstancedMesh (sphere/cylinder geometry) with SSAO
 *   >5,000 atoms   -> Billboard impostors (2-triangle quads + shader)
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type {
  Snapshot,
  Frame,
  AtomRenderer,
  BondRenderer,
  HoverInfo,
  SelectionState,
  Measurement,
} from "./types";
import { AtomMesh } from "./AtomMesh";
import { BondMesh } from "./BondMesh";
import { ImpostorAtomMesh } from "./ImpostorAtomMesh";
import { ImpostorBondMesh } from "./ImpostorBondMesh";
import { CellRenderer } from "./CellRenderer";
import {
  getElementSymbol,
  getRadius,
  BALL_STICK_ATOM_SCALE,
  BOND_ORDER_NAMES,
} from "./constants";

/** Threshold above which we use impostor rendering. */
const IMPOSTOR_THRESHOLD = 5_000;

export class MoleculeRenderer {
  private container: HTMLElement | null = null;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private atomRenderer: AtomRenderer | null = null;
  private bondRenderer: BondRenderer | null = null;
  private cellRenderer: CellRenderer | null = null;
  private useImpostor = false;
  private animationId: number | null = null;
  private snapshot: Snapshot | null = null;
  private lastExtent = 1;
  private currentPositions: Float32Array | null = null;

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  // Atom selection & measurement
  private selectedAtoms: number[] = [];
  private selectionGroup = new THREE.Group();

  // Post-processing (SSAO only for InstancedMesh path)
  private composer: EffectComposer | null = null;
  private ssaoPass: SSAOPass | null = null;
  private useSSAO = false;

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
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.9;
    container.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // Environment map for PBR materials
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();
    this.scene.environment = pmrem.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;
    pmrem.dispose();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      10000,
    );
    this.camera.position.set(0, 0, 50);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 1.2;

    // Lighting - hemisphere + 3-point
    const hemi = new THREE.HemisphereLight(0xddeeff, 0x997744, 0.4);
    this.scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(50, 50, 50);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-30, 20, -20);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(0, -30, -50);
    this.scene.add(rimLight);

    // Selection overlay group
    this.scene.add(this.selectionGroup);

    // Post-processing pipeline (will be enabled for InstancedMesh path)
    this.setupPostProcessing();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => this.onResize());
    resizeObserver.observe(container);

    // Start render loop
    this.animate();
  }

  private setupPostProcessing(): void {
    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.ssaoPass = new SSAOPass(
      this.scene,
      this.camera,
      this.container!.clientWidth,
      this.container!.clientHeight,
    );
    this.ssaoPass.kernelRadius = 16;
    this.ssaoPass.minDistance = 0.001;
    this.ssaoPass.maxDistance = 0.15;
    this.composer.addPass(this.ssaoPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }

  /** Load a molecular snapshot (topology + positions). */
  loadSnapshot(snapshot: Snapshot): void {
    this.snapshot = snapshot;
    this.currentPositions = new Float32Array(snapshot.positions);

    // Pick rendering strategy based on atom count
    const shouldUseImpostor = snapshot.nAtoms > IMPOSTOR_THRESHOLD;

    // Enable SSAO only for InstancedMesh path
    this.useSSAO = !shouldUseImpostor;
    if (this.ssaoPass) {
      this.ssaoPass.enabled = this.useSSAO;
    }

    // Rebuild renderers if strategy changed or first load
    if (
      this.atomRenderer === null ||
      shouldUseImpostor !== this.useImpostor
    ) {
      this.swapRenderers(shouldUseImpostor);
    }

    this.atomRenderer!.loadSnapshot(snapshot);
    this.bondRenderer!.loadSnapshot(snapshot);

    // Update simulation cell
    if (snapshot.box) {
      const hasNonZero = snapshot.box.some((v) => v !== 0);
      if (hasNonZero) {
        if (!this.cellRenderer) {
          this.cellRenderer = new CellRenderer();
          this.scene.add(this.cellRenderer.mesh);
        }
        this.cellRenderer.loadBox(snapshot.box);
      }
    }

    this.fitToView(snapshot);

    // Scale SSAO parameters to molecule size
    if (this.ssaoPass && this.useSSAO) {
      const scaledRadius = Math.max(0.5, Math.min(4.0, this.lastExtent * 0.04));
      this.ssaoPass.kernelRadius = scaledRadius;
      this.ssaoPass.minDistance = 0.001;
      this.ssaoPass.maxDistance = 0.05;
    }
  }

  /** Update positions from a trajectory frame. */
  updateFrame(frame: Frame): void {
    if (!this.snapshot || !this.atomRenderer || !this.bondRenderer) return;
    this.currentPositions = new Float32Array(frame.positions);
    this.atomRenderer.updatePositions(frame.positions);
    this.bondRenderer.updatePositions(
      frame.positions,
      this.snapshot.bonds,
      this.snapshot.nBonds,
    );
    if (this.selectedAtoms.length > 0) {
      this.updateSelectionVisuals();
    }
  }

  /** Toggle simulation cell visibility. */
  setCellVisible(visible: boolean): void {
    if (this.cellRenderer) {
      this.cellRenderer.setVisible(visible);
    }
  }

  /** Check if cell data exists. */
  hasCell(): boolean {
    return this.cellRenderer !== null && this.cellRenderer.mesh.visible;
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
    this.lastExtent = extent;

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

  /** Get the canvas element for event listener attachment. */
  getCanvas(): HTMLCanvasElement | null {
    return this.renderer?.domElement ?? null;
  }

  /** Get current atom positions (may reflect trajectory frame). */
  private getCurrentPositions(): Float32Array {
    return this.currentPositions ?? this.snapshot!.positions;
  }

  // ---- Raycasting ----

  /** Perform a raycast at the given screen coordinates. */
  raycastAtPixel(clientX: number, clientY: number): HoverInfo {
    if (!this.container || !this.snapshot) return null;

    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Try atoms first
    if (this.atomRenderer && !this.useImpostor) {
      const hits = this.raycaster.intersectObject(this.atomRenderer.mesh, false);
      if (hits.length > 0 && hits[0].instanceId !== undefined) {
        const idx = hits[0].instanceId;
        const pos = this.getCurrentPositions();
        const atomicNum = this.snapshot.elements[idx];
        return {
          kind: "atom",
          atomIndex: idx,
          elementSymbol: getElementSymbol(atomicNum),
          atomicNumber: atomicNum,
          position: [pos[idx * 3], pos[idx * 3 + 1], pos[idx * 3 + 2]],
          screenX: clientX,
          screenY: clientY,
        };
      }
    }

    // Try bonds
    if (this.bondRenderer && !this.useImpostor) {
      const hits = this.raycaster.intersectObject(this.bondRenderer.mesh, false);
      if (hits.length > 0 && hits[0].instanceId !== undefined) {
        const info = this.getBondInfoFromInstance(hits[0].instanceId);
        if (info) {
          return { kind: "bond", ...info, screenX: clientX, screenY: clientY };
        }
      }
    }

    return null;
  }

  private getBondInfoFromInstance(
    instanceId: number,
  ): { atomA: number; atomB: number; bondOrder: number; bondLength: number } | null {
    if (!this.snapshot || !this.bondRenderer || this.useImpostor) return null;
    const bondMesh = this.bondRenderer as BondMesh;
    if (instanceId >= bondMesh.visualBonds.length) return null;

    const vb = bondMesh.visualBonds[instanceId];
    const pos = this.getCurrentPositions();
    const dx = pos[vb.bi * 3] - pos[vb.ai * 3];
    const dy = pos[vb.bi * 3 + 1] - pos[vb.ai * 3 + 1];
    const dz = pos[vb.bi * 3 + 2] - pos[vb.ai * 3 + 2];
    const bondLength = Math.sqrt(dx * dx + dy * dy + dz * dz);

    let bondOrder = 1;
    if (this.snapshot.bondOrders) {
      const bonds = this.snapshot.bonds;
      for (let i = 0; i < this.snapshot.nBonds; i++) {
        const a = bonds[i * 2], b = bonds[i * 2 + 1];
        if ((a === vb.ai && b === vb.bi) || (a === vb.bi && b === vb.ai)) {
          bondOrder = this.snapshot.bondOrders[i];
          break;
        }
      }
    }

    return { atomA: vb.ai, atomB: vb.bi, bondOrder, bondLength };
  }

  // ---- Selection & Measurement ----

  /** Toggle atom selection (right-click). Returns new selection state. */
  toggleAtomSelection(atomIndex: number): SelectionState {
    const idx = this.selectedAtoms.indexOf(atomIndex);
    if (idx >= 0) {
      this.selectedAtoms.splice(idx, 1);
    } else {
      if (this.selectedAtoms.length >= 4) {
        this.selectedAtoms.shift();
      }
      this.selectedAtoms.push(atomIndex);
    }
    this.updateSelectionVisuals();
    return { atoms: [...this.selectedAtoms] };
  }

  /** Clear all selected atoms. */
  clearSelection(): void {
    this.selectedAtoms = [];
    this.updateSelectionVisuals();
  }

  /** Compute the current geometric measurement based on selected atoms. */
  getMeasurement(): Measurement | null {
    if (!this.snapshot || this.selectedAtoms.length < 2) return null;
    const pos = this.getCurrentPositions();
    const atoms = this.selectedAtoms;

    if (atoms.length === 2) {
      const d = this.computeDistance(pos, atoms[0], atoms[1]);
      return { atoms: [...atoms], type: "distance", value: d, label: `${d.toFixed(3)} \u00c5` };
    }
    if (atoms.length === 3) {
      const a = this.computeAngle(pos, atoms[0], atoms[1], atoms[2]);
      return { atoms: [...atoms], type: "angle", value: a, label: `${a.toFixed(1)}\u00b0` };
    }
    if (atoms.length === 4) {
      const d = this.computeDihedral(pos, atoms[0], atoms[1], atoms[2], atoms[3]);
      return { atoms: [...atoms], type: "dihedral", value: d, label: `${d.toFixed(1)}\u00b0` };
    }
    return null;
  }

  private computeDistance(pos: Float32Array, a: number, b: number): number {
    const dx = pos[b * 3] - pos[a * 3];
    const dy = pos[b * 3 + 1] - pos[a * 3 + 1];
    const dz = pos[b * 3 + 2] - pos[a * 3 + 2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private computeAngle(pos: Float32Array, a: number, b: number, c: number): number {
    const bax = pos[a * 3] - pos[b * 3];
    const bay = pos[a * 3 + 1] - pos[b * 3 + 1];
    const baz = pos[a * 3 + 2] - pos[b * 3 + 2];
    const bcx = pos[c * 3] - pos[b * 3];
    const bcy = pos[c * 3 + 1] - pos[b * 3 + 1];
    const bcz = pos[c * 3 + 2] - pos[b * 3 + 2];
    const dot = bax * bcx + bay * bcy + baz * bcz;
    const magBA = Math.sqrt(bax * bax + bay * bay + baz * baz);
    const magBC = Math.sqrt(bcx * bcx + bcy * bcy + bcz * bcz);
    return Math.acos(Math.max(-1, Math.min(1, dot / (magBA * magBC)))) * (180 / Math.PI);
  }

  private computeDihedral(
    pos: Float32Array, a: number, b: number, c: number, d: number,
  ): number {
    const b1x = pos[b * 3] - pos[a * 3], b1y = pos[b * 3 + 1] - pos[a * 3 + 1], b1z = pos[b * 3 + 2] - pos[a * 3 + 2];
    const b2x = pos[c * 3] - pos[b * 3], b2y = pos[c * 3 + 1] - pos[b * 3 + 1], b2z = pos[c * 3 + 2] - pos[b * 3 + 2];
    const b3x = pos[d * 3] - pos[c * 3], b3y = pos[d * 3 + 1] - pos[c * 3 + 1], b3z = pos[d * 3 + 2] - pos[c * 3 + 2];
    const n1x = b1y * b2z - b1z * b2y, n1y = b1z * b2x - b1x * b2z, n1z = b1x * b2y - b1y * b2x;
    const n2x = b2y * b3z - b2z * b3y, n2y = b2z * b3x - b2x * b3z, n2z = b2x * b3y - b2y * b3x;
    const b2len = Math.sqrt(b2x * b2x + b2y * b2y + b2z * b2z);
    const ub2x = b2x / b2len, ub2y = b2y / b2len, ub2z = b2z / b2len;
    const m1x = n1y * ub2z - n1z * ub2y, m1y = n1z * ub2x - n1x * ub2z, m1z = n1x * ub2y - n1y * ub2x;
    const x = n1x * n2x + n1y * n2y + n1z * n2z;
    const y = m1x * n2x + m1y * n2y + m1z * n2z;
    return Math.atan2(y, x) * (180 / Math.PI);
  }

  private updateSelectionVisuals(): void {
    // Clear old visuals
    while (this.selectionGroup.children.length > 0) {
      const child = this.selectionGroup.children[0];
      this.selectionGroup.remove(child);
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    if (!this.snapshot || this.selectedAtoms.length === 0) return;

    const pos = this.getCurrentPositions();
    const elements = this.snapshot.elements;

    // Highlight spheres
    for (const atomIdx of this.selectedAtoms) {
      const r = getRadius(elements[atomIdx]) * BALL_STICK_ATOM_SCALE * 1.6;
      const geo = new THREE.SphereGeometry(r, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x4285f4,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(
        pos[atomIdx * 3],
        pos[atomIdx * 3 + 1],
        pos[atomIdx * 3 + 2],
      );
      this.selectionGroup.add(sphere);
    }

    // Connecting lines
    if (this.selectedAtoms.length >= 2) {
      const points = this.selectedAtoms.map(
        (i) => new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]),
      );
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x4285f4,
        depthTest: false,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.renderOrder = 999;
      this.selectionGroup.add(line);
    }
  }

  private onResize(): void {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    if (this.composer) {
      this.composer.setSize(w, h);
    }
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);
    this.controls.update();

    if (this.useSSAO && this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  };

  /** Clean up all resources. */
  dispose(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.clearSelection();
    if (this.atomRenderer) this.atomRenderer.dispose();
    if (this.bondRenderer) this.bondRenderer.dispose();
    if (this.cellRenderer) this.cellRenderer.dispose();
    if (this.composer) this.composer.dispose();
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
