import { describe, it, expect } from "vitest";
import {
  VASP_EXT,
  isVaspBareName,
  matchesStructureName,
  structureExtFromFileName,
} from "@/parsers/fileNames";

describe("isVaspBareName", () => {
  it.each(["POSCAR", "CONTCAR", "XDATCAR", "poscar", "contcar", "xdatcar"])(
    "recognises the bare VASP filename %s",
    (name) => {
      expect(isVaspBareName(name)).toBe(true);
    },
  );

  it.each(["POSCAR.bak", "CONTCAR_relaxed", "XDATCAR-run2", "poscar.old"])(
    "recognises the suffixed VASP filename %s",
    (name) => {
      expect(isVaspBareName(name)).toBe(true);
    },
  );

  it("strips directory components before matching", () => {
    expect(isVaspBareName("runs/relax/POSCAR")).toBe(true);
    expect(isVaspBareName("C:\\runs\\CONTCAR")).toBe(true);
  });

  it.each(["MyPOSCAR", "POSCARLIKE", "structure.pdb", "poscarish.xyz", ""])(
    "does not claim %s",
    (name) => {
      expect(isVaspBareName(name)).toBe(false);
    },
  );

  it("does not report a plain .vasp file (the extension path handles it)", () => {
    expect(isVaspBareName("MgO.vasp")).toBe(false);
  });
});

describe("structureExtFromFileName", () => {
  it("maps extensionless VASP filenames onto the synthetic .vasp extension", () => {
    expect(structureExtFromFileName("POSCAR")).toBe(VASP_EXT);
    expect(structureExtFromFileName("XDATCAR")).toBe(VASP_EXT);
    expect(structureExtFromFileName("runs/CONTCAR_relaxed")).toBe(VASP_EXT);
  });

  it("keeps the ordinary extension behaviour for every other format", () => {
    expect(structureExtFromFileName("1crn.pdb")).toBe(".pdb");
    expect(structureExtFromFileName("Water.GRO")).toBe(".gro");
    expect(structureExtFromFileName("traj.multi.xyz")).toBe(".xyz");
    expect(structureExtFromFileName("MgO.vasp")).toBe(".vasp");
  });

  it("falls back when there is no extension at all", () => {
    expect(structureExtFromFileName("README")).toBe(".pdb");
    expect(structureExtFromFileName("README", ".xyz")).toBe(".xyz");
  });

  it("ignores dots in directory names", () => {
    expect(structureExtFromFileName("v1.2/POSCAR")).toBe(VASP_EXT);
    expect(structureExtFromFileName("v1.2/README")).toBe(".pdb");
  });
});

describe("matchesStructureName", () => {
  const exts = [".pdb", ".xyz", ".vasp"];

  it("matches by extension suffix", () => {
    expect(matchesStructureName("1crn.pdb", exts)).toBe(true);
    expect(matchesStructureName("MgO.VASP", exts)).toBe(true);
  });

  it("matches bare VASP filenames when .vasp is accepted", () => {
    expect(matchesStructureName("POSCAR", exts)).toBe(true);
    expect(matchesStructureName("XDATCAR-run2", exts)).toBe(true);
  });

  it("does not match bare VASP filenames when .vasp is not accepted", () => {
    expect(matchesStructureName("POSCAR", [".pdb", ".xyz"])).toBe(false);
  });

  it("rejects unrelated files", () => {
    expect(matchesStructureName("notes.txt", exts)).toBe(false);
  });
});
