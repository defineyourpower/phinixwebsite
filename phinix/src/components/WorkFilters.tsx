'use client'

import { useEffect, useState } from 'react'

type Props = {
  locale: 'hu' | 'en'
  allLabel: string
  categories: string[]
  counts: Record<string, number>
  total: number
}

/**
 * Category filter for the work grid.
 * The cards themselves are server-rendered; this island only toggles a
 * `data-category` visibility flag through the DOM — no re-render of the grid.
 */
export function WorkFilters({ locale, allLabel, categories, counts, total }: Props) {
  const [active, setActive] = useState<string>('all')

  useEffect(() => {
    const grid = document.getElementById('work-grid')
    if (!grid) return
    // each card is wrapped in a <Reveal> div, so match the card itself
    for (const card of Array.from(grid.querySelectorAll<HTMLElement>('[data-category]'))) {
      card.hidden = !(active === 'all' || card.dataset.category === active)
    }
  }, [active])

  return (
    <div
      className="work__filters"
      role="group"
      aria-label={locale === 'hu' ? 'Szűrés kategória szerint' : 'Filter by category'}
    >
      <button type="button" className="chip" aria-pressed={active === 'all'} onClick={() => setActive('all')}>
        {allLabel}
        <span className="chip__count">{total}</span>
      </button>
      {categories.map((c) => (
        <button key={c} type="button" className="chip" aria-pressed={active === c} onClick={() => setActive(c)}>
          {c}
          <span className="chip__count">{counts[c]}</span>
        </button>
      ))}
    </div>
  )
}
