"""Tests for XTC trajectory reader."""

from pathlib import Path

import numpy as np

from megane.parsers.xtc import load_trajectory

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_trajectory():
    """Test loading XTC trajectory."""
    traj = load_trajectory(
        str(FIXTURES / "1crn.pdb"),
        str(FIXTURES / "1crn_vibration.xtc"),
    )

    assert traj.n_frames == 100
    assert traj.n_atoms == 327


def test_get_frame():
    """Test retrieving individual frames."""
    traj = load_trajectory(
        str(FIXTURES / "1crn.pdb"),
        str(FIXTURES / "1crn_vibration.xtc"),
    )

    frame0 = traj.get_frame(0)
    assert frame0.shape == (327, 3)
    assert frame0.dtype == np.float32

    frame50 = traj.get_frame(50)
    assert frame50.shape == (327, 3)

    # Frames should differ (vibration)
    assert not np.allclose(frame0, frame50, atol=0.01)
