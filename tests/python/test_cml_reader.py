"""Tests for the Chemical Markup Language (.cml) reader."""

from pathlib import Path

import pytest

from megane import megane_parser
from megane.parsers.cml import InMemoryTrajectory, load_cml

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_molecular_cml():
    """A 3D molecular CML loads with its explicit <bondArray> connectivity."""
    structure, trajectory = load_cml(str(FIXTURES / "ethanol.cml"))

    assert structure.n_atoms == 9
    assert structure.elements.tolist() == [6, 6, 8, 1, 1, 1, 1, 1, 1]
    # 8 explicit bonds, taken from the file rather than inferred.
    assert structure.bonds.shape == (8, 2)
    assert structure.positions[2] == pytest.approx([-1.1867, -0.2472, 0.0], abs=1e-4)

    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 1


def test_load_crystal_cml():
    """A crystal CML converts fractional coordinates with the <crystal> cell."""
    structure, _ = load_cml(str(FIXTURES / "si_diamond.cml"))

    assert structure.n_atoms == 8
    assert set(structure.elements.tolist()) == {14}

    box = structure.box.reshape(3, 3)
    assert box[0, 0] == pytest.approx(5.43, abs=1e-4)
    # Fractional (0.25, 0.25, 0.25) -> Cartesian 1.3575 A.
    assert structure.positions[4] == pytest.approx([1.3575, 1.3575, 1.3575], abs=1e-3)


def test_parse_cml_reads_bond_orders():
    text = (
        "<molecule><atomArray>"
        '<atom id="a1" elementType="C" x3="0" y3="0" z3="0"/>'
        '<atom id="a2" elementType="O" x3="1.2" y3="0" z3="0"/>'
        "</atomArray><bondArray>"
        '<bond atomRefs2="a1 a2" order="2"/>'
        "</bondArray></molecule>"
    )
    result = megane_parser.parse_cml(text)
    assert result.n_atoms == 2
    assert result.bond_orders.tolist() == [2]


def test_parse_cml_rejects_a_non_cml_document():
    with pytest.raises(ValueError):
        megane_parser.parse_cml("<html><body/></html>")
