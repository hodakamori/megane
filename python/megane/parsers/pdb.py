"""PDB file parser using RDKit."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from rdkit import Chem


@dataclass
class Structure:
    """Parsed molecular structure."""

    n_atoms: int
    positions: np.ndarray  # (N, 3) float32
    elements: np.ndarray  # (N,) uint8 - atomic numbers
    bonds: np.ndarray  # (M, 2) uint32 - bond pairs
    box: tuple[float, float, float]


def load_pdb(path: str) -> Structure:
    """Load a PDB file and extract atomic coordinates, elements, and bonds.

    Uses RDKit for robust PDB parsing including bond inference.
    """
    mol = Chem.MolFromPDBFile(path, removeHs=False, sanitize=False)
    if mol is None:
        raise ValueError(f"Failed to parse PDB file: {path}")

    conformer = mol.GetConformer()
    n_atoms = mol.GetNumAtoms()

    # Extract positions
    positions = np.zeros((n_atoms, 3), dtype=np.float32)
    for i in range(n_atoms):
        pos = conformer.GetAtomPosition(i)
        positions[i] = [pos.x, pos.y, pos.z]

    # Extract atomic numbers
    elements = np.array(
        [mol.GetAtomWithIdx(i).GetAtomicNum() for i in range(n_atoms)],
        dtype=np.uint8,
    )

    # Extract bonds from RDKit topology
    bonds_list = []
    for bond in mol.GetBonds():
        i = bond.GetBeginAtomIdx()
        j = bond.GetEndAtomIdx()
        bonds_list.append([min(i, j), max(i, j)])

    bonds = (
        np.array(bonds_list, dtype=np.uint32)
        if bonds_list
        else np.empty((0, 2), dtype=np.uint32)
    )

    return Structure(
        n_atoms=n_atoms,
        positions=positions,
        elements=elements,
        bonds=bonds,
        box=(0.0, 0.0, 0.0),
    )
