import type { PipelineData, ParticleData, SupercellParams } from "../types";
import { expandCrystal } from "../crystal";

/**
 * Supercell node — replicate the unit cell across an na×nb×nc grid (a true
 * supercell, translational replication only). Crystallographic symmetry
 * expansion happens earlier, when the CIF is parsed, so the incoming snapshot
 * already holds the full unit cell.
 *
 * Produces a brand-new particle stream backed by an expanded {@link Snapshot}
 * (more atoms, replicated bonds, an enlarged cell box). Per-atom overrides from
 * upstream are dropped because their indices no longer map onto the expanded
 * atom set — place Supercell early in the stack (right after Load Structure).
 */
export function executeSupercell(
  params: SupercellParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const inData = inputs.get("in")?.[0];
  if (!inData || inData.type !== "particle") return outputs;

  const particle = inData as ParticleData;
  const expanded = expandCrystal(particle.source, {
    na: params.na,
    nb: params.nb,
    nc: params.nc,
  });

  // No change (no cell, or na=nb=nc=1 with symmetry off/absent) — pass through.
  if (expanded === particle.source) {
    outputs.set("out", particle);
    return outputs;
  }

  const out: ParticleData = {
    type: "particle",
    source: expanded,
    sourceNodeId: particle.sourceNodeId,
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: particle.representationOverride,
  };
  outputs.set("out", out);
  return outputs;
}
