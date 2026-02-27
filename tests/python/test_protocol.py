"""Tests for binary protocol."""

import struct
from pathlib import Path

import numpy as np

from megane.parsers.pdb import load_pdb
from megane.protocol import (
    MAGIC,
    MSG_SNAPSHOT,
    HAS_BOND_ORDERS,
    HAS_BOX,
    encode_snapshot,
)

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_encode_snapshot_header():
    """Test that snapshot starts with correct magic and message type."""
    s = load_pdb(str(FIXTURES / "1crn.pdb"))
    data = encode_snapshot(s)

    assert data[:4] == MAGIC
    msg_type = struct.unpack("<B", data[4:5])[0]
    assert msg_type == MSG_SNAPSHOT


def test_encode_snapshot_flags():
    """Test that flags are set for bond orders and box."""
    s = load_pdb(str(FIXTURES / "1crn.pdb"))
    data = encode_snapshot(s)

    flags = struct.unpack("<B", data[5:6])[0]

    # Should have bond orders
    if len(s.bond_orders) > 0:
        assert flags & HAS_BOND_ORDERS

    # Should have box if CRYST1 was parsed
    if np.any(s.box != 0):
        assert flags & HAS_BOX


def test_encode_snapshot_atom_count():
    """Test that encoded snapshot contains correct atom count."""
    s = load_pdb(str(FIXTURES / "1crn.pdb"))
    data = encode_snapshot(s)

    n_atoms = struct.unpack("<I", data[8:12])[0]
    assert n_atoms == 327


def test_encode_decode_roundtrip():
    """Test that positions survive encode/decode roundtrip."""
    s = load_pdb(str(FIXTURES / "1crn.pdb"))
    data = encode_snapshot(s)

    # Parse manually
    offset = 8  # skip header
    n_atoms = struct.unpack("<I", data[offset : offset + 4])[0]
    offset += 4
    n_bonds = struct.unpack("<I", data[offset : offset + 4])[0]
    offset += 4

    positions = np.frombuffer(data[offset : offset + n_atoms * 12], dtype=np.float32)
    positions = positions.reshape(n_atoms, 3)
    offset += n_atoms * 12

    elements = np.frombuffer(data[offset : offset + n_atoms], dtype=np.uint8)
    offset += n_atoms
    offset += (4 - (offset % 4)) % 4  # alignment

    np.testing.assert_array_almost_equal(positions, s.positions, decimal=5)
    np.testing.assert_array_equal(elements, s.elements)

    # Bonds
    bonds = np.frombuffer(data[offset : offset + n_bonds * 8], dtype=np.uint32)
    bonds = bonds.reshape(n_bonds, 2)
    offset += n_bonds * 8
    np.testing.assert_array_equal(bonds, s.bonds)

    # Bond orders (if present)
    flags = struct.unpack("<B", data[5:6])[0]
    if flags & HAS_BOND_ORDERS:
        bond_orders = np.frombuffer(data[offset : offset + n_bonds], dtype=np.uint8)
        offset += n_bonds
        offset += (4 - (offset % 4)) % 4
        np.testing.assert_array_equal(bond_orders, s.bond_orders)

    # Box (if present)
    if flags & HAS_BOX:
        box = np.frombuffer(data[offset : offset + 36], dtype=np.float32).reshape(3, 3)
        np.testing.assert_array_almost_equal(box, s.box, decimal=5)
