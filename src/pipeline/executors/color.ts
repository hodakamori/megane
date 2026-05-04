import type { PipelineData, ParticleData, ColorParams } from "../types";
import { ensureColorOverridesBuffer, makeColorWriter } from "../colorWriter";

/**
 * Color node — paints per-atom RGB overrides into the particle stream.
 *
 * Extracted from the original Modify node to keep each modifier responsible
 * for a single visual property (Ovito-style modifier stack).
 */
export function executeColor(
  params: ColorParams,
  inputs: Map<string, PipelineData[]>,
  atomLabels: string[] | null = null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const inData = inputs.get("in")?.[0];
  if (!inData || inData.type !== "particle") return outputs;

  const particle = inData as ParticleData;
  const nAtoms = particle.source.nAtoms;

  const buf = ensureColorOverridesBuffer(particle);
  const writer = makeColorWriter(
    params.mode,
    params.uniformColor,
    particle,
    atomLabels,
    params.range,
  );
  if (particle.indices === null) {
    for (let i = 0; i < nAtoms; i++) writer(buf, i);
  } else {
    for (let k = 0; k < particle.indices.length; k++) {
      writer(buf, particle.indices[k]);
    }
  }

  outputs.set("out", { ...particle, colorOverrides: buf });
  return outputs;
}
