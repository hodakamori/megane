/**
 * Trajectory-only file extensions: formats that carry frame data but no atom
 * topology, so they require a structure file to be loaded first.
 *
 * Used by both MeganeDocWidget (JupyterLab) and the VSCode webview to decide
 * whether to route an opened file through the trajectory loader path.
 *
 * Note: LAMMPS dump (`.lammpstrj` / `.dump` / `.trj`) is intentionally NOT here.
 * A dump carries per-atom `type` ids and coordinates, so it is opened standalone
 * as a multi-frame structure (topology derived from frame 0) via the structure
 * loader path, exactly like a multi-frame XYZ or ASE `.traj`.
 */
export const TRAJECTORY_ONLY_EXTENSIONS = new Set([".xtc", ".dcd", ".nc"]);

/**
 * Spectrum-only file extensions. A JCAMP-DX spectrum has no coordinates at all,
 * so there is nothing for the 3D viewer to render; opening one standalone
 * surfaces an actionable error pointing at the Load Spectrum node.
 *
 * `.dx` is deliberately absent: it is shared with OpenDX volumetric grids and
 * can only be resolved by sniffing the content, which the Load Spectrum and
 * Load Volumetric nodes each do.
 */
export const SPECTRUM_ONLY_EXTENSIONS = new Set([".jdx", ".jcamp"]);

/**
 * Returns true when `filename` maps to a trajectory-only format that needs a
 * topology structure pre-loaded before it can be rendered.
 */
export function isTrajectoryOnly(filename: string): boolean {
  const lower = filename.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot < 0) return false;
  return TRAJECTORY_ONLY_EXTENSIONS.has(lower.slice(dot));
}

/**
 * Returns true when `filename` maps to a spectrum-only format, which has no
 * coordinates and therefore nothing for the 3D viewer to draw.
 */
export function isSpectrumOnly(filename: string): boolean {
  const lower = filename.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot < 0) return false;
  return SPECTRUM_ONLY_EXTENSIONS.has(lower.slice(dot));
}
