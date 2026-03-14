---
description: Guidelines for making git commits in the megane project. Use when creating commits.
---

# Commit Guidelines

## RULE: All commit messages and PR descriptions MUST be in English

This is a hard requirement. Never write commit messages, PR titles, or PR descriptions in Japanese or any other non-English language.

## Commit Message Style

Use conventional commits:
- `feat:` for new features (e.g., `feat: add CIF file format support`)
- `fix:` for bug fixes (e.g., `fix: resolve infinite re-render loop in sidebar`)
- `chore:` for maintenance (e.g., `chore: update dependencies`)
- `docs:` for documentation
- `refactor:` for code restructuring
- `test:` for test additions/changes
- `perf:` for performance improvements

Keep the first line under 72 characters. Add details in the body if needed.

## Before Committing

1. Run relevant tests for the changed code:
   - Rust changes: `cargo test -p megane-core`
   - TypeScript changes: `npm test`
   - Python changes: `python -m pytest`
2. Ensure the build succeeds for frontend changes: `npm run build`
3. Do NOT commit generated files: `crates/megane-wasm/pkg/`, `dist/`, `target/`, `node_modules/`, `dev-preview/`
4. Check if your changes require documentation updates:
   - Review `README.md`, `CLAUDE.md`, and files under `docs/` for any descriptions affected by your changes
   - If you added/changed/removed features, CLI options, API, commands, configuration, or architecture, update the corresponding documentation
   - Key docs to check:
     - `README.md` — project overview, usage examples
     - `CLAUDE.md` — dev instructions, key commands, architecture notes
     - `CHANGELOG.md` — notable changes
     - `docs/` — user-facing guides and API reference
   - Include doc updates in the same commit (or a separate `docs:` commit if the changes are substantial)
5. If you changed pipeline nodes (`src/pipeline/`), ensure the Python API is also updated:
   - Node classes in `python/megane/pipeline.py` (add/update corresponding `PipelineNode` subclass)
   - Port mappings in `_SOURCE_OUTPUT_MAP` / `_TARGET_PORT_MAP`
   - Public exports in `python/megane/__init__.py`
   - Default parameters must match TypeScript `defaultParams()` in `src/pipeline/types.ts`

## After Committing

Always create a pull request after pushing your changes using `gh pr create`. Include a summary of changes and a test plan in the PR body. See the `github-cli` skill for remote URL workaround if `gh` fails.

If additional commits are pushed after the PR is created, review the PR title and description and update them to accurately reflect all changes. Both the title and summary must always match the actual diff.
