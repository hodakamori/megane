"""
Prepare example notebooks for docs by converting to HTML with nbconvert.

Reads notebooks from examples/, injects simulated outputs for cells that
would produce text or widget output, then converts to HTML using nbconvert's
basic template for embedding in VitePress.

Usage:
    pip install nbconvert nbformat
    python3 docs/scripts/prepare-notebooks.py
"""

import os

import nbformat
from nbconvert import HTMLExporter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(SCRIPT_DIR, "..", "..")
EXAMPLES_DIR = os.path.join(ROOT, "examples")
OUTPUT_DIR = os.path.join(ROOT, "docs", "public", "notebooks")


def make_stream(text: str) -> nbformat.NotebookNode:
    return nbformat.v4.new_output(output_type="stream", name="stdout", text=text)


def make_display_text(text: str) -> nbformat.NotebookNode:
    return nbformat.v4.new_output(
        output_type="display_data", data={"text/plain": text}
    )


def inject_demo_outputs(nb: nbformat.NotebookNode) -> None:
    """Inject simulated outputs into demo.ipynb cells."""
    exec_count = 0
    for cell in nb.cells:
        if cell.cell_type != "code":
            continue
        exec_count += 1
        cell.execution_count = exec_count
        source = cell.source
        cell_id = cell.get("id", "")

        if cell_id == "cell-1" or 'print(f"megane v' in source:
            cell.outputs = [make_stream("megane v0.1.0\n")]

        elif cell_id == "cell-3" or (
            source.strip().endswith("viewer")
            and "viewer.load" in source
            and "xtc" not in source
        ):
            cell.outputs = [make_display_text("MolecularViewer()")]

        elif cell_id == "cell-5" or (
            "xtc=" in source and source.strip().endswith("traj_viewer")
        ):
            cell.outputs = [
                make_stream("Loaded trajectory: 100 frames\n"),
                make_display_text("MolecularViewer(total_frames=100)"),
            ]

        elif cell_id == "cell-9" or "widgets.HBox" in source:
            cell.outputs = [make_display_text("HBox(children=(MolecularViewer(), MolecularViewer()))")]

        elif cell_id == "cell-11" or "structure.n_atoms" in source:
            cell.outputs = [
                make_stream(
                    "Atoms:       327\n"
                    "Bonds:       337\n"
                    "Positions:   (327, 3)\n"
                    "Elements:    [ 7  6  6  8  6  6  8  7  6  6]...\n"
                )
            ]

        else:
            cell.outputs = []


def inject_external_events_outputs(nb: nbformat.NotebookNode) -> None:
    """Inject simulated outputs into external_events.ipynb cells."""
    exec_count = 0
    for cell in nb.cells:
        if cell.cell_type != "code":
            continue
        exec_count += 1
        cell.execution_count = exec_count
        source = cell.source
        cell.outputs = []

        if 'print(f"megane v' in source:
            cell.outputs = [make_stream("megane v0.1.0\n")]

        elif "viewer.load" in source and "xtc=" in source and "print" in source:
            cell.outputs = [make_stream("Loaded trajectory: 100 frames\n")]

        elif "widgets.VBox([fig" in source or "widgets.VBox([sync_fig" in source:
            cell.outputs = [make_display_text("VBox(children=(FigureWidget(...), MolecularViewer()))")]

        elif "widgets.VBox([dih_fig" in source:
            cell.outputs = [make_display_text("VBox(children=(FigureWidget(...), MolecularViewer()))")]

        elif "widgets.VBox([widgets.HBox" in source:
            cell.outputs = [
                make_display_text("VBox(children=(HBox(children=(IntSlider(...), Label(...))), MolecularViewer()))")
            ]

        elif source.strip().endswith(("viewer", "v", "cb_viewer")):
            cell.outputs = [make_display_text("MolecularViewer()")]

        elif 'print("Distance:"' in source:
            cell.outputs = [
                make_stream(
                    "Distance: {'type': 'distance', 'value': 1.47, 'label': '1.47 \u00c5', 'atoms': [0, 1]}\n"
                )
            ]

        elif 'print("Angle:"' in source:
            cell.outputs = [
                make_stream(
                    "Angle: {'type': 'angle', 'value': 110.2, 'label': '110.2\u00b0', 'atoms': [0, 1, 2]}\n"
                )
            ]

        elif 'print("Dihedral:"' in source:
            cell.outputs = [
                make_stream(
                    "Dihedral: {'type': 'dihedral', 'value': -62.3, 'label': '-62.3\u00b0', 'atoms': [0, 1, 2, 3]}\n"
                )
            ]

        elif "frame_index = 10" in source:
            cell.outputs = [make_stream("Frame changed: 10\n")]


def convert_notebook(name: str, inject_fn) -> None:
    """Convert a notebook to HTML using nbconvert."""
    src = os.path.join(EXAMPLES_DIR, f"{name}.ipynb")
    nb = nbformat.read(src, as_version=4)

    inject_fn(nb)

    exporter = HTMLExporter(template_name="basic")
    body, _resources = exporter.from_notebook_node(nb)

    dst = os.path.join(OUTPUT_DIR, f"{name}.html")
    with open(dst, "w") as f:
        f.write(body)
    print(f"  Prepared {dst}")


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Preparing notebooks as HTML...")
    convert_notebook("demo", inject_demo_outputs)
    convert_notebook("external_events", inject_external_events_outputs)
    print("Done.")
