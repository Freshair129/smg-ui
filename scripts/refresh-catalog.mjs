/**
 * Refresh the catalog's data files from the SmartGift pipeline.
 *
 * The catalog page itself (public/catalog/index.html and its css/js) is source
 * that lives in this repo and is edited here. Only the JSON under
 * public/catalog/data/ has an upstream — it is regenerated whenever the pricing
 * pipeline runs — so this pulls just that across, and nothing else.
 *
 *   npm run refresh:catalog
 *   npm run refresh:catalog -- --from ../some/other/checkout
 */
import { cp, mkdir, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '..')

const fromArg = process.argv.indexOf('--from')
const source = resolve(
  repo,
  fromArg > -1 ? process.argv[fromArg + 1] : '../business-01-smart-gift',
)

const src = join(source, 'public', 'data')
const dest = join(repo, 'public', 'catalog', 'data')

if (!existsSync(src)) {
  console.error(`no catalog data at ${src}`)
  console.error('pass --from <path to the smartgift repo> if it lives elsewhere')
  process.exit(1)
}

await mkdir(dest, { recursive: true })
await cp(src, dest, { recursive: true })

let files = 0
let bytes = 0
const walk = async (dir) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) await walk(full)
    else {
      files += 1
      bytes += (await stat(full)).size
    }
  }
}
await walk(dest)

console.log(`refreshed ${files} data files (${(bytes / 1024 / 1024).toFixed(1)} MB)`)
console.log(`  from ${src}`)
console.log(`  into ${dest}`)
console.log('review the diff before committing — this overwrites in place')
