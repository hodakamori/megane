"""Tests that verify demo code from README and docs actually works.

Each test corresponds to a documented Python usage pattern.  References to
the source documentation are included in docstrings.
"""

from pathlib import Path

import pytest

import megane

FIXTURES = Path(__file__).parent.parent / "fixtures"


# ─── README / Getting Started: viewer.load() ────────────────────────


def test_viewer_load_pdb():
    """README.md / docs/getting-started.md: basic viewer.load('protein.pdb')."""
    viewer = megane.MolecularViewer()
    with pytest.warns(DeprecationWarning):
        viewer.load(str(FIXTURES / "1crn.pdb"))
    assert viewer._structure is not None
    assert viewer._structure.n_atoms == 327
    assert len(viewer._snapshot_data) > 0


def test_viewer_load_with_xtc():
    """README.md: viewer.load(pdb, xtc=xtc) loads trajectory."""
    viewer = megane.MolecularViewer()
    with pytest.warns(DeprecationWarning):
        viewer.load(
            str(FIXTURES / "caffeine_water.pdb"),
            xtc=str(FIXTURES / "caffeine_water_vibration.xtc"),
        )
    assert viewer.total_frames > 0
    assert viewer._trajectory is not None


def test_frame_index_assignment():
    """README.md: viewer.frame_index = 50 updates frame data."""
    viewer = megane.MolecularViewer()
    with pytest.warns(DeprecationWarning):
        viewer.load(
            str(FIXTURES / "caffeine_water.pdb"),
            xtc=str(FIXTURES / "caffeine_water_vibration.xtc"),
        )
    viewer.frame_index = 5
    assert len(viewer._frame_data) > 0


# ─── Integrations Guide: selected_atoms & events ────────────────────


def test_selected_atoms_trait():
    """docs/guide/integrations.md: viewer.selected_atoms = [0, 1]."""
    viewer = megane.MolecularViewer()
    with pytest.warns(DeprecationWarning):
        viewer.load(str(FIXTURES / "1crn.pdb"))
    viewer.selected_atoms = [0, 1]
    assert viewer.selected_atoms == [0, 1]


def test_event_callback_frame_change():
    """docs/guide/integrations.md: @viewer.on_event('frame_change')."""
    viewer = megane.MolecularViewer()
    with pytest.warns(DeprecationWarning):
        viewer.load(
            str(FIXTURES / "caffeine_water.pdb"),
            xtc=str(FIXTURES / "caffeine_water_vibration.xtc"),
        )
    received = []

    @viewer.on_event("frame_change")
    def on_frame(data):
        received.append(data)

    viewer.frame_index = 3
    assert len(received) == 1
    assert received[0]["frame_index"] == 3


def test_event_callback_off_event():
    """docs/guide/integrations.md: viewer.off_event() removes callbacks."""
    viewer = megane.MolecularViewer()
    with pytest.warns(DeprecationWarning):
        viewer.load(
            str(FIXTURES / "caffeine_water.pdb"),
            xtc=str(FIXTURES / "caffeine_water_vibration.xtc"),
        )
    received = []

    @viewer.on_event("frame_change")
    def on_frame(data):
        received.append(data)

    viewer.frame_index = 1
    assert len(received) == 1

    viewer.off_event("frame_change", on_frame)
    viewer.frame_index = 2
    assert len(received) == 1  # no new callback


def test_event_callback_selection_change():
    """docs/guide/integrations.md: selection_change event fires on selected_atoms change."""
    viewer = megane.MolecularViewer()
    with pytest.warns(DeprecationWarning):
        viewer.load(str(FIXTURES / "1crn.pdb"))
    received = []

    @viewer.on_event("selection_change")
    def on_sel(data):
        received.append(data)

    viewer.selected_atoms = [10, 20, 30, 40]
    assert len(received) == 1
    assert received[0]["atoms"] == [10, 20, 30, 40]


# ─── Pipeline API ───────────────────────────────────────────────────


def test_pipeline_load_structure():
    """Pipeline API: LoadStructure + Viewport + set_pipeline() enables pipeline mode."""
    pipe = megane.Pipeline()
    s = pipe.add_node(megane.LoadStructure(str(FIXTURES / "1crn.pdb")))
    v = pipe.add_node(megane.Viewport())
    pipe.add_edge(s.out.particle, v.inp.particle)

    viewer = megane.MolecularViewer()
    viewer.set_pipeline(pipe)

    assert viewer._pipeline_enabled is True
    assert len(viewer._node_snapshots_data) > 0


def test_pipeline_with_trajectory():
    """Pipeline API: LoadStructure + LoadTrajectory + Viewport provides frames."""
    pipe = megane.Pipeline()
    s = pipe.add_node(megane.LoadStructure(str(FIXTURES / "caffeine_water.pdb")))
    t = pipe.add_node(megane.LoadTrajectory(
        xtc=str(FIXTURES / "caffeine_water_vibration.xtc"),
    ))
    v = pipe.add_node(megane.Viewport())
    pipe.add_edge(s.out.particle, t.inp.particle)
    pipe.add_edge(s.out.particle, v.inp.particle)
    pipe.add_edge(t.out.traj, v.inp.traj)

    viewer = megane.MolecularViewer()
    viewer.set_pipeline(pipe)

    assert viewer.total_frames > 0
    assert viewer._pipeline_enabled is True
