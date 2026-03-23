use megane_core::parser::ParsedStructure;
use numpy::ndarray::{Array1, Array2};
use numpy::{IntoPyArray, PyArray1, PyArray2};
use pyo3::exceptions::PyValueError;
use pyo3::prelude::*;

#[pyclass]
struct PyStructure {
    #[pyo3(get)]
    n_atoms: usize,
    #[pyo3(get)]
    n_frames: usize,
    #[pyo3(get)]
    positions: Py<PyArray2<f32>>,
    #[pyo3(get)]
    elements: Py<PyArray1<u8>>,
    #[pyo3(get)]
    bonds: Py<PyArray2<u32>>,
    #[pyo3(get)]
    bond_orders: Py<PyArray1<u8>>,
    #[pyo3(get)]
    box_matrix: Py<PyArray2<f32>>,
    #[pyo3(get)]
    frame_positions: Py<PyArray2<f32>>,
}

impl PyStructure {
    fn from_parsed(py: Python<'_>, data: ParsedStructure) -> Self {
        let n = data.n_atoms;
        let n_bonds = data.bonds.len();

        let pos_array = Array2::from_shape_vec((n, 3), data.positions).expect("positions reshape");

        let elem_array = Array1::from_vec(data.elements);

        let bonds_flat: Vec<u32> = data.bonds.iter().flat_map(|(a, b)| [*a, *b]).collect();
        let bond_array = if n_bonds > 0 {
            Array2::from_shape_vec((n_bonds, 2), bonds_flat).expect("bonds reshape")
        } else {
            Array2::from_shape_vec((0, 2), vec![]).expect("empty bonds")
        };

        let bo_vec = data.bond_orders.unwrap_or_else(|| vec![1u8; n_bonds]);
        let bo_array = Array1::from_vec(bo_vec);

        let box_vec = match data.box_matrix {
            Some(m) => m.to_vec(),
            None => vec![0.0f32; 9],
        };
        let box_array = Array2::from_shape_vec((3, 3), box_vec).expect("box reshape");

        // Frame positions for multi-frame formats (e.g. .traj)
        let n_frames = data.frame_positions.len();
        let stride = n * 3;
        let frame_array = if n_frames > 0 {
            let mut flat: Vec<f32> = Vec::with_capacity(n_frames * stride);
            for frame in &data.frame_positions {
                flat.extend_from_slice(frame);
            }
            Array2::from_shape_vec((n_frames, stride), flat).expect("frame_positions reshape")
        } else {
            Array2::from_shape_vec((0, stride.max(1)), vec![]).expect("empty frames")
        };

        Self {
            n_atoms: n,
            n_frames,
            positions: pos_array.into_pyarray(py).into(),
            elements: elem_array.into_pyarray(py).into(),
            bonds: bond_array.into_pyarray(py).into(),
            bond_orders: bo_array.into_pyarray(py).into(),
            box_matrix: box_array.into_pyarray(py).into(),
            frame_positions: frame_array.into_pyarray(py).into(),
        }
    }
}

/// Parse a PDB file text and return structured data.
#[pyfunction]
fn parse_pdb(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::parser::parse(text).map_err(PyValueError::new_err)?;
    Ok(PyStructure::from_parsed(py, data))
}

/// Parse a GRO file text and return structured data.
#[pyfunction]
fn parse_gro(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::gro::parse(text).map_err(PyValueError::new_err)?;
    Ok(PyStructure::from_parsed(py, data))
}

/// Parse an XYZ file text and return structured data.
#[pyfunction]
fn parse_xyz(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::xyz::parse(text).map_err(PyValueError::new_err)?;
    Ok(PyStructure::from_parsed(py, data))
}

/// Parse an MDL Molfile (V2000) text and return structured data.
#[pyfunction]
fn parse_mol(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::mol::parse(text).map_err(PyValueError::new_err)?;
    Ok(PyStructure::from_parsed(py, data))
}

/// Parse a LAMMPS data file text and return structured data.
#[pyfunction]
fn parse_lammps_data(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::lammps_data::parse(text).map_err(PyValueError::new_err)?;
    Ok(PyStructure::from_parsed(py, data))
}

/// Parse a CIF file text and return structured data.
#[pyfunction]
fn parse_cif(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::cif::parse(text).map_err(PyValueError::new_err)?;
    Ok(PyStructure::from_parsed(py, data))
}

/// Parse an XTC trajectory binary and return frame data.
#[pyfunction]
fn parse_xtc(py: Python<'_>, data: &[u8]) -> PyResult<PyTrajectoryData> {
    let traj = megane_core::xtc::parse_xtc(data).map_err(PyValueError::new_err)?;

    let box_vec = match traj.box_matrix {
        Some(m) => m.to_vec(),
        None => vec![0.0f32; 9],
    };
    let box_array = Array2::from_shape_vec((3, 3), box_vec).expect("box reshape");

    let stride = traj.n_atoms * 3;
    let mut flat: Vec<f32> = Vec::with_capacity(traj.n_frames * stride);
    for frame in &traj.frame_positions {
        flat.extend_from_slice(frame);
    }
    let frame_array =
        Array2::from_shape_vec((traj.n_frames, stride), flat).expect("frame_positions reshape");

    Ok(PyTrajectoryData {
        n_atoms: traj.n_atoms,
        n_frames: traj.n_frames,
        timestep_ps: traj.timestep_ps,
        box_matrix: box_array.into_pyarray(py).into(),
        frame_positions: frame_array.into_pyarray(py).into(),
    })
}

/// Parse an ASE .traj file (binary) and return structured data.
#[pyfunction]
fn parse_traj(py: Python<'_>, data: &[u8]) -> PyResult<PyStructure> {
    let parsed = megane_core::traj::parse_traj(data).map_err(PyValueError::new_err)?;
    Ok(PyStructure::from_parsed(py, parsed))
}

/// Parsed trajectory data exposed to Python (shared by XTC and LAMMPS dump).
#[pyclass]
struct PyTrajectoryData {
    #[pyo3(get)]
    n_atoms: usize,
    #[pyo3(get)]
    n_frames: usize,
    #[pyo3(get)]
    timestep_ps: f32,
    #[pyo3(get)]
    box_matrix: Py<PyArray2<f32>>,
    #[pyo3(get)]
    frame_positions: Py<PyArray2<f32>>,
}

/// Parse a LAMMPS dump trajectory text and return frame data.
#[pyfunction]
fn parse_lammpstrj(py: Python<'_>, text: &str) -> PyResult<PyTrajectoryData> {
    let data = megane_core::lammpstrj::parse_lammpstrj(text).map_err(PyValueError::new_err)?;

    let box_vec = match data.box_matrix {
        Some(m) => m.to_vec(),
        None => vec![0.0f32; 9],
    };
    let box_array = Array2::from_shape_vec((3, 3), box_vec).expect("box reshape");

    // Flatten all frames into (n_frames, n_atoms * 3)
    let stride = data.n_atoms * 3;
    let mut flat: Vec<f32> = Vec::with_capacity(data.n_frames * stride);
    for frame in &data.frame_positions {
        flat.extend_from_slice(frame);
    }
    let frame_array =
        Array2::from_shape_vec((data.n_frames, stride), flat).expect("frame_positions reshape");

    Ok(PyTrajectoryData {
        n_atoms: data.n_atoms,
        n_frames: data.n_frames,
        timestep_ps: data.timestep_ps,
        box_matrix: box_array.into_pyarray(py).into(),
        frame_positions: frame_array.into_pyarray(py).into(),
    })
}

#[pymodule]
fn megane_parser(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(parse_pdb, m)?)?;
    m.add_function(wrap_pyfunction!(parse_gro, m)?)?;
    m.add_function(wrap_pyfunction!(parse_xyz, m)?)?;
    m.add_function(wrap_pyfunction!(parse_mol, m)?)?;
    m.add_function(wrap_pyfunction!(parse_lammps_data, m)?)?;
    m.add_function(wrap_pyfunction!(parse_cif, m)?)?;
    m.add_function(wrap_pyfunction!(parse_xtc, m)?)?;
    m.add_function(wrap_pyfunction!(parse_traj, m)?)?;
    m.add_function(wrap_pyfunction!(parse_lammpstrj, m)?)?;
    Ok(())
}
