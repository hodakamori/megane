/**
 * WASM-based structure parser wrapper.
 * Loads the Rust WASM module and converts results to megane Snapshot/Frame types.
 * Supports PDB, GRO, XYZ, and MOL/SDF formats.
 */

import type { Snapshot, Frame, TrajectoryMeta } from "../types";

export interface StructureParseResult {
  snapshot: Snapshot;
  frames: Frame[];
  meta: TrajectoryMeta | null;
  labels: string[] | null;
}

let initPromise: Promise<void> | null = null;
let wasmModule: WasmModule | null = null;

interface WasmParseResult {
  n_atoms: number;
  n_bonds: number;
  n_file_bonds: number;
  n_frames: number;
  has_box: boolean;
  has_atom_labels: boolean;
  atom_labels: string;
  positions(): Float32Array;
  elements(): Uint8Array;
  bonds(): Uint32Array;
  bond_orders(): Uint8Array;
  box_matrix(): Float32Array;
  frame_data(): Float32Array;
  free(): void;
}

type ParseFn = (text: string) => WasmParseResult;

interface WasmModule {
  parse_pdb: ParseFn;
  parse_gro: ParseFn;
  parse_xyz: ParseFn;
  parse_mol: ParseFn;
  infer_bonds_vdw: (positions: Float32Array, elements: Uint8Array, n_atoms: number) => Uint32Array;
  parse_top_bonds: (text: string, n_atoms: number) => Uint32Array;
  parse_pdb_bonds: (text: string, n_atoms: number) => Uint32Array;
  extract_labels: (text: string, format: string) => string;
}

async function ensureInit(): Promise<void> {
  if (wasmModule) return;
  if (!initPromise) {
    initPromise = (async () => {
      const wasm = await import("../../crates/megane-wasm/pkg");
      await wasm.default();
      wasmModule = {
        parse_pdb: wasm.parse_pdb,
        parse_gro: wasm.parse_gro,
        parse_xyz: wasm.parse_xyz,
        parse_mol: wasm.parse_mol,
        infer_bonds_vdw: wasm.infer_bonds_vdw,
        parse_top_bonds: wasm.parse_top_bonds,
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
    default:
      return wasmModule!.parse_pdb;
  }
}

/**
 * Parse structure text (PDB format) using the WASM parser.
 */
export async function parseStructureText(text: string): Promise<StructureParseResult> {
  await ensureInit();
  return parseWithFn(wasmModule!.parse_pdb, text);
}

/**
 * Parse a structure File object using the WASM parser.
 * Auto-detects format from file extension (.pdb, .gro, .xyz, .mol, .sdf).
 * Returns a Snapshot (first model) and optional trajectory Frames.
 */
export async function parseStructureFile(file: File): Promise<StructureParseResult> {
  await ensureInit();

  const text = await file.text();
  const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? ".pdb";
  const parseFn = getParserForExtension(ext);
  return parseWithFn(parseFn, text);
}

function parseWithFn(parseFn: ParseFn, text: string): StructureParseResult {
  const result = parseFn(text) as WasmParseResult;

  const snapshot: Snapshot = {
    nAtoms: result.n_atoms,
    nBonds: result.n_bonds,
    nFileBonds: result.n_file_bonds,
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

  const labels: string[] | null = result.has_atom_labels
    ? result.atom_labels.split("\n")
    : null;

  result.free();

  const meta: TrajectoryMeta | null =
    frames.length > 0
      ? { nFrames: frames.length + 1, timestepPs: 1.0, nAtoms: snapshot.nAtoms }
      : null;

  return { snapshot, frames, meta, labels };
}

/** Infer bonds using VDW radii (threshold = vdw_sum * 0.6). */
export async function inferBondsVdw(
  positions: Float32Array,
  elements: Uint8Array,
  nAtoms: number,
): Promise<Uint32Array> {
  await ensureInit();
  return wasmModule!.infer_bonds_vdw(positions, elements, nAtoms);
}

/** Parse GROMACS .top file and extract bond pairs. */
export async function parseTopBonds(
  text: string,
  nAtoms: number,
): Promise<Uint32Array> {
  await ensureInit();
  return wasmModule!.parse_top_bonds(text, nAtoms);
}

/** Extract only CONECT bonds from a PDB file. */
export async function parsePdbBonds(
  text: string,
  nAtoms: number,
): Promise<Uint32Array> {
  await ensureInit();
  return wasmModule!.parse_pdb_bonds(text, nAtoms);
}

/** Extract atom labels from a file (structure format or plain text). */
export async function extractLabelsFromFile(
  file: File,
  nAtoms: number,
): Promise<string[]> {
  const text = await file.text();
  const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";

  let labels: string[];
  if (ext === ".txt") {
    labels = text.split("\n").map((l) => l.trim());
  } else {
    await ensureInit();
    const format = ext === ".gro" ? "gro" : ext === ".xyz" ? "xyz" : "pdb";
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
