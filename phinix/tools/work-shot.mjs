import { chromium } from 'playwright'
const b = await chromium.launch()
for (const [n, w, h] of [['d', 1440, 900], ['m', 390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
  await p.goto('http://localhost:3000/hu', { waitUntil: 'networkidle' })
  await p.evaluate(() => document.querySelector('#work')?.scrollIntoView({ block: 'start' }))
  await p.waitForTimeout(900)
  const el = await p.$('#work')
  await el.screenshot({ path: `/home/user/work-${n}.png` })
  const info = await p.evaluate(() => ({
    cards: document.querySelectorAll('.work-card').length,
    empty: !!document.querySelector('.work-empty'),
    filters: !!document.querySelector('.work__filters'),
    title: document.querySelector('.work-empty__title')?.textContent,
  }))
  console.log(n, JSON.stringify(info))
  await p.close()
}
await b.close()
