import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { locales } from '@/lib/i18n'

/** Static, fully bilingual sitemap with hreflang alternates on every entry. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-10-01T09:00:00.000Z')

  const routes: Array<{ path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }> = [
    { path: '', priority: 1, changeFrequency: 'weekly' },
    { path: 'privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: 'impresszum', priority: 0.3, changeFrequency: 'yearly' },
  ]

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${route.path ? `/${route.path}` : ''}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          hu: `${siteConfig.url}/hu${route.path ? `/${route.path}` : ''}`,
          en: `${siteConfig.url}/en${route.path ? `/${route.path}` : ''}`,
          'x-default': `${siteConfig.url}/hu${route.path ? `/${route.path}` : ''}`,
        },
      },
    })),
  )
}
