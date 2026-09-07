import fs from 'fs'
import path from 'path'

const sourceBase = 'C:/Users/pc/workspace/business-01-smart-gift/comfy-3d-products/outputs'
const destBase = './public/assets/smartgift'

function copyFolder(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source folder does not exist: ${src}`)
    return
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const files = fs.readdirSync(src)
  for (const file of files) {
    const srcFile = path.join(src, file)
    const destFile = path.join(dest, file)
    const stat = fs.statSync(srcFile)
    if (stat.isFile()) {
      fs.copyFileSync(srcFile, destFile)
      console.log(`Copied: ${file} -> ${dest}`)
    }
  }
}

// 1. Copy 3D GLB models
copyFolder(path.join(sourceBase, 'final'), path.join(destBase, '3d'))

// 2. Copy Client Brand Mockups
copyFolder(path.join(sourceBase, 'mockups'), path.join(destBase, 'mockups'))

// 3. Copy Plates
copyFolder(path.join(sourceBase, 'plates'), path.join(destBase, 'plates'))

console.log('✅ Asset sync completed successfully!')
