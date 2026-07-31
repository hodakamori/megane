"""XCrySDen structure file reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_structure_result
from megane.parsers.pdb import Structure

__all__ = ["load_xsf", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_xsf(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load an XCrySDen ``.xsf`` / ``.axsf`` file as structure + trajectory.

    Handles the ``CRYSTAL`` / ``SLAB`` / ``POLYMER`` / ``MOLECULE`` / ``ATOMS``
    dimensionality keywords, ``PRIMVEC`` lattice vectors, and ``PRIMCOORD``
    atom blocks. An ``ANIMSTEPS`` file (``.axsf``) becomes a multi-frame
    structure, with per-frame cells when the animation is variable-cell.
    A static file is returned as a 1-frame trajectory.

    ``CONVVEC`` is consumed and discarded (``PRIMVEC`` is the cell megane
    draws), and ``BEGIN_BLOCK_DATAGRID_*`` volumetric blocks are skipped.

    Args:
        path: Path to the ``.xsf`` / ``.axsf`` file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading XSF structure: %s", path)

    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_xsf(text)

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

    logger.info("Loaded XSF: %d frames, %d atoms", trajectory.n_frames, n_atoms)
    return structure, trajectory
