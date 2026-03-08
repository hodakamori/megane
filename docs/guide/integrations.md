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
viewer.load("protein.pdb", xtc="trajectory.xtc")

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
# megane → Plotly (update red marker)
@viewer.on_event("frame_change")
def update_marker(data):
    idx = data["frame_index"]
    marker_trace.x = [idx]
    marker_trace.y = [energy[idx]]
```

See [`examples/external_events.ipynb`](https://github.com/hodakamori/megane/blob/main/examples/external_events.ipynb) for a complete working example.

## MDX / Next.js

Embed the megane viewer in MDX-based documentation frameworks like Next.js.

### Full Viewer

```mdx
import { useState, useEffect } from "react";
import { MeganeViewer, parseStructureText } from "megane-viewer";

export function ProteinDemo() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    fetch("/data/protein.pdb")
      .then((r) => r.text())
      .then(async (text) => {
        const result = await parseStructureText(text);
        setSnapshot(result.snapshot);
      });
  }, []);

  return (
    <MeganeViewer
      snapshot={snapshot}
      mode="local"
      width="100%"
      height="500px"
      /* ... additional props */
    />
  );
}

<ProteinDemo />
```

### Viewport Only

For a minimal embed without panels:

```mdx
import { useState, useEffect } from "react";
import { Viewport, parseStructureText } from "megane-viewer";

export function SimpleViewer() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    fetch("/data/caffeine_water.pdb")
      .then((r) => r.text())
      .then(async (text) => {
        const result = await parseStructureText(text);
        setSnapshot(result.snapshot);
      });
  }, []);

  return (
    <div style={{ height: "400px" }}>
      <Viewport snapshot={snapshot} frame={null} />
    </div>
  );
}

<SimpleViewer />
```

### Next.js Configuration

Add WASM support to `next.config.mjs`:

```js
const nextConfig = {
  webpack(config) {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

export default nextConfig;
```

See [Web / React Guide](/guide/web#mdx-usage-next-js) for the full reference.

## ipywidgets Events

The `MolecularViewer` widget supports event callbacks for reacting to user interactions.

### Available Events

| Event | Trigger | Data |
|-------|---------|------|
| `measurement` | User selects 2–4 atoms | Type, value, atom indices |
| `frame_change` | Frame index changes | `frame_index` |

### Event Handling

```python
import megane

viewer = megane.MolecularViewer()
viewer.load("protein.pdb")

# React to measurement events
@viewer.on_event("measurement")
def on_measurement(data):
    print(f"Measured: {data}")

# React to frame changes
@viewer.on_event("frame_change")
def on_frame(data):
    print(f"Frame: {data['frame_index']}")
```

### Programmatic Atom Selection

Select atoms from Python and retrieve measurement results:

```python
viewer.selected_atoms = [10, 20, 30, 40]  # select 4 atoms
print(viewer.measurement)                  # dihedral angle result
```

## Framework-Agnostic Renderer

`MoleculeRenderer` is a plain Three.js class that can be mounted in any framework.

```ts
import { MoleculeRenderer } from "megane-viewer";

const container = document.getElementById("viewer");
const renderer = new MoleculeRenderer(container);
renderer.setSnapshot(snapshot);
renderer.setFrame(frame);
```

Use this to embed megane in Vue, Svelte, or any other framework — or directly in a vanilla `<div>`.
