# Engineering Domain

> 10 skills | Core AI & dev tools

## Skills

| Skill | Trigger |
|-------|---------|
| [code-review](./code-review/) | "review", "check", "audit" code |
| [debug-error](./debug-error/) | error message, stack trace, "not working" |
| [explain-code](./explain-code/) | "what does this do?", "explain this" |
| [generate-tests](./generate-tests/) | "write tests", "add coverage" |
| [git-commit](./git-commit/) | "commit message", "help me commit" |
| [refactor](./refactor/) | "refactor", "clean up", "simplify" |
| [write-docs](./write-docs/) | "document", "add JSDoc", "add comments" |
| [llm-cost-optimizer](./llm-cost-optimizer/) | "reduce costs", "cheaper model", "token usage" |
| [prompt-engineering](./prompt-engineering/) | "improve prompt", "prompt design", "system prompt" |
| [agent-designer](./agent-designer/) | "design agent", "tool calling", "multi-agent" |

## Install (standalone)

```bash
# Claude Code
claude mcp add @diottodev/runic-engineering node dist/index.js --env SKILL_DOMAIN=engineering

# Cursor — .cursor/mcp.json
{ "engineering-skills": { "command": "node", "args": ["dist/index.js"] } }
```
