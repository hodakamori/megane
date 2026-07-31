"""Molden file reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_structure_result
from megane.parsers.pdb import Structure

__all__ = ["load_molden", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_molden(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load a Molden file as structure + trajectory.

    Reads the ``[Atoms]`` block, honouring its mandatory ``(AU)`` / ``(Angs)``
    unit argument — getting that wrong is a 1.889x coordinate error. A
    ``[GEOMETRIES] XYZ`` block (a geometry optimisation) becomes a multi-frame
    structure; a file with only ``[Atoms]`` is returned as one frame.

    ``[GTO]`` / ``[MO]`` orbitals and ``[FREQ]`` normal modes are skipped, as
    are any vendor-specific sections — the parser never fails on a block it
    does not recognise.

    Args:
        path: Path to the ``.molden`` file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading Molden structure: %s", path)

    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_molden(text)

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

    box_3x3 = box_matrix.reshape(3, 3)
    trajectory = trajectory_from_structure_result(result, positions, elements, box_3x3, n_atoms)

    logger.info("Loaded Molden: %d frames, %d atoms", trajectory.n_frames, n_atoms)
    return structure, trajectory
