"""GROMACS .top / .itp topology file parser.

Extracts bond pairs from the ``[ bonds ]`` section and resolves
``#include`` directives so that real-world multi-file topologies work.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np


def _parse_include_directive(line: str) -> str | None:
    """Return the include path from a ``#include`` line, or ``None``."""
    stripped = line.strip()
    if not stripped.startswith("#include"):
        return None
    rest = stripped[len("#include") :].strip()
    if rest.startswith('"') and '"' in rest[1:]:
        return rest[1 : rest.index('"', 1)]
    if rest.startswith("<") and ">" in rest[1:]:
        return rest[1 : rest.index(">", 1)]
    return None


def _expand_includes(
    text: str,
    base_dir: Path,
    include_stack: list[str],
) -> str:
    """Recursively expand ``#include`` directives in *text*.

    Missing include files are silently skipped (system forcefield files are
    typically absent in test environments).  Circular includes are detected
    and raise a ``RecursionError``.
    """
    lines: list[str] = []
    for line in text.splitlines():
        include_path = _parse_include_directive(line)
        if include_path is None:
            lines.append(line)
            continue

        if include_path in include_stack:
            chain = " -> ".join(include_stack + [include_path])
            raise RecursionError(f"Circular include detected: {chain}")

        candidate = base_dir / include_path
        if not candidate.is_file():
            # Skip missing includes (e.g. system forcefield .itp files).
            continue

        included_text = candidate.read_text(encoding="utf-8", errors="replace")
        include_stack.append(include_path)
        expanded = _expand_includes(included_text, base_dir, include_stack)
        include_stack.pop()
        lines.append(expanded)

    return "\n".join(lines)


def _extract_bonds(text: str) -> list[tuple[int, int]]:
    """Extract 0-indexed bond pairs from the ``[ bonds ]`` section(s) of *text*."""
    bonds: list[tuple[int, int]] = []
    in_bonds_section = False

    for line in text.splitlines():
        trimmed = line.strip()

        if not trimmed or trimmed.startswith(";") or trimmed.startswith("#"):
            continue

        if trimmed.startswith("["):
            section_name = trimmed.strip("[]").strip().lower()
            in_bonds_section = section_name == "bonds"
            continue

        if not in_bonds_section:
            continue

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

        if ai <= 0 or aj <= 0:
            continue
        a = min(ai - 1, aj - 1)
        b = max(ai - 1, aj - 1)
        bonds.append((a, b))

    return bonds


def parse_top_bonds(path: str) -> np.ndarray:
    """Parse a GROMACS ``.top`` file and extract bond pairs.

    ``#include`` directives are resolved relative to the directory of *path*.
    Missing include files (e.g. system forcefield ``.itp`` files) are skipped
    silently.  Circular includes raise ``RecursionError``.

    Args:
        path: Path to a ``.top`` topology file.

    Returns:
        ``(M, 2)`` uint32 array of 0-indexed bond pairs.
    """
    top_path = Path(path)
    base_dir = top_path.parent
    text = top_path.read_text(encoding="utf-8", errors="replace")
    expanded = _expand_includes(text, base_dir, [])
    bonds = _extract_bonds(expanded)

    if not bonds:
        return np.empty((0, 2), dtype=np.uint32)
    return np.array(bonds, dtype=np.uint32)
