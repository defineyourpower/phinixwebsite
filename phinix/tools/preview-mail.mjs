/**
 * Fogadó SMTP a valódi e-mail megtekintéséhez.
 *
 * A weboldal ugyanazt a levelet küldi ide, amit a Gmail-fiókod kapna, így
 * látod (és itt is marad) a tárgyat, a szöveget, a HTML-t és a Reply-To fejet.
 *
 *   SMTP_ALLOW_NOAUTH=1 SMTP_HOST=127.0.0.1 SMTP_PORT=2527 node tools/preview-mail.mjs
 *
 * Minden levél bekerül a tools/email-preview/ mappába:
 *   <timestamp>.eml   — nyers levél (bármely levelezővel megnyitható)
 *   <timestamp>.html  — a HTML törzs, böngészőben megnyitható
 *   index.html        — összesítő
 */
import fs from 'node:fs'
import path from 'node:path'
import { SMTPServer } from 'smtp-server'
import { simpleParser } from 'mailparser'

const OUT = path.join(process.cwd(), 'tools', 'email-preview')
fs.mkdirSync(OUT, { recursive: true })

const stamp = () => new Date().toISOString().replace(/[:.]/g, '-')

const server = new SMTPServer({
  authOptional: true,
  disabledCommands: ['STARTTLS', 'AUTH'],
  onData(stream, session, callback) {
    const chunks = []
    stream.on('data', (c) => chunks.push(c))
    stream.on('end', async () => {
      const raw = Buffer.concat(chunks)
      const base = stamp()
      fs.writeFileSync(path.join(OUT, `${base}.eml`), raw)

      const mail = await simpleParser(raw)
      fs.writeFileSync(path.join(OUT, `${base}.html`), mail.html || `<pre>${mail.text || ''}</pre>`)

      const meta = {
        file: `${base}.eml`,
        to: mail.to?.text,
        from: mail.from?.text,
        replyTo: mail.replyTo?.text,
        subject: mail.subject,
        text: mail.text,
      }
      fs.writeFileSync(path.join(OUT, `${base}.json`), JSON.stringify(meta, null, 2))

      // rebuild the index from every json next to it
      const items = fs
        .readdirSync(OUT)
        .filter((f) => f.endsWith('.json'))
        .sort()
        .reverse()
        .map((f) => JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8')))

      fs.writeFileSync(
        path.join(OUT, 'index.html'),
        `<!doctype html><meta charset="utf-8"><title>PHINIX — elküldött e-mailek</title>
<style>
 body{margin:0;padding:32px;background:#0A0B0E;color:#F4EFE7;font:15px/1.6 ui-sans-serif,system-ui,sans-serif}
 h1{font-size:22px;letter-spacing:.14em;margin:0 0 6px}
 p.sub{color:#8b93a1;margin:0 0 28px;font-size:13px}
 article{background:#12151C;border:1px solid #232833;border-radius:14px;padding:18px 20px;margin-bottom:16px}
 h2{font-size:16px;margin:0 0 10px;color:#FF8A54}
 dl{display:grid;grid-template-columns:110px 1fr;gap:4px 12px;margin:0 0 14px;font-size:13px}
 dt{color:#8b93a1}
 dd{margin:0;color:#F4EFE7;word-break:break-all}
 pre{white-space:pre-wrap;background:#0A0B0E;border:1px solid #232833;border-radius:10px;padding:14px;font-size:13px;color:#cfd5df}
 a{color:#FF8A54}
</style>
<h1>PHINIX — az űrlap által kiküldött e-mailek</h1>
<p class="sub">Ugyanaz a levél, amit a stúdió postaládája kapna. A HTML változat: kattints a fájlnévre.</p>
${items
  .map(
    (m) => `<article>
  <h2>${m.subject ?? '(nincs tárgy)'}</h2>
  <dl>
    <dt>Címzett</dt><dd>${m.to ?? ''}</dd>
    <dt>Feladó</dt><dd>${m.from ?? ''}</dd>
    <dt>Reply-To</dt><dd>${m.replyTo ?? ''}</dd>
    <dt>HTML</dt><dd><a href="./${m.file.replace(/\.eml$/, '.html')}">${m.file.replace(/\.eml$/, '.html')}</a></dd>
  </dl>
  <pre>${(m.text ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])}</pre>
</article>`,
  )
  .join('\n')}`,
      )

      console.log(`✉  ${meta.subject}`)
      console.log(`   to: ${meta.to} · reply-to: ${meta.replyTo}`)
      callback()
    })
  },
  onError(err) {
    console.error('SMTP hiba:', err.message)
  },
})

server.listen(2527, '0.0.0.0', () => console.log('fogadó SMTP: 0.0.0.0:2527 → tools/email-preview/'))
