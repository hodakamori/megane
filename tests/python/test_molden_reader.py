"""Tests for the Molden (.molden) reader."""

from pathlib import Path

import numpy as np
import pytest

from megane import megane_parser
from megane.parsers.molden import InMemoryTrajectory, load_molden

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_atoms_block_in_atomic_units():
    """`[Atoms] (AU)` coordinates are converted to Angstrom."""
    structure, trajectory = load_molden(str(FIXTURES / "water.molden"))

    assert structure.n_atoms == 3
    assert structure.elements.tolist() == [8, 1, 1]
    # 0.2216886 Bohr -> 0.11730 A.
    assert structure.positions[0][2] == pytest.approx(0.11730, abs=1e-4)
    # 1.4309442 Bohr -> 0.75720 A.
    assert structure.positions[1][1] == pytest.approx(0.75720, abs=1e-4)

    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 1
    # Distance-inferred O-H bonds.
    assert structure.bonds.shape == (2, 2)


def test_load_geometries_block_as_multi_frame():
    """`[GEOMETRIES] XYZ` becomes an optimisation trajectory."""
    structure, trajectory = load_molden(str(FIXTURES / "water_opt.molden"))

    assert structure.n_atoms == 3
    assert trajectory.n_frames == 3

    frame0 = trajectory.get_frame(0)
    frame2 = trajectory.get_frame(2)
    assert frame0[0][2] == pytest.approx(0.20, abs=1e-4)
    assert frame2[0][2] == pytest.approx(0.1173, abs=1e-4)
    assert not np.allclose(frame0, frame2, atol=1e-6)


def test_parse_molden_skips_unknown_sections():
    """[GTO]/[MO] and vendor blocks must not be read as atoms."""
    result = megane_parser.parse_molden(
        "[Molden Format]\n"
        "[Atoms] (Angs)\n"
        " C 1 6 0.0 0.0 0.0\n"
        "[SOME-VENDOR-BLOCK]\n"
        " 1 2 3 4 5 6\n"
    )
    assert result.n_atoms == 1


def test_parse_molden_rejects_a_non_molden_file():
    with pytest.raises(ValueError):
        megane_parser.parse_molden("ATOM      1  N   MET A   1\n")
