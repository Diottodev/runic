#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { execFile } from 'child_process'
import { promisify } from 'util'
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
] as const

const DIAGRAM_TYPES = ['architecture', 'workflow', 'sequence', 'dataflow', 'lifecycle'] as const

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

  return skills.sort((a, b) => a.name.localeCompare(b.name))
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[-_.]/g, ' ')
}

function scoreSkills(skills: Skill[], task: string): (Skill & { score: number })[] {
  const lower = normalize(task)
  const keywords = lower.split(/\s+/).filter(k => k.length >= 2)

  const scored = skills.map(s => {
    const desc = normalize(s.description)
    const name = normalize(s.name)
    const domain = normalize(s.domain)
    let score = 0
    for (const kw of keywords) {
      if (desc.includes(kw)) score += 2
      if (name.includes(kw)) score += 4
      if (name.startsWith(kw)) score += 2
      if (domain.includes(kw)) score += 1
    }
    return { ...s, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
}

function skillsByDomain(skills: Skill[]): Record<string, Skill[]> {
  const map: Record<string, Skill[]> = {}
  for (const s of skills) {
    ;(map[s.domain] ??= []).push(s)
  }
  return map
}

function compactList(skills: Skill[], limitDomain?: string): string {
  const byDomain = skillsByDomain(skills)
  const entries = Object.entries(byDomain).sort(([a], [b]) => a.localeCompare(b))
  const lines: string[] = [`Runic — ${skills.length} skills · ${DOMAINS.length} domains`, '']
  for (const [domain, list] of entries) {
    if (limitDomain && limitDomain !== domain) continue
    lines.push(`## ${domain} (${list.length})`)
    lines.push(list.map(s => s.name).join(', '))
    lines.push('')
  }
  return lines.join('\n').trim()
}

const RUNEDRAW_DIR = join(ROOT, 'engineering', 'runedraw')
const RUNEDRAW_CLI = join(RUNEDRAW_DIR, 'bin', 'runedraw.mjs')

const execFileAsync = promisify(execFile)

function parseRuneDrawReceipt(raw: string): { ok?: boolean; errors?: unknown[] } {
  const start = raw.indexOf('{')
  if (start === -1) return {}
  try {
    return JSON.parse(raw.slice(start)) as { ok?: boolean; errors?: unknown[] }
  } catch {
    return {}
  }
}

async function runRuneDraw(args: string[], timeoutMs = 120000): Promise<{ stdout: string; stderr: string }> {
  if (!existsSync(RUNEDRAW_CLI)) {
    throw new Error(
      `RuneDraw renderer not found at ${RUNEDRAW_DIR}. Reinstall @diottodev/runic to get the bundled runedraw skill.`
    )
  }
  const { stdout, stderr } = await execFileAsync(process.execPath, [RUNEDRAW_CLI, ...args], {
    timeout: timeoutMs,
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true,
  })
  return { stdout, stderr }
}

async function main() {
  const skills = loadSkills()

  const server = new McpServer({
    name: 'runic',
    version: '1.1.0',
  })

  /* ─── Router tools (kept intentionally small so every IDE accepts the MCP server) ─── */

  server.tool(
    'runic-prompt-engineer',
    'Single entry point for all Runic skills. Analyzes the user task, matches it to the best skill, and returns the winning skill\'s full instructions. Call this FIRST before using runic-search / runic-get-skill.',
    { task: z.string().describe('The user task or request description') },
    async ({ task }) => {
      const matches = scoreSkills(skills, task)
      if (matches.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `No Runic skill clearly matches "${task}". Use runic-list to browse all ${skills.length} skills, or runic-search with different keywords.`,
          }],
        }
      }

      const [top, ...rest] = matches
      const alternatives = rest.slice(0, 8).map((s, i) =>
        `${i + 1}. **${s.name}** (${s.domain}) — ${s.description}`
      ).join('\n')

      return {
        content: [{
          type: 'text' as const,
          text: [
            `# Prompt Engineering Analysis`,
            ``,
            `**Original Task:** ${task}`,
            ``,
            `## PRIMARY: ${top.name} (${top.domain})`,
            `**Relevance Score:** ${top.score}`,
            ``,
            top.content,
            ``,
            alternatives.length > 0
              ? `## Other relevant skills\n${alternatives}\n\nUse **runic-get-skill** to fetch one of these in full.`
              : '',
          ].join('\n'),
        }],
      }
    },
  )

  server.tool(
    'runic-list',
    'Browse all Runic skills grouped by domain (names only). Optionally filter by a single domain.',
    {
      domain: z
        .string()
        .optional()
        .describe('Optional domain filter, e.g. "engineering", "marketing", "c-level"'),
    },
    async ({ domain }) => {
      const filtered = domain ? skills.filter(s => s.domain === domain) : skills
      if (filtered.length === 0) {
        return {
          content: [{ type: 'text' as const, text: `Unknown domain "${domain}". Valid domains: ${DOMAINS.join(', ')}` }],
        }
      }
      return { content: [{ type: 'text' as const, text: compactList(filtered, domain) }] }
    },
  )

  server.tool(
    'runic-search',
    'Search Runic skills by keyword. Returns ranked skill names, domains, and descriptions (not full content). Use runic-get-skill to fetch the full skill after finding the right name.',
    {
      query: z.string().describe('Search keywords describing the task'),
      limit: z.number().int().min(1).max(25).optional().describe('Max results (default 10)'),
    },
    async ({ query, limit }) => {
      const matches = scoreSkills(skills, query)
      const top = matches.slice(0, limit ?? 10)
      if (top.length === 0) {
        return { content: [{ type: 'text' as const, text: `No Runic skills matched "${query}". Try runic-list to browse domains.` }] }
      }
      const text = top.map((s, i) =>
        `${i + 1}. **${s.name}** (${s.domain}) — ${s.description}`
      ).join('\n')
      return {
        content: [{
          type: 'text' as const,
          text: `Matched ${top.length} of ${matches.length} candidates:\n\n${text}\n\nUse **runic-get-skill** (name: "...") to load the full skill.`,
        }],
      }
    },
  )

  server.tool(
    'runic-get-skill',
    'Fetch the full instructions for a single Runic skill by its exact name (e.g. "code-review", "rag-architect"). Use runic-search or runic-list to discover names first.',
    { name: z.string().describe('Exact skill name, e.g. "code-review"') },
    async ({ name }) => {
      const skill = skills.find(s => s.name === name)
      if (!skill) {
        const close = scoreSkills(skills, name).slice(0, 5).map(s => s.name).join(', ')
        const hint = close ? `\n\nDid you mean one of: ${close}` : ''
        return {
          content: [{ type: 'text' as const, text: `Skill "${name}" not found.${hint}\n\nUse runic-search or runic-list to find the right name.` }],
        }
      }
      return {
        content: [{
          type: 'text' as const,
          text: `# ${skill.name} (${skill.domain})\n\n${skill.description}\n\n${skill.content}`,
        }],
      }
    },
  )

  /* ─── RuneDraw renderer tools ─── */

  server.tool(
    'runedraw',
    'Generate a polished, validated, self-contained HTML diagram (architecture, workflow, sequence, dataflow, or lifecycle) from a typed JSON spec. Writes <output>.html plus a frozen <output>.json snapshot and returns the machine receipts. Combine with the bundled runedraw skill (runic-get-skill name: "runedraw") for authoring guidance.',
    {
      type: z.enum(DIAGRAM_TYPES).describe('Diagram type: architecture, workflow, sequence, dataflow, lifecycle'),
      spec: z.string().describe('RuneDraw typed JSON IR as a string. See the runedraw skill schemas/ folder for field shape.'),
      output: z.string().optional().describe('Absolute output HTML path (defaults to ./runedraw-<type>.html in the current directory)'),
      quality: z.enum(['standard', 'showcase']).optional().describe('Quality profile (default showcase)'),
    },
    async ({ type, spec, output, quality }) => {
      const q = quality ?? 'showcase'

      let parsed: unknown
      try {
        parsed = JSON.parse(spec)
      } catch {
        return {
          content: [{ type: 'text' as const, text: 'RuneDraw: `spec` is not valid JSON. Fix the JSON and retry.' }],
        }
      }
      if (typeof parsed !== 'object' || parsed === null) {
        return { content: [{ type: 'text' as const, text: 'RuneDraw: `spec` must be a JSON object.' }] }
      }

      const outDir = output ? dirname(resolve(output)) : process.cwd()
      const outFile = output
        ? resolve(output)
        : resolve(process.cwd(), `runedraw-${type}.html`)
      if (!/\.html$/i.test(outFile)) {
        return { content: [{ type: 'text' as const, text: 'RuneDraw: output path must end in .html' }] }
      }
      const specPath = outFile.replace(/\.html$/i, '.json')

      try {
        mkdirSync(outDir, { recursive: true })
        writeFileSync(specPath, JSON.stringify(parsed, null, 2), 'utf8')

        const validate = await runRuneDraw(['validate', type, specPath, '--quality', q, '--json'])
        const validateOut = validate.stdout.trim() || validate.stderr.trim()
        const receipt = parseRuneDrawReceipt(validateOut)
        const failed = receipt.ok === false || (Array.isArray(receipt.errors) && receipt.errors.length > 0)
        if (failed) {
          return {
            content: [{
              type: 'text' as const,
              text: `RuneDraw validation FAILED (${type}). Repair only the diagnosed subject using its supportedFixes, then retry.\n\n${validateOut}`,
            }],
          }
        }

        const deliver = await runRuneDraw(['deliver', type, specPath, outFile, '--quality', q, '--json'])
        return {
          content: [{
            type: 'text' as const,
            text: [
              `RuneDraw delivered: ${outFile}`,
              `Spec snapshot: ${specPath}`,
              ``,
              `--- validate receipt ---`,
              validateOut,
              ``,
              `--- deliver receipt ---`,
              (deliver.stdout.trim() || deliver.stderr.trim()),
            ].join('\n'),
          }],
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        return {
          content: [{
            type: 'text' as const,
            text: `RuneDraw renderer error: ${msg}\n\nRuneDraw validation and delivery run inside the @diottodev/runic package via engineering/runedraw/bin/runedraw.mjs.`,
          }],
        }
      }
    },
  )

  server.tool(
    'runedraw-guide',
    'Ask the RuneDraw scenario guide which diagram type fits a described flow (e.g. "Show an API request with Redis cache miss"). Returns the recommended type and authoring hints.',
    { scenario: z.string().describe('Natural-language description of the flow to visualize') },
    async ({ scenario }) => {
      try {
        const { stdout, stderr } = await runRuneDraw(['guide', scenario, '--json'])
        return {
          content: [{ type: 'text' as const, text: (stdout.trim() || stderr.trim()) }],
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        return { content: [{ type: 'text' as const, text: `RuneDraw guide error: ${msg}` }] }
      }
    },
  )

  server.tool(
    'runic-doctor',
    'Run the Runic self-check: verifies skill loading and that the bundled RuneDraw renderer is healthy.',
    {},
    async () => {
      const lines: string[] = []
      lines.push(`Runic v1.1.0 — ${skills.length} skills loaded from ${DOMAINS.length} domains`)
      for (const domain of DOMAINS) {
        const count = skills.filter(s => s.domain === domain).length
        lines.push(`[ok] ${domain}: ${count} skills`)
      }
      if (existsSync(RUNEDRAW_CLI)) {
        try {
          const { stdout, stderr } = await runRuneDraw(['doctor'])
          lines.push(`[ok] runedraw renderer present at ${RUNEDRAW_DIR}`)
          lines.push((stdout.trim() || stderr.trim()).split('\n').slice(0, 4).join('\n'))
        } catch (err) {
          lines.push(`[warn] runedraw doctor failed: ${err instanceof Error ? err.message : String(err)}`)
        }
      } else {
        lines.push(`[warn] runedraw renderer not bundled (expected at ${RUNEDRAW_DIR})`)
      }
      return { content: [{ type: 'text' as const, text: lines.join('\n') }] }
    },
  )

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(err => {
  process.stderr.write(`runic: ${err.message}\n`)
  process.exit(1)
})
