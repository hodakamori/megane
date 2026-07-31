"""Tests for the CASTEP .phonon reader (structure half)."""

from pathlib import Path

import pytest

from megane import megane_parser
from megane.parsers.phonon import InMemoryTrajectory, load_phonon

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_header_becomes_a_periodic_structure():
    structure, trajectory = load_phonon(str(FIXTURES / "si_gamma.phonon"))

    assert structure.n_atoms == 2
    assert structure.elements.tolist() == [14, 14]

    box = structure.box.reshape(3, 3)
    assert box[0][1] == pytest.approx(2.715, abs=1e-4)
    # Fractional (0.25, 0.25, 0.25) with this cell -> 1.3575 A on each axis.
    assert structure.positions[1] == pytest.approx([1.3575, 1.3575, 1.3575], abs=1e-3)

    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 1


def test_frequency_and_eigenvector_blocks_are_not_read_as_atoms():
    """The q-point tables after END header must not inflate the atom count."""
    structure, _ = load_phonon(str(FIXTURES / "si_gamma.phonon"))
    assert structure.n_atoms == 2


def test_rejects_a_file_with_no_header():
    with pytest.raises(ValueError, match="not a CASTEP"):
        megane_parser.parse_phonon("just some text\n")
