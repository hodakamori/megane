import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { StructureLayer } from "@/renderer/StructureLayer";
import { CellRenderer } from "@/renderer/CellRenderer";
import type { Snapshot } from "@/types";

/** A two-atom snapshot with an offset simulation box. */
function makeBoxedSnapshot(boxOrigin: number[] | null): Snapshot {
  return {
    nAtoms: 2,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array([165, 10, 605, 200, 75, 750]),
    elements: new Uint8Array([6, 6]),
    bonds: new Uint32Array(),
    bondOrders: null,
    box: new Float32Array([80, 0, 0, 0, 150, 0, 0, 0, 300]),
    boxOrigin: boxOrigin === null ? null : new Float32Array(boxOrigin),
  } as Snapshot;
}

describe("StructureLayer cell origin", () => {
  it("draws the layer cell anchored at the snapshot's box origin", () => {
    const scene = new THREE.Scene();
    const layer = new StructureLayer("layer-1", scene);
    layer.loadSnapshot(makeBoxedSnapshot([160, 0, 600]));

    const cell = (layer as unknown as { cellRenderer: CellRenderer | null }).cellRenderer;
    expect(cell).not.toBeNull();
    const buf = cell!.mesh.geometry.getAttribute("position").array as Float32Array;
    // Edge 0 starts at the origin corner (xlo, ylo, zlo).
    expect([buf[0], buf[1], buf[2]]).toEqual([160, 0, 600]);
    // Far corner = origin + (va+vb+vc).
    expect([buf[69], buf[70], buf[71]]).toEqual([240, 150, 900]);
  });

  it("anchors the layer cell at the world origin when boxOrigin is null", () => {
    const scene = new THREE.Scene();
    const layer = new StructureLayer("layer-2", scene);
    layer.loadSnapshot(makeBoxedSnapshot(null));

    const cell = (layer as unknown as { cellRenderer: CellRenderer | null }).cellRenderer;
    const buf = cell!.mesh.geometry.getAttribute("position").array as Float32Array;
    expect([buf[0], buf[1], buf[2]]).toEqual([0, 0, 0]);
    expect([buf[69], buf[70], buf[71]]).toEqual([80, 150, 300]);
  });
});
