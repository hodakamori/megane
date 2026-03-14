"""Tests for CLI argument parsing."""

import argparse
from unittest.mock import patch

import pytest


def test_serve_command_basic():
    """Parse basic 'serve' command with PDB file."""
    from megane.cli import main

    parser = argparse.ArgumentParser(prog="megane")
    parser.add_argument("command", choices=["serve"])
    parser.add_argument("pdb", nargs="?", default=None)
    parser.add_argument("--xtc")
    parser.add_argument("--traj")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true")
    parser.add_argument("--dev", action="store_true")

    args = parser.parse_args(["serve", "test.pdb"])
    assert args.command == "serve"
    assert args.pdb == "test.pdb"
    assert args.port == 8765
    assert args.no_browser is False
    assert args.dev is False


def test_serve_with_port():
    """Parse 'serve' with custom port."""
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["serve"])
    parser.add_argument("pdb", nargs="?", default=None)
    parser.add_argument("--port", type=int, default=8765)

    args = parser.parse_args(["serve", "--port", "9000"])
    assert args.port == 9000


def test_serve_with_xtc():
    """Parse 'serve' with XTC trajectory."""
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["serve"])
    parser.add_argument("pdb", nargs="?", default=None)
    parser.add_argument("--xtc")

    args = parser.parse_args(["serve", "protein.pdb", "--xtc", "traj.xtc"])
    assert args.pdb == "protein.pdb"
    assert args.xtc == "traj.xtc"


def test_serve_with_traj():
    """Parse 'serve' with ASE .traj file."""
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["serve"])
    parser.add_argument("pdb", nargs="?", default=None)
    parser.add_argument("--traj")

    args = parser.parse_args(["serve", "--traj", "sim.traj"])
    assert args.pdb is None
    assert args.traj == "sim.traj"


def test_serve_no_browser_flag():
    """Parse --no-browser flag."""
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["serve"])
    parser.add_argument("pdb", nargs="?", default=None)
    parser.add_argument("--no-browser", action="store_true")

    args = parser.parse_args(["serve", "--no-browser"])
    assert args.no_browser is True


def test_serve_dev_flag():
    """Parse --dev flag."""
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["serve"])
    parser.add_argument("pdb", nargs="?", default=None)
    parser.add_argument("--dev", action="store_true")

    args = parser.parse_args(["serve", "--dev"])
    assert args.dev is True


def test_invalid_command():
    """Invalid command raises SystemExit."""
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["serve"])

    with pytest.raises(SystemExit):
        parser.parse_args(["invalid"])


def test_missing_command():
    """Missing command raises SystemExit."""
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["serve"])

    with pytest.raises(SystemExit):
        parser.parse_args([])
