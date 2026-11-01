import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: 'false' as const,
}

export const ArrowRight = (p: P) => (
  <svg {...base} width="18" height="18" className="icon-arrow" {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)

export const ArrowUpRight = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const ArrowUp = (p: P) => (
  <svg {...base} width="16" height="16" {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
)

export const Check = (p: P) => (
  <svg {...base} width="14" height="14" strokeWidth={2.2} {...p}>
    <path d="m4 12.5 5 5L20 6.5" />
  </svg>
)

export const CheckCircle = (p: P) => (
  <svg {...base} width="24" height="24" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </svg>
)

export const Plus = (p: P) => (
  <svg {...base} width="14" height="14" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Mail = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7.5 8 5.5 8-5.5" />
  </svg>
)

export const Phone = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M5 4h3.2l1.6 4-2 1.5a12 12 0 0 0 6.7 6.7l1.5-2 4 1.6V19a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4Z" />
  </svg>
)

export const Pin = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
)

export const Clock = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </svg>
)

export const Shield = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M12 3 5 6v6c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const Sparkle = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18.2l-1.8-5.6L4.7 10.8 10.2 9 12 3.5Z" />
  </svg>
)

export const Zap = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M13.5 3 5 13.5h5.5L10 21l9-11h-5.5L13.5 3Z" />
  </svg>
)

export const Globe = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.2 9.5h17.6M3.2 14.5h17.6M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </svg>
)

export const Code = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.2 5.5l-2.4 13" />
  </svg>
)

export const Cart = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M3 4h2l2.2 10.5a1.6 1.6 0 0 0 1.6 1.3h8.2a1.6 1.6 0 0 0 1.6-1.2L20.5 7H6" />
    <circle cx="9.5" cy="19" r="1.3" />
    <circle cx="17" cy="19" r="1.3" />
  </svg>
)

export const Layers = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
    <path d="m3.5 12.2 8.5 4.5 8.5-4.5M3.5 16.7l8.5 4.5 8.5-4.5" />
  </svg>
)

export const Search = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="m15.5 15.5 4.5 4.5" />
  </svg>
)

export const Palette = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.8 0-.6-.3-1-.6-1.4-.3-.4-.6-.8-.6-1.3 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3Z" />
    <circle cx="7.6" cy="10.2" r="1" fill="currentColor" stroke="none" />
    <circle cx="11" cy="7.4" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.2" cy="8.6" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const Plug = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M9 3v5M15 3v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0V8ZM12 16.5V21" />
  </svg>
)

export const Info = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.6v.1" />
  </svg>
)

export const Alert = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M12 4 3 20h18L12 4Z" />
    <path d="M12 10v4M12 17.2v.1" />
  </svg>
)

export const Menu = (p: P) => (
  <svg {...base} width="22" height="22" {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const Github = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.27 10.27 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
)

export const Linkedin = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden focusable="false" {...p}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.2 1.46-2.2 2.97V21h-4V9Z" />
  </svg>
)

export const Instagram = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const Dribbble = (p: P) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden focusable="false" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M5.2 6.4c3.6 4.2 6.3 8 8 13.2M3.2 10.6c4.6.6 9.4-.2 13.6-2.6M8.4 3.7c3.6 4 8.4 6.2 12.4 6" />
  </svg>
)

export const Cookie = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M20.5 12.2A8.5 8.5 0 1 1 11.8 3.5a3.3 3.3 0 0 0 4.5 4 3.3 3.3 0 0 0 4.2 4.7Z" />
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="9.5" cy="15" r="1" fill="currentColor" stroke="none" />
    <circle cx="14" cy="14.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const Gauge = (p: P) => (
  <svg {...base} width="18" height="18" {...p}>
    <path d="M4 17.5a9 9 0 1 1 16 0" />
    <path d="m12 14 4-5" />
    <circle cx="12" cy="15" r="1.6" />
  </svg>
)
