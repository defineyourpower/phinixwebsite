'use client'

import { useRef, type ElementType, type ReactNode, type RefObject } from 'react'
import { useInView, useScrollProgressVar } from '@/lib/hooks'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in seconds. */
  delay?: number
  as?: ElementType
  id?: string
  /** Any extra attribute (data-category, aria-*, …) is forwarded to the element. */
  [key: `data-${string}`]: unknown
}

/**
 * Scroll-reveal wrapper. One IntersectionObserver per instance, disconnected
 * after firing; `prefers-reduced-motion` users get the final state immediately (CSS).
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  id,
  ...rest
}: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref as never}
      id={id}
      {...rest}
      className={`reveal${inView ? ' is-inview' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? ({ '--delay': `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}

/** Scroll progress bar — writes one CSS variable per frame, zero React re-renders. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useScrollProgressVar(ref as RefObject<HTMLElement | null>)
  return <div ref={ref} className="progress" aria-hidden="true" tabIndex={-1} />
}
