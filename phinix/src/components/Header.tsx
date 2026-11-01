'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useScrollLock, useScrolled } from '@/lib/hooks'
import type { Locale } from '@/lib/i18n'
import { dictionaries } from '@/data/dictionary'
import { ArrowRight, Mail, Phone } from '@/components/Icons'
import { siteConfig } from '@/config/site'

const SECTIONS = ['services', 'work', 'process', 'about', 'faq'] as const

export function Header({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  const scrolled = useScrolled(16)
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useScrollLock(open)

  // close on Escape + return focus to the trigger
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstLinkRef.current?.focus({ preventScroll: true }), 120)
    return () => {
      document.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open])

  // close the drawer when a hash target is clicked
  const close = () => setOpen(false)

  return (
    <>
      <header className={`header${scrolled ? ' header--scrolled' : ''}`} id="site-header">
        <div className="container header__inner">
          <Link href={`/${locale}`} aria-label={`PHINIX — ${locale === 'hu' ? 'főoldal' : 'home'}`}>
            <Logo size={36} />
          </Link>

          <nav className="header__nav" aria-label={locale === 'hu' ? 'Fő navigáció' : 'Main navigation'}>
            {SECTIONS.map((key) => (
              <a key={key} href={`#${key}`} className="nav-link">
                {dict.nav[key]}
              </a>
            ))}
          </nav>

          <div className="header__actions">
            <LanguageSwitcher locale={locale} label={dict.a11y.switchLanguage} />
            <a href="#contact" className="btn btn--ember btn--sm btn--header-cta">
              {dict.nav.cta}
              <ArrowRight />
            </a>
            <button
              type="button"
              className="burger"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? dict.nav.menuClose : dict.nav.menuOpen}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="burger__lines" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-drawer"
        ref={drawerRef}
        className="drawer"
        data-open={open}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <nav className="drawer__nav" aria-label={locale === 'hu' ? 'Mobil navigáció' : 'Mobile navigation'}>
          {SECTIONS.map((key, i) => (
            <a
              key={key}
              href={`#${key}`}
              className="drawer__link"
              style={{ '--i': i } as React.CSSProperties}
              onClick={close}
              ref={i === 0 ? firstLinkRef : undefined}
            >
              {dict.nav[key]}
              <span aria-hidden="true">0{i + 1}</span>
            </a>
          ))}
        </nav>
        <div className="drawer__footer">
          <a href="#contact" className="btn btn--ember btn--block" onClick={close}>
            {dict.nav.cta}
            <ArrowRight />
          </a>
          <div className="drawer__meta">
            <a href={`mailto:${siteConfig.email}`} className="row gap-s">
              <Mail /> {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phoneHref}`} className="row gap-s">
              <Phone /> {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
