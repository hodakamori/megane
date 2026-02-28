/**
 * WASM-based PDB parser wrapper.
 * Loads the Rust WASM module and converts results to megane Snapshot/Frame types.
 */

import type { Snapshot, Frame, TrajectoryMeta } from "../types";

export interface PDBParseResult {
  snapshot: Snapshot;
  frames: Frame[];
  meta: TrajectoryMeta | null;
}

let initPromise: Promise<void> | null = null;
let wasmParsePdb: ((text: string) => WasmParseResult) | null = null;

interface WasmParseResult {
  n_atoms: number;
  n_bonds: number;
  n_frames: number;
  has_box: boolean;
  positions(): Float32Array;
  elements(): Uint8Array;
  bonds(): Uint32Array;
  bond_orders(): Uint8Array;
  box_matrix(): Float32Array;
  frame_data(): Float32Array;
  free(): void;
}

async function ensureInit(): Promise<void> {
  if (wasmParsePdb) return;
  if (!initPromise) {
    initPromise = (async () => {
      const wasm = await import("../../../wasm/pkg");
      await wasm.default();
      wasmParsePdb = wasm.parse_pdb;
    })();
  }
  await initPromise;
}

/**
 * Parse PDB text directly using the WASM parser.
 */
export async function parsePDBText(text: string): Promise<PDBParseResult> {
  await ensureInit();
  return parsePDBFromText(text);
}

/**
 * Parse a PDB File object using the WASM parser.
 * Returns a Snapshot (first model) and optional trajectory Frames.
 */
export async function parsePDBFile(file: File): Promise<PDBParseResult> {
  await ensureInit();

  const text = await file.text();
  return parsePDBFromText(text);
}

function parsePDBFromText(text: string): PDBParseResult {
  const result = wasmParsePdb!(text) as WasmParseResult;

  const snapshot: Snapshot = {
    nAtoms: result.n_atoms,
    nBonds: result.n_bonds,
    positions: result.positions(),
    elements: result.elements(),
    bonds: result.bonds(),
    bondOrders: result.bond_orders(),
    box: result.has_box ? result.box_matrix() : null,
  };

  const frames: Frame[] = [];
  if (result.n_frames > 0) {
    const allData = result.frame_data();
    const stride = result.n_atoms * 3;
    for (let i = 0; i < result.n_frames; i++) {
      frames.push({
        frameId: i + 1,
        nAtoms: result.n_atoms,
        positions: allData.slice(i * stride, (i + 1) * stride),
      });
    }
  }

  result.free();

  const meta: TrajectoryMeta | null =
    frames.length > 0
      ? { nFrames: frames.length + 1, timestepPs: 1.0, nAtoms: snapshot.nAtoms }
      : null;

  return { snapshot, frames, meta };
}
