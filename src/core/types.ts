import type * as THREE from "three";

/** Decoded molecular snapshot data. */
export interface Snapshot {
  nAtoms: number;
  nBonds: number;
  positions: Float32Array; // length = nAtoms * 3
  elements: Uint8Array; // length = nAtoms (atomic numbers)
  bonds: Uint32Array; // length = nBonds * 2
  bondOrders: Uint8Array | null; // length = nBonds (1=single,2=double,3=triple,4=aromatic)
  box: Float32Array | null; // length = 9 (3x3 row-major cell vectors)
}

/** Decoded trajectory frame. */
export interface Frame {
  frameId: number;
  nAtoms: number;
  positions: Float32Array;
}

/** Trajectory metadata. */
export interface TrajectoryMeta {
  nFrames: number;
  timestepPs: number;
  nAtoms: number;
  pdbName?: string;
  xtcName?: string;
}

/** Interface for atom rendering backends. */
export interface AtomRenderer {
  readonly mesh: THREE.Object3D;
  loadSnapshot(snapshot: Snapshot): void;
  updatePositions(positions: Float32Array): void;
  dispose(): void;
}

/** Interface for bond rendering backends. */
export interface BondRenderer {
  readonly mesh: THREE.Object3D;
  loadSnapshot(snapshot: Snapshot): void;
  updatePositions(
    positions: Float32Array,
    bonds: Uint32Array,
    nBonds: number,
  ): void;
  dispose(): void;
}

/** Hover info for atoms. */
export interface AtomHoverInfo {
  kind: "atom";
  atomIndex: number;
  elementSymbol: string;
  atomicNumber: number;
  position: [number, number, number];
  screenX: number;
  screenY: number;
}

/** Hover info for bonds. */
export interface BondHoverInfo {
  kind: "bond";
  atomA: number;
  atomB: number;
  bondOrder: number;
  bondLength: number;
  screenX: number;
  screenY: number;
}

export type HoverInfo = AtomHoverInfo | BondHoverInfo | null;

/** Atom selection state. */
export interface SelectionState {
  atoms: number[];
}

/** Geometric measurement result. */
export interface Measurement {
  atoms: number[];
  type: "distance" | "angle" | "dihedral";
  value: number;
  label: string;
}
