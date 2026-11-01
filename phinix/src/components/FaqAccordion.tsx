'use client'

import { useState } from 'react'
import { Reveal } from '@/components/Reveal'
import { dictionaries } from '@/data/dictionary'
import type { Locale } from '@/lib/i18n'

/**
 * FAQ accordion — the single interactive island of the FAQ section.
 * Every question and answer is already present in the server-rendered HTML
 * (crawlable, and byte-identical to the FAQPage JSON-LD), so the only client
 * cost is this tiny stateful list.
 */
export function FaqAccordion({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale]
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      {dict.faq.items.map((item, i) => {
        const open = openIndex === i
        return (
          <Reveal key={item.q} as="div" delay={Math.min(i * 0.03, 0.15)}>
            <div className="faq-item" data-open={open}>
              <h3>
                <button
                  type="button"
                  className="faq-item__trigger"
                  aria-expanded={open}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  {item.q}
                  <span className="faq-item__icon" aria-hidden="true" />
                </button>
              </h3>
              <div
                className="faq-item__panel"
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-trigger-${i}`}
              >
                <div>
                  <p className="faq-item__answer">{item.a}</p>
                </div>
              </div>
            </div>
          </Reveal>
        )
      })}
    </>
  )
}
