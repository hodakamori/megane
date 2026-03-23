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
