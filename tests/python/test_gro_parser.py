"""Tests for GROMACS GRO structure parser."""

from pathlib import Path

import numpy as np
import pytest

from megane.parsers.gro import load_gro
from megane.parsers import load_gro as load_gro_from_init

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_water_gro():
    """Test loading a GROMACS GRO file (water box with 3 molecules)."""
    s = load_gro(str(FIXTURES / "water.gro"))

    assert s.n_atoms == 9
    assert s.positions.shape == (9, 3)
    assert s.positions.dtype == np.float32
    assert s.elements.shape == (9,)
    assert s.elements.dtype == np.uint8


def test_water_gro_elements():
    """Water box should have 3 O and 6 H atoms."""
    s = load_gro(str(FIXTURES / "water.gro"))

    elements = s.elements.tolist()
    assert elements.count(8) == 3   # 3 oxygen atoms
    assert elements.count(1) == 6   # 6 hydrogen atoms


def test_water_gro_box():
    """GRO files always carry a box; water.gro has a cubic 1.2 nm box."""
    s = load_gro(str(FIXTURES / "water.gro"))

    assert s.box.shape == (3, 3)
    assert s.box.dtype == np.float32
    # GRO stores lengths in nm; the Rust parser converts to Angstroms (×10)
    assert np.any(s.box != 0)
    # Diagonal elements should be ~12 Å (1.2 nm × 10)
    assert abs(s.box[0, 0] - 12.0) < 0.1
    assert abs(s.box[1, 1] - 12.0) < 0.1
    assert abs(s.box[2, 2] - 12.0) < 0.1


def test_water_gro_bonds():
    """Bond arrays are present and consistent."""
    s = load_gro(str(FIXTURES / "water.gro"))

    assert s.bonds.dtype == np.uint32
    assert s.bond_orders.dtype == np.uint8
    assert len(s.bonds) == len(s.bond_orders)
    # All bond indices must be in range
    if len(s.bonds) > 0:
        assert s.bonds.max() < s.n_atoms


def test_load_gro_exported_from_parsers():
    """load_gro must be importable from megane.parsers."""
    s = load_gro_from_init(str(FIXTURES / "water.gro"))
    assert s.n_atoms == 9


def test_load_gro_missing_file():
    """load_gro raises an error for a non-existent file."""
    with pytest.raises((FileNotFoundError, OSError)):
        load_gro("/nonexistent/path/missing.gro")
