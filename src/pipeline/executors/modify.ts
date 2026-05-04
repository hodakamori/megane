import type { PipelineData, ParticleData, BondData, ModifyParams } from "../types";
import { ensureColorOverridesBuffer, makeColorWriter } from "../colorWriter";

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

    let colorArr: Float32Array | null = particle.colorOverrides;
    if (params.colorEnabled) {
      const buf = ensureColorOverridesBuffer(particle);
      const writer = makeColorWriter(
        params.colorMode,
        params.uniformColor,
        particle,
        atomLabels,
        params.colorRange,
      );
      if (particle.indices === null) {
        for (let i = 0; i < nAtoms; i++) writer(buf, i);
      } else {
        for (let k = 0; k < particle.indices.length; k++) {
          writer(buf, particle.indices[k]);
        }
      }
      colorArr = buf;
    }

    const modified: ParticleData = {
      ...particle,
      scaleOverrides: scaleArr,
      opacityOverrides: opacityArr,
      colorOverrides: colorArr,
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
