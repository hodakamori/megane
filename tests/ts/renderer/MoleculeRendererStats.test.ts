import { describe, it, expect } from "vitest";
import { MoleculeRenderer, isMeganeTestMode } from "@/renderer/MoleculeRenderer";

/**
 * getStats() feeds the performance HUD. mount() needs a real WebGL context that
 * jsdom does not provide, so — like the camera-state tests — we instantiate the
 * class without mounting and inject minimal stand-ins for the two fields
 * getStats() reads.
 */
describe("MoleculeRenderer.getStats", () => {
  it("returns zeros before mount (no renderer, fresh counter)", () => {
    const r = new MoleculeRenderer();
    expect(r.getStats()).toEqual({ fps: 0, drawCalls: 0 });
  });

  it("reads draw calls from renderer.info and fps from the counter", () => {
    const r = new MoleculeRenderer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const internals = r as any;
    internals.renderer = { info: { render: { calls: 12 } } };
    internals.fpsCounter = { fps: 55 };
    expect(r.getStats()).toEqual({ fps: 55, drawCalls: 12 });
  });
});

describe("isMeganeTestMode", () => {
  it("returns a boolean", () => {
    expect(typeof isMeganeTestMode()).toBe("boolean");
  });
});
