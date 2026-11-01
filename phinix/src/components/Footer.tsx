import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { ArrowUp, Github, Instagram, Linkedin, Mail, Phone } from '@/components/Icons'
import { dictionaries } from '@/data/dictionary'
import type { Locale } from '@/lib/i18n'
import { siteConfig } from '@/config/site'

export function Footer({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  const year = new Date().getFullYear()

  // social profiles are optional: an empty URL in siteConfig hides the link,
  // so the footer never shows a dead GitHub/LinkedIn icon
  const socials = [
    { url: siteConfig.socials.github, label: 'GitHub', Icon: Github },
    { url: siteConfig.socials.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { url: siteConfig.socials.instagram, label: 'Instagram', Icon: Instagram },
  ].filter((s) => Boolean(s.url))

  const explore = [
    { href: '#services', label: dict.nav.services },
    { href: '#work', label: dict.nav.work },
    { href: '#process', label: dict.nav.process },
    { href: '#about', label: dict.nav.about },
    { href: '#faq', label: dict.nav.faq },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link href={`/${locale}`} aria-label={`PHINIX — ${locale === 'hu' ? 'főoldal' : 'home'}`}>
              <Logo size={42} />
            </Link>
            <p className="footer__blurb">{dict.footer.blurb}</p>
            <p className="micro" style={{ color: 'var(--muted-2)' }}>
              {dict.footer.buildNote}
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="footer__col-title">
              {dict.footer.columns.explore}
            </h2>
            <div className="footer__links">
              {explore.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </nav>

          <div>
            <h2 className="footer__col-title">{dict.footer.columns.contact}</h2>
            <div className="footer__links">
              <a href={`mailto:${siteConfig.email}`}>
                <Mail width={14} height={14} /> {siteConfig.email}
              </a>
              <a href={`tel:${siteConfig.phoneHref}`}>
                <Phone width={14} height={14} /> {siteConfig.phone}
              </a>
              <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                {siteConfig.location[locale]}
              </span>
            </div>
          </div>

          {socials.length > 0 ? (
            <div>
              <h2 className="footer__col-title">{dict.footer.columns.follow}</h2>
              <div className="footer__links">
                {socials.map(({ url, label, Icon }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer">
                    <Icon width={14} height={14} /> {label}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="footer__col-title">{dict.footer.columns.follow}</h2>
              <div className="footer__links">
                <a href={`mailto:${siteConfig.email}`}>
                  <Mail width={14} height={14} /> {locale === 'hu' ? 'Írj e-mailt' : 'Send an email'}
                </a>
                <a href={`tel:${siteConfig.phoneHref}`}>
                  <Phone width={14} height={14} /> {locale === 'hu' ? 'Hívj fel' : 'Call me'}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="footer__wordmark" aria-hidden="true" />

      <div className="container">
        <div className="footer__bottom">
          <p>
            © {year} {siteConfig.name}. {dict.footer.legal}
          </p>
          <div className="footer__legal-links">
            <Link href={`/${locale}/privacy`}>{dict.footer.privacy}</Link>
            <Link href={`/${locale}/impresszum`}>{dict.footer.impresszum}</Link>
            <a href="#top" className="footer__to-top">
              {dict.footer.backToTop} <ArrowUp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
