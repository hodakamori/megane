use js_sys::{Float32Array, Uint32Array, Uint8Array};
use wasm_bindgen::prelude::*;

mod bonds;
mod parser;

/// Result of parsing a PDB file, exposed to JavaScript via wasm-bindgen.
#[wasm_bindgen]
pub struct ParseResult {
    n_atoms: u32,
    n_bonds: u32,
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

/// Parse a PDB file text and return structured data for the molecular viewer.
#[wasm_bindgen]
pub fn parse_pdb(text: &str) -> Result<ParseResult, JsError> {
    let data = parser::parse(text).map_err(|e| JsError::new(&e))?;

    let n_atoms = data.n_atoms as u32;
    let n_bonds = data.bonds.len() as u32;
    let n_frames = data.frame_positions.len() as u32;

    // Flatten bonds to [a0, b0, a1, b1, ...]
    let mut bonds_flat: Vec<u32> = Vec::with_capacity(data.bonds.len() * 2);
    for (a, b) in &data.bonds {
        bonds_flat.push(*a);
        bonds_flat.push(*b);
    }

    // Bond orders: all single (1) for PDB
    let bond_orders = vec![1u8; data.bonds.len()];

    // Box matrix
    let has_box = data.box_matrix.is_some();
    let box_matrix = match data.box_matrix {
        Some(m) => m.to_vec(),
        None => Vec::new(),
    };

    // Concatenate frame positions
    let mut frame_data: Vec<f32> = Vec::new();
    for frame in &data.frame_positions {
        frame_data.extend_from_slice(frame);
    }

    Ok(ParseResult {
        n_atoms,
        n_bonds,
        n_frames,
        has_box,
        positions: data.positions,
        elements: data.elements,
        bonds: bonds_flat,
        bond_orders,
        box_matrix,
        frame_data,
    })
}
