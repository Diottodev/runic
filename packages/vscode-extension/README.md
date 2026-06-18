# Runic Skills — VS Code Extension

> 91 AI & Dev skills available as `/skill-name` slash commands in VS Code Copilot Chat.

## How to use

Type `@runic /skill-name` in VS Code Copilot Chat:

```
@runic /code-review
@runic /debug-error
@runic /generate-tests
@runic /refactor
@runic /prompt-engineering
```

Add context after the skill name:

```
@runic /code-review focus on security and performance
@runic /debug-error TypeError: Cannot read properties of undefined at auth.js:42
@runic /generate-tests for the UserService class
```

## Available skills (50 shown, 145 total)

| Skill | What it does |
|-------|-------------|
| `/code-review` | Review code for bugs, security, and quality |
| `/debug-error` | Diagnose errors and stack traces |
| `/generate-tests` | Generate unit tests (Arrange/Act/Assert) |
| `/refactor` | Clean Code, SOLID, DRY refactoring |
| `/explain-code` | Explain code at beginner → expert depth |
| `/git-commit` | Generate Conventional Commit messages |
| `/write-docs` | JSDoc, TSDoc, inline comments |
| `/prompt-engineering` | Design and improve LLM prompts |
| `/llm-cost-optimizer` | Analyze and reduce LLM inference costs |
| `/agent-designer` | Design AI agent architectures |
| `/security-guidance` | OWASP Top 10 security review |
| `/a11y-audit` | WCAG 2.2 accessibility audit |
| `/prompt-injection` | Detect and harden against prompt injection |
| `/benchmark-analyzer` | Interpret AI model benchmarks |
| `/model-eval` | Design LLM evaluation frameworks |
| `/data-quality-auditor` | Audit data pipelines for quality |
| `/agenthub` | Multi-agent collaboration |
| `/autoresearch-agent` | Autonomous experiment loops |
| `/chaos-engineering` | Chaos experiments and failure injection |
| `/docker-development` | Docker containerization best practices |
| `/terraform-patterns` | Infrastructure-as-code with Terraform |
| `/kubernetes-operator` | Build Kubernetes operators |
| `/slo-architect` | Define SLOs, SLIs, and error budgets |
| `/observability-designer` | Logs, metrics, traces design |
| `/feature-flags-architect` | Feature flag rollout strategies |
| `/mcp-server-builder` | Build MCP servers |
| `/rag-architect` | Design RAG pipelines |
| `/performance-profiler` | Profile and optimize performance |
| `/database-designer` | Relational and NoSQL schema design |
| `/api-design-reviewer` | REST/GraphQL API quality review |
| `/ci-cd-pipeline-builder` | GitHub Actions / GitLab CI pipelines |
| `/tdd-guide` | Test-driven development coaching |
| `/handoff` | Generate team handoff documents |
| `/write-a-skill` | Scaffold a new Runic skill |

Type `@runic /runic-list` to see all 145 skills.

## MCP server (all AI tools)

The extension also auto-configures Runic as an MCP server so any AI tool in your workspace (Claude, Copilot, Cursor, etc.) can call the skills directly.

**VS Code** — adds `.vscode/mcp.json`  
**Cursor** — adds `~/.cursor/mcp.json`

Run **Runic: Configure MCP Server** from the Command Palette to re-run setup.

## Requirements

- VS Code 1.90+
- GitHub Copilot (for `@runic /skill-name` in chat)
- Node.js 18+ (for the MCP server)

## Links

- [GitHub](https://github.com/Diottodev/runic)
- [All skills](https://github.com/Diottodev/runic/blob/main/README.md)
- [Issues](https://github.com/Diottodev/runic/issues)
