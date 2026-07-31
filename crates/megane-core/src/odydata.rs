//! Wavefunction Odyssey (`.xodydata` / `.odydata`) parser.
//!
//! Odyssey is Wavefunction Inc.'s molecular-simulation teaching package (same
//! vendor as Spartan). It writes two unrelated file layouts under two
//! extensions, and this module reads both:
//!
//! * **`.xodydata`** — the modern default, an XML document rooted at
//!   `<odyssey_simulation>`. Per Wavefunction's own documentation it is "a
//!   complete record of the model except for wavefunction-based surfaces".
//! * **`.odydata`** — the older text layout, shared with Spartan's archive
//!   *input* section (`ENDCART` / `ATOMLABELS` / `HESSIAN` … `ENDHESS`).
//!
//! ```xml
//! <odyssey_simulation>
//!   <title>water</title>
//!   <structure>
//!     <atom id="1" label="O1" element="O" xyz="0.000 0.000 0.117"/>
//!     <atom id="2" label="H1" element="H" xyz="0.000 0.757 -0.469"/>
//!     <bond a="1" b="2" order="s"/>
//!   </structure>
//!   <boundary box="20.0 20.0 20.0"/>
//! </odyssey_simulation>
//! ```
//!
//! ## Where the schema comes from
//!
//! Wavefunction publishes no schema and no format specification, so this
//! reader is written against the behaviour of Jmol's `XmlOdysseyReader` and
//! `SpartanInputReader` — used strictly as *documentation of the layout*. Jmol
//! is LGPL and none of its code is reproduced here; only the observable
//! element/attribute vocabulary is, which is the format itself and not
//! copyrightable expression.
//!
//! Because the format is reconstructed rather than specified, the reader is
//! written to fail loudly (a clear `Err`) rather than to guess: an atom with no
//! element or no coordinates is dropped, and a document with no atoms at all is
//! an error instead of an empty structure.
//!
//! ## Format notes
//!
//! * Bond orders are spelled `s`/`d`/`t`/`a` (single, double, triple,
//!   aromatic) or as a plain integer. Aromatic collapses to 1 for display, the
//!   same choice `mol2.rs` makes for Sybyl `ar`.
//! * `<boundary box="x y z"/>` is an orthorhombic periodic cell. Odyssey
//!   centres its coordinates on the box centre, so atoms are shifted by
//!   `+(x/2, y/2, z/2)` to put them inside a cell drawn at the world origin —
//!   megane has no box origin for this format, so the atoms move instead.
//! * `<group charge="…">` / `<member entity="…">` carry formal charges.
//!   [`ParsedStructure`] has no formal-charge channel, so they are skipped.
//! * `.odydata` bond data lives in the `HESSIAN` block behind a preamble of one
//!   number per atom; those tokens are skipped before the `i j order` triples.
//!
//! ## Untrusted input
//!
//! `quick_xml::Reader` is a pull parser that does no DTD processing and no
//! entity expansion beyond the five XML predefined entities, so a hostile
//! `.xodydata` cannot mount a billion-laughs or external-entity (XXE) attack
//! through it. Nothing here resolves a `SYSTEM` identifier or reads a second
//! file.

use crate::atomic::{capitalize, symbol_to_atomic_num};
use crate::bonds;
use crate::parser::{cell_params_to_matrix, ParsedStructure};
use quick_xml::events::{BytesStart, Event};
use quick_xml::Reader;
use std::collections::{HashMap, HashSet};

/// Strip an XML namespace prefix and lower-case: `ody:Atom` → `atom`.
fn norm_key(raw: &[u8]) -> String {
    let s = String::from_utf8_lossy(raw);
    let local = match s.rsplit_once(':') {
        Some((_, l)) => l,
        None => &s,
    };
    local.to_ascii_lowercase()
}

/// Attributes keyed by lower-cased local name.
fn attrs(e: &BytesStart<'_>) -> HashMap<String, String> {
    let mut map = HashMap::new();
    for a in e.attributes().flatten() {
        let val = a
            .unescape_value()
            .map(|v| v.into_owned())
            .unwrap_or_else(|_| String::from_utf8_lossy(&a.value).into_owned());
        map.insert(norm_key(a.key.as_ref()), val);
    }
    map
}

/// Split on whitespace or commas and parse every token as `f32`.
fn floats(raw: &str) -> Vec<f32> {
    raw.split([' ', ',', '\t', '\n', '\r'])
        .filter(|t| !t.is_empty())
        .filter_map(|t| t.parse().ok())
        .collect()
}

/// `s`/`d`/`t`/`a` or a plain integer. Aromatic renders as a single bond, the
/// same encoding `mol2.rs` uses for Sybyl `ar`.
fn bond_order(raw: &str) -> u8 {
    let t = raw.trim();
    match t.chars().next().map(|c| c.to_ascii_lowercase()) {
        Some('s') => 1,
        Some('d') => 2,
        Some('t') => 3,
        Some('a') => 1,
        _ => match t.parse::<i32>() {
            // Spartan spells aromatic 5; anything else out of range is a
            // display single bond rather than a hard failure.
            Ok(5) => 1,
            Ok(n) if (1..=4).contains(&n) => n as u8,
            _ => 1,
        },
    }
}

/// An `element` attribute is a symbol (`"O"`), but accept an atomic number too
/// so a writer that emits `element="8"` still loads.
fn element_number(raw: &str) -> u8 {
    let t = raw.trim();
    match t.parse::<i32>() {
        Ok(n) if (1..=118).contains(&n) => n as u8,
        _ => symbol_to_atomic_num(&capitalize(t)),
    }
}

/// Atoms and bonds harvested from either flavour, before bond resolution.
#[derive(Default)]
struct Raw {
    /// Names bonds may reference: the `id` attribute, or the 1-based index for
    /// the text flavour.
    ids: Vec<String>,
    /// Display labels (`label` attribute, or the `ATOMLABELS` block).
    labels: Vec<String>,
    elements: Vec<u8>,
    positions: Vec<f32>,
    bonds: Vec<(String, String, u8)>,
    /// Orthorhombic cell edge lengths from `<boundary box="…"/>`.
    box_lengths: Option<[f32; 3]>,
}

/// Parse an Odyssey file, auto-detecting the XML and text flavours.
///
/// Both extensions are dispatched here because either layout can turn up under
/// either name — Odyssey's own exporter picks by version, not by extension, and
/// Jmol likewise sniffs content rather than trusting the suffix.
pub fn parse(text: &str) -> Result<ParsedStructure, String> {
    if looks_like_xml(text) {
        finish(parse_xml(text)?)
    } else {
        finish(parse_text(text)?)
    }
}

/// True when the first non-blank, non-BOM character opens an XML tag.
fn looks_like_xml(text: &str) -> bool {
    text.trim_start_matches('\u{feff}')
        .trim_start()
        .starts_with('<')
}

/// Read the XML `.xodydata` flavour.
fn parse_xml(text: &str) -> Result<Raw, String> {
    let mut reader = Reader::from_str(text);
    reader.config_mut().trim_text(true);

    let mut raw = Raw::default();
    let mut saw_root = false;
    // A file may hold several <structure> elements. Only the first one with
    // atoms is loaded, matching how `cml.rs` picks the first <molecule>.
    let mut structures_with_atoms = 0usize;
    let mut skipping = false;

    loop {
        let ev = reader.read_event().map_err(|e| {
            format!(
                "odydata: malformed XML at byte {}: {e}",
                reader.buffer_position()
            )
        })?;
        match ev {
            Event::Eof => break,
            Event::Start(ref e) | Event::Empty(ref e) => {
                let name = norm_key(e.name().as_ref());
                match name.as_str() {
                    "odyssey_simulation" | "odyssey" => saw_root = true,
                    "structure" => {
                        saw_root = true;
                        if structures_with_atoms > 0 {
                            skipping = true;
                        }
                    }
                    "atom" if !skipping => {
                        let map = attrs(e);
                        // Jmol drops an atom that lacks either an element or a
                        // full coordinate triple; a partially-specified atom
                        // would otherwise render at the origin.
                        let Some(sym) = map.get("element") else {
                            continue;
                        };
                        let xyz = match map.get("xyz") {
                            Some(v) => floats(v),
                            None => continue,
                        };
                        if xyz.len() < 3 {
                            continue;
                        }
                        let id = map.get("id").cloned().unwrap_or_default();
                        let label = map.get("label").cloned().unwrap_or_else(|| id.clone());
                        raw.ids.push(id);
                        raw.labels.push(label);
                        raw.elements.push(element_number(sym));
                        raw.positions.extend_from_slice(&xyz[..3]);
                        if raw.elements.len() == 1 {
                            structures_with_atoms += 1;
                        }
                    }
                    "bond" if !skipping => {
                        let map = attrs(e);
                        if let (Some(a), Some(b)) = (map.get("a"), map.get("b")) {
                            let order = map.get("order").map(|o| bond_order(o)).unwrap_or(1);
                            raw.bonds.push((a.clone(), b.clone(), order));
                        }
                    }
                    "boundary" => {
                        let map = attrs(e);
                        if let Some(b) = map.get("box") {
                            let v = floats(b);
                            if v.len() >= 3 && v[0] > 0.0 && v[1] > 0.0 && v[2] > 0.0 {
                                raw.box_lengths = Some([v[0], v[1], v[2]]);
                            }
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    if !saw_root {
        return Err(
            "not an Odyssey file: no <odyssey_simulation> or <structure> element found".into(),
        );
    }
    if raw.elements.is_empty() {
        return Err("odydata: document contains no <atom> elements with an element and xyz".into());
    }
    Ok(raw)
}

/// Read the text `.odydata` flavour (the Spartan archive input section).
///
/// ```text
///  water                       ← title, after the comment header
/// 0 1                          ← charge and spin multiplicity
/// 8   0.000000  0.000000  0.117000
/// 1   0.000000  0.757000 -0.469000
/// ENDCART
/// ATOMLABELS
/// "O1"
/// "H1"
/// HESSIAN
///  0.0 0.0                     ← one number per atom, skipped
/// 1 2 1
/// ENDHESS
/// ```
fn parse_text(text: &str) -> Result<Raw, String> {
    let lines: Vec<&str> = text.lines().collect();
    let mut raw = Raw::default();

    // The atom block opens right after the charge / spin-multiplicity line,
    // the first line holding exactly two integers (spin is never negative).
    // Everything before it is the comment header and the title.
    let mut i = 0usize;
    let start = loop {
        if i >= lines.len() {
            return Err(
                "not an Odyssey file: no charge/multiplicity line before the coordinates".into(),
            );
        }
        let tok: Vec<&str> = lines[i].split_whitespace().collect();
        i += 1;
        if tok.len() == 2 {
            if let (Ok(_), Ok(spin)) = (tok[0].parse::<i32>(), tok[1].parse::<i32>()) {
                if spin >= 0 {
                    break i;
                }
            }
        }
    };

    // Atom lines are `<atomic number> <x> <y> <z>`, closed by ENDCART.
    let mut i = start;
    while i < lines.len() {
        let line = lines[i];
        if line.trim_start().starts_with("ENDCART") {
            i += 1;
            break;
        }
        let tok: Vec<&str> = line.split_whitespace().collect();
        if tok.len() < 4 {
            i += 1;
            continue;
        }
        let (Ok(z), Ok(x), Ok(y), Ok(zc)) = (
            tok[0].parse::<i32>(),
            tok[1].parse::<f32>(),
            tok[2].parse::<f32>(),
            tok[3].parse::<f32>(),
        ) else {
            i += 1;
            continue;
        };
        if !(1..=118).contains(&z) {
            i += 1;
            continue;
        }
        // Bonds index atoms 1-based, so the id is the position in the block.
        raw.ids.push((raw.elements.len() + 1).to_string());
        raw.labels.push(String::new());
        raw.elements.push(z as u8);
        raw.positions.extend_from_slice(&[x, y, zc]);
        i += 1;
    }

    let n_atoms = raw.elements.len();
    if n_atoms == 0 {
        return Err("odydata: no atom lines found before ENDCART".into());
    }

    // ATOMLABELS holds one quoted name per atom, in atom order.
    if let Some(pos) = lines[i..]
        .iter()
        .position(|l| l.trim_start().starts_with("ATOMLABELS"))
    {
        let first = i + pos + 1;
        for (k, line) in lines[first..].iter().take(n_atoms).enumerate() {
            let name = line.trim().trim_matches('"').trim();
            if !name.is_empty() {
                raw.labels[k] = name.to_string();
            }
        }
        i = (first + n_atoms).min(lines.len());
    }

    // HESSIAN opens with one number per atom, then `i j order` bond triples,
    // and closes with ENDHESS. Flattening to a token stream keeps the preamble
    // skip correct when it straddles a line break.
    if n_atoms > 1 {
        if let Some(pos) = lines[i..]
            .iter()
            .position(|l| l.trim_start().starts_with("HESSIAN"))
        {
            let mut tokens: Vec<&str> = Vec::new();
            for line in &lines[i + pos + 1..] {
                if line.trim_start().starts_with("ENDHESS") {
                    break;
                }
                tokens.extend(line.split_whitespace());
            }
            if tokens.len() > n_atoms {
                for tri in tokens[n_atoms..].chunks_exact(3) {
                    let (Ok(a), Ok(b), Ok(order)) = (
                        tri[0].parse::<usize>(),
                        tri[1].parse::<usize>(),
                        tri[2].parse::<i32>(),
                    ) else {
                        continue;
                    };
                    // Order 0 marks a non-bonded pair in the Spartan block.
                    if order <= 0 || a == 0 || b == 0 || a > n_atoms || b > n_atoms {
                        continue;
                    }
                    raw.bonds
                        .push((a.to_string(), b.to_string(), bond_order(tri[2])));
                }
            }
        }
    }

    Ok(raw)
}

/// Resolve bond endpoints, apply the periodic box, and infer bonds when the
/// file carried none.
fn finish(raw: Raw) -> Result<ParsedStructure, String> {
    let Raw {
        ids,
        labels,
        elements,
        mut positions,
        bonds: raw_bonds,
        box_lengths,
    } = raw;
    let n_atoms = elements.len();

    // Bonds reference the `id` attribute, but a file that only labels its atoms
    // may reference those instead, so both resolve. Ids win on a collision.
    let mut by_name: HashMap<&str, u32> = HashMap::with_capacity(n_atoms * 2);
    for (i, label) in labels.iter().enumerate() {
        if !label.is_empty() {
            by_name.insert(label.as_str(), i as u32);
        }
    }
    for (i, id) in ids.iter().enumerate() {
        if !id.is_empty() {
            by_name.insert(id.as_str(), i as u32);
        }
    }

    let mut bond_pairs: Vec<(u32, u32)> = Vec::new();
    let mut bond_orders: Vec<u8> = Vec::new();
    let mut seen: HashSet<(u32, u32)> = HashSet::new();
    for (a, b, order) in &raw_bonds {
        let (Some(&i), Some(&j)) = (by_name.get(a.as_str()), by_name.get(b.as_str())) else {
            continue; // dangling endpoint — drop the bond, keep the molecule
        };
        if i == j {
            continue;
        }
        let pair = (i.min(j), i.max(j));
        if seen.insert(pair) {
            bond_pairs.push(pair);
            bond_orders.push(*order);
        }
    }

    // Odyssey centres a periodic sample on the box centre. megane draws the
    // cell from the world origin, so shift the atoms into it.
    let box_matrix = box_lengths.map(|[x, y, z]| {
        for (k, p) in positions.iter_mut().enumerate() {
            *p += [x, y, z][k % 3] / 2.0;
        }
        cell_params_to_matrix(x, y, z, 90.0, 90.0, 90.0)
    });

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

    let atom_labels = if labels.iter().any(|l| !l.is_empty()) {
        Some(labels)
    } else {
        None
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
        atom_labels,
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

    /// `ParsedStructure` has no `Debug`, so `unwrap_err` is unavailable.
    fn err_of(r: Result<ParsedStructure, String>) -> String {
        match r {
            Ok(_) => panic!("expected an error"),
            Err(e) => e,
        }
    }

    const WATER_XML: &str = r#"<?xml version="1.0" encoding="UTF-8"?>
<odyssey_simulation>
  <title>water</title>
  <formula>H2O</formula>
  <phase>gas</phase>
  <structure>
    <atom id="1" label="O1" element="O" xyz="0.000 0.000 0.117"/>
    <atom id="2" label="H1" element="H" xyz="0.000 0.757 -0.469"/>
    <atom id="3" label="H2" element="H" xyz="0.000 -0.757 -0.469"/>
    <bond a="1" b="2" order="s"/>
    <bond a="1" b="3" order="s"/>
  </structure>
</odyssey_simulation>
"#;

    #[test]
    fn parses_the_xml_flavour() {
        let s = parse(WATER_XML).unwrap();
        assert_eq!(s.n_atoms, 3);
        assert_eq!(s.elements, vec![8, 1, 1]);
        assert_eq!(s.n_file_bonds, 2);
        assert_eq!(s.bond_orders.unwrap(), vec![1, 1]);
        assert!((s.positions[2] - 0.117).abs() < 1e-5);
        assert_eq!(
            s.atom_labels.unwrap(),
            vec!["O1".to_string(), "H1".into(), "H2".into()]
        );
    }

    #[test]
    fn reads_the_letter_bond_orders() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="1" element="C" xyz="0 0 0"/>
  <atom id="2" element="C" xyz="1.2 0 0"/>
  <atom id="3" element="N" xyz="2.4 0 0"/>
  <atom id="4" element="C" xyz="3.6 0 0"/>
  <bond a="1" b="2" order="d"/>
  <bond a="2" b="3" order="t"/>
  <bond a="3" b="4" order="a"/>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        // Aromatic collapses to 1 for display, as in mol2.
        assert_eq!(s.bond_orders.unwrap(), vec![2, 3, 1]);
    }

    #[test]
    fn reads_numeric_bond_orders_including_spartan_aromatic() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="1" element="C" xyz="0 0 0"/>
  <atom id="2" element="C" xyz="1.2 0 0"/>
  <atom id="3" element="C" xyz="2.4 0 0"/>
  <bond a="1" b="2" order="2"/>
  <bond a="2" b="3" order="5"/>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.bond_orders.unwrap(), vec![2, 1]);
    }

    #[test]
    fn a_bond_without_an_order_is_single() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="1" element="C" xyz="0 0 0"/>
  <atom id="2" element="C" xyz="1.5 0 0"/>
  <bond a="1" b="2"/>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.bond_orders.unwrap(), vec![1]);
    }

    #[test]
    fn accepts_an_atomic_number_in_the_element_attribute() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="1" element="26" xyz="0 0 0"/>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.elements, vec![26]);
    }

    #[test]
    fn falls_back_to_the_id_when_an_atom_has_no_label() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="a1" element="C" xyz="0 0 0"/>
  <atom id="a2" element="O" xyz="1.4 0 0"/>
  <bond a="a1" b="a2" order="s"/>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_file_bonds, 1);
        assert_eq!(s.atom_labels.unwrap(), vec!["a1".to_string(), "a2".into()]);
    }

    #[test]
    fn resolves_a_bond_that_references_labels_instead_of_ids() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="1" label="C1" element="C" xyz="0 0 0"/>
  <atom id="2" label="O1" element="O" xyz="1.4 0 0"/>
  <bond a="C1" b="O1" order="s"/>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_file_bonds, 1);
        assert_eq!(s.bonds, vec![(0, 1)]);
    }

    #[test]
    fn applies_the_periodic_boundary_box() {
        let text = r#"<odyssey_simulation>
  <structure>
    <atom id="1" element="Ar" xyz="0.0 0.0 0.0"/>
    <atom id="2" element="Ar" xyz="-4.0 2.0 1.0"/>
  </structure>
  <boundary box="20.0 20.0 20.0"/>
</odyssey_simulation>"#;
        let s = parse(text).unwrap();
        let cell = s.box_matrix.expect("boundary cell");
        assert!((cell[0] - 20.0).abs() < 1e-4);
        assert!((cell[4] - 20.0).abs() < 1e-4);
        assert!((cell[8] - 20.0).abs() < 1e-4);
        // Coordinates are centred on the box centre, so every atom shifts +L/2.
        assert!((s.positions[0] - 10.0).abs() < 1e-4);
        assert!((s.positions[3] - 6.0).abs() < 1e-4);
        assert!((s.positions[4] - 12.0).abs() < 1e-4);
    }

    #[test]
    fn a_boundary_declared_before_the_atoms_still_shifts_them() {
        let text = r#"<odyssey_simulation>
  <boundary box="10.0 10.0 10.0"/>
  <structure><atom id="1" element="Ar" xyz="0.0 0.0 0.0"/></structure>
</odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert!((s.positions[0] - 5.0).abs() < 1e-4);
    }

    #[test]
    fn a_degenerate_box_is_ignored() {
        let text = r#"<odyssey_simulation>
  <structure><atom id="1" element="Ar" xyz="0 0 0"/></structure>
  <boundary box="0 0 0"/>
</odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert!(s.box_matrix.is_none());
        assert_eq!(s.positions[0], 0.0);
    }

    #[test]
    fn infers_bonds_when_the_file_declares_none() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="1" element="O" xyz="0.000 0.000 0.117"/>
  <atom id="2" element="H" xyz="0.000 0.757 -0.469"/>
  <atom id="3" element="H" xyz="0.000 -0.757 -0.469"/>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_file_bonds, 0);
        assert_eq!(s.bonds.len(), 2);
        assert!(s.bond_orders.is_none());
    }

    #[test]
    fn skips_atoms_missing_an_element_or_coordinates() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="1" element="C" xyz="0 0 0"/>
  <atom id="2" xyz="1.5 0 0"/>
  <atom id="3" element="C"/>
  <atom id="4" element="C" xyz="1.5 0"/>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 1);
    }

    #[test]
    fn drops_a_bond_with_a_dangling_endpoint() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="1" element="C" xyz="0 0 0"/>
  <atom id="2" element="C" xyz="1.5 0 0"/>
  <bond a="1" b="2" order="s"/>
  <bond a="1" b="99" order="s"/>
  <bond a="1" b="1" order="s"/>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_file_bonds, 1);
    }

    #[test]
    fn only_the_first_structure_is_loaded() {
        let text = r#"<odyssey_simulation>
  <structure><atom id="1" element="C" xyz="0 0 0"/></structure>
  <structure><atom id="2" element="O" xyz="5 0 0"/></structure>
</odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 1);
        assert_eq!(s.elements, vec![6]);
    }

    #[test]
    fn ignores_group_and_member_charge_elements() {
        let text = r#"<odyssey_simulation><structure>
  <atom id="1" element="N" xyz="0 0 0"/>
  <group charge="1"><member entity="1"/></group>
</structure></odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 1);
    }

    #[test]
    fn strips_a_namespace_prefix() {
        let text = r#"<ody:odyssey_simulation xmlns:ody="urn:odyssey">
  <ody:structure><ody:atom ody:id="1" ody:element="C" ody:xyz="0 0 0"/></ody:structure>
</ody:odyssey_simulation>"#;
        let s = parse(text).unwrap();
        assert_eq!(s.elements, vec![6]);
    }

    #[test]
    fn rejects_xml_that_is_not_an_odyssey_document() {
        let err = err_of(parse("<html><body/></html>"));
        assert!(err.contains("not an Odyssey file"), "unexpected: {err}");
    }

    #[test]
    fn rejects_an_odyssey_document_with_no_atoms() {
        let err = err_of(parse(
            "<odyssey_simulation><structure/></odyssey_simulation>",
        ));
        assert!(err.contains("no <atom>"), "unexpected: {err}");
    }

    #[test]
    fn rejects_malformed_xml() {
        assert!(parse("<odyssey_simulation><structure>").is_err());
    }

    const WATER_TEXT: &str = "\
C  Odyssey sample
C
 water; gas
 0 1
0 1
8   0.000000  0.000000  0.117000
1   0.000000  0.757000 -0.469000
1   0.000000 -0.757000 -0.469000
ENDCART
ATOMLABELS
\"O1\"
\"H1\"
\"H2\"
HESSIAN
 0.0 0.0 0.0
1 2 1
1 3 1
ENDHESS
";

    #[test]
    fn parses_the_text_flavour() {
        let s = parse(WATER_TEXT).unwrap();
        assert_eq!(s.n_atoms, 3);
        assert_eq!(s.elements, vec![8, 1, 1]);
        assert_eq!(s.n_file_bonds, 2);
        assert_eq!(s.bonds, vec![(0, 1), (0, 2)]);
        assert_eq!(s.bond_orders.unwrap(), vec![1, 1]);
        assert!((s.positions[2] - 0.117).abs() < 1e-5);
        assert_eq!(
            s.atom_labels.unwrap(),
            vec!["O1".to_string(), "H1".into(), "H2".into()]
        );
    }

    #[test]
    fn the_text_flavour_infers_bonds_without_a_hessian_block() {
        let text = "\
 title
 0 1
0 1
8   0.000000  0.000000  0.117000
1   0.000000  0.757000 -0.469000
1   0.000000 -0.757000 -0.469000
ENDCART
";
        let s = parse(text).unwrap();
        assert_eq!(s.n_file_bonds, 0);
        assert_eq!(s.bonds.len(), 2);
    }

    #[test]
    fn the_text_flavour_reads_higher_bond_orders() {
        let text = "\
 ethene
0 1
6  0.000  0.000  0.000
6  1.330  0.000  0.000
ENDCART
HESSIAN
 0.0 0.0
1 2 2
ENDHESS
";
        let s = parse(text).unwrap();
        assert_eq!(s.bond_orders.unwrap(), vec![2]);
    }

    #[test]
    fn the_text_flavour_skips_a_zero_order_pair() {
        let text = "\
 pair
0 1
6  0.000  0.000  0.000
6  1.400  0.000  0.000
6  2.800  0.000  0.000
ENDCART
HESSIAN
 0.0 0.0 0.0
1 2 1
1 3 0
ENDHESS
";
        let s = parse(text).unwrap();
        assert_eq!(s.n_file_bonds, 1);
    }

    #[test]
    fn the_text_flavour_drops_an_out_of_range_bond_index() {
        let text = "\
 pair
0 1
6  0.000  0.000  0.000
6  1.400  0.000  0.000
ENDCART
HESSIAN
 0.0 0.0
1 2 1
1 9 1
0 2 1
ENDHESS
";
        let s = parse(text).unwrap();
        assert_eq!(s.n_file_bonds, 1);
    }

    #[test]
    fn the_text_flavour_tolerates_a_missing_endcart() {
        let text = "\
 neon
0 1
10  0.000  0.000  0.000
";
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 1);
        assert_eq!(s.elements, vec![10]);
    }

    #[test]
    fn the_text_flavour_ignores_an_out_of_range_atomic_number() {
        let text = "\
 junk
0 1
0    0.000  0.000  0.000
6    1.000  0.000  0.000
999  2.000  0.000  0.000
short line
ENDCART
";
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 1);
        assert_eq!(s.elements, vec![6]);
    }

    #[test]
    fn the_text_flavour_rejects_a_file_with_no_charge_line() {
        let err = err_of(parse("C only comments\nC nothing else\n"));
        assert!(err.contains("not an Odyssey file"), "unexpected: {err}");
    }

    #[test]
    fn the_text_flavour_rejects_a_file_with_no_atoms() {
        let err = err_of(parse(" title\n0 1\nENDCART\n"));
        assert!(err.contains("no atom lines"), "unexpected: {err}");
    }

    /// Both committed fixtures describe the same ethanol, so parsing them must
    /// agree on everything but the flavour-specific spelling. This is what
    /// keeps the two code paths from drifting apart.
    #[test]
    fn the_two_fixture_flavours_describe_the_same_molecule() {
        let xml = parse(include_str!("../../../tests/fixtures/ethanol.xodydata")).unwrap();
        let txt = parse(include_str!("../../../tests/fixtures/ethanol.odydata")).unwrap();

        assert_eq!(xml.n_atoms, 9);
        assert_eq!(txt.n_atoms, 9);
        assert_eq!(xml.elements, vec![6, 6, 8, 1, 1, 1, 1, 1, 1]);
        assert_eq!(xml.elements, txt.elements);
        assert_eq!(xml.n_file_bonds, 8);
        assert_eq!(xml.bonds, txt.bonds);
        assert_eq!(xml.bond_orders, txt.bond_orders);
        assert_eq!(xml.atom_labels, txt.atom_labels);
        assert_eq!(
            xml.atom_labels.as_ref().unwrap()[2],
            "O1",
            "labels are read in atom order"
        );
        for (a, b) in xml.positions.iter().zip(txt.positions.iter()) {
            assert!((a - b).abs() < 1e-4, "coordinates differ: {a} vs {b}");
        }
        assert!(xml.box_matrix.is_none(), "the gas-phase fixture has no cell");
    }

    #[test]
    fn a_leading_byte_order_mark_still_reads_as_xml() {
        let s = parse(&format!("\u{feff}{WATER_XML}")).unwrap();
        assert_eq!(s.n_atoms, 3);
    }

    #[test]
    fn a_single_atom_text_file_skips_the_bond_block_entirely() {
        let text = "\
 argon
0 1
18  0.000  0.000  0.000
ENDCART
HESSIAN
 0.0
ENDHESS
";
        let s = parse(text).unwrap();
        assert_eq!(s.n_atoms, 1);
        assert!(s.bonds.is_empty());
    }
}
