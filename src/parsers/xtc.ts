/**
 * WASM-based trajectory parser wrapper.
 * Loads XTC (binary) and LAMMPS dump (text) trajectories via Rust WASM,
 * and returns Frame[] + meta.
 */

import type { Frame, TrajectoryMeta, VectorChannel, VectorFrame } from "../types";

export interface XTCParseResult {
  frames: Frame[];
  meta: TrajectoryMeta;
  /** Per-atom vector channels embedded in the file (e.g. LAMMPS dump vx/vy/vz). */
  vectorChannels: VectorChannel[];
}

let initPromise: Promise<void> | null = null;
let wasmParseXtc: ((data: Uint8Array) => WasmXtcResult) | null = null;
let wasmParseLammpstrj: ((text: string) => WasmXtcResult) | null = null;

interface WasmXtcResult {
  n_atoms: number;
  n_frames: number;
  timestep_ps: number;
  has_box: boolean;
  vector_channel_count: number;
  vector_channel_meta: string;
  box_matrix(): Float32Array;
  frame_data(): Float32Array;
  vector_channel_data(): Float32Array;
  free(): void;
}

async function ensureInit(): Promise<void> {
  if (wasmParseXtc) return;
  if (!initPromise) {
    initPromise = (async () => {
      const wasm = await import("../../crates/megane-wasm/pkg");
      const wasmUrl = (globalThis as Record<string, unknown>).__MEGANE_WASM_URL__ as
        | string
        | undefined;
      await wasm.default(wasmUrl);
      wasmParseXtc = wasm.parse_xtc_file;
      wasmParseLammpstrj = wasm.parse_lammpstrj_file;
    })();
  }
  await initPromise;
}

/** Deserialize embedded vector channels from a WASM trajectory result. */
function deserializeVectorChannels(
  nAtoms: number,
  metaStr: string,
  dataFn: () => Float32Array,
): VectorChannel[] {
  if (!metaStr || metaStr === "[]") return [];
  const meta = JSON.parse(metaStr) as Array<{ name: string; n_frames: number }>;
  if (meta.length === 0) return [];

  const data = dataFn();
  const stride = nAtoms * 3;
  const channels: VectorChannel[] = [];
  let offset = 0;

  for (const ch of meta) {
    const frames: VectorFrame[] = [];
    for (let f = 0; f < ch.n_frames; f++) {
      frames.push({ frame: f, vectors: data.slice(offset, offset + stride) });
      offset += stride;
    }
    channels.push({ name: ch.name, frames });
  }
  return channels;
}

/** Convert a WasmXtcResult into Frame[] + TrajectoryMeta + VectorChannels. */
function extractFrames(
  result: WasmXtcResult,
  expectedNAtoms: number,
  formatLabel: string,
): XTCParseResult {
  if (result.n_atoms !== expectedNAtoms) {
    const msg = `${formatLabel} atom count (${result.n_atoms}) does not match structure (${expectedNAtoms})`;
    result.free();
    throw new Error(msg);
  }

  const allData = result.frame_data();
  const stride = result.n_atoms * 3;
  const frames: Frame[] = [];

  for (let i = 0; i < result.n_frames; i++) {
    frames.push({
      frameId: i,
      nAtoms: result.n_atoms,
      positions: allData.slice(i * stride, (i + 1) * stride),
    });
  }

  const meta: TrajectoryMeta = {
    nFrames: result.n_frames,
    timestepPs: result.timestep_ps,
    nAtoms: result.n_atoms,
  };

  const vectorChannels = deserializeVectorChannels(result.n_atoms, result.vector_channel_meta, () =>
    result.vector_channel_data(),
  );

  result.free();
  return { frames, meta, vectorChannels };
}

/**
 * Parse an XTC trajectory file.
 * Returns Frame[] (all frames) and TrajectoryMeta.
 */
export async function parseXTCFile(file: File, expectedNAtoms: number): Promise<XTCParseResult> {
  await ensureInit();

  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const result = wasmParseXtc!(data) as WasmXtcResult;

  return extractFrames(result, expectedNAtoms, "XTC");
}

/**
 * Parse a LAMMPS dump trajectory file (.lammpstrj / .dump).
 * Returns Frame[] (all frames) and TrajectoryMeta.
 */
export async function parseLammpstrjFile(
  file: File,
  expectedNAtoms: number,
): Promise<XTCParseResult> {
  await ensureInit();

  const text = await file.text();
  const result = wasmParseLammpstrj!(text) as WasmXtcResult;

  return extractFrames(result, expectedNAtoms, "LAMMPS dump");
}
