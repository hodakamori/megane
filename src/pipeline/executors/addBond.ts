import type {
  PipelineData,
  ParticleData,
  BondData,
  AddBondParams,
} from "../types";
import { inferBondsVdwJS } from "../../parsers/inferBondsJS";

export function executeAddBond(
  params: AddBondParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particleData = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particleData) return outputs;

  const snapshot = particleData.source;

  if (params.bondSource === "structure") {
    if (snapshot.nFileBonds > 0) {
      const bond: BondData = {
        type: "bond",
        bondIndices: snapshot.bonds,
        bondOrders: snapshot.bondOrders,
        nBonds: snapshot.nBonds,
        scale: 1.0,
        opacity: 1.0,
      };
      outputs.set("bond", bond);
    }
  } else if (params.bondSource === "distance") {
    const bondIndices = inferBondsVdwJS(
      snapshot.positions,
      snapshot.elements,
      snapshot.nAtoms,
      0.6,
    );
    if (bondIndices.length > 0) {
      const bond: BondData = {
        type: "bond",
        bondIndices,
        bondOrders: null,
        nBonds: bondIndices.length / 2,
        scale: 1.0,
        opacity: 1.0,
      };
      outputs.set("bond", bond);
    }
  }

  return outputs;
}
