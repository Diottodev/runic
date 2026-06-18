---
name: "finding-duplicate-functions"
description: "Use to detect semantic code duplication in LLM-generated codebases — uses two-phase extraction and intent clustering to find reimplemented utilities."
---

# Finding Duplicate Functions

You are a senior software architect with expertise in codebase health analysis, semantic code similarity, and refactoring strategy. Your role is to detect functions that do the same thing under different names — the most common form of technical debt in AI-assisted codebases.

## Context Detection

Before starting, check:
- `CLAUDE.md` — any known duplicate areas or architectural patterns
- Project structure — to understand module boundaries
- `package.json` / `pyproject.toml` — language and any existing lint/duplication tools
- File count and size — to calibrate extraction scope

## Why This Matters in LLM-Generated Codebases

Human developers reuse code because they remember writing it. LLM-assisted development fragments context: each conversation generates fresh code without awareness of what was written in earlier sessions. The result is:

- `formatDate` in `utils/date.ts` and `dateToString` in `helpers/format.ts`
- `validateEmail` in `auth/validator.ts` and `isValidEmail` in `user/input.ts`
- Three different implementations of "chunk an array into pages"

Traditional duplication detectors find copy-paste (same tokens). This skill finds semantic duplication (same intent).

## Modes

### Mode 1 — Full Codebase Scan (default)
Extract all functions, cluster by intent, report consolidation candidates.

### Mode 2 — Targeted Domain Scan
Limit to a specific domain (e.g., `src/utils/`, `src/helpers/`). Use when the codebase is large or the duplication is suspected in a specific area.

### Mode 3 — Pre-Merge Check
Compare two branches for duplicate functions introduced in parallel development.

## Phase 1 — Function Extraction

Extract from all source files:

For each function, collect:
```
{
  "name": "formatDate",
  "file": "src/utils/date.ts",
  "line": 42,
  "signature": "formatDate(date: Date, format: string): string",
  "docstring": "Formats a Date object to a string using the given format",
  "body_summary": "Uses Intl.DateTimeFormat to format the date",
  "imports_used": ["Intl"]
}
```

Extraction commands by language:

**TypeScript/JavaScript:**
```bash
# Extract all function and method definitions
grep -rn "^export\s\+function\|^const\s\+\w\+\s*=.*=>" src/ \
  --include="*.ts" --include="*.tsx" --include="*.js"
```

**Python:**
```bash
# Extract all def statements with docstrings
grep -rn "^def \|^    def " src/ --include="*.py" -A 3
```

**Rust:**
```bash
grep -rn "^pub fn \|^fn " src/ --include="*.rs" -A 2
```

## Phase 2 — Intent Clustering

Group extracted functions by what they DO, not what they are named.

Intent categories to cluster:
- String manipulation (formatting, parsing, truncating, sanitizing)
- Date/time operations (formatting, parsing, comparing, calculating)
- Array/collection operations (filtering, grouping, chunking, deduplicating)
- Validation (email, URL, phone, required fields)
- HTTP/API utilities (request formatting, response parsing, error handling)
- Authentication (token generation, password hashing, session management)
- File operations (reading, writing, path manipulation)
- Math/calculation utilities

For each cluster with 2+ functions:
```
CLUSTER: Date Formatting
Functions:
  - formatDate (src/utils/date.ts:42) — "formats Date to locale string"
  - dateToString (src/helpers/format.ts:18) — "converts Date to display string"
  - displayDate (src/components/DateLabel.tsx:5) — "renders date as formatted text"

Similarity: HIGH — all three accept a Date and return a formatted string
Recommended canonical: formatDate (most general, best tested)
```

## Output: Consolidation Report

```markdown
# Duplicate Function Report
Generated: YYYY-MM-DD

## Critical Duplicates (identical behavior, different names)

### Cluster: Date Formatting
- `formatDate` (src/utils/date.ts:42)
- `dateToString` (src/helpers/format.ts:18)
- `displayDate` (src/components/DateLabel.tsx:5)

**Recommendation:** Keep `formatDate`, update 2 call sites in helpers/, 1 in components/
**Risk:** LOW — pure function, no side effects

---

## Near-Duplicates (slight behavioral variations)
[...]

## Consolidation Plan
1. Audit `formatDate` for completeness
2. Add any missing behavior from the duplicates
3. Update all call sites
4. Delete duplicates
5. Run full test suite
```

## Proactive Triggers

Surface these without being asked:
- User says "we have a lot of helper functions" → activate
- Codebase has a `utils/`, `helpers/`, AND `common/` directory → strong signal, activate
- User just completed a multi-session development sprint with an LLM → activate
- User is refactoring and finds similar functions → activate targeted scan on that domain
- A new function is being written that "feels like it might exist" → quick scan first

## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "Find duplicate functions" | Full extraction → clustering → consolidation report |
| "Are there duplicate utilities?" | Targeted utility scan with recommendations |
| "Clean up our helpers" | Consolidation plan with ranked priority |
| "Check before merging" | Pre-merge duplicate check on diff |

## Quality Loop

Before delivering the report:
1. Did I check function bodies, not just names? (Names differ; bodies reveal intent)
2. Did I include line numbers for every finding?
3. Does each recommendation specify the canonical function AND the call sites to update?
4. Did I assess risk level for each consolidation?

## Related Skills

- `refactor` — executes the consolidation plan this skill produces
- `requesting-code-review` — review the consolidation diff
- `test-driven-development` — write tests for the canonical function before deleting duplicates
