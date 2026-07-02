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
    /// Frame-major flat coordinates for ALL frames:
    /// `[frame0: x0,y0,z0,x1,…][frame1: …]…`. Length == `n_frames * n_atoms * 3`.
    ///
    /// A single contiguous allocation (instead of one `Vec` per frame) so the
    /// WASM/PyO3 boundary can hand the whole trajectory to the host without a
    /// flatten copy or a 2× memory peak.
    pub frame_positions_flat: Vec<f32>,
    /// Embedded vector channels parsed from the trajectory file.
    /// Empty when the format carries no per-atom vector quantities.
    pub vector_channels: Vec<VectorChannel>,
}

impl TrajectoryData {
    /// Flat `[x0,y0,z0,…]` slice for frame `i`. Panics if `i >= n_frames`.
    pub fn frame(&self, i: usize) -> &[f32] {
        let stride = self.n_atoms * 3;
        &self.frame_positions_flat[i * stride..(i + 1) * stride]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_frame_slicing() {
        // 2 frames, 2 atoms (stride 6): frame 1 starts at flat index 6.
        let traj = TrajectoryData {
            n_atoms: 2,
            n_frames: 2,
            timestep_ps: 1.0,
            box_matrix: None,
            frame_positions_flat: vec![
                0.0, 1.0, 2.0, 3.0, 4.0, 5.0, // frame 0
                6.0, 7.0, 8.0, 9.0, 10.0, 11.0, // frame 1
            ],
            vector_channels: vec![],
        };
        assert_eq!(traj.frame(0), &[0.0, 1.0, 2.0, 3.0, 4.0, 5.0]);
        assert_eq!(traj.frame(1), &[6.0, 7.0, 8.0, 9.0, 10.0, 11.0]);
    }
}
