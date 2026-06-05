import { useState } from 'react'
import { CodeBlock } from '@/components/ui/code-block'
import { cn } from '@/lib/utils'
import { CheckCircle2, Terminal, Code2, Layers, Monitor, Cpu, Puzzle } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'

type InstallMethod = 'mcp' | 'plugin'
type IDE = 'claude' | 'cursor' | 'windsurf' | 'vscode' | 'jetbrains'
type PluginIDE = 'vscode' | 'jetbrains' | 'cursor'

/* ── MCP config ── */
const mcpIcons: Record<IDE, React.ReactNode> = {
  claude:     <Terminal className="h-4 w-4" />,
  cursor:     <Code2 className="h-4 w-4" />,
  windsurf:   <Layers className="h-4 w-4" />,
  vscode:     <Monitor className="h-4 w-4" />,
  jetbrains:  <Cpu className="h-4 w-4" />,
}

const mcpLabels: Record<IDE, string> = {
  claude:    'Claude Code',
  cursor:    'Cursor',
  windsurf:  'Windsurf',
  vscode:    'VS Code',
  jetbrains: 'JetBrains',
}

const mcpFilenames: Partial<Record<IDE, string>> = {
  cursor:    '.cursor/mcp.json',
  windsurf:  '~/.codeium/windsurf/mcp_config.json',
  vscode:    '.vscode/mcp.json',
  jetbrains: '~/.config/JetBrains/mcp.json',
}

const mcpCodes: Record<IDE, string> = {
  claude: `# Add via NPX (recommended)
claude mcp add --npm runic

# Verify it's registered
claude mcp list`,
  cursor: `{
  "mcpServers": {
    "runic": {
      "command": "npx",
      "args": ["-y", "runic"]
    }
  }
}`,
  windsurf: `{
  "mcpServers": {
    "runic": {
      "command": "npx",
      "args": ["-y", "runic"]
    }
  }
}`,
  vscode: `{
  "servers": {
    "runic": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "runic"]
    }
  }
}`,
  jetbrains: `{
  "servers": {
    "runic": {
      "command": "npx",
      "args": ["-y", "runic"]
    }
  }
}`,
}

/* ── Plugin config ── */
const pluginIcons: Record<PluginIDE, React.ReactNode> = {
  vscode:    <Monitor className="h-4 w-4" />,
  jetbrains: <Cpu className="h-4 w-4" />,
  cursor:    <Code2 className="h-4 w-4" />,
}

const pluginLabels: Record<PluginIDE, string> = {
  vscode:    'VS Code',
  jetbrains: 'JetBrains',
  cursor:    'Cursor',
}

const pluginCodes: Record<PluginIDE, string> = {
  vscode: `# Install via CLI
code --install-extension runic.skills

# Or open VS Code → Extensions (Ctrl+Shift+X)
# Search: "Runic Skills"
# Click Install`,
  jetbrains: `# Open your JetBrains IDE (IntelliJ, WebStorm, etc.)
# Settings → Plugins → Marketplace
# Search: "Runic Skills" → Install → Restart IDE

# Or install from disk (.zip):
# Settings → Plugins → ⚙ → Install Plugin from Disk`,
  cursor: `# Cursor uses VS Code extensions
# Install via command palette (Ctrl+Shift+P):
#   > Extensions: Install Extensions
#   Search: "Runic Skills"

# Or via CLI:
cursor --install-extension runic.skills`,
}

const quickStartExamples = [
  '"Review this function for security issues"',
  '"Debug this stack trace"',
  '"Write tests for this module"',
  '"Optimize my LLM prompt costs"',
]

export function Install() {
  const [activeMethod, setActiveMethod] = useState<InstallMethod>('plugin')
  const [activeMCPIde, setActiveMCPIde] = useState<IDE>('claude')
  const [activePluginIde, setActivePluginIde] = useState<PluginIDE>('vscode')
  const { t } = useLocale()

  const mcpIdes = Object.keys(mcpLabels) as IDE[]
  const pluginIdes = Object.keys(pluginLabels) as PluginIDE[]

  return (
    <section id="install" className="py-20 md:py-28 border-t border-border/50">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

          {/* Left: method + IDE selector + code */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-highlight mb-3">{t.install.eyebrow}</p>
            <h2 className="font-display font-extrabold text-3xl md:text-[2.6rem] tracking-tight leading-[1.08] mb-2">
              {t.install.title}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t.install.subtitle}
            </p>

            {/* Method toggle */}
            <div className="flex gap-1 mb-5 p-1 rounded-lg border border-border bg-muted/30 w-fit">
              {(['mcp', 'plugin'] as InstallMethod[]).map(m => (
                <button
                  key={m}
                  onClick={() => setActiveMethod(m)}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-200',
                    activeMethod === m
                      ? 'bg-foreground text-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {m === 'mcp'
                    ? <><Terminal className="h-3.5 w-3.5" />{t.install.method_mcp}</>
                    : <><Puzzle className="h-3.5 w-3.5" />{t.install.method_plugin}</>
                  }
                </button>
              ))}
            </div>

            {activeMethod === 'mcp' ? (
              <>
                {/* MCP IDE tabs */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {mcpIdes.map(id => (
                    <button
                      key={id}
                      onClick={() => setActiveMCPIde(id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border',
                        activeMCPIde === id
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                      )}
                    >
                      {mcpIcons[id]}
                      {mcpLabels[id]}
                    </button>
                  ))}
                </div>

                <CodeBlock
                  code={mcpCodes[activeMCPIde]}
                  filename={mcpFilenames[activeMCPIde]}
                />

                {t.install.ide_notes[activeMCPIde as keyof typeof t.install.ide_notes] && (
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {t.install.ide_notes[activeMCPIde as keyof typeof t.install.ide_notes]}
                  </p>
                )}
              </>
            ) : (
              <>
                {/* Plugin IDE tabs */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {pluginIdes.map(id => (
                    <button
                      key={id}
                      onClick={() => setActivePluginIde(id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border',
                        activePluginIde === id
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                      )}
                    >
                      {pluginIcons[id]}
                      {pluginLabels[id]}
                    </button>
                  ))}
                </div>

                <CodeBlock code={pluginCodes[activePluginIde]} />

                {t.install.plugin_notes[activePluginIde as keyof typeof t.install.plugin_notes] && (
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {t.install.plugin_notes[activePluginIde as keyof typeof t.install.plugin_notes]}
                  </p>
                )}
              </>
            )}

            {/* Node requirement */}
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded-lg px-3 py-2.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              {t.install.node_req}{' '}
              <code className="font-mono bg-muted px-1 rounded">node --version</code>{' '}
              {t.install.node_verify}
            </div>
          </div>

          {/* Right: feature highlights */}
          <div className="space-y-4 lg:pt-16">
            <h3 className="font-display font-semibold text-base mb-6">{t.install.why_npx}</h3>
            {t.install.npx_features.map(f => (
              <div key={f.title} className="flex gap-4 group">
                <div className="w-9 h-9 rounded-lg border border-border bg-muted flex items-center justify-center text-base flex-shrink-0 group-hover:border-border/80 group-hover:bg-accent transition-all duration-200">
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-0.5 font-display">{f.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}

            {/* Quick start */}
            <div className="mt-6 rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2.5">{t.install.quick_start}</p>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{t.install.quick_start_subtitle}</p>
              <div className="space-y-1.5">
                {quickStartExamples.map(ex => (
                  <div key={ex} className="flex items-start gap-2">
                    <span className="text-highlight text-xs mt-0.5 font-mono">→</span>
                    <span className="text-foreground font-mono text-xs leading-relaxed">{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
