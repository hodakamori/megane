# ipywidgets Events

The `MolecularViewer` widget supports event callbacks for reacting to user interactions.

## Available Events

| Event | Trigger | Data |
|-------|---------|------|
| `frame_change` | Frame index changes | `{"frame_index": int}` |
| `selection_change` | Selected atoms change | `{"atoms": list[int]}` |
| `measurement` | User selects 2–4 atoms | `{"type": str, "value": float, "label": str, "atoms": list[int]}` or `None` |

## Registering Callbacks

Use `on_event()` as a decorator or method call:

```python
import megane

viewer = megane.view("protein.pdb")

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

## Removing Callbacks

Use `off_event()` to unregister:

```python
viewer.off_event("measurement", on_measurement)  # remove specific callback
viewer.off_event("frame_change")                  # remove all frame_change callbacks
```

## Programmatic Atom Selection

Select atoms from Python and read the measurement result directly:

```python
viewer.selected_atoms = [10, 20, 30, 40]  # select 4 atoms → triggers selection_change
result = viewer.measurement                # read measurement without callback
# {"type": "dihedral", "value": 120.5, "label": "120.5°", "atoms": [10, 20, 30, 40]}
```

The `measurement` property returns:
- `None` if fewer than 2 atoms are selected
- A dict with `type` (`"distance"`, `"angle"`, or `"dihedral"`), `value` (float), `label` (formatted string), and `atoms` (list of indices)
