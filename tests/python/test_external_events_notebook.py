"""Regression tests for the ``examples/external_events.ipynb`` demo.

These tests reproduce the two patterns that were broken in the original
notebook so any future regression fails a fast Python test instead of
only being caught by visual inspection of the rendered notebook.

Bug 1 (Section 5 — Dihedral Angle Trajectory Analysis):
    The original cell collected dihedrals via the ``measurement`` event
    fired by the JS frontend. A synchronous Python ``for`` loop that
    only sets ``frame_index`` cannot receive those events, so the list
    stayed empty and the Plotly trace had no data points.

Bug 2 (Section 6 — Custom Widget Integration):
    The slider/label used 0-based indices ("Frame: 53") while the
    megane viewer's footer shows 1-based ("54 / 100"). The two displays
    disagreed by one for the same frame.
"""

from __future__ import annotations

import json
from pathlib import Path

import ipywidgets as widgets
import numpy as np
import pytest

import megane
from megane.parsers.xtc import load_trajectory
from megane.widget import MolecularViewer

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
FIXTURES = REPO_ROOT / "tests" / "fixtures"
PDB = str(FIXTURES / "caffeine_water.pdb")
XTC = str(FIXTURES / "caffeine_water_vibration.xtc")
NOTEBOOK = REPO_ROOT / "examples" / "external_events.ipynb"


def _build_pipeline() -> tuple[megane.Pipeline, MolecularViewer]:
    pipe = megane.Pipeline()
    s = pipe.add_node(megane.LoadStructure(PDB))
    t = pipe.add_node(megane.LoadTrajectory(xtc=XTC))
    bonds = pipe.add_node(megane.AddBonds(source="structure"))
    vp = pipe.add_node(megane.Viewport())
    pipe.add_edge(s.out.particle, t.inp.particle)
    pipe.add_edge(s.out.particle, bonds.inp.particle)
    pipe.add_edge(s.out.particle, vp.inp.particle)
    pipe.add_edge(t.out.traj, vp.inp.traj)
    pipe.add_edge(bonds.out.bond, vp.inp.bond)
    viewer = MolecularViewer()
    viewer.set_pipeline(pipe)
    return pipe, viewer


def _dihedral_deg(p0, p1, p2, p3) -> float:
    b0 = p0 - p1
    b1 = p2 - p1
    b2 = p3 - p2
    b1n = b1 / np.linalg.norm(b1)
    v = b0 - np.dot(b0, b1n) * b1n
    w = b2 - np.dot(b2, b1n) * b1n
    return float(np.degrees(np.arctan2(np.dot(np.cross(b1n, v), w), np.dot(v, w))))


# ── Bug 1: Section 5 ────────────────────────────────────────────────────


def test_section5_event_loop_pattern_is_empty_without_js():
    """Original buggy pattern: collecting dihedrals via JS ``measurement``
    events in a synchronous Python loop yields nothing because the kernel
    cannot drain JS→Python comm messages while the loop is running."""
    _, viewer = _build_pipeline()
    viewer.selected_atoms = [0, 1, 2, 3]

    collected: list[float] = []

    @viewer.on_event("measurement")
    def cb(data):
        if data and data.get("type") == "dihedral":
            collected.append(data["value"])

    for i in range(viewer.total_frames):
        viewer.frame_index = i

    # Confirms the underlying issue: the JS frontend is the only producer
    # of measurement events, so a headless Python run sees zero events.
    assert collected == [], (
        "JS measurement events should not arrive during a synchronous "
        "Python loop. If this assertion fails, the widget grew a "
        "Python-side measurement implementation and Section 5 can use "
        "the event-driven pattern again."
    )


def test_section5_python_dihedral_series_populated():
    """Fixed pattern: compute dihedrals directly from the trajectory in
    Python. The series must have exactly one finite value per frame."""
    _, viewer = _build_pipeline()
    trajectory = load_trajectory(PDB, XTC)

    atoms = [0, 1, 2, 3]
    dihedrals = [
        _dihedral_deg(*[trajectory.get_frame(i)[a] for a in atoms])
        for i in range(trajectory.n_frames)
    ]

    assert len(dihedrals) == viewer.total_frames
    assert len(dihedrals) > 0
    for d in dihedrals:
        assert np.isfinite(d)
        assert -180.0 <= d <= 180.0


def test_section5_notebook_uses_python_side_dihedral_pattern():
    """The notebook source must compute the dihedral series in Python
    and not depend on the JS round-trip ``measurement`` event."""
    nb = json.loads(NOTEBOOK.read_text())
    section5 = "".join(nb["cells"][18]["source"])

    assert "load_trajectory(" in section5, (
        "Section 5 should compute dihedrals from a Python-loaded trajectory."
    )
    assert "dihedral_deg" in section5 or "np.arctan2" in section5, (
        "Section 5 should compute the dihedral angle in Python."
    )
    # The buggy ``time.sleep(0.01)`` loop only existed in the broken
    # event-driven pattern; its presence indicates a regression.
    assert "time.sleep" not in section5, (
        "Section 5 should not rely on time.sleep to wait for JS events."
    )


# ── Bug 2: Section 6 ────────────────────────────────────────────────────


def _section6_slider_binding(viewer: MolecularViewer):
    """Mirror the notebook's Section 6 binding logic exactly."""
    n_frames = viewer.total_frames
    slider = widgets.IntSlider(
        value=1, min=1, max=n_frames, description="Frame:"
    )
    label = widgets.Label(value=f"Frame: 1 / {n_frames}")

    def on_slider(change):
        viewer.frame_index = change["new"] - 1

    slider.observe(on_slider, names="value")

    @viewer.on_event("frame_change")
    def on_frame(data):
        idx = data["frame_index"]
        label.value = f"Frame: {idx + 1} / {n_frames}"
        slider.value = idx + 1

    return slider, label


def test_section6_slider_label_match_megane_footer():
    """Setting frame_index updates slider and label using 1-based numbers
    that match the megane viewer's footer (``currentFrame + 1 / total``)."""
    _, viewer = _build_pipeline()
    slider, label = _section6_slider_binding(viewer)
    n = viewer.total_frames

    viewer.frame_index = 0
    assert slider.value == 1
    assert label.value == f"Frame: 1 / {n}"

    viewer.frame_index = 53
    assert slider.value == 54
    assert label.value == f"Frame: 54 / {n}"
    # Megane's Timeline.tsx renders "{currentFrame + 1} / {totalFrames}".
    megane_footer = f"{viewer.frame_index + 1} / {n}"
    assert megane_footer == "54 / 100"
    assert megane_footer in label.value


def test_section6_slider_drives_frame_index_one_based():
    """Moving the slider must convert the 1-based displayed value back
    to the 0-based ``frame_index`` the viewer expects."""
    _, viewer = _build_pipeline()
    slider, _ = _section6_slider_binding(viewer)

    slider.value = 1
    assert viewer.frame_index == 0
    slider.value = 100
    assert viewer.frame_index == 99


def test_section6_buggy_zero_based_pattern_disagrees_with_megane_footer():
    """The original 0-based pattern produced a label number that did not
    match megane's 1-based footer for the same frame. This documents the
    regression so anyone who reverts the fix sees a clear failure."""
    _, viewer = _build_pipeline()

    label = widgets.Label(value="Frame: 0")

    @viewer.on_event("frame_change")
    def on_frame(data):
        label.value = f"Frame: {data['frame_index']}"

    viewer.frame_index = 53
    assert label.value == "Frame: 53"

    megane_footer = f"{viewer.frame_index + 1} / {viewer.total_frames}"
    # Buggy pattern: label says 53, megane footer says 54 — disagreement.
    assert megane_footer.split(" ")[0] != label.value.split(" ")[-1]


def test_section6_notebook_uses_one_based_display():
    """The notebook source must use a 1-based slider/label."""
    nb = json.loads(NOTEBOOK.read_text())
    section6 = "".join(nb["cells"][20]["source"])

    assert 'min=1' in section6, "Section 6 slider should start at 1 (1-based)."
    assert 'max=slider_viewer.total_frames' in section6 or "max=n_frames" in section6, (
        "Section 6 slider max should equal total_frames (1-based)."
    )
    # The 0→0-based label format ``f\"Frame: {idx}\"`` is the bug pattern.
    assert 'f"Frame: {idx + 1} / {n_frames}"' in section6, (
        "Section 6 label should display 1-based 'Frame: X / N'."
    )
