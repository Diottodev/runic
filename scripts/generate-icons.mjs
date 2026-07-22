import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('sharp not found — run: npm install sharp')
  process.exit(1)
}

const svg = readFileSync(join(ROOT, 'assets/icon.svg'))

const sizes = [
  { size: 16,  out: 'web/public/favicon-16.png' },
  { size: 32,  out: 'web/public/favicon-32.png' },
  { size: 256, out: 'assets/icon-256.png' },
  { size: 512, out: 'assets/icon-512.png' },
]

for (const { size, out } of sizes) {
  const outPath = join(ROOT, out)
  mkdirSync(dirname(outPath), { recursive: true })
  await sharp(svg).resize(size, size).png().toFile(outPath)
  console.log(`✓ ${size}x${size} → ${out}`)
}

// favicon.svg — copy master to web/public
writeFileSync(
  join(ROOT, 'web/public/favicon.svg'),
  readFileSync(join(ROOT, 'assets/icon.svg'))
)
console.log('✓ favicon.svg → web/public/favicon.svg')
