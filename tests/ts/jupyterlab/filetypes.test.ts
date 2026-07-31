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

  it("ships thirteen text structure filetypes (incl. LAMMPS dump, AMBER prmtop, mmCIF, VASP, and CML)", () => {
    expect(STRUCTURE_FILETYPES_TEXT).toHaveLength(13);
  });

  it("includes the canonical PDB / GRO / XYZ / MOL / SDF / MOL2 / CIF / mmCIF / LAMMPS-data / LAMMPS-dump / AMBER-prmtop / VASP names", () => {
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
        "megane-mmcif",
        "megane-lammps-data",
        "megane-lammps-dump",
        "megane-amber-prmtop",
        "megane-cml",
        "megane-vasp",
      ].sort(),
    );
  });

  it("registers .cml for the Chemical Markup Language filetype", () => {
    const cml = STRUCTURE_FILETYPES_TEXT.find((f) => f.name === "megane-cml");
    expect(cml).toBeDefined();
    expect(cml?.extensions).toEqual([".cml"]);
    expect(cml?.fileFormat).toBe("text");
  });

  it("registers the VASP filetype with .vasp plus a basename pattern for POSCAR/CONTCAR/XDATCAR", () => {
    const vasp = STRUCTURE_FILETYPES_TEXT.find((f) => f.name === "megane-vasp");
    expect(vasp).toBeDefined();
    expect(vasp?.extensions).toEqual([".vasp"]);
    expect(vasp?.fileFormat).toBe("text");
    // JupyterLab matches `pattern` against the basename before falling back to
    // extensions, which is the only way an extensionless POSCAR can open.
    const re = new RegExp(vasp!.pattern!);
    expect(re.test("POSCAR")).toBe(true);
    expect(re.test("CONTCAR_relaxed")).toBe(true);
    expect(re.test("XDATCAR-run2")).toBe(true);
    expect(re.test("xdatcar")).toBe(true);
    expect(re.test("MyPOSCAR")).toBe(false);
    expect(re.test("notes.txt")).toBe(false);
  });

  it("registers both .data and .lammps for the LAMMPS-data filetype", () => {
    const lammps = STRUCTURE_FILETYPES_TEXT.find((f) => f.name === "megane-lammps-data");
    expect(lammps).toBeDefined();
    expect(lammps?.extensions).toEqual([".data", ".lammps"]);
  });

  it("registers .lammpstrj, .dump, and .trj for the LAMMPS-dump filetype", () => {
    const dump = STRUCTURE_FILETYPES_TEXT.find((f) => f.name === "megane-lammps-dump");
    expect(dump).toBeDefined();
    expect(dump?.extensions).toEqual([".lammpstrj", ".dump", ".trj"]);
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
    expect(STRUCTURE_FILETYPE_NAMES_TEXT).toEqual(STRUCTURE_FILETYPES_TEXT.map((f) => f.name));
    expect(STRUCTURE_FILETYPE_NAMES_BINARY).toEqual(STRUCTURE_FILETYPES_BINARY.map((f) => f.name));
    expect(STRUCTURE_FILETYPE_NAMES_TEXT).toHaveLength(13);
    expect(STRUCTURE_FILETYPE_NAMES_BINARY).toHaveLength(4);
  });
});
