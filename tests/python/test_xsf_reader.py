"""Tests for the XCrySDen (.xsf / .axsf) reader."""

from pathlib import Path

import numpy as np
import pytest

from megane import megane_parser
from megane.parsers.xsf import InMemoryTrajectory, load_xsf

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_crystal_xsf():
    """A CRYSTAL .xsf loads with its PRIMVEC cell and PRIMCOORD atoms."""
    structure, trajectory = load_xsf(str(FIXTURES / "si_diamond.xsf"))

    assert structure.n_atoms == 8
    assert structure.positions.shape == (8, 3)
    assert set(structure.elements.tolist()) == {14}  # Si

    box = structure.box.reshape(3, 3)
    assert box[0, 0] == pytest.approx(5.43, abs=1e-4)
    assert box[2, 2] == pytest.approx(5.43, abs=1e-4)

    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 1


def test_load_animated_axsf():
    """An ANIMSTEPS .axsf becomes a multi-frame structure."""
    structure, trajectory = load_xsf(str(FIXTURES / "water_relax.axsf"))

    assert structure.n_atoms == 3
    assert structure.elements.tolist() == [8, 1, 1]
    assert trajectory.n_frames == 3

    frame0 = trajectory.get_frame(0)
    frame2 = trajectory.get_frame(2)
    assert frame0.shape == (3, 3)
    assert not np.allclose(frame0, frame2, atol=1e-6)


def test_parse_xsf_reads_atomic_numbers_and_symbols():
    """The first column may be an atomic number or an element symbol."""
    by_number = megane_parser.parse_xsf("ATOMS\n 8 0.0 0.0 0.0\n 1 0.0 0.0 1.0\n")
    by_symbol = megane_parser.parse_xsf("ATOMS\n O 0.0 0.0 0.0\n H 0.0 0.0 1.0\n")
    assert by_number.elements.tolist() == [8, 1]
    assert by_symbol.elements.tolist() == [8, 1]


def test_parse_xsf_rejects_a_non_xsf_file():
    with pytest.raises(ValueError):
        megane_parser.parse_xsf("ATOM      1  N   MET A   1\n")
