#!/usr/bin/env node
/**
 * Build dimension-accurate 3D models for the SmartGift products that are surfaces of revolution.
 *
 *   npm run build:3d
 *
 * Six of the nine TRELLIS drafts came out the wrong shape because each was generated from one
 * poor photo. A tumbler, a thermos and a travel mug need no photo: each is a 2D profile spun
 * around an axis, so the shape can be built straight from the verified dimensions_cm in the SSOT.
 * The result is exact to those dimensions and ~100 KB instead of ~38 MB.
 *
 * What is measured and what is not:
 *   measured    overall diameter and height, from dimensions_cm, exact
 *   assumed     lid vs body proportions, fillet radii, taper: schematic, typical of the type
 *   assumed     finishes: matte black for the two thermoses (as in their product photos),
 *               brushed steel for the stainless mug. These are not colour claims.
 *   verified    an LED display on the lid of PM-TMB (spec: "Touch Sensor Smart LED Temperature
 *               Display Ring") and on PM-BOTTLE-LED (named in the product). Modelled as a dark
 *               display area on the lid top; no digits are drawn, no readout is claimed.
 *
 * Models stay model3d_status 'draft' and must pass `npm run check:3d` before publishing.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repo = join(dirname(fileURLToPath(import.meta.url)), '..')
const GENERATED = join(repo, 'src', 'data', 'catalogItems.generated.ts')
const OUT_DIR = join(repo, 'public', 'assets', 'smartgift', '3d', 'procedural')
const SEGMENTS = 72

const PRODUCTS = {
  'PM-TMB': { profile: 'thermos', body: 'matte_black', display: true },
  'PM-BOTTLE-LED': { profile: 'thermos', body: 'matte_black', display: true },
  'PM-CFMUG': { profile: 'travelMug', body: 'brushed_steel', display: false }
}

const MATERIALS = {
  matte_black: { name: 'matte-black-coating', pbrMetallicRoughness: { baseColorFactor: [0.035, 0.035, 0.04, 1], metallicFactor: 0.25, roughnessFactor: 0.55 } },
  brushed_steel: { name: 'brushed-stainless', pbrMetallicRoughness: { baseColorFactor: [0.8, 0.8, 0.82, 1], metallicFactor: 1, roughnessFactor: 0.32 } },
  dark_polymer: { name: 'dark-polymer-lid', pbrMetallicRoughness: { baseColorFactor: [0.06, 0.06, 0.065, 1], metallicFactor: 0, roughnessFactor: 0.45 } },
  display_glass: { name: 'display-glass', pbrMetallicRoughness: { baseColorFactor: [0.012, 0.012, 0.015, 1], metallicFactor: 0, roughnessFactor: 0.06 } }
}

const deg = d => (d * Math.PI) / 180
const arc = (cx, cy, rad, a0, a1, steps = 8) =>
  Array.from({ length: steps + 1 }, (_, k) => {
    const a = a0 + (a1 - a0) * (k / steps)
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]
  })

// Profiles are [radius, height] polylines in metres. Each polyline is smooth; the seam between two
// polylines is a hard edge. Walk bottom-centre -> outward -> up -> inward at the top, so the
// outward normal is always (dy, -dr).
const PROFILES = {
  thermos(D, H, { body, display }) {
    const R = D / 2, f = R * 0.22, bodyTop = H * 0.86
    const neckR = R * 0.95, lidR = R * 0.985, lidBottom = bodyTop + H * 0.006, f2 = R * 0.2
    const dispR = R * 0.6
    const parts = [
      { material: body, polylines: [
        [[0, 0], [R - f, 0]],
        [...arc(R - f, f, f, deg(-90), deg(0)), [R, bodyTop]],
        [[R, bodyTop], [neckR, bodyTop]]
      ] },
      { material: 'dark_polymer', polylines: [
        [[neckR, bodyTop], [neckR, lidBottom]],
        [[neckR, lidBottom], [lidR, lidBottom]],
        [[lidR, lidBottom], ...arc(lidR - f2, H - f2, f2, deg(0), deg(90))],
        [[lidR - f2, H], [display ? dispR : 0, H]]
      ] }
    ]
    if (display) parts.push({ material: 'display_glass', polylines: [[[dispR, H], [0, H]]] })
    return parts
  },
  travelMug(D, H, { body }) {
    const R = D / 2, Rb = R * 0.82, f = Rb * 0.18, bodyTop = H * 0.8
    const neckR = R * 0.94, lidR = R * 0.99, lidBottom = bodyTop + H * 0.008, f2 = R * 0.14
    const rim = H * 0.985
    return [
      { material: body, polylines: [
        [[0, 0], [Rb - f, 0]],
        [...arc(Rb - f, f, f, deg(-90), deg(0)), [R, bodyTop]],
        [[R, bodyTop], [neckR, bodyTop]]
      ] },
      { material: 'dark_polymer', polylines: [
        [[neckR, bodyTop], [neckR, lidBottom]],
        [[neckR, lidBottom], [lidR, lidBottom]],
        [[lidR, lidBottom], ...arc(lidR - f2, rim - f2, f2, deg(0), deg(90))],
        [[lidR - f2, rim], [R * 0.5, H * 0.995], [0, H]]
      ] }
    ]
  }
}

function revolve(polyline) {
  const n = polyline.length
  const normal2 = polyline.map((_, i) => {
    const a = polyline[Math.max(0, i - 1)], b = polyline[Math.min(n - 1, i + 1)]
    const dr = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dr, dy) || 1
    return [dy / len, -dr / len]
  })
  const positions = [], normals = [], indices = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= SEGMENTS; j++) {
      const t = (j / SEGMENTS) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t)
      const [r, y] = polyline[i], [nr, ny] = normal2[i]
      positions.push(r * c, y, r * s)
      normals.push(nr * c, ny, nr * s)
    }
  }
  const W = SEGMENTS + 1
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < SEGMENTS; j++) {
      const a = i * W + j, b = a + 1, c = a + W, d = c + 1
      indices.push(a, c, b, b, c, d) // counter-clockwise seen from outside
    }
  }
  return { positions, normals, indices }
}

function buildPart(part) {
  const out = { material: part.material, positions: [], normals: [], indices: [] }
  for (const line of part.polylines) {
    const g = revolve(line), offset = out.positions.length / 3
    out.positions.push(...g.positions)
    out.normals.push(...g.normals)
    out.indices.push(...g.indices.map(i => i + offset))
  }
  return out
}

function toGlb(name, parts, extras) {
  const chunks = []
  let length = 0
  const bufferViews = [], accessors = [], primitives = [], materials = [], matIndex = {}
  const view = (typed, target) => {
    const pad = (4 - (length % 4)) % 4
    if (pad) { chunks.push(Buffer.alloc(pad)); length += pad }
    const bytes = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength)
    bufferViews.push({ buffer: 0, byteOffset: length, byteLength: bytes.length, target })
    chunks.push(bytes)
    length += bytes.length
    return bufferViews.length - 1
  }
  for (const p of parts) {
    if (!(p.material in matIndex)) { matIndex[p.material] = materials.length; materials.push(MATERIALS[p.material]) }
    const count = p.positions.length / 3
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < p.positions.length; i++) {
      min[i % 3] = Math.min(min[i % 3], p.positions[i])
      max[i % 3] = Math.max(max[i % 3], p.positions[i])
    }
    const wide = count > 65535
    const base = accessors.length
    accessors.push({ bufferView: view(new Float32Array(p.positions), 34962), componentType: 5126, count, type: 'VEC3', min, max })
    accessors.push({ bufferView: view(new Float32Array(p.normals), 34962), componentType: 5126, count, type: 'VEC3' })
    accessors.push({
      bufferView: view(wide ? new Uint32Array(p.indices) : new Uint16Array(p.indices), 34963),
      componentType: wide ? 5125 : 5123, count: p.indices.length, type: 'SCALAR'
    })
    primitives.push({ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, material: matIndex[p.material] })
  }
  const tail = (4 - (length % 4)) % 4
  if (tail) { chunks.push(Buffer.alloc(tail)); length += tail }
  const bin = Buffer.concat(chunks)
  const gltf = {
    asset: { version: '2.0', generator: 'SmartGift scripts/build-procedural-3d.mjs', extras },
    scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0, name }],
    meshes: [{ name, primitives }], materials, accessors, bufferViews, buffers: [{ byteLength: bin.length }]
  }
  let json = Buffer.from(JSON.stringify(gltf), 'utf8')
  const jpad = (4 - (json.length % 4)) % 4
  if (jpad) json = Buffer.concat([json, Buffer.alloc(jpad, 0x20)])
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(12 + 8 + json.length + 8 + bin.length, 8)
  const chunkHeader = (len, type) => {
    const b = Buffer.alloc(8)
    b.writeUInt32LE(len, 0)
    b.writeUInt32LE(type, 4)
    return b
  }
  return Buffer.concat([header, chunkHeader(json.length, 0x4e4f534a), json, chunkHeader(bin.length, 0x004e4942), bin])
}

const generated = await readFile(GENERATED, 'utf8')
const items = JSON.parse(generated.match(/export const CORE_ITEMS: CatalogItemSeed\[\] = (\[[\s\S]*?\r?\n\])\r?\n/)[1])
const byCode = Object.fromEntries(items.map(i => [i.code, i]))
await mkdir(OUT_DIR, { recursive: true })

console.log(`${'code'.padEnd(16)}${'dimensions_cm'.padEnd(20)}${'verts'.padEnd(8)}${'tris'.padEnd(8)}size`)
for (const [code, spec] of Object.entries(PRODUCTS)) {
  const dim = byCode[code]?.dimensions_cm
  if (!dim) throw new Error(`${code}: no dimensions_cm in the SSOT`)
  if (dim.length !== dim.width) throw new Error(`${code}: ${dim.length} x ${dim.width} footprint is not round, so not a surface of revolution`)
  const D = dim.length / 100, H = dim.height / 100
  const parts = PROFILES[spec.profile](D, H, spec).map(buildPart)
  const glb = toGlb(code, parts, {
    product_code: code,
    dimensions_cm: dim,
    source: 'business-01-smart-gift data-pipeline/02_prepared/smartgift_catalog_master.json dimensions_cm',
    method: `surface of revolution, ${spec.profile} profile`,
    measured: 'overall diameter and height',
    schematic: 'lid/body proportions, fillets, taper, finishes'
  })
  await writeFile(join(OUT_DIR, `${code}.glb`), glb)
  const verts = parts.reduce((s, p) => s + p.positions.length / 3, 0)
  const tris = parts.reduce((s, p) => s + p.indices.length / 3, 0)
  console.log(`${code.padEnd(16)}${`${dim.length} x ${dim.width} x ${dim.height}`.padEnd(20)}${String(verts).padEnd(8)}${String(tris).padEnd(8)}${(glb.length / 1024).toFixed(0)} KB`)
}
console.log(`\nwrote ${OUT_DIR}`)
