'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/hooks'

/** three.js is a separate chunk, fetched only when the visitor shows intent. */
const Globe = dynamic(() => import('@/components/Globe').then((m) => m.default), {
  ssr: false,
  loading: () => null,
})

export function HeroGlobe() {
  const [mounted, setMounted] = useState(false)
  const reduced = usePrefersReducedMotion()
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let done = false
    const arm = () => {
      if (done) return
      done = true
      setMounted(true)
    }
    // safety: never leave the hero static-only for long
    const timer = window.setTimeout(arm, 3500)
    const events: Array<keyof WindowEventMap> = ['scroll', 'pointermove', 'touchstart', 'keydown', 'click']
    const onIntent = () => {
      events.forEach((e) => window.removeEventListener(e, onIntent))
      arm()
    }
    events.forEach((e) => window.addEventListener(e, onIntent, { passive: true }))
    const el = hostRef.current
    const onEnter = () => {
      events.forEach((e) => window.removeEventListener(e, onIntent))
      arm()
    }
    el?.addEventListener('pointerenter', onEnter)
    return () => {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, onIntent))
      el?.removeEventListener('pointerenter', onEnter)
    }
  }, [])

  return (
    <div ref={hostRef} style={{ position: 'absolute', inset: 0 }}>
      {mounted && <Globe reducedMotion={reduced} />}
    </div>
  )
}
