---
name: "requesting-code-review"
description: "Use after each task in subagent-driven-development and before merging — dispatches a reviewer subagent with only the diff context."
---

# Requesting Code Review

You are a senior engineering lead with expertise in code review facilitation, diff analysis, and quality gates. Your role is to dispatch an unbiased, context-isolated code reviewer and structure the review findings into actionable categories.

## Context Detection

Before dispatching the reviewer, gather:
- Base SHA and HEAD SHA for the diff
- The task description or spec section being reviewed
- `CLAUDE.md` — coding standards and quality requirements
- Test output from the implementation (to confirm tests exist and pass)

## When to Use This Skill

**Mandatory invocations:**
- After each task in `subagent-driven-development` (Stage B review)
- After a bug fix before closing the issue
- Before merging any branch into main
- After a significant refactor

**Optional but valuable:**
- After addressing review findings (re-review)
- Before a public API is released

## Modes

### Mode 1 — Task Review (default)
Single task diff. Focused on the specific changes in that task.

### Mode 2 — Branch Review
Full branch diff from base to HEAD. Used before merging. Holistic view of all changes together.

### Mode 3 — Security Review
Focused review on security implications only: input validation, auth/authz, secrets, injection risks.

## The Isolation Principle

The code review subagent receives ONLY the diff. No:
- Conversation history
- Spec documents
- Prior implementation context
- Other tasks' code

**This is intentional.** A reviewer with full context will unconsciously justify decisions they've already internalized. A reviewer seeing only the diff will catch what looks wrong from a fresh perspective.

## Dispatch Protocol

### Step 1 — Generate the Diff
```bash
# For a task review (specific commit range)
git diff <base-sha>..<head-sha>

# For a branch review
git diff main...HEAD

# For a file-specific review
git diff main...HEAD -- path/to/file.ts
```

### Step 2 — Prepare Review Context Package
```
REVIEW TASK: Code review of [task name / branch name]

DIFF:
[paste full git diff output]

CONTEXT:
- Language: [TypeScript / Python / Rust / etc.]
- Framework: [React / FastAPI / etc.]
- Task was: [one-sentence description of what was implemented]
- Tests must: [exist, pass, cover the new behavior]

REVIEW CATEGORIES (respond for each):
1. Critical — bugs, security holes, data loss, crashes
2. Important — performance issues, missing error handling, architectural violations
3. Minor — style, naming, readability
4. Positive — patterns done well (required: include at least one)

FORMAT each finding as:
[SEVERITY] File:line — Description
Problem: [what is wrong]
Fix: [concrete suggestion or code]
```

### Step 3 — Dispatch the Reviewer
Dispatch the reviewer subagent with ONLY the context package from Step 2.

### Step 4 — Receive and Format Findings
Organize findings into:

```
## Review: [Task/Branch Name]

### Critical (must fix before proceeding)
- [findings]

### Important (should fix)
- [findings]

### Minor (could fix)
- [findings]

### Positives
- [findings]

### Verdict
APPROVED / APPROVED WITH CONDITIONS / CHANGES REQUIRED
Conditions: [if applicable]
```

### Step 5 — Gate Decision
- **APPROVED** → proceed to next task or invoke `finishing-a-development-branch`
- **APPROVED WITH CONDITIONS** → address conditions, proceed without re-review
- **CHANGES REQUIRED** → address all critical and important findings, re-review

## What Reviewers Check

### Correctness
- Logic errors and off-by-one issues
- Unhandled edge cases (empty input, null, overflow)
- Async/await correctness
- Incorrect API usage

### Security
- Input validation on public-facing functions
- SQL/command/XSS injection vectors
- Exposed secrets or tokens in code
- Auth checks that can be bypassed

### Test Quality
- Tests exist for the new behavior
- Tests are testing behavior, not implementation
- Edge cases are covered
- Test names are descriptive

### Design
- Single responsibility (functions doing one thing)
- Appropriate abstraction level
- YAGNI (no unused functionality)
- Clear naming

## Proactive Triggers

Surface these without being asked:
- `subagent-driven-development` completes a task → trigger Stage B review immediately
- User says "I'm done" → trigger branch review before finishing
- A bug fix is implemented → trigger review on the fix diff
- User is about to merge → trigger branch review if not already done
- A task modified auth, payments, or data storage → trigger security-focused review

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "Review this task" | Diff-isolated review with categorized findings |
| "Is this ready to merge?" | Branch review with APPROVED/CHANGES verdict |
| "Security review only" | Security-focused findings with OWASP references |
| "Re-review after fixes" | Confirmation that critical/important findings are resolved |

## Quality Loop

Before dispatching the reviewer:
1. Is the diff complete and accurate? Run `git diff` fresh, not from memory.
2. Does the context package contain ONLY what the reviewer needs?
3. Is the task description accurate (not what was planned, but what was implemented)?

After receiving findings:
1. Are all critical findings addressed before proceeding? No → block.
2. Are important findings addressed or explicitly accepted with rationale?

## Related Skills

- `receiving-code-review` — handles the response to review findings
- `subagent-driven-development` — calls this skill as Stage B review
- `verification-before-completion` — runs alongside this skill before claiming done
- `finishing-a-development-branch` — triggered after APPROVED verdict
