import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Hero, Marquee } from '@/components/Hero'
import { Services, Work, Process, About, Faq, CtaBand } from '@/components/Sections'
import { Contact } from '@/components/Contact'
import { JsonLd } from '@/components/JsonLd'
import { buildMetadata, landingJsonLd } from '@/lib/seo'
import { isLocale } from '@/lib/i18n'
import { dictionaries } from '@/data/dictionary'

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
    path: '',
    title: dict.meta.home.title,
    description: dict.meta.home.description,
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <main id="main">
      <Hero locale={locale} />
      <Marquee locale={locale} />
      <Services locale={locale} />
      <Work locale={locale} />
      <Process locale={locale} />
      <About locale={locale} />
      <Faq locale={locale} />
      <CtaBand locale={locale} />
      <Contact locale={locale} />
      <JsonLd data={landingJsonLd(locale)} />
    </main>
  )
}
