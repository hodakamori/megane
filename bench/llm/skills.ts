/**
 * Skill loading for the LLM benchmark.
 *
 * Production loads `src/ai/skills/*.md` at build time via Vite's
 * `import.meta.glob`, which is unavailable under a plain Node/vitest runner.
 * Here we read the *same* markdown files from disk so the benchmark exercises
 * the identical skill content (single source of truth — only the loading
 * mechanism differs). The frontmatter parsing and tool-definition shapes mirror
 * `src/ai/skillLoader.ts`.
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** A parsed pipeline skill (mirrors `PipelineSkill` in skillLoader.ts). */
export interface BenchSkill {
  name: string;
  description: string;
  content: string;
}

/** Claude API tool definition shape. */
export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, never> };
}

/** OpenAI-compatible function tool definition shape. */
export interface OpenAITool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: { type: "object"; properties: Record<string, never> };
  };
}

/** Absolute path to the production skills directory. */
function skillsDir(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  // bench/llm -> repo root -> src/ai/skills
  return join(here, "..", "..", "src", "ai", "skills");
}

/** Parse YAML-ish frontmatter (mirrors skillLoader.parseFrontmatter). */
export function parseFrontmatter(raw: string): {
  attrs: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    return { attrs: {}, content: raw };
  }
  const attrs: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      attrs[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim();
    }
  }
  return { attrs, content: match[2].trim() };
}

/** kebab-case -> snake_case for tool names. */
export function toSnakeCase(s: string): string {
  return s.replace(/-/g, "_");
}

let _cached: BenchSkill[] | null = null;

/** Load and parse all pipeline skills from `src/ai/skills/`. Cached. */
export function loadSkills(): BenchSkill[] {
  if (_cached) return _cached;
  const dir = skillsDir();
  const skills: BenchSkill[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const { attrs, content } = parseFrontmatter(readFileSync(join(dir, file), "utf8"));
    if (!attrs.name || !attrs.description) continue;
    skills.push({ name: attrs.name, description: attrs.description, content });
  }
  return (_cached = skills);
}

/** Build Anthropic tool definitions from skills. */
export function buildToolDefinitions(skills: BenchSkill[]): ToolDefinition[] {
  return skills.map((s) => ({
    name: toSnakeCase(s.name),
    description: s.description,
    input_schema: { type: "object" as const, properties: {} },
  }));
}

/** Build OpenAI-compatible function tools from skills. */
export function buildOpenAITools(skills: BenchSkill[]): OpenAITool[] {
  return skills.map((s) => ({
    type: "function",
    function: {
      name: toSnakeCase(s.name),
      description: s.description,
      parameters: { type: "object" as const, properties: {} },
    },
  }));
}

/** Execute a skill by tool name; returns its markdown content or null. */
export function executeSkill(skills: BenchSkill[], toolName: string): string | null {
  return skills.find((s) => toSnakeCase(s.name) === toolName)?.content ?? null;
}
