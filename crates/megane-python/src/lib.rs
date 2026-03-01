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
    positions: Py<PyArray2<f32>>,
    #[pyo3(get)]
    elements: Py<PyArray1<u8>>,
    #[pyo3(get)]
    bonds: Py<PyArray2<u32>>,
    #[pyo3(get)]
    bond_orders: Py<PyArray1<u8>>,
    #[pyo3(get)]
    box_matrix: Py<PyArray2<f32>>,
}

impl PyStructure {
    fn from_parsed(py: Python<'_>, data: ParsedStructure) -> Self {
        let n = data.n_atoms;
        let n_bonds = data.bonds.len();

        let pos_array = Array2::from_shape_vec((n, 3), data.positions)
            .expect("positions reshape");

        let elem_array = Array1::from_vec(data.elements);

        let bonds_flat: Vec<u32> = data
            .bonds
            .iter()
            .flat_map(|(a, b)| [*a, *b])
            .collect();
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

        Self {
            n_atoms: n,
            positions: pos_array.into_pyarray(py).into(),
            elements: elem_array.into_pyarray(py).into(),
            bonds: bond_array.into_pyarray(py).into(),
            bond_orders: bo_array.into_pyarray(py).into(),
            box_matrix: box_array.into_pyarray(py).into(),
        }
    }
}

/// Parse a PDB file text and return structured data.
#[pyfunction]
fn parse_pdb(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::parser::parse(text).map_err(|e| PyValueError::new_err(e))?;
    Ok(PyStructure::from_parsed(py, data))
}

/// Parse a GRO file text and return structured data.
#[pyfunction]
fn parse_gro(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::gro::parse(text).map_err(|e| PyValueError::new_err(e))?;
    Ok(PyStructure::from_parsed(py, data))
}

/// Parse an XYZ file text and return structured data.
#[pyfunction]
fn parse_xyz(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::xyz::parse(text).map_err(|e| PyValueError::new_err(e))?;
    Ok(PyStructure::from_parsed(py, data))
}

/// Parse an MDL Molfile (V2000) text and return structured data.
#[pyfunction]
fn parse_mol(py: Python<'_>, text: &str) -> PyResult<PyStructure> {
    let data = megane_core::mol::parse(text).map_err(|e| PyValueError::new_err(e))?;
    Ok(PyStructure::from_parsed(py, data))
}

#[pymodule]
fn megane_parser(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(parse_pdb, m)?)?;
    m.add_function(wrap_pyfunction!(parse_gro, m)?)?;
    m.add_function(wrap_pyfunction!(parse_xyz, m)?)?;
    m.add_function(wrap_pyfunction!(parse_mol, m)?)?;
    Ok(())
}
