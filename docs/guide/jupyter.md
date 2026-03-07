# Jupyter Widget

megane provides an [anywidget](https://anywidget.dev/)-based Jupyter widget for interactive molecular visualization directly in notebooks. Works in JupyterLab, Jupyter Notebook, VS Code, and Google Colab.

## Demo Notebook

The following is an actual executed notebook showing basic usage — loading structures, navigating trajectories, atom selection, measurement, and side-by-side viewers.

<NotebookRenderer src="/megane/notebooks/demo.html" />

## Advanced: External Events

This notebook demonstrates event handling, Plotly integration, bidirectional sync, dihedral analysis, and custom widget composition.

<NotebookRenderer src="/megane/notebooks/external_events.html" />

---

## Installation

```bash
pip install megane
```

## Quick Reference

### Mouse Controls

| Action | Effect |
|--------|--------|
| Left-drag | Rotate |
| Scroll / Pinch | Zoom |
| Right-click atom | Select atom |
| Double-click | Center on atom |

Select 2–4 atoms to measure distances, angles, or dihedral angles.

### Supported Events

| Event | Data | Description |
|-------|------|-------------|
| `frame_change` | `{"frame_index": int}` | Fired when the current frame changes |
| `selection_change` | `{"atoms": list[int]}` | Fired when atom selection changes |
| `measurement` | `{"type", "value", "label", "atoms"}` or `None` | Fired when a measurement is computed or cleared |

### Measurement Types

| Atoms Selected | Measurement |
|----------------|-------------|
| 2 | Distance (Å) |
| 3 | Angle (°) |
| 4 | Dihedral angle (°) |
