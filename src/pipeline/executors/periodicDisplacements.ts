/** Cartesian displacement plus the integer lattice shift applied to its target. */
export type PeriodicDisplacement = [number, number, number, number, number, number];

/**
 * Enumerate every periodic image of a displacement inside a Cartesian cutoff.
 *
 * A minimum-image lookup returns only one image. That is insufficient for small
 * cells, where two or more images of the same structural atom can all be valid
 * neighbours. Reciprocal-vector bounds keep the enumeration finite while
 * retaining every image inside the cutoff sphere.
 */
export function periodicDisplacementsWithinCutoff(
  dx: number,
  dy: number,
  dz: number,
  box: Float32Array,
  inverse: Float32Array,
  cutoffSq: number,
): PeriodicDisplacement[] {
  const fa = inverse[0] * dx + inverse[3] * dy + inverse[6] * dz;
  const fb = inverse[1] * dx + inverse[4] * dy + inverse[7] * dz;
  const fc = inverse[2] * dx + inverse[5] * dy + inverse[8] * dz;
  const cutoff = Math.sqrt(cutoffSq);
  const epsilon = 1e-7;

  const radiusA = cutoff * Math.hypot(inverse[0], inverse[3], inverse[6]);
  const radiusB = cutoff * Math.hypot(inverse[1], inverse[4], inverse[7]);
  const radiusC = cutoff * Math.hypot(inverse[2], inverse[5], inverse[8]);
  const aMin = Math.ceil(-fa - radiusA - epsilon);
  const aMax = Math.floor(-fa + radiusA + epsilon);
  const bMin = Math.ceil(-fb - radiusB - epsilon);
  const bMax = Math.floor(-fb + radiusB + epsilon);
  const cMin = Math.ceil(-fc - radiusC - epsilon);
  const cMax = Math.floor(-fc + radiusC + epsilon);
  const images: PeriodicDisplacement[] = [];

  for (let imageA = aMin; imageA <= aMax; imageA++) {
    for (let imageB = bMin; imageB <= bMax; imageB++) {
      for (let imageC = cMin; imageC <= cMax; imageC++) {
        const sa = fa + imageA;
        const sb = fb + imageB;
        const sc = fc + imageC;
        const imageDx = box[0] * sa + box[3] * sb + box[6] * sc;
        const imageDy = box[1] * sa + box[4] * sb + box[7] * sc;
        const imageDz = box[2] * sa + box[5] * sb + box[8] * sc;
        const distanceSq = imageDx * imageDx + imageDy * imageDy + imageDz * imageDz;
        if (distanceSq <= cutoffSq + epsilon && distanceSq > 0.01) {
          images.push([imageDx, imageDy, imageDz, imageA, imageB, imageC]);
        }
      }
    }
  }

  return images;
}

/** Integer shift that places the target's minimum image next to the source. */
export function minimumImageTargetShift(
  dx: number,
  dy: number,
  dz: number,
  inverse: Float32Array,
): [number, number, number] {
  const fa = inverse[0] * dx + inverse[3] * dy + inverse[6] * dz;
  const fb = inverse[1] * dx + inverse[4] * dy + inverse[7] * dz;
  const fc = inverse[2] * dx + inverse[5] * dy + inverse[8] * dz;
  return [-Math.round(fa), -Math.round(fb), -Math.round(fc)];
}
