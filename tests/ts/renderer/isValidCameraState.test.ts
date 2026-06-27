import { describe, it, expect } from "vitest";
import { isValidCameraState, type MeganeCameraState } from "@/renderer/MoleculeRenderer";

function valid(overrides: Partial<MeganeCameraState> = {}): MeganeCameraState {
  return {
    mode: "orthographic",
    position: [1, 2, 3],
    target: [0, 0, 0],
    zoom: 1,
    ...overrides,
  };
}

describe("isValidCameraState", () => {
  it("accepts a well-formed orthographic state", () => {
    expect(isValidCameraState(valid())).toBe(true);
  });

  it("accepts a well-formed perspective state", () => {
    expect(isValidCameraState(valid({ mode: "perspective", zoom: 2.5 }))).toBe(true);
  });

  it.each([null, undefined, 42, "x", []])("rejects non-object %p", (v) => {
    expect(isValidCameraState(v)).toBe(false);
  });

  it("rejects an unknown mode", () => {
    expect(isValidCameraState(valid({ mode: "isometric" as unknown as "orthographic" }))).toBe(
      false,
    );
  });

  it("rejects a non-finite position component", () => {
    expect(isValidCameraState(valid({ position: [1, NaN, 3] }))).toBe(false);
    expect(isValidCameraState(valid({ position: [Infinity, 0, 0] }))).toBe(false);
  });

  it("rejects a position that is not a length-3 array", () => {
    expect(
      isValidCameraState(valid({ position: [1, 2] as unknown as [number, number, number] })),
    ).toBe(false);
  });

  it("rejects a non-finite or null target", () => {
    expect(isValidCameraState(valid({ target: [0, 0, NaN] }))).toBe(false);
    expect(isValidCameraState(valid({ target: null as unknown as [number, number, number] }))).toBe(
      false,
    );
  });

  it("rejects zoom <= 0", () => {
    expect(isValidCameraState(valid({ zoom: 0 }))).toBe(false);
    expect(isValidCameraState(valid({ zoom: -1 }))).toBe(false);
  });

  it("rejects a non-finite zoom", () => {
    expect(isValidCameraState(valid({ zoom: NaN }))).toBe(false);
    expect(isValidCameraState(valid({ zoom: Infinity }))).toBe(false);
  });

  it("rejects an absurdly large zoom that would clip the scene blank", () => {
    expect(isValidCameraState(valid({ zoom: 1e9 }))).toBe(false);
  });
});
