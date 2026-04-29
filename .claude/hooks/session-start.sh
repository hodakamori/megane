#!/bin/bash
set -euo pipefail

# Inject a strong reminder into the first turn so the agent reliably
# applies CLAUDE.md and verifies skills before starting any work.
cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "## megane project bootstrap (MANDATORY)\n\nBefore producing your first response to the user, you MUST:\n\n1. Invoke the `/validate-skills` skill to confirm all 9 megane skills are loaded (commit, github-cli, dev-setup, build, testing, preview, pre-release, post-release, validate-skills).\n2. Re-read the CRITICAL RULES section of CLAUDE.md and acknowledge them. In particular:\n   - Commit messages MUST be in English.\n   - NEVER use Puppeteer; E2E and screenshot scripts use Playwright from `/opt/node22/lib/node_modules/`.\n   - Run `npm run build:wasm` before `npm run dev` or full builds.\n   - After pushing, always create a PR via `gh pr create` and verify CI with `gh run list`.\n   - In plan mode, strictly follow the approved plan.\n3. If any expected skill is missing, warn the user immediately and suggest restarting the session or checking `.claude/skills/`.\n\nDo not skip these steps even on resumed/compacted sessions."
  }
}
JSON
