use js_sys::{Float32Array, Uint32Array, Uint8Array};
use wasm_bindgen::prelude::*;

use megane_core::{
    bonds, cif, gro, lammps_data, lammpstrj, mol, mol2, parser, top, traj, xtc, xyz,
};

/// Serialize a slice of `VectorChannel`s into two parallel outputs:
/// - A JSON string describing channel metadata (name, n_frames per channel).
/// - A flat `Vec<f32>` with all channel/frame vectors concatenated in order.
///
/// Layout in the flat buffer: for each channel, for each frame in order,
/// `n_atoms * 3` f32 values.
fn serialize_vector_channels(
    channels: &[megane_core::trajectory::VectorChannel],
) -> (String, Vec<f32>) {
    use std::fmt::Write as FmtWrite;

    let mut meta = String::from("[");
    let mut data: Vec<f32> = Vec::new();

    for (idx, ch) in channels.iter().enumerate() {
        if idx > 0 {
            meta.push(',');
        }
        let _ = write!(
            meta,
            r#"{{"name":"{}", "n_frames":{}}}"#,
            ch.name,
            ch.frames.len()
        );
        for frame in &ch.frames {
            data.extend_from_slice(&frame.vectors);
        }
    }
    meta.push(']');

    (meta, data)
}

/// Result of parsing a PDB file, exposed to JavaScript via wasm-bindgen.
#[wasm_bindgen]
pub struct ParseResult {
    n_atoms: u32,
    n_bonds: u32,
    n_file_bonds: u32,
    n_frames: u32,
    has_box: bool,
    has_atom_labels: bool,
    positions: Vec<f32>,
    elements: Vec<u8>,
    bonds: Vec<u32>,
    bond_orders: Vec<u8>,
    box_matrix: Vec<f32>,
    frame_data: Vec<f32>,
    atom_labels: String,
    chain_ids: Vec<u8>,
    bfactors: Vec<f32>,
    vector_channel_count: u32,
    vector_channel_meta: String,
    vector_channel_data: Vec<f32>,
}

#[wasm_bindgen]
impl ParseResult {
    #[wasm_bindgen(getter)]
    pub fn n_atoms(&self) -> u32 {
        self.n_atoms
    }

    #[wasm_bindgen(getter)]
    pub fn n_bonds(&self) -> u32 {
        self.n_bonds
    }

    #[wasm_bindgen(getter)]
    pub fn n_file_bonds(&self) -> u32 {
        self.n_file_bonds
    }

    #[wasm_bindgen(getter)]
    pub fn n_frames(&self) -> u32 {
        self.n_frames
    }

    #[wasm_bindgen(getter)]
    pub fn has_box(&self) -> bool {
        self.has_box
    }

    #[wasm_bindgen(getter)]
    pub fn has_atom_labels(&self) -> bool {
        self.has_atom_labels
    }

    /// Per-atom labels as newline-delimited string.
    #[wasm_bindgen(getter)]
    pub fn atom_labels(&self) -> String {
        self.atom_labels.clone()
    }

    /// Number of embedded vector channels (0 when none).
    #[wasm_bindgen(getter)]
    pub fn vector_channel_count(&self) -> u32 {
        self.vector_channel_count
    }

    /// JSON array describing each channel: `[{"name":"velocity","n_frames":1}, ...]`
    #[wasm_bindgen(getter)]
    pub fn vector_channel_meta(&self) -> String {
        self.vector_channel_meta.clone()
    }

    /// Atom positions as Float32Array [x0,y0,z0, x1,y1,z1, ...]
    pub fn positions(&self) -> Float32Array {
        Float32Array::from(&self.positions[..])
    }

    /// Atomic numbers as Uint8Array
    pub fn elements(&self) -> Uint8Array {
        Uint8Array::from(&self.elements[..])
    }

    /// Bond pairs as Uint32Array [a0,b0, a1,b1, ...]
    pub fn bonds(&self) -> Uint32Array {
        Uint32Array::from(&self.bonds[..])
    }

    /// Bond orders as Uint8Array (all 1 for PDB files)
    pub fn bond_orders(&self) -> Uint8Array {
        Uint8Array::from(&self.bond_orders[..])
    }

    /// Cell matrix as Float32Array (9 floats, row-major 3x3)
    pub fn box_matrix(&self) -> Float32Array {
        Float32Array::from(&self.box_matrix[..])
    }

    /// All additional frame positions concatenated as Float32Array
    /// (n_frames * n_atoms * 3 floats)
    pub fn frame_data(&self) -> Float32Array {
        Float32Array::from(&self.frame_data[..])
    }

    /// All vector channel data concatenated as Float32Array.
    /// Layout: channel0_frame0, channel0_frame1, …, channel1_frame0, …
    /// Each frame is n_atoms * 3 floats.
    pub fn vector_channel_data(&self) -> Float32Array {
        Float32Array::from(&self.vector_channel_data[..])
    }

    /// Per-atom chain IDs as Uint8Array (ASCII bytes; empty when not available).
    pub fn chain_ids(&self) -> Uint8Array {
        Uint8Array::from(&self.chain_ids[..])
    }

    /// Per-atom B-factors as Float32Array (empty when not available).
    pub fn bfactors(&self) -> Float32Array {
        Float32Array::from(&self.bfactors[..])
    }

    /// Whether chain ID data is available (non-empty chain_ids).
    #[wasm_bindgen(getter)]
    pub fn has_chain_ids(&self) -> bool {
        !self.chain_ids.is_empty()
    }

    /// Whether B-factor data is available (non-empty bfactors).
    #[wasm_bindgen(getter)]
    pub fn has_bfactors(&self) -> bool {
        !self.bfactors.is_empty()
    }
}

impl ParseResult {
    fn from_parsed(data: parser::ParsedStructure) -> Self {
        let n_bonds = data.bonds.len() as u32;
        let mut bonds_flat: Vec<u32> = Vec::with_capacity(data.bonds.len() * 2);
        for (a, b) in &data.bonds {
            bonds_flat.push(*a);
            bonds_flat.push(*b);
        }
        let bond_orders = data
            .bond_orders
            .unwrap_or_else(|| vec![1u8; data.bonds.len()]);
        let has_box = data.box_matrix.is_some();
        let box_matrix = data.box_matrix.map(|m| m.to_vec()).unwrap_or_default();
        let n_frames = data.frame_positions.len() as u32;
        let frame_data: Vec<f32> = data
            .frame_positions
            .into_iter()
            .flat_map(|f| f.into_iter())
            .collect();
        let has_atom_labels = data.atom_labels.is_some();
        let atom_labels = data.atom_labels.map(|l| l.join("\n")).unwrap_or_default();

        let vector_channel_count = data.vector_channels.len() as u32;
        let (vector_channel_meta, vector_channel_data) =
            serialize_vector_channels(&data.vector_channels);

        Self {
            n_atoms: data.n_atoms as u32,
            n_bonds,
            n_file_bonds: data.n_file_bonds as u32,
            n_frames,
            has_box,
            has_atom_labels,
            positions: data.positions,
            elements: data.elements,
            bonds: bonds_flat,
            bond_orders,
            box_matrix,
            frame_data,
            atom_labels,
            chain_ids: data.chain_ids,
            bfactors: data.bfactors,
            vector_channel_count,
            vector_channel_meta,
            vector_channel_data,
        }
    }
}

/// Result of parsing an XTC trajectory file.
#[wasm_bindgen]
pub struct XtcParseResult {
    n_atoms: u32,
    n_frames: u32,
    timestep_ps: f32,
    has_box: bool,
    box_matrix: Vec<f32>,
    frame_data: Vec<f32>,
    vector_channel_count: u32,
    vector_channel_meta: String,
    vector_channel_data: Vec<f32>,
}

#[wasm_bindgen]
impl XtcParseResult {
    #[wasm_bindgen(getter)]
    pub fn n_atoms(&self) -> u32 {
        self.n_atoms
    }

    #[wasm_bindgen(getter)]
    pub fn n_frames(&self) -> u32 {
        self.n_frames
    }

    #[wasm_bindgen(getter)]
    pub fn timestep_ps(&self) -> f32 {
        self.timestep_ps
    }

    #[wasm_bindgen(getter)]
    pub fn has_box(&self) -> bool {
        self.has_box
    }

    pub fn box_matrix(&self) -> Float32Array {
        Float32Array::from(&self.box_matrix[..])
    }

    /// All frame positions concatenated (n_frames * n_atoms * 3 floats).
    pub fn frame_data(&self) -> Float32Array {
        Float32Array::from(&self.frame_data[..])
    }

    /// Number of embedded vector channels (0 when none).
    #[wasm_bindgen(getter)]
    pub fn vector_channel_count(&self) -> u32 {
        self.vector_channel_count
    }

    /// JSON array describing each channel: `[{"name":"velocity","n_frames":N}, ...]`
    #[wasm_bindgen(getter)]
    pub fn vector_channel_meta(&self) -> String {
        self.vector_channel_meta.clone()
    }

    /// All vector channel data concatenated as Float32Array.
    pub fn vector_channel_data(&self) -> Float32Array {
        Float32Array::from(&self.vector_channel_data[..])
    }
}

/// Parse an XTC trajectory binary and return frame data.
#[wasm_bindgen]
pub fn parse_xtc_file(data: &[u8]) -> Result<XtcParseResult, JsError> {
    let xtc_data = xtc::parse_xtc(data).map_err(|e| JsError::new(&e))?;

    let has_box = xtc_data.box_matrix.is_some();
    let box_matrix = match xtc_data.box_matrix {
        Some(m) => m.to_vec(),
        None => Vec::new(),
    };

    let mut frame_data: Vec<f32> = Vec::new();
    for frame in &xtc_data.frame_positions {
        frame_data.extend_from_slice(frame);
    }

    let vector_channel_count = xtc_data.vector_channels.len() as u32;
    let (vector_channel_meta, vector_channel_data) =
        serialize_vector_channels(&xtc_data.vector_channels);

    Ok(XtcParseResult {
        n_atoms: xtc_data.n_atoms as u32,
        n_frames: xtc_data.n_frames as u32,
        timestep_ps: xtc_data.timestep_ps,
        has_box,
        box_matrix,
        frame_data,
        vector_channel_count,
        vector_channel_meta,
        vector_channel_data,
    })
}

/// Parse a PDB file text and return structured data for the molecular viewer.
#[wasm_bindgen]
pub fn parse_pdb(text: &str) -> Result<ParseResult, JsError> {
    let data = parser::parse(text).map_err(|e| JsError::new(&e))?;
    Ok(ParseResult::from_parsed(data))
}

/// Parse a GRO file text and return structured data.
#[wasm_bindgen]
pub fn parse_gro(text: &str) -> Result<ParseResult, JsError> {
    let data = gro::parse(text).map_err(|e| JsError::new(&e))?;
    Ok(ParseResult::from_parsed(data))
}

/// Parse an XYZ file text and return structured data.
#[wasm_bindgen]
pub fn parse_xyz(text: &str) -> Result<ParseResult, JsError> {
    let data = xyz::parse(text).map_err(|e| JsError::new(&e))?;
    Ok(ParseResult::from_parsed(data))
}

/// Parse an MDL Molfile (V2000) text and return structured data.
#[wasm_bindgen]
pub fn parse_mol(text: &str) -> Result<ParseResult, JsError> {
    let data = mol::parse(text).map_err(|e| JsError::new(&e))?;
    Ok(ParseResult::from_parsed(data))
}

/// Parse a Tripos MOL2 file text and return structured data.
#[wasm_bindgen]
pub fn parse_mol2(text: &str) -> Result<ParseResult, JsError> {
    let data = mol2::parse(text).map_err(|e| JsError::new(&e))?;
    Ok(ParseResult::from_parsed(data))
}

/// Parse a CIF file text and return structured data.
#[wasm_bindgen]
pub fn parse_cif(text: &str) -> Result<ParseResult, JsError> {
    let data = cif::parse(text).map_err(|e| JsError::new(&e))?;
    Ok(ParseResult::from_parsed(data))
}

/// Parse a LAMMPS data file text and return structured data.
#[wasm_bindgen]
pub fn parse_lammps_data(text: &str) -> Result<ParseResult, JsError> {
    let data = lammps_data::parse(text).map_err(|e| JsError::new(&e))?;
    Ok(ParseResult::from_parsed(data))
}

/// Infer bonds using VDW radii (threshold = vdw_sum * 0.6).
/// Returns flat Uint32Array [a0, b0, a1, b1, ...].
#[wasm_bindgen]
pub fn infer_bonds_vdw(positions: &[f32], elements: &[u8], n_atoms: u32) -> Uint32Array {
    let result = bonds::infer_bonds_vdw(positions, elements, n_atoms as usize);
    let mut flat: Vec<u32> = Vec::with_capacity(result.len() * 2);
    for (a, b) in &result {
        flat.push(*a);
        flat.push(*b);
    }
    Uint32Array::from(&flat[..])
}

/// Parse GROMACS .top file and extract bond pairs.
/// Returns flat Uint32Array [a0, b0, a1, b1, ...].
#[wasm_bindgen]
pub fn parse_top_bonds(text: &str, n_atoms: u32) -> Uint32Array {
    let result = top::parse_top_bonds(text, n_atoms as usize);
    let mut flat: Vec<u32> = Vec::with_capacity(result.len() * 2);
    for (a, b) in &result {
        flat.push(*a);
        flat.push(*b);
    }
    Uint32Array::from(&flat[..])
}

/// Extract atom labels from a structure file text.
/// Returns newline-delimited labels string.
#[wasm_bindgen]
pub fn extract_labels(text: &str, format: &str) -> String {
    let result = match format {
        "gro" => gro::parse(text),
        "xyz" => xyz::parse(text),
        "lammps_data" => lammps_data::parse(text),
        _ => parser::parse(text),
    };
    match result {
        Ok(data) => data.atom_labels.map(|l| l.join("\n")).unwrap_or_default(),
        Err(_) => String::new(),
    }
}

/// Parse a LAMMPS dump trajectory (.lammpstrj) and return frame data.
#[wasm_bindgen]
pub fn parse_lammpstrj_file(text: &str) -> Result<XtcParseResult, JsError> {
    let data = lammpstrj::parse_lammpstrj(text).map_err(|e| JsError::new(&e))?;

    let has_box = data.box_matrix.is_some();
    let box_matrix = match data.box_matrix {
        Some(m) => m.to_vec(),
        None => Vec::new(),
    };

    let mut frame_data: Vec<f32> = Vec::new();
    for frame in &data.frame_positions {
        frame_data.extend_from_slice(frame);
    }

    let vector_channel_count = data.vector_channels.len() as u32;
    let (vector_channel_meta, vector_channel_data) =
        serialize_vector_channels(&data.vector_channels);

    Ok(XtcParseResult {
        n_atoms: data.n_atoms as u32,
        n_frames: data.n_frames as u32,
        timestep_ps: data.timestep_ps,
        has_box,
        box_matrix,
        frame_data,
        vector_channel_count,
        vector_channel_meta,
        vector_channel_data,
    })
}

/// Parse an ASE .traj file (ULM binary format) and return structured data.
#[wasm_bindgen]
pub fn parse_traj(data: &[u8]) -> Result<ParseResult, JsError> {
    let parsed = traj::parse_traj(data).map_err(|e| JsError::new(&e))?;
    Ok(ParseResult::from_parsed(parsed))
}

/// Extract only CONECT bonds from a PDB file text.
/// Returns flat Uint32Array [a0, b0, a1, b1, ...].
#[wasm_bindgen]
pub fn parse_pdb_bonds(text: &str, n_atoms: u32) -> Uint32Array {
    let data = match parser::parse(text) {
        Ok(d) => d,
        Err(_) => return Uint32Array::new_with_length(0),
    };
    // Only return file bonds (CONECT), not inferred ones
    let file_bonds = &data.bonds[..data.n_file_bonds];
    let mut flat: Vec<u32> = Vec::with_capacity(file_bonds.len() * 2);
    for (a, b) in file_bonds {
        flat.push(*a);
        flat.push(*b);
    }
    // Validate atom indices
    let limit = n_atoms;
    let mut valid: Vec<u32> = Vec::new();
    for chunk in flat.chunks(2) {
        if chunk[0] < limit && chunk[1] < limit {
            valid.push(chunk[0]);
            valid.push(chunk[1]);
        }
    }
    Uint32Array::from(&valid[..])
}
