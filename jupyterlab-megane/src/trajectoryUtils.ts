/**
 * Trajectory-only file extensions: formats that carry frame data but no atom
 * topology, so they require a structure file to be loaded first.
 *
 * Used by both MeganeDocWidget (JupyterLab) and the VSCode webview to decide
 * whether to route an opened file through the trajectory loader path.
 */
export const TRAJECTORY_ONLY_EXTENSIONS = new Set([".xtc", ".dcd", ".lammpstrj", ".dump", ".nc"]);

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
