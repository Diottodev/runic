import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { ChildProcess, spawn } from 'child_process'

const MCP_SERVER = {
  command: 'npx',
  args: ['-y', '@diottodev/runic'],
}

// ── MCP Client ────────────────────────────────────────────────────────────────

class McpClient {
  private proc: ChildProcess | null = null
  private buffer = ''
  private pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()
  private nextId = 1
  private ready = false

  async ensureConnected(): Promise<void> {
    if (this.proc && !this.proc.killed && this.ready) return

    this.buffer = ''
    this.pending.clear()
    this.ready = false
    this.nextId = 1

    await new Promise<void>((resolve, reject) => {
      const isWin = process.platform === 'win32'
      this.proc = spawn(MCP_SERVER.command, MCP_SERVER.args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: isWin,
      })

      this.proc.stdout!.on('data', (chunk: Buffer) => this.onData(chunk.toString()))
      this.proc.stderr!.on('data', () => { /* suppress */ })
      this.proc.on('error', reject)
      this.proc.on('exit', () => {
        this.proc = null
        this.ready = false
        for (const p of this.pending.values()) p.reject(new Error('MCP server exited'))
        this.pending.clear()
      })

      setTimeout(resolve, 800)
    })

    const initResult = await this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'runic-vscode', version: '1.1.0' },
    }) as { capabilities?: unknown }

    void initResult
    this.notify('notifications/initialized', {})
    this.ready = true
  }

  private onData(data: string) {
    this.buffer += data
    const lines = this.buffer.split('\n')
    this.buffer = lines.pop() ?? ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      try {
        const msg = JSON.parse(trimmed) as { id?: number; result?: unknown; error?: { message: string } }
        if (msg.id != null) {
          const p = this.pending.get(msg.id)
          if (p) {
            this.pending.delete(msg.id)
            if (msg.error) p.reject(new Error(msg.error.message))
            else p.resolve(msg.result)
          }
        }
      } catch { /* not JSON — ignore */ }
    }
  }

  private send(msg: unknown) {
    this.proc?.stdin?.write(JSON.stringify(msg) + '\n')
  }

  private notify(method: string, params: unknown) {
    this.send({ jsonrpc: '2.0', method, params })
  }

  private request(method: string, params: unknown): Promise<unknown> {
    const id = this.nextId++
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.send({ jsonrpc: '2.0', id, method, params })
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id)
          reject(new Error(`Timeout calling ${method}`))
        }
      }, 30_000)
    })
  }

  async callTool(name: string, args: Record<string, unknown> = {}): Promise<string> {
    await this.ensureConnected()
    const result = await this.request('tools/call', { name, arguments: args }) as {
      content: Array<{ type: string; text: string }>
    }
    return result.content.map(c => c.text).join('\n')
  }

  async listTools(): Promise<Array<{ name: string; description: string }>> {
    await this.ensureConnected()
    const result = await this.request('tools/list', {}) as {
      tools: Array<{ name: string; description: string }>
    }
    return result.tools
  }

  dispose() {
    this.proc?.kill()
    this.proc = null
    this.ready = false
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isCursor(): boolean {
  return vscode.env.appName.toLowerCase().includes('cursor')
}

function writeJsonMerged(filePath: string, patch: Record<string, unknown>) {
  let existing: Record<string, unknown> = {}
  if (fs.existsSync(filePath)) {
    try { existing = JSON.parse(fs.readFileSync(filePath, 'utf8')) } catch { /* ignore */ }
  }
  const merged = {
    ...existing,
    servers: {
      ...(existing.servers as Record<string, unknown> ?? {}),
      ...(patch.servers as Record<string, unknown>),
    },
  }
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2))
}

// ── MCP Config ────────────────────────────────────────────────────────────────

async function configureMcp() {
  if (isCursor()) {
    await configureCursor()
  } else {
    await configureVSCode()
  }
}

async function configureCursor() {
  const globalCursorConfig = path.join(os.homedir(), '.cursor', 'mcp.json')
  try {
    writeJsonMerged(globalCursorConfig, { servers: { runic: { ...MCP_SERVER, type: 'stdio' } } })
  } catch (e) {
    vscode.window.showErrorMessage(`Runic: Failed to write Cursor MCP config: ${e}`)
    return
  }

  const folders = vscode.workspace.workspaceFolders
  if (folders?.length) {
    const workspaceCursorConfig = path.join(folders[0].uri.fsPath, '.cursor', 'mcp.json')
    try { writeJsonMerged(workspaceCursorConfig, { servers: { runic: { ...MCP_SERVER, type: 'stdio' } } }) } catch { /* best-effort */ }
  }

  const action = await vscode.window.showInformationMessage(
    'Runic: MCP server configured for Cursor (~/.cursor/mcp.json). Restart Cursor to activate.',
    'Restart Now',
  )
  if (action === 'Restart Now') vscode.commands.executeCommand('workbench.action.reloadWindow')
}

async function configureVSCode() {
  const folders = vscode.workspace.workspaceFolders
  if (!folders?.length) {
    vscode.window.showErrorMessage('Runic: Open a workspace folder first.')
    return
  }

  const mcpFile = path.join(folders[0].uri.fsPath, '.vscode', 'mcp.json')
  try {
    writeJsonMerged(mcpFile, { servers: { runic: { ...MCP_SERVER, type: 'stdio' } } })
  } catch (e) {
    vscode.window.showErrorMessage(`Runic: Failed to write VS Code MCP config: ${e}`)
    return
  }

  const action = await vscode.window.showInformationMessage(
    'Runic: MCP server configured in .vscode/mcp.json. Reload VS Code to activate.',
    'Reload Now',
  )
  if (action === 'Reload Now') vscode.commands.executeCommand('workbench.action.reloadWindow')
}

// ── Skills Webview ────────────────────────────────────────────────────────────

async function listSkills(client: McpClient) {
  const editor = isCursor() ? 'Cursor' : 'VS Code'
  const panel = vscode.window.createWebviewPanel(
    'runicSkills',
    'Runic Skills',
    vscode.ViewColumn.One,
    { enableScripts: false },
  )

  panel.webview.html = getLoadingHtml(editor)

  let tools: Array<{ name: string; description: string }> = []
  try {
    tools = await client.listTools()
  } catch {
    tools = STATIC_SKILLS
  }

  panel.webview.html = getSkillsHtml(editor, tools)
}

function getLoadingHtml(editor: string): string {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>body{font-family:var(--vscode-font-family);padding:20px;color:var(--vscode-foreground)}</style>
</head><body><h1>Runic Skills · ${editor}</h1><p>Loading skills from MCP server...</p></body></html>`
}

function getSkillsHtml(editor: string, tools: Array<{ name: string; description: string }>): string {
  const isCursorEnv = isCursor()
  const skillCount  = tools.filter(t => t.name !== 'runic-list').length
  const skillRows   = tools
    .filter(t => t.name !== 'runic-list')
    .map(t => `<tr><td><code>${escHtml(t.name)}</code></td><td>${escHtml(t.description)}</td></tr>`)
    .join('')

  const howToInvoke = isCursorEnv
    ? 'In <strong>Cursor chat</strong>, type <code>/skill-name</code> (plugin) or ask the AI to use a Runic MCP tool.'
    : 'In <strong>VS Code Copilot Chat</strong>, type <code>@runic /skill-name</code>. Outside Copilot, ask your AI assistant to call the MCP tool by name.'

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Runic Skills</title>
<style>
  body  { font-family: var(--vscode-font-family); padding: 20px 24px; color: var(--vscode-foreground); }
  h1    { font-size: 1.4rem; margin-bottom: 4px; }
  .meta { color: var(--vscode-descriptionForeground); margin-bottom: 24px; }
  a     { color: var(--vscode-textLink-foreground); }
  .badge{ background: var(--vscode-badge-background); color: var(--vscode-badge-foreground);
          padding: 2px 8px; border-radius: 4px; font-size: 0.78rem; margin-left: 8px; vertical-align: middle; }
  table { border-collapse: collapse; width: 100%; font-size: 0.9rem; }
  th    { text-align: left; padding: 6px 12px; border-bottom: 1px solid var(--vscode-panel-border);
          color: var(--vscode-descriptionForeground); font-weight: 600; }
  td    { padding: 5px 12px; border-bottom: 1px solid var(--vscode-panel-border); vertical-align: top; }
  tr:hover td { background: var(--vscode-list-hoverBackground); }
  code  { font-family: var(--vscode-editor-font-family); font-size: 0.85rem; }
  .tip  { margin-top: 20px; padding: 10px 14px; background: var(--vscode-textBlockQuote-background);
          border-left: 3px solid var(--vscode-textBlockQuote-border); border-radius: 2px; font-size: 0.88rem; }
</style>
</head>
<body>
  <h1>Runic Skills <span class="badge">${escHtml(editor)}</span> <span class="badge">${skillCount} skills</span></h1>
  <p class="meta">AI & Dev skills exposed via MCP. Full docs: <a href="https://github.com/Diottodev/runic">github.com/Diottodev/runic</a></p>
  <div class="tip"><strong>How to invoke:</strong> ${howToInvoke}</div>
  <br>
  <table>
    <thead><tr><th>Skill</th><th>Description</th></tr></thead>
    <tbody>${skillRows}</tbody>
  </table>
</body>
</html>`
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ── Static skill fallback ─────────────────────────────────────────────────────

const STATIC_SKILLS: Array<{ name: string; description: string }> = [
  { name: 'code-review',             description: 'Review code for bugs, security vulnerabilities, and quality issues.' },
  { name: 'debug-error',             description: 'Diagnose errors and stack traces, identify root cause, provide fix.' },
  { name: 'generate-tests',          description: 'Generate unit tests with Arrange/Act/Assert structure.' },
  { name: 'refactor',                description: 'Refactor code following Clean Code, SOLID, and DRY principles.' },
  { name: 'explain-code',            description: 'Explain what code does at beginner, intermediate, or expert depth.' },
  { name: 'git-commit',              description: 'Generate Conventional Commit messages from a diff or change description.' },
  { name: 'write-docs',              description: 'Generate JSDoc, TSDoc, Python docstrings, or inline comments.' },
  { name: 'prompt-engineering',      description: 'Design, evaluate, and iterate on LLM prompts.' },
  { name: 'llm-cost-optimizer',      description: 'Analyze LLM inference costs and propose optimizations.' },
  { name: 'agent-designer',          description: 'Design AI agent architectures with tool selection and memory systems.' },
  { name: 'security-guidance',       description: 'Security review for OWASP top 10 and common vulnerabilities.' },
  { name: 'a11y-audit',              description: 'Accessibility audit for WCAG 2.2 Level A and AA compliance.' },
  { name: 'prompt-injection',        description: 'Detect, test, and harden against prompt injection attacks.' },
  { name: 'benchmark-analyzer',      description: 'Interpret and compare AI model benchmark results.' },
  { name: 'model-eval',              description: 'Design custom evaluation frameworks for LLM-powered features.' },
  { name: 'data-quality-auditor',    description: 'Audit data pipelines and datasets for quality issues.' },
  { name: 'agenthub',                description: 'Multi-agent collaboration with parallel subagents.' },
  { name: 'autoresearch-agent',      description: 'Autonomous experiment loop for AI optimization tasks.' },
  { name: 'chaos-engineering',       description: 'Design chaos experiments and failure injection strategies.' },
  { name: 'docker-development',      description: 'Containerize applications with Docker best practices.' },
  { name: 'terraform-patterns',      description: 'Infrastructure-as-code patterns with Terraform.' },
  { name: 'kubernetes-operator',     description: 'Build Kubernetes operators and custom controllers.' },
  { name: 'slo-architect',           description: 'Define SLOs, SLIs, and error budgets.' },
  { name: 'observability-designer',  description: 'Design observability stacks — logs, metrics, traces.' },
  { name: 'feature-flags-architect', description: 'Design feature flag systems and rollout strategies.' },
  { name: 'mcp-server-builder',      description: 'Build Model Context Protocol servers and tools.' },
  { name: 'rag-architect',           description: 'Design RAG pipelines and retrieval systems.' },
  { name: 'performance-profiler',    description: 'Profile and optimize application performance.' },
  { name: 'database-designer',       description: 'Design relational and NoSQL database schemas.' },
  { name: 'api-design-reviewer',     description: 'Review REST/GraphQL APIs for design quality.' },
  { name: 'ci-cd-pipeline-builder',  description: 'Build CI/CD pipelines with GitHub Actions or GitLab CI.' },
  { name: 'tdd-guide',               description: 'Test-driven development coaching — red-green-refactor.' },
  { name: 'handoff',                 description: 'Generate handoff documents for team transitions.' },
  { name: 'write-a-skill',           description: 'Scaffold a new Runic skill following the 10-Pattern Framework.' },
]

// ── Chat Participant (VS Code Copilot Chat) ───────────────────────────────────

type VsCodeChatApi = {
  createChatParticipant(
    id: string,
    handler: (
      request: vscode.ChatRequest,
      context: vscode.ChatContext,
      stream: vscode.ChatResponseStream,
      token: vscode.CancellationToken,
    ) => Promise<void>,
  ): vscode.Disposable & { iconPath?: vscode.ThemeIcon }
}

function registerChatParticipant(context: vscode.ExtensionContext, client: McpClient) {
  // vscode.chat is only available when GitHub Copilot is installed
  const chat = (vscode as unknown as { chat?: VsCodeChatApi }).chat
  if (!chat?.createChatParticipant) return

  const participant = chat.createChatParticipant(
    'runic.assistant',
    async (request, _ctx, stream, _token) => {
      const skillName   = request.command
      const userContext = request.prompt?.trim()

      // No skill name — show help
      if (!skillName) {
        stream.markdown('## Runic Skills\n\nType `@runic /skill-name` to invoke any skill.\n\n**Popular skills:**\n\n')
        for (const s of STATIC_SKILLS.slice(0, 10)) {
          stream.markdown(`- \`@runic /${s.name}\` — ${s.description}\n`)
        }
        stream.markdown('\nSee all skills: `@runic /runic-list`\n')
        return
      }

      stream.progress(`Running **${skillName}**…`)

      try {
        const args: Record<string, unknown> = {}
        if (userContext) args.context = userContext
        const result = await client.callTool(skillName, args)
        stream.markdown(result)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        stream.markdown(
          `**Runic error:** ${msg}\n\nMake sure \`npx @diottodev/runic\` is accessible, then try again.`,
        )
      }
    },
  )

  participant.iconPath = new vscode.ThemeIcon('sparkle')
  context.subscriptions.push(participant)
}

// ── Status Bar ────────────────────────────────────────────────────────────────

function createStatusBar(context: vscode.ExtensionContext): vscode.StatusBarItem {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  item.text    = '$(sparkle) Runic'
  item.tooltip = 'Runic Skills — click to list skills'
  item.command = 'runic.listSkills'
  item.show()
  context.subscriptions.push(item)
  return item
}

// ── Activate ──────────────────────────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext) {
  const client = new McpClient()
  context.subscriptions.push({ dispose: () => client.dispose() })

  context.subscriptions.push(
    vscode.commands.registerCommand('runic.configure',   () => configureMcp()),
    vscode.commands.registerCommand('runic.listSkills',  () => listSkills(client)),
  )

  createStatusBar(context)
  registerChatParticipant(context, client)

  const config = vscode.workspace.getConfiguration('runic')
  if (config.get<boolean>('autoConfigureMcp')) {
    configureMcp()
    client.ensureConnected().catch(() => { /* ignore on first load */ })
  }
}

export function deactivate() {}
