"""GROMACS .top topology file parser.

Extracts bond pairs from the ``[ bonds ]`` section.  Mirrors the Rust
implementation in ``crates/megane-core/src/top.rs``.
"""

from __future__ import annotations

import numpy as np


def parse_top_bonds(path: str) -> np.ndarray:
    """Parse a GROMACS .top file and extract bond pairs.

    Args:
        path: Path to a ``.top`` topology file.

    Returns:
        ``(M, 2)`` uint32 array of 0-indexed bond pairs.
    """
    with open(path, encoding="utf-8", errors="replace") as f:
        text = f.read()

    bonds: list[tuple[int, int]] = []
    in_bonds_section = False

    for line in text.splitlines():
        trimmed = line.strip()

        # Skip empty lines and comments
        if not trimmed or trimmed.startswith(";"):
            continue

        # Check for section headers
        if trimmed.startswith("["):
            section_name = trimmed.strip("[]").strip().lower()
            in_bonds_section = section_name == "bonds"
            continue

        if not in_bonds_section:
            continue

        # Strip inline comments
        if ";" in trimmed:
            trimmed = trimmed[: trimmed.index(";")]

        parts = trimmed.split()
        if len(parts) < 2:
            continue

        try:
            ai = int(parts[0])
            aj = int(parts[1])
        except ValueError:
            continue

        # GROMACS uses 1-indexed atoms; convert to 0-indexed
        if ai <= 0 or aj <= 0:
            continue
        a = min(ai - 1, aj - 1)
        b = max(ai - 1, aj - 1)
        bonds.append((a, b))

    if not bonds:
        return np.empty((0, 2), dtype=np.uint32)
    return np.array(bonds, dtype=np.uint32)
