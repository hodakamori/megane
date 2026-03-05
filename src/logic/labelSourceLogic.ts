/**
 * Shared label source logic used by both useMeganeLocal and useMeganeWebSocket.
 */

import { extractLabelsFromFile } from "../parsers/structure";
import type { LabelSource } from "../types";

/** Mutable refs that both hooks share for label caching. */
export interface LabelSourceRefs {
  structureLabels: string[] | null;
  fileLabels: string[] | null;
}

/**
 * Compute labels for a given label source.
 * Returns the label array or null (for "none").
 */
export function computeLabelsForSource(
  source: LabelSource,
  refs: LabelSourceRefs,
  nAtoms: number,
): string[] | null {
  switch (source) {
    case "none":
      return null;
    case "structure":
      if (refs.structureLabels) return refs.structureLabels;
      // Fallback: atom indices (1-based)
      return Array.from({ length: nAtoms }, (_, i) => String(i + 1));
    case "file":
      return refs.fileLabels;
  }
}

/**
 * Parse a label file and return labels + file name.
 */
export async function loadLabelFileData(
  file: File,
  nAtoms: number,
): Promise<{ labels: string[]; fileName: string }> {
  const labels = await extractLabelsFromFile(file, nAtoms);
  return { labels, fileName: file.name };
}
