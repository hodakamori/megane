import type { PipelineData, VolumetricData, LoadVolumetricParams } from "../types";

/**
 * Load Volumetric executor.
 *
 * The volumetric data is parsed client-side in LoadVolumetricNode and stored
 * as an ephemeral field in the node params (not serialized). This executor
 * simply forwards it as a typed output.
 */
export function executeLoadVolumetric(params: LoadVolumetricParams): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const vol = params.volumetricData;
  if (!vol) return outputs;
  const data: VolumetricData = {
    type: "volumetric",
    nx: vol.nx,
    ny: vol.ny,
    nz: vol.nz,
    origin: vol.origin,
    step: vol.step,
    data: vol.data,
    dataMin: vol.dataMin,
    dataMax: vol.dataMax,
  };
  outputs.set("volumetric", data);
  return outputs;
}
