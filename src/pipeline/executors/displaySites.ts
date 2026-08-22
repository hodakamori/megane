import type { DrawingBoundaryData } from "../types";

/**
 * One rendered copy of a structural atom: either the source atom itself
 * (lattice shift 0,0,0) or a Drawing Boundary periodic image copy.
 */
export interface DisplaySite {
  sourceIndex: number;
  /** Index into the extended (source atoms + image copies) data arrays. */
  dataIndex: number;
  x: number;
  y: number;
  z: number;
  shiftA: number;
  shiftB: number;
  shiftC: number;
}

/** Canonical map key for a display site: source atom plus integer lattice shift. */
export function displaySiteKey(sourceIndex: number, a: number, b: number, c: number): string {
  return `${sourceIndex}:${a}:${b}:${c}`;
}

export interface DisplaySiteCollection {
  /** Source-atom sites first, then image sites in Drawing Boundary order. */
  sites: DisplaySite[];
  byKey: Map<string, DisplaySite>;
}

/**
 * Collect the display sites of a particle: source atoms passing the Drawing
 * Boundary visibility mask (every atom when no boundary is attached) plus the
 * boundary's periodic image copies. Image `dataIndex` values continue directly
 * after the source atoms, matching the extended position/element array layout
 * shared by the `add_bond` and `coordination_generator` executors.
 */
export function collectDisplaySites(
  positions: Float32Array,
  nAtoms: number,
  boundary: DrawingBoundaryData | null | undefined,
): DisplaySiteCollection {
  const sites: DisplaySite[] = [];
  const byKey = new Map<string, DisplaySite>();
  const add = (site: DisplaySite) => {
    sites.push(site);
    byKey.set(displaySiteKey(site.sourceIndex, site.shiftA, site.shiftB, site.shiftC), site);
  };

  const visible = boundary?.sourceVisibleMask;
  for (let atom = 0; atom < nAtoms; atom++) {
    if (visible && visible[atom] === 0) continue;
    add({
      sourceIndex: atom,
      dataIndex: atom,
      x: positions[atom * 3],
      y: positions[atom * 3 + 1],
      z: positions[atom * 3 + 2],
      shiftA: 0,
      shiftB: 0,
      shiftC: 0,
    });
  }

  const images = boundary?.images;
  if (images) {
    for (let image = 0; image < images.sourceIndices.length; image++) {
      const i3 = image * 3;
      add({
        sourceIndex: images.sourceIndices[image],
        dataIndex: nAtoms + image,
        x: images.positions[i3],
        y: images.positions[i3 + 1],
        z: images.positions[i3 + 2],
        shiftA: images.latticeShifts[i3],
        shiftB: images.latticeShifts[i3 + 1],
        shiftC: images.latticeShifts[i3 + 2],
      });
    }
  }

  return { sites, byKey };
}
