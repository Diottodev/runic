#!/usr/bin/env node
/**
 * generate-cursor-commands.mjs
 *
 * Reads every SKILL.md across all domains, strips the YAML frontmatter,
 * and writes one plain-markdown file to .cursor-plugin/commands/{name}.md
 *
 * Each output file becomes a /slash-command in Cursor chat once the plugin
 * is installed from cursor.com/marketplace.
 *
 * Usage:
 *   node scripts/generate-cursor-commands.mjs
 *   npm run build:cursor-commands
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT       = join(__dirname, '..')
const OUTPUT_DIR = join(ROOT, '.cursor-plugin', 'commands')

const DOMAINS = [
  'engineering',
  'engineering-team',
  'ai-research',
  'ai-security',
  'research',
  'research-ops',
]

// ── YAML frontmatter parser ──────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/m)
  if (!match) return { body: raw }

  const meta = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
    meta[key] = val
  }

  return { name: meta['name'], description: meta['description'], body: match[2].trim() }
}

// ── Recursive SKILL.md discovery ────────────────────────────────────────────

function findSkillFiles(dir) {
  if (!existsSync(dir)) return []
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (!statSync(full).isDirectory()) continue
    const skill = join(full, 'SKILL.md')
    if (existsSync(skill)) {
      results.push(skill)
    } else {
      results.push(...findSkillFiles(full))
    }
  }
  return results
}

// ── Main ─────────────────────────────────────────────────────────────────────

mkdirSync(OUTPUT_DIR, { recursive: true })

const seen  = new Set()
let   count = 0
const skipped = []

for (const domain of DOMAINS) {
  const domainDir = join(ROOT, domain)
  for (const file of findSkillFiles(domainDir)) {
    const raw = readFileSync(file, 'utf8')
    const { name, body } = parseFrontmatter(raw)

    if (!name || !body) { skipped.push(file); continue }
    if (seen.has(name))  continue   // first domain wins on duplicates
    seen.add(name)

    // Cursor commands are plain markdown — no frontmatter allowed
    writeFileSync(join(OUTPUT_DIR, `${name}.md`), body + '\n')
    count++
  }
}

console.log(`✓ Generated ${count} Cursor commands → .cursor-plugin/commands/`)
if (skipped.length) {
  console.warn(`⚠ Skipped ${skipped.length} files (missing name or body):`)
  skipped.forEach(f => console.warn(`  ${f}`))
}
