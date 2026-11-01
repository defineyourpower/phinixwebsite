import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { isLocale } from '@/lib/i18n'
import { dictionaries } from '@/data/dictionary'
import { ArrowRight, Shield } from '@/components/Icons'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = dictionaries[locale]
  return buildMetadata({
    locale,
    path: 'privacy',
    title: dict.meta.privacy.title,
    description: dict.meta.privacy.description,
  })
}

export function generateStaticParams() {
  return [{ locale: 'hu' }, { locale: 'en' }]
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = dictionaries[locale]

  return (
    <main id="main" className="prose-page">
      <div className="container container--narrow">
        <header className="prose-page__head">
          <p className="eyebrow">
            <Shield width={14} height={14} style={{ marginRight: 6 }} />
            PHINIX
          </p>
          <h1 className="display h2">{dict.legal.privacyTitle}</h1>
          <p className="small">{dict.legal.privacyUpdated}</p>
        </header>

        <div className="prose">
          {dict.legal.privacySections.map((section) => (
            <section key={section.h}>
              <h2>{section.h}</h2>
              <p>{section.p}</p>
            </section>
          ))}
          <p className="prose__note">{dict.legal.templateNote}</p>
        </div>

        <div className="prose-page__back">
          <Link href={`/${locale}`} className="btn btn--ghost btn--sm">
            {dict.legal.backHome}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </main>
  )
}
