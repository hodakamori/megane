/**
 * Crystal expansion utilities for the Supercell pipeline node.
 *
 * Two independent operations, both pure translations/isometries of the
 * asymmetric unit:
 *
 *  1. **Symmetry expansion** — apply the space-group operations captured from
 *     the CIF `_symmetry_equiv_pos_as_xyz` loop to generate the symmetry
 *     equivalent molecules that fill one unit cell (Z copies). Each operation
 *     is a rigid isometry, so each generated image is a whole, rigidly-copied
 *     asymmetric unit — its internal bond graph is identical to the original.
 *
 *  2. **Translational replication** — tile the (optionally symmetry-expanded)
 *     contents across an `na × nb × nc` grid of unit cells.
 *
 * Because every generated image is a rigid copy, bonds never need re-inference:
 * we simply replicate the base bond list with a per-image index offset. This
 * keeps molecules whole (no PBC wrapping of individual atoms) and avoids
 * spurious bonds across cell boundaries.
 *
 * NOTE: only translational replication is needed to satisfy "display multiple
 * unit cells"; symmetry expansion is what additionally matches VESTA-style
 * packing for molecular crystals.
 */

import type { Snapshot } from "../types";

/** A parsed symmetry operation: fractional rotation matrix + translation. */
export interface Symop {
  /** Row-major 3×3 rotation/permutation acting on fractional coords. */
  rot: number[];
  /** Fractional translation [tx, ty, tz]. */
  trans: number[];
}

/** Parse a numeric token that may be a fraction ("1/2") or a decimal. */
function parseNum(s: string): number {
  const t = s.trim();
  if (t.includes("/")) {
    const [num, den] = t.split("/");
    return parseFloat(num) / parseFloat(den);
  }
  return parseFloat(t);
}

/**
 * Parse a single component of a symop, e.g. "-x+1/2", "1/2-y", "z".
 * Returns the coefficients of [x, y, z] and the constant translation.
 */
function parseComponent(comp: string): { coef: [number, number, number]; trans: number } {
  const coef: [number, number, number] = [0, 0, 0];
  let trans = 0;
  // Split into signed terms while keeping the sign with each term.
  const terms = comp.replace(/\s+/g, "").match(/[+-]?[^+-]+/g) ?? [];
  for (const term of terms) {
    let sign = 1;
    let body = term;
    if (body[0] === "+") {
      body = body.slice(1);
    } else if (body[0] === "-") {
      sign = -1;
      body = body.slice(1);
    }
    const axis = body.search(/[xyz]/i);
    if (axis >= 0) {
      const ch = body[axis].toLowerCase();
      const numPart = body.slice(0, axis) + body.slice(axis + 1);
      const mag = numPart === "" || numPart === "*" ? 1 : parseNum(numPart.replace("*", ""));
      const idx = ch === "x" ? 0 : ch === "y" ? 1 : 2;
      coef[idx] += sign * mag;
    } else {
      trans += sign * parseNum(body);
    }
  }
  return { coef, trans };
}

/**
 * Parse a CIF symmetry operation string (e.g. "-x+1/2,y+1/2,-z") into a
 * {@link Symop}. Returns null if the string does not have three components.
 */
export function parseSymop(op: string): Symop | null {
  const comps = op.split(",");
  if (comps.length !== 3) return null;
  const rot: number[] = [];
  const trans: number[] = [];
  for (const comp of comps) {
    const { coef, trans: t } = parseComponent(comp);
    rot.push(coef[0], coef[1], coef[2]);
    trans.push(t);
  }
  return { rot, trans };
}

/** Invert a row-major 3×3 matrix. Returns null if singular. */
export function invert3x3(m: Float32Array | number[]): number[] | null {
  const a = m[0],
    b = m[1],
    c = m[2],
    d = m[3],
    e = m[4],
    f = m[5],
    g = m[6],
    h = m[7],
    i = m[8];
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  if (Math.abs(det) < 1e-12) return null;
  const inv = 1 / det;
  return [
    (e * i - f * h) * inv,
    (c * h - b * i) * inv,
    (b * f - c * e) * inv,
    (f * g - d * i) * inv,
    (a * i - c * g) * inv,
    (c * d - a * f) * inv,
    (d * h - e * g) * inv,
    (b * g - a * h) * inv,
    (a * e - b * d) * inv,
  ];
}

/** Cartesian = frac · M, where M rows are the cell vectors (row-major). */
function fracToCart(fa: number, fb: number, fc: number, m: Float32Array): [number, number, number] {
  return [
    fa * m[0] + fb * m[3] + fc * m[6],
    fa * m[1] + fb * m[4] + fc * m[7],
    fa * m[2] + fb * m[5] + fc * m[8],
  ];
}

/** Fractional = cart · M⁻¹. */
function cartToFrac(x: number, y: number, z: number, minv: number[]): [number, number, number] {
  return [
    x * minv[0] + y * minv[3] + z * minv[6],
    x * minv[1] + y * minv[4] + z * minv[7],
    x * minv[2] + y * minv[5] + z * minv[8],
  ];
}

export interface ExpandParams {
  na: number;
  nb: number;
  nc: number;
  applySymmetry: boolean;
}

/**
 * Expand a snapshot by space-group symmetry and/or translational replication.
 *
 * Returns the input snapshot unchanged when there is nothing to do (no cell, or
 * na=nb=nc=1 and symmetry disabled/absent).
 */
export function expandCrystal(snapshot: Snapshot, params: ExpandParams): Snapshot {
  const na = Math.max(1, Math.floor(params.na));
  const nb = Math.max(1, Math.floor(params.nb));
  const nc = Math.max(1, Math.floor(params.nc));

  const symStrings = params.applySymmetry ? (snapshot.symmetryOps ?? []) : [];
  const symops: Symop[] = [];
  for (const s of symStrings) {
    const parsed = parseSymop(s);
    if (parsed) symops.push(parsed);
  }
  // Identity baseline when no (usable) symmetry operations.
  if (symops.length === 0) {
    symops.push({ rot: [1, 0, 0, 0, 1, 0, 0, 0, 1], trans: [0, 0, 0] });
  }

  const noTiling = na === 1 && nb === 1 && nc === 1;
  const noSym = symops.length === 1 && isIdentity(symops[0]);
  // Nothing to expand, or no cell to expand within.
  if ((noTiling && noSym) || !snapshot.box) {
    return snapshot;
  }

  const box = snapshot.box;
  const minv = invert3x3(box);
  if (!minv) return snapshot;

  const nBase = snapshot.nAtoms;
  const basePos = snapshot.positions;
  const baseElems = snapshot.elements;

  // Precompute fractional coords of the asymmetric unit.
  const baseFrac = new Float32Array(nBase * 3);
  for (let i = 0; i < nBase; i++) {
    const [fa, fb, fc] = cartToFrac(basePos[i * 3], basePos[i * 3 + 1], basePos[i * 3 + 2], minv);
    baseFrac[i * 3] = fa;
    baseFrac[i * 3 + 1] = fb;
    baseFrac[i * 3 + 2] = fc;
  }

  // Build the list of image fractional-coordinate sets. Each image is a rigid
  // copy: a symop applied to the asymmetric unit, with the whole molecule
  // wrapped (by centroid) into the home cell, then translated by the tiling
  // offset. Images coinciding within tolerance are dropped (special positions).
  const seen = new Set<string>();
  const imageFracSets: Float32Array[] = [];

  for (const op of symops) {
    // Apply symop to every base atom (rigid).
    const symFrac = new Float32Array(nBase * 3);
    let cx = 0,
      cy = 0,
      cz = 0;
    for (let i = 0; i < nBase; i++) {
      const fa = baseFrac[i * 3];
      const fb = baseFrac[i * 3 + 1];
      const fc = baseFrac[i * 3 + 2];
      const na2 = op.rot[0] * fa + op.rot[1] * fb + op.rot[2] * fc + op.trans[0];
      const nb2 = op.rot[3] * fa + op.rot[4] * fb + op.rot[5] * fc + op.trans[1];
      const nc2 = op.rot[6] * fa + op.rot[7] * fb + op.rot[8] * fc + op.trans[2];
      symFrac[i * 3] = na2;
      symFrac[i * 3 + 1] = nb2;
      symFrac[i * 3 + 2] = nc2;
      cx += na2;
      cy += nb2;
      cz += nc2;
    }
    // Wrap by centroid so the molecule stays whole and lands in the home cell.
    const sx = -Math.floor(cx / nBase);
    const sy = -Math.floor(cy / nBase);
    const sz = -Math.floor(cz / nBase);

    for (let i = 0; i < nBase * 3; i += 3) {
      symFrac[i] += sx;
      symFrac[i + 1] += sy;
      symFrac[i + 2] += sz;
    }

    for (let i = 0; i < na; i++) {
      for (let j = 0; j < nb; j++) {
        for (let k = 0; k < nc; k++) {
          const img = new Float32Array(nBase * 3);
          for (let a = 0; a < nBase; a++) {
            img[a * 3] = symFrac[a * 3] + i;
            img[a * 3 + 1] = symFrac[a * 3 + 1] + j;
            img[a * 3 + 2] = symFrac[a * 3 + 2] + k;
          }
          // Dedupe identical images (rounded centroid + first atom).
          const key = imageKey(img, nBase, i, j, k);
          if (seen.has(key)) continue;
          seen.add(key);
          imageFracSets.push(img);
        }
      }
    }
  }

  const nImages = imageFracSets.length;
  const nAtoms = nBase * nImages;
  const positions = new Float32Array(nAtoms * 3);
  const elements = new Uint8Array(nAtoms);

  for (let im = 0; im < nImages; im++) {
    const frac = imageFracSets[im];
    const base = im * nBase;
    for (let a = 0; a < nBase; a++) {
      const [x, y, z] = fracToCart(frac[a * 3], frac[a * 3 + 1], frac[a * 3 + 2], box);
      const o = (base + a) * 3;
      positions[o] = x;
      positions[o + 1] = y;
      positions[o + 2] = z;
      elements[base + a] = baseElems[a];
    }
  }

  // Replicate bonds with per-image index offset.
  const baseBonds = snapshot.bonds;
  const nBaseBonds = baseBonds.length / 2;
  const bonds = new Uint32Array(nBaseBonds * nImages * 2);
  const baseOrders = snapshot.bondOrders;
  const bondOrders = baseOrders ? new Uint8Array(nBaseBonds * nImages) : null;
  for (let im = 0; im < nImages; im++) {
    const atomOff = im * nBase;
    const bondOff = im * nBaseBonds;
    for (let b = 0; b < nBaseBonds; b++) {
      bonds[(bondOff + b) * 2] = baseBonds[b * 2] + atomOff;
      bonds[(bondOff + b) * 2 + 1] = baseBonds[b * 2 + 1] + atomOff;
      if (bondOrders && baseOrders) bondOrders[bondOff + b] = baseOrders[b];
    }
  }

  // Expanded cell box for the single enclosing cell (na·va, nb·vb, nc·vc).
  const newBox = new Float32Array(9);
  for (let r = 0; r < 3; r++) {
    const mult = r === 0 ? na : r === 1 ? nb : nc;
    newBox[r * 3] = box[r * 3] * mult;
    newBox[r * 3 + 1] = box[r * 3 + 1] * mult;
    newBox[r * 3 + 2] = box[r * 3 + 2] * mult;
  }

  // Tile per-atom auxiliary arrays where present; drop protein-only data
  // (cartoon indices would need offsetting and are irrelevant for crystals).
  const atomChainIds = snapshot.atomChainIds ? tileU8(snapshot.atomChainIds, nImages) : null;
  const atomBFactors = snapshot.atomBFactors ? tileF32(snapshot.atomBFactors, nImages) : null;

  return {
    nAtoms,
    nBonds: bonds.length / 2,
    nFileBonds: snapshot.nFileBonds * nImages,
    positions,
    elements,
    bonds,
    bondOrders,
    box: newBox,
    atomChainIds,
    atomBFactors,
    // Symmetry already applied — clear so a downstream node won't re-expand.
    symmetryOps: undefined,
  };
}

function isIdentity(op: Symop): boolean {
  const r = op.rot;
  return (
    r[0] === 1 &&
    r[4] === 1 &&
    r[8] === 1 &&
    r[1] === 0 &&
    r[2] === 0 &&
    r[3] === 0 &&
    r[5] === 0 &&
    r[6] === 0 &&
    r[7] === 0 &&
    op.trans[0] === 0 &&
    op.trans[1] === 0 &&
    op.trans[2] === 0
  );
}

function imageKey(frac: Float32Array, n: number, i: number, j: number, k: number): string {
  // Centroid + first atom, rounded, plus tiling offset uniquely identify image.
  let cx = 0,
    cy = 0,
    cz = 0;
  for (let a = 0; a < n; a++) {
    cx += frac[a * 3];
    cy += frac[a * 3 + 1];
    cz += frac[a * 3 + 2];
  }
  const round = (v: number) => Math.round(v * 1000) / 1000;
  return `${i},${j},${k}|${round(cx / n)},${round(cy / n)},${round(cz / n)}|${round(frac[0])},${round(frac[1])},${round(frac[2])}`;
}

function tileU8(arr: Uint8Array, n: number): Uint8Array {
  const out = new Uint8Array(arr.length * n);
  for (let i = 0; i < n; i++) out.set(arr, i * arr.length);
  return out;
}

function tileF32(arr: Float32Array, n: number): Float32Array {
  const out = new Float32Array(arr.length * n);
  for (let i = 0; i < n; i++) out.set(arr, i * arr.length);
  return out;
}
