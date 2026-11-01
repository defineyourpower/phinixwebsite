import { NextResponse } from 'next/server'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import nodemailer from 'nodemailer'
import { contactPayloadSchema, looksLikeSpam, type ContactResponse } from '@/lib/validation'
import { studioEmail, visitorEmail, type ContactPayload } from '@/lib/email'
import { siteConfig } from '@/config/site'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/* ------------------------------ rate limiting ------------------------------ */
/**
 * Simple in-memory sliding window. Good enough for a single-instance deploy and
 * for protecting the endpoint in dev. On serverless/multi-instance hosting swap
 * this for Upstash Redis (same call signature).
 */
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const buckets = new Map<string, number[]>()

function rateLimited(key: string): boolean {
  const now = Date.now()
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  hits.push(now)
  buckets.set(key, hits)
  // opportunistic cleanup so the map cannot grow unbounded
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t > WINDOW_MS)) buckets.delete(k)
    }
  }
  return hits.length > MAX_PER_WINDOW
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/* -------------------------------- delivery -------------------------------- */

type Payload = ContactPayload

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
/**
 * Never send an acknowledgement to an address that cannot receive mail — a
 * bounce ("Delivery Status Notification") would land in the studio inbox and
 * bury the real enquiries.
 */
const UNDELIVERABLE = /@(example\.(com|org|net)|test\.|localhost|invalid|mailinator\.com|tempmail)/i

/**
 * Sends the enquiry to the studio inbox.
 *
 * Three transports, first one configured wins:
 *   1. SMTP          — SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
 *                      (Gmail app password, Brevo, Mailgun, SES…)
 *   2. Resend        — RESEND_API_KEY
 *   3. local file    — `.data/contact-inbox.jsonl` (dev / demo, never lost)
 *
 * The visitor always gets a copy too when SMTP is used, and `replyTo` is set to
 * their address so hitting "Reply" in Gmail answers the visitor directly.
 */
async function deliver(payload: Payload): Promise<{ delivered: boolean; transport: string }> {
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.formEmail
  const fromName = process.env.CONTACT_FROM_NAME || 'PHINIX weboldal'
  const studio = studioEmail(payload)
  const subject = studio.subject
  const text = studio.text
  const html = studio.html
  const replyTo = payload.email

  /* 1 — SMTP (works with a Gmail app password, no domain needed) */
  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER || ''
  const smtpPass = process.env.SMTP_PASS || ''
  // only treat SMTP as configured once the credentials actually exist, so an
  // unfinished .env can never swallow an enquiry
  const smtpReady = Boolean(smtpHost && (smtpPass || process.env.SMTP_ALLOW_NOAUTH === '1'))
  if (smtpReady) {
    const port = Number(process.env.SMTP_PORT || 465)
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure: port === 465,
      // auth is optional so a local/relay SMTP without credentials works too
      auth: smtpUser && smtpPass ? { user: smtpUser, pass: smtpPass } : undefined,
    })
    const senderAddress = smtpUser || process.env.CONTACT_FROM_EMAIL || `no-reply@${siteConfig.url.replace(/^https?:\/\//, '')}`
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${senderAddress}>`,
        to,
        replyTo,
        subject,
        text,
        html,
      })
    } catch (err) {
      console.error('[contact] SMTP send failed — falling back', err)
      return persist(payload)
    }

    // auto-acknowledgement to the visitor — best effort, never blocks the send
    if (EMAIL_RE.test(payload.email) && !UNDELIVERABLE.test(payload.email)) {
      const thanks = visitorEmail(payload)
      try {
        await transporter.sendMail({
          from: `"${fromName}" <${senderAddress}>`,
          to: payload.email,
          replyTo: to,
          subject: thanks.subject,
          text: thanks.text,
          html: thanks.html,
          // `Auto-Submitted` is the RFC 3834 marker for machine-generated mail.
          // Without it Gmail is far more likely to file a confirmation as spam.
          headers: {
            'Auto-Submitted': 'auto-replied',
            'X-Auto-Response-Suppress': 'All',
          },
        })
      } catch (err) {
        console.warn('[contact] auto-reply failed', err)
      }
    }
    return { delivered: true, transport: 'smtp' }
  }

  /* 2 — Resend (needs a verified sending domain) */
  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    const from = process.env.CONTACT_FROM_EMAIL || 'PHINIX <no-reply@phinix.hu>'
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, html, text }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error(`[contact] Resend error ${res.status}: ${body.slice(0, 300)} — falling back`)
      return persist(payload)
    }
    return { delivered: true, transport: 'resend' }
  }

  /* 3 — nothing configured (or a provider failed): persist locally so nothing is lost */
  return persist(payload)
}

/** Last-resort sink: append to `.data/contact-inbox.jsonl`. */
async function persist(payload: Payload): Promise<{ delivered: boolean; transport: string }> {
  const dir = path.join(process.cwd(), '.data')
  await fs.mkdir(dir, { recursive: true })
  await fs.appendFile(
    path.join(dir, 'contact-inbox.jsonl'),
    JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }) + '\n',
    'utf8',
  )
  return { delivered: true, transport: 'file' }
}

/* --------------------------------- handler -------------------------------- */
export async function POST(req: Request): Promise<NextResponse<ContactResponse>> {
  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 415 })
  }

  const ip = clientIp(req)
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, code: 'rate_limit' }, { status: 429 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 400 })
  }

  const parsed = contactPayloadSchema.safeParse(json)
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      errors[key] ??= issue.message
    }
    return NextResponse.json({ ok: false, code: 'validation', errors }, { status: 422 })
  }

  const payload = parsed.data
  if (looksLikeSpam(payload)) {
    // Pretend success: never teach bots which signal tripped the filter.
    return NextResponse.json({ ok: true, id: randomUUID() })
  }

  try {
    const { transport } = await deliver(payload)
    const id = randomUUID()
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[contact] delivered via ${transport} → ${siteConfig.formEmail} — ${payload.email}`)
    }
    return NextResponse.json({ ok: true, id })
  } catch (err) {
    console.error('[contact] delivery failed', err)
    return NextResponse.json({ ok: false, code: 'delivery' }, { status: 502 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, code: 'bad_request' }, { status: 405, headers: { Allow: 'POST' } })
}
