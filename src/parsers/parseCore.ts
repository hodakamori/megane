/**
 * Core WASM parse logic, shared by the main-thread sync path
 * (`parseClientSync.ts`) and the Web Worker (`parse.worker.ts`).
 *
 * This module holds the ONLY code that touches the WASM parsers and converts
 * their results into megane `Snapshot` / `Frame[]` shapes. Both the worker and
 * the synchronous fallback call these functions, guaranteeing byte-identical
 * output regardless of which host/threading path is used.
 *
 * File reading (`File.text()` / `File.arrayBuffer()`) happens in the client
 * wrappers; the functions here take already-read `text` / `bytes`.
 */

import type { Snapshot, Frame, TrajectoryMeta, VectorChannel } from "../types";
import { deserializeVectorChannels } from "./vectorChannels";
import { perfMark, perfMeasure } from "../perf";

export interface StructureParseResult {
  snapshot: Snapshot;
  frames: Frame[];
  meta: TrajectoryMeta | null;
  labels: string[] | null;
  /** Per-atom vector channels embedded in the file (e.g. GRO velocities). */
  vectorChannels: VectorChannel[];
}

export interface XTCParseResult {
  frames: Frame[];
  meta: TrajectoryMeta;
  /** Per-atom vector channels embedded in the file (e.g. LAMMPS dump vx/vy/vz). */
  vectorChannels: VectorChannel[];
}

/** Trajectory formats handled by the binary/text trajectory parsers. */
export type TrajectoryKind = "xtc" | "dcd" | "lammpstrj" | "netcdf";

let initPromise: Promise<void> | null = null;
let wasmModule: WasmModule | null = null;

interface WasmParseResult {
  n_atoms: number;
  n_bonds: number;
  n_file_bonds: number;
  n_frames: number;
  has_box: boolean;
  has_atom_labels: boolean;
  has_chain_ids: boolean;
  has_bfactors: boolean;
  atom_labels: string;
  vector_channel_count: number;
  vector_channel_meta: string;
  ca_count: number;
  symmetry_op_count: number;
  symmetry_ops: string;
  positions(): Float32Array;
  elements(): Uint8Array;
  bonds(): Uint32Array;
  bond_orders(): Uint8Array;
  box_matrix(): Float32Array;
  frame_data(): Float32Array;
  chain_ids(): Uint8Array;
  bfactors(): Float32Array;
  vector_channel_data(): Float32Array;
  ca_indices(): Uint32Array;
  ca_chain_ids(): Uint8Array;
  ca_res_nums(): Uint32Array;
  ca_ss_type(): Uint8Array;
  free(): void;
}

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

/** Persistent XTC decoder (owns the file bytes; decodes one frame on demand). */
export interface WasmXtcDecoder {
  readonly n_atoms: number;
  readonly n_frames: number;
  readonly timestep_ps: number;
  readonly has_box: boolean;
  box_matrix(): Float32Array;
  times(): Float32Array;
  decode_frame(frame: number): Float32Array;
  free(): void;
}

/** Lightweight XTC index (from `indexTrajectoryCore`) — no bulk coordinates. */
export interface XtcIndexResult {
  nAtoms: number;
  nFrames: number;
  timestepPs: number;
  hasBox: boolean;
  box: Float32Array | null;
  times: Float32Array;
}

type ParseFn = (text: string) => WasmParseResult;
type BinaryParseFn = (data: Uint8Array) => WasmParseResult;
type TrajTextParseFn = (text: string) => WasmXtcResult;
type TrajBinaryParseFn = (data: Uint8Array) => WasmXtcResult;

interface WasmModule {
  parse_pdb: ParseFn;
  parse_gro: ParseFn;
  parse_xyz: ParseFn;
  parse_mol: ParseFn;
  parse_mol2: ParseFn;
  parse_cif: ParseFn;
  parse_mmcif: ParseFn;
  parse_lammps_data: ParseFn;
  parse_prmtop: ParseFn;
  parse_traj: BinaryParseFn;
  parse_xtc_file: TrajBinaryParseFn;
  parse_dcd_file: TrajBinaryParseFn;
  parse_netcdf_file: TrajBinaryParseFn;
  parse_lammpstrj_file: TrajTextParseFn;
  XtcDecoder: new (data: Uint8Array) => WasmXtcDecoder;
  infer_bonds_vdw: (positions: Float32Array, elements: Uint8Array, n_atoms: number) => Uint32Array;
  parse_top_bonds: (text: string, n_atoms: number) => Uint32Array;
  parse_top_bonds_with_includes: (
    text: string,
    include_files: Record<string, string>,
    n_atoms: number,
  ) => Uint32Array;
  parse_psf_bonds: (text: string, n_atoms: number) => Uint32Array;
  parse_pdb_bonds: (text: string, n_atoms: number) => Uint32Array;
  extract_labels: (text: string, format: string) => string;
}

/**
 * Initialise the WASM module (memoized). `wasmUrl` is resolved on the main
 * thread and passed explicitly so this works inside a Web Worker, whose global
 * scope cannot see `globalThis.__MEGANE_WASM_URL__`. When omitted it falls back
 * to that global (the main-thread default).
 */
export async function ensureInit(wasmUrl?: string): Promise<void> {
  if (wasmModule) return;
  if (!initPromise) {
    initPromise = (async () => {
      perfMark("megane:wasm:start");
      const wasm = await import("../../crates/megane-wasm/pkg");
      const url =
        wasmUrl ??
        ((globalThis as Record<string, unknown>).__MEGANE_WASM_URL__ as string | undefined);
      await wasm.default(url);
      perfMark("megane:wasm:end");
      perfMeasure("megane:wasm-init", "megane:wasm:start", "megane:wasm:end");
      wasmModule = {
        parse_pdb: wasm.parse_pdb,
        parse_gro: wasm.parse_gro,
        parse_xyz: wasm.parse_xyz,
        parse_mol: wasm.parse_mol,
        parse_mol2: wasm.parse_mol2,
        parse_cif: wasm.parse_cif,
        parse_mmcif: wasm.parse_mmcif,
        parse_lammps_data: wasm.parse_lammps_data,
        parse_prmtop: wasm.parse_prmtop,
        parse_traj: wasm.parse_traj,
        parse_xtc_file: wasm.parse_xtc_file,
        parse_dcd_file: wasm.parse_dcd_file,
        parse_netcdf_file: wasm.parse_netcdf_file,
        parse_lammpstrj_file: wasm.parse_lammpstrj_file,
        XtcDecoder: wasm.XtcDecoder,
        infer_bonds_vdw: wasm.infer_bonds_vdw,
        parse_top_bonds: wasm.parse_top_bonds,
        parse_top_bonds_with_includes: wasm.parse_top_bonds_with_includes,
        parse_psf_bonds: wasm.parse_psf_bonds,
        parse_pdb_bonds: wasm.parse_pdb_bonds,
        extract_labels: wasm.extract_labels,
      };
    })();
  }
  await initPromise;
}

/** Choose the appropriate WASM parser based on file extension. */
function getParserForExtension(ext: string): ParseFn {
  switch (ext) {
    case ".gro":
      return wasmModule!.parse_gro;
    case ".xyz":
      return wasmModule!.parse_xyz;
    case ".mol":
    case ".sdf":
      return wasmModule!.parse_mol;
    case ".mol2":
      return wasmModule!.parse_mol2;
    case ".cif":
      return wasmModule!.parse_cif;
    case ".mmcif":
      return wasmModule!.parse_mmcif;
    case ".data":
    case ".lammps":
      return wasmModule!.parse_lammps_data;
    case ".prmtop":
      return wasmModule!.parse_prmtop;
    default:
      return wasmModule!.parse_pdb;
  }
}

/**
 * Convert a WASM structure parse result into `Snapshot` + `Frame[]`.
 * Exported for unit testing with a hand-built mock result (no WASM required).
 */
export function parseWithFn(parseFn: ParseFn, text: string): StructureParseResult {
  const result = parseFn(text) as WasmParseResult;

  const caCount = result.ca_count;
  const symmetryOps = result.symmetry_op_count > 0 ? result.symmetry_ops.split("\n") : undefined;
  const snapshot: Snapshot = {
    nAtoms: result.n_atoms,
    nBonds: result.n_bonds,
    nFileBonds: result.n_file_bonds,
    positions: result.positions(),
    elements: result.elements(),
    bonds: result.bonds(),
    bondOrders: result.bond_orders(),
    box: result.has_box ? result.box_matrix() : null,
    atomChainIds: result.has_chain_ids ? result.chain_ids() : null,
    atomBFactors: result.has_bfactors ? result.bfactors() : null,
    ...(caCount > 0 && {
      caIndices: result.ca_indices(),
      caChainIds: result.ca_chain_ids(),
      caResNums: result.ca_res_nums(),
      caSsType: result.ca_ss_type(),
    }),
    ...(symmetryOps && { symmetryOps }),
  };

  const frames: Frame[] = [];
  if (result.n_frames > 0) {
    // One wasm→JS copy for all extra frames; each frame is a zero-copy view
    // (subarray) into that single backing buffer, kept alive by the views.
    // Frames are read-only downstream, so sharing one buffer is safe.
    const allData = result.frame_data();
    const stride = result.n_atoms * 3;
    for (let i = 0; i < result.n_frames; i++) {
      frames.push({
        frameId: i + 1,
        nAtoms: result.n_atoms,
        positions: allData.subarray(i * stride, (i + 1) * stride),
      });
    }
  }

  const labels: string[] | null = result.has_atom_labels ? result.atom_labels.split("\n") : null;

  const vectorChannels = deserializeVectorChannels(result.n_atoms, result.vector_channel_meta, () =>
    result.vector_channel_data(),
  );

  result.free();

  const meta: TrajectoryMeta | null =
    frames.length > 0
      ? { nFrames: frames.length + 1, timestepPs: 1.0, nAtoms: snapshot.nAtoms }
      : null;

  return { snapshot, frames, meta, labels, vectorChannels };
}

/**
 * Convert a WASM trajectory parse result into `Frame[]` + meta + channels.
 * Exported for unit testing with a hand-built mock result (no WASM required).
 */
export function extractFrames(
  result: WasmXtcResult,
  expectedNAtoms: number,
  formatLabel: string,
): XTCParseResult {
  if (result.n_atoms !== expectedNAtoms) {
    const msg = `${formatLabel} atom count (${result.n_atoms}) does not match structure (${expectedNAtoms})`;
    result.free();
    throw new Error(msg);
  }

  // One wasm→JS copy for the whole trajectory; each frame is a zero-copy view
  // (subarray) into that single backing buffer. Frames are read-only downstream,
  // so sharing one buffer is safe. Keep `allData` alive via these views.
  const allData = result.frame_data();
  const stride = result.n_atoms * 3;
  const frames: Frame[] = [];

  for (let i = 0; i < result.n_frames; i++) {
    frames.push({
      frameId: i,
      nAtoms: result.n_atoms,
      positions: allData.subarray(i * stride, (i + 1) * stride),
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

/** Input for the structure parse core (already read from the File). */
export interface StructureParseInput {
  ext: string;
  text?: string;
  bytes?: Uint8Array;
}

/** Parse structure text/bytes (post file-read). Requires `ensureInit` first. */
export function parseStructureCore(input: StructureParseInput): StructureParseResult {
  if (input.ext === ".traj") {
    const bytes = input.bytes ?? new Uint8Array();
    const result = wasmModule!.parse_traj(bytes);
    return parseWithFn(() => result, "");
  }
  const parseFn = getParserForExtension(input.ext);
  return parseWithFn(parseFn, input.text ?? "");
}

/** Input for the trajectory parse core (already read from the File). */
export interface TrajectoryParseInput {
  kind: TrajectoryKind;
  text?: string;
  bytes?: Uint8Array;
  expectedNAtoms: number;
}

const TRAJ_LABELS: Record<TrajectoryKind, string> = {
  xtc: "XTC",
  dcd: "DCD",
  lammpstrj: "LAMMPS dump",
  netcdf: "AMBER NetCDF",
};

/** Parse trajectory text/bytes (post file-read). Requires `ensureInit` first. */
export function parseTrajectoryCore(input: TrajectoryParseInput): XTCParseResult {
  let result: WasmXtcResult;
  switch (input.kind) {
    case "xtc":
      result = wasmModule!.parse_xtc_file(input.bytes ?? new Uint8Array());
      break;
    case "dcd":
      result = wasmModule!.parse_dcd_file(input.bytes ?? new Uint8Array());
      break;
    case "netcdf":
      result = wasmModule!.parse_netcdf_file(input.bytes ?? new Uint8Array());
      break;
    case "lammpstrj":
      result = wasmModule!.parse_lammpstrj_file(input.text ?? "");
      break;
  }
  return extractFrames(result, input.expectedNAtoms, TRAJ_LABELS[input.kind]);
}

/**
 * Build a lazy XTC decoder + its frame index without decompressing coordinates.
 * The returned `decoder` OWNS the file bytes in WASM memory and must be kept
 * alive (and eventually `free()`d) by the caller — unlike the eager parse path
 * which frees its result immediately. Requires `ensureInit` first.
 */
export function indexTrajectoryCore(
  bytes: Uint8Array,
  expectedNAtoms: number,
): { decoder: WasmXtcDecoder; index: XtcIndexResult } {
  const decoder = new wasmModule!.XtcDecoder(bytes);
  if (decoder.n_atoms !== expectedNAtoms) {
    const msg = `XTC atom count (${decoder.n_atoms}) does not match structure (${expectedNAtoms})`;
    decoder.free();
    throw new Error(msg);
  }
  const index: XtcIndexResult = {
    nAtoms: decoder.n_atoms,
    nFrames: decoder.n_frames,
    timestepPs: decoder.timestep_ps,
    hasBox: decoder.has_box,
    box: decoder.has_box ? decoder.box_matrix() : null,
    times: decoder.times(),
  };
  return { decoder, index };
}

/** Decode a single frame's positions (Å) from a persistent decoder. */
export function decodeFrameCore(decoder: WasmXtcDecoder, frame: number): Float32Array {
  return decoder.decode_frame(frame);
}

/**
 * Collect the (deduplicated) backing ArrayBuffers of a parse result so the
 * worker can transfer them to the main thread with zero copy. Frames share one
 * buffer (the trajectory `frame_data`); vector-channel frames share another —
 * the `Set` collapses those duplicates so a buffer is never listed twice
 * (which would throw `DataCloneError`).
 */
export function collectResultBuffers(result: StructureParseResult | XTCParseResult): ArrayBuffer[] {
  const buffers = new Set<ArrayBuffer>();
  const add = (view?: { buffer: ArrayBufferLike } | null) => {
    if (view) buffers.add(view.buffer as ArrayBuffer);
  };
  if ("snapshot" in result) {
    const s = result.snapshot;
    add(s.positions);
    add(s.elements);
    add(s.bonds);
    add(s.bondOrders);
    add(s.box);
    add(s.atomChainIds);
    add(s.atomBFactors);
    add(s.caIndices);
    add(s.caChainIds);
    add(s.caResNums);
    add(s.caSsType);
  }
  for (const frame of result.frames) add(frame.positions);
  for (const channel of result.vectorChannels) {
    for (const vf of channel.frames) add(vf.vectors);
  }
  return [...buffers];
}

/** Infer bonds using VDW radii (threshold = vdw_sum * 0.6). Main-thread. */
export async function inferBondsVdw(
  positions: Float32Array,
  elements: Uint8Array,
  nAtoms: number,
): Promise<Uint32Array> {
  await ensureInit();
  return wasmModule!.infer_bonds_vdw(positions, elements, nAtoms);
}

/** Parse GROMACS .top file and extract bond pairs. Main-thread. */
export async function parseTopBonds(text: string, nAtoms: number): Promise<Uint32Array> {
  await ensureInit();
  return wasmModule!.parse_top_bonds(text, nAtoms);
}

/**
 * Parse a GROMACS `.top` text with `#include` resolution. Main-thread.
 *
 * `includeFiles` maps include path → file content for all `.itp` files that
 * the topology references. Missing keys are silently skipped. Throws if a
 * circular include is detected.
 */
export async function parseTopBondsWithIncludes(
  text: string,
  includeFiles: Record<string, string>,
  nAtoms: number,
): Promise<Uint32Array> {
  await ensureInit();
  return wasmModule!.parse_top_bonds_with_includes(text, includeFiles, nAtoms);
}

/** Parse CHARMM/NAMD PSF topology file and extract bond pairs. Main-thread. */
export async function parsePsfBonds(text: string, nAtoms: number): Promise<Uint32Array> {
  await ensureInit();
  return wasmModule!.parse_psf_bonds(text, nAtoms);
}

/** Extract only CONECT bonds from a PDB file. Main-thread. */
export async function parsePdbBonds(text: string, nAtoms: number): Promise<Uint32Array> {
  await ensureInit();
  return wasmModule!.parse_pdb_bonds(text, nAtoms);
}

/** Extract atom labels from a file (structure format or plain text). Main-thread. */
export async function extractLabelsFromFile(file: File, nAtoms: number): Promise<string[]> {
  const text = await file.text();
  const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";

  let labels: string[];
  if (ext === ".txt") {
    labels = text.split("\n").map((l) => l.trim());
  } else {
    await ensureInit();
    const format =
      ext === ".gro"
        ? "gro"
        : ext === ".xyz"
          ? "xyz"
          : ext === ".data" || ext === ".lammps"
            ? "lammps_data"
            : "pdb";
    const raw = wasmModule!.extract_labels(text, format);
    labels = raw ? raw.split("\n") : [];
  }

  // Pad or trim to match nAtoms
  if (labels.length > nAtoms) {
    labels = labels.slice(0, nAtoms);
  }
  while (labels.length < nAtoms) {
    labels.push("");
  }
  return labels;
}
