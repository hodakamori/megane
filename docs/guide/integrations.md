# Integrations

megane integrates with your existing tools and workflows. This guide covers Plotly event-driven control, MDX embedding, ipywidgets events, and framework-agnostic rendering.

## Plotly

Control the megane viewer from Plotly charts using ipywidgets event interop. Click a data point on a Plotly `FigureWidget` to jump to the corresponding trajectory frame.

### Click to Select Frame

```python
import plotly.graph_objects as go
import ipywidgets as widgets
import megane

viewer = megane.MolecularViewer()

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))
t = pipe.add_node(megane.LoadTrajectory(xtc="trajectory.xtc"))
pipe.add_edge(s, t)
viewer.set_pipeline(pipe)

# Create a Plotly time-series chart
fig = go.FigureWidget(
    data=[go.Scatter(x=frames, y=energy, mode="lines+markers", name="Energy")],
    layout=go.Layout(
        xaxis_title="Frame", yaxis_title="Energy (kJ/mol)",
    ),
)

# Plotly click → megane frame selection
def on_click(trace, points, state):
    if points.point_inds:
        viewer.frame_index = points.point_inds[0]

fig.data[0].on_click(on_click)

# Display side by side
widgets.VBox([fig, viewer])
```

### Sync Plotly Marker with Current Frame

Use megane's `on_event("frame_change")` callback to update a marker on the Plotly chart:

```python
# megane → Plotly (update red marker on the chart)
@viewer.on_event("frame_change")
def update_marker(data):
    idx = data["frame_index"]
    with fig.batch_update():
        marker_trace.x = [idx]
        marker_trace.y = [energy[idx]]
```

### Dihedral Trajectory Analysis

Collect dihedral angles across all frames and plot the result:

```python
import time

viewer.selected_atoms = [10, 20, 30, 40]  # define the dihedral
dihedrals = []

@viewer.on_event("measurement")
def collect(data):
    if data and data["type"] == "dihedral":
        dihedrals.append(data["value"])

# Scan all frames
for i in range(viewer.total_frames):
    viewer.frame_index = i
    time.sleep(0.01)  # allow widget sync

viewer.off_event("measurement", collect)  # clean up

# Plot with Plotly
fig = go.FigureWidget(
    data=[go.Scatter(y=dihedrals, mode="lines", name="Dihedral")],
    layout=go.Layout(xaxis_title="Frame", yaxis_title="Angle (°)"),
)
fig
```

See [`examples/external_events.ipynb`](https://github.com/hodakamori/megane/blob/main/examples/external_events.ipynb) for complete working examples.

## MDX / Next.js

Embed the megane viewer in MDX-based documentation frameworks like Next.js. Drop `<MeganeViewer />` or `<Viewport />` into your `.mdx` files — WASM parsing works out of the box with a one-line webpack config.

For full code examples and Next.js configuration, see the [Web / React Guide — MDX Usage](/guide/web#mdx-usage-next-js).

## ipywidgets Events

The `MolecularViewer` widget supports event callbacks for reacting to user interactions.

### Available Events

| Event | Trigger | Data |
|-------|---------|------|
| `frame_change` | Frame index changes | `{"frame_index": int}` |
| `selection_change` | Selected atoms change | `{"atoms": list[int]}` |
| `measurement` | User selects 2–4 atoms | `{"type": str, "value": float, "label": str, "atoms": list[int]}` or `None` |

### Registering Callbacks

Use `on_event()` as a decorator or method call:

```python
import megane

viewer = megane.MolecularViewer()

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))
viewer.set_pipeline(pipe)

# As decorator
@viewer.on_event("measurement")
def on_measurement(data):
    print(f"Measured: {data}")

# As method call
def on_frame(data):
    print(f"Frame: {data['frame_index']}")

viewer.on_event("frame_change", on_frame)

# React to atom selection changes
@viewer.on_event("selection_change")
def on_selection(data):
    print(f"Selected atoms: {data['atoms']}")
```

### Removing Callbacks

Use `off_event()` to unregister:

```python
viewer.off_event("measurement", on_measurement)  # remove specific callback
viewer.off_event("frame_change")                  # remove all frame_change callbacks
```

### Programmatic Atom Selection

Select atoms from Python and read the measurement result directly:

```python
viewer.selected_atoms = [10, 20, 30, 40]  # select 4 atoms → triggers selection_change
result = viewer.measurement                # read measurement without callback
# {"type": "dihedral", "value": 120.5, "label": "120.5°", "atoms": [10, 20, 30, 40]}
```

The `measurement` property returns:
- `None` if fewer than 2 atoms are selected
- A dict with `type` (`"distance"`, `"angle"`, or `"dihedral"`), `value` (float), `label` (formatted string), and `atoms` (list of indices)

## Framework-Agnostic Renderer

`MoleculeRenderer` is a plain Three.js class that can be mounted in any framework.

```ts
import { MoleculeRenderer } from "megane-viewer";

// Mount in any DOM element
const container = document.getElementById("viewer");
const renderer = new MoleculeRenderer(container);

// Set data
renderer.setSnapshot(snapshot);
renderer.setFrame(frame);

// Clean up
renderer.dispose();
```

Use this to embed megane in Vue, Svelte, or any other framework — or directly in a vanilla `<div>`. See the [Web / React Guide](/guide/web#framework-agnostic-usage) for detailed examples.
