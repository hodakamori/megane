import type { DocumentRegistry } from "@jupyterlab/docregistry";

export const FACTORY_NAME = "megane Molecular Viewer";
export const FACTORY_NAME_BINARY = "megane Molecular Viewer (binary)";
export const FACTORY_NAME_PIPELINE = "megane Pipeline Viewer";

export const PIPELINE_FILETYPE_NAME = "megane-pipeline";

export const PIPELINE_FILETYPE: DocumentRegistry.IFileType = {
  name: PIPELINE_FILETYPE_NAME,
  displayName: "megane Pipeline",
  extensions: [".megane.json"],
  mimeTypes: ["application/json"],
  fileFormat: "text",
  contentType: "file",
};

export const STRUCTURE_FILETYPES_TEXT: DocumentRegistry.IFileType[] = [
  {
    name: "megane-pdb",
    displayName: "PDB",
    extensions: [".pdb"],
    mimeTypes: ["chemical/x-pdb"],
    fileFormat: "text",
    contentType: "file",
  },
  {
    name: "megane-gro",
    displayName: "GRO",
    extensions: [".gro"],
    mimeTypes: ["chemical/x-gro"],
    fileFormat: "text",
    contentType: "file",
  },
  {
    name: "megane-xyz",
    displayName: "XYZ",
    extensions: [".xyz"],
    mimeTypes: ["chemical/x-xyz"],
    fileFormat: "text",
    contentType: "file",
  },
  {
    name: "megane-mol",
    displayName: "MOL",
    extensions: [".mol"],
    mimeTypes: ["chemical/x-mdl-molfile"],
    fileFormat: "text",
    contentType: "file",
  },
  {
    name: "megane-sdf",
    displayName: "SDF",
    extensions: [".sdf"],
    mimeTypes: ["chemical/x-mdl-sdfile"],
    fileFormat: "text",
    contentType: "file",
  },
  {
    name: "megane-mol2",
    displayName: "MOL2",
    extensions: [".mol2"],
    mimeTypes: ["chemical/x-mol2"],
    fileFormat: "text",
    contentType: "file",
  },
  {
    name: "megane-cif",
    displayName: "CIF",
    extensions: [".cif"],
    mimeTypes: ["chemical/x-cif"],
    fileFormat: "text",
    contentType: "file",
  },
  {
    name: "megane-lammps-data",
    displayName: "LAMMPS data",
    extensions: [".data", ".lammps"],
    mimeTypes: ["chemical/x-lammps-data"],
    fileFormat: "text",
    contentType: "file",
  },
  {
    name: "megane-lammps-dump",
    displayName: "LAMMPS dump",
    extensions: [".lammpstrj", ".dump"],
    mimeTypes: ["chemical/x-lammps-dump"],
    fileFormat: "text",
    contentType: "file",
  },
];

export const STRUCTURE_FILETYPES_BINARY: DocumentRegistry.IFileType[] = [
  {
    name: "megane-ase-traj",
    displayName: "ASE trajectory",
    extensions: [".traj"],
    mimeTypes: ["application/octet-stream"],
    fileFormat: "base64",
    contentType: "file",
  },
  {
    name: "megane-xtc",
    displayName: "XTC trajectory",
    extensions: [".xtc"],
    mimeTypes: ["chemical/x-xtc"],
    fileFormat: "base64",
    contentType: "file",
  },
  {
    name: "megane-netcdf",
    displayName: "AMBER NetCDF trajectory",
    extensions: [".nc"],
    mimeTypes: ["application/x-netcdf"],
    fileFormat: "base64",
    contentType: "file",
  },
];

export const STRUCTURE_FILETYPE_NAMES_TEXT = STRUCTURE_FILETYPES_TEXT.map((f) => f.name);
export const STRUCTURE_FILETYPE_NAMES_BINARY = STRUCTURE_FILETYPES_BINARY.map((f) => f.name);
