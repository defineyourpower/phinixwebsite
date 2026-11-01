import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'
import { languageAlternates, localePath, type Locale } from '@/lib/i18n'
import { dictionaries } from '@/data/dictionary'

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}

type BuildMetaArgs = {
  locale: Locale
  /** Path without locale, e.g. "" or "privacy". */
  path?: string
  title: string
  description: string
  ogImage?: string
  noIndex?: boolean
  type?: 'website' | 'article'
}

/**
 * Central metadata factory: canonical, hreflang, OpenGraph, Twitter,
 * robots directives — all derived from one call so nothing drifts.
 */
export function buildMetadata({
  locale,
  path = '',
  title,
  description,
  ogImage,
  noIndex = false,
  type = 'website',
}: BuildMetaArgs): Metadata {
  const canonical = localePath(locale, path)
  const image = ogImage ?? siteConfig.ogImage[locale]

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.localeMap[locale],
      alternateLocale: locale === 'hu' ? [siteConfig.localeMap.en] : [siteConfig.localeMap.hu],
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${siteConfig.tagline[locale]}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  }
}

/** Organization + WebSite (with SearchAction) — rendered once, site-wide. */
export function organizationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: siteConfig.url,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/icon.svg'),
          width: 512,
          height: 512,
        },
        image: absoluteUrl(siteConfig.ogImage[locale]),
        email: siteConfig.email,
        telephone: siteConfig.phoneHref,
        foundingDate: String(siteConfig.founded),
        slogan: dictionaries[locale].hero.shortClaim,
        address: {
          '@type': 'PostalAddress',
          addressCountry: siteConfig.country,
        },
        areaServed: [
          { '@type': 'Country', name: 'Hungary' },
          { '@type': 'Country', name: 'European Union' },
          { '@type': 'Place', name: 'Worldwide (remote)' },
        ],
        sameAs: Object.values(siteConfig.socials).filter(Boolean),
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: siteConfig.email,
          telephone: siteConfig.phoneHref,
          availableLanguage: ['hu', 'en'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        inLanguage: locale === 'hu' ? 'hu-HU' : 'en',
        publisher: { '@id': `${siteConfig.url}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/${locale}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteConfig.url}${localePath(locale)}#webpage`,
        url: `${siteConfig.url}${localePath(locale)}`,
        name: dictionaries[locale].meta.home.title,
        description: dictionaries[locale].meta.home.description,
        isPartOf: { '@id': `${siteConfig.url}/#website` },
        about: { '@id': `${siteConfig.url}/#organization` },
        inLanguage: locale === 'hu' ? 'hu-HU' : 'en',
      },
    ],
  }
}

/** Service catalogue + FAQ + breadcrumbs for the landing page. */
export function landingJsonLd(locale: Locale) {
  const dict = dictionaries[locale]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${siteConfig.url}/#studio`,
        name: siteConfig.name,
        description: dict.meta.home.description,
        url: `${siteConfig.url}${localePath(locale)}`,
        parentOrganization: { '@id': `${siteConfig.url}/#organization` },
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress',
          addressCountry: siteConfig.country,
        },
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: dict.services.title,
          itemListElement: dict.services.items.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.title,
              description: service.desc,
              serviceType: service.title,
            },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: dict.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'hu' ? 'Főoldal' : 'Home',
            item: `${siteConfig.url}${localePath(locale)}`,
          },
        ],
      },
    ],
  }
}
