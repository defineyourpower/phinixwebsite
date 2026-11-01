/**
 * Diagnosztika: miért nem megy a levélküldés?
 *
 *   npm run mail:check
 *
 * Sorban ellenőrzi a hálózatot, a beállításokat és a bejelentkezést, és magyarul
 * megmondja a következő konkrét lépést. Nem küld levelet.
 */
import fs from 'node:fs'
import net from 'node:net'
import tls from 'node:tls'
import nodemailer from 'nodemailer'

const env = {}
if (fs.existsSync('.env.local')) {
  for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const host = env.SMTP_HOST || ''
const port = Number(env.SMTP_PORT || 465)
const user = env.SMTP_USER || ''
const pass = env.SMTP_PASS || ''
const to = env.CONTACT_TO_EMAIL || user

const ok = (s) => console.log(`  ✓ ${s}`)
const bad = (s) => console.log(`  ✗ ${s}`)
const info = (s) => console.log(`    ${s}`)

console.log('\nPHINIX — e-mail kézbesítés ellenőrzése\n')

/* 1 — beállítások */
console.log('1) Beállítások')
if (!host) { bad('SMTP_HOST hiányzik'); process.exit(1) }
ok(`SMTP_HOST = ${host}`)
ok(`SMTP_PORT = ${port}`)
info(`SMTP_USER = ${user || '(üres)'}`)
info(`CÉL       = ${to || '(üres)'}`)

const looksLikeAppPassword = /^[a-z]{16}$/i.test(pass.replace(/\s/g, ''))
if (!pass) {
  bad('SMTP_PASS üres — a levél csak a .data/contact-inbox.jsonl fájlba kerül')
  process.exit(1)
}
if (looksLikeAppPassword) ok('SMTP_PASS formátuma alkalmazásjelszónak tűnik (16 jegy)')
else bad(`SMTP_PASS nem 16 jegyű (${pass.replace(/\s/g, '').length} karakter) → ez nagyon valószínűleg a fiók jelszava, nem alkalmazásjelszó`)

/* 2 — hálózat */
console.log('\n2) Hálózat')
await new Promise((resolve) => {
  const socket = port === 465
    ? tls.connect({ host, port, servername: host, timeout: 8000 }, () => { ok(`${host}:${port} elérhető (TLS)`); socket.destroy(); resolve() })
    : net.connect({ host, port, timeout: 8000 }, () => { ok(`${host}:${port} elérhető`); socket.destroy(); resolve() })
  socket.on('error', (e) => { bad(`${host}:${port} — ${e.code || e.message}`); resolve() })
  socket.setTimeout(8000, () => { bad('időtúllépés'); socket.destroy(); resolve() })
})

/* 3 — bejelentkezés */
console.log('\n3) Bejelentkezés')
const transporter = nodemailer.createTransport({
  host, port, secure: port === 465,
  auth: user && pass ? { user, pass } : undefined,
  logger: false,
})
try {
  await transporter.verify()
  ok('a szerver elfogadta a bejelentkezést — küldésre kész')
  console.log(`\n  Következő lépés: npm run mail:test  →  a levél a(z) ${to} címre megy.\n`)
} catch (err) {
  const code = err.code || ''
  bad(`a bejelentkezés nem sikerült (${code || err.message})`)
  if (code === 'EAUTH' || /535/.test(err.response || '')) {
    console.log(`
  A Gmail nem fogadja el a fiók jelszavát SMTP-hez — csak a 16 jegyű
  ALKALMAZÁSJELSZÓT. Így állítsd be (kb. 2 perc):

    1. https://myaccount.google.com/security  →  kapcsold be a
       „Kétlépcsős azonosítás" (2-Step Verification) opciót.
    2. https://myaccount.google.com/apppasswords  →  új jelszó, név: „PHINIX web"
    3. A kapott 16 jegyű kódot (szóközök nélkül) írd be ide:

         .env.local  →  SMTP_PASS="abcdefghijklmnop"

    4. npm run mail:check   majd   npm run mail:test

  Ha a fiókhoz nincs kétlépcsős azonosítás, a Google nem ad alkalmazásjelszót.
  Alternatíva hitelesített domain nélkül: Resend / Brevo (API-kulcs, 5 perc).
`)
  } else if (code === 'ETIMEDOUT' || code === 'ECONNECTION' || code === 'ESOCKET') {
    console.log('\n  Hálózati hiba: a tűzfal/hosting blokkolhatja a kimenő SMTP-t.\n')
  }
  process.exit(2)
}
