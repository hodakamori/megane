"""ASE .traj file reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory
from megane.parsers.pdb import Structure

__all__ = ["load_traj", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_traj(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load an ASE .traj file as structure + trajectory.

    Uses the Rust .traj parser (megane-core) instead of ASE.
    The first frame defines the topology (elements, bonds). All frames
    are read into memory.

    Args:
        path: Path to .traj file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading ASE .traj file: %s", path)

    with open(path, "rb") as f:
        data = f.read()

    result = megane_parser.parse_traj(data)

    n_atoms = result.n_atoms
    positions = np.asarray(result.positions, dtype=np.float32)
    elements = np.asarray(result.elements, dtype=np.uint8)
    bonds = np.asarray(result.bonds, dtype=np.uint32)
    bond_orders = np.asarray(result.bond_orders, dtype=np.uint8)
    box_matrix = np.asarray(result.box_matrix, dtype=np.float32)

    structure = Structure(
        n_atoms=n_atoms,
        positions=positions,
        elements=elements,
        bonds=bonds,
        bond_orders=bond_orders,
        box=box_matrix,
    )

    # Extract frame positions
    n_frames = result.n_frames
    if n_frames > 0:
        frame_data = np.asarray(result.frame_positions, dtype=np.float32).reshape(n_frames, n_atoms, 3)
        frames = frame_data
    else:
        # Single-frame: use the main positions as the only frame
        frames = positions.copy().reshape(1, n_atoms, 3)
        n_frames = 1

    trajectory = InMemoryTrajectory(
        _frames=frames,
        n_frames=n_frames,
        n_atoms=n_atoms,
        timestep_ps=0.0,
        box=box_matrix,
    )

    logger.info("Loaded .traj: %d frames, %d atoms, %d bonds", n_frames, n_atoms, len(bonds))
    return structure, trajectory
