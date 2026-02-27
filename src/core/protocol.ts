/**
 * Binary protocol decoder for megane.
 *
 * Format matches python/megane/protocol.py.
 * Header: "MEGN" (4 bytes) + msg_type (u8) + flags (u8) + reserved (u16)
 */

import type { Snapshot, Frame } from "./types";

const MAGIC = 0x4e47454d; // "MEGN" in little-endian

export const MSG_SNAPSHOT = 0;
export const MSG_FRAME = 1;

export function decodeHeader(buffer: ArrayBuffer): {
  msgType: number;
  flags: number;
} {
  const view = new DataView(buffer);
  const magic = view.getUint32(0, true);
  if (magic !== MAGIC) {
    throw new Error(
      `Invalid magic: 0x${magic.toString(16)}, expected 0x${MAGIC.toString(16)}`
    );
  }
  return {
    msgType: view.getUint8(4),
    flags: view.getUint8(5),
  };
}

export function decodeSnapshot(buffer: ArrayBuffer): Snapshot {
  const view = new DataView(buffer);
  let offset = 8; // skip header

  const nAtoms = view.getUint32(offset, true);
  offset += 4;
  const nBonds = view.getUint32(offset, true);
  offset += 4;

  // Positions: Float32Array[nAtoms * 3]
  const positions = new Float32Array(buffer, offset, nAtoms * 3);
  offset += nAtoms * 3 * 4;

  // Elements: Uint8Array[nAtoms], padded to 4-byte alignment
  const elements = new Uint8Array(buffer, offset, nAtoms);
  offset += nAtoms;
  offset += (4 - (offset % 4)) % 4; // alignment padding

  // Bonds: Uint32Array[nBonds * 2]
  const bonds = new Uint32Array(buffer, offset, nBonds * 2);

  return { nAtoms, nBonds, positions, elements, bonds };
}

export function decodeFrame(buffer: ArrayBuffer): Frame {
  const view = new DataView(buffer);
  let offset = 8; // skip header

  const frameId = view.getUint32(offset, true);
  offset += 4;
  const nAtoms = view.getUint32(offset, true);
  offset += 4;

  const positions = new Float32Array(buffer, offset, nAtoms * 3);

  return { frameId, nAtoms, positions };
}

export function decode(buffer: ArrayBuffer): Snapshot | Frame {
  const { msgType } = decodeHeader(buffer);
  switch (msgType) {
    case MSG_SNAPSHOT:
      return decodeSnapshot(buffer);
    case MSG_FRAME:
      return decodeFrame(buffer);
    default:
      throw new Error(`Unknown message type: ${msgType}`);
  }
}
