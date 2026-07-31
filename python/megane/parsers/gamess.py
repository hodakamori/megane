"""GAMESS (US / Firefly) output reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_structure_result
from megane.parsers.pdb import Structure

__all__ = ["load_gamess", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_gamess(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load a GAMESS output file as structure + trajectory.

    Every ``COORDINATES OF ALL ATOMS ARE`` block becomes a frame, so a geometry
    optimisation can be scrubbed exactly like a multi-frame XYZ; the terminal
    ``EQUILIBRIUM GEOMETRY LOCATED`` block is simply the last one. The banner's
    ``(ANGS)`` / ``(BOHR)`` argument is honoured. Bonds are inferred by distance
    -- GAMESS output carries no connectivity.

    Only the ``.gamess`` extension is registered with the host viewers: GAMESS
    logs are normally named ``.log`` / ``.out``, and claiming those globally
    would hijack every log file in a workspace.

    Args:
        path: Path to the GAMESS output file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading GAMESS output: %s", path)

    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_gamess(text)

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

    logger.info("Loaded GAMESS: %d frames, %d atoms", trajectory.n_frames, n_atoms)
    return structure, trajectory
