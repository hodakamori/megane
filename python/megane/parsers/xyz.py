"""Multi-frame XYZ trajectory reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_structure_result
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

    # Frame 0 lives in `positions`; extra frames are unpacked (rectangular when
    # uniform, jagged when heterogeneous — variable atom count / cell / elements)
    # by the shared structure-lane helper.
    box_3x3 = box_matrix.reshape(3, 3)
    trajectory = trajectory_from_structure_result(result, positions, elements, box_3x3, n_atoms)

    if trajectory.heterogeneous:
        counts = [f.shape[0] for f in (trajectory.frames_list or [])]
        logger.info(
            "Loaded heterogeneous XYZ: %d frames, %d..%d atoms",
            trajectory.n_frames,
            min(counts),
            max(counts),
        )
    else:
        logger.info("Loaded XYZ: %d frames, %d atoms", trajectory.n_frames, n_atoms)
    return structure, trajectory
