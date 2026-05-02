import { describe, it, expect } from "vitest";
import { buildTourSteps } from "@/tour/tourSteps";
import packageJson from "../../../package.json";

describe("buildTourSteps", () => {
  const steps = buildTourSteps();

  it("returns the expected number of steps", () => {
    expect(steps).toHaveLength(6);
  });

  it("first step is the welcome screen with no anchor element", () => {
    const first = steps[0];
    expect(first.element).toBeUndefined();
    expect(first.popover?.title).toBe("Welcome");
    expect(typeof first.popover?.description).toBe("string");
  });

  it("welcome description embeds the current package version", () => {
    const desc = steps[0].popover?.description as string;
    expect(desc).toContain(`v${packageJson.version}`);
  });

  it("every step has a non-empty popover title", () => {
    for (const step of steps) {
      expect(step.popover?.title).toBeTruthy();
      expect(typeof step.popover?.title).toBe("string");
    }
  });

  it("every step has a description string", () => {
    for (const step of steps) {
      expect(step.popover?.description).toBeTruthy();
      expect(typeof step.popover?.description).toBe("string");
    }
  });

  it("anchored steps point at non-empty selectors", () => {
    const anchored = steps.filter((s) => s.element !== undefined);
    expect(anchored.length).toBeGreaterThan(0);
    for (const step of anchored) {
      expect(typeof step.element).toBe("string");
      expect((step.element as string).length).toBeGreaterThan(0);
    }
  });

  it("anchored selectors are unique", () => {
    const selectors = steps
      .map((s) => s.element)
      .filter((v): v is string => typeof v === "string");
    expect(new Set(selectors).size).toBe(selectors.length);
  });

  it("expected anchors reference the documented data attributes", () => {
    const selectors = steps
      .map((s) => s.element)
      .filter((v): v is string => typeof v === "string");
    expect(selectors).toContain('[data-tour-anchor="viewport"]');
    expect(selectors).toContain('[data-testid="panel-pipeline"]');
    expect(selectors).toContain('[data-testid="pipeline-editor-templates"]');
  });
});
