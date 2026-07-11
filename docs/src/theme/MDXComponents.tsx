import MDXComponents from "@theme-original/MDXComponents";
import CtaBridge from "../components/CtaBridge";

/**
 * Register custom components as global MDX tags so doc pages can use them
 * without an explicit import (e.g. <CtaBridge />). This wraps the original
 * mapping rather than swizzling any theme component.
 */
export default {
  ...MDXComponents,
  CtaBridge,
};
