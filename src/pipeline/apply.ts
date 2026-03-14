/**
 * Applies a ViewportState to a MoleculeRenderer instance.
 * Translates the typed data streams into renderer calls.
 *
 * Supports multi-structure overlay: particles/bonds/cells from different
 * load_structure nodes are routed to separate StructureLayers in the renderer.
 * The "primary" structure (first particle source, matching the Viewport's
 * snapshot prop) uses the renderer's built-in atom/bond renderers.
 * Additional structures use StructureLayer instances.
 */

import type {
  ViewportState,
  ParticleData,
  BondData,
  CellData,
  LabelData,
  MeshData,
  VectorData,
} from "./types";
import type { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import { getVectorsForFrame } from "../logic/vectorSourceLogic";

/**
 * Apply the current ViewportState to the renderer.
 * If previous is null, all properties are applied (initial).
 */
export function applyViewportState(
  renderer: MoleculeRenderer,
  current: ViewportState,
  previous: ViewportState | null,
  primaryNodeId?: string | null,
): void {
  // ─── Determine which node IDs are primary vs layer ─────────
  const currentNodeIds = collectSourceNodeIds(current);
  const resolvedPrimaryId = primaryNodeId ?? currentNodeIds[0] ?? null;

  // Group data by source node
  const primaryParticles = current.particles.filter((p) => p.sourceNodeId === resolvedPrimaryId);
  const layerParticles = current.particles.filter((p) => p.sourceNodeId !== resolvedPrimaryId);
  const primaryBonds = current.bonds.filter((b) => b.sourceNodeId === resolvedPrimaryId);
  const layerBonds = current.bonds.filter((b) => b.sourceNodeId !== resolvedPrimaryId);
  const primaryCells = current.cells.filter((c) => c.sourceNodeId === resolvedPrimaryId);
  const layerCells = current.cells.filter((c) => c.sourceNodeId !== resolvedPrimaryId);

  // Previous state grouping
  const prevPrimaryParticles =
    previous?.particles.filter((p) => p.sourceNodeId === resolvedPrimaryId) ?? null;
  const prevPrimaryBonds =
    previous?.bonds.filter((b) => b.sourceNodeId === resolvedPrimaryId) ?? null;

  // ─── Primary structure: use renderer's built-in renderers ──
  const hasParticles = primaryParticles.length > 0;
  const hadParticles = (prevPrimaryParticles?.length ?? 0) > 0;
  if (!previous || hasParticles !== hadParticles) {
    renderer.setAtomsVisible(hasParticles);
  }

  applyParticleOverrides(renderer, primaryParticles, prevPrimaryParticles);
  applyBondSettings(renderer, primaryBonds, prevPrimaryBonds);

  // Primary cell visibility
  const hasCells = primaryCells.length > 0;
  const hadCells =
    (previous ? previous.cells.filter((c) => c.sourceNodeId === resolvedPrimaryId).length : 0) > 0;
  const cellVisible = hasCells && primaryCells.some((c) => c.visible);
  const prevCellVisible =
    hadCells &&
    (previous?.cells.filter((c) => c.sourceNodeId === resolvedPrimaryId).some((c) => c.visible) ??
      false);
  if (!previous || cellVisible !== prevCellVisible) {
    renderer.setCellVisible(cellVisible);
  }

  const cellAxesVisible = hasCells && primaryCells.some((c) => c.axesVisible);
  if (!previous || cellAxesVisible !== (previous?.cellAxesVisible ?? true)) {
    renderer.setCellAxesVisible(cellAxesVisible);
  }

  // Primary bonds visibility
  const bondsVisible = primaryBonds.length > 0;
  const prevBondsVisible = (prevPrimaryBonds?.length ?? 0) > 0;
  if (!previous || bondsVisible !== prevBondsVisible) {
    renderer.setBondsVisible(bondsVisible);
  }

  // ─── Layer structures: use StructureLayer instances ────────
  const activeLayerIds = new Set<string>();

  // Group layer particles by sourceNodeId
  const layerParticlesByNode = groupBy(layerParticles, (p) => p.sourceNodeId);
  const layerBondsByNode = groupBy(layerBonds, (b) => b.sourceNodeId);
  const layerCellsByNode = groupBy(layerCells, (c) => c.sourceNodeId);

  for (const [nodeId, particles] of layerParticlesByNode) {
    activeLayerIds.add(nodeId);
    const layer = renderer.getOrCreateLayer(nodeId);

    // Load snapshot if the layer doesn't have one yet, or if it changed
    const firstParticle = particles[0];
    if (firstParticle && layer.snapshot !== firstParticle.source) {
      layer.loadSnapshot(firstParticle.source);
    }

    // Apply overrides
    applyLayerParticleOverrides(layer, particles);

    // Apply bonds for this layer
    const bonds = layerBondsByNode.get(nodeId);
    if (bonds && bonds.length > 0) {
      const bond = bonds[0];
      layer.updateBondsExt(
        bond.bondIndices,
        bond.bondOrders,
        bond.positions,
        bond.elements,
        bond.nAtoms,
      );
      layer.setBondScale(bond.scale);
      layer.setBondOpacity(bond.opacity);
      layer.setBondsVisible(true);
    } else {
      layer.setBondsVisible(false);
    }

    // Apply cells for this layer
    const cells = layerCellsByNode.get(nodeId);
    if (cells && cells.length > 0) {
      layer.setCellVisible(cells.some((c) => c.visible));
    } else {
      layer.setCellVisible(false);
    }

    layer.setAtomsVisible(true);
  }

  // Remove layers that no longer have particles
  renderer.removeInactiveLayers(activeLayerIds);

  // ─── Display settings (global) ─────────────────────────────
  if (!previous || current.perspective !== previous.perspective) {
    renderer.setPerspective(current.perspective);
  }
  if (!previous || current.cellAxesVisible !== previous.cellAxesVisible) {
    renderer.setCellAxesVisible(current.cellAxesVisible);
  }

  // ─── Labels (primary structure only for now) ───────────────
  applyLabels(renderer, current.labels, previous?.labels ?? null);

  // ─── Meshes (polyhedra) ────────────────────────────────────
  applyMeshes(renderer, current.meshes, previous?.meshes ?? null);

  // ─── Vectors (arrows, primary structure only for now) ──────
  applyVectors(renderer, current.vectors, previous?.vectors ?? null);
}

/** Collect unique source node IDs from all data in a ViewportState. */
function collectSourceNodeIds(state: ViewportState): string[] {
  const ids = new Set<string>();
  for (const p of state.particles) ids.add(p.sourceNodeId);
  for (const b of state.bonds) ids.add(b.sourceNodeId);
  for (const c of state.cells) ids.add(c.sourceNodeId);
  return Array.from(ids);
}

/** Group items by a key function. */
function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    let list = map.get(key);
    if (!list) {
      list = [];
      map.set(key, list);
    }
    list.push(item);
  }
  return map;
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

  // Merge overrides from all particle streams for the primary structure
  let mergedScale: Float32Array | null = null;
  let mergedOpacity: Float32Array | null = null;

  for (const p of particles) {
    if (p.scaleOverrides) {
      if (!mergedScale) {
        mergedScale = new Float32Array(p.scaleOverrides);
      } else {
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

/** Apply overrides to a StructureLayer. */
function applyLayerParticleOverrides(
  layer: {
    setAtomScale: (s: number) => void;
    setAtomOpacity: (o: number) => void;
    setAtomScaleOverrides: (o: Float32Array) => void;
    setAtomOpacityOverrides: (o: Float32Array) => void;
    clearAtomOverrides: () => void;
  },
  particles: ParticleData[],
): void {
  let mergedScale: Float32Array | null = null;
  let mergedOpacity: Float32Array | null = null;

  for (const p of particles) {
    if (p.scaleOverrides) {
      if (!mergedScale) {
        mergedScale = new Float32Array(p.scaleOverrides);
      } else {
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
    layer.setAtomScale(1.0);
    layer.setAtomScaleOverrides(mergedScale);
  } else {
    layer.clearAtomOverrides();
    layer.setAtomScale(1.0);
  }

  if (mergedOpacity) {
    layer.setAtomOpacity(1.0);
    layer.setAtomOpacityOverrides(mergedOpacity);
  } else {
    layer.setAtomOpacity(1.0);
  }
}

function applyBondSettings(
  renderer: MoleculeRenderer,
  bonds: BondData[],
  prevBonds: BondData[] | null,
): void {
  if (bonds.length === 0) return;

  const bond = bonds[0];
  const prevBond = prevBonds?.[0];

  if (!prevBond || bond.bondIndices !== prevBond.bondIndices) {
    renderer.updateBondsExt(
      bond.bondIndices,
      bond.bondOrders,
      bond.positions,
      bond.elements,
      bond.nAtoms,
    );
  }

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

function applyVectors(
  renderer: MoleculeRenderer,
  vectors: VectorData[],
  prevVectors: VectorData[] | null,
): void {
  if (vectors.length > 0) {
    const vd = vectors[0];
    const frameVectors = getVectorsForFrame({ fileVectors: vd.frames }, 0);
    renderer.setVectors(frameVectors);
    renderer.setVectorScale(vd.scale);
  } else if (prevVectors && prevVectors.length > 0) {
    renderer.setVectors(null);
  }
}

/**
 * Update vector arrows for the given frame index.
 * Called on each frame change when vector data is in the viewport state.
 */
export function applyVectorsForFrame(
  renderer: MoleculeRenderer,
  vectors: VectorData[],
  frameIndex: number,
): void {
  if (vectors.length === 0) return;
  const vd = vectors[0];
  const frameVectors = getVectorsForFrame({ fileVectors: vd.frames }, frameIndex);
  renderer.setVectors(frameVectors);
  renderer.setVectorScale(vd.scale);
}
