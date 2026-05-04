"""Tests for the high-level AMBER NetCDF trajectory reader (load_netcdf)."""

from pathlib import Path

import numpy as np
import pytest

from megane.parsers.netcdf import load_netcdf
from megane.parsers import load_netcdf as load_netcdf_toplevel

FIXTURES = Path(__file__).resolve().parent.parent / "fixtures"


def test_load_netcdf_returns_in_memory_trajectory():
    traj = load_netcdf(str(FIXTURES / "water.nc"))
    assert traj.n_atoms == 3
    assert traj.n_frames == 5


def test_load_netcdf_exported_from_parsers():
    """load_netcdf is accessible from megane.parsers."""
    traj = load_netcdf_toplevel(str(FIXTURES / "water.nc"))
    assert traj.n_frames == 5


def test_load_netcdf_frame_shape():
    traj = load_netcdf(str(FIXTURES / "water.nc"))
    frame = traj.get_frame(0)
    assert frame.shape == (3, 3)
    assert frame.dtype == np.float32


def test_load_netcdf_timestep():
    traj = load_netcdf(str(FIXTURES / "water.nc"))
    assert traj.timestep_ps >= 0


def test_load_netcdf_box_matrix():
    traj = load_netcdf(str(FIXTURES / "water.nc"))
    assert traj.box.shape == (3, 3)
    np.testing.assert_allclose(traj.box[0, 0], 10.0, atol=1e-2)
    np.testing.assert_allclose(traj.box[1, 1], 10.0, atol=1e-2)
    np.testing.assert_allclose(traj.box[2, 2], 10.0, atol=1e-2)


def test_load_netcdf_frames_differ():
    traj = load_netcdf(str(FIXTURES / "water.nc"))
    frame0 = traj.get_frame(0)
    frame4 = traj.get_frame(4)
    assert not np.allclose(frame0, frame4, atol=1e-3)


def test_load_netcdf_get_frame_out_of_range():
    traj = load_netcdf(str(FIXTURES / "water.nc"))
    with pytest.raises(ValueError):
        traj.get_frame(100)


def test_load_netcdf_missing_file():
    with pytest.raises((FileNotFoundError, OSError)):
        load_netcdf("/nonexistent/path/traj.nc")
