# PHINIX — webfejlesztő stúdió weboldal

Kétnyelvű (HU/EN), prémium megjelenésű, keresőoptimalizált weboldal **React + Next.js** alapon,
interaktív **3D földgömbbel**, teljes SEO-csomaggal és három API-végponttal.

```
Next.js 15 (App Router) · React 19 · TypeScript · Three.js · saját CSS design system
```

---

## Gyors indítás

```bash
cd phinix
npm install
cp .env.example .env.local     # opcionális: domain, e-mail, analitika
npm run dev                    # http://localhost:3000 → átirányít /hu-ra
```

Éles build:

```bash
npm run build     # OG-képek generálása + statikus build (mindkét nyelv előre renderelve)
npm start
```

---

## Amit érdemes tudni elsőként

| Hol | Mit állítasz |
|---|---|
| `src/config/site.ts` | **Minden elérhetőség egy helyen**: domain, e-mail, telefon, város, social linkek, alapítás éve. |
| `.env.local` | Domain (`NEXT_PUBLIC_SITE_URL`), e-mail küldés (`RESEND_API_KEY`), analitika (`NEXT_PUBLIC_GA_ID`). |
| `src/data/dictionary.ts` | **Az összes szöveg, HU és EN** — címek, szolgáltatások, GYIK, űrlap, lábléc, jogi oldalak. |
| `src/data/projects.ts` | Portfólió. Új munka = 1 bejegyzés a szótárban (mindkét nyelven) + 1 borítókép. |
| `public/covers/` | Projekt-borítók (`*.jpg` + `*.webp` + `*.avif`; a `next/image` szolgálja ki). |

> A jelenlegi portfólió **bemutató projekt** (a kártyákon jelölés is van rá).
> A saját munkáidat a `dictionary.ts` `projects` tömbjében cseréld le — a szekció, a szűrő
> és az API automatikusan követi.

---

## Oldalstruktúra

```
/                    → /hu vagy /en (Accept-Language alapján, 307)
/hu  ·  /en          → főoldal (statikusan generált)
/hu/privacy  /en/privacy      → adatvédelmi tájékoztató
/hu/impresszum  /en/impresszum → impresszum
```

Főoldali szekciók: Hero (3D gömb) → technológia-marquee → Szolgáltatások (bento) → Munkák (szűrhető) →
Folyamat (5 lépés) → Rólunk → GYIK (accordion) → CTA sáv → Kapcsolat (űrlap) → Lábléc.

---

## A 3D földgömb

- **Valós kartográfia**: Natural Earth 110m kontúrokból generált textúra (lásd `tools/make_textures.py`),
  nem külső CDN-ről jön, így nincs licence- és elérhetőségi kockázat.
- **Saját shaderek**: Föld (lambert + partmenti parázs-glow + fresnel rim), atmoszféra (additív),
  ~1 100 darab részecske a szárazföldeken, 9 város felé futó animált ív Budapestről + pulzáló fények.
- **Interaktív**: egérrel/ujjal húzható, tehetetlenséggel; `prefers-reduced-motion` esetén álló kép.
- **Teljesítmény**: a három.js külön chunk, és **csak szándékra töltődik be** (scroll / egérmozgás /
  kattintás / 3,5 s biztonsági időzítő). Amíg nem indul, egy 14 KB-os statikus poszter látszik,
  tehát nincs üres felület, az LCP pedig a szövegen marad.
- Csak látható fülön és látható szekcióban renderel; mobilon alacsonyabb pixelarány és geometria;
  ha az első másodperc lassú, automatikusan visszaveszi a felbontást.

Újragenerálás (ha módosítod a színeket/geometriát):

```bash
npm run assets:globe     # python3 tools/make_textures.py (Pillow kell)
```

---

## SEO — mi van beépítve

- **Szerverrenderelt tartalom** mindkét nyelven (nincs JS-függő tartalom a keresőknek).
- Nyelvenkénti `canonical`, `hreflang` (`hu`, `en`, `x-default`), `og:locale` / `og:locale:alternate`.
- **Sitemap** (`/sitemap.xml`) nyelvenkénti alternatívákkal, **robots.txt** (AI-crawlerek engedélyezve).
- **Strukturált adatok (JSON-LD)**: `Organization`, `WebSite` + `SearchAction`, `WebPage`,
  `ProfessionalService` + `OfferCatalog` (szolgáltatások), `FAQPage` (a GYIK szó szerint egyezik a látható szöveggel), `BreadcrumbList`.
- Cím-hossz és leírás-hossz optimalizálva; OpenGraph/Twitter kártya nyelvenként külön, generált 1200×630 PNG.
- `manifest.webmanifest`, app ikonok, `theme-color`, geo meta tagek.
- Szemantikus HTML: egyetlen `h1`, logikus `h2/h3` hierarchia, `aria-label` mindenhol, skip link,
  fókusz-kezelés, `aria-expanded` accordion/menü, űrlap-mezők hibakezeléssel.

**MIT mérj még?** A Lighthouse SEO 100 a technikai alap; a rangsorhoz tartalom és tekintély kell.
Javaslat: Google Search Console + Analytics bekötése, saját domain, valós ügyfél-esettanulmányok,
Google Business Profile Tatabányára, és 2–4 blogbejegyzés a kulcsszavakra
(pl. „weboldal készítés ár", „webfejlesztő Magyarország").

---

## Teljesítmény — mért eredmények

Lighthouse (lokális, `next start`, 2026-10):

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| **Desktop** | **100** | **100** | **100** | **100** |
| **Mobile** (szimulált lassú 4G + 4× CPU) | **96–99** | **100** | **100** | **100** |

Fő metrikák mobilon: FCP ≈ 0,9–1,2 s · LCP ≈ 2,6–2,8 s · **TBT ≈ 30–100 ms** · **CLS = 0**.
Valós (nem szimulált) mobil trace-en az LCP a first paint-tel egy időben, ≈ 1,6 s.

Amit ezért tettünk:

- Két részhalmazolt változó betűtípus (`bricolage-var.woff2` 26 KB, `inter-var.woff2` 29 KB) — a korábbi 240 KB helyett,
  metrikára illesztett fallbackkel (`size-adjust` / `ascent-override`), így a betűcsere **nulla layout shift**.
- Hero, marquee, szolgáltatások, munkák, folyamat, rólunk, GYIK: **szerverkomponens**.
  Kliens-oldali JS csak ott, ahol interakció van (menü, szűrők, accordion, űrlap, nyelvváltó, gömb).
  Főoldal első betöltés: **132 kB JS** (ebből 103 kB közös React/Next alap).
- `content-visibility: auto` a hajtás alatti szekciókon; erős effektek (blend mode) kikapcsolva mobilon.
- WebP textúra + 14 KB-os poszter, `next/image` AVIF/WebP, lusta betöltés, cache header-ek.
- Csak látható fülön renderelő 3D, alacsony DPR, adaptív minőség.

---

## API-k

| Végpont | Metódus | Mit csinál |
|---|---|---|
| `/api/contact` | `POST` | Kapcsolatfelvétel: Zod-validáció, honeypot + heurisztikus spam-szűrés, IP-alapú rate limit (5 / 10 perc). `RESEND_API_KEY` esetén e-mailt küld (Resend), kulcs nélkül `.data/contact-inbox.jsonl`-be ment, hogy semmi ne vesszen el. |
| `/api/projects` | `GET` | Portfólió JSON (`?locale=hu&category=Weboldal`), edge cache header-ekkel. Később CMS-re köthető változatlan válaszformával. |
| `/api/health` | `GET` | Uptime-próba (`{ ok, version, uptimeSeconds }`). |
| `/api/revalidate` | `POST` | On-demand ISR: `{ secret, path? }` — CMS webhookból azonnali újragenerálás deploy nélkül. |

E-mail beállítása (Resend, ingyenes tier elég):

```
RESEND_API_KEY="re_..."
CONTACT_TO_EMAIL="phinixwebsite@gmail.com"
CONTACT_FROM_EMAIL="PHINIX <no-reply@phinix.hu>"
CONTACT_TO_EMAIL="phinixwebsite@gmail.com"
```

Ha később Upstash/Vercel KV-re váltasz, a rate limit cseréje egyetlen függvény
(`src/app/api/contact/route.ts` → `rateLimited`).

---

## Analitika és adatvédelem

- Alapból **nulla harmadik féltől származó kérés** és nulla süti.
- `NEXT_PUBLIC_GA_ID` megadása esetén megjelenik egy hozzájárulás-kérő sáv; a GA **csak elfogadás után**
  töltődik be, anonimizált IP-vel. „Csak lényeges" gombnál semmi sem töltődik.
- Az adatvédelmi és impresszum oldalak sablonszövegekkel készültek (jelölve) — élesítés előtt
  jogásszal érdemes átnézetni, és a cégadatokat kitölteni.

---

## Reszponzivitás és akadálymentesség

- Tesztelt szélességek: **320, 360, 390, 412, 768, 820, 1024, 1280, 1440, 1920+** — nincs vízszintes
  túlcsordulás egyetlen nézetben sem (`overflow-x: clip` + flexbox `min-width: 0` javítások).
- Folyékony tipográfia `clamp()`-pel; a töréspontok tartalomvezéreltek.
- Billentyűzet: skip link első tab-stop, látható fókuszgyűrű, Escape zárja a mobil menüt,
  accordion `aria-expanded` + `aria-controls`, űrlaphibák `role="alert"`/`aria-describedby`.
- Kontraszt: minden szöveg AA (a Lighthouse accessibility 100 ennek a kontrollja).
- `prefers-reduced-motion` és `forced-colors` kezelés, nyomtatási stíluslap.

---

## Projekt felépítés

```
phinix/
├─ public/
│  ├─ fonts/            bricolage-var.woff2, inter-var.woff2 (részhalmazolt)
│  ├─ textures/         earth-landmap.webp, globe-poster.webp, earth-dots.png
│  ├─ covers/           projekt-borítók (jpg + webp + avif)
│  ├─ og/               og-hu.png, og-en.png (buildkor generált)
│  └─ icon.svg, favicon.ico, icon-192/512.png, apple-icon.png
├─ src/
│  ├─ app/
│  │  ├─ [locale]/      layout (metadata, hreflang), page (főoldal), privacy, impresszum, not-found
│  │  ├─ api/           contact, projects, health, revalidate
│  │  ├─ robots.ts, sitemap.ts, manifest.ts
│  ├─ components/       Header, Hero, HeroGlobe, Globe, GlobeFallback, Sections, FaqAccordion,
│  │                    WorkFilters, Contact, Footer, LanguageSwitcher, Analytics, Reveal, Icons, Logo, JsonLd
│  ├─ config/site.ts    márka + elérhetőségek
│  ├─ data/             dictionary.ts (HU/EN szövegek), projects.ts, atlas.json (gömb-pontok)
│  ├─ lib/              i18n.ts, seo.ts, validation.ts (Zod), hooks.ts
│  ├─ styles/globals.css  teljes design system (tokenek → komponensek)
│  └─ middleware.ts     nyelvi átirányítás
├─ tools/               make_textures.py, make_og.mjs, shots.mjs, interact.mjs, lighthous-probák
└─ next.config.ts       security headerek, kép- és cache-beállítások
```

---

## Design rendszer

- **Irányvonal**: „atelier kartográfia" — grafit éjszaka, meleg porcelán, parázs-narancs akcentus.
- **Betűk**: Bricolage Grotesque (display, 200–800) + Inter (UI, 100–900), mindkettő változó.
- **Tokenek**: `--ink`, `--paper`, `--ember`, `--gold`, rádiuszok, árnyékok, easing-ek
  (`src/styles/globals.css` elején) — egy helyen hangolható.
- **Embléma**: saját főnix a négyzetes glóbuszon (SVG, 16 px-től 320 px-ig éles).
- Nincs CSS framework, nincs UI-könyvtár: ~11 KB tömörített CSS, nulla el nem használt osztály.

---

## Ellenőrző szkriptek

```bash
npm run typecheck                # TypeScript
node tools/shots.mjs             # 5 nézet + console-hibák + vízszintes túlcsordulás
node tools/interact.mjs          # 3D, szűrő, accordion, nyelvváltó, űrlap, mobil menü (Playwright)
npx lighthouse http://localhost:3000/hu --preset=desktop
```

---

## Élesítés (deploy) — 3 lépés

1. **Domain**: `NEXT_PUBLIC_SITE_URL=https://phinix.hu` a hosting env változói között
   (ez kerül a canonical/hreflang/sitemap/JSON-LD címekbe).
2. **Hosting**: Vercel a legkevesebb munkával (Next 15 natív támogatás), de Node-hosting is jó
   (`npm run build && npm start`). A `/api/contact`-hez kell a `RESEND_API_KEY`.
3. **Search Console + Analytics**: tulajdonjog igazolás, sitemap beküldése
   (`https://phinix.hu/sitemap.xml`), GA ID beállítása.

Élesítés után érdemes: valós ügyfélmunkák és vélemények (review schema), blog szekció a kulcsszavakra,
Google Business Profile, és 1–2 backlink helyi szakmai oldalakról.


## Referencia-munkák feltöltése

A Munkák szekció **most üres** — ez szándékos, nem hiba. Amíg nincs feltöltött
munka, a szekció egy kész megjelenésű „hamarosan" blokkot mutat (nem üres
kártyarácsot), a `/api/projects` pedig üres listát ad.

Egy munka felvétele 2 lépés:

1. **Borító:** `public/covers/<slug>.webp` — 1600×1100 px, ~150 kB, WebP.
2. **Adatok:** `content/projects.json` → a `"projects"` tömbbe egy blokk
   (a fájlban van egy kikommentelt minta, csak át kell másolni):

```json
{
  "slug": "pelda-ceg",
  "client": "Példa Kft.",
  "title": { "hu": "Amit a weboldal hozott", "en": "What the website brought" },
  "category": { "hu": "Vállalati weboldal", "en": "Corporate website" },
  "year": "2026",
  "result": { "hu": "+38% ajánlatkérés 3 hónap alatt", "en": "+38% enquiries in 3 months" },
  "desc": { "hu": "Egyedi dizájn, gyors betöltés.", "en": "Custom design, fast loading." },
  "tags": ["Next.js", "SEO", "Design"],
  "cover": "/covers/pelda-ceg.webp",
  "showcase": false
}
```

A `showcase: false` azt jelenti, hogy **valós ügyfélmunka** (nincs „bemutató"
jelzés a kártyán). Élesítés: `npm run build`. Fejlesztés közben a mentés elég.

A szűrők (`Mind`, kategóriák), a kártyarács, a borítók optimalizálása és az API
automatikusan követi a lista hosszát — nem kell máshol módosítani semmit.

## Elérhetőségek és e-mail működés

| Mi | Érték | Hol módosítható |
| --- | --- | --- |
| E-mail | `phinixwebsite@gmail.com` | `src/config/site.ts` → `email` |
| Telefon | `+36 20 548 2486` | `src/config/site.ts` → `phone` / `phoneHref` |
| Helyszín | Magyarország | `src/config/site.ts` → `location` |

Az **Ajánlatkérés űrlap minden üzenete** a fenti postafiókba megy. A levél
`Reply-To`-ja a látogató címe, tehát a Gmailban a **Válasz** gomb egyből neki
címez. A látogató ezen kívül automatikus visszaigazolást is kap.

### Hogyan legyen tényleg kézbesítve (Gmail, kb. 2 perc)

1. Google-fiók → **Biztonság** → **2 lépcsős azonosítás** bekapcsolása.
2. **Alkalmazásjelszavak** → új jelszó (**Mail**) → másold ki a 16 jegyű kódot.
3. `.env.local`:
   ```bash
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="465"
   SMTP_USER="phinixwebsite@gmail.com"
   SMTP_PASS="a 16 jegyű alkalmazásjelszó"
   CONTACT_TO_EMAIL="phinixwebsite@gmail.com"
   ```
4. Teszt: `npm run mail:check` (bejelentkezés), majd `npm run mail:test` (valódi levél).

> A fiók **sima jelszava nem működik** — a Google SMTP-hez csak a 16 jegyű
> alkalmazásjelszót fogadja el (`535 BadCredentials`).

Amíg a `SMTP_PASS` üres, az űrlap **nem veszik el**: a beküldött üzenetek a
`.data/contact-inbox.jsonl` fájlba íródnak (a látogató ugyanúgy sikert lát).
Resend is használható helyette (`RESEND_API_KEY`), de ahhoz hitelesített
küldődomain kell.

> A napi 500 Gmail-küldés bőven elég egy stúdió forgalmához. Ha később
> tranzakciós szolgáltatóra váltasz (Brevo, Resend, SES), csak a fenti
> környezeti változók cserélődnek — a kód nem.
