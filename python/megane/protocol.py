"""Binary protocol for Python -> JavaScript data transfer.

Protocol format:
  Header (12 bytes):
    magic:    4 bytes "MEGN"
    msg_type: u8 (0=snapshot, 1=frame, 2=metadata)
    flags:    u8
    reserved: 2 bytes

  Snapshot payload:
    n_atoms:    u32
    n_bonds:    u32
    positions:  Float32[n_atoms * 3]
    elements:   Uint8[n_atoms]
    padding:    align to 4 bytes
    bonds:      Uint32[n_bonds * 2]

  Frame payload:
    frame_id:   u32
    n_atoms:    u32
    positions:  Float32[n_atoms * 3]
"""

from __future__ import annotations

import struct

import numpy as np

from megane.parsers.pdb import Structure

MAGIC = b"MEGN"
MSG_SNAPSHOT = 0
MSG_FRAME = 1
MSG_METADATA = 2


def encode_snapshot(structure: Structure) -> bytes:
    """Encode a molecular structure as a binary snapshot message."""
    n_atoms = structure.n_atoms
    n_bonds = len(structure.bonds)

    # Header: magic(4) + msg_type(1) + flags(1) + reserved(2) = 8 bytes
    header = MAGIC + struct.pack("<BBH", MSG_SNAPSHOT, 0, 0)

    # Snapshot header: n_atoms(4) + n_bonds(4) = 8 bytes
    snapshot_header = struct.pack("<II", n_atoms, n_bonds)

    # Positions: float32 * n_atoms * 3
    pos_bytes = structure.positions.astype(np.float32).tobytes()

    # Elements: uint8 * n_atoms, padded to 4-byte alignment
    elem_bytes = structure.elements.astype(np.uint8).tobytes()
    padding_len = (4 - (len(elem_bytes) % 4)) % 4
    elem_bytes += b"\x00" * padding_len

    # Bonds: uint32 * n_bonds * 2
    bond_bytes = structure.bonds.astype(np.uint32).tobytes()

    return header + snapshot_header + pos_bytes + elem_bytes + bond_bytes


def encode_frame(frame_id: int, positions: np.ndarray) -> bytes:
    """Encode a trajectory frame as a binary message."""
    n_atoms = len(positions)

    header = MAGIC + struct.pack("<BBH", MSG_FRAME, 0, 0)
    frame_header = struct.pack("<II", frame_id, n_atoms)
    pos_bytes = positions.astype(np.float32).tobytes()

    return header + frame_header + pos_bytes
