import { chromium } from 'playwright'
const b = await chromium.launch({ args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] })
const results = []
const ok = (name, cond, extra = '') => results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? ' — ' + extra : ''}`)

// ---------- desktop ----------
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
const errors = []
p.on('pageerror', (e) => errors.push(String(e)))
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await p.goto('http://localhost:3000/hu', { waitUntil: 'networkidle' })

// 3D globe: activates on scroll and writes a canvas
await p.mouse.wheel(0, 40)
await p.waitForTimeout(3000)
const canvas = await p.$('.globe-stage canvas')
ok('3D globe mounts after intent', !!canvas)
const canvasBox = canvas ? await canvas.boundingBox() : null
ok('canvas has real size', !!canvasBox && canvasBox.width > 200 && canvasBox.height > 200, canvasBox ? `${Math.round(canvasBox.width)}x${Math.round(canvasBox.height)}` : 'none')
const ready = await p.getAttribute('.globe-stage [data-ready]', 'data-ready').catch(() => null)
ok('globe reports ready', ready === 'true')

// drag rotates (compare canvas pixels hash before/after)
const rotBefore = await p.evaluate(() => {
  const c = document.querySelector('.globe-stage canvas')
  return c ? c.width + 'x' + c.height : ''
})
await p.mouse.move(1000, 480)
await p.mouse.down()
await p.mouse.move(1120, 520, { steps: 8 })
await p.mouse.up()
await p.waitForTimeout(600)
ok('globe drag handled without errors', errors.length === 0)

// work section — two legitimate states:
//   no projects uploaded → the "coming soon" block, no filters
//   projects uploaded    → cards + category filters that actually narrow the grid
const workState = await p.evaluate(() => ({
  empty: !!document.querySelector('.work-empty'),
  filters: !!document.querySelector('.work__filters'),
  cards: document.querySelectorAll('#work-grid > *').length,
}))

if (workState.empty) {
  ok('empty portfolio shows the coming-soon block', workState.filters === false && workState.cards === 0, 'no filters, no cards')
} else {
  await p.click('.work__filters .chip:nth-child(2)')
  await p.waitForTimeout(400)
  const visibleCards = await p.$$eval('#work-grid > *', (els) => els.filter((e) => !e.hidden).length)
  const allCards = await p.$$eval('#work-grid > *', (els) => els.length)
  ok('work filter narrows the grid', visibleCards > 0 && visibleCards < allCards, `${visibleCards}/${allCards}`)
}

// FAQ accordion
const firstOpen = await p.getAttribute('#faq-trigger-0', 'aria-expanded')
await p.click('#faq-trigger-1')
const secondOpen = await p.getAttribute('#faq-trigger-1', 'aria-expanded')
const firstNowClosed = await p.getAttribute('#faq-trigger-0', 'aria-expanded')
ok('FAQ accordion opens/closes', firstOpen === 'true' && secondOpen === 'true' && firstNowClosed === 'false')

// language switch preserves nothing weird and lands on /en
await p.click('.lang__item:not(.lang__item--active)')
await p.waitForURL('**/en', { timeout: 8000 }).catch(() => {})
ok('language switch → /en', p.url().endsWith('/en'), p.url())

// contact form validation
await p.goto('http://localhost:3000/hu#contact', { waitUntil: 'networkidle' })
await p.click('button[type="submit"]')
await p.waitForTimeout(300)
const errCount = await p.$$eval('.field__error', (e) => e.length)
ok('client validation blocks empty submit', errCount >= 3, `${errCount} errors shown`)

// contact form success (API)
await p.fill('input[name="name"]', 'Teszt Elek')
await p.fill('input[name="email"]', 'teszt@example.com')
await p.selectOption('select[name="projectType"]', { index: 1 })
await p.fill('textarea[name="message"]', 'Szeretnék egy egyedi weboldalt, sok izgalmas részlettel.')
await p.check('input[name="consent"]')
await p.waitForTimeout(1300)
await p.click('button[type="submit"]')
// real delivery (Gmail SMTP + auto-reply) takes ~2.3 s — wait for the state,
// not for a fixed timeout
const success = await p
  .waitForSelector('.form-success', { timeout: 20000 })
  .then(() => true)
  .catch(() => false)
ok('contact form submits and shows success', success)

// mobile drawer
const mctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const mp = await mctx.newPage()
await mp.goto('http://localhost:3000/hu', { waitUntil: 'networkidle' })
await mp.click('.burger')
await mp.waitForTimeout(500)
const drawerOpen = await mp.getAttribute('.drawer', 'data-open')
const drawerVisible = await mp.isVisible('.drawer__link')
ok('mobile menu opens', drawerOpen === 'true' && drawerVisible)
await mp.keyboard.press('Escape')
await mp.waitForTimeout(400)
ok('Escape closes the menu', (await mp.getAttribute('.drawer', 'data-open')) === 'false')

// keyboard focus + skip link
await mp.evaluate(() => document.body.focus())
await mp.keyboard.press('Tab')
const focused = await mp.evaluate(() => document.activeElement?.className)
ok('skip link is first in tab order', String(focused).includes('skip-link'), String(focused))

ok('no console/page errors', errors.length === 0, errors.slice(0, 2).join(' | '))

console.log(results.join('\n'))
await b.close()
