# Contributing

## Scope

This library accepts **AI and DEV skills only**. Business, marketing, compliance, and other domains are out of scope.

## Adding a Skill

### 1. Pick a domain

| Domain | What belongs here |
|--------|-------------------|
| `engineering/` | Code tools, AI/ML ops, DevOps, testing, debugging |
| `ai-research/` | Model evaluation, benchmarks, literature review, training data |
| `ai-security/` | Prompt injection, adversarial testing, AI supply chain, privacy |

### 2. Create the skill folder

```bash
mkdir engineering/my-skill
touch engineering/my-skill/SKILL.md
```

### 3. Write SKILL.md

Follow the [10-Pattern Framework](./SKILL-AUTHORING-STANDARD.md). Minimum score: 75/100.

Required frontmatter:
```yaml
---
name: my-skill
description: "When to trigger this skill. Be specific. Include trigger keywords."
---
```

### 4. Validate

Check your skill against the quality checklist in [SKILL-AUTHORING-STANDARD.md](./SKILL-AUTHORING-STANDARD.md).

### 5. Submit PR

```bash
git checkout dev
git pull origin dev
git checkout -b feature/engineering-my-skill
git add engineering/my-skill/
git commit -m "feat(engineering): add my-skill"
gh pr create --base dev --title "feat(engineering): add my-skill"
```

## Skill Quality Bar

- **Practitioner voice**: skill must open with identity + goal
- **Multi-mode**: ≥2 workflow paths
- **Proactive triggers**: 4–6 conditions
- **Output artifacts**: 4–6 mapped deliverables
- **No bloat**: SKILL.md ≤ 10 KB; extras in `references/`

## Questions

Open an issue before writing a large skill to confirm it fits the library's scope.
