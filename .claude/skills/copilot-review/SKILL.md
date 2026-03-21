---
description: After CI passes, request a GitHub Copilot review on the PR, read the feedback, apply fixes, and re-verify CI. Use after a PR is open and CI is green.
---

# Copilot Review Skill

## Overview

This skill covers the full Copilot review loop:

1. Request a GitHub Copilot review on the open PR
2. Wait for the review to be posted
3. Read and analyse the review comments
4. Apply fixes and commit them
5. Push the fixes and verify CI passes again

## Prerequisites

- A PR must already exist for the current branch.
- CI must be passing before requesting a review.

## Remote URL Workaround

All `gh` commands require the remote URL workaround from the `github-cli` skill:

```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
# ... gh commands ...
git remote set-url origin "$ORIG_REMOTE"
```

Always restore the original remote when done.

## Step 1: Request Copilot Review

```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git

PR_NUM=$(gh pr view --json number -q .number)

gh api repos/hodakamori/megane/pulls/$PR_NUM/requested_reviewers \
  -X POST \
  -f "reviewers[]=Copilot"

git remote set-url origin "$ORIG_REMOTE"
```

If the API call fails because `Copilot` is not recognised, try the alternative reviewer handle:

```bash
gh api repos/hodakamori/megane/pulls/$PR_NUM/requested_reviewers \
  -X POST \
  -f "reviewers[]=copilot-pull-request-reviewer"
```

## Step 2: Wait for the Review

Copilot typically posts its review within a minute. Poll until a review appears:

```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git

PR_NUM=$(gh pr view --json number -q .number)
gh api repos/hodakamori/megane/pulls/$PR_NUM/reviews

git remote set-url origin "$ORIG_REMOTE"
```

If no review is present yet, wait ~30 seconds and retry. Repeat up to 5 times before reporting that the review has not arrived.

## Step 3: Read Review Comments

Fetch both the high-level review body and the inline diff comments:

```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git

PR_NUM=$(gh pr view --json number -q .number)

# High-level review (body + state)
gh api repos/hodakamori/megane/pulls/$PR_NUM/reviews

# Inline file comments
gh api repos/hodakamori/megane/pulls/$PR_NUM/comments

git remote set-url origin "$ORIG_REMOTE"
```

Read each comment carefully. Group them by file and priority before applying fixes.

## Step 4: Apply Fixes

For each piece of feedback:

1. Read the affected file(s) to understand the current code.
2. Apply the minimal change that addresses the comment.
3. Follow the `commit` skill guidelines (English messages, conventional commits, run relevant tests).

Commit example:

```
fix: address Copilot review feedback

- <brief description of change 1>
- <brief description of change 2>
```

Do **not** make unrelated changes in the same commit.

## Step 5: Push and Re-verify

```bash
git push -u origin "$(git branch --show-current)"
```

Then verify CI passes (follow the CI-check section of the `commit` skill). Once CI is green, report completion to the user.

## Handling Suggestions You Disagree With

If a Copilot suggestion is incorrect or not applicable, reply to the individual comment thread explaining why the change was not made. Use:

```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git

COMMENT_ID=<id>  # from the comments API response
gh api repos/hodakamori/megane/pulls/$PR_NUM/comments/$COMMENT_ID/replies \
  -X POST \
  -f body="Not applicable because ..."

git remote set-url origin "$ORIG_REMOTE"
```

Document every skipped suggestion with a clear reason so reviewers can see the decision.
