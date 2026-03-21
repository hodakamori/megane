/**
 * Types for the documentation gallery.
 *
 * Each GalleryExample defines a visualization example shown in the gallery page.
 * The registry (registry.ts) is the single source of truth — add a new entry there
 * to make a new example appear automatically.
 */

export interface GalleryCode {
  /** Python code for Jupyter notebook */
  jupyter: string;
  /** TSX code showing PipelineViewer usage */
  react: string;
  /** megane.json content (SerializedPipeline JSON for VSCode extension) */
  vscode: string;
}

export interface GalleryExample {
  /** Unique identifier, used as HTML anchor */
  id: string;
  /** Display title */
  title: string;
  /** Short description of what the example shows */
  description: string;
  /** Categorization tags (e.g. "protein", "trajectory", "filter") */
  tags: string[];
  /** URL to snapshot JSON for the 3D preview (served from docs/public/) */
  snapshotUrl: string;
  /** Height of the 3D preview (CSS value, default: "380px") */
  height?: string;
  /** Platform-specific code snippets */
  code: GalleryCode;
}
