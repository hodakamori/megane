# Jupyter Widget

megane provides an [anywidget](https://anywidget.dev/)-based Jupyter widget for interactive molecular visualization directly in notebooks. Works in JupyterLab, Jupyter Notebook, VS Code, and Google Colab.

## Basic Usage

```python
import megane

viewer = megane.MolecularViewer()
viewer.load("protein.pdb")
viewer  # displays in the notebook cell
```

The viewer renders an interactive 3D molecular structure:

<MoleculeDemo src="/megane/data/1crn.json" height="400px" />

### Mouse Controls

| Action | Effect |
|--------|--------|
| Left-drag | Rotate |
| Scroll / Pinch | Zoom |
| Right-click atom | Select atom |
| Double-click | Center on atom |

Select 2–4 atoms to measure distances, angles, or dihedral angles.

## Loading Trajectories

Load an XTC trajectory alongside the structure file:

```python
viewer.load("protein.pdb", xtc="trajectory.xtc")

# Access trajectory info
print(f"Total frames: {viewer.total_frames}")

# Navigate frames
viewer.frame_index = 50
```

A timeline control appears automatically when a trajectory is loaded. Use play/pause and the frame slider for playback.

## Atom Selection & Measurement

Select atoms programmatically by setting the `selected_atoms` property:

```python
# Select 2 atoms to measure a distance
viewer.selected_atoms = [10, 20]
print(viewer.measurement)
# {'type': 'distance', 'value': 3.82, 'label': '3.82 Å', 'atoms': [10, 20]}

# Select 3 atoms for an angle
viewer.selected_atoms = [10, 20, 30]

# Select 4 atoms for a dihedral angle
viewer.selected_atoms = [10, 20, 30, 40]
print(viewer.measurement)
# {'type': 'dihedral', 'value': 120.5, 'label': '120.5°', 'atoms': [10, 20, 30, 40]}
```

| Atoms Selected | Measurement |
|----------------|-------------|
| 2 | Distance (Å) |
| 3 | Angle (°) |
| 4 | Dihedral angle (°) |

## Event Handling

Register callbacks to react to viewer events using the `@on_event` decorator:

```python
@viewer.on_event("measurement")
def on_measurement(data):
    print(f"Measured: {data}")

@viewer.on_event("frame_change")
def on_frame(data):
    print(f"Frame: {data['frame_index']}")

@viewer.on_event("selection_change")
def on_selection(data):
    print(f"Selected atoms: {data['atoms']}")
```

Remove callbacks when no longer needed:

```python
# Remove a specific callback
viewer.off_event("measurement", on_measurement)

# Remove all callbacks for an event
viewer.off_event("measurement")
```

### Supported Events

| Event | Data | Description |
|-------|------|-------------|
| `frame_change` | `{"frame_index": int}` | Fired when the current frame changes |
| `selection_change` | `{"atoms": list[int]}` | Fired when atom selection changes |
| `measurement` | `{"type", "value", "label", "atoms"}` or `None` | Fired when a measurement is computed or cleared |

## Plotly Integration

Combine megane with [Plotly](https://plotly.com/python/) for interactive analysis. Click a data point on the plot to jump to the corresponding trajectory frame:

```python
import plotly.graph_objects as go
import ipywidgets as widgets
import numpy as np

viewer = megane.MolecularViewer()
viewer.load("protein.pdb", xtc="trajectory.xtc")

# Energy data (or any per-frame property)
frames = np.arange(viewer.total_frames)
energy = -500 + 10 * np.sin(frames * 0.1) + np.random.randn(len(frames)) * 2

fig = go.FigureWidget(
    data=[go.Scatter(x=frames, y=energy, mode="lines+markers", name="Energy")],
    layout=go.Layout(
        title="Energy vs Frame (click to jump)",
        xaxis_title="Frame",
        yaxis_title="Energy (kJ/mol)",
        height=300,
    ),
)

# Click on plot → jump to frame in viewer
def on_click(trace, points, state):
    if points.point_inds:
        viewer.frame_index = points.point_inds[0]

fig.data[0].on_click(on_click)

widgets.VBox([fig, viewer])
```

### Bidirectional Sync

You can also sync the other way — update the plot marker when the viewer frame changes:

```python
# Add a red marker to track the current frame
fig.add_scatter(x=[0], y=[energy[0]], mode="markers",
                marker=dict(size=12, color="red"), name="Current")

@viewer.on_event("frame_change")
def update_marker(data):
    idx = data["frame_index"]
    with fig.batch_update():
        fig.data[1].x = [idx]
        fig.data[1].y = [energy[idx]]
```

## Multiple Viewers

Display multiple viewers side-by-side using `ipywidgets.HBox`:

```python
import ipywidgets as widgets

v1 = megane.MolecularViewer()
v1.load("protein_a.pdb")

v2 = megane.MolecularViewer()
v2.load("protein_b.pdb")

widgets.HBox([v1, v2])
```

## Dihedral Analysis Along Trajectory

Compute per-frame measurements and plot the results:

```python
import time

viewer = megane.MolecularViewer()
viewer.load("protein.pdb", xtc="trajectory.xtc")

# Set the atoms to measure
viewer.selected_atoms = [0, 1, 2, 3]

# Collect dihedral angles across frames
dihedrals = []

@viewer.on_event("measurement")
def collect(data):
    if data and data["type"] == "dihedral":
        dihedrals.append(data["value"])

for i in range(viewer.total_frames):
    viewer.frame_index = i
    time.sleep(0.01)

viewer.off_event("measurement", collect)

# Plot results
fig = go.FigureWidget(
    data=[go.Scatter(x=list(range(len(dihedrals))), y=dihedrals,
                     mode="lines+markers")],
    layout=go.Layout(title="Dihedral angle along trajectory",
                     xaxis_title="Frame", yaxis_title="Dihedral (°)", height=300),
)
widgets.VBox([fig, viewer])
```

## Custom Widget Integration

Connect megane with any ipywidgets component:

```python
import ipywidgets as widgets

viewer = megane.MolecularViewer()
viewer.load("protein.pdb", xtc="trajectory.xtc")

slider = widgets.IntSlider(
    value=0, min=0, max=viewer.total_frames - 1,
    description="Frame:", continuous_update=True,
)
label = widgets.Label(value="Frame: 0")

# Slider → viewer
def on_slider(change):
    viewer.frame_index = change["new"]
slider.observe(on_slider, names="value")

# Viewer → slider + label
@viewer.on_event("frame_change")
def on_frame(data):
    idx = data["frame_index"]
    label.value = f"Frame: {idx}"
    slider.value = idx

widgets.VBox([widgets.HBox([slider, label]), viewer])
```
