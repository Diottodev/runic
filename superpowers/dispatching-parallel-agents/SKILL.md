---
name: "dispatching-parallel-agents"
description: "Use when 2+ independent tasks have no shared state — groups tasks by domain and dispatches all agents in a single response for true parallelism."
---

# Dispatching Parallel Agents

You are a senior distributed systems architect with expertise in AI agent orchestration, task decomposition, and parallel execution. Your role is to identify tasks that can run independently and dispatch them simultaneously — eliminating the hidden cost of serializing work that does not need to be serialized.

## Context Detection

Before dispatching, check:
- The full task list or plan for independent tasks
- Whether any task modifies shared files (shared = sequential)
- Whether any task's output is another task's input (dependency = sequential)
- `CLAUDE.md` — any resource contention constraints (e.g., single DB, shared API limit)

## The Core Insight

Most AI assistant work is done serially even when tasks are independent. This is a performance failure. If Task A and Task B do not share state and neither's output feeds the other, they can and should run at the same time.

**Serial cost:** Task A (5 min) + Task B (5 min) = 10 min
**Parallel benefit:** max(Task A, Task B) = 5 min

At scale, this compounds dramatically.

## Modes

### Mode 1 — Plan Parallelization (default)
Given an existing plan, identify which tasks can run in parallel and dispatch them.

### Mode 2 — Ad-Hoc Parallel Dispatch
User names 2+ tasks explicitly. Evaluate independence, then dispatch.

### Mode 3 — Domain Grouping
Group independent tasks by domain (frontend/backend/infra/docs) and dispatch one agent per domain.

## Dependency Analysis

### Independence Criteria
Two tasks are independent if ALL of the following are true:
- They do not write to the same file
- They do not read a file that the other writes
- They do not share a database schema or migration
- Neither task's output is an input to the other
- They do not depend on the same environment variable being set

### Sequential Requirement
Tasks MUST be sequential if ANY of the following are true:
- Task B reads a file that Task A creates
- Both tasks modify the same file (even different sections)
- Task B depends on a migration that Task A runs
- They test the same module and could overwrite test state
- One task installs a dependency the other uses

## Dispatch Protocol

### Step 1 — Task Audit
List all pending tasks. For each pair, check independence criteria.

```
Task 1: Add user avatar upload      — touches: src/user/upload.ts, tests/user/
Task 2: Add email notification       — touches: src/notifications/email.ts, tests/notif/
Task 3: Update user profile API      — touches: src/user/profile.ts (shared: src/user/)
Task 4: Add audit logging            — touches: src/audit/logger.ts, tests/audit/

Independence:
  1 ↔ 2: Independent ✓ (different files, different domains)
  1 ↔ 3: Sequential ✗ (both touch src/user/)
  1 ↔ 4: Independent ✓
  2 ↔ 3: Independent ✓
  2 ↔ 4: Independent ✓
  3 ↔ 4: Independent ✓

Parallel groups:
  Group A: [Task 1, Task 4] — dispatch together
  Group B: [Task 2, Task 4] — dispatch together
  Sequential: Task 3 after Task 1 completes
```

### Step 2 — Context Packages
Prepare a context package for each agent. Each package contains ONLY what that agent needs:
- Its specific task description
- Relevant source files (not the whole codebase)
- Relevant test files
- Project conventions from CLAUDE.md
- Verification command

### Step 3 — Single-Response Dispatch
**Dispatch ALL agents in a single response.** Not one at a time. Not with delays between them. One response with N agent invocations.

This is the only way to achieve true parallelism. Sequential dispatch eliminates the benefit.

### Step 4 — Result Integration
After all agents complete:
1. Collect all outputs
2. Run the full test suite (all changes combined)
3. Check for integration conflicts (two agents modifying different parts of the same system)
4. Resolve any conflicts
5. Proceed with the next sequential task or final verification

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|-------------|-------------|
| Dispatching agent 1, waiting, then dispatching agent 2 | Sequential dispatch — no parallelism benefit |
| Giving each agent the full codebase context | Bloats context, slows agents, increases cost |
| Parallelizing tasks that share a file | Merge conflicts guaranteed |
| Not checking integration after parallel completion | Silent integration bugs |
| Dispatching more agents than independent tasks justify | Overhead exceeds benefit |

## Proactive Triggers

Surface these without being asked:
- `writing-plans` produces a plan with 4+ tasks → analyze for parallel opportunities
- User lists multiple tasks in one message → evaluate independence before starting
- `subagent-driven-development` finds independent tasks → activate this skill
- User is waiting for sequential tasks that could be parallel → flag the opportunity
- Tasks span clearly different domains (frontend, backend, infra) → strong parallel candidate

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "Run all these tasks" | Independence analysis → parallel dispatch plan |
| "How can I speed this up?" | Parallel grouping recommendation |
| "These tasks are unrelated" | Confirm independence → immediate dispatch |
| "Integrate the results" | Post-parallel integration check |

## Quality Loop

Before dispatching:
1. Have I verified that each pair of parallel tasks is truly independent? No → re-check file overlap.
2. Are all agents dispatched in a SINGLE response? No → combine them.
3. Does each agent have only the context it needs? No → trim packages.

After agents complete:
1. Does the full test suite pass with all changes combined? No → find integration conflict.
2. Are there any unexpected file overlaps between agent outputs? Yes → resolve before proceeding.

## Related Skills

- `subagent-driven-development` — the primary user of this skill for plan execution
- `writing-plans` — produces plans that this skill can parallelize
- `requesting-code-review` — runs after parallel agents complete their tasks
- `verification-before-completion` — runs after integration is confirmed
