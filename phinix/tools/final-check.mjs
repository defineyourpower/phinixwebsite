import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:3000/hu', { waitUntil: 'networkidle' })
await p.waitForTimeout(400)

for (const [name, sel] of [['header', 'header'], ['contact', '#kapcsolat'], ['footer', 'footer']]) {
  const el = await p.$(sel)
  if (el) await el.screenshot({ path: `/home/user/f-${name}.png` })
}
// mail/tel links
const links = await p.evaluate(() =>
  [...document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]')].map((a) => a.getAttribute('href')),
)
console.log('contact links:', [...new Set(links)].join('  '))
const txt = await p.evaluate(() => document.querySelector('#kapcsolat')?.innerText.replace(/\s+/g, ' ').slice(0, 420))
console.log('contact text:', txt)
await p.close()

// mobile
const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await m.goto('http://localhost:3000/hu', { waitUntil: 'networkidle' })
await m.mouse.move(190, 500); await m.waitForTimeout(2500)
await m.evaluate(() => document.querySelector('.hero__visual')?.scrollIntoView({ block: 'center' }))
await m.waitForTimeout(700)
await m.screenshot({ path: '/home/user/f-mobile-globe.png' })
await m.close()
await b.close()
