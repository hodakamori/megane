/// Common trajectory data returned by XTC and LAMMPS dump parsers.
///
/// Both formats provide multi-frame position data without topology;
/// element and bond information comes from a separate structure file.
pub struct TrajectoryData {
    pub n_atoms: usize,
    pub n_frames: usize,
    pub timestep_ps: f32,
    pub box_matrix: Option<[f32; 9]>,
    pub frame_positions: Vec<Vec<f32>>,
}
