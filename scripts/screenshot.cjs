/**
 * Headless screenshot of megane molecular viewer.
 * Uses node-gl + Three.js to render to an offscreen framebuffer,
 * then saves as PPM → converted to PNG via ImageMagick or sharp.
 */

const createGL = require('gl');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Setup DOM globals for Three.js
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;
global.HTMLCanvasElement = dom.window.HTMLCanvasElement;
global.self = global;

const WIDTH = 1280;
const HEIGHT = 720;

async function main() {
  // Dynamic import for ESM three.js
  const THREE = await import('three');

  // Create headless WebGL context
  const glCtx = createGL(WIDTH, HEIGHT, { preserveDrawingBuffer: true });
  if (!glCtx) {
    console.error('Failed to create GL context');
    process.exit(1);
  }

  // Polyfill WebGL2 methods that Three.js expects but node-gl (WebGL1) doesn't have
  if (!glCtx.texImage3D) glCtx.texImage3D = () => {};
  if (!glCtx.texSubImage3D) glCtx.texSubImage3D = () => {};
  if (!glCtx.texStorage2D) glCtx.texStorage2D = () => {};
  if (!glCtx.texStorage3D) glCtx.texStorage3D = () => {};
  if (!glCtx.createVertexArray) glCtx.createVertexArray = () => ({});
  if (!glCtx.bindVertexArray) glCtx.bindVertexArray = () => {};
  if (!glCtx.deleteVertexArray) glCtx.deleteVertexArray = () => {};
  if (!glCtx.drawArraysInstanced) glCtx.drawArraysInstanced = () => {};
  if (!glCtx.drawElementsInstanced) {
    const ext = glCtx.getExtension('ANGLE_instanced_arrays');
    if (ext) {
      glCtx.drawElementsInstanced = ext.drawElementsInstancedANGLE.bind(ext);
      glCtx.drawArraysInstanced = ext.drawArraysInstancedANGLE.bind(ext);
      glCtx.vertexAttribDivisor = ext.vertexAttribDivisorANGLE.bind(ext);
    } else {
      glCtx.drawElementsInstanced = () => {};
      glCtx.vertexAttribDivisor = () => {};
    }
  }
  if (!glCtx.renderbufferStorageMultisample) glCtx.renderbufferStorageMultisample = () => {};
  if (!glCtx.blitFramebuffer) glCtx.blitFramebuffer = () => {};
  if (!glCtx.getInternalformatParameter) glCtx.getInternalformatParameter = () => new Int32Array([]);
  if (!glCtx.invalidateFramebuffer) glCtx.invalidateFramebuffer = () => {};
  if (!glCtx.readBuffer) glCtx.readBuffer = () => {};
  if (!glCtx.drawBuffers) glCtx.drawBuffers = () => {};
  if (!glCtx.clearBufferfv) glCtx.clearBufferfv = () => {};
  if (!glCtx.clearBufferiv) glCtx.clearBufferiv = () => {};
  if (!glCtx.clearBufferuiv) glCtx.clearBufferuiv = () => {};
  if (!glCtx.clearBufferfi) glCtx.clearBufferfi = () => {};
  if (!glCtx.fenceSync) glCtx.fenceSync = () => ({});
  if (!glCtx.deleteSync) glCtx.deleteSync = () => {};
  if (!glCtx.clientWaitSync) glCtx.clientWaitSync = () => glCtx.CONDITION_SATISFIED || 0;
  if (!glCtx.getBufferSubData) glCtx.getBufferSubData = () => {};
  if (!glCtx.bindBufferBase) glCtx.bindBufferBase = () => {};
  if (!glCtx.bindBufferRange) glCtx.bindBufferRange = () => {};
  if (!glCtx.beginTransformFeedback) glCtx.beginTransformFeedback = () => {};
  if (!glCtx.endTransformFeedback) glCtx.endTransformFeedback = () => {};

  // WebGL2 constants
  if (!glCtx.RGBA8) glCtx.RGBA8 = 0x8058;
  if (!glCtx.READ_FRAMEBUFFER) glCtx.READ_FRAMEBUFFER = 0x8CA8;
  if (!glCtx.DRAW_FRAMEBUFFER) glCtx.DRAW_FRAMEBUFFER = 0x8CA9;
  if (!glCtx.TEXTURE_3D) glCtx.TEXTURE_3D = 0x806F;
  if (!glCtx.TEXTURE_WRAP_R) glCtx.TEXTURE_WRAP_R = 0x8072;
  if (!glCtx.MAX_SAMPLES) glCtx.MAX_SAMPLES = 0x8D57;
  if (!glCtx.COLOR_ATTACHMENT1) glCtx.COLOR_ATTACHMENT1 = 0x8CE1;
  if (!glCtx.UNIFORM_BUFFER) glCtx.UNIFORM_BUFFER = 0x8A11;

  // Fake canvas that wraps our headless GL context
  const canvas = {
    width: WIDTH,
    height: HEIGHT,
    getContext: () => glCtx,
    addEventListener: () => {},
    removeEventListener: () => {},
    style: {},
  };

  // Create Three.js renderer using the headless context
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context: glCtx,
    antialias: false,
    alpha: false,
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0xf0f2f5, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 10000);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(50, 50, 50);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.4);
  fill.position.set(-30, 20, -20);
  scene.add(fill);

  // Load PDB data using the Python protocol module's output
  const { execSync } = require('child_process');
  const snapshotBytes = execSync(
    '. .venv/bin/activate && python3 scripts/dump_snapshot.py',
    { cwd: '/home/user/megane', maxBuffer: 50 * 1024 * 1024 }
  );

  // Decode the binary snapshot
  const buf = snapshotBytes.buffer.slice(
    snapshotBytes.byteOffset,
    snapshotBytes.byteOffset + snapshotBytes.byteLength
  );
  const view = new DataView(buf);

  // Protocol: [magic(4) | version(2) | msgType(2) | nAtoms(4) | nBonds(4) | ...]
  const nAtoms = view.getUint32(8, true);
  const nBonds = view.getUint32(12, true);

  let offset = 16;
  const positions = new Float32Array(buf, offset, nAtoms * 3);
  offset += nAtoms * 3 * 4;
  const elements = new Uint8Array(buf, offset, nAtoms);
  offset += nAtoms;
  // Align to 4 bytes
  offset = (offset + 3) & ~3;
  const bonds = new Uint32Array(buf, offset, nBonds * 2);

  console.log(`Loaded: ${nAtoms} atoms, ${nBonds} bonds`);

  // CPK colors
  const COLORS = {
    1: [1.0, 1.0, 1.0],
    6: [0.33, 0.33, 0.33],
    7: [0.2, 0.3, 0.9],
    8: [0.9, 0.15, 0.15],
    15: [1.0, 0.5, 0.0],
    16: [1.0, 0.78, 0.17],
  };
  const DEFAULT_COLOR = [0.75, 0.4, 0.75];

  const RADII = { 1: 1.2, 6: 1.7, 7: 1.55, 8: 1.52, 15: 1.8, 16: 1.8 };
  const DEFAULT_RADIUS = 1.5;
  const ATOM_SCALE = 0.3;
  const BOND_RADIUS = 0.15;

  // Build atom meshes using InstancedMesh
  const sphereGeo = new THREE.SphereGeometry(1, 16, 16);
  const sphereMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.1 });
  const atomMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, nAtoms);

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < nAtoms; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    const r = (RADII[elements[i]] || DEFAULT_RADIUS) * ATOM_SCALE;

    matrix.makeScale(r, r, r);
    matrix.setPosition(x, y, z);
    atomMesh.setMatrixAt(i, matrix);

    const [cr, cg, cb] = COLORS[elements[i]] || DEFAULT_COLOR;
    color.setRGB(cr, cg, cb);
    atomMesh.setColorAt(i, color);

    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
  }
  atomMesh.instanceMatrix.needsUpdate = true;
  if (atomMesh.instanceColor) atomMesh.instanceColor.needsUpdate = true;
  scene.add(atomMesh);

  // Build bond meshes
  const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 6, 1);
  const cylMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.1 });
  const bondMesh = new THREE.InstancedMesh(cylGeo, cylMat, nBonds);

  const va = new THREE.Vector3();
  const vb = new THREE.Vector3();
  const mid = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion();

  for (let i = 0; i < nBonds; i++) {
    const ai = bonds[i * 2];
    const bi = bonds[i * 2 + 1];
    va.set(positions[ai * 3], positions[ai * 3 + 1], positions[ai * 3 + 2]);
    vb.set(positions[bi * 3], positions[bi * 3 + 1], positions[bi * 3 + 2]);
    mid.addVectors(va, vb).multiplyScalar(0.5);
    dir.subVectors(vb, va);
    const len = dir.length();
    dir.normalize();
    quat.setFromUnitVectors(up, dir);
    matrix.compose(mid, quat, new THREE.Vector3(BOND_RADIUS, len, BOND_RADIUS));
    bondMesh.setMatrixAt(i, matrix);

    const [r1, g1, b1] = COLORS[elements[ai]] || DEFAULT_COLOR;
    const [r2, g2, b2] = COLORS[elements[bi]] || DEFAULT_COLOR;
    color.setRGB((r1 + r2) / 2, (g1 + g2) / 2, (b1 + b2) / 2);
    bondMesh.setColorAt(i, color);
  }
  bondMesh.instanceMatrix.needsUpdate = true;
  if (bondMesh.instanceColor) bondMesh.instanceColor.needsUpdate = true;
  scene.add(bondMesh);

  // Camera positioning
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const cz = (minZ + maxZ) / 2;
  const extent = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
  const distance = extent * 1.2;
  camera.position.set(cx + distance * 0.3, cy + distance * 0.2, cz + distance);
  camera.lookAt(cx, cy, cz);
  camera.updateProjectionMatrix();

  // Render
  renderer.render(scene, camera);

  // Read pixels
  const pixels = new Uint8Array(WIDTH * HEIGHT * 4);
  glCtx.readPixels(0, 0, WIDTH, HEIGHT, glCtx.RGBA, glCtx.UNSIGNED_BYTE, pixels);

  // Flip vertically (GL has origin at bottom-left)
  const flipped = new Uint8Array(WIDTH * HEIGHT * 4);
  for (let y = 0; y < HEIGHT; y++) {
    const srcRow = (HEIGHT - 1 - y) * WIDTH * 4;
    const dstRow = y * WIDTH * 4;
    flipped.set(pixels.subarray(srcRow, srcRow + WIDTH * 4), dstRow);
  }

  // Write raw RGBA to file, then convert with ImageMagick
  const rawPath = '/tmp/megane_screenshot.raw';
  const pngPath = '/home/user/megane/screenshots/screenshot.png';

  fs.writeFileSync(rawPath, Buffer.from(flipped.buffer));

  // Create output dir
  const outDir = path.dirname(pngPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Convert to PNG using ImageMagick
  try {
    execSync(`convert -size ${WIDTH}x${HEIGHT} -depth 8 rgba:${rawPath} ${pngPath}`);
    console.log(`Screenshot saved: ${pngPath}`);
  } catch {
    // Fallback: write PPM
    const ppmPath = pngPath.replace('.png', '.ppm');
    const header = `P6\n${WIDTH} ${HEIGHT}\n255\n`;
    const rgb = Buffer.alloc(WIDTH * HEIGHT * 3);
    for (let i = 0; i < WIDTH * HEIGHT; i++) {
      rgb[i * 3] = flipped[i * 4];
      rgb[i * 3 + 1] = flipped[i * 4 + 1];
      rgb[i * 3 + 2] = flipped[i * 4 + 2];
    }
    fs.writeFileSync(ppmPath, Buffer.concat([Buffer.from(header), rgb]));
    console.log(`Screenshot saved as PPM: ${ppmPath}`);
  }

  // Cleanup
  renderer.dispose();
  sphereGeo.dispose();
  sphereMat.dispose();
  cylGeo.dispose();
  cylMat.dispose();
}

main().catch(e => { console.error(e); process.exit(1); });
