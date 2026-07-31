"""Tests for the JCAMP-DX spectrum reader."""

from pathlib import Path

import numpy as np
import pytest

from megane import load_jcampdx as load_jcampdx_toplevel
from megane import megane_parser
from megane.parsers.jcampdx import Spectrum, load_jcampdx

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_load_affn_spectrum():
    """A plain AFFN ``(X++(Y..Y))`` table decodes to the declared NPOINTS."""
    spectrum = load_jcampdx(str(FIXTURES / "ethanol_ir.jdx"))

    assert isinstance(spectrum, Spectrum)
    assert spectrum.title.startswith("Ethanol")
    assert spectrum.data_type == "INFRARED SPECTRUM"
    assert spectrum.x_units == "1/CM"
    assert spectrum.y_units == "TRANSMITTANCE"

    assert spectrum.n_points == 121
    assert spectrum.x.shape == (121,)
    assert spectrum.y.shape == (121,)
    assert spectrum.x.dtype == np.float64
    assert spectrum.y.dtype == np.float64


def test_abscissa_spans_firstx_to_lastx():
    """X runs FIRSTX → LASTX in even DELTAX steps."""
    spectrum = load_jcampdx(str(FIXTURES / "ethanol_ir.jdx"))

    assert spectrum.x[0] == pytest.approx(400.0)
    assert spectrum.x[-1] == pytest.approx(4000.0)
    steps = np.diff(spectrum.x)
    assert steps == pytest.approx(np.full(120, 30.0))


def test_yfactor_is_applied():
    """``##YFACTOR=0.01`` scales the raw ordinates into percent transmittance."""
    spectrum = load_jcampdx(str(FIXTURES / "ethanol_ir.jdx"))

    # Raw 10000 → 100 % transmittance on the flat baseline.
    assert spectrum.y[0] == pytest.approx(100.0)
    assert spectrum.y.max() == pytest.approx(100.0)
    # The C-H stretch dips well below the baseline.
    assert spectrum.y.min() < 50.0


def test_asdf_matches_affn():
    """The compressed SQZ/DIF/DUP fixture decodes identically to the AFFN one."""
    affn = load_jcampdx(str(FIXTURES / "ethanol_ir.jdx"))
    asdf = load_jcampdx(str(FIXTURES / "ethanol_ir_asdf.jdx"))

    assert asdf.n_points == affn.n_points
    assert asdf.x == pytest.approx(affn.x)
    assert asdf.y == pytest.approx(affn.y)


def test_top_level_export():
    """``megane.load_jcampdx`` is the same function as the parsers-module one."""
    assert load_jcampdx_toplevel is load_jcampdx


def test_parse_jcampdx_rejects_non_spectrum_text():
    """Text with no data table raises rather than returning an empty spectrum."""
    with pytest.raises(ValueError):
        megane_parser.parse_jcampdx("ATOM      1  N   MET A   1      0.0 0.0 0.0\n")


def test_n_points_tracks_the_decoded_arrays():
    """``n_points`` is derived from the array, not from the ``##NPOINTS=`` header."""
    spectrum = Spectrum(
        title="t",
        data_type="d",
        x_units="1/CM",
        y_units="TRANSMITTANCE",
        x=np.array([1.0, 2.0, 3.0]),
        y=np.array([4.0, 5.0, 6.0]),
    )
    assert spectrum.n_points == 3
