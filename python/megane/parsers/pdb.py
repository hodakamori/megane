"""PDB file parser using RDKit."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from rdkit import Chem
from rdkit.Chem import rdchem

# Bond order encoding: matches frontend constants
BOND_SINGLE = 1
BOND_DOUBLE = 2
BOND_TRIPLE = 3
BOND_AROMATIC = 4

_BOND_TYPE_MAP: dict[rdchem.BondType, int] = {
    rdchem.BondType.SINGLE: BOND_SINGLE,
    rdchem.BondType.DOUBLE: BOND_DOUBLE,
    rdchem.BondType.TRIPLE: BOND_TRIPLE,
    rdchem.BondType.AROMATIC: BOND_AROMATIC,
}


@dataclass
class Structure:
    """Parsed molecular structure."""

    n_atoms: int
    positions: np.ndarray  # (N, 3) float32
    elements: np.ndarray  # (N,) uint8 - atomic numbers
    bonds: np.ndarray  # (M, 2) uint32 - bond pairs
    bond_orders: np.ndarray  # (M,) uint8 - 1=single, 2=double, 3=triple, 4=aromatic
    box: np.ndarray  # (3, 3) float32 - cell vectors as rows, zero if no cell


def cell_params_to_matrix(
    a: float, b: float, c: float,
    alpha: float, beta: float, gamma: float,
) -> np.ndarray:
    """Convert crystallographic cell parameters to a 3x3 matrix of cell vectors.

    Args:
        a, b, c: Cell edge lengths in Angstroms.
        alpha, beta, gamma: Cell angles in degrees.

    Returns:
        (3, 3) float32 array with cell vectors as rows.
    """
    alpha_r = np.radians(alpha)
    beta_r = np.radians(beta)
    gamma_r = np.radians(gamma)

    cos_a, cos_b, cos_g = np.cos(alpha_r), np.cos(beta_r), np.cos(gamma_r)
    sin_g = np.sin(gamma_r)

    va = np.array([a, 0.0, 0.0])
    vb = np.array([b * cos_g, b * sin_g, 0.0])

    cx = c * cos_b
    cy = c * (cos_a - cos_b * cos_g) / sin_g
    cz = np.sqrt(max(0.0, c * c - cx * cx - cy * cy))
    vc = np.array([cx, cy, cz])

    return np.array([va, vb, vc], dtype=np.float32)


def _parse_cryst1(path: str) -> np.ndarray:
    """Parse CRYST1 record from a PDB file.

    Returns:
        (3, 3) float32 cell matrix, or zeros if no CRYST1 found.
    """
    with open(path) as f:
        for line in f:
            if line.startswith("CRYST1"):
                try:
                    a = float(line[6:15])
                    b = float(line[15:24])
                    c = float(line[24:33])
                    alpha = float(line[33:40])
                    beta = float(line[40:47])
                    gamma = float(line[47:54])
                    if a > 0 and b > 0 and c > 0:
                        return cell_params_to_matrix(a, b, c, alpha, beta, gamma)
                except (ValueError, IndexError):
                    pass
                break
    return np.zeros((3, 3), dtype=np.float32)


def load_pdb(path: str) -> Structure:
    """Load a PDB file and extract atomic coordinates, elements, and bonds.

    Uses RDKit for robust PDB parsing including bond inference.
    """
    # Parse CRYST1 before RDKit (RDKit doesn't expose it)
    box = _parse_cryst1(path)

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

    # Extract bonds and bond orders from RDKit topology
    bonds_list = []
    orders_list = []
    for bond in mol.GetBonds():
        i = bond.GetBeginAtomIdx()
        j = bond.GetEndAtomIdx()
        bonds_list.append([min(i, j), max(i, j)])
        orders_list.append(_BOND_TYPE_MAP.get(bond.GetBondType(), BOND_SINGLE))

    bonds = (
        np.array(bonds_list, dtype=np.uint32)
        if bonds_list
        else np.empty((0, 2), dtype=np.uint32)
    )
    bond_orders = (
        np.array(orders_list, dtype=np.uint8)
        if orders_list
        else np.empty(0, dtype=np.uint8)
    )

    return Structure(
        n_atoms=n_atoms,
        positions=positions,
        elements=elements,
        bonds=bonds,
        bond_orders=bond_orders,
        box=box,
    )
