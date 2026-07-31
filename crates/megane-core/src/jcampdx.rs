//! JCAMP-DX spectra parser (`.jdx`, `.jcamp`, and also `.dx`).
//!
//! IUPAC's spectroscopy interchange format — IR, NMR, MS, UV/Vis:
//!
//! ```text
//! ##TITLE=Ethanol
//! ##JCAMP-DX=4.24
//! ##DATA TYPE=INFRARED SPECTRUM
//! ##XUNITS=1/CM
//! ##YUNITS=TRANSMITTANCE
//! ##FIRSTX=400  ##LASTX=4000  ##DELTAX=4  ##XFACTOR=1  ##YFACTOR=0.0001
//! ##NPOINTS=901
//! ##XYDATA=(X++(Y..Y))
//! 400 5623 5581 5544
//! ...
//! ##END=
//! ```
//!
//! The hard part is the **ASDF** compression used in `(X++(Y..Y))` tables:
//!
//! | scheme | encoding |
//! |---|---|
//! | AFFN | plain signed decimals, whitespace-separated |
//! | SQZ  | leading digit replaced by `@ A-I` (positive) / `a-i` (negative), no separator needed |
//! | DIF  | value is a *difference* from the previous Y, digits `% J-R` (positive) / `j-r` (negative) |
//! | DUP  | `S-Z s` repeat the previous value N times |
//!
//! `(XY..XY)` tables (peak tables) are also read, as plain X,Y pairs.
//!
//! Scope: decoding only. A spectrum has no coordinates, so this produces a
//! [`Spectrum`], not a `ParsedStructure`; the viewer-side plot surface is the
//! other half of issue #611.

/// A decoded spectrum: paired X/Y arrays plus the labels needed to plot them.
#[derive(Debug, Default, PartialEq)]
pub struct Spectrum {
    pub title: String,
    /// `##DATA TYPE=` verbatim, e.g. "INFRARED SPECTRUM".
    pub data_type: String,
    pub x_units: String,
    pub y_units: String,
    pub x: Vec<f64>,
    pub y: Vec<f64>,
}

/// Split a `##KEY= value` header line. Keys are compared with JCAMP's rule:
/// case-insensitive, ignoring spaces, dashes, slashes, and underscores.
fn header(line: &str) -> Option<(String, String)> {
    let t = line.trim();
    let rest = t.strip_prefix("##")?;
    let (key, value) = rest.split_once('=')?;
    let norm: String = key
        .chars()
        .filter(|c| c.is_ascii_alphanumeric())
        .map(|c| c.to_ascii_uppercase())
        .collect();
    Some((norm, value.trim().to_string()))
}

/// One decoded token from an ASDF data line.
enum Token {
    /// An absolute value (AFFN or SQZ).
    Value(f64),
    /// A difference from the previous value (DIF).
    Diff(f64),
    /// Repeat the previous value this many additional times (DUP).
    Dup(usize),
}

/// Split an ASDF field into tokens. Pseudo-digits start a new token without a
/// separator, which is what makes this format compact and fiddly.
fn tokenize(field: &str) -> Vec<Token> {
    let bytes = field.as_bytes();
    let mut out = Vec::new();
    let mut i = 0usize;

    while i < bytes.len() {
        let c = bytes[i] as char;
        if c.is_whitespace() || c == ',' {
            i += 1;
            continue;
        }

        // Classify the leading character, which selects the encoding.
        let (kind, sign, first_digit): (u8, f64, Option<char>) = match c {
            '+' | '-' | '.' | '0'..='9' => (0, 1.0, None), // AFFN
            '@' => (1, 1.0, Some('0')),                    // SQZ +0
            'A'..='I' => (1, 1.0, Some((b'1' + (c as u8 - b'A')) as char)),
            'a'..='i' => (1, -1.0, Some((b'1' + (c as u8 - b'a')) as char)),
            '%' => (2, 1.0, Some('0')), // DIF 0
            'J'..='R' => (2, 1.0, Some((b'1' + (c as u8 - b'J')) as char)),
            'j'..='r' => (2, -1.0, Some((b'1' + (c as u8 - b'j')) as char)),
            'S'..='Z' => (3, 1.0, Some((b'1' + (c as u8 - b'S')) as char)), // DUP 1..8
            's' => (3, 1.0, Some('9')),                                     // DUP 9
            _ => {
                i += 1;
                continue;
            }
        };

        let mut text = String::new();
        if kind == 0 {
            text.push(c);
        } else {
            text.push(first_digit.unwrap());
        }
        i += 1;
        // Trailing plain digits (and a decimal point / exponent for AFFN)
        // belong to the same token.
        while i < bytes.len() {
            let d = bytes[i] as char;
            // Digits always continue a token. For AFFN (kind 0) a decimal point
            // and an exponent marker do too, and a sign continues it ONLY when
            // it is the exponent's sign -- a bare `-` starts the next value.
            // Pseudo-digit tokens (SQZ/DIF/DUP) take plain digits and nothing else.
            let takes = if d.is_ascii_digit() {
                true
            } else if kind != 0 {
                false
            } else if d == '.' || d == 'e' || d == 'E' {
                true
            } else if d == '+' || d == '-' {
                matches!(text.chars().last(), Some('e') | Some('E'))
            } else {
                false
            };
            if !takes {
                break;
            }
            text.push(d);
            i += 1;
        }

        match kind {
            0 => {
                if let Ok(v) = text.parse::<f64>() {
                    out.push(Token::Value(v));
                }
            }
            1 => {
                if let Ok(v) = text.parse::<f64>() {
                    out.push(Token::Value(sign * v));
                }
            }
            2 => {
                if let Ok(v) = text.parse::<f64>() {
                    out.push(Token::Diff(sign * v));
                }
            }
            _ => {
                if let Ok(v) = text.parse::<usize>() {
                    out.push(Token::Dup(v.saturating_sub(1)));
                }
            }
        }
    }
    out
}

/// Decode an `(X++(Y..Y))` table: the first token of each line is the X value,
/// the rest are Y values in AFFN / SQZ / DIF / DUP form.
fn decode_xyy(
    lines: &[&str],
    x_factor: f64,
    y_factor: f64,
    delta_x: Option<f64>,
) -> (Vec<f64>, Vec<f64>) {
    let mut xs: Vec<f64> = Vec::new();
    let mut ys: Vec<f64> = Vec::new();
    let mut last_y: Option<f64> = None;

    for raw in lines {
        let line = match raw.find("$$") {
            Some(i) => &raw[..i], // JCAMP inline comment
            None => raw,
        };
        if line.trim().is_empty() {
            continue;
        }
        let tokens = tokenize(line);
        let mut iter = tokens.into_iter();
        let Some(first) = iter.next() else { continue };
        let line_x = match first {
            Token::Value(v) => v * x_factor,
            // A line cannot start with a difference or a repeat.
            _ => continue,
        };

        let mut line_ys: Vec<f64> = Vec::new();
        let mut running = last_y;
        // Whether this line used DIF encoding at all. The Y-checkpoint rule
        // below is a property of DIF blocks specifically, so it must not be
        // applied to an AFFN line — a flat baseline legitimately repeats the
        // previous line's last value, and dropping it silently deletes real
        // data points.
        let mut uses_dif = false;
        for tok in iter {
            match tok {
                Token::Value(v) => {
                    running = Some(v);
                    line_ys.push(v);
                }
                Token::Diff(d) => {
                    uses_dif = true;
                    let base = running.unwrap_or(0.0);
                    let v = base + d;
                    running = Some(v);
                    line_ys.push(v);
                }
                Token::Dup(n) => {
                    if let Some(v) = running {
                        for _ in 0..n {
                            line_ys.push(v);
                        }
                    }
                }
            }
        }
        if line_ys.is_empty() {
            continue;
        }
        // A continued DIF block restates the previous line's last Y as a
        // checkpoint; drop that duplicate.
        if uses_dif {
            if let Some(prev) = last_y {
                if !ys.is_empty() && (line_ys[0] - prev).abs() < 1e-9 {
                    line_ys.remove(0);
                }
            }
        }
        if line_ys.is_empty() {
            continue;
        }

        let dx = delta_x.unwrap_or(0.0);
        for (k, y) in line_ys.iter().enumerate() {
            xs.push(line_x + dx * k as f64);
            ys.push(y * y_factor);
        }
        last_y = line_ys.last().copied();
    }
    (xs, ys)
}

/// Decode an `(XY..XY)` peak table: alternating X,Y pairs, AFFN only.
fn decode_xyxy(lines: &[&str], x_factor: f64, y_factor: f64) -> (Vec<f64>, Vec<f64>) {
    let mut xs = Vec::new();
    let mut ys = Vec::new();
    let mut pending: Option<f64> = None;
    for raw in lines {
        let line = match raw.find("$$") {
            Some(i) => &raw[..i],
            None => raw,
        };
        for tok in line.split([' ', ',', ';', '\t']) {
            let t = tok.trim();
            if t.is_empty() {
                continue;
            }
            let Ok(v) = t.parse::<f64>() else { continue };
            match pending.take() {
                None => pending = Some(v),
                Some(x) => {
                    xs.push(x * x_factor);
                    ys.push(v * y_factor);
                }
            }
        }
    }
    (xs, ys)
}

/// Parse a JCAMP-DX document into a [`Spectrum`].
pub fn parse(text: &str) -> Result<Spectrum, String> {
    let lines: Vec<&str> = text.lines().collect();

    let mut spec = Spectrum::default();
    let mut x_factor = 1.0f64;
    let mut y_factor = 1.0f64;
    let mut delta_x: Option<f64> = None;
    let mut first_x: Option<f64> = None;
    let mut last_x: Option<f64> = None;
    let mut n_points: Option<usize> = None;
    let mut data_kind: Option<&'static str> = None;
    let mut data_lines: Vec<&str> = Vec::new();
    let mut saw_jcamp = false;

    for (i, line) in lines.iter().enumerate() {
        if let Some((key, value)) = header(line) {
            match key.as_str() {
                "TITLE" => spec.title = value,
                "JCAMPDX" => saw_jcamp = true,
                "DATATYPE" => spec.data_type = value,
                "XUNITS" => spec.x_units = value,
                "YUNITS" => spec.y_units = value,
                "XFACTOR" => x_factor = value.parse().unwrap_or(1.0),
                "YFACTOR" => y_factor = value.parse().unwrap_or(1.0),
                "DELTAX" => delta_x = value.parse().ok(),
                "FIRSTX" => first_x = value.parse().ok(),
                "LASTX" => last_x = value.parse().ok(),
                "NPOINTS" => n_points = value.parse().ok(),
                "XYDATA" => {
                    data_kind = Some("xyy");
                    data_lines = collect_data(&lines, i + 1);
                }
                "XYPOINTS" | "PEAKTABLE" | "XYPAIRS" => {
                    data_kind = Some("xyxy");
                    data_lines = collect_data(&lines, i + 1);
                }
                _ => {}
            }
        }
    }

    if !saw_jcamp && spec.title.is_empty() {
        return Err("not a JCAMP-DX file: no ##JCAMP-DX= or ##TITLE= header found".into());
    }

    // `##DELTAX` is optional; derive it from FIRSTX/LASTX/NPOINTS when absent,
    // which is what most IR writers rely on.
    if delta_x.is_none() {
        if let (Some(fx), Some(lx), Some(n)) = (first_x, last_x, n_points) {
            if n > 1 {
                delta_x = Some((lx - fx) / (n as f64 - 1.0));
            }
        }
    }

    let (x, y) = match data_kind {
        Some("xyy") => decode_xyy(&data_lines, x_factor, y_factor, delta_x),
        Some("xyxy") => decode_xyxy(&data_lines, x_factor, y_factor),
        _ => return Err("JCAMP-DX: no ##XYDATA= or ##PEAK TABLE= data block found".into()),
    };

    if x.is_empty() {
        return Err("JCAMP-DX: data block decoded to zero points".into());
    }

    spec.x = x;
    spec.y = y;
    Ok(spec)
}

/// Collect the data lines that follow a data-table header, stopping at the next
/// `##` header (`##END=` included).
fn collect_data<'a>(lines: &[&'a str], start: usize) -> Vec<&'a str> {
    let mut out = Vec::new();
    for line in lines.iter().skip(start) {
        if line.trim_start().starts_with("##") {
            break;
        }
        out.push(*line);
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_an_affn_xydata_table() {
        let text = "\
##TITLE=Test AFFN
##JCAMP-DX=4.24
##DATA TYPE=INFRARED SPECTRUM
##XUNITS=1/CM
##YUNITS=TRANSMITTANCE
##XFACTOR=1.0
##YFACTOR=1.0
##DELTAX=1.0
##FIRSTX=400
##LASTX=403
##NPOINTS=4
##XYDATA=(X++(Y..Y))
400 10 20 30 40
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.title, "Test AFFN");
        assert_eq!(s.data_type, "INFRARED SPECTRUM");
        assert_eq!(s.x_units, "1/CM");
        assert_eq!(s.y, vec![10.0, 20.0, 30.0, 40.0]);
        assert_eq!(s.x, vec![400.0, 401.0, 402.0, 403.0]);
    }

    #[test]
    fn applies_x_and_y_factors() {
        let text = "\
##TITLE=Scaled
##JCAMP-DX=4.24
##XFACTOR=2.0
##YFACTOR=0.5
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
100 4 8
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.x[0], 200.0);
        assert_eq!(s.y, vec![2.0, 4.0]);
    }

    #[test]
    fn reads_affn_values_in_exponent_form() {
        let text = "\
##TITLE=Exponent AFFN
##JCAMP-DX=4.24
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
0 1.5E-3 -2.5E+2 4
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.y, vec![0.0015, -250.0, 4.0]);
    }

    #[test]
    fn a_bare_minus_starts_the_next_affn_value() {
        let text = "\
##TITLE=Adjacent negatives
##JCAMP-DX=4.24
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
0 1-2-3
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.y, vec![1.0, -2.0, -3.0]);
    }

    #[test]
    fn decodes_sqz_pseudo_digits() {
        // A=1, B=2, C=3 …; lowercase is negative.
        let text = "\
##TITLE=SQZ
##JCAMP-DX=4.24
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
0 A2B3c4
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.y, vec![12.0, 23.0, -34.0]);
    }

    #[test]
    fn decodes_dif_differences() {
        // J=+1 … R=+9, j=-1 … r=-9. Start at 10, then +2, +3, -1.
        let text = "\
##TITLE=DIF
##JCAMP-DX=4.24
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
0 A0KLj
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.y, vec![10.0, 12.0, 15.0, 14.0]);
    }

    #[test]
    fn decodes_dup_repeats() {
        // DUP digits S..Z,s are 1..9, and the count INCLUDES the original, so
        // `T` (=2) means the preceding value occurs twice in total.
        let text = "\
##TITLE=DUP
##JCAMP-DX=4.24
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
0 A0T
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.y, vec![10.0, 10.0]);
        assert_eq!(s.x, vec![0.0, 1.0]);
    }

    #[test]
    fn a_longer_dup_run_repeats_the_right_number_of_times() {
        // DUP runs S..Z = 1..8 and s = 9, so `W` = 5 → five occurrences of the
        // preceding value in total.
        let text = "\
##TITLE=DUP long
##JCAMP-DX=4.24
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
0 A0W
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.y, vec![10.0; 5]);
    }

    #[test]
    fn drops_the_dif_checkpoint_between_lines() {
        let text = "\
##TITLE=DIF multiline
##JCAMP-DX=4.24
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
0 A0JJ
3 A2JJ
##END=
";
        let s = parse(text).unwrap();
        // Line 1: 10, 11, 12. Line 2 restates 12 as a checkpoint, then 13, 14.
        assert_eq!(s.y, vec![10.0, 11.0, 12.0, 13.0, 14.0]);
    }

    /// A flat baseline in an AFFN table legitimately repeats the previous
    /// line's last value. The DIF Y-checkpoint rule must not delete it.
    #[test]
    fn an_affn_line_repeating_the_previous_value_keeps_every_point() {
        let text = "\
##TITLE=Flat AFFN
##JCAMP-DX=4.24
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
0 5 5 5
3 5 5 5
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.y, vec![5.0; 6]);
        assert_eq!(s.x, vec![0.0, 1.0, 2.0, 3.0, 4.0, 5.0]);
    }

    #[test]
    fn derives_delta_x_from_firstx_lastx_npoints() {
        let text = "\
##TITLE=Derived deltax
##JCAMP-DX=4.24
##FIRSTX=0
##LASTX=30
##NPOINTS=4
##XYDATA=(X++(Y..Y))
0 1 2 3 4
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.x, vec![0.0, 10.0, 20.0, 30.0]);
    }

    #[test]
    fn parses_a_peak_table() {
        let text = "\
##TITLE=Peaks
##JCAMP-DX=4.24
##PEAK TABLE=(XY..XY)
100.0,5.0 200.0,7.5
300.0,2.5
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.x, vec![100.0, 200.0, 300.0]);
        assert_eq!(s.y, vec![5.0, 7.5, 2.5]);
    }

    #[test]
    fn strips_inline_dollar_comments() {
        let text = "\
##TITLE=Comments
##JCAMP-DX=4.24
##DELTAX=1.0
##XYDATA=(X++(Y..Y))
0 1 2 3   $$ trailing note
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.y, vec![1.0, 2.0, 3.0]);
    }

    #[test]
    fn header_keys_ignore_spaces_and_case() {
        let text = "\
##Title=Loose keys
##JCAMP-DX=4.24
##Data Type=MASS SPECTRUM
##delta x=1.0
##XYDATA=(X++(Y..Y))
0 1
##END=
";
        let s = parse(text).unwrap();
        assert_eq!(s.title, "Loose keys");
        assert_eq!(s.data_type, "MASS SPECTRUM");
    }

    #[test]
    fn rejects_a_non_jcamp_document() {
        let err = match parse("object 1 class gridpositions counts 2 2 2\n") {
            Ok(_) => panic!("expected an error"),
            Err(e) => e,
        };
        assert!(err.contains("not a JCAMP-DX"), "unexpected: {err}");
    }

    #[test]
    fn rejects_a_document_with_no_data_block() {
        let err = match parse("##TITLE=Empty\n##JCAMP-DX=4.24\n##END=\n") {
            Ok(_) => panic!("expected an error"),
            Err(e) => e,
        };
        assert!(err.contains("no ##XYDATA"), "unexpected: {err}");
    }

    #[test]
    fn rejects_an_empty_data_block() {
        let err = match parse("##TITLE=T\n##JCAMP-DX=4.24\n##XYDATA=(X++(Y..Y))\n##END=\n") {
            Ok(_) => panic!("expected an error"),
            Err(e) => e,
        };
        assert!(err.contains("zero points"), "unexpected: {err}");
    }
}

#[cfg(test)]
mod fixture_tests {
    use super::*;

    /// The two committed fixtures encode the SAME spectrum, one in plain AFFN
    /// and one with the ASDF SQZ+DIF compression real instruments emit. If the
    /// pseudo-digit decoding is wrong they will disagree, which is a far
    /// stronger check than either file on its own.
    #[test]
    fn affn_and_asdf_fixtures_decode_identically() {
        let affn = parse(include_str!("../../../tests/fixtures/ethanol_ir.jdx")).unwrap();
        let asdf = parse(include_str!("../../../tests/fixtures/ethanol_ir_asdf.jdx")).unwrap();

        assert_eq!(affn.x.len(), 121);
        assert_eq!(affn.data_type, "INFRARED SPECTRUM");
        assert_eq!(affn.x_units, "1/CM");
        assert_eq!(affn.y_units, "TRANSMITTANCE");

        assert_eq!(
            asdf.y.len(),
            affn.y.len(),
            "ASDF decoded a different point count"
        );
        for (i, (a, b)) in affn.y.iter().zip(asdf.y.iter()).enumerate() {
            assert!(
                (a - b).abs() < 1e-9,
                "point {i} differs: AFFN {a} vs ASDF {b}"
            );
        }

        // ##YFACTOR=0.01 applied: transmittance stays in the 0-100 range.
        assert!(affn.y.iter().all(|v| (0.0..=100.0).contains(v)));
        // The absorption bands really are minima, not a flat line.
        let min = affn.y.iter().cloned().fold(f64::INFINITY, f64::min);
        assert!(
            min < 60.0,
            "expected absorption bands, got a minimum of {min}"
        );
        // The abscissa spans the declared range.
        assert!((affn.x[0] - 400.0).abs() < 1e-6);
        assert!((affn.x[affn.x.len() - 1] - 4000.0).abs() < 1e-6);
    }
}
