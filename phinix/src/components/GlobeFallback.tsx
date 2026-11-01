/**
 * Static globe poster — zero JavaScript, one small preloaded WebP.
 *
 * It is what visitors (and Lighthouse) see before the WebGL globe fades in,
 * and it stays as the permanent fallback for reduced-motion users, very old
 * devices and browsers without WebGL. Because it is a plain <img> on the real
 * cartography texture, it reads as the same object as the 3D globe.
 */
export function GlobeFallback() {
  return (
    <div className="globe-poster">
      {/* the plate: real land mask, shaded like a lit sphere */}
      <img
        src="/textures/globe-poster.webp"
        alt=""
        width={640}
        height={320}
        decoding="async"
        fetchPriority="high"
        className="globe-poster__map"
      />
      {/* lighting + atmosphere overlays */}
      <span className="globe-poster__shade" aria-hidden="true" />
      <span className="globe-poster__rim" aria-hidden="true" />
      <span className="globe-poster__gloss" aria-hidden="true" />
    </div>
  )
}
