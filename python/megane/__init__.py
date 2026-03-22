"""megane - A fast, beautiful molecular viewer."""

from megane.parsers.lammps_data import load_lammps_data
from megane.parsers.pdb import load_pdb
from megane.parsers.traj import load_traj
from megane.parsers.xtc import load_trajectory
from megane.pipeline import (
    AddBonds,
    AddLabels,
    AddPolyhedra,
    Filter,
    LoadStructure,
    LoadTrajectory,
    LoadVector,
    Modify,
    Pipeline,
    Streaming,
    VectorOverlay,
    Viewport,
    view,
    view_traj,
)
from megane.widget import MolecularViewer

__all__ = [
    "AddBonds",
    "AddLabels",
    "AddPolyhedra",
    "Filter",
    "LoadStructure",
    "LoadTrajectory",
    "LoadVector",
    "MolecularViewer",
    "Modify",
    "Pipeline",
    "Streaming",
    "VectorOverlay",
    "Viewport",
    "load_lammps_data",
    "load_pdb",
    "load_traj",
    "load_trajectory",
    "view",
    "view_traj",
]
__version__ = "0.5.0"
