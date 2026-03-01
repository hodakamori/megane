/// GROMACS .top topology file parser.
///
/// Extracts bond pairs from the [ bonds ] section.

/// Parse a GROMACS .top file and extract bond pairs.
/// Returns Vec<(u32, u32)> with 0-indexed atom pairs.
pub fn parse_top_bonds(text: &str, n_atoms: usize) -> Vec<(u32, u32)> {
    let mut bonds = Vec::new();
    let mut in_bonds_section = false;

    for line in text.lines() {
        let trimmed = line.trim();

        // Skip empty lines and comments
        if trimmed.is_empty() || trimmed.starts_with(';') {
            continue;
        }

        // Check for section headers
        if trimmed.starts_with('[') {
            let section_name = trimmed
                .trim_start_matches('[')
                .trim_end_matches(']')
                .trim()
                .to_lowercase();
            in_bonds_section = section_name == "bonds";
            continue;
        }

        if !in_bonds_section {
            continue;
        }

        // Parse bond line: atom_i atom_j [func_type ...]
        // Strip inline comments
        let data = if let Some(pos) = trimmed.find(';') {
            &trimmed[..pos]
        } else {
            trimmed
        };

        let mut parts = data.split_whitespace();
        let ai: u32 = match parts.next().and_then(|s| s.parse().ok()) {
            Some(v) => v,
            None => continue,
        };
        let aj: u32 = match parts.next().and_then(|s| s.parse().ok()) {
            Some(v) => v,
            None => continue,
        };

        // GROMACS uses 1-indexed atoms; convert to 0-indexed
        if ai == 0 || aj == 0 {
            continue;
        }
        let a = (ai - 1).min(aj - 1);
        let b = (ai - 1).max(aj - 1);

        // Validate indices
        if (b as usize) < n_atoms {
            bonds.push((a, b));
        }
    }

    bonds
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_top_bonds() {
        let text = r#"
; Comment line
[ moleculetype ]
protein  3

[ atoms ]
     1  N    1  ALA  N    1  -0.3   14.01

[ bonds ]
     1     2     1  ; bond 1-2
     2     3     1  ; bond 2-3
    10    11     1  ; bond 10-11

[ angles ]
     1     2     3     1
"#;
        let bonds = parse_top_bonds(text, 20);
        assert_eq!(bonds.len(), 3);
        assert_eq!(bonds[0], (0, 1)); // 1-indexed → 0-indexed
        assert_eq!(bonds[1], (1, 2));
        assert_eq!(bonds[2], (9, 10));
    }

    #[test]
    fn test_out_of_range_bonds_filtered() {
        let text = "[ bonds ]\n1 2 1\n5 6 1\n";
        let bonds = parse_top_bonds(text, 3); // only atoms 0,1,2
        assert_eq!(bonds.len(), 1);
        assert_eq!(bonds[0], (0, 1));
    }
}
