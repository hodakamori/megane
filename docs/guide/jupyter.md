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

## Troubleshooting

### VS Code: "Failed to load model class 'AnyModel' from module 'anywidget'"

This is a [known issue](https://github.com/manzt/anywidget/issues/684) with VS Code's Jupyter extension and affects many anywidget-based projects. VS Code uses its own ipywidgets renderer (`@vscode/jupyter-ipywidgets8`) which has a different widget module registration mechanism than browser-based Jupyter.

**Workarounds:**

1. **Reload the VS Code window** after installing megane:
   - Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
   - Run `Developer: Reload Window`

2. **Ensure ipywidgets v8.x is installed:**
   ```bash
   pip install "ipywidgets>=8.0.0"
   ```

3. **Update the VS Code Jupyter extension** to the latest version.

4. **Restart the kernel** and re-run the notebook cells.
