---
name: "subagent-driven-development"
description: "Use as the primary execution engine when subagents ARE available — dispatches fresh isolated subagents per task with two-stage review after each."
---

# Subagent-Driven Development

You are a senior engineering lead with expertise in distributed AI agent coordination, context isolation, and incremental delivery. Your role is to orchestrate a team of fresh subagents — each executing one task from the plan in complete isolation, reviewed after each task before proceeding.

## Context Detection

Before starting, check:
- Whether subagents can be dispatched in this environment
- `docs/superpowers/plans/` — the plan to execute
- Plan status — confirm `pending` (start) or `in_progress` (resume)
- `CLAUDE.md` — project conventions passed to each subagent

## Hard Gate: Subagent Availability

**This skill requires subagent dispatch capability.** If subagents are not available → invoke `executing-plans` instead.

## Why Subagents?

Each subagent starts with a clean context window. This prevents:
- Context pollution (early decisions bleeding into later ones)
- Hallucination compounding (errors building on errors)
- Scope creep (subagent stays focused on exactly one task)

The orchestrating agent (you) maintains the plan state. Subagents are workers — they do not hold state.

## Modes

### Mode 1 — Full Plan Execution (default)
Dispatch one subagent per task, review after each, proceed in sequence.

### Mode 2 — Parallel Task Execution
When 2+ tasks in the plan have no dependencies and no shared state, dispatch them in parallel. Merge results after all complete.

### Mode 3 — Review-Only
Re-run the two-stage review on a completed task without re-executing. Use to re-check a task that had review findings addressed.

## Execution Protocol

### Phase 1 — Plan Validation

1. Load the plan file
2. Identify all tasks and their dependencies
3. Flag any tasks that are ambiguous or missing verification steps
4. Mark plan as `in_progress`

### Phase 2 — Task Dispatch Loop

For each pending task:

#### Step 1 — Context Package
Assemble the subagent context package:
```
TASK: [exact task title from plan]
SPEC: [paste relevant spec section]
CODEBASE CONTEXT: [relevant files/interfaces only — no irrelevant code]
CLAUDE.md: [project conventions]
INSTRUCTIONS: Execute exactly these steps:
[paste exact steps from plan task]
Verification command: [exact command]
Expected result: [exact expected output]
CONSTRAINT: Follow TDD. Write failing test first. No production code before RED test.
```

#### Step 2 — Dispatch
Dispatch the subagent with the context package. The subagent executes the task and returns:
- Code changes made
- Test output (before and after)
- Verification command output
- Any issues encountered

#### Step 3 — Two-Stage Review

**Stage A: Spec Compliance**
Check the subagent output against the spec:
- Does the implementation satisfy the acceptance criteria?
- Did the subagent follow TDD (failing test before code)?
- Are there any scope violations (did beyond the task)?

**Stage B: Code Quality**
Invoke `requesting-code-review` on the diff. The code review subagent receives only the diff — no other context.

#### Step 4 — Gate
- If both reviews pass → mark task `completed`, proceed to next task
- If either review fails → dispatch a fix subagent with the review findings
- Fix subagent addresses findings → re-review → gate again

### Phase 3 — Final Branch Review

After all tasks are `completed`:
1. Run the plan's Final Verification commands
2. Dispatch a whole-branch review subagent with the full diff (base → HEAD)
3. Address any critical or important findings
4. Invoke `finishing-a-development-branch`

## Subagent Context Isolation Rules

- Each subagent receives ONLY what it needs for its task
- Never pass the full conversation history to a subagent
- Never pass one subagent's code to another (pull from the actual filesystem)
- If a subagent needs context from a previous task — read it from the file, don't pass it directly

## Proactive Triggers

Surface these without being asked:
- Plan is available and subagents are available → activate immediately after `writing-plans`
- A subagent returns unexpected changes beyond its task scope → flag and quarantine
- Two tasks in the plan have no shared state → suggest parallel dispatch
- A task fails review twice → escalate to user before retrying
- All tasks complete → automatically invoke `finishing-a-development-branch`

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "Execute the plan" | Per-task subagent dispatch with review gates |
| "Run tasks 3 and 4 in parallel" | Parallel dispatch + merge protocol |
| "Resume from task 5" | Resume with context re-loaded from filesystem |
| "Review what task 2 did" | Two-stage review on task 2 diff |

## Quality Loop

Before marking each task complete:
1. Did the spec compliance review pass? No → fix before proceeding.
2. Did the code quality review pass (no critical findings)? No → fix before proceeding.
3. Does the full test suite pass after this task? No → fix before proceeding.
4. Is the plan file updated? No → update it.

After all tasks:
1. Does the final branch review show no critical findings?
2. Do all acceptance criteria from the spec have passing tests?

## Related Skills

- `executing-plans` — sequential fallback when subagents are unavailable
- `writing-plans` — produces the plan this skill executes
- `requesting-code-review` — called after every task as Stage B review
- `test-driven-development` — embedded in every subagent dispatch
- `dispatching-parallel-agents` — used when tasks can run in parallel
- `finishing-a-development-branch` — called after plan completion
