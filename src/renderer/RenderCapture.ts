/**
 * Capture utilities for exporting the viewport as images or video.
 */

import type { MoleculeRenderer } from "./MoleculeRenderer";

/** Composite WebGL canvas and label overlay onto an offscreen canvas. */
export function compositeCanvases(
  webglCanvas: HTMLCanvasElement,
  labelCanvas: HTMLCanvasElement | null,
  width: number,
  height: number,
): HTMLCanvasElement {
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext("2d")!;
  ctx.drawImage(webglCanvas, 0, 0, width, height);
  if (labelCanvas) {
    ctx.drawImage(labelCanvas, 0, 0, width, height);
  }
  return offscreen;
}

/** Convert canvas to Blob (promisified). */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType = "image/png",
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      mimeType,
      quality,
    );
  });
}

/** Trigger a file download from a Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Wrap a PNG image as an EPS file with embedded raster data. */
export async function wrapInEPS(pngBlob: Blob, width: number, height: number): Promise<Blob> {
  // Convert PNG to raw RGB pixel data via canvas
  const img = await createImageBitmap(pngBlob);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Convert RGBA to hex RGB string
  const hexLines: string[] = [];
  let line = "";
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i].toString(16).padStart(2, "0");
    const g = pixels[i + 1].toString(16).padStart(2, "0");
    const b = pixels[i + 2].toString(16).padStart(2, "0");
    line += r + g + b;
    if (line.length >= 72) {
      hexLines.push(line);
      line = "";
    }
  }
  if (line) hexLines.push(line);

  const eps = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 ${width} ${height}
%%Title: megane export
%%Creator: megane molecular viewer
%%EndComments
gsave
${width} ${height} scale
${width} ${height} 8 [${width} 0 0 -${height} 0 ${height}]
{currentfile ${width * 3} string readhexstring pop} false 3 colorimage
${hexLines.join("\n")}
grestore
showpage
%%EOF
`;

  return new Blob([eps], { type: "application/postscript" });
}

/** Capture a single snapshot from the renderer. */
export async function captureSnapshot(
  renderer: MoleculeRenderer,
  options: {
    width: number;
    height: number;
    transparent: boolean;
    format: "png" | "eps";
  },
): Promise<Blob> {
  const { width, height, transparent, format } = options;
  const scene = renderer.getScene();
  const webglRenderer = renderer.getRenderer();

  // Save state
  const savedBg = scene.background;
  const savedClearAlpha = webglRenderer.getClearAlpha();

  // Apply transparent background if requested
  if (transparent) {
    scene.background = null;
    webglRenderer.setClearColor(0x000000, 0);
  }

  // Resize for capture
  const restore = renderer.resizeForCapture(width, height);

  // Render single frame
  renderer.renderSingleFrame();

  // Composite canvases
  const webglCanvas = renderer.getCanvas()!;
  const labelOverlay = renderer.getLabelOverlay();
  const labelCanvas = labelOverlay?.getCanvas() ?? null;
  const composited = compositeCanvases(webglCanvas, labelCanvas, width, height);

  // Restore state
  scene.background = savedBg;
  webglRenderer.setClearColor(0xffffff, savedClearAlpha);
  restore();
  renderer.renderSingleFrame();

  // Export
  const pngBlob = await canvasToBlob(composited, "image/png");
  if (format === "eps") {
    return wrapInEPS(pngBlob, width, height);
  }
  return pngBlob;
}

/** Capture animation frames as GIF using gif.js. */
export async function captureGif(
  renderer: MoleculeRenderer,
  options: {
    width: number;
    height: number;
    transparent: boolean;
    startFrame: number;
    endFrame: number;
    fps: number;
    seekFrame: (frame: number) => void;
    onProgress?: (progress: number) => void;
  },
): Promise<Blob> {
  const { width, height, transparent, startFrame, endFrame, fps, seekFrame, onProgress } = options;
  const totalFrames = endFrame - startFrame + 1;
  const delay = Math.round(1000 / fps);

  const scene = renderer.getScene();
  const webglRenderer = renderer.getRenderer();

  // Save state
  const savedBg = scene.background;
  const savedClearAlpha = webglRenderer.getClearAlpha();

  if (transparent) {
    scene.background = null;
    webglRenderer.setClearColor(0x000000, 0);
  }

  const restore = renderer.resizeForCapture(width, height);

  // Dynamically import gif.js
  const GIF = (await import("gif.js")).default;
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width,
    height,
    workerScript: new URL("gif.js/dist/gif.worker.js", import.meta.url).href,
  });

  // Capture each frame
  for (let i = startFrame; i <= endFrame; i++) {
    seekFrame(i);
    // Wait for render
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    renderer.renderSingleFrame();

    const webglCanvas = renderer.getCanvas()!;
    const labelOverlay = renderer.getLabelOverlay();
    const labelCanvas = labelOverlay?.getCanvas() ?? null;
    const composited = compositeCanvases(webglCanvas, labelCanvas, width, height);

    gif.addFrame(composited, { delay, copy: true });
    onProgress?.(((i - startFrame + 1) / totalFrames) * 0.8);
  }

  // Restore
  scene.background = savedBg;
  webglRenderer.setClearColor(0xffffff, savedClearAlpha);
  restore();
  renderer.renderSingleFrame();

  // Render GIF
  return new Promise((resolve, _reject) => {
    gif.on("finished", (blob: Blob) => {
      onProgress?.(1);
      resolve(blob);
    });
    gif.on("progress", (p: number) => {
      onProgress?.(0.8 + p * 0.2);
    });
    gif.render();
  });
}

/** Capture animation frames as MP4/WebM using MediaRecorder. */
export async function captureVideo(
  renderer: MoleculeRenderer,
  options: {
    width: number;
    height: number;
    transparent: boolean;
    startFrame: number;
    endFrame: number;
    fps: number;
    seekFrame: (frame: number) => void;
    onProgress?: (progress: number) => void;
  },
): Promise<Blob> {
  const { width, height, transparent, startFrame, endFrame, fps, seekFrame, onProgress } = options;
  const totalFrames = endFrame - startFrame + 1;

  const scene = renderer.getScene();
  const webglRenderer = renderer.getRenderer();

  const savedBg = scene.background;
  const savedClearAlpha = webglRenderer.getClearAlpha();

  if (transparent) {
    scene.background = null;
    webglRenderer.setClearColor(0x000000, 0);
  }

  const restore = renderer.resizeForCapture(width, height);

  // Create a recording canvas
  const recordCanvas = document.createElement("canvas");
  recordCanvas.width = width;
  recordCanvas.height = height;
  const recordCtx = recordCanvas.getContext("2d")!;

  // Setup MediaRecorder
  const stream = recordCanvas.captureStream(0);
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8_000_000,
  });
  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.start();

  const frameDelay = 1000 / fps;

  // Capture each frame
  for (let i = startFrame; i <= endFrame; i++) {
    seekFrame(i);
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    renderer.renderSingleFrame();

    const webglCanvas = renderer.getCanvas()!;
    const labelOverlay = renderer.getLabelOverlay();
    const labelCanvas = labelOverlay?.getCanvas() ?? null;

    recordCtx.clearRect(0, 0, width, height);
    recordCtx.drawImage(webglCanvas, 0, 0, width, height);
    if (labelCanvas) {
      recordCtx.drawImage(labelCanvas, 0, 0, width, height);
    }

    // Request a frame from the capture stream
    const videoTrack = stream.getVideoTracks()[0] as MediaStreamTrack & {
      requestFrame?: () => void;
    };
    videoTrack.requestFrame?.();

    // Wait for frame duration
    await new Promise((r) => setTimeout(r, frameDelay));

    onProgress?.((i - startFrame + 1) / totalFrames);
  }

  // Stop recording
  mediaRecorder.stop();
  await new Promise<void>((resolve) => {
    mediaRecorder.onstop = () => resolve();
  });

  // Restore
  scene.background = savedBg;
  webglRenderer.setClearColor(0xffffff, savedClearAlpha);
  restore();
  renderer.renderSingleFrame();

  onProgress?.(1);
  return new Blob(chunks, { type: mimeType });
}
