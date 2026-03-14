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

## API Reference

### Constructor

```python
import megane

viewer = megane.MolecularViewer()
```

No required arguments. Inherits from `anywidget.AnyWidget`.

### Methods

| Method | Description |
|--------|-------------|
| `set_pipeline(pipeline)` | Apply a `Pipeline` to the viewer, or `None` to clear |
| `load(pdb_path, xtc=None)` | *(Deprecated)* Load a PDB structure. Use `set_pipeline()` instead |
| `on_event(name, callback=None)` | Register an event callback. Use as `@viewer.on_event("name")` decorator or `viewer.on_event("name", fn)` |
| `off_event(name, callback=None)` | Remove a specific callback, or all callbacks for the event if `callback` is `None` |

### Properties

| Property | Type | Read/Write | Description |
|----------|------|------------|-------------|
| `frame_index` | `int` | R/W | Current trajectory frame (0-based). Setting this fires `frame_change` |
| `total_frames` | `int` | R | Total number of frames in the loaded trajectory |
| `selected_atoms` | `list[int]` | R/W | Indices of selected atoms. Setting this fires `selection_change` |
| `measurement` | `dict \| None` | R | Current measurement result, or `None` if fewer than 2 atoms selected |

The `measurement` dict contains: `type` (`"distance"`, `"angle"`, or `"dihedral"`), `value` (float), `label` (formatted string like `"120.5°"`), and `atoms` (list of indices).

### Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `frame_change` | `frame_index` changes | `{"frame_index": int}` |
| `selection_change` | `selected_atoms` changes | `{"atoms": list[int]}` |
| `measurement` | Measurement computed or cleared | `{"type": str, "value": float, "label": str, "atoms": list[int]}` or `None` |

```python
@viewer.on_event("frame_change")
def on_frame(data):
    print(f"Frame {data['frame_index']}")

@viewer.on_event("selection_change")
def on_sel(data):
    print(f"Selected: {data['atoms']}")

@viewer.on_event("measurement")
def on_meas(data):
    if data:
        print(f"{data['type']}: {data['label']}")
```

See [Integrations](/guide/integrations) for Plotly integration and advanced event patterns.

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
