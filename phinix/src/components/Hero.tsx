import { GlobeFallback } from '@/components/GlobeFallback'
import { HeroGlobe } from '@/components/HeroGlobe'
import { ArrowRight, Gauge, Globe as GlobeIcon } from '@/components/Icons'
import { dictionaries } from '@/data/dictionary'
import type { Locale } from '@/lib/i18n'

export function Hero({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__grid-bg" aria-hidden="true" />
      <div className="hero__noise" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">{dict.hero.eyebrow}</p>

          <h1 id="hero-title" className="hero__title">
            {dict.hero.titleA}
            <em className="accent accent-underline">{dict.hero.accent}</em>
            {dict.hero.titleB}
          </h1>

          <p className="hero__sub">{dict.hero.subtitle}</p>

          <div className="hero__ctas">
            <a href="#contact" className="btn btn--ember btn--lg">
              {dict.hero.primaryCta}
              <ArrowRight />
            </a>
            <a href="#work" className="btn btn--ghost btn--lg">
              {dict.hero.secondaryCta}
            </a>
          </div>

          <dl className="hero__stats">
            {dict.hero.stats.map((s) => (
              <div key={s.label}>
                <dd className="stat__value">{s.value}</dd>
                <dt className="stat__label">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__visual">
          <div className="globe-halo" aria-hidden="true" />
          <div className="orbit-ring" aria-hidden="true" />
          <div className="orbit-ring orbit-ring--2" aria-hidden="true" />

          <div className="globe-stage">
            {/* static art paints instantly; the WebGL canvas fades in over it */}
            <GlobeFallback />
            <HeroGlobe />
          </div>

          <div className="float-card float-card--tl" aria-hidden="true">
            <span className="float-card__dot" />
            {dict.hero.globeBadge}
          </div>

          <div className="float-card float-card--br" aria-hidden="true">
            <span className="float-card__icon">
              <Gauge />
            </span>
            Core Web Vitals · 98+
          </div>

          <p className="globe-caption">
            <GlobeIcon className="visually-hidden" />
            {dict.hero.globeCaption}
          </p>
        </div>
      </div>

      <div className="container">
        <div className="hero__scroll" aria-hidden="true">
          <span className="hero__scroll-line" />
          {dict.hero.scrollHint}
        </div>
      </div>
    </section>
  )
}

/** Thin marquee of technologies — CSS-only animation, no client JS at all. */
export function Marquee({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  const items = [...dict.marquee.items]
  return (
    <div className="marquee" aria-label={dict.marquee.label}>
      <div className="marquee__track" aria-hidden="true">
        {[0, 1].map((pass) => (
          <div key={pass} style={{ display: 'flex' }} aria-hidden={pass === 1 || undefined}>
            {items.map((item, i) => (
              <span className="marquee__item" key={`${pass}-${i}`}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="visually-hidden">{items.join(', ')}</span>
    </div>
  )
}
