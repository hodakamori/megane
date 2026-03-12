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

    // ── Improved PBR-like lighting ──────────────────────────

    // IBL-approximated environment: warm sky gradient with cool ground bounce
    vec3 skyColor   = vec3(0.92, 0.95, 1.0);
    vec3 horizColor = vec3(0.85, 0.82, 0.78);
    vec3 groundColor = vec3(0.55, 0.50, 0.45);
    float hemiMix = normal.y * 0.5 + 0.5;
    // Smooth 3-stop gradient for richer ambient
    vec3 ambient = mix(groundColor, horizColor, smoothstep(0.0, 0.5, hemiMix));
    ambient = mix(ambient, skyColor, smoothstep(0.3, 1.0, hemiMix));
    ambient *= 0.45;

    // 3-point light setup (key / fill / rim)
    vec3 keyDir  = normalize(vec3(0.5, 0.5, 1.0));
    vec3 fillDir = normalize(vec3(-0.4, 0.3, 0.7));
    vec3 rimDir  = normalize(vec3(0.0, -0.5, -0.8));
    float keyDiffuse  = max(dot(normal, keyDir), 0.0);
    float fillDiffuse = max(dot(normal, fillDir), 0.0);
    float rimDiffuse  = max(dot(normal, rimDir), 0.0);

    // Wrap lighting for softer shadow transitions (subsurface-scatter approx)
    float wrapKey  = max((dot(normal, keyDir)  + 0.3) / 1.3, 0.0);
    float wrapFill = max((dot(normal, fillDir) + 0.3) / 1.3, 0.0);
    float diffuse = wrapKey * 0.55 + wrapFill * 0.2 + rimDiffuse * 0.08;

    // GGX-approximate specular (roughness ~0.3)
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(keyDir + viewDir);
    float NoH = max(dot(normal, halfDir), 0.0);
    float roughness = 0.3;
    float a2 = roughness * roughness;
    float denom = NoH * NoH * (a2 - 1.0) + 1.0;
    float D = a2 / (3.14159 * denom * denom);
    float spec = D * 0.25;

    // Secondary specular (fill light, broader)
    vec3 halfDir2 = normalize(fillDir + viewDir);
    float NoH2 = max(dot(normal, halfDir2), 0.0);
    float roughness2 = 0.5;
    float a2b = roughness2 * roughness2;
    float denom2 = NoH2 * NoH2 * (a2b - 1.0) + 1.0;
    float D2 = a2b / (3.14159 * denom2 * denom2);
    float spec2 = D2 * 0.08;

    // Fresnel (Schlick approximation) — reflective rim
    float NoV = max(dot(normal, viewDir), 0.0);
    float fresnel = pow(1.0 - NoV, 5.0) * 0.25;

    // Subtle edge darkening for contact shadow illusion
    float edgeFactor = mix(0.78, 1.0, smoothstep(0.0, 0.4, z));

    // Compose final color
    vec3 color = vColor * (ambient + diffuse) * edgeFactor
               + vec3(1.0) * (spec + spec2)
               + vec3(0.9, 0.93, 1.0) * fresnel;

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

    // ── Improved PBR-like lighting (matched to atom shader) ──

    // IBL-approximated environment gradient
    vec3 skyColor   = vec3(0.92, 0.95, 1.0);
    vec3 horizColor = vec3(0.85, 0.82, 0.78);
    vec3 groundColor = vec3(0.55, 0.50, 0.45);
    float hemiMix = normal.y * 0.5 + 0.5;
    vec3 ambient = mix(groundColor, horizColor, smoothstep(0.0, 0.5, hemiMix));
    ambient = mix(ambient, skyColor, smoothstep(0.3, 1.0, hemiMix));
    ambient *= 0.42;

    // 3-point light diffuse with wrap lighting
    vec3 keyDir  = normalize(vec3(0.5, 0.5, 1.0));
    vec3 fillDir = normalize(vec3(-0.4, 0.3, 0.7));
    float wrapKey  = max((dot(normal, keyDir)  + 0.3) / 1.3, 0.0);
    float wrapFill = max((dot(normal, fillDir) + 0.3) / 1.3, 0.0);
    float diffuse = wrapKey * 0.55 + wrapFill * 0.2;

    // GGX-approximate specular (slightly rougher than atoms)
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(keyDir + viewDir);
    float NoH = max(dot(normal, halfDir), 0.0);
    float roughness = 0.35;
    float a2 = roughness * roughness;
    float denom = NoH * NoH * (a2 - 1.0) + 1.0;
    float D = a2 / (3.14159 * denom * denom);
    float spec = D * 0.2;

    // Fresnel rim (Schlick)
    float NoV = max(dot(normal, viewDir), 0.0);
    float fresnel = pow(1.0 - NoV, 5.0) * 0.15;

    // Edge darkening
    float edgeFactor = mix(0.8, 1.0, smoothstep(0.0, 0.4, nz));

    vec3 color = vColor * (ambient + diffuse) * edgeFactor
               + vec3(1.0) * spec
               + vec3(0.9, 0.93, 1.0) * fresnel;
    fragColor = vec4(color, uOpacity);
  }
`;

