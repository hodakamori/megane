/**
 * Webpack-build stub for src/ai/skillLoader.ts.
 *
 * The original file uses Vite's `import.meta.glob` to bundle the
 * AI-pipeline skill prompts at build time. webpack does not understand
 * `import.meta.glob`, so we swap this stub in for the JupyterLab
 * federated bundle via NormalModuleReplacementPlugin (see webpack.config.js).
 *
 * The DocWidget shipped by this labextension does not surface the
 * AI-driven pipeline chat box, so returning an empty skill set is fine.
 */

export interface PipelineSkill {
  name: string;
  description: string;
  content: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, never> };
}

export function loadSkills(): PipelineSkill[] {
  return [];
}

export function buildToolDefinitions(_skills: PipelineSkill[]): ToolDefinition[] {
  return [];
}

export function executeSkill(_skills: PipelineSkill[], _toolName: string): string | null {
  return null;
}

export function getSkills(): PipelineSkill[] {
  return [];
}
