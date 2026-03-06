/** Stub type declarations for megane-wasm (used by TypeDoc when WASM is not built). */
export default function init(): Promise<void>;
export function parse_pdb(text: string): any;
export function parse_gro(text: string): any;
export function parse_xyz(text: string): any;
export function parse_mol(text: string): any;
export function infer_bonds_vdw(
  positions: Float32Array,
  elements: Uint8Array,
  n_atoms: number
): any;
export function parse_xtc_file(data: Uint8Array): any;
export function parse_top_bonds(text: string, n_atoms: number): any;
export function parse_pdb_bonds(text: string, n_atoms: number): any;
export function extract_labels(text: string, format: string): string;
