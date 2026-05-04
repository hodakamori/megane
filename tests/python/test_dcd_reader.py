"""Tests for the high-level DCD trajectory reader (load_dcd)."""

from pathlib import Path

import numpy as np
import pytest

from megane.parsers.dcd import load_dcd
from megane.parsers import load_dcd as load_dcd_toplevel

FIXTURES = Path(__file__).resolve().parent.parent / "fixtures"


def test_load_dcd_returns_in_memory_trajectory():
    traj = load_dcd(str(FIXTURES / "water.dcd"))
    assert traj.n_atoms == 3
    assert traj.n_frames == 5


def test_load_dcd_exported_from_parsers():
    """load_dcd is accessible from megane.parsers."""
    traj = load_dcd_toplevel(str(FIXTURES / "water.dcd"))
    assert traj.n_frames == 5


def test_load_dcd_frame_shape():
    traj = load_dcd(str(FIXTURES / "water.dcd"))
    frame = traj.get_frame(0)
    assert frame.shape == (3, 3)
    assert frame.dtype == np.float32


def test_load_dcd_timestep_positive():
    traj = load_dcd(str(FIXTURES / "water.dcd"))
    assert traj.timestep_ps > 0


def test_load_dcd_box_matrix():
    traj = load_dcd(str(FIXTURES / "water.dcd"))
    assert traj.box.shape == (3, 3)
    np.testing.assert_allclose(traj.box[0, 0], 10.0, atol=1e-2)
    np.testing.assert_allclose(traj.box[1, 1], 10.0, atol=1e-2)
    np.testing.assert_allclose(traj.box[2, 2], 10.0, atol=1e-2)


def test_load_dcd_frames_differ():
    traj = load_dcd(str(FIXTURES / "water.dcd"))
    frame0 = traj.get_frame(0)
    frame1 = traj.get_frame(1)
    assert not np.allclose(frame0, frame1, atol=1e-3)


def test_load_dcd_get_frame_out_of_range():
    traj = load_dcd(str(FIXTURES / "water.dcd"))
    with pytest.raises(ValueError):
        traj.get_frame(100)


def test_load_dcd_missing_file():
    with pytest.raises((FileNotFoundError, OSError)):
        load_dcd("/nonexistent/path/traj.dcd")
