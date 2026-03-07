/**
 * GLSL 3.0 ES shaders for billboard impostor rendering.
 *
 * Atom shader: screen-aligned quad + ray-sphere intersection in fragment
 *              -> pixel-perfect spheres with correct depth.
 * Bond shader: screen-aligned quad between two endpoints
 *              -> cylinder-like shading with dashed bond support.
 *
 * RawShaderMaterial requires explicit uniform/attribute declarations.
 */

export const atomVertexShader = /* glsl */ `precision highp float;
  precision highp int;

  // Three.js built-in uniforms (must declare explicitly for RawShaderMaterial)
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uScaleMultiplier;
  uniform int uUsePerAtomOverrides;

  // Per-vertex (quad corners)
  in vec3 position;

  // Per-instance
  in vec3 instanceCenter;
  in float instanceRadius;
  in vec3 instanceColor;
  in float instanceScaleOverride;
  in float instanceOpacityOverride;

  out vec3 vColor;
  out vec2 vUv;
  out float vRadius;
  out vec3 vViewCenter;
  out float vOpacityOverride;

  void main() {
    vColor = instanceColor;
    vUv = position.xy;
    vOpacityOverride = instanceOpacityOverride;
    float effectiveScale = uScaleMultiplier;
    if (uUsePerAtomOverrides == 1) {
      effectiveScale *= instanceScaleOverride;
    }
    float scaledRadius = instanceRadius * effectiveScale;
    vRadius = scaledRadius;

    vec4 viewCenter = modelViewMatrix * vec4(instanceCenter, 1.0);
    vViewCenter = viewCenter.xyz;

    vec3 viewPos = viewCenter.xyz;
    viewPos.xy += position.xy * scaledRadius;

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`;

export const atomFragmentShader = /* glsl */ `precision highp float;
  precision highp int;

  in vec3 vColor;
  in vec2 vUv;
  in float vRadius;
  in vec3 vViewCenter;
  in float vOpacityOverride;

  uniform mat4 projectionMatrix;
  uniform float uOpacity;
  uniform int uUsePerAtomOverrides;

  out vec4 fragColor;

  void main() {
    float dist2 = dot(vUv, vUv);
    if (dist2 > 1.0) discard;

    float z = sqrt(1.0 - dist2);
    vec3 normal = vec3(vUv, z);

    // Correct depth
    vec3 fragViewPos = vViewCenter + normal * vRadius;
    vec4 clipPos = projectionMatrix * vec4(fragViewPos, 1.0);
    float ndcDepth = clipPos.z / clipPos.w;
    gl_FragDepth = ndcDepth * 0.5 + 0.5;

    // Hemisphere ambient: sky blue on top, warm brown on bottom
    vec3 skyColor = vec3(0.87, 0.92, 1.0);
    vec3 groundColor = vec3(0.6, 0.47, 0.27);
    float hemiMix = normal.y * 0.5 + 0.5;
    vec3 ambient = mix(groundColor, skyColor, hemiMix) * 0.35;

    // Dual-light diffuse
    vec3 lightDir1 = normalize(vec3(0.5, 0.5, 1.0));
    vec3 lightDir2 = normalize(vec3(-0.3, 0.3, 0.8));
    float diffuse1 = max(dot(normal, lightDir1), 0.0);
    float diffuse2 = max(dot(normal, lightDir2), 0.0);
    float diffuse = diffuse1 * 0.55 + diffuse2 * 0.2;

    // Specular (Blinn-Phong)
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir1 + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);

    // Fresnel rim
    float fresnel = pow(1.0 - z, 3.0) * 0.15;

    // Edge darkening (stronger for Speck-like depth)
    float edgeFactor = mix(0.7, 1.0, z);

    vec3 color = vColor * (ambient + diffuse) * edgeFactor
               + vec3(1.0) * spec * 0.3
               + vec3(0.15) * fresnel;
    float finalOpacity = uOpacity;
    if (uUsePerAtomOverrides == 1) {
      finalOpacity *= vOpacityOverride;
    }
    fragColor = vec4(color, finalOpacity);
  }
`;

export const bondVertexShader = /* glsl */ `precision highp float;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uBondScaleMultiplier;
  uniform sampler2D uPositionTex;
  uniform int uPositionTexWidth;

  in vec3 position;
  in vec2 uv;

  in float instanceAtomA;
  in float instanceAtomB;
  in float instanceOffsetX;
  in float instanceOffsetY;
  in vec3 instanceColor;
  in float instanceRadius;
  in float instanceDashed;

  out vec3 vColor;
  out vec2 vCylUv;
  out float vDashed;

  vec3 getAtomPos(int idx) {
    int tx = idx % uPositionTexWidth;
    int ty = idx / uPositionTexWidth;
    return texelFetch(uPositionTex, ivec2(tx, ty), 0).rgb;
  }

  void main() {
    vColor = instanceColor;
    vCylUv = uv;
    vDashed = instanceDashed;

    int atomA = int(instanceAtomA + 0.5);
    int atomB = int(instanceAtomB + 0.5);
    vec3 posA = getAtomPos(atomA);
    vec3 posB = getAtomPos(atomB);

    vec3 start = posA;
    vec3 end = posB;

    // Apply perpendicular offset for double/triple/aromatic bonds
    if (instanceOffsetX != 0.0 || instanceOffsetY != 0.0) {
      vec3 bdir = normalize(posB - posA);
      vec3 perpX = cross(bdir, vec3(0.0, 1.0, 0.0));
      if (dot(perpX, perpX) < 0.001) {
        perpX = cross(bdir, vec3(1.0, 0.0, 0.0));
      }
      perpX = normalize(perpX);
      vec3 perpY = normalize(cross(bdir, perpX));
      vec3 offset = perpX * instanceOffsetX + perpY * instanceOffsetY;
      start += offset;
      end += offset;
    }

    vec4 viewStart = modelViewMatrix * vec4(start, 1.0);
    vec4 viewEnd = modelViewMatrix * vec4(end, 1.0);

    vec3 viewMid = (viewStart.xyz + viewEnd.xyz) * 0.5;
    vec3 axis = viewEnd.xyz - viewStart.xyz;
    float len = length(axis);
    vec3 dir = axis / max(len, 0.0001);

    vec3 side = normalize(cross(dir, vec3(0.0, 0.0, 1.0)));

    vec3 viewPos = viewMid
      + dir * (position.y * len * 0.5)
      + side * (position.x * instanceRadius * uBondScaleMultiplier);

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`;

export const bondFragmentShader = /* glsl */ `precision highp float;

  in vec3 vColor;
  in vec2 vCylUv;
  in float vDashed;

  uniform float uOpacity;

  out vec4 fragColor;

  void main() {
    // Dashed bond: discard alternate segments along bond length
    if (vDashed > 0.5) {
      if (sin(vCylUv.y * 30.0) < 0.0) discard;
    }

    float nx = vCylUv.x;
    float nz = sqrt(max(0.0, 1.0 - nx * nx));
    vec3 normal = vec3(nx, 0.0, nz);

    // Hemisphere ambient
    vec3 skyColor = vec3(0.87, 0.92, 1.0);
    vec3 groundColor = vec3(0.6, 0.47, 0.27);
    float hemiMix = normal.y * 0.5 + 0.5;
    vec3 ambient = mix(groundColor, skyColor, hemiMix) * 0.35;

    // Dual-light diffuse
    vec3 lightDir1 = normalize(vec3(0.5, 0.5, 1.0));
    vec3 lightDir2 = normalize(vec3(-0.3, 0.3, 0.8));
    float diffuse1 = max(dot(normal, lightDir1), 0.0);
    float diffuse2 = max(dot(normal, lightDir2), 0.0);
    float diffuse = diffuse1 * 0.55 + diffuse2 * 0.2;

    // Specular
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir1 + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);

    // Fresnel rim
    float fresnel = pow(1.0 - nz, 3.0) * 0.1;

    vec3 color = vColor * (ambient + diffuse)
               + vec3(1.0) * spec * 0.2
               + vec3(0.1) * fresnel;
    fragColor = vec4(color, uOpacity);
  }
`;

// ── Speck-style post-processing shaders ──────────────────────────────

/** Fullscreen triangle vertex shader (covers viewport with a single triangle). */
export const fullscreenVertexShader = /* glsl */ `precision highp float;

  out vec2 vUv;

  void main() {
    // Fullscreen triangle: vertices at (-1,-1), (3,-1), (-1,3)
    float x = -1.0 + float((gl_VertexID & 1) << 2);
    float y = -1.0 + float((gl_VertexID & 2) << 1);
    vUv = vec2(x, y) * 0.5 + 0.5;
    gl_Position = vec4(x, y, 0.0, 1.0);
  }
`;

/**
 * SSAO fragment shader (depth-only, hemisphere sampling).
 * Reconstructs view-space position from depth buffer and samples
 * neighboring depths to estimate ambient occlusion.
 */
export const ssaoFragmentShader = /* glsl */ `precision highp float;

  in vec2 vUv;

  uniform sampler2D uDepth;
  uniform vec2 uResolution;
  uniform float uNear;
  uniform float uFar;
  uniform float uAORadius;    // world-space AO radius
  uniform float uAOIntensity; // AO strength multiplier
  uniform int uIsOrtho;       // 1 = orthographic, 0 = perspective
  uniform float uOrthoHeight; // orthographic frustum height
  uniform float uFov;         // perspective FOV in radians

  out vec4 fragColor;

  // Convert depth buffer value to linear depth
  float linearizeDepth(float d) {
    if (uIsOrtho == 1) {
      return uNear + d * (uFar - uNear);
    }
    return (2.0 * uNear * uFar) / (uFar + uNear - (d * 2.0 - 1.0) * (uFar - uNear));
  }

  // Pseudo-random based on screen position
  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float depth = texture(uDepth, vUv).r;
    if (depth >= 1.0) {
      fragColor = vec4(1.0); // background: no occlusion
      return;
    }

    float linearD = linearizeDepth(depth);

    // Convert AO radius from world space to UV space
    float uvRadius;
    if (uIsOrtho == 1) {
      uvRadius = uAORadius / uOrthoHeight;
    } else {
      uvRadius = uAORadius / (linearD * tan(uFov * 0.5) * 2.0);
    }

    // Clamp radius in pixels to avoid artifacts
    float pixelRadius = uvRadius * uResolution.y;
    if (pixelRadius < 1.0) {
      fragColor = vec4(1.0);
      return;
    }
    uvRadius = min(uvRadius, 0.1); // cap maximum screen coverage

    float occlusion = 0.0;
    const int NUM_SAMPLES = 16;

    // Random rotation per pixel
    float angle = rand(vUv * uResolution) * 6.2831853;
    float ca = cos(angle);
    float sa = sin(angle);

    // Poisson-disk-like sampling pattern
    vec2 samples[16];
    samples[0]  = vec2(-0.94201624, -0.39906216);
    samples[1]  = vec2( 0.94558609, -0.76890725);
    samples[2]  = vec2(-0.09418410, -0.92938870);
    samples[3]  = vec2( 0.34495938,  0.29387760);
    samples[4]  = vec2(-0.91588581,  0.45771432);
    samples[5]  = vec2(-0.81544232, -0.87912464);
    samples[6]  = vec2(-0.38277543,  0.27676845);
    samples[7]  = vec2( 0.97484398,  0.75648379);
    samples[8]  = vec2( 0.44323325, -0.97511554);
    samples[9]  = vec2( 0.53742981, -0.47373420);
    samples[10] = vec2(-0.26496911, -0.41893023);
    samples[11] = vec2( 0.79197514,  0.19090188);
    samples[12] = vec2(-0.24188840,  0.99706507);
    samples[13] = vec2(-0.81409955,  0.91437590);
    samples[14] = vec2( 0.19984126,  0.78641367);
    samples[15] = vec2( 0.14383161, -0.14100790);

    for (int i = 0; i < NUM_SAMPLES; i++) {
      // Rotate sample
      vec2 s = samples[i];
      vec2 rotated = vec2(
        s.x * ca - s.y * sa,
        s.x * sa + s.y * ca
      );

      vec2 sampleUV = vUv + rotated * uvRadius;
      float sampleDepth = texture(uDepth, sampleUV).r;

      if (sampleDepth >= 1.0) continue; // background sample

      float sampleLinear = linearizeDepth(sampleDepth);
      float diff = linearD - sampleLinear;

      // Occlude if sample is in front (closer to camera) and within range
      float rangeCheck = smoothstep(0.0, 1.0, uAORadius / max(abs(diff), 0.001));
      occlusion += step(0.001, diff) * rangeCheck;
    }

    occlusion /= float(NUM_SAMPLES);
    float ao = 1.0 - occlusion * uAOIntensity;
    ao = clamp(ao, 0.0, 1.0);

    fragColor = vec4(ao, ao, ao, 1.0);
  }
`;

/** SSAO blur pass - separable Gaussian blur to smooth AO noise. */
export const ssaoBlurFragmentShader = /* glsl */ `precision highp float;

  in vec2 vUv;

  uniform sampler2D uAO;
  uniform sampler2D uDepth;
  uniform vec2 uDirection; // (1/w, 0) or (0, 1/h)

  out vec4 fragColor;

  void main() {
    float centerDepth = texture(uDepth, vUv).r;
    if (centerDepth >= 1.0) {
      fragColor = vec4(1.0);
      return;
    }

    float result = 0.0;
    float weightSum = 0.0;

    // 9-tap bilateral blur
    float weights[5];
    weights[0] = 0.227027;
    weights[1] = 0.194596;
    weights[2] = 0.121622;
    weights[3] = 0.054054;
    weights[4] = 0.016216;

    for (int i = -4; i <= 4; i++) {
      vec2 offset = uDirection * float(i);
      float sampleAO = texture(uAO, vUv + offset).r;
      float sampleDepth = texture(uDepth, vUv + offset).r;

      // Bilateral weight: reject samples with large depth discontinuity
      float depthDiff = abs(centerDepth - sampleDepth);
      float bilateral = step(depthDiff, 0.001);

      int idx = i < 0 ? -i : i;
      float w = weights[idx] * bilateral;
      result += sampleAO * w;
      weightSum += w;
    }

    result /= max(weightSum, 0.001);
    fragColor = vec4(result, result, result, 1.0);
  }
`;

/**
 * Speck-style composite shader.
 * Combines scene color with AO and applies depth-based outlines.
 */
export const speckCompositeFragmentShader = /* glsl */ `precision highp float;

  in vec2 vUv;

  uniform sampler2D uSceneColor;
  uniform sampler2D uSceneDepth;
  uniform sampler2D uAO;
  uniform vec2 uResolution;
  uniform float uBrightness;
  uniform float uOutlineStrength;

  out vec4 fragColor;

  void main() {
    vec4 sceneColor = texture(uSceneColor, vUv);
    float ao = texture(uAO, vUv).r;
    float depth = texture(uSceneDepth, vUv).r;

    vec3 color = sceneColor.rgb;

    // Depth-based outline (Speck-style)
    if (uOutlineStrength > 0.0 && sceneColor.a > 0.0) {
      vec2 texel = 1.0 / uResolution;
      float d0 = abs(texture(uSceneDepth, vUv + vec2(-texel.x, 0.0)).r - depth);
      float d1 = abs(texture(uSceneDepth, vUv + vec2( texel.x, 0.0)).r - depth);
      float d2 = abs(texture(uSceneDepth, vUv + vec2(0.0, -texel.y)).r - depth);
      float d3 = abs(texture(uSceneDepth, vUv + vec2(0.0,  texel.y)).r - depth);
      float d = max(max(d0, d1), max(d2, d3));
      color *= pow(1.0 - d, uOutlineStrength * 32.0);
    }

    // Apply AO with squared falloff (Speck-style)
    float shade = pow(ao, 2.0);

    // Apply brightness
    color = uBrightness * color * shade;

    // Preserve original alpha (background remains transparent)
    fragColor = vec4(color, sceneColor.a);
  }
`;
