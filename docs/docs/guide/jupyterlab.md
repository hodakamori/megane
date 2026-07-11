# JupyterLab extension

The megane JupyterLab extension adds a document-style molecular viewer to JupyterLab. Open a supported file from the JupyterLab file browser and it renders in its own tab with the full pipeline editor — no notebook cell required.

## Installation

The labextension ships inside the `megane` wheel, so a single install covers it:

```bash
pip install megane
```

Restart JupyterLab after installing. The extension registers automatically — no `jupyter labextension install` step is needed.

## Opening files

Double-click any supported file in the JupyterLab file browser and megane opens it in a document tab:

| File type | Extensions |
|-----------|-----------|
| Structures | `.pdb`, `.gro`, `.xyz`, `.mol`, `.sdf`, `.mol2`, `.cif`, `.mmcif`, `.data`, `.lammps`, `.prmtop`, `.traj` |
| Trajectories | `.xtc`, `.dcd`, `.lammpstrj`, `.dump`, `.nc` |
| Pipelines | `.megane.json` |

Trajectory-only formats (`.xtc`, `.dcd`, `.lammpstrj`, `.dump`, `.nc`) need a topology loaded first — open the structure file, then wire the trajectory in through the pipeline editor. Opening one directly surfaces an actionable error.

## Visual pipeline editor

The JupyterLab DocWidget mounts the full visual pipeline editor, so you can build and edit visualization workflows by wiring nodes, just as in the standalone web app. Pipelines saved as `.megane.json` reopen in the same editor.

## Events for other extensions

The JupyterLab DocWidget has no Python kernel connection, so events are surfaced as a subscription API rather than a Python callback. Other JupyterLab extensions can react to viewer state via `MeganeReactView.subscribeFrameChange`, `subscribeSelectionChange`, and `subscribeMeasurementChange`. When `IStatusBar` is available, the current frame index is also shown in the JupyterLab status bar.

For a per-platform breakdown of supported formats and UI features (including known gaps), see [Platform Support](/platform-support).
