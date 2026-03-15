"""ASE .traj file reader."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory
from megane.parsers.pdb import Structure

__all__ = ["load_traj", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def _atoms_to_xyz(positions: np.ndarray, symbols: list[str]) -> str:
    """Convert positions and symbols to XYZ format text for bond inference."""
    n = len(symbols)
    lines = [str(n), ""]
    for sym, (x, y, z) in zip(symbols, positions):
        lines.append(f"{sym} {x:.6f} {y:.6f} {z:.6f}")
    return "\n".join(lines) + "\n"


def load_traj(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load an ASE .traj file as structure + trajectory.

    The first frame defines the topology (elements, bonds). All frames
    are read into memory.

    Args:
        path: Path to .traj file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    from ase.io import read as ase_read

    logger.debug("Loading ASE .traj file: %s", path)
    frames = ase_read(path, index=":")
    if not isinstance(frames, list):
        frames = [frames]

    first = frames[0]
    positions = first.get_positions().astype(np.float32)
    elements = first.get_atomic_numbers().astype(np.uint8)
    symbols = first.get_chemical_symbols()

    # Infer bonds via the Rust XYZ parser
    xyz_text = _atoms_to_xyz(positions, symbols)
    parsed = megane_parser.parse_xyz(xyz_text)
    bonds = np.asarray(parsed.bonds, dtype=np.uint32)
    bond_orders = np.asarray(parsed.bond_orders, dtype=np.uint8)

    # Cell vectors
    box_matrix = np.array(first.get_cell().array, dtype=np.float32).reshape(3, 3)

    structure = Structure(
        n_atoms=len(first),
        positions=positions,
        elements=elements,
        bonds=bonds,
        bond_orders=bond_orders,
        box=box_matrix,
    )

    # Collect all frame positions
    all_positions = [f.get_positions().astype(np.float32) for f in frames]

    trajectory = InMemoryTrajectory(
        _frames=all_positions,
        n_frames=len(frames),
        n_atoms=len(first),
        timestep_ps=0.0,
        box=box_matrix,
    )

    logger.info("Loaded .traj: %d frames, %d atoms, %d bonds", len(frames), len(first), len(bonds))
    return structure, trajectory
