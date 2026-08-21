# Baseline images for cross-platform E2E

Each subdirectory holds the reference PNGs for one Playwright project.

This directory is the **local** baseline set, used when
`MEGANE_E2E_BASELINE_DIR` is unset. CI compares against a separate set,
`tests/e2e/baselines-ci/`, recorded inside the pinned Playwright
container by the "E2E update baselines" workflow — never capture those
PNGs locally; dispatch that workflow instead.

## First-run behaviour

If a baseline file does not exist when a spec runs, `compareToBaseline()`
in `tests/e2e/lib/setup.ts` writes the captured PNG to disk and returns
`isNew: true`. The test passes — but the artifact is not yet under
version control. Use this to seed new baselines locally, then commit
the resulting PNGs.

## Updating baselines

Run the spec(s), then commit the regenerated PNG. Locally, deleting the
baseline file (or running with `--update-snapshots`) is the simplest
path:

```sh
rm tests/e2e/baselines/webapp/default-view.png
npx playwright test --project=webapp
git add tests/e2e/baselines/webapp/default-view.png
```

If a comparison fails it writes `.diff.png` and `.new.png` next to the
baseline; both are gitignored so you can inspect them without polluting
the working tree.

## Environment determinism

Pixel output depends on the Chromium build and the system fonts, so a
baseline only reproduces in the environment class that recorded it.
That is why the sets are split: this directory is recorded by the local
dev environment (Ubuntu + Chromium via `npx playwright install
chromium`), while `baselines-ci/` is recorded inside the pinned
`mcr.microsoft.com/playwright` container that CI also compares in. Diff
tolerance is configured in `tests/e2e/lib/setup.ts`
(DEFAULT_MAX_DIFF_PERCENT = 2.0% within a project, 4.0% for
cross-platform parity). The launchOption `--disable-dev-shm-usage` is
set in `playwright.config.ts` because GH Actions runners ship a 64MB
`/dev/shm` that the WASM bundle + Three.js can exhaust, silently
aborting WebGL.

If a hardware/font upgrade pushes local baselines past tolerance,
either tighten the test (mask the noisy region) or regenerate them in
the current dev environment and commit the new PNGs.
