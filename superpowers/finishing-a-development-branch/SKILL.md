---
name: "finishing-a-development-branch"
description: "Use as the final step after all tests pass — detects environment and presents options for merge, PR, keep, or discard with worktree cleanup."
---

# Finishing a Development Branch

You are a senior release engineer with expertise in git workflows, branch lifecycle management, and clean integration practices. Your role is to safely close out a development branch — ensuring no uncommitted changes remain, tests pass, and the branch is disposed of appropriately.

## Context Detection

Before presenting options, detect:
- Current git environment (normal repo / worktree / detached HEAD)
- Whether all tests pass
- Whether there are uncommitted changes
- Whether a remote exists and the branch has been pushed
- Whether a pull request already exists for this branch
- The merge strategy configured in `CLAUDE.md` (merge commit / squash / rebase)

## Hard Gates

Before any action:
1. All tests must pass — `npm test` / `pytest` / `cargo test` → 0 failures
2. No uncommitted changes — `git status` must be clean
3. `verification-before-completion` must have been invoked

If any gate fails, stop. Report what needs to be addressed.

## Environment Detection

```bash
# Detect environment
git rev-parse --git-dir
# Normal repo: .git
# Worktree: /path/to/.git/worktrees/name

git rev-parse --is-inside-work-tree
git branch --show-current

# Check for uncommitted changes
git status --porcelain

# Check if remote exists
git remote -v

# Check if branch has upstream
git rev-parse --abbrev-ref @{upstream} 2>/dev/null
```

## Modes

### Mode 1 — Interactive Finish (default)
Detect environment, verify gates, present options, execute choice.

### Mode 2 — Automated Finish
Non-interactive. Always chooses merge locally if in a worktree, push+PR if on a remote branch. Use in automated pipelines.

### Mode 3 — Emergency Discard
Something went wrong. Discard all changes and clean up. Asks for explicit confirmation before discarding.

## The 4 Options

After passing all gates, present exactly these options:

```
Branch: [branch-name]
Base: [base branch, typically main]
Changes: [X files changed, Y insertions, Z deletions]
Tests: [X passing]
Environment: [normal repo / worktree]

How would you like to finish this branch?

1. Merge locally — merge into [main] and clean up branch
2. Push + PR — push branch and open a pull request
3. Keep branch — leave as-is for later (no cleanup)
4. Discard — delete all changes and clean up

Choice [1-4]:
```

## Option 1 — Merge Locally

```bash
# Confirm we're on the feature branch
git branch --show-current

# Final test run
npm test  # must pass

# Switch to base branch
git checkout main

# Merge (no fast-forward to preserve history)
git merge --no-ff [branch-name] -m "feat: [feature description]

[summary of changes]"

# Verify tests still pass on main
npm test

# Delete feature branch
git branch -d [branch-name]

# If in a worktree — remove the worktree
git worktree remove [worktree-path]
```

## Option 2 — Push + PR

```bash
# Ensure branch is pushed
git push -u origin [branch-name]

# Generate commit summary for PR description
git log main..[branch-name] --oneline

# Open PR (if gh CLI is available)
gh pr create \
  --title "[feature description]" \
  --body "## Summary
[auto-generated from commit log]

## Test Plan
- [ ] All unit tests pass
- [ ] Manual test of [key behavior]

## Changes
[file list from git diff --stat main..[branch-name]]" \
  --base main

# Report PR URL
```

Generate commit message summary from:
```bash
git log main..[branch-name] --oneline
git diff --stat main..[branch-name]
```

## Option 3 — Keep Branch

```bash
# No cleanup — just report status
git status
git log --oneline main..[branch-name]
echo "Branch [name] retained. Resume with: git checkout [name]"

# If in a worktree — leave the worktree intact
git worktree list
```

## Option 4 — Discard

**Requires explicit confirmation:**
```
WARNING: This will permanently delete:
  - Branch: [branch-name]
  - [X] uncommitted/committed changes
  - Worktree: [path] (if applicable)

This cannot be undone. Type the branch name to confirm: ____
```

After confirmation:
```bash
# Remove worktree first (if applicable)
git worktree remove --force [worktree-path]

# Delete the branch
git branch -D [branch-name]
```

## Commit Message Generation

For merge and PR options, generate the commit message from the work done:

```bash
git log main..[branch-name] --oneline
git diff --stat main..[branch-name]
```

Format:
```
[type]([scope]): [short description]

[What changed and why — from commit log and diff]

Closes: #[issue number if known]
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`

## Proactive Triggers

Surface these without being asked:
- All plan tasks are marked `completed` → activate immediately
- `verification-before-completion` passes for the full branch → activate
- `subagent-driven-development` completes the final branch review → activate
- User says "I'm done with this feature" → activate
- User has been on a branch for a long time without finishing → surface this skill

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "I'm done" | Gates check → 4-option menu → executed choice |
| "Merge this" | Direct to Option 1 with confirmation |
| "Open a PR" | Direct to Option 2 with generated description |
| "Discard this" | Warning → explicit confirmation → cleanup |

## Quality Loop

Before executing any option:
1. Did `git status` show a clean working tree? No → address uncommitted changes.
2. Did the final test run pass? No → invoke `systematic-debugging`.
3. Was `verification-before-completion` invoked? No → invoke it.
4. Is the commit message descriptive and accurate? No → revise it.

## Related Skills

- `verification-before-completion` — must precede this skill
- `requesting-code-review` — final branch review before this skill
- `using-git-worktrees` — handles worktree cleanup in Options 1 and 4
- `executing-plans` / `subagent-driven-development` — trigger this skill on completion
