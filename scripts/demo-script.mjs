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
  prompt: "Show the protein as cartoon colored by chain",
  // Pipeline scroll-through (TB layout): zoom level + linear scroll duration.
  pipelineScrollScale: 1.6,
  pipelineScrollMs: 4800,
};

export const scenes = [
  // 1. Whole app — let the viewer take in the full UI.
  { id: "overview", zoom: "full", hold: 2200 },

  // 2. Go straight from the full view into the Chat input, type, and submit.
  {
    id: "chat-input",
    zoom: { sel: 'textarea[placeholder="Describe the pipeline you want..."]', scale: 2.2 },
    transitionMs: 950,
    action: "askChat",
    hold: 600,
  },

  // 3. Move up to the chat messages area to watch the response generate
  //    (anchored low so the streaming reply, which auto-scrolls down, stays in
  //    frame). With a live LLM this records the real generation; without one it
  //    just dwells on the typed prompt. Output may vary.
  {
    id: "chat-generate",
    zoom: { sel: '[data-testid="pipeline-chat-messages"]', scale: 1.7, anchorY: 0.72 },
    transitionMs: 900,
    action: "waitGenerate",
    hold: 1500,
  },

  // 4. Once generation completes, move over to the 3D molecule view and rotate.
  {
    id: "molecule",
    zoom: { sel: '[data-testid="viewer-root"]', scale: 1.5 },
    transitionMs: 1200,
    action: "rotate",
    hold: 1500,
  },

  // 5. Show the whole pipeline (Editor tab fitView), then scroll it top→bottom
  //    so every node passes through in order. The verb drives its own zoom, so
  //    the scene zoom is "keep".
  {
    id: "pipeline",
    zoom: "keep",
    action: "showAndScrollPipeline",
    actionFirst: true,
    hold: 1500,
  },
];
