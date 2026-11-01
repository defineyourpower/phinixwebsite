import fs from 'node:fs'

/**
 * Builds the shared header/footer lockup:
 *   [ uploaded emblem, vectorised ]  +  PHINIX wordmark (Bricolage 700, tracked)
 *
 * Keeping the wordmark as live text (not a bitmap) keeps it crisp, translatable
 * and accessible — only the emblem is artwork.
 */
const src = fs.readFileSync('public/phinix-emblem.svg', 'utf8')
const inner = src
  .replace(/^[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')

// give the emblem a slightly tighter optical box inside a 64×64 placeholder
const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="PHINIX">
${inner}
</svg>`

fs.writeFileSync('public/phinix-emblem.svg', src)
console.log('emblem kept as-is:', (src.length / 1024).toFixed(1), 'KB')
