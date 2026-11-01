import { chromium } from 'playwright'
import fs from 'node:fs'
const svg = fs.readFileSync('tools/logo/emblem-trace.svg', 'utf8')
const html = `<!doctype html><html><body style="margin:0;background:#0a0b0e;display:flex;gap:20px;padding:20px">
  <div style="width:420px">${svg.replace('<svg ', '<svg width="420" height="420" ')}</div>
  <div style="background:#f4efe7;width:200px;display:grid;place-items:center">${svg.replace('<svg ', '<svg width="140" height="140" ')}</div>
  <div style="display:flex;flex-direction:column;gap:14px;align-items:center;background:#12151c;padding:14px;border-radius:12px">
    <div>${svg.replace('<svg ', '<svg width="64" height="64" ')}</div>
    <div>${svg.replace('<svg ', '<svg width="32" height="32" ')}</div>
    <div>${svg.replace('<svg ', '<svg width="16" height="16" ')}</div>
  </div>
</body></html>`
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 940, height: 480 }, deviceScaleFactor: 2 })
await p.setContent(html)
await p.waitForTimeout(400)
await p.screenshot({ path: '/home/user/logo-vector-check.png' })
await b.close()
console.log('ok')
