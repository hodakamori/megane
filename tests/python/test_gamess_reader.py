"""Tests for the GAMESS (US / Firefly) output reader."""

from pathlib import Path

import numpy as np
import pytest

from megane import megane_parser
from megane.parsers.gamess import InMemoryTrajectory, load_gamess

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_every_coordinate_block_becomes_a_frame():
    """A truncated optimisation log loads all three geometries as frames."""
    structure, trajectory = load_gamess(str(FIXTURES / "water_opt.gamess"))

    assert structure.n_atoms == 3
    assert structure.elements.tolist() == [8, 1, 1]
    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 3

    frame0 = trajectory.get_frame(0)
    frame2 = trajectory.get_frame(2)
    assert frame0[0][2] == pytest.approx(0.20, abs=1e-4)
    # The EQUILIBRIUM GEOMETRY LOCATED block is simply the last frame.
    assert frame2[0][2] == pytest.approx(0.1173, abs=1e-4)
    assert not np.allclose(frame0, frame2, atol=1e-6)


def test_trailing_tables_are_not_read_as_atoms():
    """The INTERNUCLEAR DISTANCES table after the last block must be ignored."""
    structure, _ = load_gamess(str(FIXTURES / "water_opt.gamess"))
    assert structure.n_atoms == 3


def test_bohr_banner_is_honoured():
    result = megane_parser.parse_gamess(
        " COORDINATES OF ALL ATOMS ARE (BOHR)\n"
        "   ATOM   CHARGE       X              Y              Z\n"
        " ------------------------------------------------------------\n"
        " H           1.0    0.0    0.0    0.0\n"
        " H           1.0    1.4    0.0    0.0\n"
    )
    assert result.positions[1][0] == pytest.approx(0.740848, abs=1e-4)


def test_rejects_a_file_with_no_coordinate_banner():
    with pytest.raises(ValueError, match="not a GAMESS output"):
        megane_parser.parse_gamess("some other program's output\n")
