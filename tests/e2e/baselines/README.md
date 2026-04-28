# Baseline images for cross-platform E2E

Each subdirectory holds the reference PNGs for one Playwright project.
Baselines are **environment-specific** (Chromium swiftshader output is
GPU/driver-independent but font metrics differ between hosts), so they
must be generated on the same OS image used by CI (`ubuntu-latest`).

## First-run behaviour

If a baseline file does not exist when a spec runs, `compareToBaseline()`
in `tests/e2e/lib/setup.ts` writes the captured PNG to disk and returns
`isNew: true`. The test passes — but the artifact is not yet under
version control, so subsequent runs in the same environment compare
against it.

This means the **first CI run after these baselines are deleted will
auto-generate fresh, environment-correct baselines**. They are uploaded
as part of the per-project `playwright-report-<project>` artifact.

## Updating baselines

After the first run on a new CI image, download the generated PNGs from
the artifact, copy them into `tests/e2e/baselines/<project>/`, and
commit. From then on, comparisons run against committed baselines.

Locally, run with `--update-snapshots` (or just delete the file you want
to refresh):

```sh
npx playwright test --project=webapp --update-snapshots
```

If a comparison fails it writes `.diff.png` and `.new.png` next to the
baseline; both are gitignored so you can inspect them without polluting
the working tree.

## Why baselines aren't generated locally and committed

Local dev images differ from `ubuntu-latest` (different font cache,
different fontconfig version, sometimes different libfreetype). Those
small differences produce 2–4% pixel diffs which would fail in CI even
when no real regression has occurred. The plan in
`/root/.claude/plans/jupyter-extension-jupyter-widget-merry-gizmo.md`
explicitly calls this out: "CI is ubuntu-latest fixed for baseline".
