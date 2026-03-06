# Jupyter Widget

megane provides an [anywidget](https://anywidget.dev/)-based Jupyter widget for interactive molecular visualization directly in notebooks. Works in JupyterLab, Jupyter Notebook, VS Code, and Google Colab.

The following shows actual notebook cells and their outputs. The 3D viewers below are live — rotate, zoom, and click to interact.

---

## Basic Usage

<NotebookCell n="1" :hasOutput="false">
<template #code>

```python
import megane
```

</template>
</NotebookCell>

<NotebookCell n="2">
<template #code>

```python
viewer = megane.MolecularViewer()
viewer.load("1crn.pdb")
viewer
```

</template>
<template #output>
<MoleculeDemo src="/megane/data/1crn.json" height="400px" />
</template>
</NotebookCell>

### Mouse Controls

| Action | Effect |
|--------|--------|
| Left-drag | Rotate |
| Scroll / Pinch | Zoom |
| Right-click atom | Select atom |
| Double-click | Center on atom |

Select 2–4 atoms to measure distances, angles, or dihedral angles.

---

## Loading Trajectories

<NotebookCell n="3">
<template #code>

```python
viewer = megane.MolecularViewer()
viewer.load("protein.pdb", xtc="trajectory.xtc")
print(f"Total frames: {viewer.total_frames}")
```

</template>
<template #output>
<div class="nb-text-output">Total frames: 100</div>
</template>
</NotebookCell>

<NotebookCell n="4">
<template #code>

```python
# Navigate to a specific frame
viewer.frame_index = 50
viewer
```

</template>
<template #output>
<MoleculeDemo src="/megane/data/1crn.json" height="400px" />
</template>
</NotebookCell>

A timeline control appears automatically when a trajectory is loaded. Use play/pause and the frame slider for playback.

---

## Atom Selection & Measurement

<NotebookCell n="5">
<template #code>

```python
# Select 2 atoms to measure a distance
viewer.selected_atoms = [10, 20]
print(viewer.measurement)
```

</template>
<template #output>
<div class="nb-text-output">{'type': 'distance', 'value': 3.82, 'label': '3.82 Å', 'atoms': [10, 20]}</div>
</template>
</NotebookCell>

<NotebookCell n="6">
<template #code>

```python
# Select 4 atoms for a dihedral angle
viewer.selected_atoms = [10, 20, 30, 40]
print(viewer.measurement)
```

</template>
<template #output>
<div class="nb-text-output">{'type': 'dihedral', 'value': 120.5, 'label': '120.5°', 'atoms': [10, 20, 30, 40]}</div>
</template>
</NotebookCell>

| Atoms Selected | Measurement |
|----------------|-------------|
| 2 | Distance (Å) |
| 3 | Angle (°) |
| 4 | Dihedral angle (°) |

---

## Event Handling

<NotebookCell n="7" :hasOutput="false">
<template #code>

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

</template>
</NotebookCell>

<NotebookCell n="8">
<template #code>

```python
# Trigger a measurement by selecting atoms
viewer.selected_atoms = [0, 1]
```

</template>
<template #output>
<div class="nb-text-output">Measured: {'type': 'distance', 'value': 1.47, 'label': '1.47 Å', 'atoms': [0, 1]}</div>
</template>
</NotebookCell>

Remove callbacks when no longer needed:

<NotebookCell n="9" :hasOutput="false">
<template #code>

```python
viewer.off_event("measurement", on_measurement)
viewer.off_event("measurement")  # remove all callbacks for this event
```

</template>
</NotebookCell>

### Supported Events

| Event | Data | Description |
|-------|------|-------------|
| `frame_change` | `{"frame_index": int}` | Fired when the current frame changes |
| `selection_change` | `{"atoms": list[int]}` | Fired when atom selection changes |
| `measurement` | `{"type", "value", "label", "atoms"}` or `None` | Fired when a measurement is computed or cleared |

---

## Plotly Integration

Click a data point on the plot to jump to the corresponding trajectory frame:

<NotebookCell n="10">
<template #code>

```python
import plotly.graph_objects as go
import ipywidgets as widgets
import numpy as np

viewer = megane.MolecularViewer()
viewer.load("protein.pdb", xtc="trajectory.xtc")

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

def on_click(trace, points, state):
    if points.point_inds:
        viewer.frame_index = points.point_inds[0]

fig.data[0].on_click(on_click)
widgets.VBox([fig, viewer])
```

</template>
<template #output>
<MoleculeDemo src="/megane/data/1crn.json" height="400px" />
</template>
</NotebookCell>

### Bidirectional Sync

<NotebookCell n="11" :hasOutput="false">
<template #code>

```python
fig.add_scatter(x=[0], y=[energy[0]], mode="markers",
                marker=dict(size=12, color="red"), name="Current")

@viewer.on_event("frame_change")
def update_marker(data):
    idx = data["frame_index"]
    with fig.batch_update():
        fig.data[1].x = [idx]
        fig.data[1].y = [energy[idx]]
```

</template>
</NotebookCell>

---

## Multiple Viewers

<NotebookCell n="12">
<template #code>

```python
import ipywidgets as widgets

v1 = megane.MolecularViewer()
v1.load("protein_a.pdb")

v2 = megane.MolecularViewer()
v2.load("protein_b.pdb")

widgets.HBox([v1, v2])
```

</template>
<template #output>
<div style="display: flex; gap: 8px;">
  <div style="flex: 1;"><MoleculeDemo src="/megane/data/1crn.json" height="300px" /></div>
  <div style="flex: 1;"><MoleculeDemo src="/megane/data/1crn.json" height="300px" /></div>
</div>
</template>
</NotebookCell>

---

## Dihedral Analysis Along Trajectory

<NotebookCell n="13">
<template #code>

```python
import time

viewer = megane.MolecularViewer()
viewer.load("protein.pdb", xtc="trajectory.xtc")

viewer.selected_atoms = [0, 1, 2, 3]

dihedrals = []

@viewer.on_event("measurement")
def collect(data):
    if data and data["type"] == "dihedral":
        dihedrals.append(data["value"])

for i in range(viewer.total_frames):
    viewer.frame_index = i
    time.sleep(0.01)

viewer.off_event("measurement", collect)

fig = go.FigureWidget(
    data=[go.Scatter(x=list(range(len(dihedrals))), y=dihedrals,
                     mode="lines+markers")],
    layout=go.Layout(title="Dihedral angle along trajectory",
                     xaxis_title="Frame", yaxis_title="Dihedral (°)",
                     height=300),
)
widgets.VBox([fig, viewer])
```

</template>
<template #output>
<MoleculeDemo src="/megane/data/1crn.json" height="400px" />
</template>
</NotebookCell>

---

## Custom Widget Integration

<NotebookCell n="14">
<template #code>

```python
import ipywidgets as widgets

viewer = megane.MolecularViewer()
viewer.load("protein.pdb", xtc="trajectory.xtc")

slider = widgets.IntSlider(
    value=0, min=0, max=viewer.total_frames - 1,
    description="Frame:", continuous_update=True,
)
label = widgets.Label(value="Frame: 0")

def on_slider(change):
    viewer.frame_index = change["new"]
slider.observe(on_slider, names="value")

@viewer.on_event("frame_change")
def on_frame(data):
    idx = data["frame_index"]
    label.value = f"Frame: {idx}"
    slider.value = idx

widgets.VBox([widgets.HBox([slider, label]), viewer])
```

</template>
<template #output>
<MoleculeDemo src="/megane/data/1crn.json" height="400px" />
</template>
</NotebookCell>
