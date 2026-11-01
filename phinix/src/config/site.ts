/**
 * Single source of truth for brand, contact details and integrations.
 * Change values here once and every page, meta tag and JSON-LD block follows.
 */
export const siteConfig = {
  name: 'PHINIX',
  legalName: 'PHINIX Web Studio',
  tagline: {
    hu: 'Webfejlesztő stúdió',
    en: 'Web development studio',
  },
  /** Canonical production URL — override with NEXT_PUBLIC_SITE_URL at deploy time. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://phinix.hu').replace(/\/+$/, ''),
  email: 'phinixwebsite@gmail.com',
  /** Where the contact form delivers. Same inbox unless CONTACT_TO_EMAIL overrides. */
  formEmail: 'phinixwebsite@gmail.com',
  phone: '+36 20 548 2486',
  phoneHref: '+36205482486',
  /** No street address — the studio presents itself country-wide. */
  country: 'HU',
  countryName: { hu: 'Magyarország', en: 'Hungary' },
  location: { hu: 'Magyarország', en: 'Hungary' },
  founded: 2017,
  responseTime: { hu: '24 órán belül', en: 'within 24 hours' },
  /** Optional Cal.com / Calendly link. If empty the booking button scrolls to the form. */
  bookingUrl: '',
  /** Leave empty when a profile does not exist — links are filtered automatically. */
  socials: {
    github: '',
    linkedin: '',
    instagram: '',
    dribbble: '',
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  },
  ogImage: {
    hu: '/og/og-hu.png',
    en: '/og/og-en.png',
  },
  themeColor: '#0A0B0E',
  localeMap: { hu: 'hu_HU', en: 'en_US' } as const,
} as const

export type SiteConfig = typeof siteConfig
