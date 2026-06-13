/** Shared benchmark case type. */

import type { Rubric } from "./scorer";

/** One benchmark case: a natural-language prompt + a grading rubric. */
export interface BenchCase {
  /** Stable identifier (used in reports and result files). */
  id: string;
  /** The natural-language request handed to the model verbatim. */
  prompt: string;
  /** Category tags for per-group reporting (e.g. "molecule", "filter"). */
  tags: string[];
  /** Programmatic grading rubric. */
  rubric: Rubric;
}
