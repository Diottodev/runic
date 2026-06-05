# @diottodev/runic — AI & Dev Skills Library

> **v1.0.0** | MIT License | 13 skills · 3 domains

## Navigation

| Domain | Skills | Description |
|--------|--------|-------------|
| [engineering/](./engineering/) | 10 | Core engineering & AI tools |
| [ai-research/](./ai-research/) | 2 | AI evaluation & research |
| [ai-security/](./ai-security/) | 1 | AI-specific security |

## Quick Install

```bash
# Claude Code
claude mcp add @diottodev/runic node dist/index.js

# Cursor — add to .cursor/mcp.json
{ "@diottodev/runic": { "command": "node", "args": ["dist/index.js"] } }
```

## Roadmap

- v1.1.0 — RAG architect, model fine-tuning guide
- v1.2.0 — Python audit tools per skill
- v1.3.0 — VS Code / Windsurf adapters

## Architecture

Skills follow the **10-Pattern Framework** (see [SKILL-AUTHORING-STANDARD.md](./SKILL-AUTHORING-STANDARD.md)):
context-first → practitioner voice → multi-mode workflows → proactive triggers → output artifacts → quality loop.

Each domain has its own `.claude-plugin/plugin.json` for standalone installation.
