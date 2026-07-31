/**
 * Spectrum node executors.
 *
 * `load_spectrum` is a source node — like `load_volumetric`, the decode happens
 * in the node component (which owns the File) and the result is parked on the
 * params, so the executor's job is just to emit it onto the port.
 *
 * `spectrum_plot` is terminal. A spectrum has no geometry, so nothing flows
 * onward; the node component draws the chart from what it receives here.
 */

import type { PipelineData, LoadSpectrumParams, SpectrumData } from "../types";

/** Emit the decoded spectrum parked on a Load Spectrum node's params. */
export function executeLoadSpectrum(params: LoadSpectrumParams): Map<string, PipelineData> {
  const out = new Map<string, PipelineData>();
  if (params.spectrumData) out.set("spectrum", params.spectrumData);
  return out;
}

/**
 * Pick the spectrum a Spectrum Plot node should draw.
 *
 * Terminal, so it produces no outputs — it exists so the engine can surface a
 * "no input" warning like every other consumer node, and so the component has
 * one place to read its input from.
 */
export function selectPlottedSpectrum(inputs: Map<string, PipelineData[]>): SpectrumData | null {
  const incoming = inputs.get("spectrum") ?? [];
  for (const data of incoming) {
    if (data.type === "spectrum") return data;
  }
  return null;
}
