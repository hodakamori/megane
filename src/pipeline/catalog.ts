/**
 * Node catalog — the single source of truth for pipeline node *documentation*.
 *
 * `src/pipeline/types.ts` holds the structural metadata (ports, param shapes,
 * defaults, categories). This file adds the prose that used to be duplicated by
 * hand in the AI system prompt (`src/ai/prompt.ts`) and the docs
 * (`docs/docs/guide/pipeline/*.md`): the purpose description, per-parameter
 * documentation, and prompt-specific port annotations.
 *
 * Two consumers render from this catalog:
 *   - `renderNodeSchemaSection()` in `src/ai/prompt.ts` (the LLM node schema).
 *   - `scripts/generate-node-reference.mjs` (the docs Node Reference page).
 *
 * The explicit `Record<PipelineNodeType, NodeCatalogEntry>` annotation makes
 * adding a new node type without a catalog entry a compile error.
 *
 * NOTE: this module must stay runtime-dependency-free (it only imports types +
 * pure data from `./types`) so the docs generator can bundle it with esbuild
 * without pulling in Three.js / xyflow.
 */
import type { PipelineNodeType } from "./types";

/** Documentation for a single serialized parameter of a node. */
export interface ParamDoc {
  /** Serialized JSON key, e.g. `"bondSource"`. */
  jsonKey: string;
  /** Whether the key is optional in the serialized signature (`key?: T`). */
  optional?: boolean;
  /** Display type string used in the schema signature, e.g. `string | null`. */
  tsType: string;
  /** Default value display string for the docs table (omit if none). */
  default?: string;
  /** One-line description for the docs parameter table. */
  doc?: string;
}

export interface NodeCatalogEntry {
  /** Purpose prose. May span multiple lines (rendered verbatim in the prompt). */
  description: string;
  /** Structured parameter docs. Drives the inline signature + docs table. */
  params: ParamDoc[];
  /**
   * Verbatim fenced parameter block for the prompt, used instead of the derived
   * inline `{ ... }` signature. Only `polyhedron_generator` needs this because
   * its parameters carry inline `//` comments. The string is the block *body*
   * (between the ``` fences), already indented.
   */
  promptParamsFenced?: string;
  /**
   * Extra prompt sub-bullets rendered under the Parameters line as `  - <note>`.
   * Verbatim; an entry may contain embedded newlines for wrapped bullets.
   */
  promptNotes?: string[];
  /** Exact text after `- Inputs: ` in the prompt (omit when the node has no inputs). */
  promptInputs?: string;
  /** Exact text after `- Outputs: ` in the prompt (omit when the node has no outputs). */
  promptOutputs?: string;
  /** Whether this node is surfaced to the LLM. Only `streaming` is false. */
  inPrompt: boolean;
  /** Python class name in `python.megane`, or null when unavailable (surface_mesh). */
  pythonClass: string | null;
}

/**
 * Node catalog. Authoring order matches the prompt's node order; `streaming`
 * (which is not shown to the LLM) is placed last.
 *
 * The explicit `Record<PipelineNodeType, NodeCatalogEntry>` annotation forces an
 * entry for every node type — adding a node type without one is a compile error.
 */
export const NODE_CATALOG: Record<PipelineNodeType, NodeCatalogEntry> = {
  load_structure: {
    description: "Loads a molecular structure file. This is the primary data source.",
    params: [
      {
        jsonKey: "fileName",
        tsType: "string | null",
        default: "null",
        doc: "Path/name of the structure file.",
      },
      {
        jsonKey: "hasTrajectory",
        tsType: "boolean",
        default: "false",
        doc: "Whether the file carries multiple frames.",
      },
      {
        jsonKey: "hasCell",
        tsType: "boolean",
        default: "false",
        doc: "Whether the file carries a unit cell.",
      },
    ],
    promptOutputs: "`particle` (always), `trajectory` (if hasTrajectory), `cell` (if hasCell)",
    inPrompt: true,
    pythonClass: "LoadStructure",
  },
  load_trajectory: {
    description: "Loads trajectory data from an external file (e.g. XTC).",
    params: [
      {
        jsonKey: "fileName",
        tsType: "string | null",
        default: "null",
        doc: "Path/name of the trajectory file (XTC, DCD, NetCDF, LAMMPS dump).",
      },
    ],
    promptInputs: "`particle` (particle data type)",
    promptOutputs: "`trajectory` (trajectory data type)",
    inPrompt: true,
    pythonClass: "LoadTrajectory",
  },
  load_vector: {
    description: "Loads per-atom vector data (forces, velocities).",
    params: [
      {
        jsonKey: "fileName",
        tsType: "string | null",
        default: "null",
        doc: "Path/name of the per-atom vector file.",
      },
    ],
    promptOutputs: "`vector` (vector data type)",
    inPrompt: true,
    pythonClass: "LoadVector",
  },
  load_volumetric: {
    description:
      "Loads volumetric scalar-field data (e.g. a Gaussian/VASP CUBE file with\nelectron density or electrostatic potential).",
    params: [
      {
        jsonKey: "fileName",
        tsType: "string | null",
        default: "null",
        doc: "Path/name of the CUBE (volumetric) file.",
      },
    ],
    promptOutputs: "`volumetric` (volumetric data type)",
    inPrompt: true,
    pythonClass: "LoadVolumetric",
  },
  add_bond: {
    description: "Detects or infers bonds between atoms.",
    params: [
      {
        jsonKey: "bondSource",
        tsType: '"structure" | "file" | "distance" | "none"',
        default: '"distance"',
        doc: "How bonds are obtained.",
      },
    ],
    promptNotes: [
      '"structure": read bonds from structure file',
      '"distance": compute bonds by van der Waals distance',
      '"file": read bonds from separate file',
      '"none": no bonds',
    ],
    promptInputs: "`particle` (particle data type)",
    promptOutputs: "`bond` (bond data type)",
    inPrompt: true,
    pythonClass: "AddBonds",
  },
  filter: {
    description:
      'Filters atoms (and optionally bonds) by a selection query. See the\n"Atom & Bond Selection Query Language" section below for the full, authoritative\ngrammar — only the syntax documented there is supported.',
    params: [
      {
        jsonKey: "query",
        tsType: "string",
        default: '""',
        doc: "Atom selection query (see the selection language).",
      },
      {
        jsonKey: "bond_query",
        optional: true,
        tsType: "string",
        default: '""',
        doc: "Optional bond selection query.",
      },
    ],
    promptNotes: [
      '`query`: atom selection (e.g. `element == "C"`, `index < 10`, `resname == "ALA"`, `chain == "A"`, `resid == 42`, `within 5 of (resname == "HEM")`)',
      '`bond_query`: optional bond selection (e.g. `both element != "H"`)',
    ],
    promptInputs: "`in` (accepts particle or bond data type)",
    promptOutputs: "`out` (same type as input)",
    inPrompt: true,
    pythonClass: "Filter",
  },
  modify: {
    description: "Modifies visual properties (scale, opacity).",
    params: [
      { jsonKey: "scale", tsType: "number", default: "1.0", doc: "Atom size multiplier." },
      { jsonKey: "opacity", tsType: "number", default: "1.0", doc: "Transparency, 0–1." },
    ],
    promptNotes: [
      "scale: atom size multiplier (default 1.0)",
      "opacity: transparency 0-1 (default 1.0)",
    ],
    promptInputs: "`in` (accepts particle or bond data type)",
    promptOutputs: "`out` (same type as input)",
    inPrompt: true,
    pythonClass: "Modify",
  },
  replicate: {
    description:
      "Builds an OVITO/VESTA-style supercell by copying every atom (and its bonds)\ninto an `nx × ny × nz` grid of cell images and enlarging the simulation cell\nto match. Requires a unit cell on the input.",
    params: [
      {
        jsonKey: "nx",
        tsType: "number",
        default: "1",
        doc: "Repeats along the a lattice vector (integer ≥ 1).",
      },
      {
        jsonKey: "ny",
        tsType: "number",
        default: "1",
        doc: "Repeats along the b lattice vector (integer ≥ 1).",
      },
      {
        jsonKey: "nz",
        tsType: "number",
        default: "1",
        doc: "Repeats along the c lattice vector (integer ≥ 1).",
      },
    ],
    promptNotes: [
      "Each of nx/ny/nz is an integer >= 1 (default 1) — number of repeats along\n    the a/b/c lattice vectors.",
    ],
    promptInputs: "`particle`, `cell`, `trajectory`",
    promptOutputs: "`particle`, `cell`, `trajectory` (replicated)",
    inPrompt: true,
    pythonClass: "Replicate",
  },
  color: {
    description:
      "Recolors atoms using a palette mode, overriding the default per-element coloring.",
    params: [
      {
        jsonKey: "mode",
        tsType: '"uniform" | "byElement" | "byResidue" | "byChain" | "byBFactor" | "byProperty"',
        default: '"uniform"',
        doc: "Coloring scheme.",
      },
      {
        jsonKey: "uniformColor",
        tsType: "string",
        default: '"#ff8800"',
        doc: "Hex color used when mode is uniform.",
      },
      {
        jsonKey: "range",
        optional: true,
        tsType: "[number, number]",
        doc: "Value range for continuous palettes (auto-computed if omitted).",
      },
    ],
    promptNotes: [
      '"uniform": every atom gets `uniformColor` (hex string, e.g. "#ff8800")',
      '"byElement" / "byResidue" / "byChain": categorical palette by that property',
      '"byBFactor" / "byProperty": continuous palette over `range` (auto-computed if omitted)',
    ],
    promptInputs: "`in` (particle only — NOT bond)",
    promptOutputs: "`out` (particle)",
    inPrompt: true,
    pythonClass: "Color",
  },
  representation: {
    description: "Switches the rendering style for the connected particle stream.",
    params: [
      {
        jsonKey: "mode",
        tsType: '"atoms" | "licorice" | "cartoon" | "both" | "surface" | "line"',
        default: '"atoms"',
        doc: "Rendering style for the particle stream.",
      },
    ],
    promptNotes: [
      '"atoms": ball-and-stick / van der Waals spheres (default)',
      '"licorice": equal-radius atoms and bonds drawn as one continuous stick/tube (PyMOL licorice / sticks)',
      '"cartoon": protein backbone cartoon (secondary structure)',
      '"both": atoms and cartoon overlaid',
      '"surface": molecular surface',
      '"line": thin wireframe lines (VMD/PyMOL "lines" style)',
    ],
    promptInputs: "`in` (particle only — NOT bond)",
    promptOutputs: "`out` (particle)",
    inPrompt: true,
    pythonClass: "Representation",
  },
  label_generator: {
    description: "Generates text labels for atoms.",
    params: [
      {
        jsonKey: "source",
        tsType: '"element" | "resname" | "index"',
        default: '"element"',
        doc: "Which atom property becomes the label text.",
      },
    ],
    promptInputs: "`particle` (particle data type)",
    promptOutputs: "`label` (label data type)",
    inPrompt: true,
    pythonClass: "AddLabels",
  },
  polyhedron_generator: {
    description:
      "Generates coordination polyhedra automatically (VESTA-style). By default a\npolyhedron is drawn for every metal/metalloid center coordinated to every\nanion-former ligand present in the structure; the user opts OUT specific\nelements via `excludedCenters` / `excludedLigands`.",
    params: [
      {
        jsonKey: "excludedCenters",
        tsType: "number[]",
        default: "[]",
        doc: "Z numbers excluded from auto-detected centers (e.g. [22] to skip Ti).",
      },
      {
        jsonKey: "excludedLigands",
        tsType: "number[]",
        default: "[]",
        doc: "Z numbers excluded from auto-detected ligands.",
      },
      {
        jsonKey: "cutoffTolerance",
        tsType: "number",
        default: "1.15",
        doc: "Multiplier on (r_cov[c]+r_cov[l]).",
      },
      { jsonKey: "opacity", tsType: "number", default: "0.5", doc: "Face opacity, 0–1." },
      { jsonKey: "showEdges", tsType: "boolean", default: "false", doc: "Draw polyhedron edges." },
      { jsonKey: "edgeColor", tsType: "string", default: '"#dddddd"', doc: "Hex color for edges." },
      { jsonKey: "edgeWidth", tsType: "number", default: "3", doc: "Edge line width." },
    ],
    promptParamsFenced:
      "  {\n" +
      '    type: "polyhedron_generator",\n' +
      "    excludedCenters: number[],   // Z numbers to exclude from auto-detected centers (e.g. [22] to skip Ti)\n" +
      "    excludedLigands: number[],   // Z numbers to exclude from auto-detected ligands\n" +
      "    cutoffTolerance: number,     // multiplier on (r_cov[c]+r_cov[l]); ~1.15 default\n" +
      "    opacity: number,             // face opacity 0-1\n" +
      "    showEdges: boolean,\n" +
      '    edgeColor: string,           // hex color e.g. "#dddddd"\n' +
      "    edgeWidth: number\n" +
      "  }",
    promptInputs: "`particle` (particle data type)",
    promptOutputs: "`mesh` (mesh data type)",
    inPrompt: true,
    pythonClass: "AddPolyhedra",
  },
  surface_mesh: {
    description: "Computes an OVITO-style alpha-shape surface envelope around the atoms.",
    params: [
      {
        jsonKey: "alphaRadius",
        tsType: "number",
        default: "3.0",
        doc: "Probe sphere radius in Å (larger = smoother/coarser).",
      },
      {
        jsonKey: "color",
        tsType: "string",
        default: '"#4488ff"',
        doc: "Hex color of the surface.",
      },
      { jsonKey: "opacity", tsType: "number", default: "0.5", doc: "Surface transparency, 0–1." },
    ],
    promptNotes: [
      "alphaRadius: probe sphere radius in Å — larger is smoother/coarser,\n    smaller is more detailed (default 3.0)",
      'color: hex color string, e.g. "#4488ff"',
      "opacity: 0-1",
    ],
    promptInputs: "`particle` (particle data type)",
    promptOutputs: "`mesh` (mesh data type)",
    inPrompt: true,
    pythonClass: null,
  },
  vector_overlay: {
    description: "Visualizes per-atom vectors (forces, velocities) as arrows.",
    params: [
      { jsonKey: "scale", tsType: "number", default: "1.0", doc: "Arrow length multiplier." },
    ],
    promptInputs: "`vector` (vector data type)",
    promptOutputs: "`vector` (vector data type)",
    inPrompt: true,
    pythonClass: "VectorOverlay",
  },
  isosurface: {
    description: "Renders an isosurface (contour) of volumetric scalar-field data.",
    params: [
      {
        jsonKey: "isoLevel",
        tsType: "number",
        default: "0.05",
        doc: "Contour level for the positive surface.",
      },
      {
        jsonKey: "color",
        tsType: "string",
        default: '"#4488ff"',
        doc: "Hex color for the positive surface.",
      },
      { jsonKey: "opacity", tsType: "number", default: "0.7", doc: "Surface transparency, 0–1." },
      {
        jsonKey: "showNegative",
        tsType: "boolean",
        default: "false",
        doc: "Also draw a surface at −isoLevel.",
      },
      {
        jsonKey: "negativeColor",
        tsType: "string",
        default: '"#ff4444"',
        doc: "Hex color for the negative surface.",
      },
    ],
    promptNotes: [
      "isoLevel: contour level for the positive surface (default 0.05)",
      "showNegative: also draw a second surface at -isoLevel (e.g. for\n    electrostatic potential maps), colored with `negativeColor`",
    ],
    promptInputs: "`volumetric` (volumetric data type)",
    promptOutputs: "`mesh` (mesh data type)",
    inPrompt: true,
    pythonClass: "Isosurface",
  },
  viewport: {
    description:
      "The final rendering sink. Every pipeline MUST have exactly one viewport node. All data flows into this node.",
    params: [
      {
        jsonKey: "perspective",
        tsType: "boolean",
        default: "false",
        doc: "Perspective projection instead of orthographic.",
      },
      {
        jsonKey: "cellAxesVisible",
        tsType: "boolean",
        default: "true",
        doc: "Show the unit-cell axes.",
      },
      {
        jsonKey: "pivotMarkerVisible",
        tsType: "boolean",
        default: "true",
        doc: "Show the camera pivot marker.",
      },
    ],
    promptInputs:
      "`particle`, `bond`, `cell`, `trajectory`, `label`, `mesh`, `vector` (each accepts its respective data type)",
    inPrompt: true,
    pythonClass: "Viewport",
  },
  streaming: {
    description:
      "Streams particle/bond/trajectory data in real time over a WebSocket (only available on the standalone `megane serve` host).",
    params: [
      {
        jsonKey: "connected",
        tsType: "boolean",
        default: "false",
        doc: "Whether the stream is currently connected.",
      },
    ],
    promptOutputs: "`particle`, `bond`, `trajectory`, `cell`",
    inPrompt: false,
    pythonClass: "Streaming",
  },
};

/** Node order as presented in the AI prompt (catalog authoring order, minus non-prompt nodes). */
export const PROMPT_NODE_ORDER = (Object.keys(NODE_CATALOG) as PipelineNodeType[]).filter(
  (t) => NODE_CATALOG[t].inPrompt,
);
