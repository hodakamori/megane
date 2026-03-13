/**
 * Pipeline skill loader.
 * Reads skill markdown files from src/ai/skills/, parses frontmatter,
 * and converts them to Claude tool definitions for tool_use.
 *
 * Skills follow the Claude Code SKILL.md format:
 *   ---
 *   name: skill-name
 *   description: When to use this skill
 *   ---
 *   Markdown content...
 *
 * To add a new skill, create a .md file in src/ai/skills/.
 */

/** A parsed pipeline skill. */
export interface PipelineSkill {
  /** Skill name from frontmatter (kebab-case). */
  name: string;
  /** Description from frontmatter (used as Claude tool description). */
  description: string;
  /** Markdown body after frontmatter (returned as tool result). */
  content: string;
}

/** Claude API tool definition shape. */
export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, never> };
}

/**
 * Import all .md files from the skills directory at build time.
 * Vite's import.meta.glob with ?raw returns file contents as strings.
 */
const skillModules: Record<string, { default: string }> = import.meta.glob(
  "./skills/*.md",
  { query: "?raw", eager: true },
) as Record<string, { default: string }>;

/**
 * Parse YAML frontmatter from a markdown string.
 * Returns the frontmatter key-value pairs and the remaining content.
 */
function parseFrontmatter(raw: string): {
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
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      attrs[key] = value;
    }
  }

  return { attrs, content: match[2].trim() };
}

/** Convert kebab-case to snake_case for Claude tool names. */
function toSnakeCase(s: string): string {
  return s.replace(/-/g, "_");
}

/**
 * Load and parse all pipeline skills from the skills directory.
 * Called once at module load time; results are cached.
 */
export function loadSkills(): PipelineSkill[] {
  const skills: PipelineSkill[] = [];

  for (const [, mod] of Object.entries(skillModules)) {
    const raw = mod.default;
    const { attrs, content } = parseFrontmatter(raw);

    if (!attrs.name || !attrs.description) {
      continue; // skip files without required frontmatter
    }

    skills.push({
      name: attrs.name,
      description: attrs.description,
      content,
    });
  }

  return skills;
}

/**
 * Build Claude API tool definitions from loaded skills.
 * Each skill becomes a tool with no input parameters.
 */
export function buildToolDefinitions(skills: PipelineSkill[]): ToolDefinition[] {
  return skills.map((skill) => ({
    name: toSnakeCase(skill.name),
    description: skill.description,
    input_schema: { type: "object" as const, properties: {} },
  }));
}

/**
 * Execute a skill by tool name. Returns the skill's markdown content.
 * Returns null if no matching skill is found.
 */
export function executeSkill(
  skills: PipelineSkill[],
  toolName: string,
): string | null {
  const skill = skills.find((s) => toSnakeCase(s.name) === toolName);
  return skill?.content ?? null;
}

/** Cached skills loaded at module init. */
let _cachedSkills: PipelineSkill[] | null = null;

/** Get skills (lazy-loaded and cached). */
export function getSkills(): PipelineSkill[] {
  if (!_cachedSkills) {
    _cachedSkills = loadSkills();
  }
  return _cachedSkills;
}
