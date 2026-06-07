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
    Color,
    Filter,
    Isosurface,
    LoadStructure,
    LoadTrajectory,
    LoadVector,
    LoadVolumetric,
    Modify,
    Pipeline,
    Replicate,
    Representation,
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
    "Color",
    "Filter",
    "build_pipeline",
    "Isosurface",
    "LoadStructure",
    "LoadTrajectory",
    "LoadVector",
    "LoadVolumetric",
    "MolecularViewer",
    "Modify",
    "Pipeline",
    "Replicate",
    "Representation",
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
__version__ = "0.8.0"
