/**
 * Step definitions for the megane first-time user tour.
 *
 * Targets reference DOM nodes that already exist in the shared MeganeViewer:
 *  - viewer-root      (Viewport.tsx)
 *  - panel-pipeline   (CollapsiblePanel for PipelineEditor)
 *  - pipeline-editor-templates (Templates button in PipelineEditor headerExtra)
 *
 * The final two steps are unattached modals (no `element`); driver.js renders
 * them centred so they work on every host even when no anchor is present.
 */
import type { DriveStep } from "driver.js";

const REPO_URL = "https://github.com/hodakamori/megane";
const DOCS_URL = "https://github.com/hodakamori/megane#readme";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkRow(label: string, url: string): string {
  const safeUrl = escapeHtml(url);
  const safeLabel = escapeHtml(label);
  return `
    <div class="megane-tour-link-row">
      <div class="megane-tour-link-label">${safeLabel}</div>
      <a class="megane-tour-link" href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeUrl}</a>
    </div>`;
}

export function buildTourSteps(): DriveStep[] {
  return [
    {
      element: '[data-testid="viewer-root"]',
      popover: {
        title: "3D Viewport",
        description:
          "This is where structures are rendered. Atoms, bonds, cells and trajectories all draw here.",
        side: "right",
        align: "center",
      },
    },
    {
      element: '[data-testid="panel-pipeline"]',
      popover: {
        title: "Pipeline",
        description:
          "Build a rendering pipeline by connecting nodes: load files, apply bonds, attach trajectories, and choose a visual style.",
        side: "left",
        align: "start",
      },
    },
    {
      element: '[data-testid="pipeline-editor-templates"]',
      popover: {
        title: "Templates",
        description:
          "Pick a starter pipeline (molecule, solid, streaming) to see a working setup in one click.",
        side: "bottom",
        align: "end",
      },
    },
    {
      popover: {
        title: "Mouse Controls",
        description: `
          <ul class="megane-tour-keys">
            <li><span class="megane-tour-key">Left&nbsp;drag</span> Rotate the camera</li>
            <li><span class="megane-tour-key">Right&nbsp;drag</span> Pan</li>
            <li><span class="megane-tour-key">Wheel</span> Zoom</li>
            <li><span class="megane-tour-key">Right&nbsp;click</span> Pick an atom for measurement</li>
          </ul>`,
        side: "over",
        align: "center",
      },
    },
    {
      popover: {
        title: "Learn More",
        description: `
          <div class="megane-tour-links">
            ${linkRow("GitHub repository", REPO_URL)}
            ${linkRow("Documentation", DOCS_URL)}
          </div>`,
        side: "over",
        align: "center",
      },
    },
  ];
}
