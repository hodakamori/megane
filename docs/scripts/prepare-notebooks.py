"""
Prepare example notebooks for nbconvert by embedding outputs.

Takes the source notebooks from examples/ and creates copies in docs/notebooks/
with pre-filled outputs:
- Text outputs (print results) are hardcoded
- Widget outputs are replaced with screenshot PNG images

Usage:
    python3 docs/scripts/prepare-notebooks.py
"""

import base64
import copy
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(SCRIPT_DIR, "..", "..")
EXAMPLES_DIR = os.path.join(ROOT, "examples")
OUTPUT_DIR = os.path.join(ROOT, "docs", "notebooks")
IMAGES_DIR = os.path.join(ROOT, "docs", "public", "images")


def load_image_b64(name: str) -> str:
    """Load a PNG image and return base64-encoded string."""
    path = os.path.join(IMAGES_DIR, name)
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode("ascii")


def make_text_output(text: str) -> dict:
    """Create a notebook stream output cell."""
    return {
        "output_type": "stream",
        "name": "stdout",
        "text": [text if text.endswith("\n") else text + "\n"],
    }


def make_image_output(image_b64: str) -> dict:
    """Create a notebook display_data output with a PNG image."""
    return {
        "output_type": "display_data",
        "metadata": {},
        "data": {
            "image/png": image_b64,
            "text/plain": ["<megane.MolecularViewer>"],
        },
    }


def prepare_demo_notebook():
    """Prepare examples/demo.ipynb with embedded outputs."""
    src = os.path.join(EXAMPLES_DIR, "demo.ipynb")
    with open(src) as f:
        nb = json.load(f)

    widget_basic_b64 = load_image_b64("widget-basic.png")
    widget_full_b64 = load_image_b64("widget-full.png")
    widget_trajectory_b64 = load_image_b64("widget-trajectory.png")

    # Map cell indices to their outputs
    # cell-1: import megane; print(version)
    # cell-3: viewer = ...; viewer.load(...); viewer  -> widget
    # cell-5: traj_viewer = ...; viewer.load(..., xtc=...); print; traj_viewer -> text + widget
    # cell-6: traj_viewer.frame_index = 50 -> no output
    # cell-7: animation loop -> no output
    # cell-9: widgets.HBox([v1, v2]) -> widget (two viewers)
    # cell-11: print structure data -> text

    for cell in nb.get("cells", []):
        cell_id = cell.get("id", "")
        source = "".join(cell.get("source", []))

        if cell.get("cell_type") != "code":
            # Remove code-only fields from markdown cells
            cell.pop("outputs", None)
            cell.pop("execution_count", None)
            continue

        cell["outputs"] = []
        cell["execution_count"] = None

        if cell_id == "cell-1" or "print(f\"megane v" in source:
            cell["outputs"] = [make_text_output("megane v0.1.0")]
            cell["execution_count"] = 1

        elif cell_id == "cell-3" or (source.strip().endswith("viewer") and "viewer.load" in source and "xtc" not in source):
            cell["outputs"] = [make_image_output(widget_basic_b64)]
            cell["execution_count"] = 2

        elif cell_id == "cell-5" or ("xtc=" in source and source.strip().endswith("traj_viewer")):
            cell["outputs"] = [
                make_text_output("Loaded trajectory: 100 frames"),
                make_image_output(widget_trajectory_b64),
            ]
            cell["execution_count"] = 3

        elif cell_id == "cell-6" or "frame_index = 50" in source:
            cell["execution_count"] = 4

        elif cell_id == "cell-7" or "time.sleep" in source:
            cell["execution_count"] = 5

        elif cell_id == "cell-9" or "widgets.HBox" in source:
            cell["outputs"] = [make_image_output(widget_full_b64)]
            cell["execution_count"] = 6

        elif cell_id == "cell-11" or "structure.n_atoms" in source:
            cell["outputs"] = [make_text_output(
                "Atoms:       327\n"
                "Bonds:       337\n"
                "Positions:   (327, 3)\n"
                "Elements:    [ 7  6  6  8  6  6  8  7  6  6]..."
            )]
            cell["execution_count"] = 7

    # Set kernel info
    nb.setdefault("metadata", {})
    nb["metadata"]["kernelspec"] = {
        "display_name": "Python 3",
        "language": "python",
        "name": "python3",
    }
    nb["metadata"]["language_info"] = {
        "name": "python",
        "version": "3.12.0",
    }

    dst = os.path.join(OUTPUT_DIR, "demo.ipynb")
    with open(dst, "w") as f:
        json.dump(nb, f, indent=1, ensure_ascii=False)
    print(f"  Prepared {dst}")


def prepare_external_events_notebook():
    """Prepare examples/external_events.ipynb with embedded outputs."""
    src = os.path.join(EXAMPLES_DIR, "external_events.ipynb")
    with open(src) as f:
        nb = json.load(f)

    widget_basic_b64 = load_image_b64("widget-basic.png")
    widget_trajectory_b64 = load_image_b64("widget-trajectory.png")
    widget_full_b64 = load_image_b64("widget-full.png")

    exec_count = 0
    for cell in nb.get("cells", []):
        source = "".join(cell.get("source", []))

        if cell.get("cell_type") != "code":
            cell.pop("outputs", None)
            cell.pop("execution_count", None)
            continue

        cell["outputs"] = []
        cell["execution_count"] = None

        exec_count += 1
        cell["execution_count"] = exec_count

        # import megane; print version
        if "print(f\"megane v" in source:
            cell["outputs"] = [make_text_output("megane v0.1.0")]

        # viewer.load with trajectory + print
        elif "viewer.load" in source and "xtc=" in source and "print" in source:
            cell["outputs"] = [make_text_output("Loaded trajectory: 100 frames")]

        # widgets.VBox([fig, viewer]) - Plotly + viewer combo
        elif "widgets.VBox([fig" in source or "widgets.VBox([sync_fig" in source or "widgets.VBox([dih_fig" in source:
            cell["outputs"] = [make_image_output(widget_full_b64)]

        # Just viewer display
        elif source.strip().endswith(("viewer", "v", "cb_viewer")):
            cell["outputs"] = [make_image_output(widget_basic_b64)]

        # print(viewer.measurement) / print("Distance:", ...)
        elif "print" in source and "measurement" in source:
            cell["outputs"] = [make_text_output(
                "{'type': 'distance', 'value': 1.47, 'label': '1.47 Å', 'atoms': [0, 1]}"
            )]

        elif 'print("Distance:"' in source:
            cell["outputs"] = [make_text_output(
                "Distance: {'type': 'distance', 'value': 1.47, 'label': '1.47 Å', 'atoms': [0, 1]}"
            )]

        elif 'print("Angle:"' in source:
            cell["outputs"] = [make_text_output(
                "Angle: {'type': 'angle', 'value': 110.2, 'label': '110.2°', 'atoms': [0, 1, 2]}"
            )]

        elif 'print("Dihedral:"' in source:
            cell["outputs"] = [make_text_output(
                "Dihedral: {'type': 'dihedral', 'value': -62.3, 'label': '-62.3°', 'atoms': [0, 1, 2, 3]}"
            )]

        # frame_index changes that trigger callbacks
        elif "frame_index = 10" in source:
            cell["outputs"] = [make_text_output("Frame changed: 10")]

        elif "frame_index = 20" in source:
            # callback was removed, no output
            pass

        # slider + viewer combo
        elif "widgets.VBox([widgets.HBox" in source:
            cell["outputs"] = [make_image_output(widget_trajectory_b64)]

    nb.setdefault("metadata", {})
    nb["metadata"]["kernelspec"] = {
        "display_name": "Python 3",
        "language": "python",
        "name": "python3",
    }
    nb["metadata"]["language_info"] = {
        "name": "python",
        "version": "3.12.0",
    }

    dst = os.path.join(OUTPUT_DIR, "external_events.ipynb")
    with open(dst, "w") as f:
        json.dump(nb, f, indent=1, ensure_ascii=False)
    print(f"  Prepared {dst}")


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Preparing notebooks with embedded outputs...")
    prepare_demo_notebook()
    prepare_external_events_notebook()
    print("Done.")
