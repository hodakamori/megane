/**
 * Demo video script ("台本") for the megane app.
 *
 * This file is the editable storyboard. Tweak `config` and the `scenes`
 * array to change the demo — the director (`scripts/demo-video.mjs`)
 * interprets it and drives the live app while recording a webm.
 *
 * Flow captured by the default scenes:
 *   full screen → zoom the Chat panel + type a prompt → (live AI generate)
 *   → show the 3D molecule (slow rotate) → show the pipeline graph.
 *
 * Scene fields:
 *   id         unique label (also used for logging)
 *   zoom       "full" (reset to whole screen) | "keep" (keep current zoom)
 *              | { sel, pad?, scale?, anchorX?, anchorY? } — frame an element.
 *              With `scale` it zooms by that fixed factor; without it, fits the
 *              padded bbox to the viewport. `anchorX`/`anchorY` (0..1, default
 *              0.5) pick which point of the element maps to the viewport center
 *              — e.g. anchorY: 0.72 biases toward the lower (streaming) area.
 *   action     name of a director "verb" to run after the zoom settles
 *              (one of: openChatAndType | generate | rotate | showPipeline),
 *              or omit for a static hold
 *   actionFirst  run the action before zooming (use when the action reveals
 *                the zoom target, e.g. switching tabs to unhide .react-flow)
 *   hold       ms to dwell after the action, showcasing the state
 */

export const config = {
  width: 1920,
  height: 1080,
  dpr: 2, // render headroom so CSS-zoomed pixels stay crisp
  transitionMs: 900, // default zoom tween duration (CSS transition on #root)
  // The prompt typed into the Chat tab. Keep it short so it reads on screen.
  prompt: "Make the water molecules semi-transparent",
  // After submitting, dwell this long on the fixed chat frame (the screen does
  // not move) while the reply streams in and the response becomes readable.
  chatResponseHoldMs: 30000,
  // Pipeline scroll-through (TB layout). `pipelineWidthFraction` sizes the graph
  // to a fraction of the screen width (0.7 ≈ 70%); it overrides the fixed
  // `pipelineScrollScale` fallback. `pipelineScrollMs` is the linear scroll time.
  pipelineWidthFraction: 0.7,
  pipelineScrollScale: 1.6,
  pipelineScrollMs: 5200,
};

export const scenes = [
  // 1. Whole app — let the viewer take in the full UI.
  { id: "overview", zoom: "full", hold: 2200 },

  // 2. Go straight from the full view into the Chat input and type the prompt
  //    (submission happens in the next scene, after the camera has settled).
  {
    id: "chat-input",
    zoom: { sel: 'textarea[placeholder="Describe the pipeline you want..."]', scale: 2.2 },
    transitionMs: 950,
    action: "typePrompt",
    hold: 600,
  },

  // 3. Pull back to the full view (identity) and submit, then dwell ~30s while
  //    the reply streams in. This scene MUST stay unzoomed: the generated
  //    pipeline mounts here, and ReactFlow measures node handle positions via
  //    getBoundingClientRect — if a #root CSS zoom is active during that
  //    measurement, the handle coords are scaled wrong and the pipeline edges
  //    render detached from the nodes (and never re-measure). With identity the
  //    handles are correct, so the later full-screen pipeline zoom stays clean.
  {
    id: "chat-generate",
    zoom: "full",
    transitionMs: 1000,
    action: "submitPrompt",
    hold: config.chatResponseHoldMs, // ~30s fixed dwell
  },

  // 4. Once generation completes, move over to the 3D molecule view and rotate.
  {
    id: "molecule",
    zoom: { sel: '[data-testid="viewer-root"]', scale: 1.5 },
    transitionMs: 1200,
    action: "rotate",
    hold: 1500,
  },

  // 5. Zoom into the sidebar's "Pipeline"/Editor tab, click it on camera so the
  //    panel switches from Chat to the pipeline graph, then scroll the graph
  //    top→bottom (at ~70% screen width) to reveal its contents. The verb drives
  //    its own camera, so the scene zoom is "keep".
  {
    id: "pipeline",
    zoom: "keep",
    action: "clickPipelineTabAndScroll",
    hold: 1500,
  },
];
