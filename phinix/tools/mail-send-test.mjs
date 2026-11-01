/**
 * Sends a REAL test e-mail through the same SMTP settings the site uses, so you
 * can confirm delivery in your inbox before going live.
 *
 *   npm run mail:test
 *
 * Reads .env.local (no extra dependency). Requires SMTP_HOST / SMTP_USER /
 * SMTP_PASS — for Gmail create an App password:
 *   Google Account → Security → 2-Step Verification → App passwords → Mail
 */
import fs from 'node:fs'
import nodemailer from 'nodemailer'

const env = {}
if (fs.existsSync('.env.local')) {
  for (const line of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const host = env.SMTP_HOST
const user = env.SMTP_USER
const pass = env.SMTP_PASS
const to = env.CONTACT_TO_EMAIL || user

if (!host || !user || !pass) {
  console.error('\n✗ Hiányzó SMTP beállítás a .env.local-ban.')
  console.error('  SMTP_HOST, SMTP_USER és SMTP_PASS szükséges.')
  console.error('  Gmailhez: Google-fiók → Biztonság → 2 lépcsős azonosítás →')
  console.error('  Alkalmazásjelszavak → „Mail" → a 16 jegyű jelszó a SMTP_PASS.\n')
  process.exit(1)
}

const port = Number(env.SMTP_PORT || 465)
const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
})

console.log(`→ ${host}:${port} → ${to} …`)
const info = await transporter.sendMail({
  from: `"${env.CONTACT_FROM_NAME || 'PHINIX weboldal'}" <${user}>`,
  to,
  subject: '[PHINIX] Teszt e-mail — a weboldal űrlapja működik',
  text: `Ez egy teszt e-mail a PHINIX weboldal űrlapjából.\n\nHa ezt látod, a(z) ${to} postaláda fogadja a weboldalon beérkező ajánlatkéréseket.\n\nMinden Ajánlatkérés űrlap üzenet ide fut be, és a válasz („Válasz") közvetlenül a látogatónak megy.`,
})
console.log('✓ Elküldve:', info.messageId)
