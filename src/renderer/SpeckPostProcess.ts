/**
 * Speck-style post-processing pipeline.
 *
 * Adds screen-space ambient occlusion (SSAO) and depth-based outlines
 * inspired by https://github.com/wwwtyro/speck.
 *
 * Pipeline:
 *   1. Scene renders to an FBO with color + depth textures
 *   2. SSAO pass reads depth → produces AO texture
 *   3. Bilateral blur (horizontal + vertical) smooths AO noise
 *   4. Composite pass: color * AO * brightness + outline
 */

import * as THREE from "three";
import {
  fullscreenVertexShader,
  ssaoFragmentShader,
  ssaoBlurFragmentShader,
  speckCompositeFragmentShader,
} from "./shaders";

export interface SpeckParams {
  /** AO sampling radius in Angstroms. Default: 1.5 */
  aoRadius: number;
  /** AO strength multiplier (0 = off, 1 = normal, 2 = heavy). Default: 1.5 */
  aoIntensity: number;
  /** Scene brightness multiplier. Default: 1.0 */
  brightness: number;
  /** Outline strength (0 = off, 1 = strong). Default: 0.5 */
  outlineStrength: number;
}

export const DEFAULT_SPECK_PARAMS: SpeckParams = {
  aoRadius: 1.5,
  aoIntensity: 1.5,
  brightness: 1.0,
  outlineStrength: 0.5,
};

export class SpeckPostProcess {
  private renderer: THREE.WebGLRenderer;

  // Render targets
  private sceneTarget: THREE.WebGLRenderTarget;
  private aoTarget: THREE.WebGLRenderTarget;
  private aoBlurTarget1: THREE.WebGLRenderTarget;
  private aoBlurTarget2: THREE.WebGLRenderTarget;

  // Materials
  private ssaoMaterial: THREE.RawShaderMaterial;
  private blurMaterial: THREE.RawShaderMaterial;
  private compositeMaterial: THREE.RawShaderMaterial;

  // Fullscreen rendering
  private fsScene: THREE.Scene;
  private fsCamera: THREE.Camera;
  private fsMesh: THREE.Mesh;

  // State
  private width = 1;
  private height = 1;
  params: SpeckParams;

  constructor(renderer: THREE.WebGLRenderer, params?: Partial<SpeckParams>) {
    this.renderer = renderer;
    this.params = { ...DEFAULT_SPECK_PARAMS, ...params };

    // Scene render target with depth texture
    const depthTexture = new THREE.DepthTexture(1, 1);
    depthTexture.type = THREE.UnsignedIntType;
    depthTexture.format = THREE.DepthFormat;

    this.sceneTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      type: THREE.UnsignedByteType,
      depthTexture,
    });

    // AO targets (half resolution for performance)
    this.aoTarget = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
      depthBuffer: false,
    });

    this.aoBlurTarget1 = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
      depthBuffer: false,
    });

    this.aoBlurTarget2 = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
      depthBuffer: false,
    });

    // SSAO material
    this.ssaoMaterial = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVertexShader,
      fragmentShader: ssaoFragmentShader,
      uniforms: {
        uDepth: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uNear: { value: 0.1 },
        uFar: { value: 1000 },
        uAORadius: { value: this.params.aoRadius },
        uAOIntensity: { value: this.params.aoIntensity },
        uIsOrtho: { value: 1 },
        uOrthoHeight: { value: 50 },
        uFov: { value: 0.87 },
      },
      depthTest: false,
      depthWrite: false,
    });

    // Blur material
    this.blurMaterial = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVertexShader,
      fragmentShader: ssaoBlurFragmentShader,
      uniforms: {
        uAO: { value: null },
        uDepth: { value: null },
        uDirection: { value: new THREE.Vector2(1, 0) },
      },
      depthTest: false,
      depthWrite: false,
    });

    // Composite material
    this.compositeMaterial = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: fullscreenVertexShader,
      fragmentShader: speckCompositeFragmentShader,
      uniforms: {
        uSceneColor: { value: null },
        uSceneDepth: { value: null },
        uAO: { value: null },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uBrightness: { value: this.params.brightness },
        uOutlineStrength: { value: this.params.outlineStrength },
      },
      depthTest: false,
      depthWrite: false,
    });

    // Fullscreen triangle setup
    this.fsCamera = new THREE.Camera();
    this.fsScene = new THREE.Scene();
    const fsGeo = new THREE.BufferGeometry();
    fsGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3),
    );
    this.fsMesh = new THREE.Mesh(fsGeo, this.ssaoMaterial);
    this.fsMesh.frustumCulled = false;
    this.fsScene.add(this.fsMesh);
  }

  /** Resize all render targets to match the renderer size. */
  setSize(width: number, height: number): void {
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;

    this.sceneTarget.setSize(width, height);

    // AO at half resolution for performance
    const aoW = Math.max(1, Math.floor(width / 2));
    const aoH = Math.max(1, Math.floor(height / 2));
    this.aoTarget.setSize(aoW, aoH);
    this.aoBlurTarget1.setSize(aoW, aoH);
    this.aoBlurTarget2.setSize(aoW, aoH);
  }

  /** Update AO/display parameters. */
  setParams(params: Partial<SpeckParams>): void {
    Object.assign(this.params, params);
    this.ssaoMaterial.uniforms.uAORadius.value = this.params.aoRadius;
    this.ssaoMaterial.uniforms.uAOIntensity.value = this.params.aoIntensity;
    this.compositeMaterial.uniforms.uBrightness.value = this.params.brightness;
    this.compositeMaterial.uniforms.uOutlineStrength.value =
      this.params.outlineStrength;
  }

  /**
   * Render the scene with Speck-style post-processing.
   * Call this instead of renderer.render(scene, camera).
   */
  render(
    scene: THREE.Scene,
    camera: THREE.OrthographicCamera | THREE.PerspectiveCamera,
  ): void {
    const dpr = this.renderer.getPixelRatio();
    const size = new THREE.Vector2();
    this.renderer.getSize(size);
    const w = Math.floor(size.x * dpr);
    const h = Math.floor(size.y * dpr);
    this.setSize(w, h);

    // Update camera-dependent uniforms
    if (camera instanceof THREE.OrthographicCamera) {
      this.ssaoMaterial.uniforms.uIsOrtho.value = 1;
      const frustumH =
        (camera.top - camera.bottom) / camera.zoom;
      this.ssaoMaterial.uniforms.uOrthoHeight.value = frustumH;
      this.ssaoMaterial.uniforms.uNear.value = camera.near;
      this.ssaoMaterial.uniforms.uFar.value = camera.far;
    } else {
      this.ssaoMaterial.uniforms.uIsOrtho.value = 0;
      this.ssaoMaterial.uniforms.uFov.value =
        (camera.fov * Math.PI) / 180;
      this.ssaoMaterial.uniforms.uNear.value = camera.near;
      this.ssaoMaterial.uniforms.uFar.value = camera.far;
    }

    // 1. Render scene to FBO
    this.renderer.setRenderTarget(this.sceneTarget);
    this.renderer.clear();
    this.renderer.render(scene, camera);

    // 2. SSAO pass
    const aoW = this.aoTarget.width;
    const aoH = this.aoTarget.height;

    this.ssaoMaterial.uniforms.uDepth.value =
      this.sceneTarget.depthTexture;
    this.ssaoMaterial.uniforms.uResolution.value.set(aoW, aoH);

    this.fsMesh.material = this.ssaoMaterial;
    this.renderer.setRenderTarget(this.aoTarget);
    this.renderer.clear();
    this.renderer.render(this.fsScene, this.fsCamera);

    // 3. Bilateral blur (horizontal)
    this.blurMaterial.uniforms.uAO.value = this.aoTarget.texture;
    this.blurMaterial.uniforms.uDepth.value =
      this.sceneTarget.depthTexture;
    this.blurMaterial.uniforms.uDirection.value.set(1.0 / aoW, 0);

    this.fsMesh.material = this.blurMaterial;
    this.renderer.setRenderTarget(this.aoBlurTarget1);
    this.renderer.clear();
    this.renderer.render(this.fsScene, this.fsCamera);

    // 4. Bilateral blur (vertical)
    this.blurMaterial.uniforms.uAO.value = this.aoBlurTarget1.texture;
    this.blurMaterial.uniforms.uDirection.value.set(0, 1.0 / aoH);

    this.renderer.setRenderTarget(this.aoBlurTarget2);
    this.renderer.clear();
    this.renderer.render(this.fsScene, this.fsCamera);

    // 5. Composite pass (output to screen)
    this.compositeMaterial.uniforms.uSceneColor.value =
      this.sceneTarget.texture;
    this.compositeMaterial.uniforms.uSceneDepth.value =
      this.sceneTarget.depthTexture;
    this.compositeMaterial.uniforms.uAO.value =
      this.aoBlurTarget2.texture;
    this.compositeMaterial.uniforms.uResolution.value.set(w, h);

    this.fsMesh.material = this.compositeMaterial;
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.fsScene, this.fsCamera);
  }

  dispose(): void {
    this.sceneTarget.dispose();
    this.aoTarget.dispose();
    this.aoBlurTarget1.dispose();
    this.aoBlurTarget2.dispose();
    this.ssaoMaterial.dispose();
    this.blurMaterial.dispose();
    this.compositeMaterial.dispose();
    this.fsMesh.geometry.dispose();
  }
}
