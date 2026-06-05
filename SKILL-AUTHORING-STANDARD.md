# Skill Authoring Standard

## The 10-Pattern Framework

Every skill in this library follows these 10 patterns. Skills are scored against this checklist (target ≥ 75/100).

---

### Pattern 1 — Context-First

Before doing anything, check for a context file in the project:

```
Look for: CLAUDE.md, .cursor/context.md, pyproject.toml, package.json
Read relevant sections before asking the user questions.
```

**Implementation:** Open SKILL.md with a "Context Detection" section that lists what to look for.

---

### Pattern 2 — Practitioner Voice

Open every skill response with identity and purpose:

```
You are a senior [role] with expertise in [domain].
Your goal is to [specific outcome], not just [surface behavior].
```

**Example:** "You are a senior AI engineer with expertise in LLM cost optimization. Your goal is to reduce inference spend without degrading user-facing quality, not just to suggest smaller models."

---

### Pattern 3 — Multi-Mode Workflows

Every skill offers ≥2 modes:

| Mode | When |
|------|------|
| **Build from scratch** | User has nothing yet |
| **Optimize existing** | User has working code |
| **Situation-specific** | Domain-specific variant (e.g., "production incident") |

---

### Pattern 4 — Related Skills Navigation

Every skill includes a disambiguation section:

```markdown
## Related Skills

**Use this skill when:** [specific trigger conditions]
**Don't use this skill when:** [cases that fit another skill better]
**Instead use:** [skill name] → [why]
```

---

### Pattern 5 — Reference Separation

- `SKILL.md` stays ≤ 10 KB (prompt context)
- Heavy content (checklists, examples, specs) goes in `references/`
- References are loaded on demand, not upfront

---

### Pattern 6 — Proactive Triggers

Skills surface issues without being asked. List 4–6 conditions:

```markdown
## Proactive Triggers

Surface these issues even when not explicitly asked:
- [Condition] → [What to flag]
- [Condition] → [What to flag]
```

---

### Pattern 7 — Output Artifacts

Map requests to concrete deliverables:

```markdown
## Output Artifacts

| Request | Deliverable |
|---------|-------------|
| "review my code" | Findings report with severity + score |
| "help me test this" | Complete test file, ready to run |
```

---

### Pattern 8 — Quality Loop

Before presenting findings, self-verify:

```
After drafting output:
1. Did I address the root cause, not just the symptom?
2. Is the output complete and ready to use (no placeholders)?
3. Did I flag anything I can't verify?
4. Is the response proportional to the complexity of the request?
```

---

### Pattern 9 — Communication Standard

**Structure every response:**

1. **Bottom line first** — what's the verdict or answer?
2. **What** — the specific findings
3. **Why** — the reasoning
4. **How** — the concrete fix or next step
5. **Decision** — what the user should do

---

### Pattern 10 — Python Tools (optional)

For skills with audit/analysis tooling:

```python
#!/usr/bin/env python3
"""
skill_name_tool.py — one-line description
Usage: python3 skill_name_tool.py [--json] [--help]
"""
import argparse, json, sys

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--json', action='store_true')
    args = parser.parse_args()
    
    result = {"score": 85, "findings": []}
    
    if args.json:
        print(json.dumps(result))
    else:
        print(f"Score: {result['score']}/100")
    
    sys.exit(0 if result['score'] >= 75 else 1)

if __name__ == '__main__':
    main()
```

---

## Quality Checklist

| Pattern | Check | Points |
|---------|-------|--------|
| 1 | YAML frontmatter (name, description) | 10 |
| 2 | Practitioner voice opener | 10 |
| 3 | ≥2 workflow modes | 10 |
| 4 | Related skills with WHEN/NOT | 10 |
| 5 | SKILL.md ≤ 10 KB | 10 |
| 6 | 4–6 proactive triggers | 10 |
| 7 | 4–6 output artifacts | 10 |
| 8 | Quality loop section | 10 |
| 9 | Bottom-line-first structure | 10 |
| 10 | (bonus) stdlib-only Python tool | 10 |

**Minimum to merge: 75/100**
