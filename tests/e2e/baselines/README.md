# Baseline images for cross-platform E2E

Each subdirectory holds the reference PNGs for one Playwright project.
Baselines are committed to the repository so CI can compare against
them on every run.

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

CI runs on `ubuntu-latest`. Locally the dev container is also Ubuntu +
Chromium installed via `npx playwright install chromium`, so the
rendered pixels match within the diff tolerance configured in
`tests/e2e/lib/setup.ts` (DEFAULT_MAX_DIFF_PERCENT = 2.0% within a
project, 4.0% for cross-platform parity). The launchOption
`--disable-dev-shm-usage` is set in `playwright.config.ts` because GH
Actions runners ship a 64MB `/dev/shm` that the WASM bundle + Three.js
can exhaust, silently aborting WebGL.

If a future hardware/font upgrade pushes baselines past tolerance,
either tighten the test (mask the noisy region) or regenerate the
baselines on the same `ubuntu-latest` image and commit the new PNGs.
