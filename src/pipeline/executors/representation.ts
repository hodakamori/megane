import type { PipelineData, ParticleData, RepresentationParams } from "../types";

/**
 * Representation node — tags the particle stream with the visual mode that
 * the Viewport should pick up (atoms / cartoon / both / surface).
 *
 * Stacking semantics: the Viewport reads the override from the first particle
 * stream that carries one (in execution / connection order), so a downstream
 * representation node wins over an upstream one on the same chain, and chains
 * without a representation node fall back to "atoms".
 */
export function executeRepresentation(
  params: RepresentationParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const inData = inputs.get("in")?.[0];
  if (!inData || inData.type !== "particle") return outputs;

  const particle = inData as ParticleData;
  outputs.set("out", { ...particle, representationOverride: params.mode });
  return outputs;
}
