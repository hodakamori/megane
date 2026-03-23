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
    assert trajectory.n_frames == 4
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
