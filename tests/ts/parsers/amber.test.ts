import { describe, it, expect } from "vitest";
import { STRUCTURE_FILETYPES_TEXT } from "../../../jupyterlab-megane/src/filetypes";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const vscodeManifest = JSON.parse(
  readFileSync(resolve(__dirname, "../../../vscode-megane/package.json"), "utf8"),
) as {
  contributes: {
    customEditors: Array<{
      viewType: string;
      selector: Array<{ filenamePattern: string }>;
    }>;
  };
};

describe("AMBER prmtop format registration", () => {
  describe("JupyterLab filetypes", () => {
    it("registers megane-amber-prmtop as a text filetype", () => {
      const entry = STRUCTURE_FILETYPES_TEXT.find((f) => f.name === "megane-amber-prmtop");
      expect(entry).toBeDefined();
    });

    it("registers .prmtop extension for the AMBER prmtop filetype", () => {
      const entry = STRUCTURE_FILETYPES_TEXT.find((f) => f.name === "megane-amber-prmtop");
      expect(entry?.extensions).toContain(".prmtop");
    });

    it("uses text fileFormat for prmtop (not binary)", () => {
      const entry = STRUCTURE_FILETYPES_TEXT.find((f) => f.name === "megane-amber-prmtop");
      expect(entry?.fileFormat).toBe("text");
    });
  });

  describe("VSCode customEditors", () => {
    it("includes *.prmtop in the structure viewer selector", () => {
      const editor = vscodeManifest.contributes.customEditors.find(
        (e) => e.viewType === "megane.structureViewer",
      );
      const patterns = editor?.selector.map((s) => s.filenamePattern) ?? [];
      expect(patterns).toContain("*.prmtop");
    });
  });
});
