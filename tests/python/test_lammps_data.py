"""Tests for LAMMPS data file parser."""

from __future__ import annotations

from pathlib import Path

import numpy as np

FIXTURES = Path(__file__).resolve().parent.parent / "fixtures"


def test_load_water_lammps():
    """load_lammps_data returns correct Structure for water.lammps fixture."""
    from megane.parsers.lammps_data import load_lammps_data

    path = str(FIXTURES / "water.lammps")
    struct = load_lammps_data(path)

    # water.lammps has 3 atoms (1 O + 2 H), 2 bonds
    assert struct.n_atoms == 3
    assert struct.positions.shape == (3, 3)
    assert struct.positions.dtype == np.float32
    assert struct.elements.shape == (3,)
    assert struct.elements.dtype == np.uint8

    # Bonds: 2 O-H bonds
    assert struct.bonds.shape == (2, 2)
    assert struct.bonds.dtype == np.uint32
    assert struct.bond_orders.shape == (2,)
    assert struct.bond_orders.dtype == np.uint8

    # Box should be 10x10x10
    assert struct.box.shape == (3, 3)
    assert struct.box.dtype == np.float32
    # Diagonal should be ~10.0
    np.testing.assert_allclose(np.diag(struct.box), [10.0, 10.0, 10.0], atol=0.01)


def test_water_lammps_elements():
    """Verify element atomic numbers: O=8, H=1."""
    from megane.parsers.lammps_data import load_lammps_data

    path = str(FIXTURES / "water.lammps")
    struct = load_lammps_data(path)

    elements = sorted(struct.elements.tolist())
    # Expect two hydrogens (1) and one oxygen (8)
    assert elements == [1, 1, 8]


def test_water_lammps_positions():
    """Verify positions are within the box bounds."""
    from megane.parsers.lammps_data import load_lammps_data

    path = str(FIXTURES / "water.lammps")
    struct = load_lammps_data(path)

    assert np.all(struct.positions >= 0.0)
    assert np.all(struct.positions <= 10.0)
