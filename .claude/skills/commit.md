---
description: Guidelines for making git commits in the megane project. Use when creating commits.
---

# Commit Guidelines

## RULE: All commit messages MUST be in English

This is a hard requirement. Never write commit messages in Japanese or any other non-English language.

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
