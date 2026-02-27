/**
 * GLSL 3.0 ES shaders for billboard impostor rendering.
 *
 * Atom shader: screen-aligned quad + ray-sphere intersection in fragment
 *              → pixel-perfect spheres with correct depth.
 * Bond shader: screen-aligned quad between two endpoints
 *              → cylinder-like shading.
 *
 * RawShaderMaterial requires explicit uniform/attribute declarations.
 */

export const atomVertexShader = /* glsl */ `#version 300 es
  precision highp float;

  // Three.js built-in uniforms (must declare explicitly for RawShaderMaterial)
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  // Per-vertex (quad corners)
  in vec3 position;

  // Per-instance
  in vec3 instanceCenter;
  in float instanceRadius;
  in vec3 instanceColor;

  out vec3 vColor;
  out vec2 vUv;
  out float vRadius;
  out vec3 vViewCenter;

  void main() {
    vColor = instanceColor;
    vUv = position.xy;
    vRadius = instanceRadius;

    vec4 viewCenter = modelViewMatrix * vec4(instanceCenter, 1.0);
    vViewCenter = viewCenter.xyz;

    vec3 viewPos = viewCenter.xyz;
    viewPos.xy += position.xy * instanceRadius;

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`;

export const atomFragmentShader = /* glsl */ `#version 300 es
  precision highp float;

  in vec3 vColor;
  in vec2 vUv;
  in float vRadius;
  in vec3 vViewCenter;

  uniform mat4 projectionMatrix;

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

    // Blinn-Phong
    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float ambient = 0.35;

    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 40.0);

    vec3 color = vColor * (ambient + diffuse * 0.65) + vec3(1.0) * spec * 0.3;
    fragColor = vec4(color, 1.0);
  }
`;

export const bondVertexShader = /* glsl */ `#version 300 es
  precision highp float;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  in vec3 position;
  in vec2 uv;

  in vec3 instanceStart;
  in vec3 instanceEnd;
  in vec3 instanceColor;
  in float instanceRadius;

  out vec3 vColor;
  out vec2 vCylUv;

  void main() {
    vColor = instanceColor;
    vCylUv = uv;

    vec4 viewStart = modelViewMatrix * vec4(instanceStart, 1.0);
    vec4 viewEnd = modelViewMatrix * vec4(instanceEnd, 1.0);

    vec3 viewMid = (viewStart.xyz + viewEnd.xyz) * 0.5;
    vec3 axis = viewEnd.xyz - viewStart.xyz;
    float len = length(axis);
    vec3 dir = axis / max(len, 0.0001);

    vec3 side = normalize(cross(dir, vec3(0.0, 0.0, 1.0)));

    vec3 viewPos = viewMid
      + dir * (position.y * len * 0.5)
      + side * (position.x * instanceRadius);

    gl_Position = projectionMatrix * vec4(viewPos, 1.0);
  }
`;

export const bondFragmentShader = /* glsl */ `#version 300 es
  precision highp float;

  in vec3 vColor;
  in vec2 vCylUv;

  out vec4 fragColor;

  void main() {
    float nx = vCylUv.x;
    float nz = sqrt(max(0.0, 1.0 - nx * nx));
    vec3 normal = vec3(nx, 0.0, nz);

    vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float ambient = 0.35;

    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 40.0);

    vec3 color = vColor * (ambient + diffuse * 0.65) + vec3(1.0) * spec * 0.2;
    fragColor = vec4(color, 1.0);
  }
`;
