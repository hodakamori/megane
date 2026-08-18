import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { executeCoordinationGenerator } from "@/pipeline/executors/coordinationGenerator";
import { executeDrawingBoundary } from "@/pipeline/executors/drawingBoundary";
import type { CoordinationData, ParticleData, PipelineData } from "@/pipeline/types";
import type { Snapshot } from "@/types";

function readZn3In2O6Cif(path: string): Snapshot {
  const text = readFileSync(path, "utf8");
  const value = (tag: string): number => {
    const match = text.match(new RegExp(`^${tag}\\s+([\\d.]+)`, "m"));
    if (!match) throw new Error(`Missing ${tag}`);
    return Number(match[1]);
  };
  const a = value("_cell_length_a");
  const b = value("_cell_length_b");
  const c = value("_cell_length_c");
  const gamma = (value("_cell_angle_gamma") * Math.PI) / 180;
  const box = new Float32Array([a, 0, 0, b * Math.cos(gamma), b * Math.sin(gamma), 0, 0, 0, c]);
  const positions: number[] = [];
  const elements: number[] = [];

  for (const line of text.split(/\r?\n/)) {
    const fields = line.trim().split(/\s+/);
    if (fields.length !== 7 || !["Zn", "In", "O"].includes(fields[0])) continue;
    const fx = Number(fields[3]);
    const fy = Number(fields[4]);
    const fz = Number(fields[5]);
    positions.push(
      fx * box[0] + fy * box[3] + fz * box[6],
      fx * box[1] + fy * box[4] + fz * box[7],
      fx * box[2] + fy * box[5] + fz * box[8],
    );
    elements.push(fields[0] === "Zn" ? 30 : fields[0] === "In" ? 49 : 8);
  }

  return {
    nAtoms: elements.length,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(positions),
    elements: new Uint8Array(elements),
    bonds: new Uint32Array(),
    bondOrders: null,
    box,
    boxOrigin: null,
    atomChainIds: null,
    atomBFactors: null,
  };
}

describe("Zn3In2O6 periodic coordination", () => {
  it("retains every periodic ligand image within the coordination cutoff", () => {
    const snapshot = readZn3In2O6Cif(
      resolve(process.cwd(), "tests/fixtures/zn3in2o6_periodic.cif"),
    );
    const particle: ParticleData = {
      type: "particle",
      source: snapshot,
      sourceNodeId: "zn3in2o6",
      indices: null,
      scaleOverrides: null,
      opacityOverrides: null,
      colorOverrides: null,
      representationOverride: null,
    };
    const coordination = executeCoordinationGenerator(
      {
        type: "coordination_generator",
        excludedCenters: [],
        excludedLigands: [],
        cutoffTolerance: 1.15,
        boundaryMode: "complete",
      },
      new Map<string, PipelineData[]>([["particle", [particle]]]),
    ).get("coordination") as CoordinationData;

    expect(snapshot.nAtoms).toBe(33);
    expect(coordination.nBonds).toBe(69);
    const degrees = new Array(15).fill(0);
    for (let bond = 0; bond < coordination.nBonds; bond++) {
      degrees[coordination.bondIndices[bond * 2]]++;
    }
    expect(degrees.slice(0, 9)).toEqual(new Array(9).fill(4));
    expect(degrees.slice(9).sort((left, right) => left - right)).toEqual([5, 5, 5, 6, 6, 6]);

    const boundaryParticle = executeDrawingBoundary(
      {
        type: "drawing_boundary",
        xMin: 0,
        xMax: 1,
        yMin: 0,
        yMax: 1,
        zMin: 0,
        zMax: 1,
      },
      new Map<string, PipelineData[]>([["particle", [particle]]]),
    ).get("particle") as ParticleData;
    const visibleCoordination = executeCoordinationGenerator(
      {
        type: "coordination_generator",
        excludedCenters: [],
        excludedLigands: [],
        cutoffTolerance: 1.15,
        boundaryMode: "complete",
      },
      new Map<string, PipelineData[]>([["particle", [boundaryParticle]]]),
    ).get("coordination") as CoordinationData;
    expect(visibleCoordination.nBonds).toBe(138);
  });
});
