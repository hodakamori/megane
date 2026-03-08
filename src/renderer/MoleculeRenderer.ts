/**
 * Main molecular viewer class.
 * Owns the Three.js scene, camera, renderer, and controls.
 * Imperative API - framework agnostic.
 *
 * Uses billboard impostor rendering (2-triangle quads + shader) for all
 * atom counts. Scales to 1M+ atoms on mid-range GPUs.
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type {
  Snapshot,
  Frame,
  AtomRenderer,
  BondRenderer,
  HoverInfo,
  SelectionState,
  Measurement,
} from "../types";
import { ImpostorAtomMesh } from "./ImpostorAtomMesh";
import { ImpostorBondMesh } from "./ImpostorBondMesh";
import { CellRenderer } from "./CellRenderer";
import { CellAxesRenderer } from "./CellAxesRenderer";
import { LabelOverlay } from "./LabelOverlay";
import { ArrowRenderer } from "./ArrowRenderer";
import { PolyhedronRenderer } from "./PolyhedronRenderer";
import type { MeshData } from "../pipeline/types";
import {
  getElementSymbol,
  getRadius,
  BALL_STICK_ATOM_SCALE,
  BOND_ORDER_NAMES,
} from "../constants";

// Temporary vector for screen-space projection (avoids allocation per atom)
const _projVec = new THREE.Vector4();

export class MoleculeRenderer {
  private container: HTMLElement | null = null;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private perspectiveMode = false;
  private atomRenderer: AtomRenderer | null = null;
  private bondRenderer: BondRenderer | null = null;
  private cellRenderer: CellRenderer | null = null;
  private cellAxesRenderer: CellAxesRenderer | null = null;
  private labelOverlay: LabelOverlay | null = null;
  private arrowRenderer: ArrowRenderer | null = null;
  private polyhedronRenderer: PolyhedronRenderer | null = null;
  private useImpostor = false;
  private animationId: number | null = null;
  private snapshot: Snapshot | null = null;
  private lastExtent = 1;
  private lastExtentX = 1;
  private lastExtentY = 1;
  private currentPositions: Float32Array | null = null;
  /** Axes-inset drag state */
  private axesDragging = false;
  private axesDragLastX = 0;
  private axesDragLastY = 0;
  private atomScale = 1.0;
  private atomOpacity = 1.0;
  private bondScale = 1.0;
  private bondOpacity = 1.0;
  private viewInsetLeft = 0;
  private viewInsetRight = 0;
  private dprMediaQuery: MediaQueryList | null = null;
  private dprChangeHandler: (() => void) | null = null;
  // Cached dimensions for frame-synchronous resize detection
  private lastContainerW = 0;
  private lastContainerH = 0;
  private lastDpr = 1;

  // (screen-space picking replaces Three.js raycasting)

  // Atom selection & measurement
  private selectedAtoms: number[] = [];
  private selectionGroup = new THREE.Group();

  /** Mount the viewer into a DOM element. */
  mount(container: HTMLElement): void {
    this.container = container;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight, false);
    this.renderer.setClearColor(0xffffff, 1);
    // Position both canvases identically within the container
    // to prevent sub-pixel layout drift at non-100% browser zoom.
    // Use CSS 100% sizing instead of explicit pixel values so the canvas
    // always matches the container exactly, even at fractional zoom levels.
    const domEl = this.renderer.domElement;
    domEl.style.display = "block";
    domEl.style.position = "absolute";
    domEl.style.top = "0";
    domEl.style.left = "0";
    domEl.style.width = "100%";
    domEl.style.height = "100%";
    container.appendChild(domEl);

    // Label overlay (Canvas 2D on top of WebGL)
    this.labelOverlay = new LabelOverlay();
    container.appendChild(this.labelOverlay.getCanvas());
    this.labelOverlay.resize(
      container.clientWidth,
      container.clientHeight,
      Math.min(window.devicePixelRatio, 2),
    );

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // Camera (orthographic by default, like OVITO)
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 50;
    this.camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2, frustumSize * aspect / 2,
      frustumSize / 2, -frustumSize / 2,
      0.1, 10000,
    );
    this.camera.position.set(0, -50, 0);
    this.camera.up.set(0, 0, 1);

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

    // Resize observer
    const resizeObserver = new ResizeObserver(() => this.onResize());
    resizeObserver.observe(container);

    // Listen for DPR changes (e.g. moving window between displays)
    this.setupDprListener();

    // Start render loop
    this.animate();
  }

  /** Load a molecular snapshot (topology + positions). */
  loadSnapshot(snapshot: Snapshot): void {
    this.snapshot = snapshot;
    this.currentPositions = new Float32Array(snapshot.positions);

    // Always use impostor rendering for consistent behavior at any atom count
    if (this.atomRenderer === null || !this.useImpostor) {
      this.swapRenderers(true);
    }

    this.atomRenderer!.loadSnapshot(snapshot);
    this.bondRenderer!.loadSnapshot(snapshot);

    // Re-apply stored scale after loading snapshot data
    if (this.atomScale !== 1.0 && this.atomRenderer!.setScale) {
      this.atomRenderer!.setScale(this.atomScale, snapshot);
    }
    if (this.bondScale !== 1.0 && this.bondRenderer!.setScale) {
      this.bondRenderer!.setScale(this.bondScale, snapshot);
    }

    // Update label overlay
    if (this.labelOverlay) {
      this.labelOverlay.setAtomData(snapshot.elements, snapshot.nAtoms);
      this.labelOverlay.setPositions(snapshot.positions);
    }

    // Initialize arrow renderer (lazy)
    if (!this.arrowRenderer) {
      this.arrowRenderer = new ArrowRenderer(snapshot.nAtoms);
      this.scene.add(this.arrowRenderer.mesh);
    }
    this.arrowRenderer.setAtomPositions(snapshot.positions, snapshot.nAtoms);

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
      if (hasNonZero) {
        try {
          if (!this.cellAxesRenderer) {
            this.cellAxesRenderer = new CellAxesRenderer();
          }
          this.cellAxesRenderer.loadBox(snapshot.box);
        } catch (e) {
          console.warn("CellAxesRenderer init error:", e);
          this.cellAxesRenderer = null;
        }
      }
    }

    this.fitToView(snapshot);
  }

  /** Update positions from a trajectory frame. */
  updateFrame(frame: Frame): void {
    if (!this.snapshot || !this.atomRenderer || !this.bondRenderer) return;
    if (!this.currentPositions || this.currentPositions.length < frame.positions.length) {
      this.currentPositions = new Float32Array(frame.positions.length);
    }
    this.currentPositions.set(frame.positions);
    this.atomRenderer.updatePositions(frame.positions);
    this.labelOverlay?.setPositions(frame.positions);
    this.arrowRenderer?.setAtomPositions(frame.positions, frame.nAtoms);
    this.bondRenderer.updatePositions(
      frame.positions,
      this.snapshot.bonds,
      this.snapshot.nBonds,
    );
    if (this.selectedAtoms.length > 0) {
      this.updateSelectionVisuals();
    }
  }

  /**
   * Replace bond data and re-render bonds without resetting the camera.
   * Used for per-frame bond recalculation (e.g. distance-based bonds).
   */
  updateBonds(
    bonds: Uint32Array,
    bondOrders: Uint8Array | null,
  ): void {
    if (!this.snapshot || !this.bondRenderer) return;
    const positions = this.currentPositions ?? this.snapshot.positions;
    const updated: Snapshot = {
      ...this.snapshot,
      nBonds: bonds.length / 2,
      bonds,
      bondOrders,
    };
    this.snapshot = updated;
    this.bondRenderer.loadSnapshot({
      ...updated,
      positions,
    });
    if (this.bondScale !== 1.0 && this.bondRenderer.setScale) {
      this.bondRenderer.setScale(this.bondScale, updated);
    }
  }

  /** Set per-atom labels for overlay display. */
  setLabels(labels: string[] | null): void {
    this.labelOverlay?.setLabels(labels);
  }

  /** Set per-atom vector data for arrow display. */
  setVectors(vectors: Float32Array | null): void {
    this.arrowRenderer?.setVectors(vectors);
  }

  /** Set arrow scale multiplier. */
  setVectorScale(scale: number): void {
    this.arrowRenderer?.setScale(scale);
  }

  /** Load polyhedra mesh data for rendering. */
  loadPolyhedra(data: MeshData): void {
    if (!this.polyhedronRenderer) {
      this.polyhedronRenderer = new PolyhedronRenderer();
      this.scene.add(this.polyhedronRenderer.group);
    }
    this.polyhedronRenderer.loadMeshData(data);
  }

  /** Clear all polyhedra from the scene. */
  clearPolyhedra(): void {
    if (this.polyhedronRenderer) {
      this.polyhedronRenderer.clear();
    }
  }

  /** Set atom radius scale multiplier. */
  setAtomScale(scale: number): void {
    this.atomScale = scale;
    if (this.atomRenderer?.setScale && this.snapshot) {
      this.atomRenderer.setScale(scale, this.snapshot);
    }
  }

  /** Set atom opacity (independent of bonds). */
  setAtomOpacity(opacity: number): void {
    this.atomOpacity = opacity;
    this.atomRenderer?.setOpacity?.(opacity);
  }

  /** Set per-atom scale overrides from selection pipeline. */
  setAtomScaleOverrides(overrides: Float32Array): void {
    this.atomRenderer?.setScaleOverrides?.(overrides);
  }

  /** Set per-atom opacity overrides from selection pipeline. */
  setAtomOpacityOverrides(overrides: Float32Array): void {
    this.atomRenderer?.setOpacityOverrides?.(overrides);
  }

  /** Clear all per-atom overrides, reverting to global uniforms. */
  clearAtomOverrides(): void {
    this.atomRenderer?.clearOverrides?.();
  }

  /** Set bond radius scale multiplier. */
  setBondScale(scale: number): void {
    this.bondScale = scale;
    if (this.bondRenderer?.setScale && this.snapshot) {
      this.bondRenderer.setScale(scale, this.snapshot);
    }
  }

  /** Set bond opacity (independent of atoms). */
  setBondOpacity(opacity: number): void {
    this.bondOpacity = opacity;
    this.bondRenderer?.setOpacity?.(opacity);
  }

  /** Toggle atom visibility. */
  setAtomsVisible(visible: boolean): void {
    if (this.atomRenderer) {
      this.atomRenderer.mesh.visible = visible;
    }
  }

  /** Toggle bond visibility. */
  setBondsVisible(visible: boolean): void {
    if (this.bondRenderer) {
      this.bondRenderer.mesh.visible = visible;
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

  /** Toggle cell axes indicator visibility. */
  setCellAxesVisible(visible: boolean): void {
    if (this.cellAxesRenderer) {
      this.cellAxesRenderer.setVisible(visible);
    }
  }

  // ── Axes inset drag API ───────────────────────────────────

  /** Returns true if the CSS-pixel coordinate hits the axes inset. */
  hitTestAxesInset(cssX: number, cssY: number): boolean {
    if (!this.cellAxesRenderer || !this.container) return false;
    return this.cellAxesRenderer.hitTest(
      cssX,
      cssY,
      this.container.clientHeight,
    );
  }

  /** Begin an axes-inset drag at the given CSS coordinates. */
  startAxesDrag(cssX: number, cssY: number): void {
    this.axesDragging = true;
    this.axesDragLastX = cssX;
    this.axesDragLastY = cssY;
    // Disable orbit controls while dragging the inset
    this.controls.enabled = false;
  }

  /** Continue an axes-inset drag. Returns true if currently dragging. */
  moveAxesDrag(cssX: number, cssY: number): boolean {
    if (!this.axesDragging || !this.cellAxesRenderer || !this.container)
      return false;
    const dx = cssX - this.axesDragLastX;
    const dy = cssY - this.axesDragLastY;
    this.axesDragLastX = cssX;
    this.axesDragLastY = cssY;
    this.cellAxesRenderer.moveBy(
      dx,
      dy,
      this.container.clientWidth,
      this.container.clientHeight,
    );
    return true;
  }

  /** End the axes-inset drag. */
  endAxesDrag(): void {
    if (!this.axesDragging) return;
    this.axesDragging = false;
    this.controls.enabled = true;
  }

  /** Whether an axes drag is in progress. */
  isAxesDragging(): boolean {
    return this.axesDragging;
  }

  /** Check if cell axes data exists. */
  hasCellAxes(): boolean {
    return this.cellAxesRenderer !== null;
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

    const atoms = new ImpostorAtomMesh();
    const bonds = new ImpostorBondMesh();
    this.atomRenderer = atoms;
    this.bondRenderer = bonds;

    this.scene.add(this.atomRenderer.mesh);
    this.scene.add(this.bondRenderer.mesh);

    // Re-apply stored appearance settings
    if (this.atomOpacity !== 1.0) {
      this.atomRenderer.setOpacity?.(this.atomOpacity);
    }
    if (this.bondOpacity !== 1.0) {
      this.bondRenderer.setOpacity?.(this.bondOpacity);
    }
  }

  /** Fit camera to show all atoms (or simulation cell if present). */
  private fitToView(snapshot: Snapshot): void {
    const { positions, nAtoms } = snapshot;

    // Compute centroid (center of mass assuming equal weights)
    let sumX = 0, sumY = 0, sumZ = 0;
    for (let i = 0; i < nAtoms; i++) {
      sumX += positions[i * 3];
      sumY += positions[i * 3 + 1];
      sumZ += positions[i * 3 + 2];
    }

    let cx: number, cy: number, cz: number;

    // Determine bounding box for zoom fitting
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    const hasBox = snapshot.box && snapshot.box.some((v) => v !== 0);

    if (hasBox) {
      const box = snapshot.box!;
      // Cell center = (va + vb + vc) / 2
      cx = (box[0] + box[3] + box[6]) / 2;
      cy = (box[1] + box[4] + box[7]) / 2;
      cz = (box[2] + box[5] + box[8]) / 2;

      // Compute bounding box from all 8 cell vertices
      const va = [box[0], box[1], box[2]];
      const vb = [box[3], box[4], box[5]];
      const vc = [box[6], box[7], box[8]];
      for (let ia = 0; ia <= 1; ia++) {
        for (let ib = 0; ib <= 1; ib++) {
          for (let ic = 0; ic <= 1; ic++) {
            const vx = ia * va[0] + ib * vb[0] + ic * vc[0];
            const vy = ia * va[1] + ib * vb[1] + ic * vc[1];
            const vz = ia * va[2] + ib * vb[2] + ic * vc[2];
            minX = Math.min(minX, vx);
            minY = Math.min(minY, vy);
            minZ = Math.min(minZ, vz);
            maxX = Math.max(maxX, vx);
            maxY = Math.max(maxY, vy);
            maxZ = Math.max(maxZ, vz);
          }
        }
      }
    } else {
      // No cell box: use atom centroid as center
      cx = nAtoms > 0 ? sumX / nAtoms : 0;
      cy = nAtoms > 0 ? sumY / nAtoms : 0;
      cz = nAtoms > 0 ? sumZ / nAtoms : 0;

      // Bounding box from atom positions
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
    }

    const extentX = maxX - minX;
    const extentY = maxY - minY;
    const extentZ = maxZ - minZ;
    const maxExtent = Math.max(extentX, extentY, extentZ);
    this.lastExtent = maxExtent;
    this.lastExtentX = extentX;
    this.lastExtentY = extentY;

    this.controls.target.set(cx, cy, cz);

    const distance = Math.max(maxExtent * 1.2, 0.1);
    this.camera.position.set(cx, cy - distance, cz);

    if (this.camera instanceof THREE.OrthographicCamera) {
      this.camera.near = -distance * 10;
      this.camera.far = distance * 10;
      this.camera.zoom = 1;
      this.applyFrustumInsets();
    } else {
      this.camera.near = distance * 0.01;
      this.camera.far = distance * 10;
      this.camera.updateProjectionMatrix();
    }
    this.controls.update();
  }

  /** Reset view to fit all atoms. */
  resetView(): void {
    if (this.snapshot) {
      this.fitToView(this.snapshot);
    }
  }

  /** Set the rotation center (orbit target) to the given world coordinates. */
  setRotationCenter(x: number, y: number, z: number): void {
    this.controls.target.set(x, y, z);
    this.controls.update();
  }

  /** Set pixel insets for overlay panels that occlude viewport edges. */
  setViewInsets(left: number, right: number): void {
    this.viewInsetLeft = left;
    this.viewInsetRight = right;
    this.applyFrustumInsets();
  }

  /**
   * Recalculate the orthographic frustum so the model fits within the
   * visible area (accounting for overlay insets) and appears centered
   * in that visible area.
   */
  private applyFrustumInsets(): void {
    if (!(this.camera instanceof THREE.OrthographicCamera)) return;
    if (!this.container) return;

    const W = this.container.clientWidth;
    const H = this.container.clientHeight;
    if (W === 0 || H === 0) return;

    const leftInset = this.viewInsetLeft;
    const rightInset = this.viewInsetRight;

    // Effective visible width — guarantee at least 30% of container width
    // (or 100px) to prevent degenerate frustum on narrow viewports
    const minVisible = Math.max(W * 0.3, 100);
    const effectiveWidth = Math.max(W - leftInset - rightInset, minVisible);
    const effectiveAspect = effectiveWidth / H;

    // Size the frustum so the model fits within the visible area
    const padding = 1.2;
    const halfH =
      Math.max(this.lastExtentY / 2, this.lastExtentX / (2 * effectiveAspect)) *
      padding;
    const frustumHeight = Math.max(halfH * 2, 0.1);

    // The frustum must cover the full container (full aspect)
    const fullAspect = W / H;
    const halfW = (frustumHeight * fullAspect) / 2;

    // Start with symmetric frustum for full container
    this.camera.left = -halfW;
    this.camera.right = halfW;
    this.camera.top = frustumHeight / 2;
    this.camera.bottom = -frustumHeight / 2;

    // Offset so the model center maps to the center of the visible area.
    // visible center is (leftInset - rightInset)/2 pixels right of container center.
    const frustumWidth = 2 * halfW;
    const shift = ((leftInset - rightInset) / (2 * W)) * frustumWidth;
    this.camera.left -= shift;
    this.camera.right -= shift;

    this.camera.updateProjectionMatrix();
  }

  /** Switch between orthographic and perspective projection. */
  setPerspective(enabled: boolean): void {
    if (this.perspectiveMode === enabled) return;
    this.perspectiveMode = enabled;
    if (!this.container) return;

    // Save camera state
    const pos = this.camera.position.clone();
    const target = this.controls.target.clone();
    const up = this.camera.up.clone();

    // Create new camera
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const aspect = w / h;

    if (enabled) {
      this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 10000);
    } else {
      const frustumSize = 50;
      this.camera = new THREE.OrthographicCamera(
        -frustumSize * aspect / 2, frustumSize * aspect / 2,
        frustumSize / 2, -frustumSize / 2,
        0.1, 10000,
      );
    }

    this.camera.position.copy(pos);
    this.camera.up.copy(up);

    // Recreate controls with new camera
    const oldDamping = this.controls.enableDamping;
    const oldDampingFactor = this.controls.dampingFactor;
    const oldRotateSpeed = this.controls.rotateSpeed;
    const oldZoomSpeed = this.controls.zoomSpeed;
    this.controls.dispose();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = oldDamping;
    this.controls.dampingFactor = oldDampingFactor;
    this.controls.rotateSpeed = oldRotateSpeed;
    this.controls.zoomSpeed = oldZoomSpeed;
    this.controls.target.copy(target);
    this.controls.update();

    // Re-fit to view with new camera type
    if (this.snapshot) {
      this.fitToView(this.snapshot);
    }
  }

  /** Get the canvas element for event listener attachment. */
  getCanvas(): HTMLCanvasElement | null {
    return this.renderer?.domElement ?? null;
  }

  /** Get a copy of current atom positions (public, for external use). */
  getCurrentPositionsCopy(): Float32Array | null {
    if (!this.snapshot) return null;
    return new Float32Array(this.currentPositions ?? this.snapshot.positions);
  }

  /** Get current atom positions (may reflect trajectory frame). */
  private getCurrentPositions(): Float32Array {
    return this.currentPositions ?? this.snapshot!.positions;
  }

  // ---- Raycasting ----

  /** Project a 3D point to screen coordinates. Returns {sx, sy, depth} in pixels. */
  private projectToScreen(
    x: number, y: number, z: number,
    w: number, h: number,
  ): { sx: number; sy: number; depth: number } {
    _projVec.set(x, y, z, 1);
    _projVec.applyMatrix4(this.camera.matrixWorldInverse);
    const depth = -_projVec.z; // camera-space depth (positive = in front)
    _projVec.applyMatrix4(this.camera.projectionMatrix);
    // NDC to pixels
    const sx = ((_projVec.x / _projVec.w) * 0.5 + 0.5) * w;
    const sy = ((-_projVec.y / _projVec.w) * 0.5 + 0.5) * h;
    return { sx, sy, depth };
  }

  /** Estimate the screen-space radius (in pixels) of a sphere at the given depth. */
  private screenRadius(worldRadius: number, depth: number, h: number): number {
    if (this.camera instanceof THREE.OrthographicCamera) {
      // Orthographic: size is independent of depth
      const frustumHeight = (this.camera.top - this.camera.bottom) / this.camera.zoom;
      const pxPerUnit = h / frustumHeight;
      return worldRadius * pxPerUnit;
    }
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const pxPerUnit = h / (2 * depth * Math.tan(fovRad / 2));
    return worldRadius * pxPerUnit;
  }

  /** Perform a pick at the given screen coordinates using CPU screen-space projection. */
  raycastAtPixel(clientX: number, clientY: number): HoverInfo {
    if (!this.container || !this.snapshot) return null;

    const rect = this.container.getBoundingClientRect();
    const mx = clientX - rect.left; // mouse in pixels relative to container
    const my = clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const pos = this.getCurrentPositions();
    const elements = this.snapshot.elements;
    const nAtoms = this.snapshot.nAtoms;

    // --- Atom picking ---
    let bestAtomIdx = -1;
    let bestAtomDepth = Infinity;

    for (let i = 0; i < nAtoms; i++) {
      const { sx, sy, depth } = this.projectToScreen(
        pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], w, h,
      );
      if (depth <= 0) continue; // behind camera

      const worldR = getRadius(elements[i]) * BALL_STICK_ATOM_SCALE * this.atomScale;
      const screenR = this.screenRadius(worldR, depth, h);
      const dx = mx - sx;
      const dy = my - sy;
      const distSq = dx * dx + dy * dy;

      if (distSq <= screenR * screenR && depth < bestAtomDepth) {
        bestAtomIdx = i;
        bestAtomDepth = depth;
      }
    }

    if (bestAtomIdx >= 0) {
      const idx = bestAtomIdx;
      const atomicNum = elements[idx];
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

    // --- Bond picking ---
    const BOND_PICK_THRESHOLD_PX = 8;
    const bonds = this.snapshot.bonds;
    const nBonds = this.snapshot.nBonds;
    const bondOrders = this.snapshot.bondOrders;
    let bestBondIdx = -1;
    let bestBondDepth = Infinity;

    for (let b = 0; b < nBonds; b++) {
      const ai = bonds[b * 2];
      const bi = bonds[b * 2 + 1];
      // midpoint
      const midX = (pos[ai * 3] + pos[bi * 3]) * 0.5;
      const midY = (pos[ai * 3 + 1] + pos[bi * 3 + 1]) * 0.5;
      const midZ = (pos[ai * 3 + 2] + pos[bi * 3 + 2]) * 0.5;
      const { sx, sy, depth } = this.projectToScreen(midX, midY, midZ, w, h);
      if (depth <= 0) continue;
      const dx = mx - sx;
      const dy = my - sy;
      const distSq = dx * dx + dy * dy;
      if (distSq <= BOND_PICK_THRESHOLD_PX * BOND_PICK_THRESHOLD_PX && depth < bestBondDepth) {
        bestBondIdx = b;
        bestBondDepth = depth;
      }
    }

    if (bestBondIdx >= 0) {
      const ai = bonds[bestBondIdx * 2];
      const bi = bonds[bestBondIdx * 2 + 1];
      const dxw = pos[bi * 3] - pos[ai * 3];
      const dyw = pos[bi * 3 + 1] - pos[ai * 3 + 1];
      const dzw = pos[bi * 3 + 2] - pos[ai * 3 + 2];
      const bondLength = Math.sqrt(dxw * dxw + dyw * dyw + dzw * dzw);
      const bondOrder = bondOrders ? bondOrders[bestBondIdx] : 1;
      return {
        kind: "bond",
        atomA: ai,
        atomB: bi,
        bondOrder,
        bondLength,
        screenX: clientX,
        screenY: clientY,
      };
    }

    return null;
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

  /** Set selected atoms directly (for external triggers). Returns new selection state. */
  setSelection(atomIndices: number[]): SelectionState {
    this.selectedAtoms = atomIndices.slice(0, 4);
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

  private setupDprListener(): void {
    const update = () => {
      this.onResize();
      // Re-register for the new DPR value
      this.dprMediaQuery?.removeEventListener("change", update);
      this.dprMediaQuery = window.matchMedia(
        `(resolution: ${window.devicePixelRatio}dppx)`,
      );
      this.dprChangeHandler = update;
      this.dprMediaQuery.addEventListener("change", update);
    };
    this.dprMediaQuery = window.matchMedia(
      `(resolution: ${window.devicePixelRatio}dppx)`,
    );
    this.dprChangeHandler = update;
    this.dprMediaQuery.addEventListener("change", update);
  }

  private onResize(): void {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    // Update cached values so animate() doesn't trigger a redundant resize
    this.lastContainerW = w;
    this.lastContainerH = h;
    this.lastDpr = dpr;

    this.renderer.setPixelRatio(dpr);

    if (this.camera instanceof THREE.OrthographicCamera) {
      // Recalculate full frustum accounting for overlay insets so the view
      // stays correct when the container aspect ratio changes.
      // camera.zoom is left untouched so the user's zoom level is preserved.
      this.applyFrustumInsets();
    } else {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(w, h, false);
    this.labelOverlay?.resize(w, h, dpr);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    // Synchronize renderer state BEFORE rendering — this eliminates
    // timing gaps between ResizeObserver/matchMedia and rAF callbacks.
    // When browser zoom changes, clientWidth/DPR update immediately but
    // ResizeObserver may fire after the next rAF, causing the viewport
    // and canvas buffer to be out of sync for one or more frames.
    if (this.container) {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      if (w !== this.lastContainerW || h !== this.lastContainerH || dpr !== this.lastDpr) {
        this.lastContainerW = w;
        this.lastContainerH = h;
        this.lastDpr = dpr;
        this.onResize();
      }
    }

    this.controls.update();

    this.renderer.render(this.scene, this.camera);

    // Use renderer's internal size for all post-render passes.
    // This guarantees the viewport/dimensions match the canvas buffer,
    // even if container.clientWidth has changed since the last setSize().
    const _size = new THREE.Vector2();
    this.renderer.getSize(_size);
    const _dpr = this.renderer.getPixelRatio();

    // Render cell axes inset (after main scene, before label overlay)
    if (this.cellAxesRenderer) {
      try {
        this.cellAxesRenderer.render(
          this.renderer,
          this.camera,
          _size.x,
          _size.y,
        );
      } catch (e) {
        console.warn("CellAxesRenderer render error:", e);
        this.cellAxesRenderer = null;
      }
    }

    if (this.labelOverlay) {
      this.labelOverlay.render(
        this.camera,
        _size.x,
        _size.y,
        _dpr,
      );
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
    if (this.cellAxesRenderer) this.cellAxesRenderer.dispose();
    if (this.arrowRenderer) this.arrowRenderer.dispose();
    if (this.polyhedronRenderer) this.polyhedronRenderer.dispose();
    if (this.labelOverlay) this.labelOverlay.dispose();
    if (this.dprMediaQuery && this.dprChangeHandler) {
      this.dprMediaQuery.removeEventListener("change", this.dprChangeHandler);
    }
    this.controls.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement.parentNode) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
