"""VASP POSCAR / CONTCAR / XDATCAR reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_structure_result
from megane.parsers.pdb import Structure

__all__ = ["load_vasp", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_vasp(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load a VASP structure file as structure + trajectory.

    Handles POSCAR / CONTCAR (single frame) and XDATCAR (one frame per
    ``Direct configuration=`` block), including variable-cell runs that
    re-emit the whole header before each configuration. A POSCAR is returned
    as a 1-frame trajectory, exactly like a single-frame XYZ.

    The filename is irrelevant — VASP's extensionless names (``POSCAR``,
    ``CONTCAR``, ``XDATCAR``) and the ``.vasp`` extension all route here.

    Args:
        path: Path to the VASP structure file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading VASP structure: %s", path)

    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_vasp(text)

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

    logger.info("Loaded VASP: %d frames, %d atoms", trajectory.n_frames, n_atoms)
    return structure, trajectory
