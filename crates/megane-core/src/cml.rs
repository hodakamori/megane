//! Chemical Markup Language (`.cml`) parser.
//!
//! XML interchange format emitted by Open Babel, Avogadro, ChemDraw, and the
//! rest of the Blue Obelisk toolchain:
//!
//! ```xml
//! <molecule id="m1">
//!   <crystal>
//!     <scalar title="a">5.43</scalar>  … b, c, alpha, beta, gamma
//!   </crystal>
//!   <atomArray>
//!     <atom id="a1" elementType="C" x3="0.0" y3="0.0" z3="0.0"/>
//!   </atomArray>
//!   <bondArray>
//!     <bond atomRefs2="a1 a2" order="1"/>
//!   </bondArray>
//! </molecule>
//! ```
//!
//! Coordinate flavours, in the order they are preferred per atom:
//! 1. `x3`/`y3`/`z3` — Cartesian Å (the common 3D case).
//! 2. `xyz3="x y z"` — the same triple packed into one attribute.
//! 3. `xFract`/`yFract`/`zFract` — fractional, converted with the `<crystal>`
//!    cell.
//! 4. `x2`/`y2` — a 2D depiction, projected to `z = 0` so the file still opens
//!    (flat, but visibly flat) rather than being rejected.
//!
//! A file may hold several `<molecule>` elements under `<cml>` / `<list>`; the
//! first one carrying atoms is loaded. Treating the rest as frames is a
//! follow-up.
//!
//! ## Untrusted input
//!
//! `quick_xml::Reader` is a pull parser that performs **no** DTD processing and
//! **no** entity expansion beyond the five XML predefined entities, so a
//! hostile `.cml` cannot mount a billion-laughs or external-entity (XXE)
//! attack through it. Nothing here resolves a `SYSTEM` identifier or reads a
//! second file.

use crate::atomic::{capitalize, symbol_to_atomic_num};
use crate::bonds;
use crate::parser::{cell_params_to_matrix, ParsedStructure};
use quick_xml::events::{BytesStart, Event};
use quick_xml::Reader;
use std::collections::{HashMap, HashSet};

/// Cell parameters harvested from a `<crystal>` block.
#[derive(Default)]
struct Cell {
    a: Option<f32>,
    b: Option<f32>,
    c: Option<f32>,
    alpha: Option<f32>,
    beta: Option<f32>,
    gamma: Option<f32>,
}

impl Cell {
    fn matrix(&self) -> Option<[f32; 9]> {
        let (a, b, c) = (self.a?, self.b?, self.c?);
        if a <= 0.0 || b <= 0.0 || c <= 0.0 {
            return None;
        }
        Some(cell_params_to_matrix(
            a,
            b,
            c,
            self.alpha.unwrap_or(90.0),
            self.beta.unwrap_or(90.0),
            self.gamma.unwrap_or(90.0),
        ))
    }
}

/// How an atom's coordinates were expressed in the file.
enum Coord {
    Cartesian([f32; 3]),
    Fractional([f32; 3]),
}

struct Atom {
    id: String,
    element: u8,
    coord: Coord,
}

/// Strip an XML namespace prefix: `cml:atom` → `atom`.
fn local_name(raw: &[u8]) -> String {
    let s = String::from_utf8_lossy(raw);
    match s.rsplit_once(':') {
        Some((_, local)) => local.to_string(),
        None => s.to_string(),
    }
}

/// Collect an element's attributes into a map keyed by local name.
fn attrs(e: &BytesStart<'_>) -> HashMap<String, String> {
    let mut map = HashMap::new();
    for a in e.attributes().flatten() {
        let key = local_name(a.key.as_ref());
        let val = a
            .unescape_value()
            .map(|v| v.into_owned())
            .unwrap_or_else(|_| String::from_utf8_lossy(&a.value).into_owned());
        map.insert(key, val);
    }
    map
}

fn attr_f32(map: &HashMap<String, String>, key: &str) -> Option<f32> {
    map.get(key)?.trim().parse().ok()
}

/// CML writes bond orders as `1`/`2`/`3` or the letters `S`/`D`/`T`/`A`.
/// Aromatic collapses to 1, matching the MOL2 reader.
fn bond_order(raw: Option<&String>) -> u8 {
    match raw.map(|s| s.trim().to_ascii_uppercase()) {
        Some(s) => match s.as_str() {
            "2" | "D" => 2,
            "3" | "T" => 3,
            _ => s.parse::<u8>().unwrap_or(1),
        },
        None => 1,
    }
}

/// Read the coordinates off an `<atom>` element, preferring 3D over fractional
/// over a 2D depiction.
fn atom_coord(map: &HashMap<String, String>) -> Option<Coord> {
    if let (Some(x), Some(y), Some(z)) = (
        attr_f32(map, "x3"),
        attr_f32(map, "y3"),
        attr_f32(map, "z3"),
    ) {
        return Some(Coord::Cartesian([x, y, z]));
    }
    if let Some(packed) = map.get("xyz3") {
        let v: Vec<f32> = packed
            .split_whitespace()
            .filter_map(|t| t.parse().ok())
            .collect();
        if v.len() >= 3 {
            return Some(Coord::Cartesian([v[0], v[1], v[2]]));
        }
    }
    if let (Some(x), Some(y), Some(z)) = (
        attr_f32(map, "xFract"),
        attr_f32(map, "yFract"),
        attr_f32(map, "zFract"),
    ) {
        return Some(Coord::Fractional([x, y, z]));
    }
    // 2D depiction: project onto z = 0 so the file still opens.
    if let (Some(x), Some(y)) = (attr_f32(map, "x2"), attr_f32(map, "y2")) {
        return Some(Coord::Cartesian([x, y, 0.0]));
    }
    None
}

/// Parse a CML document into a structure. The first `<molecule>` that carries
/// atoms wins.
pub fn parse(text: &str) -> Result<ParsedStructure, String> {
    let mut reader = Reader::from_str(text);
    reader.config_mut().trim_text(true);

    let mut atoms: Vec<Atom> = Vec::new();
    let mut file_bonds: Vec<(String, String, u8)> = Vec::new();
    let mut cell = Cell::default();
    // `<scalar title="a">5.43</scalar>` — the title arrives on the start tag and
    // the number as the following text node, so the title is held across events.
    let mut scalar_title: Option<String> = None;
    // Depth of `<molecule>` nesting, so a nested molecule's atoms do not leak
    // into the one we are reading.
    let mut molecule_depth = 0usize;
    // Set once the first molecule with atoms has closed: everything after is a
    // sibling molecule we deliberately ignore.
    let mut done = false;
    let mut saw_molecule = false;

    loop {
        let ev = reader.read_event().map_err(|e| {
            format!(
                "CML: malformed XML at byte {}: {e}",
                reader.buffer_position()
            )
        })?;
        match ev {
            Event::Eof => break,
            Event::Start(ref e) | Event::Empty(ref e) => {
                let empty = matches!(ev, Event::Empty(_));
                let name = local_name(e.name().as_ref());
                match name.as_str() {
                    "molecule" => {
                        saw_molecule = true;
                        if !empty {
                            molecule_depth += 1;
                        }
                    }
                    "atom" if !done => {
                        let map = attrs(e);
                        let Some(coord) = atom_coord(&map) else {
                            // No usable coordinates on this atom — skip it
                            // rather than failing the whole document.
                            continue;
                        };
                        let symbol = map
                            .get("elementType")
                            .map(|s| capitalize(s.trim()))
                            .unwrap_or_default();
                        atoms.push(Atom {
                            id: map.get("id").cloned().unwrap_or_default(),
                            element: symbol_to_atomic_num(&symbol),
                            coord,
                        });
                    }
                    "bond" if !done => {
                        let map = attrs(e);
                        let refs = map
                            .get("atomRefs2")
                            .or_else(|| map.get("atomRefs"))
                            .cloned()
                            .unwrap_or_default();
                        let parts: Vec<&str> = refs.split_whitespace().collect();
                        if parts.len() >= 2 {
                            file_bonds.push((
                                parts[0].to_string(),
                                parts[1].to_string(),
                                bond_order(map.get("order")),
                            ));
                        }
                    }
                    "scalar" if !done => {
                        scalar_title = attrs(e).get("title").map(|t| t.trim().to_lowercase());
                    }
                    _ => {}
                }
            }
            Event::Text(ref t) if scalar_title.is_some() => {
                // `decode()` is enough here: the values are plain numbers, and
                // quick-xml 0.38 moved unescaping out of `BytesText`.
                let raw = t.decode().unwrap_or_default();
                if let Ok(v) = raw.trim().parse::<f32>() {
                    match scalar_title.as_deref() {
                        Some("a") => cell.a = Some(v),
                        Some("b") => cell.b = Some(v),
                        Some("c") => cell.c = Some(v),
                        Some("alpha") => cell.alpha = Some(v),
                        Some("beta") => cell.beta = Some(v),
                        Some("gamma") => cell.gamma = Some(v),
                        _ => {}
                    }
                }
                scalar_title = None;
            }
            Event::End(ref e) => {
                let name = local_name(e.name().as_ref());
                if name == "scalar" {
                    scalar_title = None;
                } else if name == "molecule" {
                    molecule_depth = molecule_depth.saturating_sub(1);
                    // Closing the outermost molecule that yielded atoms ends the
                    // read; later sibling molecules are a follow-up.
                    if molecule_depth == 0 && !atoms.is_empty() {
                        done = true;
                    }
                }
            }
            _ => {}
        }
    }

    if !saw_molecule {
        return Err("not a CML file: no <molecule> element found".into());
    }
    if atoms.is_empty() {
        return Err("CML: <molecule> contains no atoms with usable coordinates".into());
    }

    let box_matrix = cell.matrix();
    let needs_cell = atoms
        .iter()
        .any(|a| matches!(a.coord, Coord::Fractional(_)));
    if needs_cell && box_matrix.is_none() {
        return Err(
            "CML: fractional coordinates (xFract/yFract/zFract) need a <crystal> cell".into(),
        );
    }

    let n_atoms = atoms.len();
    let mut positions = Vec::with_capacity(n_atoms * 3);
    let mut elements = Vec::with_capacity(n_atoms);
    let mut id_to_index: HashMap<&str, u32> = HashMap::with_capacity(n_atoms);
    for (i, atom) in atoms.iter().enumerate() {
        match atom.coord {
            Coord::Cartesian([x, y, z]) => {
                positions.push(x);
                positions.push(y);
                positions.push(z);
            }
            Coord::Fractional([fa, fb, fc]) => {
                // SAFETY: `needs_cell` guarantees box_matrix is Some here.
                let m = box_matrix.unwrap();
                positions.push(fa * m[0] + fb * m[3] + fc * m[6]);
                positions.push(fa * m[1] + fb * m[4] + fc * m[7]);
                positions.push(fa * m[2] + fb * m[5] + fc * m[8]);
            }
        }
        elements.push(atom.element);
        if !atom.id.is_empty() {
            id_to_index.insert(atom.id.as_str(), i as u32);
        }
    }

    // Explicit connectivity when <bondArray> is present, distance inference
    // otherwise (CML from 2D drawing tools sometimes omits it).
    let mut bond_pairs: Vec<(u32, u32)> = Vec::new();
    let mut bond_orders: Vec<u8> = Vec::new();
    let mut seen: HashSet<(u32, u32)> = HashSet::new();
    for (from, to, order) in &file_bonds {
        let (Some(&a), Some(&b)) = (id_to_index.get(from.as_str()), id_to_index.get(to.as_str()))
        else {
            continue; // dangling atomRefs2 — drop the bond, keep the molecule
        };
        if a == b {
            continue;
        }
        let pair = (a.min(b), a.max(b));
        if seen.insert(pair) {
            bond_pairs.push(pair);
            bond_orders.push(*order);
        }
    }

    let n_file_bonds = bond_pairs.len();
    let (bonds, bond_orders) = if bond_pairs.is_empty() {
        let empty = HashSet::new();
        (
            bonds::infer_bonds(&positions, &elements, n_atoms, &empty),
            None,
        )
    } else {
        (bond_pairs, Some(bond_orders))
    };

    Ok(ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds,
        bond_orders,
        box_matrix,
        box_origin: None,
        frame_positions_flat: Vec::new(),
        atom_labels: None,
        chain_ids: None,
        bfactors: None,
        vector_channels: vec![],
        ca_indices: vec![],
        ca_chain_ids: vec![],
        ca_res_nums: vec![],
        ca_ss_type: vec![],
        symmetry_ops: Vec::new(),
        hetero: None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    const METHANE: &str = r#"<?xml version="1.0"?>
<molecule id="methane" xmlns="http://www.xml-cml.org/schema">
  <atomArray>
    <atom id="a1" elementType="C" x3="0.0000" y3="0.0000" z3="0.0000"/>
    <atom id="a2" elementType="H" x3="0.6291" y3="0.6291" z3="0.6291"/>
    <atom id="a3" elementType="H" x3="-0.6291" y3="-0.6291" z3="0.6291"/>
    <atom id="a4" elementType="H" x3="-0.6291" y3="0.6291" z3="-0.6291"/>
    <atom id="a5" elementType="H" x3="0.6291" y3="-0.6291" z3="-0.6291"/>
  </atomArray>
  <bondArray>
    <bond atomRefs2="a1 a2" order="1"/>
    <bond atomRefs2="a1 a3" order="1"/>
    <bond atomRefs2="a1 a4" order="1"/>
    <bond atomRefs2="a1 a5" order="1"/>
  </bondArray>
</molecule>
"#;

    #[test]
    fn parses_a_3d_molecule_with_explicit_bonds() {
        let s = parse(METHANE).unwrap();
        assert_eq!(s.n_atoms, 5);
        assert_eq!(s.elements, vec![6, 1, 1, 1, 1]);
        assert_eq!(s.n_file_bonds, 4);
        assert_eq!(s.bonds.len(), 4);
        assert_eq!(s.bond_orders.unwrap(), vec![1, 1, 1, 1]);
        assert!((s.positions[3] - 0.6291).abs() < 1e-4);
        assert!(s.box_matrix.is_none());
    }

    #[test]
    fn reads_double_and_triple_bond_orders() {
        let text = r#"<molecule>
  <atomArray>
    <atom id="a1" elementType="C" x3="0" y3="0" z3="0"/>
    <atom id="a2" elementType="C" x3="1.2" y3="0" z3="0"/>
    <atom id="a3" elementType="O" x3="2.4" y3="0" z3="0"/>
  </atomArray>
  <bondArray>
    <bond atomRefs2="a1 a2" order="3"/>
    <bond atomRefs2="a2 a3" order="D"/>
  </bondArray>
</molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.bond_orders.unwrap(), vec![3, 2]);
    }

    #[test]
    fn aromatic_bond_order_collapses_to_one() {
        let text = r#"<molecule>
  <atomArray>
    <atom id="a1" elementType="C" x3="0" y3="0" z3="0"/>
    <atom id="a2" elementType="C" x3="1.4" y3="0" z3="0"/>
  </atomArray>
  <bondArray><bond atomRefs2="a1 a2" order="A"/></bondArray>
</molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.bond_orders.unwrap(), vec![1]);
    }

    #[test]
    fn parses_a_crystal_with_fractional_coordinates() {
        let text = r#"<molecule>
  <crystal>
    <scalar title="a" units="units:angstrom">5.43</scalar>
    <scalar title="b" units="units:angstrom">5.43</scalar>
    <scalar title="c" units="units:angstrom">5.43</scalar>
    <scalar title="alpha" units="units:degree">90</scalar>
    <scalar title="beta" units="units:degree">90</scalar>
    <scalar title="gamma" units="units:degree">90</scalar>
  </crystal>
  <atomArray>
    <atom id="a1" elementType="Si" xFract="0.0" yFract="0.0" zFract="0.0"/>
    <atom id="a2" elementType="Si" xFract="0.25" yFract="0.25" zFract="0.25"/>
  </atomArray>
</molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 2);
        let cell = s.box_matrix.expect("crystal cell");
        assert!((cell[0] - 5.43).abs() < 1e-4);
        assert!((s.positions[3] - 1.3575).abs() < 1e-3);
        assert!((s.positions[5] - 1.3575).abs() < 1e-3);
    }

    #[test]
    fn packs_the_xyz3_attribute_form() {
        let text = r#"<molecule>
  <atomArray>
    <atom id="a1" elementType="O" xyz3="0.0 0.0 0.117"/>
    <atom id="a2" elementType="H" xyz3="0.0 0.757 -0.469"/>
  </atomArray>
</molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.elements, vec![8, 1]);
        assert!((s.positions[2] - 0.117).abs() < 1e-4);
    }

    #[test]
    fn projects_a_2d_depiction_onto_z_zero() {
        let text = r#"<molecule>
  <atomArray>
    <atom id="a1" elementType="C" x2="0.0" y2="0.0"/>
    <atom id="a2" elementType="O" x2="1.4" y2="0.0"/>
  </atomArray>
  <bondArray><bond atomRefs2="a1 a2" order="2"/></bondArray>
</molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 2);
        assert_eq!(s.positions[2], 0.0);
        assert_eq!(s.positions[5], 0.0);
    }

    #[test]
    fn infers_bonds_when_bondarray_is_absent() {
        let text = r#"<molecule>
  <atomArray>
    <atom id="a1" elementType="O" x3="0.0" y3="0.0" z3="0.117"/>
    <atom id="a2" elementType="H" x3="0.0" y3="0.757" z3="-0.469"/>
    <atom id="a3" elementType="H" x3="0.0" y3="-0.757" z3="-0.469"/>
  </atomArray>
</molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_file_bonds, 0);
        assert_eq!(s.bonds.len(), 2); // inferred O–H pair
        assert!(s.bond_orders.is_none());
    }

    #[test]
    fn honours_namespace_prefixes() {
        let text = r#"<cml:molecule xmlns:cml="http://www.xml-cml.org/schema">
  <cml:atomArray>
    <cml:atom cml:id="a1" cml:elementType="N" cml:x3="0" cml:y3="0" cml:z3="0"/>
  </cml:atomArray>
</cml:molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.elements, vec![7]);
    }

    #[test]
    fn loads_the_first_molecule_of_a_multi_molecule_file() {
        let text = r#"<cml>
  <molecule id="first">
    <atomArray><atom id="a1" elementType="He" x3="0" y3="0" z3="0"/></atomArray>
  </molecule>
  <molecule id="second">
    <atomArray>
      <atom id="b1" elementType="Ne" x3="0" y3="0" z3="0"/>
      <atom id="b2" elementType="Ne" x3="3" y3="0" z3="0"/>
    </atomArray>
  </molecule>
</cml>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 1);
        assert_eq!(s.elements, vec![2]); // He, not Ne
    }

    #[test]
    fn drops_a_bond_with_a_dangling_atom_reference() {
        let text = r#"<molecule>
  <atomArray>
    <atom id="a1" elementType="C" x3="0" y3="0" z3="0"/>
    <atom id="a2" elementType="C" x3="1.5" y3="0" z3="0"/>
  </atomArray>
  <bondArray>
    <bond atomRefs2="a1 a2" order="1"/>
    <bond atomRefs2="a1 nope" order="1"/>
  </bondArray>
</molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_file_bonds, 1);
    }

    #[test]
    fn skips_an_atom_with_no_usable_coordinates() {
        let text = r#"<molecule>
  <atomArray>
    <atom id="a1" elementType="C" x3="0" y3="0" z3="0"/>
    <atom id="a2" elementType="C"/>
  </atomArray>
</molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 1);
    }

    #[test]
    fn unknown_element_symbol_maps_to_zero() {
        let text = r#"<molecule><atomArray>
  <atom id="a1" elementType="Xx" x3="0" y3="0" z3="0"/>
</atomArray></molecule>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.elements, vec![0]);
    }

    #[test]
    fn rejects_a_document_with_no_molecule() {
        let err = match parse("<foo><bar/></foo>") {
            Ok(_) => panic!("expected an error"),
            Err(e) => e,
        };
        assert!(err.contains("not a CML file"), "unexpected error: {err}");
    }

    #[test]
    fn rejects_a_molecule_with_no_atoms() {
        let err = match parse("<molecule><atomArray/></molecule>") {
            Ok(_) => panic!("expected an error"),
            Err(e) => e,
        };
        assert!(err.contains("no atoms"), "unexpected error: {err}");
    }

    #[test]
    fn rejects_fractional_coordinates_without_a_cell() {
        let text = r#"<molecule><atomArray>
  <atom id="a1" elementType="Si" xFract="0.0" yFract="0.0" zFract="0.0"/>
</atomArray></molecule>"#;
        let err = match parse(text) {
            Ok(_) => panic!("expected an error"),
            Err(e) => e,
        };
        assert!(err.contains("<crystal> cell"), "unexpected error: {err}");
    }

    #[test]
    fn rejects_malformed_xml() {
        assert!(parse("<molecule><atomArray>").is_err());
    }

    #[test]
    fn does_not_expand_a_doctype_entity() {
        // Billion-laughs shape: quick-xml never expands custom entities, so the
        // document parses to "no molecule" rather than exploding.
        let text = concat!(
            "<?xml version=\"1.0\"?>\n",
            "<!DOCTYPE lolz [<!ENTITY lol \"lol\">",
            "<!ENTITY lol2 \"&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;\">]>\n",
            "<lolz>&lol2;</lolz>\n"
        );
        let err = match parse(text) {
            Ok(_) => panic!("expected an error"),
            Err(e) => e,
        };
        assert!(err.contains("not a CML file"), "unexpected error: {err}");
    }
}
