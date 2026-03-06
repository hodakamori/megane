/** Stub type declarations for megane-wasm (used by TypeDoc when WASM is not built). */
export function parse_pdb(text: string): any;
export function parse_gro(text: string): any;
export function parse_xyz(text: string): any;
export function parse_mol(text: string): any;
export function infer_bonds_vdw(
  positions: Float32Array,
  elements: Uint8Array,
  n_atoms: number,
  scale: number
): any;
