/**
 * OpenDX (`.dx`) volumetric grid parser.
 *
 * The de-facto output of APBS electrostatics and a common VMD / PyMOL input:
 *
 * ```
 * object 1 class gridpositions counts nx ny nz
 * origin  ox oy oz
 * delta   hx 0  0
 * delta   0  hy 0
 * delta   0  0  hz
 * object 2 class gridconnections counts nx ny nz
 * object 3 class array type double rank 0 items N data follows
 * v v v
 * ...
 * ```
 *
 * Units are Angstroms already (unlike CUBE, which is Bohr), so no conversion.
 * Data ordering matches CUBE's: outer loop ix, middle iy, inner iz — the flat
 * index is `ix*ny*nz + iy*nz + iz`, so `VolumetricData` consumers and the
 * isosurface node work unchanged.
 */

import type { VolumetricData } from "../types";

/** Result of parsing an OpenDX file. Shape-compatible with `CubeParseResult`
 * minus the atom block, which OpenDX does not carry. */
export type DxParseResult = VolumetricData;

/**
 * True when `text` looks like an OpenDX grid rather than a JCAMP-DX spectrum.
 *
 * Both formats claim the `.dx` extension. JCAMP-DX opens with `##TITLE=` /
 * `##JCAMP-DX=`; OpenDX opens with an `object ... class gridpositions` header.
 * Sniffing the head of the file is the only way to tell them apart, so
 * `LoadVolumetricNode` calls this before handing the text to `parseDx`.
 */
export function isOpenDx(text: string): boolean {
  // Only the first few KB matter — enough to clear comments and reach the
  // first `object` line without scanning a 100 MB grid.
  const head = text.slice(0, 4096);
  if (/^\s*##(TITLE|JCAMP-DX)\s*=/im.test(head)) return false;
  return /^\s*object\b[^\n]*\bclass\s+gridpositions\b/im.test(head);
}

/** Numeric tokens on a line, ignoring everything non-numeric. */
function numbers(line: string): number[] {
  const out: number[] = [];
  for (const tok of line.trim().split(/\s+/)) {
    const v = Number(tok);
    if (Number.isFinite(v)) out.push(v);
  }
  return out;
}

/**
 * Parse an OpenDX scalar-field file into `VolumetricData`.
 * Throws a descriptive `Error` on malformed input.
 */
export function parseDx(text: string): DxParseResult {
  const lines = text.split("\n");

  let dims: [number, number, number] | null = null;
  const origin = new Float32Array(3);
  const step = new Float32Array(9);
  let deltaRow = 0;
  let dataStart = -1;
  let declaredItems = -1;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (line === "" || line.startsWith("#")) continue;
    const lower = line.toLowerCase();

    if (lower.startsWith("object")) {
      if (lower.includes("gridpositions")) {
        const counts = numbers(line.slice(lower.indexOf("counts") + "counts".length));
        if (counts.length < 3) throw new Error("OpenDX: gridpositions line is missing counts");
        dims = [counts[0], counts[1], counts[2]];
      } else if (lower.includes("data follows")) {
        const m = /\bitems\s+(\d+)/i.exec(line);
        if (m) declaredItems = Number(m[1]);
        dataStart = i + 1;
        break;
      }
      continue;
    }
    if (lower.startsWith("origin")) {
      const v = numbers(line.slice("origin".length));
      if (v.length < 3) throw new Error("OpenDX: malformed origin line");
      origin[0] = v[0];
      origin[1] = v[1];
      origin[2] = v[2];
      continue;
    }
    if (lower.startsWith("delta")) {
      const v = numbers(line.slice("delta".length));
      if (v.length < 3) throw new Error("OpenDX: malformed delta line");
      if (deltaRow < 3) {
        step[deltaRow * 3 + 0] = v[0];
        step[deltaRow * 3 + 1] = v[1];
        step[deltaRow * 3 + 2] = v[2];
        deltaRow++;
      }
      continue;
    }
  }

  if (!dims) throw new Error("OpenDX: no 'class gridpositions' header found");
  const [nx, ny, nz] = dims;
  if (!(nx > 0 && ny > 0 && nz > 0)) {
    throw new Error(`OpenDX: invalid grid counts ${nx} ${ny} ${nz}`);
  }
  if (deltaRow < 3) throw new Error("OpenDX: expected three delta lines");
  if (dataStart < 0) throw new Error("OpenDX: no 'data follows' array object found");

  const totalVoxels = nx * ny * nz;
  if (declaredItems >= 0 && declaredItems !== totalVoxels) {
    throw new Error(
      `OpenDX: header declares ${declaredItems} items but the grid is ${nx}x${ny}x${nz} = ${totalVoxels}`,
    );
  }

  const data = new Float32Array(totalVoxels);
  let idx = 0;
  let dataMin = Infinity;
  let dataMax = -Infinity;
  for (let i = dataStart; i < lines.length && idx < totalVoxels; i++) {
    const line = lines[i].trim();
    if (line === "" || line.startsWith("#")) continue;
    // `attribute`/`object`/`component` trailers close the data section.
    if (/^[a-z]/i.test(line)) break;
    for (const tok of line.split(/\s+/)) {
      if (idx >= totalVoxels) break;
      const v = Number(tok);
      if (!Number.isFinite(v)) continue;
      data[idx++] = v;
      if (v < dataMin) dataMin = v;
      if (v > dataMax) dataMax = v;
    }
  }

  if (idx < totalVoxels) {
    throw new Error(`OpenDX: expected ${totalVoxels} data values, got ${idx}`);
  }
  if (!Number.isFinite(dataMin)) {
    dataMin = 0;
    dataMax = 0;
  }

  return {
    type: "volumetric",
    nx,
    ny,
    nz,
    origin,
    step,
    data,
    dataMin,
    dataMax,
  };
}
