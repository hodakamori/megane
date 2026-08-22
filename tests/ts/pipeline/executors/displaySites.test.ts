import { describe, expect, it } from "vitest";
import { collectDisplaySites, displaySiteKey } from "@/pipeline/executors/displaySites";
import type { DrawingBoundaryData } from "@/pipeline/types";

describe("collectDisplaySites", () => {
  const positions = new Float32Array([0, 0, 0, 1, 0, 0]);

  it("returns every source atom at lattice shift zero when no boundary is attached", () => {
    const { sites, byKey } = collectDisplaySites(positions, 2, null);

    expect(sites).toHaveLength(2);
    expect(sites[0]).toEqual({
      sourceIndex: 0,
      dataIndex: 0,
      x: 0,
      y: 0,
      z: 0,
      shiftA: 0,
      shiftB: 0,
      shiftC: 0,
    });
    expect(byKey.get(displaySiteKey(1, 0, 0, 0))?.dataIndex).toBe(1);
  });

  it("hides masked source atoms and appends boundary image copies after the source atoms", () => {
    const boundary: DrawingBoundaryData = {
      min: [0, 0, 0],
      max: [1, 1, 1],
      sourceVisibleMask: new Uint8Array([1, 0]),
      images: {
        positions: new Float32Array([4, 0, 0]),
        elements: new Uint8Array([8]),
        sourceIndices: new Uint32Array([0]),
        latticeShifts: new Int32Array([1, 0, 0]),
      },
    };

    const { sites, byKey } = collectDisplaySites(positions, 2, boundary);

    // Atom 1 is masked out; the single image copy indexes after ALL source atoms.
    expect(sites.map((s) => s.dataIndex)).toEqual([0, 2]);
    expect(byKey.has(displaySiteKey(1, 0, 0, 0))).toBe(false);
    const image = byKey.get(displaySiteKey(0, 1, 0, 0));
    expect(image).toBeDefined();
    expect(image!.dataIndex).toBe(2);
    expect([image!.x, image!.y, image!.z]).toEqual([4, 0, 0]);
    expect([image!.shiftA, image!.shiftB, image!.shiftC]).toEqual([1, 0, 0]);
  });
});
