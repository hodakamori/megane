"""megane - A fast, beautiful molecular viewer."""

from megane.parsers.cif import load_cif
from megane.parsers.lammps_data import load_lammps_data
from megane.parsers.pdb import load_pdb
from megane.parsers.traj import load_traj
from megane.parsers.xtc import load_trajectory
from megane.parsers.xyz import load_xyz_trajectory
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
    build_pipeline,
    view,
    view_traj,
)
from megane.widget import MolecularViewer

__all__ = [
    "AddBonds",
    "AddLabels",
    "AddPolyhedra",
    "Filter",
    "build_pipeline",
    "LoadStructure",
    "LoadTrajectory",
    "LoadVector",
    "MolecularViewer",
    "Modify",
    "Pipeline",
    "Streaming",
    "VectorOverlay",
    "Viewport",
    "load_cif",
    "load_lammps_data",
    "load_pdb",
    "load_traj",
    "load_trajectory",
    "load_xyz_trajectory",
    "view",
    "view_traj",
]
__version__ = "0.6.2"
