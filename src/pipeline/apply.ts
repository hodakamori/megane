/**
 * Applies a RenderState to a MoleculeRenderer instance.
 * Only calls renderer methods for properties that changed (diff-based).
 */

import type { RenderState } from "./types";
import type { MoleculeRenderer } from "../renderer/MoleculeRenderer";

/**
 * Apply the current RenderState to the renderer, only updating changed properties.
 * If previous is null, all properties are applied.
 */
export function applyRenderState(
  renderer: MoleculeRenderer,
  current: RenderState,
  previous: RenderState | null,
): void {
  if (!previous || current.atomScale !== previous.atomScale) {
    renderer.setAtomScale(current.atomScale);
  }
  if (!previous || current.atomOpacity !== previous.atomOpacity) {
    renderer.setAtomOpacity(current.atomOpacity);
  }
  if (!previous || current.bondScale !== previous.bondScale) {
    renderer.setBondScale(current.bondScale);
  }
  if (!previous || current.bondOpacity !== previous.bondOpacity) {
    renderer.setBondOpacity(current.bondOpacity);
  }
  if (!previous || current.bondsVisible !== previous.bondsVisible) {
    renderer.setBondsVisible(current.bondsVisible);
  }
  if (!previous || current.cellVisible !== previous.cellVisible) {
    renderer.setCellVisible(current.cellVisible);
  }
  if (!previous || current.cellAxesVisible !== previous.cellAxesVisible) {
    renderer.setCellAxesVisible(current.cellAxesVisible);
  }
  if (!previous || current.perspective !== previous.perspective) {
    renderer.setPerspective(current.perspective);
  }
  if (!previous || current.vectorScale !== previous.vectorScale) {
    renderer.setVectorScale(current.vectorScale);
  }

  // Per-atom overrides from selection pipeline
  if (current.atomScaleOverrides) {
    renderer.setAtomScaleOverrides(current.atomScaleOverrides);
  } else if (previous?.atomScaleOverrides) {
    renderer.clearAtomOverrides();
  }
  if (current.atomOpacityOverrides) {
    renderer.setAtomOpacityOverrides(current.atomOpacityOverrides);
  } else if (previous?.atomOpacityOverrides && !current.atomScaleOverrides) {
    // Only clear if scale overrides didn't already clear
    renderer.clearAtomOverrides();
  }
}
