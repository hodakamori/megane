"""
Prepare example notebooks for docs by converting to simplified JSON.

Reads notebooks from examples/, embeds outputs (text + widget screenshots),
converts markdown cells to HTML, and writes optimized JSON for the
NotebookRenderer Vue component.

Usage:
    pip install markdown
    python3 docs/scripts/prepare-notebooks.py
"""

import base64
import json
import os

import markdown

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(SCRIPT_DIR, "..", "..")
EXAMPLES_DIR = os.path.join(ROOT, "examples")
OUTPUT_DIR = os.path.join(ROOT, "docs", "public", "notebooks")
IMAGES_DIR = os.path.join(ROOT, "docs", "public", "images")

MD = markdown.Markdown(extensions=["fenced_code", "tables", "codehilite"])


def load_image_data_uri(name: str) -> str:
    """Load a PNG image and return a data URI string."""
    path = os.path.join(IMAGES_DIR, name)
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    return f"data:image/png;base64,{b64}"


def render_markdown(source: str) -> str:
    """Render markdown source to HTML."""
    MD.reset()
    return MD.convert(source)


def make_text(text: str) -> dict:
    return {"output_type": "text", "text": text}


def make_image(name: str) -> dict:
    return {"output_type": "image", "src": load_image_data_uri(name)}


def convert_cell(cell: dict, execution_count=None, outputs=None) -> dict:
    """Convert a notebook cell to the simplified JSON format."""
    source = "".join(cell.get("source", []))

    if cell.get("cell_type") == "markdown":
        return {"cell_type": "markdown", "html": render_markdown(source)}

    result = {
        "cell_type": "code",
        "source": source,
        "execution_count": execution_count,
        "outputs": outputs or [],
    }
    return result


def prepare_demo_notebook():
    """Prepare examples/demo.ipynb."""
    src = os.path.join(EXAMPLES_DIR, "demo.ipynb")
    with open(src) as f:
        nb = json.load(f)

    cells = []
    for cell in nb.get("cells", []):
        cell_id = cell.get("id", "")
        source = "".join(cell.get("source", []))

        if cell.get("cell_type") != "code":
            cells.append(convert_cell(cell))
            continue

        outputs = []
        exec_count = None

        if cell_id == "cell-1" or 'print(f"megane v' in source:
            outputs = [make_text("megane v0.1.0\n")]
            exec_count = 1

        elif cell_id == "cell-3" or (
            source.strip().endswith("viewer")
            and "viewer.load" in source
            and "xtc" not in source
        ):
            outputs = [make_image("widget-basic.png")]
            exec_count = 2

        elif cell_id == "cell-5" or (
            "xtc=" in source and source.strip().endswith("traj_viewer")
        ):
            outputs = [
                make_text("Loaded trajectory: 100 frames\n"),
                make_image("widget-trajectory.png"),
            ]
            exec_count = 3

        elif cell_id == "cell-6" or "frame_index = 50" in source:
            exec_count = 4

        elif cell_id == "cell-7" or "time.sleep" in source:
            exec_count = 5

        elif cell_id == "cell-9" or "widgets.HBox" in source:
            outputs = [make_image("widget-full.png")]
            exec_count = 6

        elif cell_id == "cell-11" or "structure.n_atoms" in source:
            outputs = [
                make_text(
                    "Atoms:       327\n"
                    "Bonds:       337\n"
                    "Positions:   (327, 3)\n"
                    "Elements:    [ 7  6  6  8  6  6  8  7  6  6]...\n"
                )
            ]
            exec_count = 7

        cells.append(convert_cell(cell, exec_count, outputs))

    dst = os.path.join(OUTPUT_DIR, "demo.json")
    with open(dst, "w") as f:
        json.dump({"cells": cells}, f, ensure_ascii=False)
    print(f"  Prepared {dst}")


def prepare_external_events_notebook():
    """Prepare examples/external_events.ipynb."""
    src = os.path.join(EXAMPLES_DIR, "external_events.ipynb")
    with open(src) as f:
        nb = json.load(f)

    cells = []
    exec_count = 0

    for cell in nb.get("cells", []):
        source = "".join(cell.get("source", []))

        if cell.get("cell_type") != "code":
            cells.append(convert_cell(cell))
            continue

        exec_count += 1
        outputs = []

        # import megane; print version
        if 'print(f"megane v' in source:
            outputs = [make_text("megane v0.1.0\n")]

        # viewer.load with trajectory + print
        elif "viewer.load" in source and "xtc=" in source and "print" in source:
            outputs = [make_text("Loaded trajectory: 100 frames\n")]

        # widgets.VBox with Plotly + viewer combo
        elif "widgets.VBox([fig" in source or "widgets.VBox([sync_fig" in source:
            outputs = [make_image("widget-full.png")]

        # widgets.VBox with dihedral plot + viewer
        elif "widgets.VBox([dih_fig" in source:
            outputs = [make_image("widget-measurement.png")]

        # Just viewer display
        elif source.strip().endswith(("viewer", "v", "cb_viewer")):
            outputs = [make_image("widget-basic.png")]

        # Measurement prints
        elif 'print("Distance:"' in source:
            outputs = [
                make_text(
                    "Distance: {'type': 'distance', 'value': 1.47, 'label': '1.47 \u00c5', 'atoms': [0, 1]}\n"
                )
            ]

        elif 'print("Angle:"' in source:
            outputs = [
                make_text(
                    "Angle: {'type': 'angle', 'value': 110.2, 'label': '110.2\u00b0', 'atoms': [0, 1, 2]}\n"
                )
            ]

        elif 'print("Dihedral:"' in source:
            outputs = [
                make_text(
                    "Dihedral: {'type': 'dihedral', 'value': -62.3, 'label': '-62.3\u00b0', 'atoms': [0, 1, 2, 3]}\n"
                )
            ]

        # frame_index changes that trigger callbacks
        elif "frame_index = 10" in source:
            outputs = [make_text("Frame changed: 10\n")]

        elif "frame_index = 20" in source:
            # callback was removed, no output
            pass

        # slider + viewer combo
        elif "widgets.VBox([widgets.HBox" in source:
            outputs = [make_image("widget-trajectory.png")]

        cells.append(convert_cell(cell, exec_count, outputs))

    dst = os.path.join(OUTPUT_DIR, "external_events.json")
    with open(dst, "w") as f:
        json.dump({"cells": cells}, f, ensure_ascii=False)
    print(f"  Prepared {dst}")


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Preparing notebooks as JSON...")
    prepare_demo_notebook()
    prepare_external_events_notebook()
    print("Done.")
