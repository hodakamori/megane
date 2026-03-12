"""Tests for ASE .traj file reader."""

import tempfile
from pathlib import Path

import numpy as np
import pytest

ase = pytest.importorskip("ase")

from ase import Atoms
from ase.io.trajectory import Trajectory as AseTraj

from megane.parsers.traj import InMemoryTrajectory, load_traj


def _make_water_traj(path: str, n_frames: int = 5) -> None:
    """Create a small .traj file with a water molecule vibrating."""
    base_positions = np.array([
        [0.0, 0.0, 0.0],     # O
        [0.96, 0.0, 0.0],    # H
        [-0.24, 0.93, 0.0],  # H
    ])
    with AseTraj(path, "w") as traj_writer:
        for i in range(n_frames):
            noise = np.random.default_rng(seed=i).normal(0, 0.05, (3, 3))
            atoms = Atoms("OHH", positions=base_positions + noise)
            traj_writer.write(atoms)


def test_load_traj():
    """Test loading a .traj file returns Structure and Trajectory."""
    with tempfile.TemporaryDirectory() as tmpdir:
        traj_path = str(Path(tmpdir) / "water.traj")
        _make_water_traj(traj_path, n_frames=5)

        structure, trajectory = load_traj(traj_path)

    assert structure.n_atoms == 3
    assert structure.positions.shape == (3, 3)
    assert structure.positions.dtype == np.float32
    assert structure.elements.shape == (3,)
    assert set(structure.elements.tolist()) == {1, 8}  # H=1, O=8

    assert trajectory.n_frames == 5
    assert trajectory.n_atoms == 3


def test_get_frame():
    """Test retrieving individual frames from InMemoryTrajectory."""
    with tempfile.TemporaryDirectory() as tmpdir:
        traj_path = str(Path(tmpdir) / "water.traj")
        _make_water_traj(traj_path, n_frames=10)

        _, trajectory = load_traj(traj_path)

    frame0 = trajectory.get_frame(0)
    assert frame0.shape == (3, 3)
    assert frame0.dtype == np.float32

    frame5 = trajectory.get_frame(5)
    assert frame5.shape == (3, 3)

    # Frames should differ (random noise)
    assert not np.allclose(frame0, frame5, atol=1e-6)


def test_single_frame_traj():
    """Test loading a .traj with only one frame."""
    with tempfile.TemporaryDirectory() as tmpdir:
        traj_path = str(Path(tmpdir) / "single.traj")
        _make_water_traj(traj_path, n_frames=1)

        structure, trajectory = load_traj(traj_path)

    assert structure.n_atoms == 3
    assert trajectory.n_frames == 1
    assert trajectory.get_frame(0).shape == (3, 3)
