"""megane - A fast, beautiful molecular viewer."""

from megane.parsers.pdb import load_pdb
from megane.parsers.xtc import load_trajectory

__all__ = ["load_pdb", "load_trajectory"]
__version__ = "0.1.0"
