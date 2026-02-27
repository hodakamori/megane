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
