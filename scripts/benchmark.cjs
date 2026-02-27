/**
 * FPS benchmark for megane molecular viewer.
 * Renders multiple frames at different atom counts and measures render time.
 * Uses headless GL (node-gl + Three.js).
 */

const createGL = require('gl');

const WIDTH = 1280;
const HEIGHT = 720;

function generateAtoms(nAtoms) {
  const positions = new Float32Array(nAtoms * 3);
  const elements = new Uint8Array(nAtoms);
  const ELEMENT_TYPES = [1, 6, 7, 8, 16];

  // Generate atoms in a cubic lattice
  const sideLen = Math.ceil(Math.cbrt(nAtoms));
  const spacing = 3.0;

  for (let i = 0; i < nAtoms; i++) {
    const ix = i % sideLen;
    const iy = Math.floor(i / sideLen) % sideLen;
    const iz = Math.floor(i / (sideLen * sideLen));
    positions[i * 3] = ix * spacing + (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 1] = iy * spacing + (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 2] = iz * spacing + (Math.random() - 0.5) * 0.5;
    elements[i] = ELEMENT_TYPES[i % ELEMENT_TYPES.length];
  }

  // Bonds: connect neighbors
  const bondPairs = [];
  for (let i = 0; i < nAtoms - 1 && bondPairs.length < nAtoms; i++) {
    bondPairs.push(i, i + 1);
  }
  const bonds = new Uint32Array(bondPairs);

  return { nAtoms, nBonds: bonds.length / 2, positions, elements, bonds };
}

async function benchmarkAtomCount(THREE, nAtoms) {
  const glCtx = createGL(WIDTH, HEIGHT, { preserveDrawingBuffer: true });
  if (!glCtx) throw new Error('Failed to create GL context');

  const renderer = new THREE.WebGLRenderer({ context: glCtx, antialias: false });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0xf0f2f5, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 100000);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(50, 50, 50);
  scene.add(key);

  const { positions, elements, bonds, nBonds } = generateAtoms(nAtoms);

  // Build atom meshes
  const segs = nAtoms > 500000 ? 4 : nAtoms > 100000 ? 8 : 16;
  const sphereGeo = new THREE.SphereGeometry(1, segs, segs);
  const sphereMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.1 });
  const atomMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, nAtoms);

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();
  const COLORS = {
    1: [1, 1, 1], 6: [0.33, 0.33, 0.33], 7: [0.2, 0.3, 0.9],
    8: [0.9, 0.15, 0.15], 16: [1, 0.78, 0.17]
  };
  const RADII = { 1: 1.2, 6: 1.7, 7: 1.55, 8: 1.52, 16: 1.8 };

  // Load snapshot
  const loadStart = performance.now();
  for (let i = 0; i < nAtoms; i++) {
    const r = (RADII[elements[i]] || 1.5) * 0.3;
    matrix.makeScale(r, r, r);
    matrix.setPosition(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    atomMesh.setMatrixAt(i, matrix);
    const [cr, cg, cb] = COLORS[elements[i]] || [0.75, 0.4, 0.75];
    color.setRGB(cr, cg, cb);
    atomMesh.setColorAt(i, color);
  }
  atomMesh.instanceMatrix.needsUpdate = true;
  if (atomMesh.instanceColor) atomMesh.instanceColor.needsUpdate = true;
  const loadTime = performance.now() - loadStart;

  scene.add(atomMesh);

  // Camera
  const sideLen = Math.ceil(Math.cbrt(nAtoms)) * 3;
  camera.position.set(sideLen, sideLen, sideLen * 2);
  camera.lookAt(sideLen / 2, sideLen / 2, sideLen / 2);

  // Warm-up render
  renderer.render(scene, camera);

  // Benchmark: render N frames
  const FRAMES = 60;
  const frameTimes = [];

  for (let f = 0; f < FRAMES; f++) {
    // Slightly rotate camera each frame to simulate interaction
    camera.position.x = sideLen * Math.cos(f * 0.05) * 1.5;
    camera.position.z = sideLen * Math.sin(f * 0.05) * 1.5 + sideLen;
    camera.lookAt(sideLen / 2, sideLen / 2, sideLen / 2);

    const t0 = performance.now();
    renderer.render(scene, camera);
    glCtx.finish(); // Force GPU sync
    const t1 = performance.now();
    frameTimes.push(t1 - t0);
  }

  // Position update benchmark
  const newPositions = new Float32Array(nAtoms * 3);
  for (let i = 0; i < nAtoms * 3; i++) {
    newPositions[i] = positions[i] + (Math.random() - 0.5) * 0.1;
  }

  const updateStart = performance.now();
  for (let i = 0; i < nAtoms; i++) {
    atomMesh.getMatrixAt(i, matrix);
    matrix.setPosition(newPositions[i * 3], newPositions[i * 3 + 1], newPositions[i * 3 + 2]);
    atomMesh.setMatrixAt(i, matrix);
  }
  atomMesh.instanceMatrix.needsUpdate = true;
  renderer.render(scene, camera);
  glCtx.finish();
  const updateTime = performance.now() - updateStart;

  // Cleanup
  renderer.dispose();
  sphereGeo.dispose();
  sphereMat.dispose();

  // Stats
  const avgFrame = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
  const minFrame = Math.min(...frameTimes);
  const maxFrame = Math.max(...frameTimes);
  const p95 = frameTimes.sort((a, b) => a - b)[Math.floor(FRAMES * 0.95)];
  const fps = 1000 / avgFrame;

  return {
    nAtoms,
    loadTimeMs: loadTime.toFixed(1),
    avgFrameMs: avgFrame.toFixed(2),
    minFrameMs: minFrame.toFixed(2),
    maxFrameMs: maxFrame.toFixed(2),
    p95FrameMs: p95.toFixed(2),
    fps: fps.toFixed(1),
    updateMs: updateTime.toFixed(1),
    sphereSegments: segs,
  };
}

async function main() {
  const THREE = await import('three');

  const ATOM_COUNTS = [327, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

  console.log('=== megane FPS Benchmark ===');
  console.log(`Resolution: ${WIDTH}x${HEIGHT}`);
  console.log(`GL Backend: headless (node-gl + Mesa software rasterizer)`);
  console.log(`Note: Real GPU performance will be 10-50x faster\n`);

  const results = [];

  for (const n of ATOM_COUNTS) {
    process.stdout.write(`Benchmarking ${n.toLocaleString()} atoms...`);
    try {
      const result = await benchmarkAtomCount(THREE, n);
      results.push(result);
      process.stdout.write(` ${result.fps} FPS (${result.avgFrameMs}ms/frame)\n`);
    } catch (e) {
      process.stdout.write(` FAILED: ${e.message}\n`);
      break;
    }
  }

  console.log('\n┌─────────────┬──────────┬────────────┬────────────┬────────────┬──────────┬──────────────┐');
  console.log('│    Atoms    │   FPS    │  Avg (ms)  │  P95 (ms)  │  Max (ms)  │ Load(ms) │ Update (ms)  │');
  console.log('├─────────────┼──────────┼────────────┼────────────┼────────────┼──────────┼──────────────┤');

  for (const r of results) {
    const atoms = String(r.nAtoms).padStart(11);
    const fps = String(r.fps).padStart(8);
    const avg = String(r.avgFrameMs).padStart(10);
    const p95 = String(r.p95FrameMs).padStart(10);
    const max = String(r.maxFrameMs).padStart(10);
    const load = String(r.loadTimeMs).padStart(8);
    const update = String(r.updateMs).padStart(12);
    console.log(`│${atoms} │${fps} │${avg} │${p95} │${max} │${load} │${update} │`);
  }

  console.log('└─────────────┴──────────┴────────────┴────────────┴────────────┴──────────┴──────────────┘');
  console.log('\nNote: This benchmark uses Mesa software rasterizer (no GPU).');
  console.log('On a real GPU (e.g. RTX 3060, M1 Pro), expect 10-50x better FPS.');
  console.log('The key metrics are the RELATIVE scaling between atom counts.');
}

main().catch(e => { console.error(e); process.exit(1); });
