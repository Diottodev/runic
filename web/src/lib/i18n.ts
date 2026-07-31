export type Locale = 'en' | 'pt'

export const translations = {
  en: {
    nav: {
      skills: 'Skills',
      install: 'Install',
      docs: 'Docs',
    },
    hero: {
      badge: 'Runic',
      title1: 'AI & Dev skills',
      title2: 'built for developers',
      subtitle:
        '303 battle-tested skills across 17 domains. Install in seconds via your IDE — code review, debugging, LLM cost optimization, security testing, and more.',
      cta_install: 'Install now',
      cta_browse: 'Browse skills',
      stat_domains: 'Domains',
      stat_ides: 'IDEs',
      stat_license: 'License',
    },
    features: {
      eyebrow: 'Why runic',
      title: 'Skills that actually work',
      subtitle:
        'Not just prompts. A structured library built on patterns that produce reliable, production-grade output.',
      items: [
        {
          title: '10-Pattern Framework',
          description:
            'Every skill follows a consistent structure: practitioner voice, multi-mode workflows, proactive triggers, and quality loop.',
        },
        {
          title: 'Root cause, not symptoms',
          description:
            'Skills go beyond surface answers. Debug finds root cause. Review finds real bugs. Docs explain the why, not the what.',
        },
        {
          title: 'Multi-IDE — MCP',
          description:
            'Install via MCP across Claude Code, Cursor, Windsurf, VS Code, and JetBrains. One install, five IDEs.',
        },
        {
          title: 'AI & Dev focused',
          description:
            'Zero bloat. 303 skills across 17 domains for engineers, product, marketing, and executive teams. Production-grade, no fluff.',
        },
        {
          title: 'Proactive triggers',
          description:
            'Skills surface issues without being asked — hardcoded secrets, missing tests, injection risks, cost spikes.',
        },
        {
          title: 'Open source, MIT',
          description:
            'Fork it, extend it, contribute back. Add skills following the same 10-Pattern Standard. PRs welcome.',
        },
      ],
    },
    install: {
      eyebrow: 'Installation',
      title: 'Works with your IDE',
      subtitle: 'Install via MCP protocol — no repo clone, no build step.',
      why_npx: 'Why npx?',
      quick_start: 'Quick start',
      quick_start_subtitle: 'After installing, try asking your AI:',
      node_req: 'Requires Node.js ≥ 18. Run',
      node_verify: 'to verify.',
      ide_descriptions: {
        claude: 'Add to Claude Code via MCP',
        cursor: 'Add to your project or globally',
        windsurf: 'Add via Windsurf MCP settings',
        vscode: 'Add via VS Code MCP config',
        jetbrains: 'Add via JetBrains AI MCP config',
      },
      ide_notes: {
        cursor: 'Place at project root for per-project, or ~/.cursor/mcp.json for global. Restart Cursor after saving.',
        windsurf: 'Open Windsurf → Settings → Cascade → MCP Servers. Or edit the config file directly.',
        vscode: 'Requires VS Code with Copilot, Continue, or another MCP-compatible extension.',
        jetbrains: 'Requires JetBrains AI Assistant (2024+). Open Settings → Tools → AI Assistant → MCP Servers.',
      },
      npx_features: [
        {
          icon: '⚡',
          title: 'Zero-config install',
          description: 'One command. No cloning, no building. npx handles everything.',
        },
        {
          icon: '🔌',
          title: 'MCP native',
          description: 'Works via MCP protocol across all major IDEs. Pick your preferred IDE.',
        },
        {
          icon: '🎯',
          title: 'Auto-triggered',
          description: 'Skills activate automatically based on context — no slash commands needed.',
        },
        {
          icon: '🔄',
          title: 'Always up to date',
          description: 'npx always fetches the latest version. No manual updates required.',
        },
      ],
    },
    skills: {
      eyebrow: 'Skills',
      title: 'Everything you need to ship',
      subtitle: 'Skills organized into focused domains. Each follows the 10-Pattern Framework for consistent, reliable behavior.',
      all: 'All',
      count_label: 'skills',
    },
    runedraw: {
      eyebrow: 'New skill',
      title: 'RuneDraw — diagrams that ship',
      subtitle: 'Turn plain-language requirements or Mermaid input into polished, validated architecture and workflow diagrams — standalone HTML with inline SVG, dark/light themes, and PNG/WebM export. The render below is generated live by RuneDraw.',
      demo_caption: 'Live RuneDraw render — "Sample Web App" (3-tier SaaS on AWS)',
      open_full: 'Open full demo',
      points: [
        {
          icon: '🎨',
          title: 'Polished output',
          description: 'Dark/light themes, signal-flow presets, trace motion, and a guided multi-view canvas.',
        },
        {
          icon: '✅',
          title: 'Validated geometry',
          description: 'Orthogonal routing, crossings, and label-clearance checks pass before anything ships.',
        },
        {
          icon: '🗂️',
          title: 'Five diagram types',
          description: 'Architecture, workflow, sequence, data-flow, and lifecycle/state diagrams from one spec.',
        },
      ],
    },
    footer: {
      tagline: 'Runic — 303 skills across 17 domains for teams who ship.',
      made_with: 'MIT License',
    },
  },

  pt: {
    nav: {
      skills: 'Skills',
      install: 'Instalar',
      docs: 'Docs',
    },
    hero: {
      badge: 'Runic',
      title1: 'Skills de IA & Dev',
      title2: 'feitas para desenvolvedores',
      subtitle:
        '303 skills testadas em batalha em 17 domínios. Instale em segundos via sua IDE — code review, debug, otimização de LLM, testes de segurança e muito mais.',
      cta_install: 'Instalar agora',
      cta_browse: 'Ver skills',
      stat_domains: 'Domínios',
      stat_ides: 'IDEs',
      stat_license: 'Licença',
    },
    features: {
      eyebrow: 'Por que runic',
      title: 'Skills que realmente funcionam',
      subtitle:
        'Não são só prompts. Uma biblioteca estruturada com padrões que produzem saída confiável e de nível produção.',
      items: [
        {
          title: 'Framework de 10 Padrões',
          description:
            'Cada skill segue uma estrutura consistente: voz de especialista, fluxos multi-modo, gatilhos proativos e loop de qualidade.',
        },
        {
          title: 'Causa raiz, não sintomas',
          description:
            'As skills vão além das respostas superficiais. Debug encontra a causa raiz. Review encontra bugs reais. Docs explicam o porquê.',
        },
        {
          title: 'Multi-IDE — MCP',
          description:
            'Instale via MCP no Claude Code, Cursor, Windsurf, VS Code e JetBrains. Uma instalação, cinco IDEs.',
        },
        {
          title: 'Focado em IA & Dev',
          description:
            'Zero inchaço. 303 skills em 17 domínios para engenheiros, produto, marketing e executivos. Nível produção, sem enrolação.',
        },
        {
          title: 'Gatilhos proativos',
          description:
            'As skills levantam problemas sem serem chamadas — secrets no código, testes faltando, riscos de injeção, picos de custo.',
        },
        {
          title: 'Open source, MIT',
          description:
            'Faça fork, estenda, contribua de volta. Adicione skills seguindo o mesmo Padrão de 10 Padrões. PRs são bem-vindos.',
        },
      ],
    },
    install: {
      eyebrow: 'Instalação',
      title: 'Funciona com sua IDE',
      subtitle: 'Instale via protocolo MCP — sem clonar repo, sem build.',
      why_npx: 'Por que npx?',
      quick_start: 'Início rápido',
      quick_start_subtitle: 'Após instalar, tente perguntar à sua IA:',
      node_req: 'Requer Node.js ≥ 18. Execute',
      node_verify: 'para verificar.',
      ide_descriptions: {
        claude: 'Adicionar ao Claude Code via MCP',
        cursor: 'Adicionar ao projeto ou globalmente',
        windsurf: 'Adicionar via configurações MCP do Windsurf',
        vscode: 'Adicionar via config MCP do VS Code',
        jetbrains: 'Adicionar via config MCP do JetBrains AI',
      },
      ide_notes: {
        cursor: 'Coloque na raiz do projeto para escopo de projeto, ou ~/.cursor/mcp.json para global. Reinicie o Cursor após salvar.',
        windsurf: 'Abra Windsurf → Configurações → Cascade → MCP Servers. Ou edite o arquivo de configuração diretamente.',
        vscode: 'Requer VS Code com Copilot, Continue ou outra extensão compatível com MCP.',
        jetbrains: 'Requer JetBrains AI Assistant (2024+). Abra Configurações → Ferramentas → AI Assistant → MCP Servers.',
      },
      npx_features: [
        {
          icon: '⚡',
          title: 'Instalação sem configuração',
          description: 'Um comando. Sem clonar, sem builds. O npx cuida de tudo.',
        },
        {
          icon: '🔌',
          title: 'MCP nativo',
          description: 'Funciona via protocolo MCP em todas as principais IDEs. Escolha sua IDE preferida.',
        },
        {
          icon: '🎯',
          title: 'Ativação automática',
          description: 'Skills ativam automaticamente com base no contexto — sem slash commands.',
        },
        {
          icon: '🔄',
          title: 'Sempre atualizado',
          description: 'O npx sempre busca a versão mais recente. Sem atualizações manuais.',
        },
      ],
    },
    skills: {
      eyebrow: 'Skills',
      title: 'Tudo que você precisa para entregar',
      subtitle: 'Skills organizadas em domínios focados. Cada uma segue o Framework de 10 Padrões para comportamento consistente e confiável.',
      all: 'Todos',
      count_label: 'skills',
    },
    runedraw: {
      eyebrow: 'Nova skill',
      title: 'RuneDraw — diagramas que vão para produção',
      subtitle: 'Transforme requisitos em linguagem natural ou input Mermaid em diagramas de arquitetura e fluxo polidos e validados — HTML autônomo com SVG inline, temas claro/escuro e exportação PNG/WebM. O render abaixo é gerado ao vivo pelo RuneDraw.',
      demo_caption: 'Render ao vivo do RuneDraw — "Sample Web App" (SaaS 3 camadas na AWS)',
      open_full: 'Abrir demo completa',
      points: [
        {
          icon: '🎨',
          title: 'Saída refinada',
          description: 'Temas claro/escuro, presets signal-flow, animação trace e canvas guiado com múltiplas visões.',
        },
        {
          icon: '✅',
          title: 'Geometria validada',
          description: 'Rotas ortogonais, cruzamentos e folgas de rótulo são verificados antes de qualquer entrega.',
        },
        {
          icon: '🗂️',
          title: 'Cinco tipos de diagrama',
          description: 'Arquitetura, workflow, sequência, data-flow e lifecycle/estado a partir de uma única spec.',
        },
      ],
    },
    footer: {
      tagline: 'Runic — 303 skills em 17 domínios para times que entregam.',
      made_with: 'Licença MIT',
    },
  },
}

export type Translations = typeof translations['en']
