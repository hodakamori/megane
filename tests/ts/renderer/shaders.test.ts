import { describe, it, expect } from "vitest";
import {
  atomVertexShader,
  atomFragmentShader,
  bondVertexShader,
  bondFragmentShader,
} from "@/renderer/shaders";

const ALL_SHADERS = {
  atomVertexShader,
  atomFragmentShader,
  bondVertexShader,
  bondFragmentShader,
};

describe("shaders module", () => {
  it("exports four non-empty GLSL strings", () => {
    for (const [name, src] of Object.entries(ALL_SHADERS)) {
      expect(typeof src, name).toBe("string");
      expect(src.length, name).toBeGreaterThan(0);
    }
  });

  it("declares high precision floats and ints (RawShaderMaterial requires explicit precision)", () => {
    for (const [name, src] of Object.entries(ALL_SHADERS)) {
      expect(src, name).toMatch(/precision\s+highp\s+float/);
    }
  });

  it("vertex shaders write gl_Position", () => {
    expect(atomVertexShader).toMatch(/gl_Position\s*=/);
    expect(bondVertexShader).toMatch(/gl_Position\s*=/);
  });

  it("fragment shaders declare an `out` color and assign it", () => {
    expect(atomFragmentShader).toMatch(/out\s+vec4\s+fragColor/);
    expect(atomFragmentShader).toMatch(/fragColor\s*=/);
    expect(bondFragmentShader).toMatch(/out\s+vec4\s+fragColor/);
    expect(bondFragmentShader).toMatch(/fragColor\s*=/);
  });
});

describe("atom shaders", () => {
  it("vertex shader declares per-instance attributes consumed by InstancedBufferGeometry", () => {
    const required = [
      "instanceCenter",
      "instanceRadius",
      "instanceColor",
      "instanceScaleOverride",
      "instanceOpacityOverride",
    ];
    for (const attr of required) {
      expect(atomVertexShader, attr).toMatch(new RegExp(`\\bin\\b[^;]*\\b${attr}\\b`));
    }
  });

  it("vertex shader passes through varyings used by the fragment shader", () => {
    const varyings = ["vColor", "vUv", "vRadius", "vViewCenter", "vOpacityOverride"];
    for (const v of varyings) {
      expect(atomVertexShader, `${v} out`).toMatch(new RegExp(`\\bout\\b[^;]*\\b${v}\\b`));
      expect(atomFragmentShader, `${v} in`).toMatch(new RegExp(`\\bin\\b[^;]*\\b${v}\\b`));
    }
  });

  it("vertex shader gates per-atom overrides on uUsePerAtomOverrides", () => {
    expect(atomVertexShader).toMatch(/uUsePerAtomOverrides\s*==\s*1/);
    expect(atomFragmentShader).toMatch(/uUsePerAtomOverrides\s*==\s*1/);
  });

  it("fragment shader writes gl_FragDepth for correct depth on impostor spheres", () => {
    expect(atomFragmentShader).toMatch(/gl_FragDepth\s*=/);
  });

  it("fragment shader discards pixels outside the unit disk (impostor mask)", () => {
    // dot(vUv, vUv) > 1.0 → outside the sphere silhouette → discard
    expect(atomFragmentShader).toMatch(/dot\(vUv,\s*vUv\)/);
    expect(atomFragmentShader).toMatch(/discard/);
  });
});

describe("bond shaders", () => {
  it("vertex shader declares per-instance attributes used for endpoint lookups", () => {
    const required = [
      "instanceAtomA",
      "instanceAtomB",
      "instanceOffsetX",
      "instanceOffsetY",
      "instanceColor",
      "instanceRadius",
      "instanceDashed",
      "instanceBondOpacity",
    ];
    for (const attr of required) {
      expect(bondVertexShader, attr).toMatch(new RegExp(`\\bin\\b[^;]*\\b${attr}\\b`));
    }
  });

  it("vertex shader fetches atom positions from the position texture", () => {
    expect(bondVertexShader).toMatch(/uPositionTex\b/);
    expect(bondVertexShader).toMatch(/texelFetch\(/);
  });

  it("fragment shader supports dashed bonds via vDashed varying", () => {
    expect(bondVertexShader).toMatch(/\bout\b[^;]*\bvDashed\b/);
    expect(bondFragmentShader).toMatch(/\bin\b[^;]*\bvDashed\b/);
    expect(bondFragmentShader).toMatch(/discard/);
  });

  it("fragment shader respects per-bond opacity gating on uUsePerBondOverrides", () => {
    expect(bondFragmentShader).toMatch(/uUsePerBondOverrides\s*==\s*1/);
  });
});
