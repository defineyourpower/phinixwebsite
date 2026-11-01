import Image from 'next/image'
import { Reveal } from '@/components/Reveal'
import {
  ArrowRight,
  ArrowUpRight,
  Cart,
  Check,
  Code,
  Gauge,
  Globe,
  Info,
  Layers,
  Palette,
  Plug,
  Search,
  Shield,
  Sparkle,
  Zap,
} from '@/components/Icons'
import { FaqAccordion } from '@/components/FaqAccordion'
import { WorkFilters } from '@/components/WorkFilters'
import { dictionaries } from '@/data/dictionary'
import { projects, hasProjects } from '@/data/projects'
import type { Locale } from '@/lib/i18n'
import { siteConfig } from '@/config/site'

/* -------------------------------------------------------------------------- */
/*  Services                                                                   */
/* -------------------------------------------------------------------------- */

const serviceIcons: Record<string, React.ReactNode> = {
  web: <Code />,
  shop: <Cart />,
  app: <Layers />,
  seo: <Search />,
  design: <Palette />,
  int: <Plug />,
}

/* Layout rhythm: first card is the feature, second/third wide, rest thirds. */
const CARD_LAYOUT = ['feature', 'wide', 'wide', 'third', 'third', 'third'] as const

export function Services({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  return (
    <section className="section services" id="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <p className="eyebrow">{dict.services.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="services-title" className="display h2">
              {dict.services.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lead">{dict.services.intro}</p>
          </Reveal>
        </div>

        <div className="services__grid">
          {dict.services.items.map((item, i) => {
            const layout = CARD_LAYOUT[i] ?? 'third'
            const isFeature = layout === 'feature'
            return (
              <Reveal
                key={item.id}
                delay={Math.min(i * 0.05, 0.25)}
                className={[
                  'service-card',
                  isFeature ? 'service-card--feature' : '',
                  layout === 'wide' ? 'service-card--wide' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                as="article"
              >
                <div>
                  <div className="service-card__top">
                    <span className="service-card__icon">{serviceIcons[item.id] ?? <Sparkle />}</span>
                    <span className="service-card__num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div style={{ marginTop: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                    <h3 className="service-card__title">{item.title}</h3>
                    <p className="service-card__desc">{item.desc}</p>
                  </div>
                  <ul className="service-card__bullets" style={{ marginTop: '1.1rem' }}>
                    {item.bullets.map((b) => (
                      <li key={b}>
                        <Check />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="service-card__eta" style={{ marginTop: '1.1rem' }}>
                    <Zap width={13} height={13} />
                    {dict.services.etaLabel}: {item.eta}
                  </p>
                </div>

                {isFeature && (
                  <div className="service-card__visual" aria-hidden="true">
                    <div className="service-orbit">
                      <span className="service-orbit__ring" />
                      <span className="service-orbit__ring" />
                      <span className="service-orbit__ring" />
                      <span className="service-orbit__core" />
                    </div>
                  </div>
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Work (server-rendered grid + client filter island)                         */
/* -------------------------------------------------------------------------- */

export function Work({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  const categories = Array.from(new Set(projects.map((p) => p.category[locale])))

  return (
    <section className="section work" id="work" aria-labelledby="work-title">
      <div className="container">
        <div className="section-head section-head--row">
          <div>
            <Reveal>
              <p className="eyebrow">{dict.work.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 id="work-title" className="display h2">
                {dict.work.title}
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">{dict.work.intro}</p>
            </Reveal>
          </div>
          {hasProjects && (
            <Reveal delay={0.18}>
              <WorkFilters
                locale={locale}
                allLabel={locale === 'hu' ? 'Mind' : 'All'}
                categories={categories}
                total={projects.length}
                counts={Object.fromEntries(categories.map((c) => [c, projects.filter((p) => p.category[locale] === c).length]))}
              />
            </Reveal>
          )}
        </div>

        {hasProjects ? (
          <div className="work__grid" id="work-grid">
            {projects.map((project, i) => (
              <Reveal
                key={project.slug}
                as="article"
                className="work-card"
                delay={Math.min(i * 0.06, 0.3)}
                data-category={project.category[locale]}
              >
                <div className="work-card__media">
                  {project.showcase && <span className="work-card__badge">{dict.work.placeholderBadge}</span>}
                  <Image
                    src={project.cover}
                    alt={`${project.client} — ${project.title[locale]}`}
                    width={960}
                    height={660}
                    sizes="(max-width: 640px) 92vw, (max-width: 1023px) 46vw, 31vw"
                    quality={74}
                    loading="lazy"
                  />
                </div>
                <div className="work-card__body">
                  <div className="work-card__meta">
                    <span className="work-card__client">{project.client}</span>
                    <span>
                      {project.category[locale]} · {project.year}
                    </span>
                  </div>
                  <h3 className="work-card__title">{project.title[locale]}</h3>
                  <p className="work-card__desc">{project.desc[locale]}</p>
                  <p className="work-card__result">
                    <Zap width={13} height={13} />
                    <span>
                      {dict.work.resultsLabel}: {project.result[locale]}
                    </span>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          /* Amíg nincs feltöltött munka: nem üres rácsot mutatunk, hanem egy
             őszinte, kész megjelenésű állapotot. */
          <Reveal className="work-empty">
            <div className="work-empty__inner">
              <p className="work-empty__eyebrow">{dict.work.emptyEyebrow}</p>
              <h3 className="work-empty__title">{dict.work.emptyTitle}</h3>
              <p className="work-empty__text">{dict.work.emptyText}</p>
              <div className="work-empty__actions">
                <a href="#contact" className="btn btn--ember">
                  {dict.work.emptyCta}
                  <ArrowUpRight />
                </a>
                <a href="#services" className="btn btn--ghost">
                  {dict.nav.services}
                </a>
              </div>
            </div>
          </Reveal>
        )}

        <div className="work__footer">
          <p className="small" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info width={15} height={15} />
            {dict.work.allWork}
          </p>
          <a href="#contact" className="link-arrow">
            {dict.nav.cta}
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Process                                                                    */
/* -------------------------------------------------------------------------- */

export function Process({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  return (
    <section className="section section--defer" id="process" aria-labelledby="process-title">
      <div className="container process__layout">
        <div className="process__sticky">
          <Reveal>
            <p className="eyebrow">{dict.process.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="process-title" className="display h2">
              {dict.process.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lead">{dict.process.intro}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="process__note">
              <Shield width={18} height={18} />
              <p>
                {locale === 'hu'
                  ? 'Fix ár, tételes ajánlat, szerződés és 30 napos garancia. A projekt közben heti státuszriportot kapsz — nincs meglepetés.'
                  : 'Fixed price, itemised quote, contract and a 30-day warranty. You get a weekly status report during the project — no surprises.'}
              </p>
            </div>
          </Reveal>
        </div>

        <ol className="process__steps">
          {dict.process.items.map((step, i) => (
            <Reveal as="li" className="step" key={step.title} delay={Math.min(i * 0.05, 0.2)}>
              <span className="step__marker" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="step__body">
                <h3 className="step__title">
                  <span className="visually-hidden">
                    {dict.process.stepLabel} {i + 1}:{' '}
                  </span>
                  {step.title}
                </h3>
                <p className="step__desc">{step.desc}</p>
                <ul className="step__tags">
                  {step.deliverables.map((d) => (
                    <li className="tag" key={d}>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  About                                                                      */
/* -------------------------------------------------------------------------- */

export function About({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  return (
    <section className="section section--defer about" id="about" aria-labelledby="about-title">
      <div className="container about__layout">
        <div className="about__copy">
          <Reveal>
            <p className="eyebrow">{dict.about.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="about-title" className="display h2">
              {dict.about.title}
            </h2>
          </Reveal>
          {dict.about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.06}>
              <p>{p}</p>
            </Reveal>
          ))}

          <div style={{ marginTop: '1.75rem' }}>
            <Reveal>
              <h3 className="h4" style={{ marginBottom: '1.1rem' }}>
                {dict.about.valuesTitle}
              </h3>
            </Reveal>
            <div className="about__values">
              {dict.about.values.map((v, i) => (
                <Reveal key={v.title} delay={0.05 * i} className="value">
                  <p className="value__title">
                    {[<Sparkle key="a" />, <Gauge key="b" />, <Info key="c" />, <Globe key="d" />][i] ?? <Sparkle />}
                    {v.title}
                  </p>
                  <p className="value__desc">{v.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <Reveal className="about__card" delay={0.12}>
          <div className="about__emblem" aria-hidden="true">
            <EmblemLarge />
          </div>

          <dl className="about__facts">
            {dict.about.facts.map((f) => (
              <div key={f.label}>
                <dt className="about__fact-label">{f.label}</dt>
                <dd className="about__fact-value">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="about__signature">
            <p className="about__signature-text">{dict.about.founderNote}</p>
            <p className="about__signature-role">
              {locale === 'hu' ? 'A stúdió alapítója' : 'Founder of the studio'} · {siteConfig.location[locale]}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function EmblemLarge() {
  return (
    <svg viewBox="0 0 200 200" role="presentation">
      <defs>
        <linearGradient id="ab-ember" x1="40" y1="170" x2="165" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6A2B" />
          <stop offset="1" stopColor="#E9C46A" />
        </linearGradient>
        <radialGradient id="ab-core" cx="50%" cy="42%" r="54%">
          <stop offset="0%" stopColor="#FF8A54" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF6A2B" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ab-clip">
          <circle cx="100" cy="100" r="74" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="74" fill="url(#ab-core)" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="url(#ab-ember)" strokeOpacity="0.5" strokeWidth="1.4" />
      <g clipPath="url(#ab-clip)" stroke="url(#ab-ember)" strokeOpacity="0.28" fill="none" strokeWidth="1">
        <ellipse cx="100" cy="100" rx="74" ry="26" />
        <ellipse cx="100" cy="100" rx="74" ry="52" />
        <ellipse cx="100" cy="100" rx="26" ry="74" />
        <ellipse cx="100" cy="100" rx="52" ry="74" />
      </g>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M100 148c-5-16-4.4-30.6 1.3-42.6l-1-12.8 9.7 7.5c4-1.9 8.2-3 12.2-3.6-3.2-4.7-8.6-7.6-16-8.4-8.2-.9-14.4 1.3-18.8 6.5-4.1 5-5.9 11.9-5.4 20.6"
          stroke="url(#ab-ember)"
          strokeWidth="6.5"
        />
        <path
          d="M100.4 94.5C88.2 83.3 80 68.3 76 49.9c14.1 4.6 25.7 12.8 34.7 24.6 5 6.6 8.4 13.7 10.3 21.8-7.5-3.3-14.4-4.2-20.6-1.8Z"
          fill="url(#ab-ember)"
        />
        <path
          d="M112 106.4c7.2-14.6 18.5-24.9 34.1-30.6-6.6 13.4-11.2 25.4-13.8 35.9-1.9 7.8-5.9 13.8-12.2 17.8-5.9 3.8-12.2 5-19.1 3.8 5.3-8.1 9-17.2 11-26.9Z"
          fill="url(#ab-ember)"
          fillOpacity="0.92"
        />
        <circle cx="108.3" cy="76" r="4.4" fill="#F4EFE7" stroke="none" />
      </g>
      <ellipse cx="100" cy="100" rx="94" ry="32" transform="rotate(-22 100 100)" fill="none" stroke="#FF6A2B" strokeOpacity="0.45" strokeWidth="1.2" />
      <ellipse cx="100" cy="100" rx="94" ry="32" transform="rotate(58 100 100)" fill="none" stroke="#E9C46A" strokeOpacity="0.3" strokeWidth="1.2" />
      <circle cx="178" cy="76" r="3.4" fill="#FF6A2B" />
      <circle cx="26" cy="132" r="2.6" fill="#E9C46A" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  FAQ (server-rendered shell + tiny client accordion)                        */
/* -------------------------------------------------------------------------- */

export function Faq({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  return (
    <section className="section section--defer" id="faq" aria-labelledby="faq-title">
      <div className="container faq__layout">
        <div className="faq__aside">
          <Reveal>
            <p className="eyebrow">{dict.faq.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 id="faq-title" className="display h3">
              {dict.faq.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="small" style={{ lineHeight: 1.6 }}>
              {dict.faq.intro}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <a href="#contact" className="btn btn--ghost btn--sm">
              {dict.nav.contact}
              <ArrowRight />
            </a>
          </Reveal>
        </div>

        <div className="faq__list">
          <FaqAccordion locale={locale} />
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  CTA band                                                                   */
/* -------------------------------------------------------------------------- */

export function CtaBand({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container cta-band__inner">
        <div>
          <Reveal>
            <span className="cta-band__badge">
              <Sparkle width={14} height={14} />
              {dict.cta.eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="cta-title" className="cta-band__title">
              {dict.cta.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="cta-band__sub">{dict.cta.subtitle}</p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <div className="cta-band__actions">
            <a href="#contact" className="btn btn--dark btn--lg">
              {dict.cta.button}
              <ArrowRight />
            </a>
            <a href={`mailto:${siteConfig.email}`} className="btn btn--ghost btn--lg">
              {dict.cta.secondary}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
