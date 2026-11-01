import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1.5 })
await p.goto('http://localhost:3000/hu', { waitUntil: 'networkidle' })
await p.mouse.move(900, 400); await p.waitForTimeout(2800)
const el = await p.$('.hero__visual')
await el.screenshot({ path: '/home/user/globe-crop.png' })
await b.close()
