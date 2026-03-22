---
sidebar_position: 1
---

# Jupyter / Python

Use megane inside Jupyter notebooks as an interactive widget backed by anywidget.

## Installation

```bash
pip install megane
```

Then launch JupyterLab (recommended) or classic Notebook:

```bash
jupyter lab
```

## Quick Start

### Display a structure

```python
from megane import Pipeline, LoadStructure, AddBonds, Viewport, MolecularViewer

pipe = Pipeline()
s     = pipe.add_node(LoadStructure("caffeine.pdb"))
bonds = pipe.add_node(AddBonds(source="distance"))
v     = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, bonds.inp.particle)
pipe.add_edge(s.out.particle, v.inp.particle)
pipe.add_edge(bonds.out.bond, v.inp.bond)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer  # display inline
```

The last expression in a cell renders the widget. Use `display(viewer)` to render it multiple times in the same notebook.

### Play a trajectory

```python
from megane import Pipeline, LoadStructure, LoadTrajectory, AddBonds, Viewport, MolecularViewer

pipe = Pipeline()
s     = pipe.add_node(LoadStructure("protein.pdb"))
traj  = pipe.add_node(LoadTrajectory(xtc="trajectory.xtc"))
bonds = pipe.add_node(AddBonds(source="structure"))
v     = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, traj.inp.particle)
pipe.add_edge(s.out.particle, bonds.inp.particle)
pipe.add_edge(s.out.particle, v.inp.particle)
pipe.add_edge(traj.out.traj,  v.inp.traj)
pipe.add_edge(bonds.out.bond, v.inp.bond)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

The timeline scrubber appears automatically when a trajectory is connected to the viewport.

## Widget API

After displaying the widget, control it programmatically:

| Property / Method | Type | Description |
|-------------------|------|-------------|
| `viewer.frame_index` | `int` (read/write) | Current trajectory frame (0-based) |
| `viewer.total_frames` | `int` (read) | Total number of frames |
| `viewer.selected_atoms` | `list[int]` (read/write) | Indices of currently selected atoms |
| `viewer.measurement` | `dict \| None` (read) | Current measurement result |
| `viewer.set_pipeline(pipe)` | method | Apply a pipeline to the viewer |
| `viewer.on_event(name, fn)` | method | Register an event callback |
| `viewer.off_event(name, fn)` | method | Remove an event callback |

**Example — jump to a specific frame:**

```python
viewer.frame_index = 100
```

**Example — read the current measurement:**

```python
viewer.selected_atoms = [10, 20, 30, 40]  # select 4 atoms
print(viewer.measurement)
# {"type": "dihedral", "value": 120.5, "label": "120.5°", "atoms": [10, 20, 30, 40]}
```

## Event Callbacks

React to user interactions with `on_event()`:

### Available events

| Event | Fires when | Payload |
|-------|------------|---------|
| `frame_change` | Frame index changes | `{"frame_index": int}` |
| `selection_change` | Selected atoms change | `{"atoms": list[int]}` |
| `measurement` | User selects 2–4 atoms | `{"type": str, "value": float, "label": str, "atoms": list[int]}` or `None` |

### Registering callbacks

Use `on_event()` as a decorator or method call:

```python
# Decorator style
@viewer.on_event("frame_change")
def on_frame(data):
    print(f"Frame changed to {data['frame_index']}")

# Method-call style
def on_select(data):
    print(f"Selected: {data['atoms']}")

viewer.on_event("selection_change", on_select)
```

### Removing callbacks

```python
viewer.off_event("frame_change", on_frame)   # remove a specific callback
viewer.off_event("selection_change")          # remove all callbacks for this event
```

## Plotly Integration

Combine megane with Plotly `FigureWidget` to build interactive analysis dashboards.

### Click a chart point to jump to a frame

```python
import plotly.graph_objects as go
import ipywidgets as widgets
import megane

viewer = megane.MolecularViewer()
# ... set up pipeline with trajectory ...

fig = go.FigureWidget(
    data=[go.Scatter(x=list(range(n_frames)), y=energy, mode="lines+markers")],
    layout=go.Layout(xaxis_title="Frame", yaxis_title="Energy (kJ/mol)"),
)

def on_click(trace, points, state):
    if points.point_inds:
        viewer.frame_index = points.point_inds[0]

fig.data[0].on_click(on_click)

widgets.VBox([fig, viewer])
```

### Sync a Plotly marker with the current frame

```python
@viewer.on_event("frame_change")
def update_marker(data):
    idx = data["frame_index"]
    with fig.batch_update():
        marker_trace.x = [idx]
        marker_trace.y = [energy[idx]]
```

### Collect dihedral angles across all frames

```python
import time

viewer.selected_atoms = [10, 20, 30, 40]
dihedrals = []

@viewer.on_event("measurement")
def collect(data):
    if data and data["type"] == "dihedral":
        dihedrals.append(data["value"])

for i in range(viewer.total_frames):
    viewer.frame_index = i
    time.sleep(0.01)  # allow widget sync

viewer.off_event("measurement", collect)

# Plot the result
fig = go.FigureWidget(
    data=[go.Scatter(y=dihedrals, mode="lines")],
    layout=go.Layout(xaxis_title="Frame", yaxis_title="Dihedral (°)"),
)
fig
```

## Pipeline API Reference

See [Visual Pipeline — Python API](./pipeline#python-pipeline-api) for the complete list of node classes, port names, and parameters.

All node classes are importable from `megane`:

```python
from megane import (
    Pipeline,
    LoadStructure, LoadTrajectory, LoadVector, Streaming,
    Filter, Modify,
    AddBonds, AddLabels, AddPolyhedra,
    VectorOverlay,
    Viewport,
)
```

## Tips

- **Re-running cells** — calling `viewer.set_pipeline(pipe)` again updates the displayed pipeline in-place without re-creating the widget.
- **JupyterLab vs. classic Notebook** — megane is tested on JupyterLab 4+. In classic Notebook, enable the `anywidget` extension if the viewer appears blank.
- **Large trajectories** — megane streams frames over a local WebSocket rather than loading them into memory. Even multi-GB XTC files scrub smoothly.
- **Sharing notebooks** — exported HTML (`File → Export → HTML`) captures the last-rendered frame as a static image.
