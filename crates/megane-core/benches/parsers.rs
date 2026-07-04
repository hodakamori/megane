//! Dependency-free A/B benchmark for the megane-core parser hot paths
//! (CRITICAL RULE #10). No criterion — just `std::time::Instant` over many
//! iterations, printing a median so before/after runs can be compared.
//!
//! Usage (A/B against the working tree):
//!   cargo bench -p megane-core                       # "after" numbers
//!   git stash push crates/megane-core/src            # revert just the src edits
//!   cargo bench -p megane-core                       # "before" numbers
//!   git stash pop
//!
//! The bench file itself is untracked, so `git stash push … src` leaves it in
//! place and it compiles against both revisions (public APIs are unchanged).

use std::time::Instant;

use megane_core::{atomic, lammpstrj, xtc};

fn median(mut v: Vec<f64>) -> f64 {
    v.sort_by(|a, b| a.partial_cmp(b).unwrap());
    v[v.len() / 2]
}

/// Time `f` `runs` times and return the median wall-clock in milliseconds.
fn bench<F: FnMut()>(runs: usize, mut f: F) -> f64 {
    // One warm-up to page in code/allocator.
    f();
    let mut samples = Vec::with_capacity(runs);
    for _ in 0..runs {
        let t0 = Instant::now();
        f();
        samples.push(t0.elapsed().as_secs_f64() * 1000.0);
    }
    median(samples)
}

/// Build a multi-frame LAMMPS dump string with `frames` frames of `atoms` atoms.
fn make_lammpstrj(frames: usize, atoms: usize) -> String {
    let mut s = String::with_capacity(frames * atoms * 24);
    for fr in 0..frames {
        s.push_str("ITEM: TIMESTEP\n");
        s.push_str(&format!("{}\n", fr * 100));
        s.push_str("ITEM: NUMBER OF ATOMS\n");
        s.push_str(&format!("{atoms}\n"));
        s.push_str("ITEM: BOX BOUNDS pp pp pp\n0.0 20.0\n0.0 20.0\n0.0 20.0\n");
        s.push_str("ITEM: ATOMS id type x y z\n");
        for a in 0..atoms {
            let x = (a % 20) as f32 + 0.13;
            let y = ((a * 7) % 20) as f32 + 0.27;
            let z = ((a * 13) % 20) as f32 + 0.41;
            s.push_str(&format!("{} 1 {x} {y} {z}\n", a + 1));
        }
    }
    s
}

fn main() {
    println!("megane-core parser benchmarks (median ms)\n");

    // ── 1. LAMMPS lazy streaming: build_index + decode every frame ──
    // This is the path that was O(n_frames²) before bounding the per-frame slice.
    let lmp = make_lammpstrj(300, 500);
    let ms = bench(5, || {
        let idx = lammpstrj::build_index(&lmp).unwrap();
        let mut acc = 0.0f32;
        for &off in &idx.offsets {
            let frame = lammpstrj::decode_frame_at(&lmp, off, idx.n_atoms).unwrap();
            acc += frame.positions[0];
        }
        std::hint::black_box(acc);
    });
    println!("  lammpstrj stream (300f x 500a): {ms:8.2} ms  [build_index + decode_frame_at x300]");

    // ── 2. XTC eager parse (exercises decode_ints in the decompress hot loop) ──
    let xtc_path = concat!(
        env!("CARGO_MANIFEST_DIR"),
        "/../../tests/fixtures/caffeine_water_vibration.xtc"
    );
    match std::fs::read(xtc_path) {
        Ok(bytes) => {
            let ms = bench(10, || {
                let d = xtc::parse_xtc(&bytes).unwrap();
                std::hint::black_box(d.n_frames);
            });
            println!("  xtc parse (caffeine_water, 100f): {ms:8.2} ms  [parse_xtc]");
        }
        Err(e) => println!("  xtc parse: SKIPPED ({e})"),
    }

    // ── 3. capitalize() in isolation (called per-atom by every parser) ──
    let syms = ["c", "N", "o", "FE", "cl", "na", "MG", "si", "H", "ca"];
    let ms = bench(10, || {
        let mut n = 0usize;
        for _ in 0..200_000 {
            for s in &syms {
                n += atomic::capitalize(s).len();
            }
        }
        std::hint::black_box(n);
    });
    println!("  capitalize (2M calls):          {ms:8.2} ms  [atomic::capitalize]");
}
