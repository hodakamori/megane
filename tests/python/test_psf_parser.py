"""Tests for the CHARMM/NAMD PSF topology parser."""

from pathlib import Path

import numpy as np
import pytest

from megane.parsers.psf import parse_psf_bonds

FIXTURES = Path(__file__).parent.parent / "fixtures"


class TestParsePsfBonds:
    """parse_psf_bonds extracts bond pairs correctly."""

    def test_fixture_atom_count(self):
        bonds = parse_psf_bonds(str(FIXTURES / "water.psf"))
        # water.psf: O-H1 and O-H2 (2 bonds)
        assert bonds.shape == (2, 2)
        assert bonds.dtype == np.uint32

    def test_fixture_zero_indexed(self):
        bonds = parse_psf_bonds(str(FIXTURES / "water.psf"))
        pairs = set(map(tuple, bonds.tolist()))
        assert (0, 1) in pairs  # O – H1
        assert (0, 2) in pairs  # O – H2

    def test_empty_file(self, tmp_path):
        f = tmp_path / "empty.psf"
        f.write_text("")
        bonds = parse_psf_bonds(str(f))
        assert bonds.shape == (0, 2)

    def test_not_a_psf_file(self, tmp_path):
        f = tmp_path / "bad.psf"
        f.write_text("NOTPSF\n")
        bonds = parse_psf_bonds(str(f))
        assert bonds.shape == (0, 2)

    def test_zero_bonds(self, tmp_path):
        text = (
            "PSF\n\n"
            "       1 !NTITLE\n"
            " REMARKS none\n\n"
            "       2 !NATOM\n"
            "         1 LIG      1 LIG  C1   CT1   0.0  12.01  0\n"
            "         2 LIG      1 LIG  C2   CT1   0.0  12.01  0\n\n"
            "       0 !NBOND: bonds\n\n"
            "       0 !NTHETA: angles\n"
        )
        f = tmp_path / "nobond.psf"
        f.write_text(text)
        bonds = parse_psf_bonds(str(f))
        assert bonds.shape == (0, 2)

    def test_multi_line_bonds(self, tmp_path):
        text = (
            "PSF\n\n"
            "       1 !NTITLE\n"
            " REMARKS chain\n\n"
            "       5 !NATOM\n"
            "         1 MOL      1 MOL  C1   CT1   0.0  12.01  0\n"
            "         2 MOL      1 MOL  C2   CT1   0.0  12.01  0\n"
            "         3 MOL      1 MOL  C3   CT1   0.0  12.01  0\n"
            "         4 MOL      1 MOL  C4   CT1   0.0  12.01  0\n"
            "         5 MOL      1 MOL  C5   CT1   0.0  12.01  0\n\n"
            "       4 !NBOND: bonds\n"
            "         1         2         2         3\n"
            "         3         4         4         5\n\n"
            "       0 !NTHETA: angles\n"
        )
        f = tmp_path / "chain.psf"
        f.write_text(text)
        bonds = parse_psf_bonds(str(f))
        assert bonds.shape == (4, 2)
        pairs = set(map(tuple, bonds.tolist()))
        assert (0, 1) in pairs
        assert (1, 2) in pairs
        assert (2, 3) in pairs
        assert (3, 4) in pairs

    def test_bonds_sorted_lo_hi(self, tmp_path):
        # PSF may list bonds as (j, i) with j > i; parser should normalise to (lo, hi).
        text = (
            "PSF\n\n"
            "       1 !NTITLE\n"
            " REMARKS reverse\n\n"
            "       2 !NATOM\n"
            "         1 WAT      1 TIP3 OH2  OT    -0.8  16.0  0\n"
            "         2 WAT      1 TIP3 H1   HT     0.4   1.0  0\n\n"
            "       1 !NBOND: bonds\n"
            "         2         1\n\n"
            "       0 !NTHETA: angles\n"
        )
        f = tmp_path / "reverse.psf"
        f.write_text(text)
        bonds = parse_psf_bonds(str(f))
        assert bonds.shape == (1, 2)
        assert bonds[0, 0] <= bonds[0, 1]  # lo <= hi

    def test_ext_psf_format(self, tmp_path):
        text = (
            "PSF EXT\n\n"
            "       1 !NTITLE\n"
            " REMARKS extended format\n\n"
            "       3 !NATOM\n"
            "         1 WAT           1 TIP3     OH2       OT        -0.834000       15.9994           0\n"
            "         2 WAT           1 TIP3     H1        HT         0.417000        1.0080           0\n"
            "         3 WAT           1 TIP3     H2        HT         0.417000        1.0080           0\n\n"
            "       2 !NBOND: bonds\n"
            "         1         2         1         3\n\n"
            "       0 !NTHETA: angles\n"
        )
        f = tmp_path / "ext.psf"
        f.write_text(text)
        bonds = parse_psf_bonds(str(f))
        assert bonds.shape == (2, 2)
        pairs = set(map(tuple, bonds.tolist()))
        assert (0, 1) in pairs
        assert (0, 2) in pairs
