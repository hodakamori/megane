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
 *              | { sel, pad?, scale? } — frame an element. With `scale` it zooms
 *              by that fixed factor centered on the element (use for full-height
 *              targets like the side panel, where fit-to-bbox would be ~1×);
 *              without `scale` it fits the padded bbox to the viewport.
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
  transitionMs: 900, // zoom tween duration (CSS transition on #root)
  // The prompt typed into the Chat tab. Keep it short so it reads on screen.
  prompt: "Show the protein as cartoon colored by chain",
};

export const scenes = [
  // 1. Whole app — let the viewer take in the full UI.
  { id: "overview", zoom: "full", hold: 2500 },

  // 2. Zoom into the Chat input (centered on the prompt box) and type a prompt.
  //    The panel is full-height, so use an explicit scale rather than fit.
  {
    id: "chat",
    zoom: { sel: 'textarea[placeholder="Describe the pipeline you want..."]', scale: 2.2 },
    action: "openChatAndType",
    hold: 1200,
  },

  // 3. Run the generation (live AI; output may vary). Stays zoomed on chat.
  { id: "generate", zoom: "keep", action: "generate", hold: 4000 },

  // 4. Zoom into the 3D viewport and slowly rotate the molecule.
  {
    id: "molecule",
    zoom: { sel: '[data-testid="viewer-root"]', scale: 1.5 },
    action: "rotate",
    hold: 1500,
  },

  // 5. Switch to the Editor tab first (unhides .react-flow), then zoom the graph.
  {
    id: "pipeline",
    zoom: { sel: ".react-flow", scale: 1.7 },
    action: "showPipeline",
    actionFirst: true,
    hold: 3000,
  },
];
