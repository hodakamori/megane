"""CHARMM/NAMD PSF topology file parser.

Extracts bond pairs from the ``!NBOND`` section.  PSF files carry no
coordinate data; use together with a DCD or XTC trajectory to get positions.
"""

from __future__ import annotations

import numpy as np


def parse_psf_bonds(path: str) -> np.ndarray:
    """Parse a CHARMM/NAMD PSF topology file and extract bond pairs.

    Args:
        path: Path to a ``.psf`` topology file.

    Returns:
        ``(M, 2)`` uint32 array of 0-indexed bond pairs.
    """
    with open(path, encoding="utf-8", errors="replace") as f:
        text = f.read()

    lines = iter(text.splitlines())

    # Verify PSF magic on first non-empty line.
    for line in lines:
        if line.strip():
            if not line.strip().startswith("PSF"):
                return np.empty((0, 2), dtype=np.uint32)
            break

    section = ""
    bonds_expected = 0
    bond_values: list[int] = []
    bonds: list[tuple[int, int]] = []

    for line in lines:
        trimmed = line.strip()

        # Section header contains '!'.
        if "!" in trimmed:
            # Flush collected bond integers when leaving the NBOND section.
            if section == "bond":
                _flush_bonds(bond_values, bonds_expected, bonds)
                bond_values.clear()

            bang = trimmed.index("!")
            kw = trimmed[bang + 1:].split()[0].rstrip(":") if trimmed[bang + 1:].split() else ""
            try:
                count = int(trimmed[:bang].strip())
            except ValueError:
                count = 0

            if kw == "NBOND":
                bonds_expected = count
                section = "bond"
            elif kw == "NATOM":
                section = "atom"
            elif kw == "NTITLE":
                section = "title"
            else:
                section = "skip"
            continue

        if not trimmed or section != "bond":
            continue

        for tok in trimmed.split():
            try:
                bond_values.append(int(tok))
            except ValueError:
                pass

    # Flush remaining values at EOF.
    if section == "bond":
        _flush_bonds(bond_values, bonds_expected, bonds)

    if not bonds:
        return np.empty((0, 2), dtype=np.uint32)
    return np.array(bonds, dtype=np.uint32)


def _flush_bonds(
    values: list[int],
    expected: int,
    bonds: list[tuple[int, int]],
) -> None:
    """Convert raw integer pairs in *values* to 0-indexed bond pairs."""
    it = iter(values)
    for a_raw, b_raw in zip(it, it):
        if len(bonds) >= expected:
            break
        a = max(a_raw - 1, 0)
        b = max(b_raw - 1, 0)
        lo, hi = (a, b) if a <= b else (b, a)
        bonds.append((lo, hi))
