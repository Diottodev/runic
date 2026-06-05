# Runic

> 91 AI & Dev skills for Claude Code, Cursor, Windsurf, VS Code, and JetBrains.  
> Install in seconds via MCP or as a native IDE plugin.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm](https://img.shields.io/npm/v/runic)](https://www.npmjs.com/package/runic)
[![Skills](https://img.shields.io/badge/skills-91-0e7490)](.)
[![Domains](https://img.shields.io/badge/domains-6-155e75)](.)
[![GitHub](https://img.shields.io/badge/GitHub-Diottodev-161b22?logo=github)](https://github.com/Diottodev/runic)

---

## Installation

Runic supports two distribution channels: **MCP protocol** (recommended — works in all 5 IDEs with zero config) and **native IDE plugin** (VS Code Marketplace / JetBrains Marketplace).

---

### via MCP

MCP (Model Context Protocol) is a standard supported by all major AI-enabled IDEs. One config, five IDEs.

#### Claude Code

```bash
claude mcp add --npm runic
```

#### Cursor

Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "runic": {
      "command": "npx",
      "args": ["-y", "runic"]
    }
  }
}
```

Restart Cursor after saving.

#### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "runic": {
      "command": "npx",
      "args": ["-y", "runic"]
    }
  }
}
```

Or open Windsurf → Settings → Cascade → MCP Servers.

#### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "runic": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "runic"]
    }
  }
}
```

Requires VS Code with Copilot, Continue, or another MCP-compatible extension.

#### JetBrains

Add to `~/.config/JetBrains/mcp.json`:

```json
{
  "servers": {
    "runic": {
      "command": "npx",
      "args": ["-y", "runic"]
    }
  }
}
```

Or open Settings → Tools → AI Assistant → MCP Servers. Requires JetBrains AI Assistant 2024+.

> **Requirement:** Node.js ≥ 18 — run `node --version` to verify.

---

### via Plugin

Install Runic as a native IDE extension — no JSON config needed.

#### VS Code / Cursor

```bash
# VS Code
code --install-extension runic.skills

# Cursor
cursor --install-extension runic.skills
```

Or search **"Runic Skills"** in the Extensions panel (`Ctrl+Shift+X`).

#### JetBrains

Open any JetBrains IDE (IntelliJ IDEA, WebStorm, PyCharm, GoLand...) →  
**Settings → Plugins → Marketplace** → search **"Runic"** → Install → Restart.

---

## How it Works

### MCP distribution

The `runic` npm package exposes a [Model Context Protocol](https://modelcontextprotocol.io) server. When the IDE starts a session, it spawns `npx runic` as a child process via stdio. The server registers all 91 skills as MCP tools — the IDE's AI can then invoke them by name or the IDE can trigger them proactively based on context.

**To publish / update on npm:**

```bash
npm run build
npm publish --access public
```

### VS Code / Cursor plugin distribution

The extension (`packages/vscode-extension/`) wraps the MCP server and registers VS Code commands and context menu entries. Skills are accessible via the Command Palette (`Ctrl+Shift+P → Runic: ...`) and activate automatically via `onLanguage` / `onFileSystem` triggers.

**To build and publish:**

```bash
cd packages/vscode-extension
npm install
npx vsce package          # builds runic-skills-x.x.x.vsix
npx vsce publish          # requires PAT from marketplace.visualstudio.com
```

### JetBrains plugin distribution

The plugin (`packages/jetbrains-plugin/`) is a Kotlin/Gradle project using the [IntelliJ Platform Plugin SDK](https://plugins.jetbrains.com/docs/intellij/). It integrates with the JetBrains AI Assistant extension point and registers Runic skills as inline actions and tool window entries.

**To build and publish:**

```bash
cd packages/jetbrains-plugin
./gradlew buildPlugin       # outputs build/distributions/runic-*.zip
./gradlew publishPlugin     # requires PUBLISH_TOKEN env var from plugins.jetbrains.com
```

---

## Domains & Skills

| Domain | Skills | Description |
|--------|--------|-------------|
| `engineering/` | 37 | Core AI & dev tools — review, debug, test, LLM ops, agents |
| `engineering-team/` | 38 | Team skills — security, cloud, fullstack, QA, DevOps |
| `ai-research/` | 2 | Model evaluation & benchmarks |
| `ai-security/` | 1 | Prompt injection & hardening |
| `research/` | 8 | Academic & market research |
| `research-ops/` | 5 | Clinical, market, product & R&D ops |

### Engineering highlights

`code-review` · `debug-error` · `explain-code` · `generate-tests` · `git-commit` · `refactor` · `write-docs` · `llm-cost-optimizer` · `prompt-engineering` · `agent-designer` · `rag-architect` · `mcp-server-builder` · `karpathy-coder` · `chaos-engineering` · `ship-gate` · `slo-architect` · `docker-development` · `kubernetes-operator` · `terraform-patterns`

### Security highlights

`ai-security` · `cloud-security` · `red-team` · `security-pen-testing` · `threat-detection` · `prompt-injection` · `senior-secops` · `incident-response`

---

## Project Structure

```
runic/
├── engineering/          # 37 core AI & dev skills
├── engineering-team/     # 38 team role skills + security
├── ai-research/          # 2 model evaluation skills
├── ai-security/          # 1 AI security skill
├── research/             # 8 research skills
├── research-ops/         # 5 research ops skills
│
├── packages/
│   ├── vscode-extension/ # VS Code / Cursor native plugin
│   └── jetbrains-plugin/ # JetBrains IDE native plugin
│
├── web/                  # Landing page (React + Vite + Tailwind)
│
├── CLAUDE.md             # Navigation & roadmap
├── SKILL-AUTHORING-STANDARD.md  # 10-Pattern Framework
├── CONVENTIONS.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). AI and Dev skills only. PRs target `dev`.

## License

MIT — [Diottodev](https://github.com/Diottodev/runic)
