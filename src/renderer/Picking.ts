/**
 * Screen-space atom and bond picking.
 * Pure functions that project 3D positions to screen coordinates
 * and perform hit-testing against mouse position.
 */

import * as THREE from "three";
import type { Snapshot, HoverInfo } from "../types";
import {
  getElementSymbol,
  getRadius,
  BALL_STICK_ATOM_SCALE,
} from "../constants";

// Temporary vector for screen-space projection (avoids allocation per atom)
const _projVec = new THREE.Vector4();

/** Project a 3D point to screen coordinates. Returns {sx, sy, depth} in pixels. */
export function projectToScreen(
  camera: THREE.Camera,
  x: number, y: number, z: number,
  w: number, h: number,
): { sx: number; sy: number; depth: number } {
  _projVec.set(x, y, z, 1);
  _projVec.applyMatrix4(camera.matrixWorldInverse);
  const depth = -_projVec.z; // camera-space depth (positive = in front)
  _projVec.applyMatrix4(camera.projectionMatrix);
  // NDC to pixels
  const sx = ((_projVec.x / _projVec.w) * 0.5 + 0.5) * w;
  const sy = ((-_projVec.y / _projVec.w) * 0.5 + 0.5) * h;
  return { sx, sy, depth };
}

/** Estimate the screen-space radius (in pixels) of a sphere at the given depth. */
export function screenRadius(
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
  worldRadius: number,
  depth: number,
  h: number,
): number {
  if (camera instanceof THREE.OrthographicCamera) {
    // Orthographic: size is independent of depth
    const frustumHeight = (camera.top - camera.bottom) / camera.zoom;
    const pxPerUnit = h / frustumHeight;
    return worldRadius * pxPerUnit;
  }
  const fovRad = (camera.fov * Math.PI) / 180;
  const pxPerUnit = h / (2 * depth * Math.tan(fovRad / 2));
  return worldRadius * pxPerUnit;
}

/** Perform a pick at the given screen coordinates using CPU screen-space projection. */
export function pickAtPixel(
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
  container: HTMLElement,
  snapshot: Snapshot,
  currentPositions: Float32Array,
  atomScale: number,
  clientX: number,
  clientY: number,
): HoverInfo {
  const rect = container.getBoundingClientRect();
  const mx = clientX - rect.left; // mouse in pixels relative to container
  const my = clientY - rect.top;
  const w = rect.width;
  const h = rect.height;

  const pos = currentPositions;
  const elements = snapshot.elements;
  const nAtoms = snapshot.nAtoms;

  // --- Atom picking ---
  let bestAtomIdx = -1;
  let bestAtomDepth = Infinity;

  for (let i = 0; i < nAtoms; i++) {
    const { sx, sy, depth } = projectToScreen(
      camera, pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], w, h,
    );
    if (depth <= 0) continue; // behind camera

    const worldR = getRadius(elements[i]) * BALL_STICK_ATOM_SCALE * atomScale;
    const screenR = screenRadius(camera, worldR, depth, h);
    const dx = mx - sx;
    const dy = my - sy;
    const distSq = dx * dx + dy * dy;

    if (distSq <= screenR * screenR && depth < bestAtomDepth) {
      bestAtomIdx = i;
      bestAtomDepth = depth;
    }
  }

  if (bestAtomIdx >= 0) {
    const idx = bestAtomIdx;
    const atomicNum = elements[idx];
    return {
      kind: "atom",
      atomIndex: idx,
      elementSymbol: getElementSymbol(atomicNum),
      atomicNumber: atomicNum,
      position: [pos[idx * 3], pos[idx * 3 + 1], pos[idx * 3 + 2]],
      screenX: clientX,
      screenY: clientY,
    };
  }

  // --- Bond picking ---
  const BOND_PICK_THRESHOLD_PX = 8;
  const bonds = snapshot.bonds;
  const nBonds = snapshot.nBonds;
  const bondOrders = snapshot.bondOrders;
  let bestBondIdx = -1;
  let bestBondDepth = Infinity;

  for (let b = 0; b < nBonds; b++) {
    const ai = bonds[b * 2];
    const bi = bonds[b * 2 + 1];
    // midpoint
    const midX = (pos[ai * 3] + pos[bi * 3]) * 0.5;
    const midY = (pos[ai * 3 + 1] + pos[bi * 3 + 1]) * 0.5;
    const midZ = (pos[ai * 3 + 2] + pos[bi * 3 + 2]) * 0.5;
    const { sx, sy, depth } = projectToScreen(camera, midX, midY, midZ, w, h);
    if (depth <= 0) continue;
    const dx = mx - sx;
    const dy = my - sy;
    const distSq = dx * dx + dy * dy;
    if (distSq <= BOND_PICK_THRESHOLD_PX * BOND_PICK_THRESHOLD_PX && depth < bestBondDepth) {
      bestBondIdx = b;
      bestBondDepth = depth;
    }
  }

  if (bestBondIdx >= 0) {
    const ai = bonds[bestBondIdx * 2];
    const bi = bonds[bestBondIdx * 2 + 1];
    const dxw = pos[bi * 3] - pos[ai * 3];
    const dyw = pos[bi * 3 + 1] - pos[ai * 3 + 1];
    const dzw = pos[bi * 3 + 2] - pos[ai * 3 + 2];
    const bondLength = Math.sqrt(dxw * dxw + dyw * dyw + dzw * dzw);
    const bondOrder = bondOrders ? bondOrders[bestBondIdx] : 1;
    return {
      kind: "bond",
      atomA: ai,
      atomB: bi,
      bondOrder,
      bondLength,
      screenX: clientX,
      screenY: clientY,
    };
  }

  return null;
}
