"""Tests for the Chem3D XML (.c3xml) reader."""

from pathlib import Path

import pytest

from megane import megane_parser
from megane.parsers.c3xml import InMemoryTrajectory, load_c3xml

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_3d_molecule_with_explicit_bonds():
    structure, trajectory = load_c3xml(str(FIXTURES / "methoxymethylamine.c3xml"))

    assert structure.n_atoms == 11
    # C, O, C, N then seven hydrogens.
    assert structure.elements.tolist()[:4] == [6, 8, 6, 7]
    # All ten bonds come from the <b> elements, none inferred.
    assert structure.bonds.shape == (10, 2)
    assert structure.positions[1] == pytest.approx([1.43, 0.0, 0.0], abs=1e-4)

    assert isinstance(trajectory, InMemoryTrajectory)
    assert trajectory.n_frames == 1


def test_2d_drawing_is_projected_without_inventing_bonds():
    """`p="x y"` has no third dimension; projected distances are meaningless."""
    result = megane_parser.parse_c3xml(
        '<CDXML><fragment><n id="1" p="0 0"/><n id="2" p="30 0"/></fragment></CDXML>'
    )
    assert result.n_atoms == 2
    assert result.positions[0][2] == 0.0
    assert result.bonds.shape[0] == 0


def test_rejects_a_document_with_no_cdxml_root():
    with pytest.raises(ValueError, match="not a Chem3D XML"):
        megane_parser.parse_c3xml("<html><body/></html>")
