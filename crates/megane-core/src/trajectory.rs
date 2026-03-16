/// A single frame of per-atom vector data (e.g. velocity or force).
pub struct VectorFrame {
    /// Index of the trajectory frame this data corresponds to.
    pub frame: usize,
    /// Flat array of per-atom vectors: [vx0,vy0,vz0, vx1,vy1,vz1, ...]
    pub vectors: Vec<f32>,
}

/// A named channel of per-atom vector data across one or more frames.
///
/// A channel with a single frame is treated as "static" — the same vectors
/// are shown for all playback frames. A channel with N frames advances in sync
/// with the trajectory.
pub struct VectorChannel {
    /// Human-readable name, e.g. "velocity" or "force".
    pub name: String,
    /// Per-frame vector data. Length 1 = static; length N = frame-synced.
    pub frames: Vec<VectorFrame>,
}

pub struct TrajectoryData {
    pub n_atoms: usize,
    pub n_frames: usize,
    pub timestep_ps: f32,
    pub box_matrix: Option<[f32; 9]>,
    pub frame_positions: Vec<Vec<f32>>,
    /// Embedded vector channels parsed from the trajectory file.
    /// Empty when the format carries no per-atom vector quantities.
    pub vector_channels: Vec<VectorChannel>,
}
