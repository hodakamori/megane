/**
 * Render 1M atoms using raw WebGL1 (node-gl) without Three.js.
 * Directly implements the billboard impostor technique.
 */

const createGL = require('gl');
const fs = require('fs');
const { execSync } = require('child_process');

const WIDTH = 1920;
const HEIGHT = 1080;
const N_ATOMS = 1_000_000;

function main() {
  const gl = createGL(WIDTH, HEIGHT, { preserveDrawingBuffer: true });
  if (!gl) { console.error('No GL'); process.exit(1); }

  console.log(`GL: ${gl.getParameter(gl.VERSION)}`);
  console.log(`Generating ${N_ATOMS.toLocaleString()} atoms...`);

  // Generate atoms on a cubic lattice
  const side = Math.ceil(Math.cbrt(N_ATOMS));
  const spacing = 2.5;
  const positions = new Float32Array(N_ATOMS * 3);
  const colors = new Float32Array(N_ATOMS * 3);
  const radii = new Float32Array(N_ATOMS);

  const CPK = [
    [1.0, 1.0, 1.0],     // H
    [0.33, 0.33, 0.33],  // C
    [0.2, 0.3, 0.9],     // N
    [0.9, 0.15, 0.15],   // O
    [1.0, 0.78, 0.17],   // S
  ];
  const RAD = [0.36, 0.51, 0.47, 0.46, 0.54]; // scaled vdW

  for (let i = 0; i < N_ATOMS; i++) {
    const ix = i % side;
    const iy = Math.floor(i / side) % side;
    const iz = Math.floor(i / (side * side));
    positions[i * 3] = ix * spacing + (Math.random() - 0.5) * 0.3;
    positions[i * 3 + 1] = iy * spacing + (Math.random() - 0.5) * 0.3;
    positions[i * 3 + 2] = iz * spacing + (Math.random() - 0.5) * 0.3;

    const ci = i % 5;
    colors[i * 3] = CPK[ci][0];
    colors[i * 3 + 1] = CPK[ci][1];
    colors[i * 3 + 2] = CPK[ci][2];
    radii[i] = RAD[ci];
  }

  console.log('Building shaders...');

  // Vertex shader: billboard impostor
  const vs = `
    attribute vec2 aQuad;
    attribute vec3 aCenter;
    attribute vec3 aColor;
    attribute float aRadius;

    uniform mat4 uView;
    uniform mat4 uProj;

    varying vec3 vColor;
    varying vec2 vUv;

    void main() {
      vColor = aColor;
      vUv = aQuad;

      vec4 viewCenter = uView * vec4(aCenter, 1.0);
      vec3 viewPos = viewCenter.xyz;
      viewPos.xy += aQuad * aRadius;

      gl_Position = uProj * vec4(viewPos, 1.0);
    }
  `;

  // Fragment shader: sphere impostor with Blinn-Phong
  const fs_src = `
    precision highp float;

    varying vec3 vColor;
    varying vec2 vUv;

    void main() {
      float dist2 = dot(vUv, vUv);
      if (dist2 > 1.0) discard;

      float z = sqrt(1.0 - dist2);
      vec3 normal = vec3(vUv, z);

      // Blinn-Phong
      vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
      float diffuse = max(dot(normal, lightDir), 0.0);
      float ambient = 0.3;

      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 40.0);

      vec3 color = vColor * (ambient + diffuse * 0.7) + vec3(1.0) * spec * 0.25;
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  const vertShader = compileShader(gl.VERTEX_SHADER, vs);
  const fragShader = compileShader(gl.FRAGMENT_SHADER, fs_src);
  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    process.exit(1);
  }

  gl.useProgram(program);

  // Get ANGLE_instanced_arrays extension
  const ext = gl.getExtension('ANGLE_instanced_arrays');
  if (!ext) {
    console.error('ANGLE_instanced_arrays not available');
    process.exit(1);
  }

  // Quad geometry: 4 vertices for a billboard quad
  const quadVerts = new Float32Array([
    -1, -1,  1, -1,  1, 1,  -1, 1,
  ]);
  const quadIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);

  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

  const idxBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, quadIndices, gl.STATIC_DRAW);

  // Per-instance buffers
  const centerBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, centerBuf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const colorBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  const radiusBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, radiusBuf);
  gl.bufferData(gl.ARRAY_BUFFER, radii, gl.STATIC_DRAW);

  // Attribute locations
  const aQuad = gl.getAttribLocation(program, 'aQuad');
  const aCenter = gl.getAttribLocation(program, 'aCenter');
  const aColor = gl.getAttribLocation(program, 'aColor');
  const aRadius = gl.getAttribLocation(program, 'aRadius');

  // Setup attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.enableVertexAttribArray(aQuad);
  gl.vertexAttribPointer(aQuad, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, centerBuf);
  gl.enableVertexAttribArray(aCenter);
  gl.vertexAttribPointer(aCenter, 3, gl.FLOAT, false, 0, 0);
  ext.vertexAttribDivisorANGLE(aCenter, 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
  gl.enableVertexAttribArray(aColor);
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
  ext.vertexAttribDivisorANGLE(aColor, 1);

  gl.bindBuffer(gl.ARRAY_BUFFER, radiusBuf);
  gl.enableVertexAttribArray(aRadius);
  gl.vertexAttribPointer(aRadius, 1, gl.FLOAT, false, 0, 0);
  ext.vertexAttribDivisorANGLE(aRadius, 1);

  // Matrices
  const uView = gl.getUniformLocation(program, 'uView');
  const uProj = gl.getUniformLocation(program, 'uProj');

  // Simple perspective projection
  const fov = 50 * Math.PI / 180;
  const aspect = WIDTH / HEIGHT;
  const near = 1;
  const far = 10000;
  const f = 1.0 / Math.tan(fov / 2);

  const projMat = new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0,
  ]);

  // View matrix (look-at)
  const center = side * spacing / 2;
  const dist = center * 2.5;
  const eyeX = center + dist * 0.4;
  const eyeY = center + dist * 0.3;
  const eyeZ = center + dist * 0.8;

  // Simple look-at
  const fx = center - eyeX, fy = center - eyeY, fz = center - eyeZ;
  const flen = Math.sqrt(fx*fx + fy*fy + fz*fz);
  const fwx = fx/flen, fwy = fy/flen, fwz = fz/flen;

  const upx = 0, upy = 1, upz = 0;
  const sx = fwy * upz - fwz * upy;
  const sy = fwz * upx - fwx * upz;
  const sz = fwx * upy - fwy * upx;
  const slen = Math.sqrt(sx*sx + sy*sy + sz*sz);
  const snx = sx/slen, sny = sy/slen, snz = sz/slen;

  const ux = sny * fwz - snz * fwy;
  const uy = snz * fwx - snx * fwz;
  const uz = snx * fwy - sny * fwx;

  const viewMat = new Float32Array([
    snx, ux, -fwx, 0,
    sny, uy, -fwy, 0,
    snz, uz, -fwz, 0,
    -(snx*eyeX + sny*eyeY + snz*eyeZ),
    -(ux*eyeX + uy*eyeY + uz*eyeZ),
    -(-fwx*eyeX + -fwy*eyeY + -fwz*eyeZ),
    1,
  ]);

  gl.uniformMatrix4fv(uView, false, viewMat);
  gl.uniformMatrix4fv(uProj, false, projMat);

  // Render settings
  gl.viewport(0, 0, WIDTH, HEIGHT);
  gl.clearColor(0.94, 0.95, 0.96, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  console.log('Rendering 1M atoms...');

  // Render in batches (some GL implementations limit instance count)
  const BATCH = 100_000;
  const t0 = Date.now();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);

  for (let offset = 0; offset < N_ATOMS; offset += BATCH) {
    const count = Math.min(BATCH, N_ATOMS - offset);

    // Update instance attribute offsets
    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuf);
    gl.vertexAttribPointer(aCenter, 3, gl.FLOAT, false, 0, offset * 12);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, offset * 12);

    gl.bindBuffer(gl.ARRAY_BUFFER, radiusBuf);
    gl.vertexAttribPointer(aRadius, 1, gl.FLOAT, false, 0, offset * 4);

    ext.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, count);
  }

  gl.finish();
  const renderTime = Date.now() - t0;
  console.log(`Render time: ${renderTime}ms (${(1000/renderTime).toFixed(1)} FPS equivalent)`);

  // Read pixels
  const pixels = new Uint8Array(WIDTH * HEIGHT * 4);
  gl.readPixels(0, 0, WIDTH, HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  // Flip Y and write PPM
  const rgb = Buffer.alloc(WIDTH * HEIGHT * 3);
  for (let y = 0; y < HEIGHT; y++) {
    const srcRow = (HEIGHT - 1 - y) * WIDTH * 4;
    const dstRow = y * WIDTH * 3;
    for (let x = 0; x < WIDTH; x++) {
      rgb[dstRow + x * 3] = pixels[srcRow + x * 4];
      rgb[dstRow + x * 3 + 1] = pixels[srcRow + x * 4 + 1];
      rgb[dstRow + x * 3 + 2] = pixels[srcRow + x * 4 + 2];
    }
  }

  const ppmPath = '/home/user/megane/screenshots/1m_atoms.ppm';
  const header = `P6\n${WIDTH} ${HEIGHT}\n255\n`;
  fs.writeFileSync(ppmPath, Buffer.concat([Buffer.from(header), rgb]));

  // Convert PPM to PNG via Python/Pillow
  try {
    execSync(`python3 -c "
from PIL import Image
img = Image.open('${ppmPath}')
img.save('${ppmPath.replace('.ppm', '.png')}')
print('Saved PNG')
"`);
    console.log(`Screenshot: screenshots/1m_atoms.png (${WIDTH}x${HEIGHT})`);
  } catch {
    console.log(`Screenshot: ${ppmPath} (${WIDTH}x${HEIGHT})`);
  }

  // FPS benchmark: render 10 frames
  console.log('\nFPS benchmark (10 frames)...');
  const frameTimes = [];
  for (let frame = 0; frame < 10; frame++) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const ft0 = Date.now();
    for (let offset = 0; offset < N_ATOMS; offset += BATCH) {
      const count = Math.min(BATCH, N_ATOMS - offset);
      gl.bindBuffer(gl.ARRAY_BUFFER, centerBuf);
      gl.vertexAttribPointer(aCenter, 3, gl.FLOAT, false, 0, offset * 12);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
      gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, offset * 12);
      gl.bindBuffer(gl.ARRAY_BUFFER, radiusBuf);
      gl.vertexAttribPointer(aRadius, 1, gl.FLOAT, false, 0, offset * 4);
      ext.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, count);
    }
    gl.finish();
    frameTimes.push(Date.now() - ft0);
  }

  const avgMs = frameTimes.reduce((a, b) => a + b) / frameTimes.length;
  console.log(`  Avg frame: ${avgMs.toFixed(0)}ms (${(1000/avgMs).toFixed(1)} FPS)`);
  console.log(`  Note: Software rasterizer (Mesa). Real GPU = 10-50x faster.`);
}

main();
