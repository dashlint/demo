#!/usr/bin/env node
// Scans the demo apps for `// dashlint-demo pattern <n>` markers (spec SS6.17.1) and checks that
// every pattern expected on each platform is present exactly once.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = fileURLToPath(new URL('.', import.meta.url))
const repoRoot = process.argv[2] ?? join(SCRIPT_DIR, '..')

const SOURCE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx'])
const SKIP_DIR = new Set(['node_modules', 'dist', '.git'])

const PLATFORMS = {
  web: { dir: 'web/src', required: [1, 2, 3, 5, 7, 10, 12, 13, 15, 16] },
  mobile: { dir: 'mobile/src', required: [4, 6, 8, 9, 11, 14] },
}

function walk(dir) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return []
  }
  const files = []
  for (const entry of entries) {
    if (SKIP_DIR.has(entry)) continue
    const full = join(dir, entry)
    const info = statSync(full)
    if (info.isDirectory()) files.push(...walk(full))
    else if (SOURCE_EXT.has(extname(entry))) files.push(full)
  }
  return files
}

function findMarkers(files) {
  const markerRe = /dashlint-demo pattern (\d+)/
  const found = new Map() // pattern number -> [{file, line}]
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, index) => {
      const match = line.match(markerRe)
      if (!match) return
      const n = Number(match[1])
      const hits = found.get(n) ?? []
      hits.push({ file: relative(repoRoot, file), line: index + 1 })
      found.set(n, hits)
    })
  }
  return found
}

let ok = true
for (const [platform, { dir, required }] of Object.entries(PLATFORMS)) {
  const platformDir = join(repoRoot, dir)
  let exists = true
  try {
    statSync(platformDir)
  } catch {
    exists = false
  }
  if (!exists) {
    console.log(`${platform}: ${dir} not present, skipped`)
    continue
  }

  const files = walk(platformDir)
  const found = findMarkers(files)

  console.log(`${platform}: ${files.length} source files scanned`)
  for (const n of [...found.keys()].sort((a, b) => a - b)) {
    for (const hit of found.get(n)) {
      console.log(`  pattern ${n}: ${hit.file}:${hit.line}`)
    }
  }

  const missing = required.filter((n) => !found.has(n))
  const duplicated = required.filter((n) => (found.get(n)?.length ?? 0) > 1)

  if (missing.length > 0) {
    console.log(`${platform}: MISSING patterns ${missing.join(', ')}`)
    ok = false
  }
  if (duplicated.length > 0) {
    console.log(`${platform}: DUPLICATE markers for patterns ${duplicated.join(', ')}`)
    ok = false
  }
  if (missing.length === 0 && duplicated.length === 0) {
    console.log(`${platform}: all ${required.length} required patterns found, RESULT PASS`)
  }
}

if (!ok) {
  console.log('RESULT FAIL')
  process.exit(1)
}
console.log('RESULT PASS')
