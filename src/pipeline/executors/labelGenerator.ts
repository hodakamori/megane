import type { PipelineData, ParticleData, LabelData, LabelGeneratorParams } from "../types";
import { getElementSymbol } from "../../constants";

export function executeLabelGenerator(
  params: LabelGeneratorParams,
  inputs: Map<string, PipelineData[]>,
  atomLabels: string[] | null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particleData = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particleData) return outputs;

  const snapshot = particleData.source;
  let labels: string[];

  switch (params.source) {
    case "element":
      labels = Array.from(snapshot.elements).map((el) => getElementSymbol(el));
      break;
    case "resname":
      labels = atomLabels?.slice(0, snapshot.nAtoms) ?? [];
      break;
    case "index":
      labels = Array.from({ length: snapshot.nAtoms }, (_, i) => String(i));
      break;
    default:
      labels = [];
  }

  if (particleData.indices !== null) {
    const filtered = new Array<string>(snapshot.nAtoms).fill("");
    for (const idx of particleData.indices) {
      filtered[idx] = labels[idx];
    }
    labels = filtered;
  }

  const labelData: LabelData = {
    type: "label",
    labels,
    particleRef: particleData,
  };
  outputs.set("label", labelData);
  return outputs;
}
