import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import '@/styles/globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Analytics } from '@/components/Analytics'
import { JsonLd } from '@/components/JsonLd'
import { ScrollProgress } from '@/components/Reveal'
import { organizationJsonLd } from '@/lib/seo'
import { isLocale, locales, type Locale } from '@/lib/i18n'
import { siteConfig } from '@/config/site'
import { dictionaries } from '@/data/dictionary'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: siteConfig.themeColor },
    { media: '(prefers-color-scheme: light)', color: siteConfig.themeColor },
  ],
  colorScheme: 'dark',
}

/** Both locales are statically generated — zero server work per request. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = dictionaries[locale]

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.meta.home.title,
      template: '%s',
    },
    description: dict.meta.home.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    generator: 'Next.js',
    keywords:
      locale === 'hu'
        ? [
            'webfejlesztés',
            'weboldal készítés',
            'egyedi weboldal',
            'keresőoptimalizálás',
            'SEO',
            'webshop készítés',
            'React fejlesztő',
            'Next.js',
            'webfejlesztő stúdió',
            'Magyarország',
          ]
        : [
            'web development',
            'custom websites',
            'SEO',
            'search engine optimisation',
            'React developer',
            'Next.js',
            'e-commerce development',
            'web design studio',
          ],
    category: 'technology',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
    },
    manifest: '/manifest.webmanifest',
    formatDetection: { telephone: false, address: false, email: false },
    other: {
      'geo.region': 'HU',
      'geo.placename': siteConfig.countryName.hu,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = dictionaries[locale as Locale]

  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <head>
        {/* kritikus betűtípusok: a hero tipográfia nem várhat a CSS betöltésére */}
        <link
          rel="preload"
          href="/fonts/bricolage-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/textures/globe-poster.webp" as="image" type="image/webp" />
        {/* marks JS as available before first paint → scroll-reveal may hide safely */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {dict.nav.skipToContent}
        </a>
        <ScrollProgress />
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
        <Analytics locale={locale} />
        <JsonLd data={organizationJsonLd(locale)} />
      </body>
    </html>
  )
}
