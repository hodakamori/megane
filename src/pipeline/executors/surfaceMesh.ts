import type { PipelineData, ParticleData, MeshData, SurfaceMeshParams } from "../types";
import { buildSurfaceMeshData } from "../../renderer/alphaSurface";

export function executeSurfaceMesh(
  params: SurfaceMeshParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particleData = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particleData) return outputs;

  const { positions, nAtoms } = particleData.source;
  const { alphaRadius, color, opacity } = params;

  const meshData: MeshData = buildSurfaceMeshData(positions, nAtoms, alphaRadius, color, opacity);
  outputs.set("mesh", meshData);
  return outputs;
}
