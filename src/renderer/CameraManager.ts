/**
 * Camera management utilities for the molecular viewer.
 * Handles fit-to-view, frustum insets, and perspective switching.
 */

import * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Snapshot } from "../types";

export interface ViewExtent {
  maxExtent: number;
  extentX: number;
  extentY: number;
}

/** Compute bounding box and center for a snapshot. */
export function computeViewBounds(snapshot: Snapshot): {
  center: [number, number, number];
  extent: ViewExtent;
} {
  const { positions, nAtoms } = snapshot;

  let sumX = 0, sumY = 0, sumZ = 0;
  for (let i = 0; i < nAtoms; i++) {
    sumX += positions[i * 3];
    sumY += positions[i * 3 + 1];
    sumZ += positions[i * 3 + 2];
  }

  let cx: number, cy: number, cz: number;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  const hasBox = snapshot.box && snapshot.box.some((v) => v !== 0);

  if (hasBox) {
    const box = snapshot.box!;
    cx = (box[0] + box[3] + box[6]) / 2;
    cy = (box[1] + box[4] + box[7]) / 2;
    cz = (box[2] + box[5] + box[8]) / 2;

    const va = [box[0], box[1], box[2]];
    const vb = [box[3], box[4], box[5]];
    const vc = [box[6], box[7], box[8]];
    for (let ia = 0; ia <= 1; ia++) {
      for (let ib = 0; ib <= 1; ib++) {
        for (let ic = 0; ic <= 1; ic++) {
          const vx = ia * va[0] + ib * vb[0] + ic * vc[0];
          const vy = ia * va[1] + ib * vb[1] + ic * vc[1];
          const vz = ia * va[2] + ib * vb[2] + ic * vc[2];
          minX = Math.min(minX, vx);
          minY = Math.min(minY, vy);
          minZ = Math.min(minZ, vz);
          maxX = Math.max(maxX, vx);
          maxY = Math.max(maxY, vy);
          maxZ = Math.max(maxZ, vz);
        }
      }
    }
  } else {
    cx = nAtoms > 0 ? sumX / nAtoms : 0;
    cy = nAtoms > 0 ? sumY / nAtoms : 0;
    cz = nAtoms > 0 ? sumZ / nAtoms : 0;

    for (let i = 0; i < nAtoms; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      minZ = Math.min(minZ, z);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      maxZ = Math.max(maxZ, z);
    }
  }

  const extentX = maxX - minX;
  const extentY = maxY - minY;
  const extentZ = maxZ - minZ;
  const maxExtent = Math.max(extentX, extentY, extentZ);

  return {
    center: [cx, cy, cz],
    extent: { maxExtent, extentX, extentY },
  };
}

/** Fit the camera to show all atoms (or simulation cell if present). */
export function fitCameraToView(
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
  controls: OrbitControls,
  snapshot: Snapshot,
): ViewExtent {
  const { center, extent } = computeViewBounds(snapshot);
  const [cx, cy, cz] = center;

  controls.target.set(cx, cy, cz);

  const distance = Math.max(extent.maxExtent * 1.2, 0.1);
  camera.position.set(cx, cy - distance, cz);

  if (camera instanceof THREE.OrthographicCamera) {
    camera.near = -distance * 10;
    camera.far = distance * 10;
    camera.zoom = 1;
  } else {
    camera.near = distance * 0.01;
    camera.far = distance * 10;
    camera.updateProjectionMatrix();
  }
  controls.update();

  return extent;
}

/**
 * Recalculate the orthographic frustum so the model fits within the
 * visible area (accounting for overlay insets) and appears centered.
 */
export function applyFrustumInsets(
  camera: THREE.OrthographicCamera,
  containerWidth: number,
  containerHeight: number,
  insetLeft: number,
  insetRight: number,
  extent: ViewExtent,
): void {
  if (containerWidth === 0 || containerHeight === 0) return;

  const minVisible = Math.max(containerWidth * 0.3, 100);
  const effectiveWidth = Math.max(containerWidth - insetLeft - insetRight, minVisible);
  const effectiveAspect = effectiveWidth / containerHeight;

  const padding = 1.2;
  const halfH =
    Math.max(extent.extentY / 2, extent.extentX / (2 * effectiveAspect)) *
    padding;
  const frustumHeight = Math.max(halfH * 2, 0.1);

  const fullAspect = containerWidth / containerHeight;
  const halfW = (frustumHeight * fullAspect) / 2;

  camera.left = -halfW;
  camera.right = halfW;
  camera.top = frustumHeight / 2;
  camera.bottom = -frustumHeight / 2;

  const frustumWidth = 2 * halfW;
  const shift = ((insetLeft - insetRight) / (2 * containerWidth)) * frustumWidth;
  camera.left -= shift;
  camera.right -= shift;

  camera.updateProjectionMatrix();
}

/**
 * Create a new camera for switching between orthographic and perspective projection.
 * Returns the new camera with position/up preserved from the old one.
 * Caller is responsible for recreating OrbitControls.
 */
export function createSwitchedCamera(
  currentCamera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
  enabled: boolean,
  containerWidth: number,
  containerHeight: number,
): THREE.OrthographicCamera | THREE.PerspectiveCamera {
  const pos = currentCamera.position.clone();
  const up = currentCamera.up.clone();
  const aspect = containerWidth / containerHeight;

  let newCamera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  if (enabled) {
    newCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 10000);
  } else {
    const frustumSize = 50;
    newCamera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2, frustumSize * aspect / 2,
      frustumSize / 2, -frustumSize / 2,
      0.1, 10000,
    );
  }

  newCamera.position.copy(pos);
  newCamera.up.copy(up);

  return newCamera;
}
