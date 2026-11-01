/**
 * Visual QA harness: captures desktop / tablet / mobile screenshots
 * plus console errors and layout metrics. Run against `next start`.
 *   node tools/shots.mjs [baseUrl]
 */
import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.argv[2] || 'http://localhost:3000'
const out = '/home/user/shots'
fs.mkdirSync(out, { recursive: true })

const viewports = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
  { name: 'laptop', width: 1280, height: 800, dsf: 1 },
  { name: 'tablet', width: 820, height: 1180, dsf: 1 },
  { name: 'mobile', width: 390, height: 844, dsf: 2 },
  { name: 'small-mobile', width: 320, height: 700, dsf: 2 },
]

const browser = await chromium.launch()
const problems = []

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf,
    isMobile: vp.width < 500,
    hasTouch: vp.width < 500,
  })
  const page = await ctx.newPage()
  page.on('console', (msg) => {
    if (msg.type() === 'error') problems.push(`[${vp.name}] console: ${msg.text().slice(0, 300)}`)
  })
  page.on('pageerror', (err) => problems.push(`[${vp.name}] pageerror: ${String(err).slice(0, 300)}`))

  await page.goto(`${base}/hu`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2600)

  // overflow check
  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth
    const wide = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && (r.right > docW + 2 || r.left < -2)
      })
      .slice(0, 6)
      .map((el) => `${el.tagName}.${(el.className || '').toString().split(' ').slice(0, 2).join('.')} → ${Math.round(el.getBoundingClientRect().left)}..${Math.round(el.getBoundingClientRect().right)} (vw ${docW})`)
    return {
      scrollW: document.documentElement.scrollWidth,
      clientW: docW,
      hScroll: document.documentElement.scrollWidth > docW + 2,
      offenders: wide,
    }
  })
  if (overflow.hScroll) problems.push(`[${vp.name}] horizontal scroll: ${JSON.stringify(overflow)}`)

  await page.screenshot({ path: `${out}/${vp.name}-hero.png` })

  // walk the page so IntersectionObserver reveals fire before the full capture
  await page.evaluate(async () => {
    const prev = document.documentElement.style.scrollBehavior
    document.documentElement.style.scrollBehavior = 'auto'
    const step = Math.round(window.innerHeight * 0.6)
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 220))
    }
    window.scrollTo(0, 0)
    document.documentElement.style.scrollBehavior = prev
    await new Promise((r) => setTimeout(r, 900))
  })
  const hidden = await page.evaluate(
    () => document.querySelectorAll('.reveal:not(.is-inview)').length,
  )
  if (hidden > 0) problems.push(`[${vp.name}] ${hidden} reveal element(s) still hidden after scroll-walk`)
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${out}/${vp.name}-full.png`, fullPage: true })

  console.log(
    `${vp.name.padEnd(14)} scrollW=${overflow.scrollW} clientW=${overflow.clientW} hScroll=${overflow.hScroll}`,
  )
  if (overflow.hScroll) console.log('   offenders:', overflow.offenders)

  await ctx.close()
}

// EN page sanity + a few key route checks
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
for (const path of ['/en', '/hu/privacy', '/en/impresszum', '/hu/nemletezo-oldal']) {
  const res = await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' })
  console.log(`${path.padEnd(24)} → ${res?.status()}`)
}
await ctx.close()
await browser.close()

console.log('\n--- console problems ---')
console.log(problems.length ? problems.join('\n') : 'none')
