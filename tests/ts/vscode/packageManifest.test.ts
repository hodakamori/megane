import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const manifest = JSON.parse(
  readFileSync(resolve(__dirname, "../../../vscode-megane/package.json"), "utf8"),
) as {
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
        "*.mol",
        "*.mol2",
        "*.nc",
        "*.pdb",
        "*.sdf",
        "*.traj",
        "*.xtc",
        "*.xyz",
      ].sort(),
    );
  });
});
