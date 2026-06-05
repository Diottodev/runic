# Conventions

Mandatory rules for all contributors. PRs that violate these are rejected without review.

## Skill File Rules

1. **Every skill must have `SKILL.md`** with valid YAML frontmatter (`name`, `description`)
2. **SKILL.md ≤ 10 KB** — heavy content goes in `references/` loaded on demand
3. **Practitioner voice** — open with "You are an expert in X. Your goal is Y."
4. **Multi-mode** — every skill defines ≥2 workflows (build from scratch / optimize existing)
5. **Proactive triggers** — list 4–6 conditions where skill surfaces issues unprompted
6. **Output artifacts** — map 4–6 common requests to specific deliverables
7. **Related skills** — every skill links to adjacent skills with WHEN/NOT disambiguation
8. **Quality loop** — skill self-verifies before presenting findings

## Domain Rules

1. AI/DEV skills only — no business, marketing, or compliance skills
2. Domain folders: `engineering/`, `ai-research/`, `ai-security/`
3. Each domain must have `.claude-plugin/plugin.json` for standalone installs
4. Cross-reference skills bidirectionally

## Python Tools (optional)

- Standard library only — no pip installs
- CLI-first: `python3 script.py --help`
- JSON output: `--json` flag required
- Exit codes: 0=success, 1=warnings, 2=critical
- Scoring: 0–100 scale

## Commit Format (Conventional Commits)

```
feat(engineering): add llm-cost-optimizer skill
fix(ai-security): correct prompt injection detection
docs(engineering): update code-review references
```

## Branch Strategy

```
main ← dev ← feature/domain-skill-name
```

All PRs target `dev`. Squash before merging to `main`.
