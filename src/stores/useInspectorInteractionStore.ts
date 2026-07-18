/**
 * Bridge between the Selection Inspector (in the pipeline panel) and the 3D
 * Viewport (in the viewer). They live in different component subtrees, so this
 * small store carries the live preview highlight one way and the 3D pick /
 * box-select results the other way.
 */

import { create } from "zustand";
import type { ClickedAtom } from "../pipeline/inspectorQuery";

let nextToken = 1;

interface InspectorInteractionStore {
  /** Atom indices the Inspector wants highlighted live in the 3D view. */
  previewIndices: number[] | null;
  /** True while the Inspector has "box select" armed (suspends camera rotate). */
  boxSelectActive: boolean;
  /** Result of a completed box drag (token de-dupes repeated identical sets). */
  boxResult: { indices: number[]; token: number } | null;
  /** An atom clicked in the 3D view while the Inspector is active. */
  pickedAtom: (ClickedAtom & { token: number }) | null;

  setPreviewIndices: (indices: number[] | null) => void;
  setBoxSelectActive: (active: boolean) => void;
  publishBoxResult: (indices: number[]) => void;
  publishPickedAtom: (atom: ClickedAtom) => void;
}

export const useInspectorInteractionStore = create<InspectorInteractionStore>((set) => ({
  previewIndices: null,
  boxSelectActive: false,
  boxResult: null,
  pickedAtom: null,

  setPreviewIndices: (indices) => set({ previewIndices: indices }),
  setBoxSelectActive: (active) => set({ boxSelectActive: active }),
  publishBoxResult: (indices) => set({ boxResult: { indices, token: nextToken++ } }),
  publishPickedAtom: (atom) => set({ pickedAtom: { ...atom, token: nextToken++ } }),
}));
