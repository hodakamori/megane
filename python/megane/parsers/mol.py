"""MOL/SDF structure reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.pdb import Structure

__all__ = ["load_mol", "load_sdf"]

logger = logging.getLogger(__name__)


def _load_mol_text(text: str) -> Structure:
    result = megane_parser.parse_mol(text)
    return Structure(
        n_atoms=result.n_atoms,
        positions=np.asarray(result.positions, dtype=np.float32),
        elements=np.asarray(result.elements, dtype=np.uint8),
        bonds=np.asarray(result.bonds, dtype=np.uint32),
        bond_orders=np.asarray(result.bond_orders, dtype=np.uint8),
        box=np.asarray(result.box_matrix, dtype=np.float32),
    )


def load_mol(path: str) -> Structure:
    """Load a MOL file using the shared Rust parser (megane-core).

    Args:
        path: Path to the .mol file.

    Returns:
        Parsed Structure with positions in Angstroms.
    """
    logger.debug("Loading MOL file: %s", path)
    with open(path) as f:
        text = f.read()

    structure = _load_mol_text(text)
    logger.info("Loaded MOL: %d atoms, %d bonds", structure.n_atoms, len(structure.bonds))
    return structure


def load_sdf(path: str) -> Structure:
    """Load the first record from an SDF file using the shared Rust parser (megane-core).

    SDF files may contain multiple records separated by ``$$$$``; only the
    first record is loaded.

    Args:
        path: Path to the .sdf file.

    Returns:
        Parsed Structure with positions in Angstroms.
    """
    logger.debug("Loading SDF file: %s", path)
    with open(path) as f:
        text = f.read()

    structure = _load_mol_text(text)
    logger.info("Loaded SDF: %d atoms, %d bonds", structure.n_atoms, len(structure.bonds))
    return structure
