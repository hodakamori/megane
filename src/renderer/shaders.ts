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

    // Edge darkening
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
  in vec3 instanceColorA;
  in vec3 instanceColorB;
  in float instanceRadius;
  in float instanceDashed;
  in float instanceBondOpacity;

  out vec3 vColorA;
  out vec3 vColorB;
  out vec2 vCylUv;
  out float vDashed;
  out float vBondOpacity;
  // View-space cylinder frame, used by the fragment shader to reconstruct the
  // surface point and write a correct gl_FragDepth (so the cylinder bulges
  // toward the camera and joins the atom spheres without a visible seam).
  out vec3 vViewMid;
  out vec3 vAxisDir;
  out vec3 vSideDir;
  out float vRadius;
  out float vHalfLen;

  vec3 getAtomPos(int idx) {
    int tx = idx % uPositionTexWidth;
    int ty = idx / uPositionTexWidth;
    return texelFetch(uPositionTex, ivec2(tx, ty), 0).rgb;
  }

  void main() {
    vColorA = instanceColorA;
    vColorB = instanceColorB;
    vCylUv = uv;
    vDashed = instanceDashed;
    vBondOpacity = instanceBondOpacity;

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

    float radius = instanceRadius * uBondScaleMultiplier;

    // Expose the view-space cylinder frame to the fragment shader.
    vViewMid = viewMid;
    vAxisDir = dir;
    vSideDir = side;
    vRadius = radius;
    vHalfLen = len * 0.5;

    vec3 viewPos = viewMid
      + dir * (position.y * len * 0.5)
      + side * (position.x * radius);

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`;

export const bondFragmentShader = /* glsl */ `precision highp float;

  in vec3 vColorA;
  in vec3 vColorB;
  in vec2 vCylUv;
  in float vDashed;
  in float vBondOpacity;
  in vec3 vViewMid;
  in vec3 vAxisDir;
  in vec3 vSideDir;
  in float vRadius;
  in float vHalfLen;

  uniform mat4 projectionMatrix;
  uniform float uOpacity;
  uniform int uUsePerBondOverrides;

  out vec4 fragColor;

  void main() {
    // Dashed bond: discard alternate segments along bond length
    if (vDashed > 0.5) {
      if (sin(vCylUv.y * 30.0) < 0.0) discard;
    }

    // vCylUv.y runs from -1 at atom A to +1 at atom B; split the bond at its
    // midpoint so each half takes its endpoint atom's color.
    vec3 baseColor = vCylUv.y < 0.0 ? vColorA : vColorB;

    float nx = vCylUv.x;
    float nz = sqrt(max(0.0, 1.0 - nx * nx));
    vec3 normal = vec3(nx, 0.0, nz);

    // Reconstruct the cylinder surface point in view space and write a correct
    // depth, mirroring the atom shader. Without this the cylinder sits on the
    // flat billboard plane while spheres bulge toward the camera, producing a
    // hard seam at the sphere/cylinder joint. (0,0,1) is the view-space camera
    // direction, matching the side vector chosen in the vertex shader.
    vec3 axisPoint = vViewMid + vAxisDir * (vCylUv.y * vHalfLen);
    vec3 surfaceViewPos = axisPoint
      + vSideDir * (nx * vRadius)
      + vec3(0.0, 0.0, 1.0) * (nz * vRadius);
    vec4 clipPos = projectionMatrix * vec4(surfaceViewPos, 1.0);
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
    float fresnel = pow(1.0 - nz, 3.0) * 0.15;

    // Edge darkening (unified with the atom shader so the joint matches)
    float edgeFactor = mix(0.7, 1.0, nz);

    vec3 color = baseColor * (ambient + diffuse) * edgeFactor
               + vec3(1.0) * spec * 0.3
               + vec3(0.15) * fresnel;
    float finalOpacity = uOpacity;
    if (uUsePerBondOverrides == 1) {
      finalOpacity *= vBondOpacity;
    }
    fragColor = vec4(color, finalOpacity);
  }
`;
