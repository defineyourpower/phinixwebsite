/**
 * Build-time Open Graph card generator.
 *
 * Renders the 1200×630 social card with satori (HTML/CSS → SVG) and resvg
 * (SVG → PNG), using the same self-hosted fonts as the site, then writes:
 *   public/og/og-hu.png, public/og/og-en.png
 *
 * The result is a plain static asset: zero runtime cost, perfect caching,
 * and social crawlers get a crisp PNG with the right 1.91:1 ratio.
 *
 * Re-run with:  node tools/make_og.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const fontsDir = path.join(root, 'tools', 'fonts')
const outDir = path.join(root, 'public', 'og')
fs.mkdirSync(outDir, { recursive: true })

// Variable fonts (decompressed from the very .woff2 files the site serves),
// so satori renders weight 500-700 from a single source of truth.
const fonts = [
  {
    name: 'Bricolage',
    data: fs.readFileSync(path.join(fontsDir, 'bricolage-700.ttf')),
    weight: 700,
    style: 'normal',
  },
  {
    name: 'Inter',
    data: fs.readFileSync(path.join(fontsDir, 'inter-400.ttf')),
    weight: 400,
    style: 'normal',
  },
  {
    name: 'Inter',
    data: fs.readFileSync(path.join(fontsDir, 'inter-600.ttf')),
    weight: 600,
    style: 'normal',
  },
]

const copy = {
  hu: {
    eyebrow: 'WEBFEJLESZTŐ STÚDIÓ',
    title: ['Weboldalak, amelyek', 'a Google élvonalába', 'visznek.'],
    footerLeft: 'phinix.hu',
    footerRight: ['Egyedi dizájn', '100 Lighthouse'],
  },
  en: {
    eyebrow: 'WEB DEVELOPMENT STUDIO',
    title: ['Websites that put you', 'at the top of', 'Google.'],
    footerLeft: 'phinix.hu',
    footerRight: ['Custom design', '100 Lighthouse'],
  },
}

/** The emblem as inline SVG, scaled for the card. */
function emblem(size = 96) {
  return {
    type: 'img',
    props: {
      width: size,
      height: size,
      src:
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
          fs.readFileSync(path.join(root, 'public', 'favicon.svg'), 'utf8'),
        ),
    },
  }
}

function card(lang) {
  const c = copy[lang]
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#0A0B0E',
        padding: '60px 72px',
        position: 'relative',
        fontFamily: 'Inter',
        overflow: 'hidden',
      },
      children: [
        // background layers
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '-260px',
              right: '-180px',
              width: '900px',
              height: '900px',
              borderRadius: '50%',
              backgroundImage:
                'radial-gradient(circle, rgba(255,106,43,0.46) 0%, rgba(255,106,43,0.16) 40%, rgba(10,11,14,0) 68%)',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              inset: '0',
              backgroundImage:
                'linear-gradient(to right, rgba(244,239,231,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,239,231,0.055) 1px, transparent 1px)',
              backgroundSize: '84px 84px',
            },
          },
        },
        // header
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              position: 'relative',
            },
            children: [
              emblem(76),
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Bricolage',
                    fontWeight: 700,
                    fontSize: '34px',
                    letterSpacing: '8px',
                    color: '#F4EFE7',
                  },
                  children: 'PHINIX',
                },
              },
            ],
          },
        },
        // headline
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              position: 'relative',
              maxWidth: '960px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Inter',
                    fontWeight: 600,
                    fontSize: '22px',
                    letterSpacing: '4px',
                    color: '#FF8A54',
                  },
                  children: c.eyebrow,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'Bricolage',
                    fontWeight: 700,
                    fontSize: '74px',
                    lineHeight: 1.0,
                    letterSpacing: '-2.6px',
                    color: '#F4EFE7',
                  },
                  children: c.title.map((line, i) => ({
                    type: 'div',
                    props: {
                      style: i === 1 ? { color: '#FF6A2B', fontStyle: 'italic' } : {},
                      children: line,
                    },
                  })),
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '25px',
                    color: 'rgba(244,239,231,0.62)',
                    marginTop: '6px',
                  },
                  children: 'React · Next.js · SEO · 3D',
                },
              },
            ],
          },
        },
        // footer
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              borderTop: '1px solid rgba(244,239,231,0.16)',
              paddingTop: '24px',
              fontFamily: 'Inter',
              fontWeight: 400,
              fontSize: '22px',
              color: 'rgba(244,239,231,0.58)',
            },
            children: [
              { type: 'div', props: { children: c.footerLeft } },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', gap: '26px' },
                  children: c.footerRight.map((t, i) =>
                    i === 0
                      ? { type: 'div', props: { children: t } }
                      : { type: 'div', props: { style: { display: 'flex', gap: '26px' }, children: [{ type: 'div', props: { children: '·' } }, { type: 'div', props: { children: t } }] } },
                  ),
                },
              },
            ],
          },
        },
      ],
    },
  }
}

for (const lang of ['hu', 'en']) {
  const svg = await satori(card(lang), { width: 1200, height: 630, fonts })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  const file = path.join(outDir, `og-${lang}.png`)
  fs.writeFileSync(file, png)
  console.log(`${path.relative(root, file)} — ${(png.length / 1024).toFixed(1)} KB`)
}
