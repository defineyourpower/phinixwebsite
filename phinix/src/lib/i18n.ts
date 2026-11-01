import { siteConfig } from '@/config/site'

export const locales = ['hu', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'hu'

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value)
}

/** Locale-prefixed path. `path('hu')` → "/hu", `path('en','work')` → "/en/work" */
export function localePath(locale: Locale, path: string = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return clean ? `/${locale}/${clean}` : `/${locale}`
}

export function languageAlternates(path: string = '') {
  const clean = path.replace(/^\/+|\/+$/g, '')
  const entries: Record<string, string> = {}
  for (const l of locales) {
    entries[l] = `${siteConfig.url}${localePath(l, clean)}`
  }
  entries['x-default'] = `${siteConfig.url}${localePath(defaultLocale, clean)}`
  return entries
}

/** Strip the locale segment from a pathname, e.g. "/en/faq" → "faq". */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (isLocale(parts[0])) parts.shift()
  return parts.join('/')
}
