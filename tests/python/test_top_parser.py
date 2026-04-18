"""Tests for the GROMACS .top topology parser."""

from pathlib import Path

import numpy as np

from megane.parsers.top import parse_top_bonds

FIXTURES = Path(__file__).parent.parent / "fixtures"


class TestParseTopBonds:
    """parse_top_bonds extracts bond pairs correctly."""

    def test_basic_parsing(self):
        bonds = parse_top_bonds(str(FIXTURES / "test_topology.top"))
        assert bonds.shape == (4, 2)
        assert bonds.dtype == np.uint32

    def test_zero_indexed(self):
        bonds = parse_top_bonds(str(FIXTURES / "test_topology.top"))
        # 1-2 -> 0-1, 2-3 -> 1-2, 3-4 -> 2-3, 2-5 -> 1-4
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
