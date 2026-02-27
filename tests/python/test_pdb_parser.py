"""Tests for PDB parser."""

from pathlib import Path

import numpy as np

from megane.parsers.pdb import load_pdb

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_1crn():
    """Test loading 1CRN (Crambin) PDB file."""
    s = load_pdb(str(FIXTURES / "1crn.pdb"))

    assert s.n_atoms == 327
    assert s.positions.shape == (327, 3)
    assert s.positions.dtype == np.float32
    assert s.elements.dtype == np.uint8

    # Crambin contains C, N, O, S
    unique_elements = set(s.elements.tolist())
    assert 6 in unique_elements  # Carbon
    assert 7 in unique_elements  # Nitrogen
    assert 8 in unique_elements  # Oxygen
    assert 16 in unique_elements  # Sulfur

    # Should have bonds from RDKit
    assert len(s.bonds) > 0
    assert s.bonds.dtype == np.uint32


def test_bond_indices_valid():
    """Test that bond indices are within valid range."""
    s = load_pdb(str(FIXTURES / "1crn.pdb"))

    for i in range(len(s.bonds)):
        assert s.bonds[i, 0] < s.n_atoms
        assert s.bonds[i, 1] < s.n_atoms
        assert s.bonds[i, 0] <= s.bonds[i, 1]  # sorted
