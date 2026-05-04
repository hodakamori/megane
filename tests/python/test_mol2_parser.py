"""Tests for MOL2 (Tripos SYBYL) structure parser."""

from pathlib import Path

import numpy as np
import pytest

from megane.parsers.mol2 import load_mol2
from megane.parsers import load_mol2 as load_mol2_init

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_methanol_mol2():
    """Test loading methanol from a MOL2 file."""
    s = load_mol2(str(FIXTURES / "methanol.mol2"))

    assert s.n_atoms == 6
    assert s.positions.shape == (6, 3)
    assert s.positions.dtype == np.float32
    assert s.elements.dtype == np.uint8


def test_methanol_mol2_elements():
    """Methanol (CH3OH): 1 C, 1 O, 4 H."""
    s = load_mol2(str(FIXTURES / "methanol.mol2"))

    elements = s.elements.tolist()
    assert elements.count(6) == 1   # carbon
    assert elements.count(8) == 1   # oxygen
    assert elements.count(1) == 4   # hydrogen


def test_methanol_mol2_bonds():
    """Methanol has 5 bonds."""
    s = load_mol2(str(FIXTURES / "methanol.mol2"))

    assert len(s.bonds) == 5
    assert s.bonds.dtype == np.uint32
    assert s.bond_orders.dtype == np.uint8
    assert len(s.bond_orders) == len(s.bonds)


def test_methanol_mol2_bond_indices_valid():
    """All bond indices must be within atom range."""
    s = load_mol2(str(FIXTURES / "methanol.mol2"))

    assert s.bonds.max() < s.n_atoms


def test_mol2_no_box():
    """Small-molecule MOL2 files have no periodic box."""
    s = load_mol2(str(FIXTURES / "methanol.mol2"))

    assert s.box.shape == (3, 3)
    assert s.box.dtype == np.float32
    assert np.all(s.box == 0)


def test_load_mol2_exported_from_parsers():
    """load_mol2 must be importable from megane.parsers."""
    s = load_mol2_init(str(FIXTURES / "methanol.mol2"))
    assert s.n_atoms == 6


def test_load_mol2_missing_file():
    """load_mol2 raises an error for a non-existent file."""
    with pytest.raises((FileNotFoundError, OSError)):
        load_mol2("/nonexistent/missing.mol2")
