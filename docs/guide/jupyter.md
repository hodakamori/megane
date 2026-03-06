# Jupyter Widget

megane provides an [anywidget](https://anywidget.dev/)-based Jupyter widget for interactive molecular visualization directly in notebooks.

## Basic Usage

```python
import megane

viewer = megane.MolecularViewer()
viewer.load("protein.pdb")
viewer  # displays in the notebook cell
```

## Loading Trajectories

```python
viewer.load("protein.pdb", xtc="trajectory.xtc")

# Access trajectory info
print(f"Total frames: {viewer.total_frames}")

# Navigate frames
viewer.frame_index = 50
```

## Atom Selection

Select atoms programmatically by setting the `selected_atoms` property:

```python
# Select 4 atoms to compute a dihedral angle
viewer.selected_atoms = [10, 20, 30, 40]

# Read the measurement result
print(viewer.measurement)
# {'type': 'dihedral', 'value': 120.5, 'label': '120.5°', 'atoms': [10, 20, 30, 40]}
```

Measurement types depend on the number of selected atoms:

| Atoms | Measurement |
|-------|-------------|
| 2     | Distance    |
| 3     | Angle       |
| 4     | Dihedral    |

## Event Handling

Register callbacks to react to viewer events:

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

Remove callbacks:

```python
# Remove a specific callback
viewer.off_event("measurement", on_measurement)

# Remove all callbacks for an event
viewer.off_event("measurement")
```

### Supported Events

| Event | Data | Description |
|-------|------|-------------|
| `frame_change` | `{"frame_index": int}` | Fired when `frame_index` changes |
| `selection_change` | `{"atoms": list[int]}` | Fired when `selected_atoms` changes |
| `measurement` | `{"type": str, "value": float, "label": str, "atoms": list[int]}` or `None` | Fired when a measurement is computed |

## Plotly Integration

Combine megane with Plotly for interactive analysis:

```python
import plotly.graph_objects as go

# Create a Plotly figure
fig = go.FigureWidget(data=[go.Scatter(x=times, y=energies)])

# Click on a data point to jump to that frame
def on_click(trace, points, state):
    viewer.frame_index = points.point_inds[0]

fig.data[0].on_click(on_click)

# Display side by side
from IPython.display import display
display(viewer)
display(fig)
```
