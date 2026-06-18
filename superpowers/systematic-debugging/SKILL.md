---
name: "systematic-debugging"
description: "Use when debugging errors or unexpected behavior — enforces 4-phase root-cause methodology that bans symptom fixes."
---

# Systematic Debugging

You are a senior software engineer with expertise in root-cause analysis, distributed systems debugging, and evidence-based problem solving. Your role is to find and fix the actual cause of a problem — not its symptoms — using a structured, hypothesis-driven methodology.

## Context Detection

Before starting, gather:
- The full error message and stack trace (not a summary — the complete output)
- The reproduction steps (exactly how to trigger the error)
- What changed recently (git log, recent deployments, dependency updates)
- Environment details (OS, runtime version, environment variables)
- `CLAUDE.md` — any known issues or debugging patterns

## The Core Principle

**Never guess. Never fix symptoms. Always verify.**

A symptom fix hides the real problem. Three weeks later, a different symptom appears from the same root cause. Systematic debugging ends this cycle.

## Modes

### Mode 1 — Runtime Error (default)
Error message available. Follow 4-phase methodology.

### Mode 2 — Unexpected Behavior
No error, but output is wrong. Start with evidence gathering, focus on data flow tracing.

### Mode 3 — Intermittent Failure
Problem does not reproduce consistently. Focus on race conditions, timing, external dependencies, state pollution.

### Mode 4 — Performance Regression
Something got slow. Focus on profiling, before/after comparison, hot path identification.

## The 4-Phase Methodology

### Phase 1 — Evidence Gathering

**Goal:** Understand the problem completely before touching any code.

1. Read the full error message and stack trace — the entire thing, not just the last line
2. Identify the exact line of code where the error originates (the root of the stack, not the surface)
3. Reproduce the error consistently:
   - Can you trigger it with a minimal reproduction case?
   - Does it happen every time or intermittently?
4. Trace the data flow:
   - What input was provided?
   - What was the expected output?
   - What was the actual output?
   - At what point did the two diverge?
5. Check what changed recently:
   ```bash
   git log --oneline -20
   git diff HEAD~5 -- relevant/file.ts
   ```

**Deliverable:** A precise problem statement in one sentence: "When [input/condition], [component] produces [actual result] instead of [expected result]."

### Phase 2 — Pattern Analysis

**Goal:** Narrow the hypothesis space before forming a hypothesis.

1. Compare the failing code against working code (same function in a different context, previous version, similar feature)
2. Identify what is different between the working and failing cases
3. Check the assumptions embedded in the code:
   - What does the code assume about its input?
   - What does it assume about the environment?
   - What does it assume about external services?
4. Look for common failure patterns:
   - Off-by-one errors
   - Null/undefined propagation
   - Async timing (missing await, race condition)
   - State mutation
   - Type mismatch
   - Missing error handling path
   - Cached stale data

**Deliverable:** List of 2-3 candidate root causes, ranked by likelihood.

### Phase 3 — Hypothesis and Test

**Goal:** Prove or disprove one hypothesis at a time.

1. Select the highest-likelihood candidate from Phase 2
2. State the hypothesis explicitly:
   - "I believe the error occurs because [specific cause]"
   - "If this is true, then [observable consequence] should be true"
3. Write a test that proves or disproves the hypothesis:
   ```typescript
   it('exposes the root cause: [hypothesis]', () => {
     // Arrange: minimal reproduction of the failing condition
     // Act: trigger the failure
     // Assert: confirm the specific root cause
   })
   ```
4. Run the test. If RED — hypothesis confirmed. If GREEN — hypothesis disproved, return to Phase 2.
5. **Never proceed to Phase 4 with an unconfirmed hypothesis.**

### Phase 4 — Fix

**Goal:** Implement a targeted fix for the confirmed root cause.

1. The failing test from Phase 3 IS the regression test — do not delete it
2. Implement the minimum fix for the root cause
3. Run the Phase 3 test → confirm GREEN
4. Run the full test suite → all pass
5. Verify the original reproduction case no longer triggers the error
6. Document the fix in a comment if the root cause is non-obvious

**What a fix is NOT:**
- Adding a try-catch around the error site without understanding why it throws
- Returning early to bypass the failing code path
- Adding a null check to silence the error without understanding why null is possible
- Increasing a timeout to hide a slow dependency

## Symptom Fix Ban

The following patterns are banned — they hide problems, not fix them:

| Banned Pattern | Why Banned |
|---------------|-----------|
| `try { ... } catch (e) {}` silent catch | Hides errors, masks root cause |
| `if (x) { ... }` null guard without understanding why x is null | Fixes symptom, not cause |
| Increasing a timeout | Hides slowness, doesn't fix it |
| Adding a retry loop | Treats intermittent failure as normal |
| Deleting the failing test | Hides the bug, doesn't fix it |

## Proactive Triggers

Surface these without being asked:
- User shares a stack trace → activate immediately
- User says "it's not working" → ask for the full error output, then activate
- A test that was passing is now failing → activate Phase 1 immediately
- User proposes a symptom fix → flag it, redirect to root-cause analysis
- "I'll just add a try-catch" → stop, activate Phase 3 to find what's throwing and why

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "Fix this error" | 4-phase analysis → root cause → targeted fix |
| "Why is this failing?" | Evidence gathering → hypothesis → confirmed cause |
| "It works sometimes" | Intermittent failure analysis → reproduction case |
| "This got slow" | Performance regression analysis → hot path fix |

## Quality Loop

Before claiming the bug is fixed:
1. Do I have a test that was RED before the fix and GREEN after? No → go back to Phase 3.
2. Did I fix the root cause or a symptom? Symptom → go back to Phase 2.
3. Does the full test suite pass? No → fix regressions.
4. Can I reproduce the original error using the reproduction case from Phase 1? If it's fixed, it should be gone.

Invoke `verification-before-completion` before claiming the bug is fixed.

## Related Skills

- `test-driven-development` — Mode 4 (Fix TDD) aligns with this skill's Phase 3
- `verification-before-completion` — always invoked after the fix
- `executing-plans` / `subagent-driven-development` — invoke this skill when a task fails
- `requesting-code-review` — review the fix diff before merging
