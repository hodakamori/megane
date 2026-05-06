/// GROMACS .top / .itp topology file parser.
///
/// Parses bond pairs from the [ bonds ] section and resolves
/// `#include` directives so that real-world multi-file topologies work.
use std::collections::HashMap;

// ── Virtual filesystem abstraction ────────────────────────────────────────────

/// Abstraction over a filesystem used to resolve `#include` directives.
///
/// Implement this trait to provide custom include resolution (e.g. for
/// WASM/browser contexts where real I/O is not available).
pub trait TopFileSystem {
    /// Return the contents of `path`, or `None` if the file does not exist.
    fn read(&self, path: &str) -> Option<String>;
}

/// A [`TopFileSystem`] backed by the real OS filesystem.
///
/// Include paths are resolved relative to `base_dir` first, then tried as
/// absolute paths.
#[cfg(not(target_arch = "wasm32"))]
pub struct RealTopFileSystem {
    /// Directory of the top-level `.top` file.
    pub base_dir: String,
}

#[cfg(not(target_arch = "wasm32"))]
impl TopFileSystem for RealTopFileSystem {
    fn read(&self, path: &str) -> Option<String> {
        let in_base = std::path::Path::new(&self.base_dir).join(path);
        std::fs::read_to_string(&in_base)
            .or_else(|_| std::fs::read_to_string(path))
            .ok()
    }
}

/// A [`TopFileSystem`] backed by an in-memory map of path → content.
///
/// Used in WASM/browser contexts where caller provides all included file
/// contents upfront.
pub struct VirtualTopFileSystem {
    files: HashMap<String, String>,
}

impl VirtualTopFileSystem {
    pub fn new(files: HashMap<String, String>) -> Self {
        Self { files }
    }
}

impl TopFileSystem for VirtualTopFileSystem {
    fn read(&self, path: &str) -> Option<String> {
        self.files.get(path).cloned()
    }
}

// ── Include resolution ─────────────────────────────────────────────────────────

/// Extract the include path from a `#include "path"` or `#include <path>` line.
fn parse_include_directive(line: &str) -> Option<String> {
    let trimmed = line.trim();
    if !trimmed.starts_with("#include") {
        return None;
    }
    let rest = trimmed["#include".len()..].trim();
    if rest.starts_with('"') {
        let inner = &rest[1..];
        inner.find('"').map(|end| inner[..end].to_string())
    } else if rest.starts_with('<') {
        let inner = &rest[1..];
        inner.find('>').map(|end| inner[..end].to_string())
    } else {
        None
    }
}

/// Recursively expand `#include` directives in `text`, using `fs` to read
/// included files.  `include_stack` tracks the current include chain so that
/// circular includes can be detected.
///
/// Missing includes are passed through as-is (silently skipped for bond
/// parsing), which matches how system forcefield includes work in practice.
fn expand_includes<F: TopFileSystem>(
    text: &str,
    fs: &F,
    include_stack: &mut Vec<String>,
) -> Result<String, String> {
    let mut result = String::with_capacity(text.len());

    for line in text.lines() {
        if let Some(include_path) = parse_include_directive(line) {
            if include_stack.contains(&include_path) {
                return Err(format!(
                    "Circular include detected: {} -> {}",
                    include_stack.join(" -> "),
                    include_path
                ));
            }
            match fs.read(&include_path) {
                Some(included_text) => {
                    include_stack.push(include_path.clone());
                    let expanded = expand_includes(&included_text, fs, include_stack)?;
                    include_stack.pop();
                    result.push_str(&expanded);
                    result.push('\n');
                }
                None => {
                    // Missing include (e.g. system forcefield files) — skip silently.
                }
            }
        } else {
            result.push_str(line);
            result.push('\n');
        }
    }

    Ok(result)
}

// ── Public API ────────────────────────────────────────────────────────────────

/// Parse a GROMACS `.top` / `.itp` text and extract bond pairs.
///
/// Returns `Vec<(a, b)>` with 0-indexed atom pairs where `a < b`.
/// `#include` directives are **not** resolved; pass pre-expanded text or use
/// [`parse_top_bonds_with_fs`] / [`parse_top_bonds_from_path`] instead.
pub fn parse_top_bonds(text: &str, n_atoms: usize) -> Vec<(u32, u32)> {
    let mut bonds = Vec::new();
    let mut in_bonds_section = false;

    for line in text.lines() {
        let trimmed = line.trim();

        if trimmed.is_empty() || trimmed.starts_with(';') || trimmed.starts_with('#') {
            continue;
        }

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

        if ai == 0 || aj == 0 {
            continue;
        }
        let a = (ai - 1).min(aj - 1);
        let b = (ai - 1).max(aj - 1);

        if (b as usize) < n_atoms {
            bonds.push((a, b));
        }
    }

    bonds
}

/// Parse a GROMACS `.top` text with `#include` resolution via a custom
/// filesystem implementation.
///
/// Returns an error string if a circular include is detected.
pub fn parse_top_bonds_with_fs<F: TopFileSystem>(
    top_text: &str,
    fs: &F,
    n_atoms: usize,
) -> Result<Vec<(u32, u32)>, String> {
    let mut stack = Vec::new();
    let expanded = expand_includes(top_text, fs, &mut stack)?;
    Ok(parse_top_bonds(&expanded, n_atoms))
}

/// Parse a GROMACS `.top` file at `path`, resolving `#include` directives
/// from the real filesystem.
///
/// Include paths are resolved relative to the directory of `path`.
#[cfg(not(target_arch = "wasm32"))]
pub fn parse_top_bonds_from_path(path: &str, n_atoms: usize) -> Result<Vec<(u32, u32)>, String> {
    use std::path::Path;

    let top_path = Path::new(path);
    let base_dir = top_path
        .parent()
        .map(|p| p.to_string_lossy().to_string())
        .unwrap_or_else(|| ".".to_string());

    let text = std::fs::read_to_string(path)
        .map_err(|e| format!("Cannot read {path}: {e}"))?;

    let fs = RealTopFileSystem { base_dir };
    parse_top_bonds_with_fs(&text, &fs, n_atoms)
}

// ── Tests ─────────────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    // ── parse_top_bonds (existing behaviour) ──────────────────────────────────

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
        assert_eq!(bonds[0], (0, 1));
        assert_eq!(bonds[1], (1, 2));
        assert_eq!(bonds[2], (9, 10));
    }

    #[test]
    fn test_out_of_range_bonds_filtered() {
        let text = "[ bonds ]\n1 2 1\n5 6 1\n";
        let bonds = parse_top_bonds(text, 3);
        assert_eq!(bonds.len(), 1);
        assert_eq!(bonds[0], (0, 1));
    }

    // ── parse_include_directive ───────────────────────────────────────────────

    #[test]
    fn test_parse_include_double_quote() {
        assert_eq!(
            parse_include_directive(r#"#include "molecule.itp""#),
            Some("molecule.itp".to_string())
        );
    }

    #[test]
    fn test_parse_include_angle_bracket() {
        assert_eq!(
            parse_include_directive("#include <forcefield.itp>"),
            Some("forcefield.itp".to_string())
        );
    }

    #[test]
    fn test_parse_include_with_leading_whitespace() {
        assert_eq!(
            parse_include_directive(r#"  #include "ions.itp""#),
            Some("ions.itp".to_string())
        );
    }

    #[test]
    fn test_parse_include_none_for_normal_line() {
        assert_eq!(parse_include_directive("[ bonds ]"), None);
        assert_eq!(parse_include_directive("; comment"), None);
        assert_eq!(parse_include_directive("1 2 1"), None);
    }

    // ── VirtualTopFileSystem + parse_top_bonds_with_fs ────────────────────────

    fn make_vfs(entries: &[(&str, &str)]) -> VirtualTopFileSystem {
        VirtualTopFileSystem::new(
            entries
                .iter()
                .map(|(k, v)| (k.to_string(), v.to_string()))
                .collect(),
        )
    }

    #[test]
    fn test_vfs_flat_include() {
        // molecule.itp provides the [ bonds ] section
        let vfs = make_vfs(&[(
            "molecule.itp",
            "[ bonds ]\n1 2 1\n2 3 1\n",
        )]);
        let top = r#"#include "molecule.itp""#;
        let bonds = parse_top_bonds_with_fs(top, &vfs, 10).unwrap();
        assert_eq!(bonds.len(), 2);
        assert_eq!(bonds[0], (0, 1));
        assert_eq!(bonds[1], (1, 2));
    }

    #[test]
    fn test_vfs_nested_includes() {
        // top.top → mol.itp → atoms.itp (which has [ bonds ])
        let vfs = make_vfs(&[
            ("mol.itp", r#"#include "atoms.itp""#),
            ("atoms.itp", "[ bonds ]\n1 2 1\n3 4 1\n"),
        ]);
        let top = r#"#include "mol.itp""#;
        let bonds = parse_top_bonds_with_fs(top, &vfs, 10).unwrap();
        assert_eq!(bonds.len(), 2);
        assert_eq!(bonds[0], (0, 1));
        assert_eq!(bonds[1], (2, 3));
    }

    #[test]
    fn test_vfs_missing_include_skipped() {
        // system.itp is not in the vfs; should be skipped silently
        let vfs = make_vfs(&[("mol.itp", "[ bonds ]\n1 2 1\n")]);
        let top = "#include <system.itp>\n#include \"mol.itp\"";
        let bonds = parse_top_bonds_with_fs(top, &vfs, 10).unwrap();
        assert_eq!(bonds.len(), 1);
    }

    #[test]
    fn test_vfs_circular_include_detected() {
        // a.itp includes b.itp which includes a.itp → circular
        let vfs = make_vfs(&[
            ("a.itp", r#"#include "b.itp""#),
            ("b.itp", r#"#include "a.itp""#),
        ]);
        let top = r#"#include "a.itp""#;
        let result = parse_top_bonds_with_fs(top, &vfs, 10);
        assert!(result.is_err());
        let msg = result.unwrap_err();
        assert!(msg.contains("Circular include"), "unexpected error: {msg}");
    }

    #[test]
    fn test_vfs_bonds_in_top_and_itp() {
        // Bonds come from both the main file and an included one
        let vfs = make_vfs(&[("extra.itp", "[ bonds ]\n3 4 1\n")]);
        let top = "[ bonds ]\n1 2 1\n#include \"extra.itp\"\n";
        let bonds = parse_top_bonds_with_fs(top, &vfs, 10).unwrap();
        // Bonds from main file: (0,1)
        // After include expansion the extra section follows; parser sees two [ bonds ] sections.
        // The second occurrence resets in_bonds_section = true, so both are collected.
        assert!(bonds.iter().any(|&b| b == (0, 1)));
        assert!(bonds.iter().any(|&b| b == (2, 3)));
    }

    #[test]
    fn test_vfs_diamond_include_allowed() {
        // A includes B and C; both include D — this is legal (not circular).
        let vfs = make_vfs(&[
            ("b.itp", "#include \"d.itp\""),
            ("c.itp", "#include \"d.itp\""),
            ("d.itp", "[ bonds ]\n1 2 1\n"),
        ]);
        let top = "#include \"b.itp\"\n#include \"c.itp\"\n";
        let bonds = parse_top_bonds_with_fs(top, &vfs, 10).unwrap();
        // d.itp is expanded twice; both occurrences yield the same bond.
        assert!(!bonds.is_empty());
    }

    // ── parse_top_bonds_from_path (native only) ───────────────────────────────

    #[cfg(not(target_arch = "wasm32"))]
    #[test]
    fn test_from_path_with_itp() {
        use std::fs;
        use tempfile::tempdir;

        let dir = tempdir().unwrap();

        let itp_path = dir.path().join("mol.itp");
        fs::write(&itp_path, "[ bonds ]\n1 2 1\n2 3 1\n").unwrap();

        let top_content = format!("#include \"mol.itp\"\n");
        let top_path = dir.path().join("system.top");
        fs::write(&top_path, top_content).unwrap();

        let bonds =
            parse_top_bonds_from_path(top_path.to_str().unwrap(), 10).unwrap();
        assert_eq!(bonds.len(), 2);
        assert_eq!(bonds[0], (0, 1));
        assert_eq!(bonds[1], (1, 2));
    }

    #[cfg(not(target_arch = "wasm32"))]
    #[test]
    fn test_from_path_missing_file_error() {
        let result = parse_top_bonds_from_path("/nonexistent/path.top", 10);
        assert!(result.is_err());
    }
}
