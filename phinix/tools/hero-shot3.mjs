import { chromium } from 'playwright'
const b = await chromium.launch()
// 1) static (no interaction) → poster path, exactly what the user photographed
for (const s of [{ n: 'poster-d', w: 1440, h: 980 }, { n: 'poster-m', w: 390, h: 900 }]) {
  const p = await b.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 })
  await p.goto('http://localhost:3000/hu', { waitUntil: 'load' })
  await p.waitForTimeout(900)
  const box = await p.evaluate(() => {
    const el = document.querySelector('.hero')
    const b = el.getBoundingClientRect()
    return { y: b.y + window.scrollY, h: Math.min(b.height, 1250) }
  })
  await p.screenshot({ path: `/home/user/${s.n}.png`, clip: { x: 0, y: box.y, width: s.w, height: box.h } })
  await p.close()
}
// 2) live WebGL after intent
const p = await b.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1 })
await p.goto('http://localhost:3000/hu', { waitUntil: 'networkidle' })
await p.mouse.move(900, 400); await p.waitForTimeout(3000)
const box = await p.evaluate(() => {
  const el = document.querySelector('.hero'); const b = el.getBoundingClientRect()
  return { y: b.y + window.scrollY, h: Math.min(b.height, 1250) }
})
await p.screenshot({ path: '/home/user/live-d.png', clip: { x: 0, y: box.y, width: 1440, height: box.h } })
await b.close()
