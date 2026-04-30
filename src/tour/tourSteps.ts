/**
 * Step definitions for the megane first-time user tour.
 *
 * Targets reference DOM nodes that already exist in the shared MeganeViewer:
 *  - [data-tour-anchor="viewport"]   — invisible region inside Viewport.tsx
 *                                      so we highlight just the canvas area,
 *                                      not the whole view (which would also
 *                                      include the Pipeline panel)
 *  - [data-testid="panel-pipeline"]  — CollapsiblePanel for PipelineEditor
 *  - [data-testid="pipeline-editor-templates"] — Templates button
 *
 * The final two steps are unattached modals (no `element`); driver.js renders
 * them centred so they work on every host even when no anchor is present.
 */
import type { DriveStep } from "driver.js";

const REPO_URL = "https://github.com/hodakamori/megane";
const DOCS_URL = "https://github.com/hodakamori/megane#readme";

const ICON_GITHUB = `
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path fill="currentColor" d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1.17-.02-2.13-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.16 1.17a10.99 10.99 0 0 1 5.76 0c2.2-1.48 3.16-1.17 3.16-1.17.62 1.57.23 2.73.11 3.02.74.8 1.18 1.82 1.18 3.07 0 4.4-2.7 5.36-5.27 5.65.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.55C20.71 21.4 24 17.1 24 12.02 24 5.74 18.77.5 12.5.5h-.5Z"/>
  </svg>`;

const ICON_DOCS = `
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 18.5v-14Z"/>
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>
    <path d="M8 7h8"/>
    <path d="M8 11h6"/>
  </svg>`;

const ICON_ARROW = `
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="13 6 19 12 13 18"/>
  </svg>`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linkCard(opts: {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  hostLabel: string;
}): string {
  const safeHref = escapeHtml(opts.href);
  return `
    <a class="megane-tour-link-card" href="${safeHref}" target="_blank" rel="noopener noreferrer">
      <span class="megane-tour-link-card-icon">${opts.icon}</span>
      <span class="megane-tour-link-card-body">
        <span class="megane-tour-link-card-title">${escapeHtml(opts.title)}</span>
        <span class="megane-tour-link-card-subtitle">${escapeHtml(opts.subtitle)}</span>
        <span class="megane-tour-link-card-host">${escapeHtml(opts.hostLabel)}</span>
      </span>
      <span class="megane-tour-link-card-arrow">${ICON_ARROW}</span>
    </a>`;
}

export function buildTourSteps(): DriveStep[] {
  return [
    {
      element: '[data-tour-anchor="viewport"]',
      popover: {
        title: "3D Viewport",
        description:
          "Atoms, bonds, cells and trajectories all draw here. Use the mouse to orbit, pan, and zoom around your structure.",
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
          <p class="megane-tour-links-intro">Explore the source code or read the full documentation.</p>
          <div class="megane-tour-links">
            ${linkCard({
              href: REPO_URL,
              icon: ICON_GITHUB,
              title: "GitHub repository",
              subtitle: "Source, issues and releases",
              hostLabel: "github.com",
            })}
            ${linkCard({
              href: DOCS_URL,
              icon: ICON_DOCS,
              title: "Documentation",
              subtitle: "Guides, examples and API reference",
              hostLabel: "github.com",
            })}
          </div>`,
        side: "over",
        align: "center",
      },
    },
  ];
}
