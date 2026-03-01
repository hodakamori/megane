/**
 * megane performance benchmark.
 *
 * Measures PDB parsing, VDW bond inference, and streaming decode times
 * across varying atom counts using the WASM module from Node.js.
 *
 * Usage: node bench/run.mjs
 * Output: bench/results/bench_results.json
 */

import { createRequire } from "module";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { performance } from "perf_hooks";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const wasm = require("../wasm/pkg-node");

const ATOM_COUNTS = [100, 500, 1_000, 5_000, 10_000, 50_000, 100_000];
const WARMUP_RUNS = 2;
const MEASURE_RUNS = 5;

// --- Data generators ---

/** Generate a PDB string with N atoms on a cubic grid (3A spacing). */
function generatePDB(nAtoms) {
  const lines = [];
  const spacing = 1.8;
  const side = Math.ceil(Math.cbrt(nAtoms));

  for (let i = 0; i < nAtoms; i++) {
    const ix = i % side;
    const iy = Math.floor(i / side) % side;
    const iz = Math.floor(i / (side * side));
    const x = (ix * spacing + (Math.random() - 0.5) * 0.5).toFixed(3).padStart(8);
    const y = (iy * spacing + (Math.random() - 0.5) * 0.5).toFixed(3).padStart(8);
    const z = (iz * spacing + (Math.random() - 0.5) * 0.5).toFixed(3).padStart(8);
    const serial = ((i + 1) % 100000).toString().padStart(5);
    lines.push(`ATOM  ${serial}  C   UNK A   1    ${x}${y}${z}  1.00  0.00           C`);
  }
  lines.push("END");
  return lines.join("\n");
}

/** Generate raw arrays for N atoms (for bond inference and protocol tests). */
function generateArrays(nAtoms) {
  const positions = new Float32Array(nAtoms * 3);
  const elements = new Uint8Array(nAtoms);
  const spacing = 1.8;
  const side = Math.ceil(Math.cbrt(nAtoms));

  for (let i = 0; i < nAtoms; i++) {
    const ix = i % side;
    const iy = Math.floor(i / side) % side;
    const iz = Math.floor(i / (side * side));
    positions[i * 3] = ix * spacing + (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 1] = iy * spacing + (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 2] = iz * spacing + (Math.random() - 0.5) * 0.5;
    elements[i] = 6; // Carbon
  }

  return { positions, elements };
}

/** Encode a snapshot into the binary protocol format. */
function encodeSnapshot(positions, elements, nAtoms) {
  const nBonds = 0;
  const elemPadded = nAtoms + ((4 - (nAtoms % 4)) % 4);
  const size = 8 + 4 + 4 + nAtoms * 3 * 4 + elemPadded + nBonds * 2 * 4;
  const buffer = new ArrayBuffer(size);
  const view = new DataView(buffer);

  // Header: MEGN + msg_type=0 + flags=0
  view.setUint32(0, 0x4e47454d, true);
  view.setUint8(4, 0);
  view.setUint8(5, 0);
  let offset = 8;

  view.setUint32(offset, nAtoms, true); offset += 4;
  view.setUint32(offset, nBonds, true); offset += 4;

  new Float32Array(buffer, offset, nAtoms * 3).set(positions);
  offset += nAtoms * 3 * 4;

  new Uint8Array(buffer, offset, nAtoms).set(elements);

  return buffer;
}

/** Decode a snapshot from binary protocol (pure JS, matches src/core/protocol.ts). */
function decodeSnapshot(buffer) {
  const view = new DataView(buffer);
  let offset = 8;

  const nAtoms = view.getUint32(offset, true); offset += 4;
  const nBonds = view.getUint32(offset, true); offset += 4;

  const positions = new Float32Array(buffer, offset, nAtoms * 3);
  offset += nAtoms * 3 * 4;

  const elements = new Uint8Array(buffer, offset, nAtoms);
  offset += nAtoms;
  offset += (4 - (offset % 4)) % 4;

  const bonds = new Uint32Array(buffer, offset, nBonds * 2);

  return { nAtoms, nBonds, positions, elements, bonds };
}

// --- Benchmark harness ---

/** Run fn multiple times and return median time in ms. */
function benchmark(fn, runs = MEASURE_RUNS, warmup = WARMUP_RUNS) {
  // Warmup
  for (let i = 0; i < warmup; i++) fn();

  const times = [];
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    fn();
    times.push(performance.now() - t0);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)]; // median
}

// --- Main ---

function main() {
  console.log("=== megane Performance Benchmark ===\n");
  console.log(`Atom counts: ${ATOM_COUNTS.map(n => n.toLocaleString()).join(", ")}`);
  console.log(`Runs per test: ${MEASURE_RUNS} (+ ${WARMUP_RUNS} warmup)\n`);

  const results = [];

  for (const nAtoms of ATOM_COUNTS) {
    process.stdout.write(`${nAtoms.toLocaleString().padStart(10)} atoms: `);

    const entry = { nAtoms, pdbParse: null, bondInference: null, nBonds: null, streamingDecode: null };

    // 1. PDB Parse
    const pdbText = generatePDB(nAtoms);
    entry.pdbParse = benchmark(() => {
      const result = wasm.parse_pdb(pdbText);
      result.free();
    });

    // 2. Bond Inference (VDW)
    const { positions, elements } = generateArrays(nAtoms);
    let bondResult;
    entry.bondInference = benchmark(() => {
      bondResult = wasm.infer_bonds_vdw(positions, elements, nAtoms);
    });
    entry.nBonds = bondResult ? bondResult.length / 2 : 0;

    // 3. Streaming Decode
    const binaryBuf = encodeSnapshot(positions, elements, nAtoms);
    entry.streamingDecode = benchmark(() => {
      decodeSnapshot(binaryBuf);
    });

    results.push(entry);

    const fmt = (ms) => ms < 1 ? `${(ms * 1000).toFixed(0)} us` : ms < 1000 ? `${ms.toFixed(1)} ms` : `${(ms / 1000).toFixed(2)} s`;
    console.log(`parse=${fmt(entry.pdbParse)}  bonds=${fmt(entry.bondInference)} (${entry.nBonds})  decode=${fmt(entry.streamingDecode)}`);
  }

  // Write results
  const outDir = join(__dirname, "results");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "bench_results.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outPath}`);
}

main();
