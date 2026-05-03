#!/bin/bash
set -euo pipefail

# Inject a strong reminder into the first turn so the agent reliably
# applies CLAUDE.md and verifies skills before starting any work.
cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "## megane project bootstrap (MANDATORY)\n\nBefore producing your first response to the user, you MUST:\n\n1. Re-read the CRITICAL RULES section of CLAUDE.md and follow them strictly. They are the authoritative list; do not paraphrase or substitute remembered rules.\n2. Confirm via the `available skills` section of the system reminder that the 10 megane skills are loaded (`commit`, `github-cli`, `dev-setup`, `build`, `testing`, `e2e-coverage`, `preview`, `pre-release`, `post-release`, `add-format`). If any are missing, warn the user and suggest checking `.claude/skills/`.\n\nDo not skip these steps even on resumed/compacted sessions."
  }
}
JSON
