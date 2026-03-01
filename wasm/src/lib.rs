use js_sys::{Float32Array, Uint32Array, Uint8Array};
use wasm_bindgen::prelude::*;

use megane_core::{bonds, gro, mol, parser, top, xtc, xyz};

/// Result of parsing a PDB file, exposed to JavaScript via wasm-bindgen.
#[wasm_bindgen]
pub struct ParseResult {
    n_atoms: u32,
    n_bonds: u32,
    n_file_bonds: u32,
    n_frames: u32,
    has_box: bool,
    positions: Vec<f32>,
    elements: Vec<u8>,
    bonds: Vec<u32>,
    bond_orders: Vec<u8>,
    box_matrix: Vec<f32>,
    frame_data: Vec<f32>,
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
}

impl ParseResult {
    fn from_parsed(data: parser::ParsedStructure) -> Self {
        let n_bonds = data.bonds.len() as u32;
        let mut bonds_flat: Vec<u32> = Vec::with_capacity(data.bonds.len() * 2);
        for (a, b) in &data.bonds {
            bonds_flat.push(*a);
            bonds_flat.push(*b);
        }
        let bond_orders = data.bond_orders.unwrap_or_else(|| vec![1u8; data.bonds.len()]);
        let has_box = data.box_matrix.is_some();
        let box_matrix = data.box_matrix.map(|m| m.to_vec()).unwrap_or_default();
        let n_frames = data.frame_positions.len() as u32;
        let frame_data: Vec<f32> = data.frame_positions.into_iter().flat_map(|f| f.into_iter()).collect();

        Self {
            n_atoms: data.n_atoms as u32,
            n_bonds,
            n_file_bonds: data.n_file_bonds as u32,
            n_frames,
            has_box,
            positions: data.positions,
            elements: data.elements,
            bonds: bonds_flat,
            bond_orders,
            box_matrix,
            frame_data,
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

    Ok(XtcParseResult {
        n_atoms: xtc_data.n_atoms as u32,
        n_frames: xtc_data.n_frames as u32,
        timestep_ps: xtc_data.timestep_ps,
        has_box,
        box_matrix,
        frame_data,
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

/// Infer bonds using VDW radii (threshold = vdw_sum * 0.6).
/// Returns flat Uint32Array [a0, b0, a1, b1, ...].
#[wasm_bindgen]
pub fn infer_bonds_vdw(
    positions: &[f32],
    elements: &[u8],
    n_atoms: u32,
) -> Uint32Array {
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
