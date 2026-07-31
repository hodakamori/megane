import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const manifest = JSON.parse(
  readFileSync(resolve(__dirname, "../../../vscode-megane/package.json"), "utf8"),
) as {
  description: string;
  contributes: {
    customEditors: Array<{
      viewType: string;
      selector: Array<{ filenamePattern: string }>;
    }>;
  };
};

describe("vscode-megane package.json", () => {
  it("registers the structure viewer custom editor with the expected file types", () => {
    const editor = manifest.contributes.customEditors.find(
      (e) => e.viewType === "megane.structureViewer",
    );
    expect(editor).toBeDefined();
    const patterns = editor!.selector.map((s) => s.filenamePattern).sort();
    expect(patterns).toEqual(
      [
        "*.cif",
        "*.data",
        "*.dcd",
        "*.dump",
        "*.gro",
        "*.lammps",
        "*.lammpstrj",
        "*.mmcif",
        "*.mol",
        "*.mol2",
        "*.nc",
        "*.pdb",
        "*.prmtop",
        "*.sdf",
        "*.traj",
        "*.trj",
        "*.vasp",
        "*.xtc",
        "*.xyz",
        "*.jxyz",
        "*.molden",
        "*.xsf",
        "*.axsf",
        // JCAMP-DX spectra. `*.dx` is intentionally absent — it collides with
        // OpenDX volumetric grids and only content sniffing separates them.
        "*.jdx",
        "*.jcamp",
        "*.phonon",
        // VASP's standard filenames carry no extension, so the selector needs
        // basename globs alongside the `*.vasp` extension pattern.
        "POSCAR*",
        "CONTCAR*",
        "XDATCAR*",
      ].sort(),
    );
  });

  it("mentions XCrySDen XSF in the marketplace description", () => {
    expect(manifest.description).toContain("XCrySDen XSF");
  });

  it("mentions VASP in the marketplace description", () => {
    expect(manifest.description).toContain("VASP");
  });

  it("mentions the Jmol .jxyz alias in the marketplace description", () => {
    expect(manifest.description).toContain(".jxyz");
  });

  it("mentions Molden in the marketplace description", () => {
    expect(manifest.description).toContain("Molden");
  });

  it("mentions JCAMP-DX in the marketplace description", () => {
    expect(manifest.description).toContain("JCAMP-DX");
  });
  it("mentions CASTEP phonon in the marketplace description", () => {
    expect(manifest.description).toContain("CASTEP phonon");
  });
});
