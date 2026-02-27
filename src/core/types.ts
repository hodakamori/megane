import type * as THREE from "three";

/** Decoded molecular snapshot data. */
export interface Snapshot {
  nAtoms: number;
  nBonds: number;
  positions: Float32Array; // length = nAtoms * 3
  elements: Uint8Array; // length = nAtoms (atomic numbers)
  bonds: Uint32Array; // length = nBonds * 2
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
