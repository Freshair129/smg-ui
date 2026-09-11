#!/usr/bin/env node
/**
 * Emit the SmartGift CI colour tokens as CSS custom properties.
 *
 *   npm run build:ci
 *   npm run build:ci -- --from ../some/other/checkout
 *
 * Source of truth: business-01-smart-gift/tokens/smartgift-color.tokens.json — W3C Design Tokens
 * format, colours sampled from the logo; its README calls it the source of truth for every colour.
 * Aliases such as {color.orange.500} are resolved, so each property carries a plain value.
 *
 * Writes src/ci-tokens.css, which is committed: a build (the Docker image included) never needs the
 * SSOT checkout. Change a colour in the SSOT, run this, commit the diff.
 *
 * Gradient tokens are skipped — they are not a single colour.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fromArg = process.argv.indexOf('--from')
const source = resolve(repo, fromArg > -1 ? process.argv[fromArg + 1] : '../business-01-smart-gift')
const TOKENS = join(source, 'tokens', 'smartgift-color.tokens.json')
const OUT = join(repo, 'src', 'ci-tokens.css')

if (!existsSync(TOKENS)) {
  console.error(`missing CI tokens: ${TOKENS}`)
  console.error('pass --from <path to the smartgift repo> if it lives elsewhere')
  process.exit(1)
}

const raw = await readFile(TOKENS, 'utf8')
const flat = new Map()
const walk = (node, path) => {
  // Only plain objects are groups or tokens; meta strings and $type would recurse forever.
  if (!node || typeof node !== 'object' || Array.isArray(node)) return
  if ('$value' in node) { flat.set(path.join('.'), node); return }
  for (const [key, child] of Object.entries(node ?? {})) if (!key.startsWith('$')) walk(child, [...path, key])
}
walk(JSON.parse(raw), [])

const resolveValue = (value, seen = []) => {
  if (typeof value !== 'string') return null
  const alias = value.match(/^\{(.+)\}$/)
  if (!alias) return value
  if (seen.includes(alias[1])) throw new Error(`alias cycle: ${[...seen, alias[1]].join(' -> ')}`)
  const target = flat.get(alias[1])
  if (!target) throw new Error(`unknown alias {${alias[1]}}`)
  return resolveValue(target.$value, [...seen, alias[1]])
}

const lines = []
let skipped = 0
for (const [path, token] of flat) {
  const value = resolveValue(token.$value)
  if (value === null) { skipped++; continue }
  const via = typeof token.$value === 'string' && token.$value.startsWith('{') ? `  /* ${token.$value} */` : ''
  lines.push(`  --ci-${path.replace(/\./g, '-')}: ${value};${via}`)
}

const sha = createHash('sha256').update(raw).digest('hex').slice(0, 12)
await writeFile(OUT, `/* GENERATED FILE — do not edit by hand. Run: npm run build:ci
 * Source: business-01-smart-gift/tokens/smartgift-color.tokens.json (sha256 ${sha}…)
 * SmartGift CI colours, sampled from the logo. The catalogue (.bline-section) maps its palette onto
 * these; the landing page keeps its own palette for now.
 */
:root {
${lines.join('\n')}
}
`, 'utf8')
console.log(`wrote ${OUT}: ${lines.length} tokens (${skipped} gradient tokens skipped)`)
