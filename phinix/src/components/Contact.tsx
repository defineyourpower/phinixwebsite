'use client'

import { useId, useRef, useState } from 'react'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import {
  Alert,
  ArrowRight,
  CheckCircle,
  Clock,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Pin,
  Shield,
} from '@/components/Icons'
import { dictionaries } from '@/data/dictionary'
import type { Locale } from '@/lib/i18n'
import { siteConfig } from '@/config/site'
import type { ContactResponse } from '@/lib/validation'

type FieldErrors = Partial<Record<'name' | 'email' | 'message' | 'consent' | 'projectType', string>>

export function Contact({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  const uid = useId()
  const startRef = useRef<number>(Date.now())

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string>('')
  const [values, setValues] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
    consent: false,
    company: '', // honeypot
  })

  const set = <K extends keyof typeof values>(key: K, val: (typeof values)[K]) => {
    setValues((v) => ({ ...v, [key]: val }))
    if (errors[key as keyof FieldErrors]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): FieldErrors {
    const e: FieldErrors = {}
    if (values.name.trim().length < 2) e.name = dict.contact.validation.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) e.email = dict.contact.validation.email
    if (values.message.trim().length < 10) e.message = dict.contact.validation.message
    if (!values.consent) e.consent = dict.contact.validation.consent
    if (!values.projectType) e.projectType = dict.contact.validation.projectType
    return e
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    setServerError('')
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = document.querySelector<HTMLElement>('[data-invalid="true"] input, [data-invalid="true"] textarea, [data-invalid="true"] select')
      first?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          projectType: values.projectType,
          budget: values.budget,
          message: values.message.trim(),
          consent: values.consent,
          locale,
          company: values.company,
          elapsedMs: Date.now() - startRef.current,
        }),
      })
      const data = (await res.json()) as ContactResponse

      if (!res.ok || !data.ok) {
        if (!data.ok && data.code === 'validation' && data.errors) {
          const mapped: FieldErrors = {}
          for (const [k, v] of Object.entries(data.errors)) {
            if (k in { name: 1, email: 1, message: 1, consent: 1, projectType: 1 }) {
              mapped[k as keyof FieldErrors] = v
            }
          }
          setErrors(mapped)
        }
        setServerError(data.ok === false && data.code === 'rate_limit' ? rateLimitText(locale) : dict.contact.errorText)
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setServerError(dict.contact.errorText)
      setStatus('error')
    }
  }

  const invalid = (k: keyof FieldErrors) => errors[k] !== undefined

  if (status === 'success') {
    return (
      <section className="section contact" id="contact" aria-labelledby="contact-title">
        <div className="container contact__layout">
          <ContactInfo locale={locale} />
          <div className="form-card">
            <div className="form-success" role="status" aria-live="polite">
              <span className="form-success__icon">
                <CheckCircle />
              </span>
              <h3 className="h3 display">{dict.contact.successTitle}</h3>
              <p className="body-muted" style={{ maxWidth: '46ch' }}>
                {dict.contact.successText}
              </p>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  setValues({ name: '', email: '', projectType: '', budget: '', message: '', consent: false, company: '' })
                  setStatus('idle')
                  startRef.current = Date.now()
                }}
              >
                {dict.contact.successAgain}
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="container contact__layout">
        <ContactInfo locale={locale} />

        <Reveal delay={0.08}>
          <form className="form-card" onSubmit={onSubmit} noValidate aria-labelledby="contact-title">
            <div className="form-grid">
              {/* Name */}
              <div className="field" data-invalid={invalid('name')}>
                <label className="field__label" htmlFor={`${uid}-name`}>
                  <span>
                    {dict.contact.labels.name} <span className="field__req" aria-hidden="true">*</span>
                  </span>
                </label>
                <input
                  id={`${uid}-name`}
                  className="input"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                  aria-invalid={invalid('name')}
                  aria-describedby={invalid('name') ? `${uid}-name-err` : undefined}
                />
                {invalid('name') && (
                  <p className="field__error" id={`${uid}-name-err`}>
                    <Alert width={13} height={13} /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="field" data-invalid={invalid('email')}>
                <label className="field__label" htmlFor={`${uid}-email`}>
                  <span>
                    {dict.contact.labels.email} <span className="field__req" aria-hidden="true">*</span>
                  </span>
                </label>
                <input
                  id={`${uid}-email`}
                  className="input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  aria-invalid={invalid('email')}
                  aria-describedby={invalid('email') ? `${uid}-email-err` : undefined}
                />
                {invalid('email') && (
                  <p className="field__error" id={`${uid}-email-err`}>
                    <Alert width={13} height={13} /> {errors.email}
                  </p>
                )}
              </div>

              {/* Project type */}
              <div className="field" data-invalid={invalid('projectType')}>
                <label className="field__label" htmlFor={`${uid}-type`}>
                  {dict.contact.labels.projectType}
                </label>
                <select
                  id={`${uid}-type`}
                  className="select"
                  name="projectType"
                  required
                  value={values.projectType}
                  onChange={(e) => set('projectType', e.target.value)}
                  aria-invalid={invalid('projectType')}
                >
                  <option value="">{dict.contact.selectPlaceholder}</option>
                  {dict.contact.projectTypeOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {invalid('projectType') && (
                  <p className="field__error">
                    <Alert width={13} height={13} /> {errors.projectType}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div className="field">
                <label className="field__label" htmlFor={`${uid}-budget`}>
                  <span>{dict.contact.labels.budget}</span>
                  <span className="field__optional">{dict.contact.labels.optional}</span>
                </label>
                <select
                  id={`${uid}-budget`}
                  className="select"
                  name="budget"
                  value={values.budget}
                  onChange={(e) => set('budget', e.target.value)}
                >
                  <option value="">{dict.contact.selectPlaceholder}</option>
                  {dict.contact.budgetOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="field field--full" data-invalid={invalid('message')}>
                <label className="field__label" htmlFor={`${uid}-msg`}>
                  <span>
                    {dict.contact.labels.message} <span className="field__req" aria-hidden="true">*</span>
                  </span>
                </label>
                <textarea
                  id={`${uid}-msg`}
                  className="textarea"
                  name="message"
                  required
                  rows={5}
                  placeholder={dict.contact.labels.messagePlaceholder}
                  value={values.message}
                  onChange={(e) => set('message', e.target.value)}
                  aria-invalid={invalid('message')}
                  aria-describedby={invalid('message') ? `${uid}-msg-err` : undefined}
                />
                {invalid('message') && (
                  <p className="field__error" id={`${uid}-msg-err`}>
                    <Alert width={13} height={13} /> {errors.message}
                  </p>
                )}
              </div>

              {/* honeypot — visually and semantically hidden from humans */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor={`${uid}-company`}>Company</label>
                <input
                  id={`${uid}-company`}
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.company}
                  onChange={(e) => set('company', e.target.value)}
                />
              </div>

              {/* Consent */}
              <div className="field field--full" data-invalid={invalid('consent')}>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={values.consent}
                    onChange={(e) => set('consent', e.target.checked)}
                    aria-invalid={invalid('consent')}
                    aria-describedby={invalid('consent') ? `${uid}-consent-err` : undefined}
                  />
                  <span>
                    {dict.contact.labels.consent}{' '}
                    <Link href={`/${locale}/privacy`} target="_blank" rel="noopener noreferrer">
                      ({dict.contact.labels.consentLink})
                    </Link>
                  </span>
                </label>
                {invalid('consent') && (
                  <p className="field__error" id={`${uid}-consent-err`}>
                    <Alert width={13} height={13} /> {errors.consent}
                  </p>
                )}
              </div>
            </div>

            {serverError && (
              <div className="form__status form__status--error" role="alert">
                <Alert width={16} height={16} />
                <span>{serverError}</span>
              </div>
            )}

            <div className="form__foot">
              <p className="form__privacy">
                <Shield width={14} height={14} />
                {locale === 'hu'
                  ? 'Az adataidat kizárólag a válaszadásra használjuk.'
                  : 'Your details are used only to reply to you.'}
              </p>
              <button type="submit" className="btn btn--ember" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    {dict.contact.labels.sending}
                  </>
                ) : (
                  <>
                    {dict.contact.labels.submit}
                    <ArrowRight />
                  </>
                )}
              </button>
            </div>
            <p className="visually-hidden" role="status" aria-live="polite">
              {status === 'sending' ? dict.contact.labels.sending : ''}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function rateLimitText(locale: Locale) {
  return locale === 'hu'
    ? 'Túl sok üzenet érkezett rövid időn belül. Kérlek, próbáld újra néhány perc múlva, vagy írj e-mailt.'
    : 'Too many messages in a short time. Please try again in a few minutes, or send an email.'
}

function ContactInfo({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  return (
    <div className="contact__info">
      <Reveal>
        <p className="eyebrow">{dict.contact.eyebrow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 id="contact-title" className="display h2">
          {dict.contact.title}
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="lead">{dict.contact.intro}</p>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="contact__availability">{dict.contact.availability}</p>
      </Reveal>

      <Reveal delay={0.18}>
        <h3 className="micro" style={{ color: 'var(--muted-2)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          {dict.contact.directTitle}
        </h3>
        <div className="contact__rows">
          <a className="contact__row" href={`mailto:${siteConfig.email}`}>
            <span className="contact__row-label">
              <Mail /> {dict.contact.emailLabel}
            </span>
            <span className="contact__row-value">{siteConfig.email}</span>
          </a>
          <a className="contact__row" href={`tel:${siteConfig.phoneHref}`}>
            <span className="contact__row-label">
              <Phone /> {dict.contact.phoneLabel}
            </span>
            <span className="contact__row-value">{siteConfig.phone}</span>
          </a>
          <div className="contact__row">
            <span className="contact__row-label">
              <Pin /> {dict.contact.locationLabel}
            </span>
            <span className="contact__row-value">
              {siteConfig.location[locale]}
            </span>
          </div>
          <div className="contact__row">
            <span className="contact__row-label">
              <Clock /> {dict.contact.responseLabel}
            </span>
            <span className="contact__row-value">{siteConfig.responseTime[locale]}</span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.22}>
        <div className="contact__socials">
          <a className="social" href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub (${dict.a11y.externalLink})`}>
            <Github />
          </a>
          <a className="social" href={siteConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn (${dict.a11y.externalLink})`}>
            <Linkedin />
          </a>
          <a className="social" href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram (${dict.a11y.externalLink})`}>
            <Instagram />
          </a>
        </div>
        <p className="contact__calm" style={{ marginTop: '1rem' }}>
          {dict.contact.calm}
        </p>
      </Reveal>
    </div>
  )
}
