import { siteConfig } from '@/config/site'

/**
 * E-mail sablonok.
 *
 * Miért ilyen „szögletes" a HTML? Mert a levelezők (Gmail, Outlook, Apple Mail)
 * nem tudnak modern CSS-t: csak táblázat-alapú elrendezés és inline stílus
 * működik mindenhol. A szöveges változat ugyanazt mondja el, mert a
 * `multipart/alternative` (text + HTML együtt) erősen javítja a
 * beérkező postafiókba kerülés esélyét — a HTML nélküli, csupasz levél az
 * egyik leggyakoribb spam-jelzés.
 */

export type ContactPayload = {
  name: string
  email: string
  projectType: string
  budget?: string
  message: string
  locale: string
}

const C = {
  ink: '#0A0B0E',
  paper: '#F4EFE7',
  muted: '#6B7280',
  line: '#E7E2D9',
  ember: '#C2410C',
  card: '#FFFFFF',
  bg: '#F5F2EC',
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const escapeAttr = (s: string) => escapeHtml(s).replace(/'/g, '&#39;')

/**
 * Keresztnév kitalálása a megszólításhoz.
 * Magyarul a vezetéknév áll elöl ("Kiss Péter" → "Péter"), angolul hátul
 * ("Peter Kiss" → "Peter"). Két szónál a locale dönt, háromnál („Kovács Anna
 * Mária") a magyar minta szerint a második tag a keresztnév.
 */
export function firstName(name: string, locale: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return name
  if (parts.length === 1) return parts[0]!
  if (locale === 'en') return parts[0]!
  return parts[1]!
}

/** Egyszerű, táblázatos HTML-váz — minden levelezőben ugyanazt mutatja. */
function shell(opts: {
  kicker: string
  title: string
  bodyRows?: string
  bodyHtml: string
  footerHtml: string
  lang: string
}): string {
  return `<!doctype html>
<html lang="${opts.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(opts.kicker)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
  <tr><td align="center" style="padding:28px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${C.card};border:1px solid ${C.line};border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <tr>
        <td style="padding:22px 26px 0 26px;border-bottom:1px solid ${C.line};">
          <div style="font-size:15px;font-weight:700;letter-spacing:2.4px;color:#111827;padding:0 0 4px;">PHINIX</div>
          <div style="font-size:12px;color:${C.muted};padding:0 0 16px;">${escapeHtml(opts.kicker)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:26px 26px 8px 26px;">
          <h1 style="margin:0 0 14px;font-size:19px;line-height:1.35;color:#111827;font-weight:600;">${escapeHtml(opts.title)}</h1>
          ${opts.bodyRows ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 18px;">${opts.bodyRows}</table>` : ''}
          ${opts.bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding:6px 26px 24px 26px;">
          <div style="height:1px;background:${C.line};margin:0 0 16px;"></div>
          <div style="font-size:12px;line-height:1.6;color:${C.muted};">${opts.footerHtml}</div>
        </td>
      </tr>
    </table>
    <div style="max-width:560px;margin:14px auto 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#9AA1AC;text-align:center;">
      ${siteConfig.name} · ${siteConfig.email} · ${siteConfig.phone} · ${siteConfig.location.hu}
    </div>
  </td></tr>
</table>
</body>
</html>`
}

function row(label: string, value: string, opts?: { link?: boolean; strong?: boolean }): string {
  const val = opts?.link
    ? `<a href="mailto:${escapeAttr(value)}" style="color:${C.ember};text-decoration:none;">${escapeHtml(value)}</a>`
    : escapeHtml(value)
  return `<tr>
    <td style="padding:5px 16px 5px 0;font-size:13px;color:${C.muted};white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:5px 0;font-size:14px;color:#111827;${opts?.strong ? 'font-weight:600;' : ''}">${val}</td>
  </tr>`
}

function quoteBlock(text: string): string {
  return `<div style="border-left:3px solid ${C.ember};background:#FAF8F4;border-radius:0 8px 8px 0;padding:14px 16px;margin:0 0 18px;">
    <div style="font-size:15px;line-height:1.65;color:#374151;white-space:pre-wrap;">${escapeHtml(text)}</div>
  </div>`
}

/* -------------------------------------------------------------------------- */
/*  1. Értesítés a stúdiónak (minden ajánlatkérés)                            */
/* -------------------------------------------------------------------------- */

export function studioEmail(p: ContactPayload) {
  const subject = `[PHINIX] ${p.projectType} — ${p.name}`

  const text = [
    'Új ajánlatkérés — PHINIX',
    '',
    `Név: ${p.name}`,
    `E-mail: ${p.email}`,
    `Projekt: ${p.projectType}`,
    `Büdzsé: ${p.budget || '—'}`,
    `Nyelv: ${p.locale}`,
    '',
    'Üzenet:',
    p.message,
    '',
    '—',
    'Válasz: nyomd meg a „Válasz" gombot — a levél közvetlenül a látogatónak megy.',
  ].join('\n')

  const html = shell({
    lang: 'hu',
    kicker: 'Új ajánlatkérés',
    title: `${p.name} üzenete`,
    bodyRows:
      row('E-mail', p.email, { link: true, strong: true }) +
      row('Projekt', p.projectType) +
      row('Büdzsé', p.budget || '—') +
      row('Nyelv', p.locale.toUpperCase()),
    bodyHtml: `<div style="font-size:13px;color:${C.muted};margin:0 0 8px;">Üzenet</div>${quoteBlock(p.message)}`,
    footerHtml: `A <strong style="color:#374151;">Válasz</strong> gomb közvetlenül a látogatónak szól.<br>Beérkezett: ${new Date().toLocaleString('hu-HU', {
      timeZone: 'Europe/Budapest',
      dateStyle: 'medium',
      timeStyle: 'short',
    })}`,
  })

  return { subject, text, html }
}

/* -------------------------------------------------------------------------- */
/*  2. Visszaigazolás a látogatónak                                            */
/* -------------------------------------------------------------------------- */
/**
 * Szándékosan rövid és személyes: a Gmail (és minden szűrő) a nagy, márkázott,
 * linkekkel teli „automatikus" leveleket tolja a Spam/Promotions mappába.
 * Itt nincs kép, nincs nyomkövető pixel, nincs marketing-nyelv, csak a
 * visszaigazolás + a látogató saját üzenete (ez bizonyítja, hogy valódi
 * kérésre válaszolunk). A `Auto-Submitted` fejlécet a hívó adja hozzá.
 */
export function visitorEmail(p: ContactPayload) {
  const hu = p.locale !== 'en'
  const given = firstName(p.name, p.locale)

  const subject = hu
    ? `Megkaptam az üzenetedet, ${given}`
    : `Got your message, ${given}`

  const text = hu
    ? [
        `Szia ${given},`,
        '',
        'köszönöm, hogy írtál — megérkezett az üzeneted. Minden megkeresést személyesen olvasok, és 24 órán belül válaszolok egy konkrét tervvel és árajánlattal.',
        '',
        'Amit küldtél:',
        p.message,
        '',
        'Ha közben bármi eszedbe jut, egyszerűen válaszolj erre a levélre.',
        '',
        'Üdvözlettel',
        'PHINIX',
        siteConfig.email,
      ].join('\n')
    : [
        `Hi ${given},`,
        '',
        'thanks for getting in touch — your message arrived. I read every enquiry personally and reply within 24 hours with a concrete plan and a quote.',
        '',
        'What you sent:',
        p.message,
        '',
        'If anything else comes to mind, just reply to this email.',
        '',
        'Best regards,',
        'PHINIX',
        siteConfig.email,
      ].join('\n')

  const html = `<!doctype html>
<html lang="${hu ? 'hu' : 'en'}">
<head><meta charset="utf-8"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
  <tr><td style="padding:26px 22px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="max-width:540px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <tr><td style="font-size:15px;line-height:1.65;color:#1f2937;padding:0 0 16px;">
        ${escapeHtml(hu ? `Szia ${given},` : `Hi ${given},`)}
      </td></tr>
      <tr><td style="font-size:15px;line-height:1.65;color:#1f2937;padding:0 0 18px;">
        ${
          hu
            ? 'köszönöm, hogy írtál — <strong>megérkezett az üzeneted</strong>. Minden megkeresést személyesen olvasok, és 24 órán belül válaszolok egy konkrét tervvel és árajánlattal.'
            : 'thanks for getting in touch — <strong>your message arrived</strong>. I read every enquiry personally and reply within 24 hours with a concrete plan and a quote.'
        }
      </td></tr>
      <tr><td style="font-size:13px;color:#6b7280;padding:0 0 6px;">${hu ? 'Amit küldtél' : 'What you sent'}</td></tr>
      <tr><td style="border-left:3px solid #d6d3d1;padding:2px 0 2px 14px;">
        <div style="font-size:14px;line-height:1.6;color:#4b5563;white-space:pre-wrap;">${escapeHtml(p.message)}</div>
      </td></tr>
      <tr><td style="font-size:15px;line-height:1.65;color:#1f2937;padding:20px 0 18px;">
        ${
          hu
            ? 'Ha közben bármi eszedbe jut, egyszerűen válaszolj erre a levélre.'
            : 'If anything else comes to mind, just reply to this email.'
        }
      </td></tr>
      <tr><td style="font-size:15px;line-height:1.65;color:#1f2937;">
        ${hu ? 'Üdvözlettel' : 'Best regards'},<br>
        <strong>PHINIX</strong> — ${hu ? 'weboldal készítés' : 'web design &amp; development'}<br>
        <span style="color:#6b7280;font-size:14px;">${siteConfig.email}</span>
      </td></tr>
      <tr><td style="font-size:11px;line-height:1.6;color:#9ca3af;padding:26px 0 0;">
        ${
          hu
            ? 'Ezt a levelet azért kaptad, mert ajánlatkérő űrlapot küldtél a PHINIX weboldalon. Ha nem te voltál, hagyd figyelmen kívül — nem történik semmi.'
            : 'You received this because you submitted the enquiry form on the PHINIX website. If that wasn’t you, simply ignore it — nothing will happen.'
        }
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

  return { subject, text, html }
}
