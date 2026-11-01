import { chromium } from 'playwright'
import fs from 'node:fs'

const svg = fs.readFileSync('public/phinix-emblem.svg', 'utf8')
// icons need a dark plate so the pale gold/navy mark stays legible at 16 px
const plate = (size, radiusPct, inner) => `<!doctype html><html><body style="margin:0">
<div style="width:${size}px;height:${size}px;background:#0A0B0E;border-radius:${Math.round(size * radiusPct)}px;display:grid;place-items:center;overflow:hidden">
  <div style="width:${Math.round(size * inner)}px;height:${Math.round(size * inner)}px">${svg}</div>
</div></body></html>`

const b = await chromium.launch()
const page = await b.newPage({ deviceScaleFactor: 1 })

async function shot(size, radiusPct, inner, out, transparent = false) {
  await page.setViewportSize({ width: size, height: size })
  const html = transparent
    ? `<!doctype html><html><body style="margin:0"><div style="width:${size}px;height:${size}px;display:grid;place-items:center"><div style="width:${Math.round(size*inner)}px;height:${Math.round(size*inner)}px">${svg}</div></div></body></html>`
    : plate(size, radiusPct, inner)
  await page.setContent(html)
  await page.waitForTimeout(120)
  await page.screenshot({ path: out, omitBackground: transparent })
  console.log(out)
}

await shot(512, 0.22, 0.74, 'public/icon-512.png')
await shot(192, 0.22, 0.78, 'public/icon-192.png')
await shot(180, 0.22, 0.78, 'public/apple-icon.png')
await shot(32,  0.20, 0.84, 'public/favicon-32.png')
await shot(32,  0.00, 0.92, 'tools/logo/favicon-transparent.png', true)
await b.close()
