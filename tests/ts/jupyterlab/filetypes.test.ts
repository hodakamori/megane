import { describe, it, expect } from "vitest";

import {
  FACTORY_NAME,
  FACTORY_NAME_BINARY,
  FACTORY_NAME_PIPELINE,
  PIPELINE_FILETYPE,
  PIPELINE_FILETYPE_NAME,
  STRUCTURE_FILETYPES_BINARY,
  STRUCTURE_FILETYPES_TEXT,
  STRUCTURE_FILETYPE_NAMES_BINARY,
  STRUCTURE_FILETYPE_NAMES_TEXT,
} from "../../../jupyterlab-megane/src/filetypes";

describe("jupyterlab filetypes", () => {
  it("declares three distinct non-empty factory names", () => {
    const names = [FACTORY_NAME, FACTORY_NAME_BINARY, FACTORY_NAME_PIPELINE];
    for (const name of names) {
      expect(typeof name).toBe("string");
      expect(name.length).toBeGreaterThan(0);
    }
    expect(new Set(names).size).toBe(3);
  });

  it("aligns PIPELINE_FILETYPE_NAME with PIPELINE_FILETYPE.name", () => {
    expect(PIPELINE_FILETYPE_NAME).toBe("megane-pipeline");
    expect(PIPELINE_FILETYPE.name).toBe(PIPELINE_FILETYPE_NAME);
  });

  it("declares the pipeline filetype with .megane.json extension and JSON mime", () => {
    expect(PIPELINE_FILETYPE.extensions).toEqual([".megane.json"]);
    expect(PIPELINE_FILETYPE.mimeTypes).toEqual(["application/json"]);
    expect(PIPELINE_FILETYPE.fileFormat).toBe("text");
    expect(PIPELINE_FILETYPE.contentType).toBe("file");
  });

  it("ships nine text structure filetypes (incl. LAMMPS dump trajectory)", () => {
    expect(STRUCTURE_FILETYPES_TEXT).toHaveLength(9);
  });

  it("includes the canonical PDB / GRO / XYZ / MOL / SDF / MOL2 / CIF / LAMMPS-data / LAMMPS-dump names", () => {
    const names = STRUCTURE_FILETYPES_TEXT.map((f) => f.name).sort();
    expect(names).toEqual(
      [
        "megane-pdb",
        "megane-gro",
        "megane-xyz",
        "megane-mol",
        "megane-sdf",
        "megane-mol2",
        "megane-cif",
        "megane-lammps-data",
        "megane-lammps-dump",
      ].sort(),
    );
  });

  it("registers both .data and .lammps for the LAMMPS-data filetype", () => {
    const lammps = STRUCTURE_FILETYPES_TEXT.find((f) => f.name === "megane-lammps-data");
    expect(lammps).toBeDefined();
    expect(lammps?.extensions).toEqual([".data", ".lammps"]);
  });

  it("registers both .lammpstrj and .dump for the LAMMPS-dump filetype", () => {
    const dump = STRUCTURE_FILETYPES_TEXT.find((f) => f.name === "megane-lammps-dump");
    expect(dump).toBeDefined();
    expect(dump?.extensions).toEqual([".lammpstrj", ".dump"]);
    expect(dump?.fileFormat).toBe("text");
  });

  it("ships ASE-traj, XTC, DCD, and AMBER NetCDF binary filetypes", () => {
    expect(STRUCTURE_FILETYPES_BINARY).toHaveLength(4);
    const names = STRUCTURE_FILETYPES_BINARY.map((f) => f.name).sort();
    expect(names).toEqual(["megane-ase-traj", "megane-dcd", "megane-netcdf", "megane-xtc"]);
    for (const ft of STRUCTURE_FILETYPES_BINARY) {
      expect(ft.fileFormat).toBe("base64");
      expect(ft.contentType).toBe("file");
    }
    const xtc = STRUCTURE_FILETYPES_BINARY.find((f) => f.name === "megane-xtc");
    expect(xtc?.extensions).toEqual([".xtc"]);
    const dcd = STRUCTURE_FILETYPES_BINARY.find((f) => f.name === "megane-dcd");
    expect(dcd?.extensions).toEqual([".dcd"]);
    const nc = STRUCTURE_FILETYPES_BINARY.find((f) => f.name === "megane-netcdf");
    expect(nc?.extensions).toEqual([".nc"]);
  });

  it("ensures every extension starts with '.' and every name is unique across all arrays", () => {
    const allFiletypes = [
      PIPELINE_FILETYPE,
      ...STRUCTURE_FILETYPES_TEXT,
      ...STRUCTURE_FILETYPES_BINARY,
    ];
    const allExtensions = allFiletypes.flatMap((f) => f.extensions ?? []);
    for (const ext of allExtensions) {
      expect(ext.startsWith(".")).toBe(true);
    }
    const allNames = allFiletypes.map((f) => f.name);
    expect(new Set(allNames).size).toBe(allNames.length);
  });

  it("derives the *_NAMES_* arrays from .map(f => f.name)", () => {
    expect(STRUCTURE_FILETYPE_NAMES_TEXT).toEqual(
      STRUCTURE_FILETYPES_TEXT.map((f) => f.name),
    );
    expect(STRUCTURE_FILETYPE_NAMES_BINARY).toEqual(
      STRUCTURE_FILETYPES_BINARY.map((f) => f.name),
    );
    expect(STRUCTURE_FILETYPE_NAMES_TEXT).toHaveLength(9);
    expect(STRUCTURE_FILETYPE_NAMES_BINARY).toHaveLength(4);
  });
});
