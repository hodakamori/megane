"""LAMMPS data file parser backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import numpy as np

from megane import megane_parser
from megane.parsers.pdb import Structure


def load_lammps_data(path: str) -> Structure:
    """Load a LAMMPS data file using the shared Rust parser (megane-core).

    Supports atom_style: atomic, charge, and full (real).
    Auto-detects style from comment hint or field count.
    """
    with open(path) as f:
        text = f.read()

    result = megane_parser.parse_lammps_data(text)

    return Structure(
        n_atoms=result.n_atoms,
        positions=np.asarray(result.positions, dtype=np.float32),
        elements=np.asarray(result.elements, dtype=np.uint8),
        bonds=np.asarray(result.bonds, dtype=np.uint32),
        bond_orders=np.asarray(result.bond_orders, dtype=np.uint8),
        box=np.asarray(result.box_matrix, dtype=np.float32),
    )
