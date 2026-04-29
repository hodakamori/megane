/**
 * Local React state + handlers for AppearancePanel sliders.
 * Pushes values directly into the renderer's setX setters; pipeline-driven
 * Modify nodes can still override per-particle values via override APIs.
 *
 * Used by MeganeViewer (webapp / jupyterlab-doc / vscode shell) and by
 * WidgetViewer (widget-jupyterlab / widget-vscode) so the appearance UI
 * is consistent across all 5 hosts.
 */

import { useCallback, useState, type RefObject } from "react";
import type { MoleculeRenderer } from "../renderer/MoleculeRenderer";

export interface AppearancePanelBindings {
  atomScale: number;
  onAtomScaleChange: (v: number) => void;
  atomOpacity: number;
  onAtomOpacityChange: (v: number) => void;
  bondScale: number;
  onBondScaleChange: (v: number) => void;
  bondOpacity: number;
  onBondOpacityChange: (v: number) => void;
  vdwScale: number;
  onVdwScaleChange: (v: number) => void;
  vectorScale: number;
  onVectorScaleChange: (v: number) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function useAppearancePanelState(
  rendererRef: RefObject<MoleculeRenderer | null>,
  initiallyCollapsed: boolean,
): AppearancePanelBindings {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  const [atomScale, setAtomScale] = useState(1.0);
  const [atomOpacity, setAtomOpacity] = useState(1.0);
  const [bondScale, setBondScale] = useState(1.0);
  const [bondOpacity, setBondOpacity] = useState(1.0);
  const [vdwScale, setVdwScale] = useState(1.0);
  const [vectorScale, setVectorScale] = useState(1.0);

  return {
    atomScale,
    onAtomScaleChange: useCallback(
      (v: number) => {
        setAtomScale(v);
        rendererRef.current?.setAtomScale(v);
      },
      [rendererRef],
    ),
    atomOpacity,
    onAtomOpacityChange: useCallback(
      (v: number) => {
        setAtomOpacity(v);
        rendererRef.current?.setAtomOpacity(v);
      },
      [rendererRef],
    ),
    bondScale,
    onBondScaleChange: useCallback(
      (v: number) => {
        setBondScale(v);
        rendererRef.current?.setBondScale(v);
      },
      [rendererRef],
    ),
    bondOpacity,
    onBondOpacityChange: useCallback(
      (v: number) => {
        setBondOpacity(v);
        rendererRef.current?.setBondOpacity(v);
      },
      [rendererRef],
    ),
    vdwScale,
    onVdwScaleChange: useCallback(
      (v: number) => {
        setVdwScale(v);
        rendererRef.current?.setAtomScale(v);
      },
      [rendererRef],
    ),
    vectorScale,
    onVectorScaleChange: useCallback(
      (v: number) => {
        setVectorScale(v);
        rendererRef.current?.setVectorScale(v);
      },
      [rendererRef],
    ),
    collapsed,
    onToggleCollapse: useCallback(() => setCollapsed((c) => !c), []),
  };
}
