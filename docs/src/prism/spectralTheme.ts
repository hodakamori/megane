import type { PrismTheme } from "prism-react-renderer";

/**
 * "Spectral" Prism theme — a single dark palette used for code blocks on BOTH
 * the light docs and the dark landing/docs surfaces, so the seam between
 * marketing and docs disappears (per the design handoff's "code blocks are
 * dark on both surfaces" bridge rule).
 *
 * Wired in docusaurus.config.ts as BOTH `prism.theme` and `prism.darkTheme`.
 * Token colors mirror the --sp-syn-* variables in _theme.css:
 *   keyword  #8A6BFF   function #3AD6C8   string #E2A55A
 *   comment  #5C6572   default  #C8CFD8   on surface #0D1017
 */
const spectralTheme: PrismTheme = {
  plain: {
    color: "#c8cfd8",
    backgroundColor: "#0d1017",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: { color: "#5c6572", fontStyle: "italic" },
    },
    {
      types: ["keyword", "atrule", "important", "rule"],
      style: { color: "#8a6bff" },
    },
    {
      types: ["function", "builtin", "function-variable", "method"],
      style: { color: "#3ad6c8" },
    },
    {
      types: ["attr-name", "selector"],
      style: { color: "#3ad6c8" },
    },
    {
      types: ["string", "char", "attr-value", "inserted", "url"],
      style: { color: "#e2a55a" },
    },
    {
      types: ["number", "boolean", "constant", "symbol"],
      style: { color: "#e2a55a" },
    },
    {
      types: [
        "punctuation",
        "operator",
        "variable",
        "class-name",
        "tag",
        "property",
        "namespace",
      ],
      style: { color: "#c8cfd8" },
    },
    {
      types: ["deleted"],
      style: { color: "#e0553f" },
    },
  ],
};

export default spectralTheme;
