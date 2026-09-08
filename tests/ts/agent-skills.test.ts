/**
 * Guards the shared agent-tooling layout described in AGENTS.md
 * ("Agent tooling layout"): one set of instructions, skills, and hooks that
 * both Claude Code and Codex CLI read.
 *
 *   - `.agents/skills/<name>/SKILL.md` is the canonical skill set (Agent
 *     Skills spec, discovered natively by Codex).
 *   - `.claude/skills` is a symlink to it so Claude Code sees the same files.
 *   - `.agents/hooks/session-start.sh` is the shared SessionStart hook,
 *     referenced from `.claude/settings.json` and `.codex/hooks.json`.
 *   - `AGENTS.md` is the canonical instruction file; `CLAUDE.md` imports it.
 *
 * Drift between the hosts is exactly what this file exists to catch, so keep
 * every assertion cross-referenced with the AGENTS.md table.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "..", "..");
const SKILLS_DIR = path.join(ROOT, ".agents", "skills");
const CLAUDE_SKILLS = path.join(ROOT, ".claude", "skills");
const HOOK = path.join(ROOT, ".agents", "hooks", "session-start.sh");

/** Agent Skills spec: 1–64 chars, lowercase alphanumerics + single hyphens. */
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

interface Frontmatter {
  name?: string;
  description?: string;
  raw: string;
}

/** Minimal YAML frontmatter reader — enough for `key: value` scalars. */
export function readFrontmatter(markdown: string): Frontmatter {
  const m = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!m) return { raw: "" };
  const out: Frontmatter = { raw: m[1] };
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_-]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, value] = kv;
    if (key === "name") out.name = value.trim();
    if (key === "description") out.description = value.trim();
  }
  return out;
}

/** Skill names listed in a markdown table like the one in AGENTS.md. */
export function skillNamesFromTable(markdown: string): string[] {
  const names: string[] = [];
  for (const line of markdown.split(/\r?\n/)) {
    const m = /^\|\s*`([a-z0-9-]+)`\s*\|/.exec(line);
    if (m) names.push(m[1]);
  }
  return names;
}

/** Backtick-quoted skill names inside a parenthesised list, e.g. the hook text. */
export function skillNamesFromList(text: string): string[] {
  const m = /skills are loaded \(([^)]*)\)/.exec(text);
  if (!m) return [];
  return [...m[1].matchAll(/`([a-z0-9-]+)`/g)].map((x) => x[1]);
}

const skillDirs = fs
  .readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

describe("agent skills layout (.agents/skills)", () => {
  it("has the 11 documented skills", () => {
    expect(skillDirs).toEqual([
      "add-format",
      "add-node",
      "build",
      "commit",
      "dev-setup",
      "e2e-coverage",
      "github-cli",
      "post-release",
      "pre-release",
      "preview",
      "testing",
    ]);
  });

  it.each(skillDirs)("%s/SKILL.md has spec-compliant frontmatter", (dir) => {
    const file = path.join(SKILLS_DIR, dir, "SKILL.md");
    expect(fs.existsSync(file)).toBe(true);
    const fm = readFrontmatter(fs.readFileSync(file, "utf8"));
    expect(fm.raw, `${dir}: missing frontmatter block`).not.toBe("");
    // Codex requires `name`; the spec says it must equal the directory name.
    expect(fm.name).toBe(dir);
    expect(dir).toMatch(NAME_RE);
    expect(dir.length).toBeLessThanOrEqual(64);
    expect(fm.description ?? "").not.toBe("");
    expect((fm.description ?? "").length).toBeLessThanOrEqual(1024);
  });

  it("skill bodies never point at the Claude-only paths", () => {
    for (const dir of skillDirs) {
      const body = fs.readFileSync(path.join(SKILLS_DIR, dir, "SKILL.md"), "utf8");
      expect(body, `${dir}: use .agents/skills/ instead`).not.toMatch(/\.claude\/skills\//);
      expect(body, `${dir}: AGENTS.md is the canonical file`).not.toMatch(/CLAUDE\.md/);
    }
  });
});

describe("Claude Code view of the skills (.claude/skills symlink)", () => {
  it("is a symlink that resolves to .agents/skills", () => {
    expect(fs.lstatSync(CLAUDE_SKILLS).isSymbolicLink()).toBe(true);
    expect(fs.readlinkSync(CLAUDE_SKILLS)).toBe("../.agents/skills");
    expect(fs.realpathSync(CLAUDE_SKILLS)).toBe(fs.realpathSync(SKILLS_DIR));
  });

  it("exposes the same skill directories through the symlink", () => {
    const viaClaude = fs
      .readdirSync(CLAUDE_SKILLS, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    expect(viaClaude).toEqual(skillDirs);
  });
});

describe("shared SessionStart hook", () => {
  const settings = JSON.parse(fs.readFileSync(path.join(ROOT, ".claude", "settings.json"), "utf8"));
  const codexHooks = JSON.parse(fs.readFileSync(path.join(ROOT, ".codex", "hooks.json"), "utf8"));

  it("is executable and lives under .agents/hooks", () => {
    expect(fs.existsSync(HOOK)).toBe(true);
    if (process.platform !== "win32") {
      expect(fs.statSync(HOOK).mode & 0o111).not.toBe(0);
    }
    expect(fs.existsSync(path.join(ROOT, ".claude", "hooks"))).toBe(false);
  });

  it("is wired from .claude/settings.json", () => {
    const cmd = settings.hooks.SessionStart[0].hooks[0];
    expect(cmd.type).toBe("command");
    expect(cmd.command).toBe("$CLAUDE_PROJECT_DIR/.agents/hooks/session-start.sh");
  });

  it("is wired from .codex/hooks.json via the git root", () => {
    const entry = codexHooks.hooks.SessionStart[0];
    expect(entry.matcher).toBe("startup|resume");
    const cmd = entry.hooks[0];
    expect(cmd.type).toBe("command");
    expect(cmd.command).toContain(
      "$(git rev-parse --show-toplevel)/.agents/hooks/session-start.sh",
    );
    expect(cmd.additionalContextLimit).toBeGreaterThan(0);
  });

  it.skipIf(process.platform === "win32")(
    "emits the SessionStart additionalContext contract",
    () => {
      const stdout = execFileSync("bash", [HOOK], { encoding: "utf8" });
      const json = JSON.parse(stdout);
      expect(json.hookSpecificOutput.hookEventName).toBe("SessionStart");
      const ctx: string = json.hookSpecificOutput.additionalContext;
      expect(ctx).toContain("AGENTS.md");
      expect(ctx).toContain(".agents/skills/");
      expect(ctx.length).toBeLessThanOrEqual(
        codexHooks.hooks.SessionStart[0].hooks[0].additionalContextLimit,
      );
      // The hook's skill list must match the directories on disk.
      expect(skillNamesFromList(ctx).sort()).toEqual(skillDirs);
    },
  );
});

describe("AGENTS.md / CLAUDE.md", () => {
  const agents = fs.readFileSync(path.join(ROOT, "AGENTS.md"), "utf8");
  const claude = fs.readFileSync(path.join(ROOT, "CLAUDE.md"), "utf8");

  it("CLAUDE.md is a shim that imports AGENTS.md", () => {
    expect(claude.split(/\r?\n/)[0]).toBe("@AGENTS.md");
    expect(claude.length).toBeLessThan(1024);
  });

  it("AGENTS.md skills table matches the directories on disk", () => {
    expect(skillNamesFromTable(agents).sort()).toEqual(skillDirs);
    expect(agents).toContain(`Total: ${skillDirs.length} skills.`);
  });

  it("AGENTS.md does not reference the retired .claude/hooks or .claude/skills/<file> paths", () => {
    expect(agents).not.toMatch(/\.claude\/hooks\//);
    expect(agents).not.toMatch(/\.claude\/skills\/[a-z]/);
  });

  it("AGENTS.md fits the project_doc_max_bytes raised in .codex/config.toml", () => {
    const toml = fs.readFileSync(path.join(ROOT, ".codex", "config.toml"), "utf8");
    const m = /^project_doc_max_bytes\s*=\s*(\d+)/m.exec(toml);
    expect(m, "project_doc_max_bytes must be set").not.toBeNull();
    const limit = Number(m![1]);
    const bytes = Buffer.byteLength(agents, "utf8");
    // Leave headroom for a user's global ~/.codex/AGENTS.md, which shares the budget.
    expect(bytes).toBeLessThan(limit / 2);
  });

  it("AGENTS.md has no bare @imports outside code spans (they would be expanded by Claude Code)", () => {
    const stripped = agents.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
    expect(stripped).not.toMatch(/(^|\s)@[A-Za-z~./]/m);
  });
});
