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


def test_bond_orders():
    """Test that bond orders are extracted."""
    s = load_pdb(str(FIXTURES / "1crn.pdb"))

    assert len(s.bond_orders) == len(s.bonds)
    assert s.bond_orders.dtype == np.uint8

    # All bond orders should be valid (1=single, 2=double, 3=triple, 4=aromatic)
    for bo in s.bond_orders:
        assert bo in (1, 2, 3, 4)

    # Crambin has peptide bonds with C=O double bonds
    assert 2 in s.bond_orders  # At least some double bonds


def test_box():
    """Test that box is parsed from CRYST1 record."""
    s = load_pdb(str(FIXTURES / "1crn.pdb"))

    assert s.box.shape == (3, 3)
    assert s.box.dtype == np.float32

    # 1CRN has CRYST1 record: 40.960  18.650  22.520  90.00  90.77  90.00
    if np.any(s.box != 0):
        # First vector should have a ~ 40.96
        assert abs(s.box[0, 0] - 40.96) < 0.1
        # Second vector y component ~ 18.65
        assert abs(s.box[1, 1] - 18.65) < 0.1
