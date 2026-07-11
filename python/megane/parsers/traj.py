"""ASE .traj file reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_structure_result
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

    # Frame 0 lives in `positions`; extra frames are unpacked (rectangular when
    # uniform, jagged when heterogeneous) by the shared structure-lane helper.
    box_3x3 = box_matrix.reshape(3, 3)
    trajectory = trajectory_from_structure_result(result, positions, elements, box_3x3, n_atoms)

    if trajectory.heterogeneous:
        counts = [f.shape[0] for f in (trajectory.frames_list or [])]
        logger.info(
            "Loaded heterogeneous .traj: %d frames, %d..%d atoms",
            trajectory.n_frames,
            min(counts),
            max(counts),
        )
    else:
        logger.info(
            "Loaded .traj: %d frames, %d atoms, %d bonds",
            trajectory.n_frames,
            n_atoms,
            len(bonds),
        )
    return structure, trajectory
