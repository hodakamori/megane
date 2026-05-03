import { describe, it, expect } from "vitest";
import {
  TRAJECTORY_ONLY_EXTENSIONS,
  isTrajectoryOnly,
} from "../../../jupyterlab-megane/src/trajectoryUtils";

describe("TRAJECTORY_ONLY_EXTENSIONS", () => {
  it("includes all five trajectory-only extensions", () => {
    expect(TRAJECTORY_ONLY_EXTENSIONS.has(".xtc")).toBe(true);
    expect(TRAJECTORY_ONLY_EXTENSIONS.has(".dcd")).toBe(true);
    expect(TRAJECTORY_ONLY_EXTENSIONS.has(".lammpstrj")).toBe(true);
    expect(TRAJECTORY_ONLY_EXTENSIONS.has(".dump")).toBe(true);
    expect(TRAJECTORY_ONLY_EXTENSIONS.has(".nc")).toBe(true);
  });

  it("does not include structure-file extensions", () => {
    for (const ext of [".pdb", ".gro", ".xyz", ".mol", ".sdf", ".cif", ".traj", ".data"]) {
      expect(TRAJECTORY_ONLY_EXTENSIONS.has(ext)).toBe(false);
    }
  });
});

describe("isTrajectoryOnly", () => {
  it("returns true for .xtc files", () => {
    expect(isTrajectoryOnly("trajectory.xtc")).toBe(true);
  });

  it("returns true for .dcd files (DCD binary trajectory)", () => {
    expect(isTrajectoryOnly("run.dcd")).toBe(true);
  });

  it("returns true for .lammpstrj files", () => {
    expect(isTrajectoryOnly("dump.lammpstrj")).toBe(true);
  });

  it("returns true for .dump files", () => {
    expect(isTrajectoryOnly("lammps.dump")).toBe(true);
  });

  it("returns true for .nc files (AMBER NetCDF)", () => {
    expect(isTrajectoryOnly("traj.nc")).toBe(true);
  });

  it("returns false for structure-file extensions", () => {
    expect(isTrajectoryOnly("protein.pdb")).toBe(false);
    expect(isTrajectoryOnly("system.gro")).toBe(false);
    expect(isTrajectoryOnly("molecule.xyz")).toBe(false);
    expect(isTrajectoryOnly("compound.mol")).toBe(false);
    expect(isTrajectoryOnly("structure.cif")).toBe(false);
    expect(isTrajectoryOnly("md.traj")).toBe(false);
    expect(isTrajectoryOnly("topology.data")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(isTrajectoryOnly("TRAJ.XTC")).toBe(true);
    expect(isTrajectoryOnly("RUN.DCD")).toBe(true);
    expect(isTrajectoryOnly("DUMP.LAMMPSTRJ")).toBe(true);
  });

  it("returns false for filenames with no extension", () => {
    expect(isTrajectoryOnly("noextension")).toBe(false);
    expect(isTrajectoryOnly("")).toBe(false);
  });

  it("uses the last dot for extension detection", () => {
    expect(isTrajectoryOnly("archive.tar.xtc")).toBe(true);
    expect(isTrajectoryOnly("archive.xtc.pdb")).toBe(false);
  });
});
