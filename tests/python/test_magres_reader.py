"""Tests for the CASTEP NMR magres reader."""

from pathlib import Path

import pytest

from megane import megane_parser
from megane.parsers.magres import InMemoryTrajectory, load_magres

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_atoms_block_with_lattice():
    """The [atoms] block yields a periodic structure; [magres] is ignored."""
    structure, trajectory = load_magres(str(FIXTURES / "si_nmr.magres"))

    assert structure.n_atoms == 8
    assert set(structure.elements.tolist()) == {14}

    box = structure.box.reshape(3, 3)
    assert box[0, 0] == pytest.approx(5.43, abs=1e-4)
    assert structure.positions[4] == pytest.approx([1.3575, 1.3575, 1.3575], abs=1e-3)

    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 1


def test_per_block_units_are_honoured():
    """`units atom bohr` converts, independently of the lattice units."""
    result = megane_parser.parse_magres(
        "#$magres-abinitio-v1.0\n"
        "[atoms]\n"
        "  units lattice Angstrom\n"
        "  lattice 10.0 0.0 0.0  0.0 10.0 0.0  0.0 0.0 10.0\n"
        "  units atom bohr\n"
        "  atom H H 1  1.0 0.0 0.0\n"
        "[/atoms]\n"
    )
    assert result.box_matrix[0][0] == pytest.approx(10.0, abs=1e-4)
    assert result.positions[0][0] == pytest.approx(0.529177, abs=1e-5)


def test_old_style_magres_is_rejected_with_a_clear_message():
    with pytest.raises(ValueError, match="Old-style"):
        megane_parser.parse_magres("= chemical shielding tensor =\nSi 1\n 100.0 0.0 0.0\n")
