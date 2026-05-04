/**
 * Stub for crates/megane-wasm/pkg — used by vitest so the test suite can
 * resolve the WASM package path without a built WASM binary.
 *
 * All actual tests that call WASM functions mock @/parsers/structure (or
 * @/parsers/xtc etc.) via vi.mock, so these stubs are never invoked.  They
 * exist only to satisfy Vite's import-analysis resolution at the transform
 * stage so that the 19 test files blocked by "Failed to resolve
 * 'crates/megane-wasm/pkg'" can be collected.
 */

const stub = () => {
  throw new Error("WASM not built — mock @/parsers/structure in your test.");
};

export const parse_pdb = stub;
export const parse_gro = stub;
export const parse_xyz = stub;
export const parse_mol = stub;
export const parse_mol2 = stub;
export const parse_cif = stub;
export const parse_lammps_data = stub;
export const parse_traj = stub;
export const parse_xtc = stub;
export const parse_dcd = stub;
export const parse_netcdf = stub;
export const parse_lammpstrj = stub;
export const infer_bonds_vdw = stub;
export const parse_top_bonds = stub;
export const parse_pdb_bonds = stub;
export const extract_labels = stub;

// The default export is the WASM init function.
export default async (_url?: string | URL | undefined): Promise<void> => {};
