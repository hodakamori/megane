"""Binary protocol for Python -> JavaScript data transfer.

Protocol format:
  Header (8 bytes):
    magic:    4 bytes "MEGN"
    msg_type: u8 (0=snapshot, 1=frame, 2=metadata)
    flags:    u8 (bit 0: HAS_BOND_ORDERS, bit 1: HAS_BOX)
    reserved: 2 bytes

  Snapshot payload:
    n_atoms:      u32
    n_bonds:      u32
    positions:    Float32[n_atoms * 3]
    elements:     Uint8[n_atoms]     + pad to 4 bytes
    bonds:        Uint32[n_bonds * 2]
    bond_orders:  Uint8[n_bonds]     + pad to 4 bytes  (if HAS_BOND_ORDERS)
    box:          Float32[9]         (3x3 row-major)   (if HAS_BOX)

  Frame payload:
    frame_id:   u32
    n_atoms:    u32
    positions:  Float32[n_atoms * 3]
"""

from __future__ import annotations

import struct
from typing import Protocol, runtime_checkable

import numpy as np

MAGIC = b"MEGN"
MSG_SNAPSHOT = 0
MSG_FRAME = 1
MSG_METADATA = 2

HAS_BOND_ORDERS = 0x01
HAS_BOX = 0x02


@runtime_checkable
class StructureLike(Protocol):
    """Structural contract for objects that can be encoded as snapshots."""

    n_atoms: int
    positions: np.ndarray  # (N, 3) float32
    elements: np.ndarray  # (N,) uint8
    bonds: np.ndarray  # (M, 2) uint32
    bond_orders: np.ndarray  # (M,) uint8
    box: np.ndarray  # (3, 3) float32


def encode_snapshot(structure: StructureLike) -> bytes:
    """Encode a molecular structure as a binary snapshot message."""
    n_atoms = structure.n_atoms
    n_bonds = len(structure.bonds)

    flags = 0

    # Positions: float32 * n_atoms * 3
    pos_bytes = structure.positions.astype(np.float32).tobytes()

    # Elements: uint8 * n_atoms, padded to 4-byte alignment
    elem_bytes = structure.elements.astype(np.uint8).tobytes()
    padding_len = (4 - (len(elem_bytes) % 4)) % 4
    elem_bytes += b"\x00" * padding_len

    # Bonds: uint32 * n_bonds * 2
    bond_bytes = structure.bonds.astype(np.uint32).tobytes()

    # Bond orders (optional)
    bond_order_bytes = b""
    if len(structure.bond_orders) > 0:
        flags |= HAS_BOND_ORDERS
        bo_raw = structure.bond_orders.astype(np.uint8).tobytes()
        bo_padding = (4 - (len(bo_raw) % 4)) % 4
        bond_order_bytes = bo_raw + b"\x00" * bo_padding

    # Box (optional)
    box_bytes = b""
    if np.any(structure.box != 0):
        flags |= HAS_BOX
        box_bytes = structure.box.astype(np.float32).flatten().tobytes()

    # Header: magic(4) + msg_type(1) + flags(1) + reserved(2) = 8 bytes
    header = MAGIC + struct.pack("<BBH", MSG_SNAPSHOT, flags, 0)

    # Snapshot header: n_atoms(4) + n_bonds(4) = 8 bytes
    snapshot_header = struct.pack("<II", n_atoms, n_bonds)

    return (
        header
        + snapshot_header
        + pos_bytes
        + elem_bytes
        + bond_bytes
        + bond_order_bytes
        + box_bytes
    )


def encode_frame(frame_id: int, positions: np.ndarray) -> bytes:
    """Encode a trajectory frame as a binary message."""
    n_atoms = len(positions)

    header = MAGIC + struct.pack("<BBH", MSG_FRAME, 0, 0)
    frame_header = struct.pack("<II", frame_id, n_atoms)
    pos_bytes = positions.astype(np.float32).tobytes()

    return header + frame_header + pos_bytes


def encode_metadata(n_frames: int, timestep_ps: float, n_atoms: int) -> bytes:
    """Encode trajectory metadata message."""
    header = MAGIC + struct.pack("<BBH", MSG_METADATA, 0, 0)
    payload = struct.pack("<IfI", n_frames, timestep_ps, n_atoms)
    return header + payload
