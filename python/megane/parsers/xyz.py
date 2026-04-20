"""Multi-frame XYZ trajectory reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory
from megane.parsers.pdb import Structure

__all__ = ["load_xyz_trajectory", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_xyz_trajectory(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load a multi-frame XYZ file as structure + trajectory.

    Uses the Rust XYZ parser (megane-core). The first frame defines the
    topology (elements). All frames are read into memory. Single-frame
    XYZ files are returned as a 1-frame trajectory.

    Args:
        path: Path to XYZ file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading XYZ trajectory: %s", path)

    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_xyz(text)

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

    # Rust returns frame 0 in `positions` and additional frames in
    # `frame_positions`; prepend frame 0 so all frames are playable.
    extra = result.n_frames
    if extra > 0:
        extras = np.asarray(result.frame_positions, dtype=np.float32).reshape(extra, n_atoms, 3)
        frames = np.concatenate([positions.reshape(1, n_atoms, 3), extras], axis=0)
    else:
        frames = positions.reshape(1, n_atoms, 3).copy()
    n_frames = frames.shape[0]

    trajectory = InMemoryTrajectory(
        _frames=frames,
        n_frames=n_frames,
        n_atoms=n_atoms,
        timestep_ps=0.0,
        box=box_matrix,
    )

    logger.info("Loaded XYZ: %d frames, %d atoms", n_frames, n_atoms)
    return structure, trajectory
