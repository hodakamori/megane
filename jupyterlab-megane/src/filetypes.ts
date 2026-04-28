import type { DocumentRegistry } from "@jupyterlab/docregistry";

export const FACTORY_NAME = "megane Molecular Viewer";

export const STRUCTURE_FILETYPES: DocumentRegistry.IFileType[] = [
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
    name: "megane-cif",
    displayName: "CIF",
    extensions: [".cif"],
    mimeTypes: ["chemical/x-cif"],
    fileFormat: "text",
    contentType: "file",
  },
];

export const STRUCTURE_FILETYPE_NAMES = STRUCTURE_FILETYPES.map((f) => f.name);
