"""MOL2 structure reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.pdb import Structure

__all__ = ["load_mol2"]

logger = logging.getLogger(__name__)


def load_mol2(path: str) -> Structure:
    """Load a MOL2 (Tripos SYBYL) file using the shared Rust parser (megane-core).

    Args:
        path: Path to the .mol2 file.

    Returns:
        Parsed Structure with positions in Angstroms.
    """
    logger.debug("Loading MOL2 file: %s", path)
    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_mol2(text)
    logger.info("Loaded MOL2: %d atoms, %d bonds", result.n_atoms, len(result.bonds))

    return Structure(
        n_atoms=result.n_atoms,
        positions=np.asarray(result.positions, dtype=np.float32),
        elements=np.asarray(result.elements, dtype=np.uint8),
        bonds=np.asarray(result.bonds, dtype=np.uint32),
        bond_orders=np.asarray(result.bond_orders, dtype=np.uint8),
        box=np.asarray(result.box_matrix, dtype=np.float32),
    )
