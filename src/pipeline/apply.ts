/**
 * Applies a ViewportState to a MoleculeRenderer instance.
 * Translates the typed data streams into renderer calls.
 */

import type { ViewportState, ParticleData, BondData, CellData, LabelData, MeshData } from "./types";
import type { MoleculeRenderer } from "../renderer/MoleculeRenderer";

/**
 * Apply the current ViewportState to the renderer.
 * If previous is null, all properties are applied (initial).
 */
export function applyViewportState(
  renderer: MoleculeRenderer,
  current: ViewportState,
  previous: ViewportState | null,
): void {
  // ─── Atom visibility (hide when no viewport node produces data) ──
  const hasParticles = current.particles.length > 0;
  const hadParticles = (previous?.particles.length ?? 0) > 0;
  if (!previous || hasParticles !== hadParticles) {
    renderer.setAtomsVisible(hasParticles);
  }

  // ─── Atom scale/opacity from particle data ─────────────────
  applyParticleOverrides(renderer, current.particles, previous?.particles ?? null);

  // ─── Bond scale/opacity ────────────────────────────────────
  applyBondSettings(renderer, current.bonds, previous?.bonds ?? null);

  // ─── Cell visibility ───────────────────────────────────────
  const hasCells = current.cells.length > 0;
  const hadCells = (previous?.cells.length ?? 0) > 0;
  const cellVisible = hasCells && current.cells.some((c) => c.visible);
  const prevCellVisible = hadCells && (previous?.cells.some((c) => c.visible) ?? false);
  if (!previous || cellVisible !== prevCellVisible) {
    renderer.setCellVisible(cellVisible);
  }

  const cellAxesVisible = hasCells && current.cells.some((c) => c.axesVisible);
  if (!previous || cellAxesVisible !== (previous.cellAxesVisible ?? true)) {
    renderer.setCellAxesVisible(cellAxesVisible);
  }

  // ─── Display settings ──────────────────────────────────────
  if (!previous || current.perspective !== previous.perspective) {
    renderer.setPerspective(current.perspective);
  }
  if (!previous || current.cellAxesVisible !== previous.cellAxesVisible) {
    renderer.setCellAxesVisible(current.cellAxesVisible);
  }

  // ─── Labels ────────────────────────────────────────────────
  applyLabels(renderer, current.labels, previous?.labels ?? null);

  // ─── Meshes (polyhedra) ───────────────────────────────────
  applyMeshes(renderer, current.meshes, previous?.meshes ?? null);

  // ─── Bonds visibility ──────────────────────────────────────
  const bondsVisible = current.bonds.length > 0;
  const prevBondsVisible = (previous?.bonds.length ?? 0) > 0;
  if (!previous || bondsVisible !== prevBondsVisible) {
    renderer.setBondsVisible(bondsVisible);
  }
}

function applyParticleOverrides(
  renderer: MoleculeRenderer,
  particles: ParticleData[],
  prevParticles: ParticleData[] | null,
): void {
  if (particles.length === 0) {
    if (prevParticles && prevParticles.length > 0) {
      renderer.clearAtomOverrides();
      renderer.setAtomScale(1.0);
      renderer.setAtomOpacity(1.0);
    }
    return;
  }

  // Merge overrides from all particle streams
  // (for now, take the first particle with overrides or the first particle)
  let mergedScale: Float32Array | null = null;
  let mergedOpacity: Float32Array | null = null;

  for (const p of particles) {
    if (p.scaleOverrides) {
      if (!mergedScale) {
        mergedScale = new Float32Array(p.scaleOverrides);
      } else {
        // Merge: overwrite values where the new override differs
        for (let i = 0; i < mergedScale.length; i++) {
          if (p.scaleOverrides[i] !== 1.0) {
            mergedScale[i] = p.scaleOverrides[i];
          }
        }
      }
    }
    if (p.opacityOverrides) {
      if (!mergedOpacity) {
        mergedOpacity = new Float32Array(p.opacityOverrides);
      } else {
        for (let i = 0; i < mergedOpacity.length; i++) {
          if (p.opacityOverrides[i] !== 1.0) {
            mergedOpacity[i] = p.opacityOverrides[i];
          }
        }
      }
    }
  }

  if (mergedScale) {
    renderer.setAtomScale(1.0);
    renderer.setAtomScaleOverrides(mergedScale);
  } else {
    renderer.clearAtomOverrides();
    renderer.setAtomScale(1.0);
  }

  if (mergedOpacity) {
    renderer.setAtomOpacity(1.0);
    renderer.setAtomOpacityOverrides(mergedOpacity);
  } else {
    renderer.setAtomOpacity(1.0);
  }
}

function applyBondSettings(
  renderer: MoleculeRenderer,
  bonds: BondData[],
  prevBonds: BondData[] | null,
): void {
  if (bonds.length === 0) return;

  // Use the first bond stream's settings (merge is possible in future)
  const bond = bonds[0];
  const prevBond = prevBonds?.[0];

  if (!prevBond || bond.scale !== prevBond.scale) {
    renderer.setBondScale(bond.scale);
  }
  if (!prevBond || bond.opacity !== prevBond.opacity) {
    renderer.setBondOpacity(bond.opacity);
  }
}

function applyLabels(
  renderer: MoleculeRenderer,
  labels: LabelData[],
  prevLabels: LabelData[] | null,
): void {
  if (labels.length > 0) {
    renderer.setLabels(labels[0].labels);
  } else if (prevLabels && prevLabels.length > 0) {
    renderer.setLabels(null);
  }
}

function applyMeshes(
  renderer: MoleculeRenderer,
  meshes: MeshData[],
  prevMeshes: MeshData[] | null,
): void {
  if (meshes.length > 0) {
    renderer.loadPolyhedra(meshes[0]);
  } else if (prevMeshes && prevMeshes.length > 0) {
    renderer.clearPolyhedra();
  }
}
