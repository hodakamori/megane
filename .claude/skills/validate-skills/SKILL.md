---
description: Validate that all project skills are loaded and available. Use at the start of a task to confirm the skill system is working correctly.
---

# Validate Skills

Run this skill at the beginning of a task to confirm that all expected megane project skills are loaded.

## Expected Skills

The following skills must be available in the system reminder:

1. **commit** — Git commit guidelines
2. **github-cli** — GitHub CLI usage
3. **dev-setup** — Development environment setup
4. **build** — Build commands
5. **testing** — Test runner instructions
6. **e2e-coverage** — E2E coverage runbook (5 platforms)
7. **preview** — Screenshot and video capture
8. **pre-release** — Pre-release checklist (tests, versioning, dry-run, tag)
9. **post-release** — Post-release checklist (verify packages, docs, live demo)
10. **validate-skills** — This skill (self-check)

## Validation Steps

1. Check the system reminder in the current conversation for the list of available skills.
2. Verify that all 10 skills listed above appear in the available skills list.
3. Report the result:
   - If all skills are present: confirm and proceed with the task.
   - If any skill is missing: warn the user which skills are missing and suggest restarting the session or checking `.claude/skills/` directory structure.

## Example Output

```
Skills validation: OK
  - commit: loaded
  - github-cli: loaded
  - dev-setup: loaded
  - build: loaded
  - testing: loaded
  - e2e-coverage: loaded
  - preview: loaded
  - pre-release: loaded
  - post-release: loaded
  - validate-skills: loaded
All 10 skills are available. Ready to proceed.
```
