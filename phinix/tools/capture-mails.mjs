/** Elkapja a két levelet (stúdió + látogató) és HTML-előnézetet ír. */
import { SMTPServer } from 'smtp-server'
import { simpleParser } from 'mailparser'
import fs from 'node:fs'

const got = []
const srv = new SMTPServer({
  authOptional: true,
  disabledCommands: ['STARTTLS', 'AUTH'],
  onData(stream, session, cb) {
    const chunks = []
    stream.on('data', (c) => chunks.push(c))
    stream.on('end', async () => {
      got.push(await simpleParser(Buffer.concat(chunks)))
      cb()
    })
  },
})
await new Promise((r) => srv.listen(2533, '127.0.0.1', r))
console.log('SMTP fogad 2533-on')

const res = await fetch('http://localhost:3003/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Kiss Péter',
    email: 'kiss.peter@gmail.com',
    projectType: 'Egyedi weboldal',
    budget: '800 000 – 1 500 000 Ft',
    message:
      'Szia! Szeretnék egy egyedi weboldalt a kárpitos műhelyemnek.\nJelenleg csak Facebook-oldalam van, szeretnék végre Google-találatokat is kapni.\nMikor tudunk egyeztetni?',
    consent: true,
    locale: 'hu',
    company: '',
    elapsedMs: 7200,
  }),
})
console.log('API', res.status)
await new Promise((r) => setTimeout(r, 1600))

fs.mkdirSync('tools/email-preview', { recursive: true })
got.forEach((m, i) => {
  const name = i === 0 ? 'studio' : 'latogato'
  fs.writeFileSync(`tools/email-preview/${name}.html`, m.html || `<pre>${m.text}</pre>`)
  fs.writeFileSync(`tools/email-preview/${name}.txt`, m.text || '')
  console.log(`[${name}]`, m.subject)
  console.log(`  to: ${m.to?.text} | reply-to: ${m.replyTo?.text}`)
  console.log(`  auto-submitted: ${m.headers.get('auto-submitted') ?? '—'}`)
  console.log(`  html: ${(m.html || '').length} byte | text: ${(m.text || '').length} byte`)
})
srv.close()
