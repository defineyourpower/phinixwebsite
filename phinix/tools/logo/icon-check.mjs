import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 720, height: 220 }, deviceScaleFactor: 3 })
const html = (s) => `<!doctype html><body style="margin:0;background:#2b2f36;display:flex;gap:26px;align-items:center;padding:30px">
 ${[64, 48, 32, 16].map(n => `<div style="text-align:center"><img src="http://localhost:3000/favicon.svg" width="${n}" height="${n}" style="border-radius:${Math.round(n*0.18)}px"><div style="color:#aaa;font:11px system-ui;margin-top:6px">${n}</div></div>`).join('')}
 <img src="http://localhost:3000/icon-512.png" width="128" height="128" style="border-radius:26px">
 <img src="http://localhost:3000/apple-icon.png" width="180" height="180" style="border-radius:38px">
</body>`
await p.setContent(html())
await p.waitForTimeout(700)
await p.screenshot({ path: '/home/user/icon-scale-check.png' })
await b.close()
