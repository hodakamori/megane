"""Dump PDB snapshot as binary to stdout."""
import sys
from megane.parsers.pdb import load_pdb
from megane.protocol import encode_snapshot

structure = load_pdb("tests/fixtures/1crn.pdb")
data = encode_snapshot(structure)
sys.stdout.buffer.write(data)
