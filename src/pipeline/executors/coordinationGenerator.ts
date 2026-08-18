import type {
  BondData,
  CoordinationData,
  CoordinationGeneratorParams,
  ParticleData,
  PeriodicAtomImageData,
  PipelineData,
} from "../types";
import { getCovalentRadius, isDefaultLigand, isMetalLike } from "../../constants";
import { invert3x3 } from "./mathUtils";

interface DisplaySite {
  sourceIndex: number;
  dataIndex: number;
  x: number;
  y: number;
  z: number;
  imageA: number;
  imageB: number;
  imageC: number;
}

type PeriodicDisplacement = [number, number, number, number, number, number];

function siteKey(sourceIndex: number, a: number, b: number, c: number): string {
  return `${sourceIndex}:${a}:${b}:${c}`;
}

function periodicDisplacementsWithinCutoff(
  dx: number,
  dy: number,
  dz: number,
  box: Float32Array,
  inverse: Float32Array,
  cutoffSq: number,
): PeriodicDisplacement[] {
  const fa = inverse[0] * dx + inverse[3] * dy + inverse[6] * dz;
  const fb = inverse[1] * dx + inverse[4] * dy + inverse[7] * dz;
  const fc = inverse[2] * dx + inverse[5] * dy + inverse[8] * dz;
  const cutoff = Math.sqrt(cutoffSq);
  const epsilon = 1e-7;

  // If a Cartesian displacement is within the cutoff, each of its fractional
  // components is bounded by cutoff times the corresponding reciprocal-vector
  // length. These bounds enumerate every lattice image inside the sphere,
  // including multiple equally near images of the same structural atom.
  const radiusA = cutoff * Math.hypot(inverse[0], inverse[3], inverse[6]);
  const radiusB = cutoff * Math.hypot(inverse[1], inverse[4], inverse[7]);
  const radiusC = cutoff * Math.hypot(inverse[2], inverse[5], inverse[8]);
  const aMin = Math.ceil(-fa - radiusA - epsilon);
  const aMax = Math.floor(-fa + radiusA + epsilon);
  const bMin = Math.ceil(-fb - radiusB - epsilon);
  const bMax = Math.floor(-fb + radiusB + epsilon);
  const cMin = Math.ceil(-fc - radiusC - epsilon);
  const cMax = Math.floor(-fc + radiusC + epsilon);
  const images: PeriodicDisplacement[] = [];

  for (let imageA = aMin; imageA <= aMax; imageA++) {
    for (let imageB = bMin; imageB <= bMax; imageB++) {
      for (let imageC = cMin; imageC <= cMax; imageC++) {
        const sa = fa + imageA;
        const sb = fb + imageB;
        const sc = fc + imageC;
        const imageDx = box[0] * sa + box[3] * sb + box[6] * sc;
        const imageDy = box[1] * sa + box[4] * sb + box[7] * sc;
        const imageDz = box[2] * sa + box[5] * sb + box[8] * sc;
        const distanceSq = imageDx * imageDx + imageDy * imageDy + imageDz * imageDz;
        if (distanceSq <= cutoffSq + epsilon && distanceSq > 0.01) {
          images.push([imageDx, imageDy, imageDz, imageA, imageB, imageC]);
        }
      }
    }
  }

  return images;
}

/** Convert directed coordination relationships to the normal bond stream. */
export function coordinationToBondData(coordination: CoordinationData): BondData {
  const source = coordination.particleRef.source;
  const hasExtendedAtoms = coordination.nAtoms > source.nAtoms;
  return {
    type: "bond",
    sourceNodeId: coordination.sourceNodeId,
    bondIndices: coordination.bondIndices,
    bondOrders: null,
    nBonds: coordination.nBonds,
    scale: 1,
    opacity: 1,
    positions: hasExtendedAtoms ? coordination.positions : null,
    elements: hasExtendedAtoms ? coordination.elements : null,
    nAtoms: hasExtendedAtoms ? coordination.nAtoms : 0,
    atomElements: source.elements,
    selectedBondIndices: null,
    bondOpacityOverrides: null,
    periodicImages: coordination.outsideBoundaryImages,
  };
}

/**
 * Build directed center-neighbor relationships from the shared Drawing Boundary
 * atom collection. With the `complete` policy, only neighbor images needed to
 * complete visible centers are appended outside the drawing range.
 */
export function executeCoordinationGenerator(
  params: CoordinationGeneratorParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particle = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particle) return outputs;

  const snapshot = particle.source;
  const { positions, elements, nAtoms } = snapshot;
  const present = new Set<number>(elements);
  const excludedCenters = new Set(params.excludedCenters);
  const excludedLigands = new Set(params.excludedLigands);
  const centerElements = new Set<number>();
  const ligandElements = new Set<number>();
  for (const z of present) {
    if (isMetalLike(z) && !excludedCenters.has(z)) centerElements.add(z);
    if (isDefaultLigand(z) && !excludedLigands.has(z)) ligandElements.add(z);
  }
  if (centerElements.size === 0 || ligandElements.size === 0) return outputs;

  const ligandSourceIndices: number[] = [];
  for (let atom = 0; atom < nAtoms; atom++) {
    if (ligandElements.has(elements[atom])) ligandSourceIndices.push(atom);
  }

  const cutoffSq = new Map<number, Map<number, number>>();
  for (const centerZ of centerElements) {
    const byLigand = new Map<number, number>();
    for (const ligandZ of ligandElements) {
      const cutoff =
        (getCovalentRadius(centerZ) + getCovalentRadius(ligandZ)) * params.cutoffTolerance;
      byLigand.set(ligandZ, cutoff * cutoff);
    }
    cutoffSq.set(centerZ, byLigand);
  }

  const extendedPositions = Array.from(positions);
  const extendedElements = Array.from(elements);
  const drawingSites = new Map<string, DisplaySite>();
  const allDisplaySites: DisplaySite[] = [];
  const sourceVisible = particle.drawingBoundary?.sourceVisibleMask;

  for (let atom = 0; atom < nAtoms; atom++) {
    if (sourceVisible && sourceVisible[atom] === 0) continue;
    const site: DisplaySite = {
      sourceIndex: atom,
      dataIndex: atom,
      x: positions[atom * 3],
      y: positions[atom * 3 + 1],
      z: positions[atom * 3 + 2],
      imageA: 0,
      imageB: 0,
      imageC: 0,
    };
    drawingSites.set(siteKey(atom, 0, 0, 0), site);
    allDisplaySites.push(site);
  }

  const images = particle.drawingBoundary?.images;
  if (images) {
    for (let image = 0; image < images.sourceIndices.length; image++) {
      const i3 = image * 3;
      const dataIndex = extendedElements.length;
      const site: DisplaySite = {
        sourceIndex: images.sourceIndices[image],
        dataIndex,
        x: images.positions[i3],
        y: images.positions[i3 + 1],
        z: images.positions[i3 + 2],
        imageA: images.latticeShifts[i3],
        imageB: images.latticeShifts[i3 + 1],
        imageC: images.latticeShifts[i3 + 2],
      };
      extendedPositions.push(site.x, site.y, site.z);
      extendedElements.push(elements[site.sourceIndex]);
      drawingSites.set(siteKey(site.sourceIndex, site.imageA, site.imageB, site.imageC), site);
      allDisplaySites.push(site);
    }
  }

  const centers = allDisplaySites.filter((site) => centerElements.has(elements[site.sourceIndex]));
  const drawingLigands = allDisplaySites.filter((site) =>
    ligandElements.has(elements[site.sourceIndex]),
  );
  if (centers.length === 0 || drawingLigands.length === 0) return outputs;

  const box = snapshot.box;
  const inverse = box && box.some((value) => value !== 0) ? invert3x3(box) : null;
  const outsidePositions: number[] = [];
  const outsideElements: number[] = [];
  const outsideSourceIndices: number[] = [];
  const outsideLatticeShifts: number[] = [];
  const outsideSites = new Map<string, DisplaySite>();

  const appendOutsideSite = (
    sourceIndex: number,
    imageA: number,
    imageB: number,
    imageC: number,
    x: number,
    y: number,
    z: number,
  ): DisplaySite => {
    const key = siteKey(sourceIndex, imageA, imageB, imageC);
    const drawing = drawingSites.get(key);
    if (drawing) return drawing;
    const existing = outsideSites.get(key);
    if (existing) return existing;
    const site: DisplaySite = {
      sourceIndex,
      dataIndex: extendedElements.length,
      x,
      y,
      z,
      imageA,
      imageB,
      imageC,
    };
    outsideSites.set(key, site);
    extendedPositions.push(x, y, z);
    extendedElements.push(elements[sourceIndex]);
    outsidePositions.push(x, y, z);
    outsideElements.push(elements[sourceIndex]);
    outsideSourceIndices.push(sourceIndex);
    outsideLatticeShifts.push(imageA, imageB, imageC);
    return site;
  };

  const relationships: number[] = [];
  for (const center of centers) {
    const centerZ = elements[center.sourceIndex];
    const centerCutoffs = cutoffSq.get(centerZ)!;

    if (params.boundaryMode === "inside") {
      for (const ligand of drawingLigands) {
        const cutoff = centerCutoffs.get(elements[ligand.sourceIndex]);
        if (cutoff === undefined) continue;
        const dx = ligand.x - center.x;
        const dy = ligand.y - center.y;
        const dz = ligand.z - center.z;
        const distanceSq = dx * dx + dy * dy + dz * dz;
        if (distanceSq <= cutoff && distanceSq > 0.01) {
          relationships.push(center.dataIndex, ligand.dataIndex);
        }
      }
      continue;
    }

    const centerSourceX = positions[center.sourceIndex * 3];
    const centerSourceY = positions[center.sourceIndex * 3 + 1];
    const centerSourceZ = positions[center.sourceIndex * 3 + 2];
    for (const ligandSource of ligandSourceIndices) {
      const cutoff = centerCutoffs.get(elements[ligandSource]);
      if (cutoff === undefined) continue;
      const dx = positions[ligandSource * 3] - centerSourceX;
      const dy = positions[ligandSource * 3 + 1] - centerSourceY;
      const dz = positions[ligandSource * 3 + 2] - centerSourceZ;
      let displacements: PeriodicDisplacement[];
      if (box && inverse) {
        displacements = periodicDisplacementsWithinCutoff(dx, dy, dz, box, inverse, cutoff);
      } else {
        const distanceSq = dx * dx + dy * dy + dz * dz;
        displacements = distanceSq <= cutoff && distanceSq > 0.01 ? [[dx, dy, dz, 0, 0, 0]] : [];
      }

      for (const [imageDx, imageDy, imageDz, relativeA, relativeB, relativeC] of displacements) {
        const imageA = center.imageA + relativeA;
        const imageB = center.imageB + relativeB;
        const imageC = center.imageC + relativeC;
        const x = center.x + imageDx;
        const y = center.y + imageDy;
        const z = center.z + imageDz;
        const ligand = appendOutsideSite(ligandSource, imageA, imageB, imageC, x, y, z);
        relationships.push(center.dataIndex, ligand.dataIndex);
      }
    }
  }

  if (relationships.length === 0) return outputs;
  const outsideBoundaryImages: PeriodicAtomImageData | null =
    outsideElements.length > 0
      ? {
          positions: new Float32Array(outsidePositions),
          elements: new Uint8Array(outsideElements),
          sourceIndices: new Uint32Array(outsideSourceIndices),
          latticeShifts: new Int32Array(outsideLatticeShifts),
        }
      : null;
  const coordination: CoordinationData = {
    type: "coordination",
    sourceNodeId: particle.sourceNodeId,
    particleRef: particle,
    bondIndices: new Uint32Array(relationships),
    nBonds: relationships.length / 2,
    positions: new Float32Array(extendedPositions),
    elements: new Uint8Array(extendedElements),
    nAtoms: extendedElements.length,
    outsideBoundaryImages,
  };
  outputs.set("coordination", coordination);
  outputs.set("bond", coordinationToBondData(coordination));
  return outputs;
}
