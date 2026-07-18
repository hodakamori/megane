import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { CellRenderer } from "@/renderer/CellRenderer";

/** Read the flat position buffer (72 floats = 12 edges × 2 verts × 3). */
function positions(cr: CellRenderer): Float32Array {
  const attr = cr.mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
  return attr.array as Float32Array;
}

describe("CellRenderer.loadBox", () => {
  // Orthogonal box: va=(10,0,0), vb=(0,20,0), vc=(0,0,30).
  const BOX = new Float32Array([10, 0, 0, 0, 20, 0, 0, 0, 30]);

  it("anchors the box at the world origin when no origin is given", () => {
    const cr = new CellRenderer();
    cr.loadBox(BOX);
    const buf = positions(cr);
    // Edge 0 is [o, a]; its first vertex is the origin corner.
    expect([buf[0], buf[1], buf[2]]).toEqual([0, 0, 0]);
    // Edge 11 is [ab, abc]; its last vertex is the far corner va+vb+vc.
    expect([buf[69], buf[70], buf[71]]).toEqual([10, 20, 30]);
    expect(cr.mesh.visible).toBe(true);
  });

  it("offsets every vertex by the box origin", () => {
    const cr = new CellRenderer();
    const origin = new Float32Array([100, 200, 600]);
    cr.loadBox(BOX, origin);
    const buf = positions(cr);
    // Origin corner shifts to the lower corner.
    expect([buf[0], buf[1], buf[2]]).toEqual([100, 200, 600]);
    // Far corner is origin + (va+vb+vc).
    expect([buf[69], buf[70], buf[71]]).toEqual([110, 220, 630]);
  });

  it("treats a null origin the same as omitting it", () => {
    const withNull = new CellRenderer();
    withNull.loadBox(BOX, null);
    const withNone = new CellRenderer();
    withNone.loadBox(BOX);
    expect(Array.from(positions(withNull))).toEqual(Array.from(positions(withNone)));
  });
});
