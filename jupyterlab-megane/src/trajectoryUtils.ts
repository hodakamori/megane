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
 * Volumetric-only file extensions: scalar grids (Gaussian CUBE, OpenDX) that
 * carry a field but no atoms. Opening one standalone has nothing to overlay,
 * so — exactly like the trajectory-only formats above — the host surfaces an
 * actionable error pointing at the Load Volumetric node instead of feeding the
 * grid to the structure parser.
 */
export const VOLUMETRIC_ONLY_EXTENSIONS = new Set([".cube", ".cub", ".dx"]);

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
 * Returns true when `filename` maps to a volumetric-only format (a scalar grid
 * with no atoms), which needs a structure loaded before it means anything.
 */
export function isVolumetricOnly(filename: string): boolean {
  const lower = filename.toLowerCase();
  const dot = lower.lastIndexOf(".");
  if (dot < 0) return false;
  return VOLUMETRIC_ONLY_EXTENSIONS.has(lower.slice(dot));
}
