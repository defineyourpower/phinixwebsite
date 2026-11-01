import rawProjects from '../../content/projects.json'

/**
 * Egy referencia-munka.
 *
 * FELTÖLTÉS (admin felület nélkül, fájlból):
 *   1. borító: `public/covers/<slug>.webp`  (1600×1100, ~150 kB, WebP)
 *   2. adatok: `content/projects.json` → egy blokk a "projects" tömbbe
 *   3. élesítés: `npm run build`  (fejlesztésnél a mentés is elég)
 *
 * Ha a tömb üres, a Munkák szekció „hamarosan" állapotot mutat: nincs üres
 * kártyarács, nincs törött kép, és a `/api/projects` is üres listát ad.
 */
export type Project = {
  slug: string
  client: string
  title: { hu: string; en: string }
  category: { hu: string; en: string }
  year: string
  result: { hu: string; en: string }
  desc: { hu: string; en: string }
  tags: readonly string[]
  cover: string
  /** true = bemutató/demo munka (a kártyán jelölve); false = valós ügyfélmunka */
  showcase: boolean
}

/** A feltöltött munkák, a JSON-ból. Jelenleg üres — ez szándékos. */
export const projects: Project[] = (rawProjects.projects as Project[]).map((p) => ({
  ...p,
  // a borító mindig a public mappából jön, hogy ne lehessen elrontani az útvonalat
  cover: p.cover.startsWith('/') ? p.cover : `/covers/${p.cover}`,
  showcase: p.showcase ?? false,
}))

/** Van-e megjeleníthető munka? A UI ezt nézi. */
export const hasProjects = projects.length > 0

/**
 * A korábbi bemutatóprojektek a szótárban maradtak (`dictionaries.*.projects`),
 * de már nem jelennek meg. Ha valaha mégis kellenek egy üres portfólió
 * kitöltésére, itt vissza lehet őket hozni — addig viszont semmi sem ígér
 * olyat, ami nem valós ügyfélmunka.
 */
