/**
 * Shared geometry for the absolutely-positioned overlays MeganeViewer stacks
 * on top of the Viewport.
 *
 * These live in their own module rather than on the components that consume
 * them so that MeganeViewer can name the values at its call sites without
 * importing from a component a test may have mocked.
 */

/**
 * Corner inset every overlay sits at when nothing precedes it — the padding
 * used by the Reset View button, the measurement panels, and the Sidebar.
 */
export const OVERLAY_INSET = 12;

/**
 * Default `left` for the perf HUD: clears the Reset View button, which spans
 * roughly x = 12 … 85 at the viewer's top-left corner. Hosts that hide that
 * button pass {@link OVERLAY_INSET} instead so the HUD takes the vacated slot.
 */
export const PERF_HUD_LEFT_DEFAULT = 92;

/**
 * Default `bottom` for the measurement panels: clears the Timeline strip
 * anchored at bottom: 0. Hosts that hide the Timeline pass
 * {@link OVERLAY_INSET} so the panels don't float above an empty band.
 */
export const MEASUREMENT_BOTTOM_DEFAULT = 60;
