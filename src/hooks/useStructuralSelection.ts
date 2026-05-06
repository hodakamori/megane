/**
 * Hook for granularity-aware structural selection (left-click / shift+click).
 * Separate from the measurement selection (right-click, useAtomSelection).
 */

import { useState, useCallback, useRef } from "react";
import type { Snapshot, SelectionGranularity, StructuralSelectionState } from "../types";
import { expandSelection, toggleAtoms } from "../selection/granularity";
import type { MoleculeRenderer } from "../renderer/MoleculeRenderer";

export interface StructuralSelectionHook {
  structuralSelection: StructuralSelectionState;
  granularity: SelectionGranularity;
  setGranularity: (g: SelectionGranularity) => void;
  handleAtomClick: (atomIndex: number, additive: boolean) => void;
  clearStructuralSelection: () => void;
}

export function useStructuralSelection(
  rendererRef: React.MutableRefObject<MoleculeRenderer | null>,
  snapshotRef: React.MutableRefObject<Snapshot | null>,
): StructuralSelectionHook {
  const [granularity, setGranularity] = useState<SelectionGranularity>("atom");
  const [structuralSelection, setStructuralSelection] = useState<StructuralSelectionState>({
    atoms: [],
    granularity: "atom",
  });
  const granularityRef = useRef(granularity);
  granularityRef.current = granularity;

  const handleAtomClick = useCallback(
    (atomIndex: number, additive: boolean) => {
      const snapshot = snapshotRef.current;
      const renderer = rendererRef.current;
      if (!snapshot || !renderer) return;

      const expanded = expandSelection(atomIndex, granularityRef.current, snapshot);
      const next = additive
        ? toggleAtoms(structuralSelection.atoms, expanded)
        : structuralSelection.atoms.length > 0 &&
            expanded.every((a) => structuralSelection.atoms.includes(a)) &&
            expanded.length === structuralSelection.atoms.length
          ? []
          : expanded;

      const newState: StructuralSelectionState = {
        atoms: next,
        granularity: granularityRef.current,
      };
      setStructuralSelection(newState);
      renderer.setStructuralSelection(next);
    },
    [rendererRef, snapshotRef, structuralSelection.atoms],
  );

  const clearStructuralSelection = useCallback(() => {
    setStructuralSelection({ atoms: [], granularity: granularityRef.current });
    rendererRef.current?.setStructuralSelection([]);
  }, [rendererRef]);

  const handleSetGranularity = useCallback((g: SelectionGranularity) => {
    setGranularity(g);
    granularityRef.current = g;
  }, []);

  return {
    structuralSelection,
    granularity,
    setGranularity: handleSetGranularity,
    handleAtomClick,
    clearStructuralSelection,
  };
}
