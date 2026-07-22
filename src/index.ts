#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { z } from 'zod'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const DOMAINS = [
  'engineering',
  'engineering-team',
  'ai-research',
  'ai-security',
  'research',
  'research-ops',
  'marketing',
  'product',
  'c-level',
  'compliance',
  'content',
  'finance',
  'commercial',
  'productivity',
  'project-management',
  'business',
  'superpowers',
]

interface Skill {
  name: string
  description: string
  content: string
  domain: string
}

function parseFrontmatter(raw: string): { name?: string; description?: string; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/m)
  if (!match) return { body: raw }
  const meta: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    meta[key] = val
  }
  return { name: meta['name'], description: meta['description'], body: match[2].trim() }
}

function findSkillFiles(dir: string): string[] {
  if (!existsSync(dir)) return []
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      const skill = join(full, 'SKILL.md')
      if (existsSync(skill)) results.push(skill)
      else results.push(...findSkillFiles(full))
    }
  }
  return results
}

function loadSkills(): Skill[] {
  const skills: Skill[] = []
  const seen = new Set<string>()

  for (const domain of DOMAINS) {
    const domainDir = join(ROOT, domain)
    for (const file of findSkillFiles(domainDir)) {
      const raw = readFileSync(file, 'utf8')
      const { name, description, body } = parseFrontmatter(raw)
      if (!name || !description || !body || seen.has(name)) continue
      seen.add(name)
      skills.push({ name, description, content: body, domain })
    }
  }

  return skills
}

function scoreSkills(skills: Skill[], task: string): (Skill & { score: number })[] {
  const lower = task.toLowerCase()
  const keywords = lower.split(/\s+/)
  return skills.map(s => {
    const desc = s.description.toLowerCase()
    const name = s.name.toLowerCase()
    let score = 0
    for (const kw of keywords) {
      if (desc.includes(kw)) score += 2
      if (name.includes(kw)) score += 3
      if (s.domain.includes(kw)) score += 1
    }
    return { ...s, score }
  }).sort((a, b) => b.score - a.score)
}

async function main() {
  const skills = loadSkills()

  const server = new McpServer({
    name: 'runic',
    version: '1.1.0',
  })

  server.tool(
    'runic-prompt-engineer',
    'Single entry point for all Runic skills. Analyzes the user task, matches it to the best skill, and returns the skill content with enhanced prompt engineering context. Call this FIRST before using any individual skill tool.',
    { task: z.string().describe('The user task or request description') },
    async ({ task }) => {
      const scored = scoreSkills(skills, task)
      const top = scored.filter(s => s.score > 0).slice(0, 3)

      const text = top.length > 0
        ? top.map((s, i) => {
            const role = i === 0
              ? 'PRIMARY'
              : i === 1
              ? 'ALTERNATIVE'
              : 'FALLBACK'
            return [
              `## ${role}: ${s.name} (${s.domain})`,
              `**Description:** ${s.description}`,
              `**Relevance Score:** ${s.score}`,
              ``,
              s.content,
            ].join('\n')
          }).join('\n\n---\n\n')
        : `No specific skill matched your task. Available skills:\n\n${skills.map(s => `- **${s.name}** (${s.domain}): ${s.description}`).join('\n')}`

      return {
        content: [{
          type: 'text' as const,
          text: [
            `# Prompt Engineering Analysis`,
            ``,
            `**Original Task:** ${task}`,
            ``,
            text,
          ].join('\n'),
        }],
      }
    },
  )

  for (const skill of skills) {
    server.tool(
      skill.name,
      skill.description,
      { context: z.string().optional().describe('Additional context from the user') },
      async ({ context }) => ({
        content: [{
          type: 'text' as const,
          text: context
            ? `${skill.content}\n\n---\nUser context: ${context}`
            : skill.content,
        }],
      }),
    )
  }

  server.tool(
    'runic-list',
    'List all available Runic skills with their names, domains, and descriptions.',
    {},
    async () => ({
      content: [{
        type: 'text' as const,
        text: skills
          .map(s => `**${s.name}** (${s.domain})\n${s.description}`)
          .join('\n\n'),
      }],
    }),
  )

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(err => {
  process.stderr.write(`runic: ${err.message}\n`)
  process.exit(1)
})
