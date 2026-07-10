"""Tests for ASE .traj file reader."""

from pathlib import Path

import numpy as np

from megane.parsers.traj import InMemoryTrajectory, load_traj

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_traj():
    """Test loading a .traj file returns Structure and Trajectory."""
    structure, trajectory = load_traj(str(FIXTURES / "water.traj"))

    assert structure.n_atoms == 3
    assert structure.positions.shape == (3, 3)
    assert structure.positions.dtype == np.float32
    assert structure.elements.shape == (3,)
    assert set(structure.elements.tolist()) == {1, 8}  # H=1, O=8

    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 5
    assert trajectory.n_atoms == 3


def test_get_frame():
    """Test retrieving individual frames from InMemoryTrajectory."""
    _, trajectory = load_traj(str(FIXTURES / "water.traj"))

    frame0 = trajectory.get_frame(0)
    assert frame0.shape == (3, 3)
    assert frame0.dtype == np.float32

    frame1 = trajectory.get_frame(1)
    assert frame1.shape == (3, 3)
    # Frames should differ
    assert not np.allclose(frame0, frame1, atol=1e-6)


def test_view_traj_single_path_traj():
    """view_traj("file.traj") auto-detects an ASE .traj as both structure and trajectory."""
    import megane

    _, trajectory = load_traj(str(FIXTURES / "water.traj"))
    viewer = megane.view_traj(str(FIXTURES / "water.traj"))
    assert viewer.total_frames == trajectory.n_frames


def test_uniform_traj_stays_on_fast_path():
    """A uniform trajectory must not be flagged heterogeneous (fast path)."""
    _, trajectory = load_traj(str(FIXTURES / "water.traj"))
    assert trajectory.heterogeneous is False
    # Rectangular ndarray path retained.
    assert trajectory._frames.shape == (5, 3, 3)


def test_load_traj_variable_cell():
    """Constant atoms/topology, changing cell → per-frame cells exposed."""
    structure, trajectory = load_traj(str(FIXTURES / "water_var_cell.traj"))
    assert structure.n_atoms == 3
    assert trajectory.heterogeneous is True
    assert trajectory.n_frames == 5
    # Every frame has 3 atoms; topology constant → no per-frame elements.
    assert all(trajectory.n_atoms_at(i) == 3 for i in range(5))
    assert trajectory.get_elements(0) is None
    # Cell expands: diagonal of last frame > first.
    c0 = trajectory.get_cell(0)
    c_last = trajectory.get_cell(4)
    assert c0.shape == (3, 3)
    assert c_last[0, 0] > c0[0, 0]


def test_load_traj_variable_atoms():
    """Growing atom count → jagged frames with per-frame element counts."""
    structure, trajectory = load_traj(str(FIXTURES / "water_var_atoms.traj"))
    assert structure.n_atoms == 3
    assert trajectory.heterogeneous is True
    assert trajectory.max_atoms == 15
    counts = [trajectory.n_atoms_at(i) for i in range(trajectory.n_frames)]
    assert counts == [3, 6, 9, 12, 15]
    # get_frame returns per-frame shapes.
    assert trajectory.get_frame(4).shape == (15, 3)
    # Per-frame elements present and correctly sized.
    assert trajectory.get_elements(4).shape == (15,)


def test_load_traj_variable_topology():
    """Constant count, changing elements → per-frame elements differ."""
    _, trajectory = load_traj(str(FIXTURES / "water_var_topology.traj"))
    assert trajectory.heterogeneous is True
    assert all(trajectory.n_atoms_at(i) == 3 for i in range(5))
    e0 = trajectory.get_elements(0)
    e1 = trajectory.get_elements(1)
    assert e0 is not None and e1 is not None
    # Frame 0 is OH2 (contains O=8); frame 1 is OHF (contains F=9).
    assert 9 in e1.tolist()
