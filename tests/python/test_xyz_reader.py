"""Tests for multi-frame XYZ trajectory reader."""

from pathlib import Path

import numpy as np

from megane.parsers.xyz import InMemoryTrajectory, load_xyz_trajectory

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_xyz_trajectory():
    """Test loading a multi-frame XYZ file returns Structure and Trajectory."""
    structure, trajectory = load_xyz_trajectory(str(FIXTURES / "water_multiframe.xyz"))

    assert structure.n_atoms == 3
    assert structure.positions.shape == (3, 3)
    assert structure.positions.dtype == np.float32
    assert structure.elements.shape == (3,)
    assert set(structure.elements.tolist()) == {1, 8}  # H=1, O=8

    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 3
    assert trajectory.n_atoms == 3


def test_get_frame():
    """Test retrieving individual frames from InMemoryTrajectory."""
    _, trajectory = load_xyz_trajectory(str(FIXTURES / "water_multiframe.xyz"))

    frame0 = trajectory.get_frame(0)
    assert frame0.shape == (3, 3)
    assert frame0.dtype == np.float32

    frame1 = trajectory.get_frame(1)
    assert frame1.shape == (3, 3)
    # Frames should differ
    assert not np.allclose(frame0, frame1, atol=1e-6)


def test_single_frame_xyz():
    """Single-frame XYZ should surface as a 1-frame trajectory matching positions."""
    structure, trajectory = load_xyz_trajectory(str(FIXTURES / "si_diamond.xyz"))

    assert trajectory.n_frames == 1
    assert trajectory.n_atoms == structure.n_atoms
    np.testing.assert_allclose(trajectory.get_frame(0), structure.positions, atol=1e-6)


def test_view_traj_single_path_xyz():
    """view_traj("file.xyz") auto-detects a multi-frame XYZ trajectory."""
    import megane

    viewer = megane.view_traj(str(FIXTURES / "water_multiframe.xyz"))
    assert viewer.total_frames == 3
