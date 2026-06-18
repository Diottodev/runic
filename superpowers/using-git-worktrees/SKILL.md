---
name: "using-git-worktrees"
description: "Use to isolate development work in a git worktree — prevents context contamination between tasks and ensures clean test baselines."
---

# Using Git Worktrees

You are a senior software engineer with expertise in git internals, multi-branch development workflows, and CI/CD isolation strategies. Your role is to set up clean, isolated development environments using git worktrees so that every task starts from a known-good baseline.

## Context Detection

Before creating a worktree, check:
- `GIT_DIR` and `GIT_COMMON_DIR` environment variables — if they differ, you are already in a worktree
- `git worktree list` — to see existing worktrees and avoid conflicts
- `CLAUDE.md` — any project-specific setup commands (migrations, seed data, etc.)
- `package.json` / `Cargo.toml` / `pyproject.toml` — to determine dependency install commands

## When to Use This Skill

**Use this skill when:**
- Starting any new feature or bug fix that will take more than one task
- Working on two features simultaneously without them interfering
- Running a long-running task while keeping the main tree clean
- `subagent-driven-development` is being used (each subagent should work in isolation)

**Do not use this skill when:**
- You are already in an isolated worktree (`GIT_DIR != GIT_COMMON_DIR`)
- The task is a single-file, single-commit change with no test impact

## Modes

### Mode 1 — Create and Setup (default)
Create a new worktree, install dependencies, run baseline tests.

### Mode 2 — Detect and Use
Check if already in a worktree. If yes, report status and proceed. If no, activate Mode 1.

### Mode 3 — Cleanup
Merge or discard a worktree created by Superpowers after work is complete.

## Mode 1 — Create and Setup Protocol

### Step 1 — Detect Isolation
```bash
# Check if already isolated
echo "GIT_DIR: $GIT_DIR"
echo "GIT_COMMON_DIR: $GIT_COMMON_DIR"
git rev-parse --is-inside-work-tree
```

If `GIT_DIR` contains `.git/worktrees/` — already isolated. Report and proceed without creating another worktree.

### Step 2 — Determine Worktree Path
Convention: `../worktrees/<feature-name>`

Feature name rules:
- Lowercase, hyphenated
- Descriptive: `add-payment-webhooks`, not `feature-123`
- Include ticket number if available: `gh-456-fix-auth-timeout`

```bash
FEATURE_NAME="<feature-name>"
WORKTREE_PATH="../worktrees/$FEATURE_NAME"
```

### Step 3 — Create the Worktree
```bash
# Create a new branch in a new worktree
git worktree add -b "$FEATURE_NAME" "$WORKTREE_PATH" main

# Or from a specific base
git worktree add -b "$FEATURE_NAME" "$WORKTREE_PATH" origin/main
```

### Step 4 — Detect Project Type and Install Dependencies
```bash
cd "$WORKTREE_PATH"

# Node.js
if [ -f "package.json" ]; then
  npm install  # or pnpm install / yarn install
fi

# Python
if [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
  pip install -e ".[dev]"  # or pip install -r requirements.txt
fi

# Rust
if [ -f "Cargo.toml" ]; then
  cargo fetch  # dependencies are compiled on first build
fi

# Go
if [ -f "go.mod" ]; then
  go mod download
fi
```

### Step 5 — Run Baseline Tests
```bash
# Run the full test suite to establish a baseline
npm test  # or pytest / cargo test / go test ./...
```

**This is mandatory.** If tests fail before any work begins:
- Stop and report the failures
- Do not start development on a broken baseline
- Investigate the failures before proceeding

### Step 6 — Report and Proceed
```
Worktree created: $WORKTREE_PATH
Branch: $FEATURE_NAME
Base: main (SHA: <sha>)
Dependency install: complete
Baseline tests: X passed, 0 failed

Ready for development.
```

## Mode 3 — Cleanup Protocol

After work is complete (invoked by `finishing-a-development-branch`):

```bash
# Merge path
git checkout main
git merge --no-ff "$FEATURE_NAME"
git worktree remove "$WORKTREE_PATH"
git branch -d "$FEATURE_NAME"

# Discard path
git worktree remove --force "$WORKTREE_PATH"
git branch -D "$FEATURE_NAME"
```

## Proactive Triggers

Surface these without being asked:
- User says "let's start working on X" → activate before any code is written
- `subagent-driven-development` is starting → activate to isolate the work
- User is working on two features and mentions interference → suggest parallel worktrees
- Baseline tests fail → stop and report before proceeding
- User forgets to clean up old worktrees → `git worktree list` and flag stale ones

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "Start working on feature X" | Created worktree at ../worktrees/X, baseline tests passing |
| "Set up isolation" | Worktree + deps + baseline report |
| "Clean up after merge" | Worktree removed, branch deleted |
| "List my worktrees" | `git worktree list` output with branch status |

## Quality Loop

Before reporting the worktree is ready:
1. Did baseline tests pass? No → stop and report failures.
2. Are dependencies installed correctly? Run `npm ls` or equivalent to verify.
3. Is the branch based on the correct commit? Run `git log --oneline -3`.
4. Is the worktree path conflict-free? `git worktree list` to confirm.

## Related Skills

- `using-superpowers` — triggers this skill at the start of every new branch
- `subagent-driven-development` — uses worktrees for task isolation
- `finishing-a-development-branch` — triggers Mode 3 cleanup
- `executing-plans` — should run inside an isolated worktree
