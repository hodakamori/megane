use megane_core::parser::ParsedStructure;
use numpy::ndarray::{Array1, Array2};
use numpy::{IntoPyArray, PyArray1, PyArray2, PyReadonlyArray1, PyReadonlyArray2};
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
    fn from_parsed(py: Python<'_>, data: ParsedStructure) -> PyResult<Self> {
        let n = data.n_atoms;
        let n_bonds = data.bonds.len();

        let pos_array = Array2::from_shape_vec((n, 3), data.positions).map_err(|e| {
            PyValueError::new_err(format!("failed to reshape positions into ({n}, 3): {e}"))
        })?;

        let elem_array = Array1::from_vec(data.elements);

        let bonds_flat: Vec<u32> = data.bonds.iter().flat_map(|(a, b)| [*a, *b]).collect();
        let bond_array = if n_bonds > 0 {
            Array2::from_shape_vec((n_bonds, 2), bonds_flat).map_err(|e| {
                PyValueError::new_err(format!("failed to reshape bonds into ({n_bonds}, 2): {e}"))
            })?
        } else {
            Array2::from_shape_vec((0, 2), vec![]).map_err(|e| {
                PyValueError::new_err(format!("failed to create empty bonds array: {e}"))
            })?
        };

        let bo_vec = data.bond_orders.unwrap_or_else(|| vec![1u8; n_bonds]);
        let bo_array = Array1::from_vec(bo_vec);

        let box_vec = match data.box_matrix {
            Some(m) => m.to_vec(),
            None => vec![0.0f32; 9],
        };
        let box_array = Array2::from_shape_vec((3, 3), box_vec).map_err(|e| {
            PyValueError::new_err(format!("failed to reshape box_matrix into (3, 3): {e}"))
        })?;

        // Frame positions for multi-frame formats (e.g. .traj)
        let n_frames = data.frame_positions.len();
        let stride = n * 3;
        let frame_array = if n_frames > 0 {
            let mut flat: Vec<f32> = Vec::with_capacity(n_frames * stride);
            for frame in &data.frame_positions {
                if frame.len() != stride {
                    return Err(PyValueError::new_err(format!(
                        "frame has {} elements, expected {} (n_atoms * 3)",
                        frame.len(),
                        stride
                    )));
                }
                flat.extend_from_slice(frame);
            }
            Array2::from_shape_vec((n_frames, stride), flat).map_err(|e| {
                PyValueError::new_err(format!(
                    "failed to reshape frame_positions into ({n_frames}, {stride}): {e}"
                ))
            })?
        } else {
            Array2::from_shape_vec((0, stride), vec![]).map_err(|e| {
                PyValueError::new_err(format!("failed to create empty frame_positions array: {e}"))
            })?
        };

        Ok(Self {
            n_atoms: n,
            n_frames,
            positions: pos_array.into_pyarray(py).into(),
            elements: elem_array.into_pyarray(py).into(),
            bonds: bond_array.into_pyarray(py).into(),
            bond_orders: bo_array.into_pyarray(py).into(),
            box_matrix: box_array.into_pyarray(py).into(),
            frame_positions: frame_array.into_pyarray(py).into(),
        })
    }
}

/// Parse a PDB file text and return structured data.
#[pyfunction]
fn parse_pdb(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::parser::parse(text).map_err(PyValueError::new_err)?;
    PyStructure::from_parsed(py, data)
}

/// Parse a GRO file text and return structured data.
#[pyfunction]
fn parse_gro(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::gro::parse(text).map_err(PyValueError::new_err)?;
    PyStructure::from_parsed(py, data)
}

/// Parse an XYZ file text and return structured data.
#[pyfunction]
fn parse_xyz(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::xyz::parse(text).map_err(PyValueError::new_err)?;
    PyStructure::from_parsed(py, data)
}

/// Parse an MDL Molfile (V2000) text and return structured data.
#[pyfunction]
fn parse_mol(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::mol::parse(text).map_err(PyValueError::new_err)?;
    PyStructure::from_parsed(py, data)
}

/// Parse a Tripos MOL2 file text and return structured data.
#[pyfunction]
fn parse_mol2(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::mol2::parse(text).map_err(PyValueError::new_err)?;
    PyStructure::from_parsed(py, data)
}

/// Parse a LAMMPS data file text and return structured data.
#[pyfunction]
fn parse_lammps_data(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::lammps_data::parse(text).map_err(PyValueError::new_err)?;
    PyStructure::from_parsed(py, data)
}

/// Parse a CIF file text and return structured data.
#[pyfunction]
fn parse_cif(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::cif::parse(text).map_err(PyValueError::new_err)?;
    PyStructure::from_parsed(py, data)
}

/// Parse an XTC trajectory binary and return frame data.
#[pyfunction]
fn parse_xtc(py: Python<'_>, data: &[u8]) -> PyResult<PyTrajectoryData> {
    let traj = megane_core::xtc::parse_xtc(data).map_err(PyValueError::new_err)?;

    let box_vec = match traj.box_matrix {
        Some(m) => m.to_vec(),
        None => vec![0.0f32; 9],
    };
    if box_vec.len() != 9 {
        return Err(PyValueError::new_err(format!(
            "box_matrix has length {}, but expected 9 elements for a 3x3 matrix",
            box_vec.len()
        )));
    }
    let box_array = Array2::from_shape_vec((3, 3), box_vec).map_err(|e| {
        PyValueError::new_err(format!("failed to reshape box_matrix into (3, 3): {e}"))
    })?;

    let stride = traj.n_atoms * 3;
    let mut flat: Vec<f32> = Vec::with_capacity(traj.n_frames * stride);
    for frame in &traj.frame_positions {
        flat.extend_from_slice(frame);
    }
    let expected_len = traj.n_frames * stride;
    if flat.len() != expected_len {
        return Err(PyValueError::new_err(format!(
            "frame_positions has length {}, but expected {} (n_frames * n_atoms * 3)",
            flat.len(),
            expected_len
        )));
    }
    let frame_array = Array2::from_shape_vec((traj.n_frames, stride), flat).map_err(|e| {
        PyValueError::new_err(format!(
            "failed to reshape frame_positions into ({}, {}): {e}",
            traj.n_frames, stride
        ))
    })?;

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
    PyStructure::from_parsed(py, parsed)
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
    let box_array = Array2::from_shape_vec((3, 3), box_vec).map_err(|e| {
        PyValueError::new_err(format!("failed to reshape box_matrix into (3, 3): {e}"))
    })?;

    // Flatten all frames into (n_frames, n_atoms * 3)
    let stride = data.n_atoms * 3;
    let mut flat: Vec<f32> = Vec::with_capacity(data.n_frames * stride);
    for frame in &data.frame_positions {
        flat.extend_from_slice(frame);
    }
    let frame_array = Array2::from_shape_vec((data.n_frames, stride), flat).map_err(|e| {
        PyValueError::new_err(format!(
            "failed to reshape frame_positions into ({}, {}): {e}",
            data.n_frames, stride
        ))
    })?;

    Ok(PyTrajectoryData {
        n_atoms: data.n_atoms,
        n_frames: data.n_frames,
        timestep_ps: data.timestep_ps,
        box_matrix: box_array.into_pyarray(py).into(),
        frame_positions: frame_array.into_pyarray(py).into(),
    })
}

/// Parse an AMBER NetCDF trajectory binary and return frame data.
#[pyfunction]
fn parse_netcdf(py: Python<'_>, data: &[u8]) -> PyResult<PyTrajectoryData> {
    let traj = megane_core::netcdf::parse_netcdf(data).map_err(PyValueError::new_err)?;

    let box_vec = match traj.box_matrix {
        Some(m) => m.to_vec(),
        None => vec![0.0f32; 9],
    };
    let box_array = Array2::from_shape_vec((3, 3), box_vec).map_err(|e| {
        PyValueError::new_err(format!("failed to reshape box_matrix into (3, 3): {e}"))
    })?;

    let stride = traj.n_atoms * 3;
    let mut flat: Vec<f32> = Vec::with_capacity(traj.n_frames * stride);
    for frame in &traj.frame_positions {
        flat.extend_from_slice(frame);
    }
    let frame_array = Array2::from_shape_vec((traj.n_frames, stride), flat).map_err(|e| {
        PyValueError::new_err(format!(
            "failed to reshape frame_positions into ({}, {}): {e}",
            traj.n_frames, stride
        ))
    })?;

    Ok(PyTrajectoryData {
        n_atoms: traj.n_atoms,
        n_frames: traj.n_frames,
        timestep_ps: traj.timestep_ps,
        box_matrix: box_array.into_pyarray(py).into(),
        frame_positions: frame_array.into_pyarray(py).into(),
    })
}

/// Infer bonds from interatomic distances using VDW radii.
///
/// Returns an (n_bonds, 2) uint32 array of atom index pairs.  Mirrors the
/// per-frame inference the frontend performs when `bondSource == "distance"`.
#[pyfunction]
fn infer_bonds_vdw(
    py: Python<'_>,
    elements: PyReadonlyArray1<u8>,
    positions: PyReadonlyArray2<f32>,
) -> PyResult<Py<PyArray2<u32>>> {
    let elements_view = elements.as_array();
    let positions_view = positions.as_array();

    let n_atoms = elements_view.len();
    let shape = positions_view.shape();
    if shape.len() != 2 || shape[0] != n_atoms || shape[1] != 3 {
        return Err(PyValueError::new_err(format!(
            "positions shape {:?} does not match (n_atoms={}, 3)",
            shape, n_atoms
        )));
    }

    let elements_vec: Vec<u8> = elements_view.iter().copied().collect();
    let positions_vec: Vec<f32> = positions_view.iter().copied().collect();

    let bonds = megane_core::bonds::infer_bonds_vdw(&positions_vec, &elements_vec, n_atoms);

    let n_bonds = bonds.len();
    let mut flat: Vec<u32> = Vec::with_capacity(n_bonds * 2);
    for (a, b) in &bonds {
        flat.push(*a);
        flat.push(*b);
    }
    let arr = Array2::from_shape_vec((n_bonds, 2), flat).map_err(|e| {
        PyValueError::new_err(format!("failed to reshape bonds into (n_bonds, 2): {e}"))
    })?;
    Ok(arr.into_pyarray(py).into())
}

#[pymodule]
fn megane_parser(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(parse_pdb, m)?)?;
    m.add_function(wrap_pyfunction!(parse_gro, m)?)?;
    m.add_function(wrap_pyfunction!(parse_xyz, m)?)?;
    m.add_function(wrap_pyfunction!(parse_mol, m)?)?;
    m.add_function(wrap_pyfunction!(parse_mol2, m)?)?;
    m.add_function(wrap_pyfunction!(parse_lammps_data, m)?)?;
    m.add_function(wrap_pyfunction!(parse_cif, m)?)?;
    m.add_function(wrap_pyfunction!(parse_xtc, m)?)?;
    m.add_function(wrap_pyfunction!(parse_traj, m)?)?;
    m.add_function(wrap_pyfunction!(parse_lammpstrj, m)?)?;
    m.add_function(wrap_pyfunction!(parse_netcdf, m)?)?;
    m.add_function(wrap_pyfunction!(infer_bonds_vdw, m)?)?;
    Ok(())
}
