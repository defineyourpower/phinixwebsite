/**
 * The uploaded PHINIX emblem, vectorised from the source artwork
 * (tools/trace_logo.py → public/phinix-emblem.svg).
 *
 * Served as a file rather than inlined: the mark appears in the header *and* the
 * footer, so one cached 20 kB asset beats duplicating 40 kB of markup into every
 * page — and the SVG scales infinitely, so it stays crisp on retina and in print.
 * Only the emblem is artwork; the wordmark stays live text (selectable,
 * translatable, searchable).
 */
type EmblemProps = {
  /** Rendered height in px (square box). */
  size?: number
  className?: string
  /** Decorative when the wordmark sits next to it. */
  decorative?: boolean
}

export function Emblem({ size = 34, className, decorative = false }: EmblemProps) {
  return (
    <img
      src="/phinix-emblem.svg"
      width={size}
      height={size}
      alt={decorative ? '' : 'PHINIX'}
      aria-hidden={decorative || undefined}
      decoding="async"
      // above the fold: fetch it with the rest of the shell
      fetchPriority={size >= 40 ? 'low' : 'high'}
      className={className}
      style={{ width: size, height: size, flex: 'none', display: 'block' }}
    />
  )
}

type LogoProps = EmblemProps & {
  withWordmark?: boolean
  wordmarkClassName?: string
}

/**
 * Header / footer lockup: emblem + wordmark.
 * The letter-spacing mirrors the logo's own typesetting, with the brand's gold
 * dot standing in for the counter of the "I".
 */
export function Logo({ size = 34, className, withWordmark = true, wordmarkClassName }: LogoProps) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
      <Emblem size={size} decorative={withWordmark} />
      {withWordmark && (
        <span className={wordmarkClassName ? `logo-word ${wordmarkClassName}` : 'logo-word'} aria-hidden="true">
          PHIN<span className="logo-word__i">I</span>X
        </span>
      )}
    </span>
  )
}
