#!/usr/bin/env node
/**
 * Gate a .glb against the product's verified dimensions before it may be published.
 *
 *   npm run check:3d                       every model on disk, drafts and procedural
 *   npm run check:3d -- PM-TMB some.glb    check one candidate file against one product code
 *
 * Six of the nine draft models shipped with the wrong shape — PM-FLASH was a square bar
 * where the drive is 6.5 x 1.8 x 0.9 cm — because nothing compared the mesh to the product.
 * This compares the mesh's bounding-box side ratios (sorted, longest normalised to 1) with
 * dimensions_cm from the SSOT. Ratios, not absolute size, so mesh units don't matter.
 *
 * Exits non-zero when a published model or a candidate is off by more than TOLERANCE, so it
 * can block a release. Withheld models are reported but never fail the run.
 */
import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = join(dirname(fileURLToPath(import.meta.url)), '..')
const MODEL_DIR = join(repo, 'public', 'assets', 'smartgift', '3d')
const GENERATED = join(repo, 'src', 'data', 'catalogItems.generated.ts')
const CORE_MEDIA = join(repo, 'src', 'data', 'coreMedia.ts')
const TOLERANCE = 0.15   // ratio points; 0.15 ~ "one side is 15% out of proportion"

/** Bounding box from the glTF JSON chunk — accessor min/max, no mesh decoding needed. */
async function boundingBox(file) {
  const buf = await readFile(file)
  let offset = 12
  let json
  while (offset < buf.length) {
    const length = buf.readUInt32LE(offset)
    const type = buf.readUInt32LE(offset + 4)
    if (type === 0x4e4f534a) json = JSON.parse(buf.subarray(offset + 8, offset + 8 + length).toString('utf8'))
    offset += 8 + length
  }
  if (!json) throw new Error('no JSON chunk')
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const mesh of json.meshes ?? []) {
    for (const prim of mesh.primitives) {
      const acc = json.accessors[prim.attributes.POSITION]
      for (let i = 0; i < 3; i++) {
        min[i] = Math.min(min[i], acc.min[i])
        max[i] = Math.max(max[i], acc.max[i])
      }
    }
  }
  return [0, 1, 2].map(i => max[i] - min[i])
}

const ratios = sides => {
  const sorted = [...sides].sort((a, b) => b - a)
  return sorted.map(v => v / sorted[0])
}

const generated = await readFile(GENERATED, 'utf8')
const items = JSON.parse(generated.match(/export const CORE_ITEMS: CatalogItemSeed\[\] = (\[[\s\S]*?\n\])\n/)[1])
const dims = Object.fromEntries(items.filter(i => i.dimensions_cm).map(i => [i.code, i.dimensions_cm]))

// Which models the site publishes, by URL — a commented-out line is withheld. Keyed by URL, not
// product code: one product can have a withheld TRELLIS draft and a published procedural model side
// by side, and only the published one may fail the gate.
const media = await readFile(CORE_MEDIA, 'utf8')
const published = new Set([...media.matchAll(/^\s*model3d_url:\s*'([^']+\.glb)'/gm)].map(m => m[1]))

const listGlb = async (dir, prefix) => existsSync(dir)
  ? (await readdir(dir)).filter(f => f.endsWith('.glb'))
      .map(f => ({ code: basename(f, '.glb'), file: join(dir, f), url: `${prefix}${f}` }))
  : []

const [argCode, argFile] = process.argv.slice(2)
const targets = argCode && argFile
  ? [{ code: argCode, file: argFile, url: null }]
  : [...await listGlb(MODEL_DIR, '/assets/smartgift/3d/'),
     ...await listGlb(join(MODEL_DIR, 'procedural'), '/assets/smartgift/3d/procedural/')]

const W = 26
let failures = 0
console.log(`${'model'.padEnd(W)}${'mesh'.padEnd(22)}${'product'.padEnd(22)}${'off'.padEnd(8)}status`)
for (const { code, file, url } of targets) {
  const label = url ? url.replace('/assets/smartgift/3d/', '').replace(/\.glb$/, '') : code
  if (!existsSync(file)) { console.log(`${label.padEnd(W)}missing file`); failures++; continue }
  const dim = dims[code]
  if (!dim) { console.log(`${label.padEnd(W)}${'-'.padEnd(44)}${'-'.padEnd(8)}no dimensions in the SSOT — cannot check`); continue }
  const mesh = ratios(await boundingBox(file))
  const want = ratios([dim.length, dim.width, dim.height])
  const off = Math.max(...mesh.map((v, i) => Math.abs(v - want[i])))
  const ok = off <= TOLERANCE
  const live = url === null ? null : published.has(url)
  const state = live === null ? (ok ? 'pass (candidate)' : 'FAIL (candidate)')
    : live ? (ok ? 'PASS' : 'FAIL — published') : (ok ? 'pass (withheld)' : 'fail (withheld)')
  if (!ok && live !== false) failures++
  const fmt = r => r.map(v => v.toFixed(2)).join(' : ')
  console.log(`${label.padEnd(W)}${fmt(mesh).padEnd(22)}${fmt(want).padEnd(22)}${`${Math.round(off * 100)}%`.padEnd(8)}${state}`)
}
console.log(`\ntolerance ${Math.round(TOLERANCE * 100)}% · failing (published or candidate): ${failures}`)
process.exit(failures ? 1 : 0)
