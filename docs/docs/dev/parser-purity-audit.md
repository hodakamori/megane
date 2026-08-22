---
title: Parser Purity Audit
---

Catalogue of known violations of CLAUDE.md **CRITICAL RULE #11** — _"parsers
read files as-is; anything that changes what the user sees is a pipeline
node's job."_ Compiled from a full audit of `crates/megane-core/src/`, the
WASM/TS load path, and `python/megane/` (2026-08). Line numbers are
approximate and will drift; the function/section names are the stable
reference. When you touch one of these areas, fix the violation (or file an
issue for it) rather than building on top of it — and remove the entry here
in the same PR.

Severity tiers: **P1** = the parser visibly changes geometry/topology vs. the
file · **P2** = wrong or invented appearance data · **P3** = file information
silently discarded that another host/tool renders.

## P1 — geometry/topology changed at parse time

| Where | What happens | What rule #11 wants instead |
| --- | --- | --- |
| `crates/megane-core/src/cif.rs` (`parse`, ~476) | `crystal::expand_symmetry` applies space-group operations and **adds atoms** (VESTA-style cell packing) inside the parser. This directly contradicts the `ParsedStructure::symmetry_ops` doc in `parser.rs`, which promises "the parser does NOT apply these — it always returns the asymmetric unit; symmetry expansion is a downstream feature". (The `bonds::unwrap_molecules` coordinate surgery that used to run here has been removed — the parser now keeps the file's atom sites.) | Return the asymmetric unit + `symmetry_ops`; expansion becomes a node (a symmetry sibling of `replicate`) so the user can toggle it. |
| `crates/megane-core/src/odydata.rs` (~429) | All atom positions are shifted by `+box/2` so the cell draws from the world origin. | Use the `box_origin` channel that exists for exactly this (`lammps_data.rs` does it right); never translate atoms. |
| `src/parsers/parseCore.ts` (`remapTrajectoryTypesToElements`, ~610) | Mutates each frame's `elements` in place at load time (LAMMPS type ids → atomic numbers via frame 0; unmatched types silently become 0). | Do the mapping without mutating parser output, or move it into the pipeline where it is visible. |
| `src/pipeline/openFile.ts` (`removeLoadTrajectoryAndRewire`, ~273) and `src/hooks/useMeganeLocal.ts` (~276) | Load path deletes a pipeline node and rewires edges depending on whether the file carried frames. | Graph surgery driven by file content should be an explicit, visible pipeline-template decision, not a silent load side effect. |

## P2 — wrong or invented appearance data

| Where | What happens | What rule #11 wants instead |
| --- | --- | --- |
| `crates/megane-core/src/mmcif.rs` (`parse`, ~413) | `infer_bonds` runs unconditionally; mmCIF's `_struct_conn` (disulfides, ligand/metal links) is never read, so 100 % of bonds are guessed for a format that declares them. | Read file connectivity first; infer only for atoms the file leaves unconnected (carve-out (c)). |
| `crates/megane-core/src/lammps_data.rs` (~451) | `infer_bonds` runs on top of the file's `Bonds` section and appends distance-guessed bonds a fully-bonded data file never declared. (`n_file_bonds` is at least kept accurate.) | Same as above: inference is conditional on missing connectivity, or moves to the `add_bond` node. |
| `crates/megane-core/src/mmcif.rs` (~385) | `ca_ss_type` is hardcoded to 0 (coil) for every residue; `_struct_conf` helix/sheet records are never read, so cartoon rendering flattens the file's secondary structure. | Parse `_struct_conf` like the PDB parser parses HELIX/SHEET. |
| `crates/megane-core/src/psf.rs` (`element_from_atom_name`, ~21) | Element = first alphabetic character of the atom name (`CL`→C, `FE`→F, `ZN`→N), while the PSF **mass column the file carries is read past and discarded**. | Precedence order of carve-out (b): the mass column is authoritative — feed it to `mass_to_atomic_num` as `lammps_data.rs` does. |
| `crates/megane-core/src/lammpstrj.rs` (~346, ~822) | LAMMPS `type` id is used directly as the atomic number, so type 1 renders as hydrogen with H's color/radius. Documented convention, tolerated as a last resort under carve-out (b) — but it must stay labelled as a proxy and never spread to formats that carry better data. | — (allowed fallback; listed for visibility) |
| `crates/megane-core/src/mol2.rs` (~23) and `odydata.rs` (~44) | Aromatic (`ar`/`a`) and amide (`am`) bond types are collapsed to order 1, while `mol.rs` passes MDL order 4 (aromatic) through raw — two formats render the same chemistry differently. | Preserve the file's order/type; pick one canonical aromatic encoding across parsers. |
| `crates/megane-core/src/xsf.rs` (~76) | Negative atomic numbers (XSF's ghost/dummy-atom convention) are `abs()`ed into real atoms. | Preserve the ghost flag (or drop-with-warning via a node); don't render atoms the file marks as not-atoms. |
| `crates/megane-core/src/gro.rs` (~96) | Positions and box are scaled nm→Å but the velocity vector channel stays in nm/ps — length-valued channels are in inconsistent units, so vector arrows are 10× off vs. geometry. | Carve-out (a): unit canonicalization must cover *every* length-valued channel. |
| `crates/megane-core/src/odydata.rs` (~196) | Atoms lacking `element` or `xyz` are silently dropped (bond endpoints too, also in `c3xml.rs` ~197 / `cml.rs` ~320). | Keep the count honest or surface a parse warning; silent atom loss is invisible to the user. |
| `src/pipeline/executors/parseCube.ts` (~51, ~79) | `Math.abs()` on the CUBE atom count and atomic number silently erases the negative-value conventions of the format. | Read the sign, handle the convention explicitly. |
| `src/pipeline/executors/loadStructure.ts` (~62) | Hardcodes `visible: true, axesVisible: true` on `CellData`; `src/pipeline/apply.ts` (~78) must special-case around it to avoid clobbering the Viewport setting. | Rendering defaults belong to the viewport/params layer, not loader output. |
| `src/hooks/useNodeLoadHandlers.ts` (~84), `src/hooks/useMeganeLocal.ts` (~616) | First embedded vector channel is auto-loaded and every `load_vector` node's `fileName` rewritten — a visual overlay switched on as a parse side effect. | Offer the channel; let the node/user opt in. |

## P3 — file information silently discarded

| Where | What is lost |
| --- | --- |
| `crates/megane-core/src/dcd.rs` (~259), `netcdf.rs` (~329), `amber.rs` (~130) | Unit-cell **angles** are discarded (only lengths read), so triclinic / truncated-octahedron boxes draw as rectangular. `cell_params_to_matrix` already exists in `parser.rs` — this is a small fix in all three. |
| `crates/megane-core/src/lammpstrj.rs` (`parse_column_layout`, ~61) | `ix/iy/iz` image flags are never read (wrapped coordinates stay wrapped; OVITO/VMD reconstruct whole molecules from them), and wrapped `x/y/z` wins over unwrapped `xu/yu/zu` when a dump carries both. |
| `crates/megane-core/src/gro.rs` (~20) | Only the first frame of a multi-frame `.gro` (standard `trjconv` output) is read, silently. |
| `crates/megane-core/src/top.rs` | `[ settles ]` / `[ constraints ]` are not read, so rigid water (SOL) renders as unbonded atoms. |
| `crates/megane-core/src/xyz.rs` (~104) | extXYZ `Properties=` per-atom columns (forces/velocities/charges) are joined into a label string instead of becoming vector channels. |
| `crates/megane-core/src/mmcif.rs` (~156) | Only the first `pdbx_PDB_model_num` is kept — NMR ensembles lose every model but one. Similar first-record-only behavior: `mol2.rs`, `mol.rs` (SDF), `cml.rs`, `odydata.rs`, `jcampdx.rs`. |
| `crates/megane-core/src/cml.rs` | `units:` attributes are never read — a CML in bohr or pm is read as Å. |
| `crates/megane-core/src/vasp.rs` (~25), `mol.rs` (~215), `lammps_data.rs` (~302), `lammpstrj.rs` (~89) | Selective-dynamics flags, V2000 charge/isotope, per-atom charge/`mol_id`, and non-v/f dump columns are parsed past and dropped. |
| `crates/megane-core/src/dcd.rs` (~160) | The `NAMNF` fixed-atom header field is never read, so fixed-atom DCDs misparse instead of erroring. |

## Host-consistency notes (rule #6 overlap)

- `src/pipeline/openFile.ts` (`defaultBondSourceForFile`, ~117) picks
  `bondSource: "structure" | "distance"` per file extension at load time,
  while Python (`python/megane/pipeline.py`, ~377) defaults every format to
  `"distance"` — the same file opens with different bonds in the webapp vs.
  Python. Whichever policy wins should live in one shared default table.
- `python/megane/parsers/top.py` / `psf.py` duplicate the Rust
  `parse_top_bonds` / `parse_psf_bonds`; `src/parsers/inferBondsJS.ts`
  duplicates `crates/megane-core/src/bonds.rs`. Duplicated parser/inference
  logic drifts — prefer one implementation per algorithm.

## Compliant patterns to imitate

- **Element precedence:** `amber.rs` — explicit `ATOMIC_NUMBER` section first,
  atom-name guess only as a fallback for old prmtops.
- **Unit-from-file conversion:** `magres.rs`, `molden.rs`, `gamess.rs` — the
  bohr/Å unit is read from the file, never assumed.
- **Mass → element:** `lammps_data.rs` resolves elements from the `Masses`
  section the file carries instead of guessing from type ids.
- **Conditional bond inference:** `c3xml.rs`, `cml.rs`, `odydata.rs` infer
  only when the file declared no bonds (c3xml even skips inference for 2D
  drawings where distances are meaningless).
- **Camera-only centering:** `src/renderer/CameraManager.ts` centers the
  *camera target*, never the coordinates; the renderer never drops atoms
  (unknown elements get a fallback color).
- **Hosts call the executor:** the per-playback-frame distance-bond refresh in
  `MeganeViewer` / `PipelineViewer` / `WidgetViewer` goes through
  `computeFrameDistanceBonds` in `src/pipeline/executors/addBond.ts` — the
  transform lives in the node executor module only. Likewise `add_bond` and
  `coordination_generator` share one Drawing-Boundary site collector
  (`src/pipeline/executors/displaySites.ts`) instead of duplicating it.
