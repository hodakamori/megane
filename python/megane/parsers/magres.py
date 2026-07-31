"""CASTEP NMR magres reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_structure_result
from megane.parsers.pdb import Structure

__all__ = ["load_magres", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_magres(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load a new-style (``#$magres-abinitio-v1.0``) magres file.

    Reads the ``[atoms]`` block: the ``lattice`` line becomes the unit cell and
    each ``atom`` line an atom, honouring the per-block ``units`` declarations
    independently (Angstrom or bohr) rather than assuming Angstrom.

    The ``ms`` / ``efg`` / ``isc`` tensors in ``[magres]`` are 3x3 per-atom
    quantities with no home in the current renderer, so they are skipped; a
    per-atom scalar channel for them is a follow-up.

    Old-style (pre-2010) magres output is a different, free-form grammar and is
    rejected with a clear message rather than misparsed.

    Args:
        path: Path to the ``.magres`` file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading magres structure: %s", path)

    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_magres(text)

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

    logger.info("Loaded magres: %d atoms", n_atoms)
    return structure, trajectory
