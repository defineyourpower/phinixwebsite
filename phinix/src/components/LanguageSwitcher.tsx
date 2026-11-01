'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { locales, stripLocale } from '@/lib/i18n'

/**
 * Two-state language switcher that preserves the current page,
 * emits proper hreflang annotations and is fully keyboard accessible.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || '/'
  const rest = stripLocale(pathname)

  return (
    <div className="lang" role="group" aria-label={label}>
      {locales.map((l) => {
        const active = l === locale
        const href = rest ? `/${l}/${rest}` : `/${l}`
        return (
          <Link
            key={l}
            href={href}
            hrefLang={l}
            lang={l}
            aria-current={active ? 'true' : undefined}
            className={`lang__item${active ? ' lang__item--active' : ''}`}
            prefetch={false}
          >
            {l.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
}
