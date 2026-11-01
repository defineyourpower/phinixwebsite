'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie } from '@/components/Icons'
import { siteConfig } from '@/config/site'
import type { Locale } from '@/lib/i18n'

const CONSENT_KEY = 'phinix-consent-v1'

/**
 * Analytics + consent, baked together:
 *  - no GA id → nothing renders, zero third-party requests;
 *  - with a GA id → a ~1.4 kB banner asks first; GA loads only after consent.
 */
export function Analytics({ locale }: { locale: Locale }) {
  const gaId = siteConfig.analytics.gaId
  const [consent, setConsent] = useState<'granted' | 'denied' | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (!gaId) return
    const stored = window.localStorage.getItem(CONSENT_KEY)
    if (stored === 'granted' || stored === 'denied') {
      setConsent(stored)
    } else {
      const t = setTimeout(() => setShowBanner(true), 1400)
      return () => clearTimeout(t)
    }
  }, [gaId])

  if (!gaId) return null

  const decide = (choice: 'granted' | 'denied') => {
    window.localStorage.setItem(CONSENT_KEY, choice)
    setConsent(choice)
    setShowBanner(false)
  }

  const copy =
    locale === 'hu'
      ? {
          text: 'Anonim, oldalakövetés nélküli analitikát használunk, hogy jobb legyen az oldal. Hozzájárulsz?',
          accept: 'Elfogadom',
          deny: 'Csak lényeges',
          link: 'Adatvédelem',
        }
      : {
          text: 'We use anonymous, cookie-less analytics to improve the site. Do you agree?',
          accept: 'Accept',
          deny: 'Essential only',
          link: 'Privacy policy',
        }

  return (
    <>
      {showBanner && consent === null && (
        <div className="cookie" data-show="true" role="dialog" aria-live="polite" aria-label={copy.text}>
          <Cookie width={20} height={20} style={{ color: 'var(--ember-2)', flex: 'none' }} />
          <p className="cookie__text">
            {copy.text}{' '}
            <Link href={`/${locale}/privacy`}>{copy.link}</Link>
          </p>
          <div className="cookie__actions">
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => decide('denied')}>
              {copy.deny}
            </button>
            <button type="button" className="btn btn--ember btn--sm" onClick={() => decide('granted')}>
              {copy.accept}
            </button>
          </div>
        </div>
      )}

      {consent === 'granted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
    </>
  )
}
