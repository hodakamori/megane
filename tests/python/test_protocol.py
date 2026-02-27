"""Tests for binary protocol."""

import struct
from pathlib import Path

import numpy as np

from megane.parsers.pdb import load_pdb
from megane.protocol import MAGIC, MSG_SNAPSHOT, encode_snapshot

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_encode_snapshot_header():
    """Test that snapshot starts with correct magic and message type."""
    s = load_pdb(str(FIXTURES / "1crn.pdb"))
    data = encode_snapshot(s)

    assert data[:4] == MAGIC
    msg_type = struct.unpack("<B", data[4:5])[0]
    assert msg_type == MSG_SNAPSHOT


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

    np.testing.assert_array_almost_equal(positions, s.positions, decimal=5)
    np.testing.assert_array_equal(elements, s.elements)
