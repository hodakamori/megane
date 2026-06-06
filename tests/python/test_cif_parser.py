"""Tests for CIF file parser."""

from pathlib import Path

import numpy as np

from megane.parsers.cif import load_cif

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_nacl_cif():
    """Test loading a NaCl CIF file."""
    s = load_cif(str(FIXTURES / "nacl.cif"))

    assert s.n_atoms > 0
    assert s.positions.shape == (s.n_atoms, 3)
    assert s.positions.dtype == np.float32
    assert s.elements.shape == (s.n_atoms,)
    assert s.elements.dtype == np.uint8

    # NaCl has Na (11) and Cl (17)
    assert 11 in s.elements
    assert 17 in s.elements

    # Should have a unit cell
    assert np.any(s.box != 0)
    assert s.box.shape == (3, 3)


def test_load_glycine_csd_cif():
    """Regression for Issue #458: CCDC-style CIF with a blank line between the
    atom_site loop header and the first data row must load successfully."""
    s = load_cif(str(FIXTURES / "glycine_csd.cif"))

    assert s.n_atoms == 10
    # Glycine zwitterion: 2 O, 2 C, 1 N, 5 H
    assert int(np.sum(s.elements == 8)) == 2
    assert int(np.sum(s.elements == 6)) == 2
    assert int(np.sum(s.elements == 7)) == 1
    assert int(np.sum(s.elements == 1)) == 5

    assert s.positions.shape == (10, 3)
    assert s.positions.dtype == np.float32
    # Fractional coords were converted to Cartesian via the cell matrix
    assert np.any(s.positions != 0)
    assert s.box.shape == (3, 3)
    assert np.any(s.box != 0)


def test_cif_captures_symmetry_ops():
    """CCDC CIFs carry a `_symmetry_equiv_pos_as_xyz` loop; the parser surfaces
    the operations (still returning only the asymmetric unit)."""
    s = load_cif(str(FIXTURES / "glycine_csd.cif"))
    assert len(s.symmetry_ops) == 4
    # Identity is always the first operation.
    assert s.symmetry_ops[0].replace(" ", "") == "x,y,z"
    # Inversion is present for this centrosymmetric space group.
    assert any(op.replace(" ", "") == "-x,-y,-z" for op in s.symmetry_ops)


def test_cif_without_symmetry_has_empty_ops():
    """A CIF lacking a symmetry loop yields an empty operation list."""
    s = load_cif(str(FIXTURES / "nacl.cif"))
    assert s.symmetry_ops == []


def test_delta_glycine_issue_460():
    """Issue #460: the delta-glycine (P2_1/a) CIF loads its asymmetric unit
    (one glycine molecule) and carries the four space-group operations that the
    Supercell node expands to pack the cell."""
    s = load_cif(str(FIXTURES / "delta_glycine.cif"))
    assert s.n_atoms == 10  # one glycine zwitterion (asymmetric unit)
    assert len(s.symmetry_ops) == 4  # P2_1/a: 4 equivalent positions
    normalized = {op.replace(" ", "") for op in s.symmetry_ops}
    assert "x,y,z" in normalized
    assert "-x+1/2,y+1/2,-z" in normalized
