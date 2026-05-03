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
| LAMMPS data | `.data`, `.lammps` | ✓ | API | ✓ | ✓ | ✓ |

### Trajectory formats

| Format | Extensions | Standalone | Jupyter widget | JupyterLab | VSCode | Python |
|---|---|:---:|:---:|:---:|:---:|:---:|
| XTC | `.xtc` | ✓ | API | ✓¹ | ✓¹ | ✓ |
| ASE trajectory | `.traj` | ✓ | API | ✓ | ✓ | ✓ |
| LAMMPS dump | `.lammpstrj`, `.dump` | ✓ | API | ✓¹ | ✓¹ | ✓ |

¹ Trajectory-only formats need a topology already loaded. Opening a `.xtc` /
`.lammpstrj` / `.dump` directly surfaces an actionable error; recover by
opening a structure file (PDB, GRO, …) first or by wiring a Load Structure
node in the always-mounted pipeline editor.

Sources of truth: `crates/megane-wasm/src/lib.rs` (browser parsers), `crates/megane-python/src/lib.rs` (Python parsers), `src/components/nodes/LoadStructureNode.tsx` and `src/components/nodes/LoadTrajectoryNode.tsx` (standalone accept lists), `jupyterlab-megane/src/filetypes.ts` (JupyterLab `IFileType` registrations), `vscode-megane/package.json` (VSCode `customEditors`).

## UI features

| Feature | Standalone | Jupyter widget | JupyterLab | VSCode | Python |
|---|:---:|:---:|:---:|:---:|:---:|
| Drag-and-drop into viewer | ✓ | — | — | — | n/a |
| Built-in file picker | ✓ | — | host | host | n/a |
| Visual pipeline editor | ✓ | — | ✓ | ✓ (`.megane.json`) | n/a |
| Trajectory timeline / scrubbing | ✓ | ✓ | ✓ | ✓ | n/a |
| WebSocket trajectory streaming | ✓ | — | — | — | n/a |
| Multi-layer rendering | ✓ | ✓ (via pipeline) | ✓ | ✓ | n/a |
| `frame_change` callback | ✓ (React prop) | ✓ (Python event) | — | — | n/a |
| `selection_change` / `measurement` events | — | ✓ | — | — | n/a |
| Programmatic frame seek (`frame_index = N`) | ✓ | ✓ | — | — | n/a |

Notes:

- **host** means the parent app provides the file picker (the JupyterLab file browser, the VS Code explorer); megane itself does not render one.
- The Jupyter widget intentionally does not mount the visual pipeline editor — pipelines are built in Python (`megane.Pipeline`) and pushed via `MolecularViewer.set_pipeline()`. Use the standalone app, JupyterLab labextension, or VSCode extension to edit pipelines visually.
- The standalone app is the only platform with `megane serve` WebSocket streaming; other platforms load full trajectories into memory.
- The standalone React `MeganeViewer` exposes an `onFrameChange?: (frame: number) => void` prop that fires on every trajectory frame transition — useful for keeping a host Plotly figure in sync.

## Load methods / APIs

How data gets into the viewer on each platform:

| Platform | Primary load path | API surface |
|---|---|---|
| **Standalone** | Drag-and-drop, file dialog, `megane serve <file>`, WebSocket | `parseStructureFile(file)` (TypeScript), pipeline node `LoadStructure` / `LoadTrajectory` |
| **Jupyter widget** | Python only — no in-cell file picker | `MolecularViewer.load(pdb_path, xtc=, traj=)` (deprecated) or `MolecularViewer.set_pipeline(Pipeline)` (recommended) |
| **JupyterLab** | Click a registered file type in the file browser | Internally reads `context.model` (`jupyterlab-megane/src/MeganeDocWidget.tsx`) |
| **VSCode** | Open a registered file from the explorer; extension host posts `loadFile` / `loadPipeline` to the webview | `postMessage({ type: "loadFile", … })` (`vscode-megane/webview/main.tsx`) |
| **Python** | `from megane.parsers import …` | `load_pdb`, `load_cif`, `load_lammps_data`, `load_traj`, `load_trajectory` (XTC), and the `parse_*` PyO3 functions |

## Known gaps

These are formats or features that the parser layer supports but a given platform does not yet wire into its UI. They are documented here so users do not file bugs against expected-but-absent behaviour.

- **Trajectory-only opens require a topology first.** On VSCode and JupyterLab, opening a `.xtc` / `.lammpstrj` / `.dump` file before any structure is loaded surfaces a friendly error. The recommended flow is to open the structure first, or to use the pipeline editor (always mounted on these hosts) to wire a Load Structure node.
- **Jupyter widget has no in-cell file picker or drag-and-drop.** This is intentional — the widget is Python-driven. Use `set_pipeline()` with a `Pipeline` to load any supported format.
- **Jupyter widget has no visual pipeline editor.** The editor's React surface relies on host chrome (drag handles, side panel layout) that the anywidget cell cannot reliably render, so it is only shipped on the standalone app, JupyterLab labextension, and VSCode extension. Build pipelines in Python with `megane.Pipeline` and push them via `MolecularViewer.set_pipeline()`.
- **`selection_change` / `measurement` events are widget-only.** Other platforms do not emit these to a host. The standalone React component does expose `onFrameChange` (see UI features table).
