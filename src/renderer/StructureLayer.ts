/**
 * StructureLayer: manages rendering objects for a single molecular structure.
 * Multiple StructureLayers can coexist in the same Three.js scene,
 * enabling overlay of e.g. all-atom and coarse-grained models.
 */

import * as THREE from "three";
import type { Snapshot, Frame, AtomRenderer, BondRenderer } from "../types";
import type { ColorContext } from "../colorSchemes";
import { ImpostorAtomMesh } from "./ImpostorAtomMesh";
import { ImpostorBondMesh } from "./ImpostorBondMesh";
import { CellRenderer } from "./CellRenderer";

export class StructureLayer {
  readonly id: string;
  snapshot: Snapshot | null = null;
  currentPositions: Float32Array | null = null;

  private scene: THREE.Scene;
  private atomRenderer: AtomRenderer | null = null;
  private bondRenderer: BondRenderer | null = null;
  private cellRenderer: CellRenderer | null = null;

  private atomScale = 1.0;
  private atomOpacity = 1.0;
  private bondScale = 1.0;
  private bondOpacity = 1.0;

  constructor(id: string, scene: THREE.Scene) {
    this.id = id;
    this.scene = scene;
  }

  loadSnapshot(snapshot: Snapshot, colorCtx?: ColorContext): void {
    this.snapshot = snapshot;
    this.currentPositions = new Float32Array(snapshot.positions);

    if (!this.atomRenderer) {
      const atoms = new ImpostorAtomMesh();
      this.atomRenderer = atoms;
      this.scene.add(atoms.mesh);
    }
    this.atomRenderer.loadSnapshot(snapshot, colorCtx);

    if (this.atomScale !== 1.0 && this.atomRenderer.setScale) {
      this.atomRenderer.setScale(this.atomScale, snapshot);
    }
    if (this.atomOpacity !== 1.0 && this.atomRenderer.setOpacity) {
      this.atomRenderer.setOpacity(this.atomOpacity);
    }

    if (!this.bondRenderer) {
      const bonds = new ImpostorBondMesh();
      this.bondRenderer = bonds;
      this.scene.add(bonds.mesh);
    }

    // Cell
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
  }

  /** Recolor the already-loaded snapshot with a new color context (no camera reset). */
  loadSnapshotWithColor(colorCtx: ColorContext | undefined): void {
    if (this.snapshot && this.atomRenderer) {
      this.atomRenderer.loadSnapshot(this.snapshot, colorCtx);
    }
  }

  updateFrame(frame: Frame): void {
    if (!this.snapshot || !this.atomRenderer || !this.bondRenderer) return;
    if (!this.currentPositions || this.currentPositions.length < frame.positions.length) {
      this.currentPositions = new Float32Array(frame.positions.length);
    }
    this.currentPositions.set(frame.positions);
    this.atomRenderer.updatePositions(frame.positions);
    this.bondRenderer.updatePositions(frame.positions, this.snapshot.bonds, this.snapshot.nBonds);
  }

  updateBondsExt(
    bonds: Uint32Array,
    bondOrders: Uint8Array | null,
    positions: Float32Array | null,
    elements: Uint8Array | null,
    nAtoms: number,
  ): void {
    if (!this.snapshot || !this.bondRenderer) return;
    const pos = positions ?? this.currentPositions ?? this.snapshot.positions;
    const elems = elements ?? this.snapshot.elements;
    const atomCount = nAtoms || this.snapshot.nAtoms;
    this.bondRenderer.loadSnapshot({
      ...this.snapshot,
      nAtoms: atomCount,
      nBonds: bonds.length / 2,
      bonds,
      bondOrders,
      positions: pos,
      elements: elems,
    });
    if (this.bondScale !== 1.0 && this.bondRenderer.setScale) {
      this.bondRenderer.setScale(this.bondScale, this.snapshot);
    }
  }

  setAtomScale(scale: number): void {
    this.atomScale = scale;
    if (this.atomRenderer?.setScale && this.snapshot) {
      this.atomRenderer.setScale(scale, this.snapshot);
    }
  }

  setAtomOpacity(opacity: number): void {
    this.atomOpacity = opacity;
    this.atomRenderer?.setOpacity?.(opacity);
  }

  setAtomScaleOverrides(overrides: Float32Array): void {
    this.atomRenderer?.setScaleOverrides?.(overrides);
  }

  setAtomOpacityOverrides(overrides: Float32Array): void {
    this.atomRenderer?.setOpacityOverrides?.(overrides);
  }

  clearAtomOverrides(): void {
    this.atomRenderer?.clearOverrides?.();
  }

  setBondScale(scale: number): void {
    this.bondScale = scale;
    if (this.bondRenderer?.setScale && this.snapshot) {
      this.bondRenderer.setScale(scale, this.snapshot);
    }
  }

  setBondOpacity(opacity: number): void {
    this.bondOpacity = opacity;
    this.bondRenderer?.setOpacity?.(opacity);
  }

  setBondOpacityOverrides(overrides: Float32Array): void {
    this.bondRenderer?.setBondOpacityOverrides?.(overrides);
  }

  clearBondOpacityOverrides(): void {
    this.bondRenderer?.clearBondOpacityOverrides?.();
  }

  setAtomsVisible(visible: boolean): void {
    if (this.atomRenderer) {
      this.atomRenderer.mesh.visible = visible;
    }
  }

  setBondsVisible(visible: boolean): void {
    if (this.bondRenderer) {
      this.bondRenderer.mesh.visible = visible;
    }
  }

  setCellVisible(visible: boolean): void {
    if (this.cellRenderer) {
      this.cellRenderer.setVisible(visible);
    }
  }

  isAtomsVisible(): boolean {
    return this.atomRenderer?.mesh.visible ?? false;
  }

  isBondsVisible(): boolean {
    return this.bondRenderer?.mesh.visible ?? false;
  }

  isCellVisible(): boolean {
    return this.cellRenderer?.mesh.visible ?? false;
  }

  getPositions(): Float32Array | null {
    return this.currentPositions ?? this.snapshot?.positions ?? null;
  }

  dispose(): void {
    if (this.atomRenderer) {
      this.scene.remove(this.atomRenderer.mesh);
      this.atomRenderer.dispose();
      this.atomRenderer = null;
    }
    if (this.bondRenderer) {
      this.scene.remove(this.bondRenderer.mesh);
      this.bondRenderer.dispose();
      this.bondRenderer = null;
    }
    if (this.cellRenderer) {
      this.scene.remove(this.cellRenderer.mesh);
      this.cellRenderer.dispose();
      this.cellRenderer = null;
    }
    this.snapshot = null;
    this.currentPositions = null;
  }
}
