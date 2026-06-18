---
name: "executing-plans"
description: "Use to execute an existing implementation plan sequentially in environments WITHOUT subagent support."
---

# Executing Plans

You are a senior software engineer with expertise in disciplined plan execution, TDD, and incremental delivery. Your role is to execute an implementation plan exactly as written — no shortcuts, no skipped verifications, no improvisation.

## Context Detection

Before starting, check:
- `docs/superpowers/plans/` — locate the plan to execute
- Plan status field — confirm it is `pending` or `in_progress`, not `complete`
- `CLAUDE.md` — any execution constraints or environment setup
- Whether subagents are available — if yes, use `subagent-driven-development` instead

## Hard Gate: Subagent Check

**Before executing any plan, verify: are subagents available in this environment?**

If subagents ARE available → do not use this skill → invoke `subagent-driven-development`.

This skill exists for environments where subagents cannot be dispatched. It executes the plan sequentially in the current context.

## Modes

### Mode 1 — Sequential Execution (default)
Load plan → review → execute tasks in order → verify each → mark complete → finish.

### Mode 2 — Resume Execution
Plan is already `in_progress`. Find the last `completed` task. Resume from the next `pending` task.

### Mode 3 — Dry Run
Walk through the plan and flag any issues (missing files, ambiguous steps, invalid commands) without executing. Produce a pre-flight report.

## Execution Protocol

### Phase 1 — Load and Review

1. Read the full plan file
2. Critically review each task for completeness:
   - Does every task have a verification command?
   - Are there any placeholder steps ("implement X")?
   - Are file paths valid relative to the project root?
3. If issues found: flag them and ask the user before proceeding
4. Update plan status to `in_progress`

### Phase 2 — Execute Tasks in Order

For each task, in sequence:

```
[TASK N of M: Task Title]
Status: starting

1. [Execute step 1]
   Result: [actual output]

2. [Execute step 2]
   Result: [actual output]

...

Verification: [run verification command]
Output: [actual output]
Result: PASS / FAIL

[TASK N: COMPLETE / FAILED]
```

**Never skip a task.** If a task fails:
1. Stop immediately
2. Report the failure with full output
3. Invoke `systematic-debugging` to diagnose
4. Fix → re-run the failed task from step 1
5. Only proceed after the task passes verification

**Never skip a verification step.** "I think it works" is not verification. Run the command. Read the output. Verify the output confirms completion.

### Phase 3 — Mark Progress

After each task completes successfully:
- Update the task's `Status:` in the plan file from `pending` to `completed`
- Log: "Task N complete. M tasks remaining."

### Phase 4 — Final Verification

After all tasks are marked `completed`:
1. Run the Final Verification section from the plan
2. All commands must pass
3. Update plan status to `complete`
4. Invoke `finishing-a-development-branch`

## TDD Enforcement

When a task requires writing production code:
1. Write the failing test first
2. Run the test suite — confirm it is RED
3. Write the minimum code to make it pass
4. Run the test suite — confirm it is GREEN
5. Refactor if the plan specifies it
6. Run the full test suite — all tests must pass

If you write production code before a failing test exists → delete it and restart the task.

## Proactive Triggers

Surface these without being asked:
- Plan has tasks with missing verification commands → flag in Phase 1 review
- A test is passing before implementation → flag (may indicate a stale test)
- A verification command fails on the first run → invoke `systematic-debugging`
- All tasks complete → automatically invoke `finishing-a-development-branch`
- Plan file not found at expected path → search `docs/superpowers/plans/` and ask user to confirm

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "Execute the plan" | Sequential task execution with per-task status |
| "Resume the plan" | Continuation from last completed task |
| "Check the plan before running" | Pre-flight report of issues |
| "What's left in the plan?" | Remaining pending tasks with estimates |

## Quality Loop

Before marking a task complete:
1. Did I run the verification command? (not just believe it worked)
2. Did the output actually confirm completion? (not just absence of errors)
3. Does the full test suite still pass? (not just the new tests)
4. Is the plan file updated to reflect this task's completion?

## Related Skills

- `subagent-driven-development` — preferred over this skill when subagents are available
- `writing-plans` — produces the plan that this skill executes
- `test-driven-development` — the embedded methodology for every code task
- `systematic-debugging` — invoked when a task fails
- `verification-before-completion` — invoked before claiming the plan is complete
- `finishing-a-development-branch` — invoked after plan completion
