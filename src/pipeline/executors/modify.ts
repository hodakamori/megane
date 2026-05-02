import type { PipelineData, ParticleData, BondData, ModifyParams } from "../types";
import {
  getColor,
  getResidueColor,
  getChainColor,
  viridis,
  type ColorScheme,
} from "../../constants";

/**
 * Build a per-atom color override buffer (RGB Float32Array, length = nAtoms * 3)
 * for the given color scheme.
 *
 * Returns null when colorScheme is "element" (no override needed — element colors
 * are baked into the renderer on loadSnapshot).
 */
function computeColorOverrides(
  snapshot: {
    nAtoms: number;
    elements: Uint8Array;
    chainIds: Uint8Array | null;
    bFactors: Float32Array | null;
  },
  colorScheme: ColorScheme,
  atomLabels: string[] | null,
  indices: Uint32Array | null,
): Float32Array | null {
  if (colorScheme === "element") return null;

  const nAtoms = snapshot.nAtoms;
  const colors = new Float32Array(nAtoms * 3);

  // Initialize with element colors as baseline
  for (let i = 0; i < nAtoms; i++) {
    const [r, g, b] = getColor(snapshot.elements[i]);
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }

  // Determine which atoms to color
  const targetAtoms: Iterable<number> = indices ?? range(nAtoms);

  if (colorScheme === "residue") {
    for (const i of targetAtoms) {
      const label = atomLabels?.[i] ?? "";
      const [r, g, b] = getResidueColor(label);
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
  } else if (colorScheme === "chain") {
    const chainIds = snapshot.chainIds;
    for (const i of targetAtoms) {
      const chainId = chainIds ? chainIds[i] : 255;
      const [r, g, b] = getChainColor(chainId);
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
  } else if (colorScheme === "bfactor") {
    const bFactors = snapshot.bFactors;
    if (bFactors) {
      // Find min/max over target atoms for normalization
      let minB = Infinity;
      let maxB = -Infinity;
      for (const i of targetAtoms) {
        if (bFactors[i] < minB) minB = bFactors[i];
        if (bFactors[i] > maxB) maxB = bFactors[i];
      }
      const range_ = maxB - minB;
      for (const i of targetAtoms) {
        const t = range_ > 0 ? (bFactors[i] - minB) / range_ : 0.5;
        const [r, g, b] = viridis(t);
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      }
    }
    // If no bFactors available, keep element colors
  }

  return colors;
}

function* range(n: number): Generator<number> {
  for (let i = 0; i < n; i++) yield i;
}

export function executeModify(
  params: ModifyParams,
  inputs: Map<string, PipelineData[]>,
  atomLabels: string[] | null = null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const inData = inputs.get("in")?.[0];
  if (!inData) return outputs;

  if (inData.type === "particle") {
    const particle = inData as ParticleData;
    const nAtoms = particle.source.nAtoms;

    let scaleArr = particle.scaleOverrides;
    if (particle.indices !== null && particle.indices.length > 0) {
      if (!scaleArr) {
        scaleArr = new Float32Array(nAtoms).fill(1.0);
      } else {
        scaleArr = new Float32Array(scaleArr);
      }
      for (const idx of particle.indices) {
        scaleArr[idx] = params.scale;
      }
    } else if (particle.indices === null) {
      if (params.scale !== 1.0) {
        scaleArr = new Float32Array(nAtoms).fill(params.scale);
      }
    }

    let opacityArr = particle.opacityOverrides;
    if (particle.indices !== null && particle.indices.length > 0) {
      if (!opacityArr) {
        opacityArr = new Float32Array(nAtoms).fill(1.0);
      } else {
        opacityArr = new Float32Array(opacityArr);
      }
      for (const idx of particle.indices) {
        opacityArr[idx] = params.opacity;
      }
    } else if (particle.indices === null) {
      if (params.opacity !== 1.0) {
        opacityArr = new Float32Array(nAtoms).fill(params.opacity);
      }
    }

    const colorScheme: ColorScheme = params.colorScheme ?? "element";
    const colorOverrides = computeColorOverrides(
      particle.source,
      colorScheme,
      atomLabels,
      particle.indices,
    );

    const modified: ParticleData = {
      ...particle,
      scaleOverrides: scaleArr,
      opacityOverrides: opacityArr,
      colorOverrides,
    };
    outputs.set("out", modified);
  } else if (inData.type === "bond") {
    const bond = inData as BondData;
    if (bond.selectedBondIndices !== null) {
      // Per-bond opacity: apply params.opacity only to selected bonds
      const opacityArr = new Float32Array(bond.nBonds).fill(1.0);
      for (const idx of bond.selectedBondIndices) {
        opacityArr[idx] = params.opacity;
      }
      outputs.set("out", {
        ...bond,
        scale: params.scale,
        bondOpacityOverrides: opacityArr,
      });
    } else {
      // Global opacity (no bond selection active)
      outputs.set("out", { ...bond, scale: params.scale, opacity: params.opacity });
    }
  }

  return outputs;
}
