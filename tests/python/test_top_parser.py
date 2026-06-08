"""Tests for the GROMACS .top topology parser."""

from pathlib import Path

import numpy as np
import pytest

from megane.parsers.top import (
    _expand_includes,
    _extract_bonds,
    _parse_include_directive,
    parse_top_bonds,
)

FIXTURES = Path(__file__).parent.parent / "fixtures"


class TestParseIncludeDirective:
    def test_double_quote(self):
        assert _parse_include_directive('#include "molecule.itp"') == "molecule.itp"

    def test_angle_bracket(self):
        assert _parse_include_directive("#include <forcefield.itp>") == "forcefield.itp"

    def test_leading_whitespace(self):
        assert _parse_include_directive('  #include "ions.itp"') == "ions.itp"

    def test_normal_line_returns_none(self):
        assert _parse_include_directive("[ bonds ]") is None
        assert _parse_include_directive("; comment") is None
        assert _parse_include_directive("1 2 1") is None

    def test_no_closing_quote_returns_none(self):
        assert _parse_include_directive('#include "unclosed') is None


class TestExtractBonds:
    def test_basic(self):
        text = "[ bonds ]\n1 2 1\n2 3 1\n"
        bonds = _extract_bonds(text)
        assert bonds == [(0, 1), (1, 2)]

    def test_inline_comment_stripped(self):
        bonds = _extract_bonds("[ bonds ]\n1 2 1 ; comment\n")
        assert bonds == [(0, 1)]

    def test_stops_at_next_section(self):
        bonds = _extract_bonds("[ bonds ]\n1 2 1\n[ angles ]\n1 2 3 1\n")
        assert bonds == [(0, 1)]

    def test_skips_preprocessor_lines(self):
        bonds = _extract_bonds("[ bonds ]\n#include \"x.itp\"\n1 2 1\n")
        assert bonds == [(0, 1)]


class TestMoleculeReplication:
    """Bonds inside [ moleculetype ] blocks must be replicated per [ molecules ]."""

    def test_multiple_copies_of_one_molecule(self):
        text = """
[ moleculetype ]
SOL  2

[ atoms ]
     1  OW   1  SOL  OW   1   0.0   16.00
     2  HW1  1  SOL  HW1  2   0.0    1.01
     3  HW2  1  SOL  HW2  3   0.0    1.01

[ bonds ]
     1     2     1
     1     3     1

[ molecules ]
SOL  4
"""
        assert _extract_bonds(text) == [
            (0, 1),
            (0, 2),
            (3, 4),
            (3, 5),
            (6, 7),
            (6, 8),
            (9, 10),
            (9, 11),
        ]

    def test_multiple_molecule_types_offset_correctly(self):
        text = """
[ moleculetype ]
protein  3

[ atoms ]
     1  N    1  ALA  N    1  -0.3   14.01
     2  CA   1  ALA  CA   2   0.0   12.01
     3  C    1  ALA  C    3   0.6   12.01
     4  O    1  ALA  O    4  -0.5   16.00
     5  CB   1  ALA  CB   5  -0.1   12.01

[ bonds ]
     1     2     1
     2     3     1
     3     4     1
     2     5     1

[ moleculetype ]
SOL  2

[ atoms ]
     1  OW   1  SOL  OW   1   0.0   16.00
     2  HW1  1  SOL  HW1  2   0.0    1.01
     3  HW2  1  SOL  HW2  3   0.0    1.01

[ bonds ]
     1     2     1
     1     3     1

[ molecules ]
protein  1
SOL      2
"""
        assert _extract_bonds(text) == [
            (0, 1),
            (1, 2),
            (2, 3),
            (1, 4),
            (5, 6),
            (5, 7),
            (8, 9),
            (8, 10),
        ]

    def test_default_order_without_molecules_section(self):
        text = """
[ moleculetype ]
protein  3

[ atoms ]
     1  N    1  ALA  N    1  -0.3   14.01
     2  CA   1  ALA  CA   2   0.0   12.01

[ bonds ]
     1     2     1
"""
        assert _extract_bonds(text) == [(0, 1)]

    def test_unresolved_molecule_type_stops_replication(self):
        text = """
[ moleculetype ]
protein  3

[ atoms ]
     1  N    1  ALA  N    1  -0.3   14.01
     2  CA   1  ALA  CA   2   0.0   12.01

[ bonds ]
     1     2     1

[ molecules ]
protein  1
SOL      10
"""
        assert _extract_bonds(text) == [(0, 1)]

    def test_n_atoms_inferred_without_atoms_section(self):
        text = """
[ moleculetype ]
SOL  2

[ bonds ]
     1     2     1
     1     3     1

[ molecules ]
SOL  2
"""
        assert _extract_bonds(text) == [(0, 1), (0, 2), (3, 4), (3, 5)]


class TestExpandIncludes:
    def test_resolves_itp(self, tmp_path):
        (tmp_path / "mol.itp").write_text("[ bonds ]\n1 2 1\n")
        expanded = _expand_includes('#include "mol.itp"', tmp_path, [])
        assert "[ bonds ]" in expanded

    def test_skips_missing_system_include(self, tmp_path):
        text = "#include <forcefield.itp>\n[ bonds ]\n1 2 1\n"
        expanded = _expand_includes(text, tmp_path, [])
        assert "[ bonds ]" in expanded

    def test_nested_includes(self, tmp_path):
        (tmp_path / "atoms.itp").write_text("[ bonds ]\n1 2 1\n")
        (tmp_path / "mol.itp").write_text('#include "atoms.itp"')
        expanded = _expand_includes('#include "mol.itp"', tmp_path, [])
        assert "[ bonds ]" in expanded

    def test_circular_include_raises(self, tmp_path):
        (tmp_path / "a.itp").write_text('#include "b.itp"')
        (tmp_path / "b.itp").write_text('#include "a.itp"')
        with pytest.raises(RecursionError, match="Circular include"):
            _expand_includes('#include "a.itp"', tmp_path, [])

    def test_diamond_include_allowed(self, tmp_path):
        (tmp_path / "d.itp").write_text("[ bonds ]\n1 2 1\n")
        (tmp_path / "b.itp").write_text('#include "d.itp"')
        (tmp_path / "c.itp").write_text('#include "d.itp"')
        text = '#include "b.itp"\n#include "c.itp"\n'
        # Should not raise — diamond includes are legal.
        expanded = _expand_includes(text, tmp_path, [])
        assert expanded.count("[ bonds ]") == 2


class TestParseTopBonds:
    """parse_top_bonds extracts bond pairs correctly."""

    def test_basic_parsing(self):
        bonds = parse_top_bonds(str(FIXTURES / "test_topology.top"))
        assert bonds.shape == (4, 2)
        assert bonds.dtype == np.uint32

    def test_zero_indexed(self):
        bonds = parse_top_bonds(str(FIXTURES / "test_topology.top"))
        expected = np.array([[0, 1], [1, 2], [2, 3], [1, 4]], dtype=np.uint32)
        np.testing.assert_array_equal(bonds, expected)

    def test_empty_file(self, tmp_path):
        empty = tmp_path / "empty.top"
        empty.write_text("")
        bonds = parse_top_bonds(str(empty))
        assert bonds.shape == (0, 2)

    def test_no_bonds_section(self, tmp_path):
        f = tmp_path / "no_bonds.top"
        f.write_text("[ atoms ]\n1  N  1  ALA  N  1  -0.3  14.01\n")
        bonds = parse_top_bonds(str(f))
        assert bonds.shape == (0, 2)

    def test_inline_comments_stripped(self, tmp_path):
        f = tmp_path / "inline.top"
        f.write_text("[ bonds ]\n1 2 1 ; comment\n3 4 1 ; another\n")
        bonds = parse_top_bonds(str(f))
        assert len(bonds) == 2

    def test_stops_at_next_section(self, tmp_path):
        f = tmp_path / "sections.top"
        f.write_text("[ bonds ]\n1 2 1\n[ angles ]\n1 2 3 1\n")
        bonds = parse_top_bonds(str(f))
        assert len(bonds) == 1

    # ── include resolution ────────────────────────────────────────────────────

    def test_resolves_itp_include(self, tmp_path):
        (tmp_path / "mol.itp").write_text("[ bonds ]\n1 2 1\n2 3 1\n")
        top = tmp_path / "system.top"
        top.write_text('#include "mol.itp"\n')
        bonds = parse_top_bonds(str(top))
        assert bonds.shape == (2, 2)
        np.testing.assert_array_equal(bonds[0], [0, 1])
        np.testing.assert_array_equal(bonds[1], [1, 2])

    def test_resolves_nested_includes(self):
        bonds = parse_top_bonds(str(FIXTURES / "test_with_includes.top"))
        # test_with_includes.top -> test_nested.itp -> test_bonds.itp (4 bonds)
        assert bonds.shape == (4, 2)
        np.testing.assert_array_equal(bonds[0], [0, 1])

    def test_missing_system_include_skipped(self, tmp_path):
        (tmp_path / "mol.itp").write_text("[ bonds ]\n1 2 1\n")
        top = tmp_path / "system.top"
        top.write_text("#include <forcefield.itp>\n#include \"mol.itp\"\n")
        bonds = parse_top_bonds(str(top))
        assert bonds.shape == (1, 2)

    def test_circular_include_raises(self, tmp_path):
        (tmp_path / "a.itp").write_text('#include "b.itp"')
        (tmp_path / "b.itp").write_text('#include "a.itp"')
        top = tmp_path / "system.top"
        top.write_text('#include "a.itp"')
        with pytest.raises(RecursionError, match="Circular include"):
            parse_top_bonds(str(top))
