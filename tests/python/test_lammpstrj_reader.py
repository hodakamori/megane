"""Tests for LAMMPS dump trajectory (.lammpstrj) reader."""

from pathlib import Path

import numpy as np

from megane.parsers.lammpstrj import InMemoryTrajectory, load_lammpstrj

FIXTURES = Path(__file__).resolve().parent.parent / "fixtures"


def test_load_lammpstrj():
    """Test loading a .lammpstrj file returns InMemoryTrajectory."""
    trajectory = load_lammpstrj(str(FIXTURES / "water.lammpstrj"))

    assert trajectory.n_atoms == 3
    assert trajectory.n_frames == 3
    assert trajectory.timestep_ps == 100.0


def test_get_frame():
    """Test retrieving individual frames."""
    trajectory = load_lammpstrj(str(FIXTURES / "water.lammpstrj"))

    frame0 = trajectory.get_frame(0)
    assert frame0.shape == (3, 3)
    assert frame0.dtype == np.float32

    # Atom 1 at frame 0 should be at (5.0, 5.0, 5.0)
    np.testing.assert_allclose(frame0[0], [5.0, 5.0, 5.0], atol=1e-5)

    frame2 = trajectory.get_frame(2)
    # Atom 1 at frame 2 should be at (5.2, 5.2, 5.2)
    np.testing.assert_allclose(frame2[0], [5.2, 5.2, 5.2], atol=1e-5)


def test_box_matrix():
    """Test box matrix extraction."""
    trajectory = load_lammpstrj(str(FIXTURES / "water.lammpstrj"))

    expected = np.diag([10.0, 10.0, 10.0]).astype(np.float32)
    np.testing.assert_allclose(trajectory.box, expected, atol=1e-5)


def test_atom_ordering():
    """Test that atoms are sorted by id consistently."""
    trajectory = load_lammpstrj(str(FIXTURES / "water.lammpstrj"))

    frame0 = trajectory.get_frame(0)
    # Atom 1: (5.0, 5.0, 5.0), Atom 2: (5.757, 5.586, 5.0), Atom 3: (4.243, 5.586, 5.0)
    np.testing.assert_allclose(frame0[0], [5.0, 5.0, 5.0], atol=1e-3)
    np.testing.assert_allclose(frame0[1], [5.757, 5.586, 5.0], atol=1e-3)
    np.testing.assert_allclose(frame0[2], [4.243, 5.586, 5.0], atol=1e-3)
