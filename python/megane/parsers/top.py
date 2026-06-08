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


class _MoleculeType:
    """A ``[ moleculetype ]`` block: atom count plus LOCAL (0-indexed) bonds."""

    __slots__ = ("n_atoms", "bonds")

    def __init__(self, n_atoms: int, bonds: list[tuple[int, int]]) -> None:
        self.n_atoms = n_atoms
        self.bonds = bonds


def _data_line(trimmed: str) -> str | None:
    """Strip an inline ``;`` comment; return ``None`` for blank/comment lines."""
    if ";" in trimmed:
        trimmed = trimmed[: trimmed.index(";")]
    trimmed = trimmed.strip()
    return trimmed or None


def _extract_bonds_grouped(text: str) -> list[tuple[int, int]] | None:
    """Extract bonds honoring ``[ moleculetype ]`` / ``[ molecules ]`` semantics.

    Atom indices inside a ``[ moleculetype ]`` block's ``[ bonds ]`` section
    are LOCAL to that molecule. The ``[ molecules ]`` section lists how many
    copies of each molecule type the system contains (in order); each copy
    contributes its own bonds offset by the cumulative atom count of all
    preceding molecule instances — e.g. 1000 copies of a 3-atom water molecule
    yield 1000 equivalent sets of bonds, not just the ones written literally.

    Returns ``None`` if *text* contains no ``[ moleculetype ]`` block, so the
    caller can fall back to flat parsing for bare bond fragments that have no
    molecule structure to replicate against.

    If ``[ molecules ]`` references a molecule type that could not be
    resolved (e.g. its ``#include`` was missing), replication stops there —
    continuing would require guessing that molecule's atom count and could
    misplace every bond that follows.
    """
    moltypes: dict[str, _MoleculeType] = {}
    moltype_order: list[str] = []
    molecules: list[tuple[str, int]] = []

    current_name: str | None = None
    awaiting_name = False
    current_atom_count = 0
    current_max_index = 0
    current_bonds: list[tuple[int, int]] = []
    section = ""
    found_moleculetype = False

    def finalize() -> None:
        nonlocal current_name, current_atom_count, current_max_index, current_bonds
        if current_name is not None:
            n_atoms = current_atom_count if current_atom_count > 0 else current_max_index
            if current_name not in moltypes:
                moltype_order.append(current_name)
            moltypes[current_name] = _MoleculeType(n_atoms, current_bonds)
        current_name = None
        current_atom_count = 0
        current_max_index = 0
        current_bonds = []

    for line in text.splitlines():
        trimmed = line.strip()

        if not trimmed or trimmed.startswith(";") or trimmed.startswith("#"):
            continue

        if trimmed.startswith("["):
            section_name = trimmed.strip("[]").strip().lower()
            if section_name == "moleculetype":
                finalize()
                awaiting_name = True
                found_moleculetype = True
                section = ""
            elif section_name == "molecules":
                finalize()
                section = "molecules"
            elif section_name in ("atoms", "bonds"):
                section = section_name
            else:
                section = ""
            continue

        data = _data_line(trimmed)
        if data is None:
            continue

        if awaiting_name:
            parts = data.split()
            if parts:
                current_name = parts[0]
            awaiting_name = False
            continue

        parts = data.split()
        if section == "atoms":
            current_atom_count += 1
            try:
                current_max_index = max(current_max_index, int(parts[0]))
            except (ValueError, IndexError):
                pass
        elif section == "bonds":
            if len(parts) < 2:
                continue
            try:
                ai = int(parts[0])
                aj = int(parts[1])
            except ValueError:
                continue
            if ai <= 0 or aj <= 0:
                continue
            current_max_index = max(current_max_index, ai, aj)
            current_bonds.append((min(ai, aj) - 1, max(ai, aj) - 1))
        elif section == "molecules":
            if len(parts) < 2:
                continue
            try:
                count = int(parts[1])
            except ValueError:
                continue
            molecules.append((parts[0], count))

    finalize()

    if not found_moleculetype:
        return None

    # Prefer the explicit [ molecules ] system composition; fall back to
    # "each molecule type appears once, in definition order" when absent.
    order = molecules if molecules else [(name, 1) for name in moltype_order]

    bonds: list[tuple[int, int]] = []
    offset = 0
    for name, count in order:
        moltype = moltypes.get(name)
        if moltype is None:
            # Unresolvable molecule type (e.g. missing #include) — stop
            # rather than guess its atom count and miscompute later offsets.
            break
        for _ in range(count):
            for a, b in moltype.bonds:
                bonds.append((offset + a, offset + b))
            offset += moltype.n_atoms

    return bonds


def _extract_bonds_flat(text: str) -> list[tuple[int, int]]:
    """Flat fallback: scan ``[ bonds ]`` sections, treating indices as global.

    Matches historical behaviour and is used for inputs with no
    ``[ moleculetype ]`` block (e.g. bare ``.itp`` bond fragments), where
    there is no molecule structure to replicate against.
    """
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

        data = _data_line(trimmed)
        if data is None:
            continue

        parts = data.split()
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


def _extract_bonds(text: str) -> list[tuple[int, int]]:
    """Extract 0-indexed bond pairs from *text*, replicating per molecule.

    Honors ``[ moleculetype ]`` / ``[ molecules ]`` semantics when present
    (see :func:`_extract_bonds_grouped`); otherwise falls back to flat
    parsing of bare ``[ bonds ]`` sections.
    """
    grouped = _extract_bonds_grouped(text)
    if grouped is not None:
        return grouped
    return _extract_bonds_flat(text)


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
