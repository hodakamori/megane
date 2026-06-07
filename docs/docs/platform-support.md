---
sidebar_position: 5
---

# Platform Support

megane ships in five distributions. They share the same Rust parser core (compiled to WASM and PyO3), but the host UI and the set of registered file types differ. This page is the single reference for **what works on which platform**, and it is descriptive of the current state — including known gaps.

## Platforms

| Platform | Entry | What it is |
|---|---|---|
| **Standalone web app** | `src/index.tsx`, served by `megane serve` | Full-featured viewer with pipeline editor, drag-and-drop, file dialogs, and WebSocket trajectory streaming. |
| **Jupyter widget** (anywidget) | `src/widget.ts` + `python/megane/widget.py` | Embedded viewer in a notebook cell, driven by Python (`MolecularViewer`). |
| **JupyterLab labextension** | `jupyterlab-megane/src/index.ts` | Document-style viewer launched from the JupyterLab file browser. |
| **VSCode extension** | `vscode-megane/webview/main.tsx` | Custom editor activated when a registered file type is opened in VS Code. |
| **Python package** (PyO3) | `python/megane/parsers/` | Programmatic API for parsing files into Python objects. No viewer. |

## File-format support

Legend:

- **✓** — openable directly from the platform's native UI (file browser, drag-drop, customEditor, `LoadStructure`/`LoadTrajectory` node, etc.)
- **API** — parser exists and is reachable programmatically, but the platform does not expose a UI opener for this format
- **—** — not supported

### Structure formats

| Format | Extensions | Standalone | Jupyter widget | JupyterLab | VSCode | Python |
|---|---|:---:|:---:|:---:|:---:|:---:|
| PDB | `.pdb` | ✓ | API | ✓ | ✓ | ✓ |
| GRO | `.gro` | ✓ | API | ✓ | ✓ | ✓ |
| XYZ | `.xyz` | ✓ | API | ✓ | ✓ | ✓ |
| MOL | `.mol` | ✓ | API | ✓ | ✓ | ✓ |
| SDF | `.sdf` | ✓ | API | ✓ | ✓ | ✓ |
| MOL2 | `.mol2` | ✓ | API | ✓ | ✓ | ✓ |
| CIF | `.cif` | ✓ | API | ✓ | ✓ | ✓ |
| mmCIF | `.mmcif` | ✓ | API | ✓ | ✓ | API |
| LAMMPS data | `.data`, `.lammps` | ✓ | API | ✓ | ✓ | ✓ |
| AMBER topology | `.prmtop` | ✓ | API | ✓ | ✓ | API |
| ASE trajectory | `.traj` | ✓ | API | ✓ | ✓ | ✓ |

Note: ASE `.traj` is self-contained (elements, bonds, and all frames in one file) and is loaded via the **Load Structure** node, not Load Trajectory. It is listed here because it contains multi-frame trajectory data.

### Trajectory formats

| Format | Extensions | Standalone | Jupyter widget | JupyterLab | VSCode | Python |
|---|---|:---:|:---:|:---:|:---:|:---:|
| XTC | `.xtc` | ✓ | API | ✓¹ | ✓¹ | ✓ |
| DCD | `.dcd` | ✓ | API | ✓¹ | ✓¹ | ✓ |
| LAMMPS dump | `.lammpstrj`, `.dump` | ✓ | API | ✓¹ | ✓¹ | ✓ |
| AMBER NetCDF | `.nc` | ✓ | API | ✓¹ | ✓¹ | ✓ |

¹ Trajectory-only formats need a topology already loaded. Opening a `.xtc` /
`.dcd` / `.lammpstrj` / `.dump` / `.nc` directly surfaces an actionable error; recover by
opening a structure file (PDB, GRO, …) first or by wiring a Load Structure
node in the always-mounted pipeline editor.

### Topology formats

Topology files carry bond information but no coordinates. They are used with
the **Add Bond** pipeline node to supply explicit connectivity when the
structure file does not encode it (e.g. pairing a PDB with a PSF, or a GRO
with a GROMACS `.top`).

| Format | Extensions | Standalone (Add Bond node) | Python |
|---|---|:---:|:---:|
| GROMACS topology | `.top` | ✓ | ✓ |
| CHARMM/NAMD PSF | `.psf` | ✓ | API² |

² Python `AddBonds` only wires GROMACS `.top` topology via the `top=` parameter. PSF bonds are accessible programmatically via `megane.parsers.psf.parse_psf_bonds(path)` or `megane_parser.parse_psf_bonds(text)`, but cannot be passed directly to an `AddBonds` pipeline node.

Sources of truth: `crates/megane-wasm/src/lib.rs` (browser parsers), `crates/megane-python/src/lib.rs` (Python parsers), `src/components/nodes/LoadStructureNode.tsx` and `src/components/nodes/LoadTrajectoryNode.tsx` (standalone accept lists), `src/components/nodes/AddBondNode.tsx` (topology accept list), `jupyterlab-megane/src/filetypes.ts` (JupyterLab `IFileType` registrations), `vscode-megane/package.json` (VSCode `customEditors`).

## UI features

| Feature | Standalone | Jupyter widget | JupyterLab | VSCode | Python |
|---|:---:|:---:|:---:|:---:|:---:|
| Drag-and-drop into viewer | ✓ | — | — | — | n/a |
| Built-in file picker | ✓ | — | host | host | n/a |
| Visual pipeline editor | ✓ | — | ✓ | ✓ (`.megane.json`) | n/a |
| Trajectory timeline / scrubbing | ✓ | ✓ | ✓ | ✓ | n/a |
| WebSocket trajectory streaming | ✓ | — | — | — | n/a |
| Multi-layer rendering | ✓ | ✓ (via pipeline) | ✓ | ✓ | n/a |
| Solvent-accessible surface (SAS) | ✓ | ✓ (via pipeline) | ✓ | ✓ | n/a |
| Surface mesh (alpha-shape envelope) | ✓ | ✓ (via pipeline) | ✓ | ✓ | n/a |
| Crystallographic symmetry expansion on CIF load (asymmetric unit → full cell) | ✓ | ✓ | ✓ | ✓ | ✓ (`load_cif`) |
| `frame_change` callback | ✓ (React prop) | ✓ (Python event) | ✓ (status bar) | ✓ (status bar) | n/a |
| `selection_change` / `measurement` events | ✓ (React props) | ✓ | ✓² | ✓² | n/a |
| Programmatic frame seek (`frame_index = N`) | ✓ | ✓ | ✓³ | ✓⁴ | n/a |

³ JupyterLab: call `meganeReactView.seekFrame(N)` on a `MeganeReactView` instance obtained from the widget tracker. This delegates to `usePlaybackStore.seekFrame(N)` in the viewer.

⁴ VSCode: call `vscode.commands.executeCommand('megane.seekFrame', N)` from another extension, or call `meganeEditorProvider.seekFrame(N)` on an `MeganeEditorProvider` reference. The command posts a `seekFrame` message to the most recently active megane webview panel.

Notes:

- **host** means the parent app provides the file picker (the JupyterLab file browser, the VS Code explorer); megane itself does not render one.
- The Jupyter widget intentionally does not mount the visual pipeline editor — pipelines are built in Python (`megane.Pipeline`) and pushed via `MolecularViewer.set_pipeline()`. Use the standalone app, JupyterLab labextension, or VSCode extension to edit pipelines visually.
- The standalone app is the only platform with `megane serve` WebSocket streaming; other platforms load full trajectories into memory.
- The standalone React `MeganeViewer` exposes an `onFrameChange?: (frame: number) => void` prop that fires on every trajectory frame transition — useful for keeping a host Plotly figure in sync.
- The standalone React `MeganeViewer` also exposes `onSelectionChange?: (selection: SelectionState) => void` (fires on every atom selection change; data: `{ atoms: number[] }`) and `onMeasurementChange?: (measurement: Measurement | null) => void` (fires when a distance/angle/dihedral measurement is computed or cleared) — both mirror the Jupyter widget's `selection_change` and `measurement` events.
- ² On **JupyterLab**, `selection_change` / `measurement` events are surfaced via `MeganeReactView.subscribeSelectionChange` and `subscribeMeasurementChange` — consumable by other JupyterLab extensions. On **VSCode**, they are forwarded to the extension host as `selectionChange` / `measurementChange` webview messages and reflected in the status bar (atom count or measurement label).

## Load methods / APIs

How data gets into the viewer on each platform:

| Platform | Primary load path | API surface |
|---|---|---|
| **Standalone** | Drag-and-drop, file dialog, `megane serve <file>`, WebSocket | `parseStructureFile(file)` (TypeScript), pipeline node `LoadStructure` / `LoadTrajectory` |
| **Jupyter widget** | Python only — no in-cell file picker | `MolecularViewer.load(pdb_path, xtc=, traj=)` (deprecated) or `MolecularViewer.set_pipeline(Pipeline)` (recommended) |
| **JupyterLab** | Click a registered file type in the file browser | Internally reads `context.model` (`jupyterlab-megane/src/MeganeDocWidget.tsx`) |
| **VSCode** | Open a registered file from the explorer; extension host posts `loadFile` / `loadPipeline` to the webview | `postMessage({ type: "loadFile", … })` (`vscode-megane/webview/main.tsx`) |
| **Python** | `from megane import …` or `from megane.parsers import …` | Top-level `megane`: `load_pdb`, `load_cif`, `load_lammps_data`, `load_traj`, `load_trajectory` (XTC), `load_xyz_trajectory`. Full set via `megane.parsers`: additionally `load_gro`, `load_mol`, `load_sdf`, `load_mol2`, `load_dcd`, `load_netcdf`, `load_lammpstrj`. Raw PyO3 functions (all formats including mmCIF and AMBER prmtop) are in the native extension `megane_parser`: `from megane import megane_parser; megane_parser.parse_mmcif(text)`, `megane_parser.parse_prmtop(text)`, etc. |

## Known gaps

These are formats or features that the parser layer supports but a given platform does not yet wire into its UI. They are documented here so users do not file bugs against expected-but-absent behaviour.

- **Trajectory-only opens require a topology first.** On VSCode and JupyterLab, opening a `.xtc` / `.dcd` / `.lammpstrj` / `.dump` / `.nc` file before any structure is loaded surfaces a friendly error. The recommended flow is to open the structure first, or to use the pipeline editor (always mounted on these hosts) to wire a Load Structure node.
- **Jupyter widget has no in-cell file picker or drag-and-drop.** This is intentional — the widget is Python-driven. Use `set_pipeline()` with a `Pipeline` to load any supported format.
- **Jupyter widget has no visual pipeline editor.** The editor's React surface relies on host chrome (drag handles, side panel layout) that the anywidget cell cannot reliably render, so it is only shipped on the standalone app, JupyterLab labextension, and VSCode extension. Build pipelines in Python with `megane.Pipeline` and push them via `MolecularViewer.set_pipeline()`.
- **`selection_change` / `measurement` events on JupyterLab use a subscription API, not a Python callback.** The JupyterLab DocWidget has no Python kernel connection, so there is no Python callback surface. Use `MeganeReactView.subscribeSelectionChange` and `subscribeMeasurementChange` from another JupyterLab extension.
- **`frame_change` callback for JupyterLab is surfaced as a status-bar frame counter.** The JupyterLab DocWidget has no Python kernel connection, so there is no Python callback surface. Instead, when `IStatusBar` is available, the current frame index is shown in the JupyterLab status bar (right side). The `subscribeFrameChange` method on `MeganeReactView` can also be used by other JupyterLab extensions to react to frame changes.
- **CIF symmetry expansion is automatic; mmCIF is not expanded.** The `.cif` parser applies the `_symmetry_equiv_pos_as_xyz` operations on load, expanding the asymmetric unit into the full unit cell (VESTA-style packing) on every host. CIFs without symmetry operations (or with only the identity) are returned unchanged. The mmCIF/PDBx parser deliberately does **not** auto-expand — macromolecular depositions are shown as the deposited model. To then tile multiple cells, add a `Replicate` node (`megane.Replicate(nx, ny, nz)`), which is pure translational replication of the already-expanded cell.
