import { describe, it, expect } from "vitest";

import {
  buildToolDefinitions,
  executeSkill,
  getSkills,
  loadSkills,
  type PipelineSkill,
} from "../../../jupyterlab-megane/src/skillLoaderStub";

describe("jupyterlab skillLoaderStub", () => {
  it("loadSkills returns an empty array (and a fresh reference each call)", () => {
    const first = loadSkills();
    const second = loadSkills();
    expect(first).toEqual([]);
    expect(second).toEqual([]);
    expect(first).not.toBe(second);
  });

  it("getSkills returns an empty array", () => {
    expect(getSkills()).toEqual([]);
  });

  it("buildToolDefinitions returns an empty array regardless of input", () => {
    expect(buildToolDefinitions([])).toEqual([]);
    const skills: PipelineSkill[] = [
      { name: "foo", description: "d1", content: "c1" },
      { name: "bar", description: "d2", content: "c2" },
    ];
    expect(buildToolDefinitions(skills)).toEqual([]);
  });

  it("executeSkill returns null on an empty skill set", () => {
    expect(executeSkill([], "anything")).toBeNull();
  });

  it("executeSkill ignores its arguments and still returns null", () => {
    const skills: PipelineSkill[] = [
      { name: "skill-name", description: "d", content: "c" },
    ];
    expect(executeSkill(skills, "skill-name")).toBeNull();
  });
});
