import type { DrawingBoundaryParams, ParticleData, PipelineData } from "../types";
import { generateDrawingBoundaryImages } from "../../logic/cellBoundaryImages";

/**
 * Attach an inclusive fractional Drawing Boundary to a particle stream.
 * Structural atoms are not duplicated or renumbered; periodic display atoms
 * carry source-index provenance in `drawingBoundary.images`.
 */
export function executeDrawingBoundary(
  params: DrawingBoundaryParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particle = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particle) return outputs;

  const box = particle.source.box;
  if (!box || !box.some((value) => value !== 0)) {
    outputs.set("particle", { ...particle, drawingBoundary: null });
    return outputs;
  }

  const drawingBoundary = generateDrawingBoundaryImages(
    particle.source,
    [params.xMin, params.yMin, params.zMin],
    [params.xMax, params.yMax, params.zMax],
  );
  outputs.set("particle", { ...particle, drawingBoundary });
  return outputs;
}
