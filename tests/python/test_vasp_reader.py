"""Tests for the VASP POSCAR / CONTCAR / XDATCAR reader."""

from pathlib import Path

import numpy as np
import pytest

from megane import megane_parser
from megane.parsers.vasp import InMemoryTrajectory, load_vasp

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_poscar():
    """A POSCAR loads as an 8-atom silicon cell with a 1-frame trajectory."""
    structure, trajectory = load_vasp(str(FIXTURES / "POSCAR_si_diamond"))

    assert structure.n_atoms == 8
    assert structure.positions.shape == (8, 3)
    assert structure.positions.dtype == np.float32
    assert set(structure.elements.tolist()) == {14}  # Si

    # 5.43 Å cubic cell.
    box = structure.box.reshape(3, 3)
    assert box[0, 0] == pytest.approx(5.43, abs=1e-4)
    assert box[1, 1] == pytest.approx(5.43, abs=1e-4)
    assert box[2, 2] == pytest.approx(5.43, abs=1e-4)

    # Fractional (0.25, 0.25, 0.25) → Cartesian 1.3575 Å along each axis.
    assert structure.positions[4] == pytest.approx([1.3575, 1.3575, 1.3575], abs=1e-3)

    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 1
    assert trajectory.n_atoms == 8


def test_load_xdatcar_multi_frame():
    """An XDATCAR loads every ``Direct configuration=`` block as a frame."""
    structure, trajectory = load_vasp(str(FIXTURES / "XDATCAR_si_md"))

    assert structure.n_atoms == 8
    assert trajectory.n_frames == 3

    frame0 = trajectory.get_frame(0)
    frame2 = trajectory.get_frame(2)
    assert frame0.shape == (8, 3)
    assert not np.allclose(frame0, frame2, atol=1e-6)


def test_selective_dynamics_flags_are_ignored():
    """`Selective dynamics` + T/F columns parse without error."""
    structure, _ = load_vasp(str(FIXTURES / "POSCAR_si_diamond"))
    assert structure.n_atoms == 8


def test_parse_vasp_cartesian_mode():
    """Cartesian coordinates are scaled by the universal scaling factor."""
    text = (
        "NaCl\n"
        "   2.0\n"
        "     5.0 0.0 0.0\n"
        "     0.0 5.0 0.0\n"
        "     0.0 0.0 5.0\n"
        "   Na Cl\n"
        "    1 1\n"
        "Cartesian\n"
        "  0.0 0.0 0.0\n"
        "  1.0 0.0 0.0\n"
    )
    result = megane_parser.parse_vasp(text)
    assert result.n_atoms == 2
    assert result.elements.tolist() == [11, 17]
    assert result.positions[1][0] == pytest.approx(2.0, abs=1e-4)


def test_parse_vasp_rejects_garbage():
    with pytest.raises(ValueError):
        megane_parser.parse_vasp("not a vasp file")
