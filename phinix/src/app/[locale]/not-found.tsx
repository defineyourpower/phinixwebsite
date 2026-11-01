'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from '@/components/Icons'
import { dictionaries } from '@/data/dictionary'
import { stripLocale } from '@/lib/i18n'

/**
 * 404 inside the locale layout, so it keeps the header/footer and the brand.
 * Language is derived from the URL because not-found.tsx receives no params.
 */
export default function NotFound() {
  const pathname = usePathname() || '/hu'
  const isEnglish = pathname.startsWith('/en')
  const dict = dictionaries[isEnglish ? 'en' : 'hu']
  const home = isEnglish ? '/en' : '/hu'

  return (
    <main id="main" className="notfound">
      <div aria-hidden="true" className="hero__grid-bg" />
      <div className="notfound__inner">
        <p className="notfound__code" aria-hidden="true">
          404
        </p>
        <h1 className="display h3">{dict.notFound.title}</h1>
        <p className="lead" style={{ textAlign: 'center', marginInline: 'auto' }}>
          {dict.notFound.text}
        </p>
        <div className="notfound__actions">
          <Link href={home} className="btn btn--ember">
            {dict.notFound.home}
            <ArrowRight />
          </Link>
          <Link href={`${home}#contact`} className="btn btn--ghost">
            {dict.notFound.contact}
          </Link>
        </div>
        <p className="micro" style={{ color: 'var(--muted-2)', marginTop: '1rem' }}>
          {stripLocale(pathname) ? `/${stripLocale(pathname)}` : '/'}
        </p>
      </div>
    </main>
  )
}
