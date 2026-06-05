import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

const MCP_CONFIG = {
  servers: {
    runic: {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@diottodev/runic'],
    },
  },
}

async function configureMcp() {
  const folders = vscode.workspace.workspaceFolders
  if (!folders?.length) {
    vscode.window.showErrorMessage('Runic: Open a workspace folder first.')
    return
  }

  const wsRoot = folders[0].uri.fsPath
  const vscodeDir = path.join(wsRoot, '.vscode')
  const mcpFile = path.join(vscodeDir, 'mcp.json')

  if (!fs.existsSync(vscodeDir)) fs.mkdirSync(vscodeDir, { recursive: true })

  // Merge with existing config if present
  let existing: Record<string, unknown> = {}
  if (fs.existsSync(mcpFile)) {
    try { existing = JSON.parse(fs.readFileSync(mcpFile, 'utf8')) } catch { /* ignore */ }
  }

  const merged = {
    ...existing,
    servers: {
      ...(existing.servers as Record<string, unknown> ?? {}),
      ...MCP_CONFIG.servers,
    },
  }

  fs.writeFileSync(mcpFile, JSON.stringify(merged, null, 2))
  vscode.window.showInformationMessage(
    'Runic: MCP server configured in .vscode/mcp.json — reload VS Code to activate.',
    'Reload Now',
  ).then(action => {
    if (action === 'Reload Now') vscode.commands.executeCommand('workbench.action.reloadWindow')
  })
}

async function listSkills() {
  const panel = vscode.window.createWebviewPanel(
    'runicSkills',
    'Runic Skills',
    vscode.ViewColumn.One,
    {},
  )
  panel.webview.html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Runic Skills</title>
<style>
  body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); }
  h1 { font-size: 1.4rem; margin-bottom: 4px; }
  p  { color: var(--vscode-descriptionForeground); margin-bottom: 24px; }
  a  { color: var(--vscode-textLink-foreground); }
</style>
</head>
<body>
  <h1>Runic Skills</h1>
  <p>91 AI & Dev skills installed via MCP. Ask your AI assistant to use any of them:</p>
  <ul>
    <li><strong>code-review</strong> — "review this code", "audit this file"</li>
    <li><strong>debug-error</strong> — "why is this failing?", "fix this error"</li>
    <li><strong>generate-tests</strong> — "write tests for this"</li>
    <li><strong>refactor</strong> — "clean this up", "simplify this"</li>
    <li><strong>explain-code</strong> — "what does this do?"</li>
    <li><strong>git-commit</strong> — "write a commit message"</li>
    <li><strong>llm-cost-optimizer</strong> — "reduce my LLM costs"</li>
    <li><strong>prompt-engineering</strong> — "improve this prompt"</li>
    <li><strong>write-docs</strong> — "document this function"</li>
    <li><strong>agent-designer</strong> — "design an agent for this"</li>
    <li>...and 81 more across 6 domains</li>
  </ul>
  <p>Full list: <a href="https://github.com/Diottodev/runic">github.com/Diottodev/runic</a></p>
</body>
</html>`
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('runic.configure', configureMcp),
    vscode.commands.registerCommand('runic.listSkills', listSkills),
  )

  const config = vscode.workspace.getConfiguration('runic')
  if (config.get<boolean>('autoConfigureMcp')) configureMcp()
}

export function deactivate() {}
