"""CASTEP .phonon reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_structure_result
from megane.parsers.pdb import Structure

__all__ = ["load_phonon", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_phonon(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load the structure from a CASTEP ``.phonon`` lattice-dynamics file.

    The header block supplies everything the viewer needs: the unit cell
    vectors, the fractional coordinates, and the species, which become a normal
    periodic structure with distance-inferred bonds.

    The per-q-point frequencies and complex eigenvectors that follow the header
    are parsed by the core (``phonon::parse_with_modes``) but are not surfaced
    here: displacing atoms along ``Re(eigenvector) * cos(wt)`` is a *feature* --
    a pipeline node plus a q-point/branch picker -- which the issue asks to land
    separately, and which should be format-agnostic so Molden ``[FREQ]`` can
    share it.

    Args:
        path: Path to the ``.phonon`` file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading CASTEP phonon structure: %s", path)

    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_phonon(text)

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

    logger.info("Loaded CASTEP phonon: %d atoms", n_atoms)
    return structure, trajectory
