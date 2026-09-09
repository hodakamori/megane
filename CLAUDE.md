@AGENTS.md

## Claude Code

The instructions above come from `AGENTS.md`, the single source of truth shared
with Codex CLI and other agents. Edit that file, not this one. The
`.claude/skills` directory is a symlink to `.agents/skills/` for the same
reason, and the SessionStart hook in `.claude/settings.json` runs the shared
`.agents/hooks/session-start.sh`. See "Agent tooling layout" in `AGENTS.md`.
