/**
 * Shared hook for atom selection and measurement.
 * Used by both MeganeViewer and WidgetViewer.
 */

import { useState, useCallback, useRef } from "react";
import type { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import type { SelectionState, Measurement } from "../types";

export interface AtomSelectionState {
  selection: SelectionState;
  measurement: Measurement | null;
  handleAtomRightClick: (atomIndex: number) => void;
  handleClearSelection: () => void;
  handleFrameUpdated: () => void;
  setExternalSelection: (atoms: number[]) => void;
}

export function useAtomSelection(
  rendererRef: React.MutableRefObject<MoleculeRenderer | null>,
  onMeasurementChange?: (measurement: Measurement | null) => void,
): AtomSelectionState {
  const [selection, setSelection] = useState<SelectionState>({ atoms: [] });
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const onMeasurementChangeRef = useRef(onMeasurementChange);
  onMeasurementChangeRef.current = onMeasurementChange;

  const updateMeasurement = useCallback((m: Measurement | null) => {
    setMeasurement(m);
    onMeasurementChangeRef.current?.(m);
  }, []);

  const handleAtomRightClick = useCallback((atomIndex: number) => {
    if (!rendererRef.current) return;
    const newSelection = rendererRef.current.toggleAtomSelection(atomIndex);
    setSelection(newSelection);
    updateMeasurement(rendererRef.current.getMeasurement());
  }, [rendererRef, updateMeasurement]);

  const handleClearSelection = useCallback(() => {
    rendererRef.current?.clearSelection();
    setSelection({ atoms: [] });
    updateMeasurement(null);
  }, [rendererRef, updateMeasurement]);

  const handleFrameUpdated = useCallback(() => {
    if (!rendererRef.current) return;
    const m = rendererRef.current.getMeasurement();
    if (m) updateMeasurement(m);
  }, [rendererRef, updateMeasurement]);

  const setExternalSelection = useCallback((atoms: number[]) => {
    if (!rendererRef.current) return;
    if (atoms.length === 0) {
      rendererRef.current.clearSelection();
      setSelection({ atoms: [] });
      updateMeasurement(null);
    } else {
      const newSelection = rendererRef.current.setSelection(atoms);
      setSelection(newSelection);
      updateMeasurement(rendererRef.current.getMeasurement());
    }
  }, [rendererRef, updateMeasurement]);

  return {
    selection,
    measurement,
    handleAtomRightClick,
    handleClearSelection,
    handleFrameUpdated,
    setExternalSelection,
  };
}
