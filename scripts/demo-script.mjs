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
  // Recorded entirely at the full (un-zoomed) view so the #root transform never
  // moves: ReactFlow then always measures node handles at identity and the
  // pipeline edges stay attached. Zoom/pan into each region in post.
  { id: "overview", zoom: "full", hold: 2500 },

  // Type the prompt into the Chat input.
  { id: "chat-input", zoom: "full", action: "typePrompt", hold: 1200 },

  // Submit and dwell while the reply streams in (output may vary).
  { id: "chat-generate", zoom: "full", action: "submitPrompt", hold: config.chatResponseHoldMs },

  // Rotate the molecule (its look reflects the applied pipeline).
  { id: "molecule", zoom: "full", action: "rotate", hold: 2500 },

  // Switch to the Editor tab to reveal the generated pipeline graph.
  { id: "pipeline", zoom: "full", action: "showPipeline", hold: 6000 },
];
