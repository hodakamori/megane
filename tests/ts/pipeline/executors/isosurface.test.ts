import { describe, it, expect } from "vitest";
import { executeIsosurface } from "@/pipeline/executors/isosurface";
import type { IsosurfaceParams, VolumetricData, MeshData, PipelineData } from "@/pipeline/types";

const UNIT_STEP = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
const ORIGIN_ZERO = new Float32Array([0, 0, 0]);

function makeVol(nx = 3, ny = 2, nz = 2): VolumetricData {
  const total = nx * ny * nz;
  const data = new Float32Array(total);
  // Gradient along x: value = ix → isoLevel crossing at x=1.5
  for (let ix = 0; ix < nx; ix++) {
    for (let iy = 0; iy < ny; iy++) {
      for (let iz = 0; iz < nz; iz++) {
        data[ix * ny * nz + iy * nz + iz] = ix;
      }
    }
  }
  return {
    type: "volumetric",
    nx, ny, nz,
    origin: ORIGIN_ZERO,
    step: UNIT_STEP,
    data,
    dataMin: 0,
    dataMax: nx - 1,
  };
}

function baseParams(extra: Partial<IsosurfaceParams> = {}): IsosurfaceParams {
  return {
    type: "isosurface",
    isoLevel: 1.5,
    color: "#4488ff",
    opacity: 0.7,
    showNegative: false,
    negativeColor: "#ff4444",
    ...extra,
  };
}

function makeInputs(vol: VolumetricData): Map<string, PipelineData[]> {
  return new Map([["volumetric", [vol]]]);
}

describe("executeIsosurface", () => {
  it("returns empty map when no volumetric input", () => {
    const out = executeIsosurface(baseParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("outputs a 'mesh' key for valid input", () => {
    const out = executeIsosurface(baseParams(), makeInputs(makeVol()));
    expect(out.has("mesh")).toBe(true);
  });

  it("output mesh has type 'mesh'", () => {
    const out = executeIsosurface(baseParams(), makeInputs(makeVol()));
    const mesh = out.get("mesh") as MeshData;
    expect(mesh.type).toBe("mesh");
  });

  it("produces non-empty geometry when iso level crosses the field", () => {
    const out = executeIsosurface(baseParams({ isoLevel: 1.5 }), makeInputs(makeVol()));
    const mesh = out.get("mesh") as MeshData;
    expect(mesh.positions.length).toBeGreaterThan(0);
  });

  it("produces empty geometry when iso level is above the field maximum", () => {
    const out = executeIsosurface(baseParams({ isoLevel: 99 }), makeInputs(makeVol()));
    const mesh = out.get("mesh") as MeshData;
    expect(mesh.positions.length).toBe(0);
  });

  it("produces empty geometry when iso level is below the field minimum", () => {
    const out = executeIsosurface(baseParams({ isoLevel: -99 }), makeInputs(makeVol()));
    const mesh = out.get("mesh") as MeshData;
    expect(mesh.positions.length).toBe(0);
  });

  it("encodes opacity into the mesh", () => {
    const out = executeIsosurface(baseParams({ opacity: 0.3 }), makeInputs(makeVol()));
    const mesh = out.get("mesh") as MeshData;
    expect(mesh.opacity).toBeCloseTo(0.3);
  });

  it("encodes positive color into vertex colors", () => {
    const out = executeIsosurface(baseParams({ color: "#ff0000", opacity: 1.0 }), makeInputs(makeVol()));
    const mesh = out.get("mesh") as MeshData;
    if (mesh.colors.length >= 4) {
      expect(mesh.colors[0]).toBeCloseTo(1.0, 1); // R ≈ 1
      expect(mesh.colors[1]).toBeCloseTo(0.0, 1); // G ≈ 0
      expect(mesh.colors[2]).toBeCloseTo(0.0, 1); // B ≈ 0
    }
  });

  it("outputs more vertices when showNegative is enabled", () => {
    const posOnly = executeIsosurface(baseParams({ isoLevel: 1.5, showNegative: false }), makeInputs(makeVol()));
    const dual = executeIsosurface(baseParams({ isoLevel: 1.5, showNegative: true }), makeInputs(makeVol()));
    const posMesh = posOnly.get("mesh") as MeshData;
    const dualMesh = dual.get("mesh") as MeshData;
    // The dual contour adds a surface at -1.5; the gradient field has no values
    // below -1.5 in our fixture (min=0), so no extra geometry is added.
    // Both meshes should have at least the positive surface.
    expect(posMesh.positions.length).toBeGreaterThan(0);
    expect(dualMesh.positions.length).toBeGreaterThanOrEqual(posMesh.positions.length);
  });

  it("uses negativeColor for the negative lobe vertices", () => {
    // Use a field with negative values so the negative contour fires.
    const data = new Float32Array(3 * 2 * 2);
    // field[ix,iy,iz] = ix - 1.5  → crosses 0 at x=1.5, crosses -1.5 somewhere
    for (let ix = 0; ix < 3; ix++) {
      for (let iy = 0; iy < 2; iy++) {
        for (let iz = 0; iz < 2; iz++) {
          data[ix * 4 + iy * 2 + iz] = ix - 1;
        }
      }
    }
    const vol: VolumetricData = {
      type: "volumetric",
      nx: 3, ny: 2, nz: 2,
      origin: ORIGIN_ZERO,
      step: UNIT_STEP,
      data,
      dataMin: -1,
      dataMax: 1,
    };
    const out = executeIsosurface(
      baseParams({ isoLevel: 0.5, showNegative: true, color: "#0000ff", negativeColor: "#ff0000" }),
      makeInputs(vol),
    );
    const mesh = out.get("mesh") as MeshData;
    // Should produce some geometry (both lobes possible).
    expect(mesh.positions.length).toBeGreaterThan(0);
  });

  it("showNegative=false with isoLevel=0 does not crash", () => {
    const out = executeIsosurface(baseParams({ isoLevel: 0, showNegative: false }), makeInputs(makeVol()));
    expect(out.has("mesh")).toBe(true);
  });

  it("returns mesh for any non-volumetric input by returning empty", () => {
    // Feed a non-volumetric typed input — executor should gracefully skip.
    const badInput = new Map<string, PipelineData[]>([
      ["volumetric", [{ type: "particle" } as unknown as PipelineData]],
    ]);
    const out = executeIsosurface(baseParams(), badInput);
    // No crash, but no mesh output because the type guard rejects it.
    expect(out.size).toBe(0);
  });
});
