"""Chemical Markup Language (.cml) reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_structure_result
from megane.parsers.pdb import Structure

__all__ = ["load_cml", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_cml(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load a CML file as structure + trajectory.

    Reads the first ``<molecule>`` that carries atoms. Coordinates may be
    Cartesian (``x3``/``y3``/``z3`` or a packed ``xyz3``), fractional
    (``xFract``/``yFract``/``zFract``, converted with the ``<crystal>`` cell),
    or a 2D depiction (``x2``/``y2``, projected onto z = 0). An explicit
    ``<bondArray>`` supplies connectivity; without one, bonds are inferred by
    distance. CML is single-frame, so the trajectory has one frame.

    Args:
        path: Path to the ``.cml`` file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading CML structure: %s", path)

    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_cml(text)

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

    logger.info("Loaded CML: %d atoms, %d bonds", n_atoms, len(bonds))
    return structure, trajectory
