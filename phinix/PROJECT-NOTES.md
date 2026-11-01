# PHINIX — átadási jegyzet (amit a fejlesztés során érdemes tudni)

## Mi történt, és miért

A cél egy **egyedi, prémium, kétnyelvű, SEO-első** weboldal volt, forgó 3D földgömbbel,
API-kkal, „a lehető legjobb" teljesítménnyel és reszponzivitással. Ezek a döntések születtek:

### 1. Stack: Next.js 15 + React 19 (nem sima CRA/Vite)
Indok: **szerverrenderelés** (a keresők és a közösségi botok teljes HTML-t kapnak), statikus
generálás, beépített kép-optimalizálás, és egyetlen projektben a frontend + az API végpontok.
A Next 16-ot szándékosan nem használtam — a stabil 15-ös LTS-szerű vonal kiszámíthatóbb.

### 2. Dizájn: „atelier kartográfia"
A mellékelt képen a földgömb volt a hívószó, ezért a **földrajz** lett a vizuális metafora:
- grafit éjszaka (nem fekete) + meleg porcelán + parázs-narancs akcentus,
- valós kontinens-geometria a gömbön **és** a borítókon,
- a főnix-embléma a négyzetes glóbuszon (a „PHINIX" név jelentése: újjászületés).

### 3. A gömb: saját shaderek, nem fizikai motor
`@react-three/fiber` helyett közvetlen Three.js — kisebb bundle, teljes kontroll, és a shaderek
(partvonal-glow, fresnel rim, atmoszféra, részecske-twinkle) olcsók GPU-n.

**A legfontosabb döntés:** a 3D **csak szándékra indul** (scroll/egér/kattintás/3,5 s után).
Amíg nem indul, egy 14 KB-os statikus poszter látszik. Emiatt:
- az LCP a szövegre esik (nem a vászonra),
- a kezdeti JS ~132 kB marad (a three.js külön chunk, később),
- mobilon nincs felesleges GPU-munka.

### 4. Teljesítmény: a mérés vezetett, nem a megérzés
Kiindulás → mobil 50 pont, TBT 10 750 ms (!).
A Lighthouse trace-t elemezve a valódi okok: (a) 1,7 MB-os PNG textúra, (b) az egész oldal
kliens-komponens volt, (c) késői betűtípus-csere tolta az LCP-t.

Javítások sorrendben: textúra → WebP + felezett felbontás (**1,7 MB → 238 KB**),
hero/szekciók szerverkomponenssé tétele (**JS 289 kB → 132 kB**), két részhalmazolt változó
betűtípus (**240 KB → 55 KB**) metrikára illesztett fallbackkel (**CLS 0,042 → 0**),
a renderer lusta indítása (**TBT 10 750 → 30–40 ms**), `content-visibility` a hajtás alatt.

Eredmény: **desktop 100/100/100/100**, **mobil 96–99/100/100/100** (CLS 0, TBT ~40 ms).

### 5. SEO: 100 pont, de a fogalmat tisztázni kell
A Lighthouse SEO 100 a **technikai** alap (crawlability, meta, strukturált adatok, mobilbarátság).
Ez nem garantál első helyezést — azt senki nem tudja garantálni. A rangsorhoz kell:
tartalom, tekintély (backlink), helyi jelenlét. A `README.md` „SEO" szekciója felsorolja,
mi van készen, és mi a következő 4 lépés.

FONTOS, ami beépült: a **GYIK szövege szó szerint egyezik** a `FAQPage` JSON-LD-vel (a Google
bünteti az eltérést), a `hreflang` minden oldalon ott van, a sitemap nyelvenkénti alternatívákat ad.

### 6. Akadálymentesség: 100 pont
Skip link első tab-stopként, fókuszgyűrű, Escape zárja a menüt, `aria-expanded`/`aria-controls`,
`role="alert"` hibák, AA kontraszt (a kezdeti 3,69:1 arányokat 4,5:1 fölé emeltem),
`prefers-reduced-motion` és `forced-colors` támogatás.

### 7. Reszponzivitás: valós eszközszélességeken tesztelve
320 / 360 / 390 / 412 / 768 / 820 / 1024 / 1280 / 1440 / 1920+. Két valódi hibát talált a teszt:
a fejléc 320 px-en túllógott, és az `overflow-x: hidden` mobilon nem vágta le (a látható
nézet 320 helyett 367 px lett). A gyökeret javítottam (`overflow-x: clip` + flex `min-width: 0`),
nem eldugtam a tünetet.

## Ami nyitva maradt / a te döntésed

1. **Valós cégadatok** az `impresszum` és `privacy` oldalakon (sablonok, jelölve).
2. **Saját munkák** a bemutató projektek helyére (`src/data/dictionary.ts` → `projects`).
3. **Domain + Resend kulcs** élesítéskor (`NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`).
4. Mobilon a szimulált LCP 2,7 s (valós mérés ~1,6 s). Ha még 1–2 pontot akarsz: a hero alcím
   helyett egy nagyobb vizuális LCP-elem (pl. a poszter gömb) segíthet — ez dizájn-döntés,
   szólj, és beállítom.

## Hogyan dolgozz tovább velem

- Új munkák megadása → átdolgozom a portfóliót (kártyák, szűrő, esettanulmány-oldalak).
- Blog / esettanulmány aloldalak (MDX) → nagy SEO-nyereség, van rá tiszta út a projektben.
- Foglalás (Cal.com) vagy Stripe → az integrációs hely már elő van készítve (`siteConfig.bookingUrl`).

---

## 2026-10-31 — logó + elérhetőségek

- **Logó:** a feltöltött JPG-ből vektorizált embléma (`tools/trace_logo.py` →
  `public/phinix-emblem.svg`, 20 kB, `fill-rule="evenodd"`, három réteg).
  Favicon (`favicon.svg` / `favicon.ico` / `favicon-32.png`), `icon-192/512.png`,
  `apple-icon.png` és a fejléc/lábléc emblémája mind ebből készül
  (`npm run assets:logo`). Az embléma `<img>`-ként megy (cache-elhető, kicsi DOM),
  a szó a „PHINIX" tipográfiai — írható, fordítható, kereshető.
- **Gömb elhelyezés javítva:** a statikus fallback poszter eddig egy *lapos
  térkép* volt körbe vágva (`object-fit: cover`), ezért óriás kontinensek és
  „vörös bolygó" lett belőle, a felirat pedig rálógott. Most
  `tools/make_poster.py` valódi **ortografikus gömbvetítéssel** rendereli
  ugyanazt a gömböt, ugyanazzal a kamerával (fov 38°, z 3.7, roll −0.18), így
  a WebGL beúszása láthatatlan. A `.globe-caption` a gömb **alá** került,
  fix magassággal fenntartva mobilon is.
- **3D gömb:** finomabb kontinens-maszk (smoothstep), visszafogottabb ember
  rim/atmosphere, kisebb partikulumok — nem „izzik" vörösen.
- **Elérhetőségek:** `phinixwebsite@gmail.com`, `+36 20 548 2486`, Magyarország
  (nincs város). A lábléc social linkjei üresen maradnak, amíg nincs profil.
- **Űrlap e-mail:** SMTP → Resend → helyi fájl sorrend, hibatűrő fallbackkel.
  `npm run mail:test` valódi kézbesítést ellenőriz.

Lighthouse (medián): desktop 100/100/100/100, mobil 95–98/100/100/100.

### 2026-10-31 (folytatás) — élő e-mail kézbesítés

- `SMTP_PASS` = Gmail **alkalmazásjelszó** (16 jegy). A fiók jelszava NEM működik
  SMTP-hez (a Google `535 BadCredentials`-szel utasítja el, IMAP-on is).
- Élő teszt: a `POST /api/contact` → Gmail SMTP → a levél megérkezett a
  `phinixwebsite@gmail.com` postafiókba (`[PHINIX] … — <név>`, Reply-To = látogató).
- Kézbesítési idő ~2,2 s (SMTP + auto-reply), ezért a `tools/interact.mjs`
  immár a `.form-success` elemre vár, nem fix timeoutra.
- **Auto-reply guard:** nem küldünk visszaigazolást nem létező címre
  (`example.com`, `test.*`, `invalid`, `mailinator`…), különben a bounce-ok
  (`Delivery Status Notification`) betemetik a stúdió postaládáját.
- Diagnosztika: `npm run mail:check`, éles küldés: `npm run mail:test`,
  levél-előnézet fogadó szerverrel: `tools/preview-mail.mjs` → `tools/email-preview/`.

### 2026-10-31 — spam-mappa probléma javítása

A látogatónak menő visszaigazolás eddig **csak sima szöveg** volt, HTML nélkül és
`Auto-Submitted` fejléc nélkül — ez a két leggyakoribb spam-jelzés. Javítás:

- `src/lib/email.ts` — új sablonok (stúdió + látogató), **multipart/alternative**
  (text + HTML együtt), táblázatos, inline stílusú HTML (minden levelezőben jó).
- A látogató levele szándékosan **rövid, személyes, link nélküli**: nincs kép,
  nincs nyomkövető pixel, nincs marketing-nyelv; tartalmazza a látogató saját
  üzenetét (bizonyíték arra, hogy valaszt kapott a saját kérésére).
- Fejlécek: `Auto-Submitted: auto-replied`, `X-Auto-Response-Suppress: All`.
- Megszólítás: `firstName()` — magyarul a **keresztnév** ("Kiss Péter" → "Péter"),
  angolul az első tag.
- A stúdió levél fejlécéből kikerült a nagy fekete sáv (kevésbé tűnik hirdetésnek).
- Bounce-védelem: nem létező címre (`example.com`, `test.*`…) nincs visszaigazolás.

Fájlok: `tools/capture-mails.mjs` (levél-elkapás + HTML előnézet),
`npm run mail:check`, `npm run mail:test`.

### 2026-10-31 — portfólió üresen, feltöltésre készen

A hat bemutató-projekt kikerült a megjelenítésből (nem valós ügyfélmunka).
Helyette:

- `content/projects.json` — a portfólió **egyetlen forrása**, most `"projects": []`.
  A fájlban egy kikommentelt, teljes minta mutatja a mezőket.
- `src/data/projects.ts` — a JSON-t olvassa, normalizálja a borító útvonalát,
  és exportálja a `hasProjects` kapcsolót.
- **Üres állapot:** ha a lista üres, a Munkák szekció egy kész megjelenésű
  „Portfólió · feltöltés alatt" blokkot mutat (saját CTA-kkal), a kategória-szűrők
  elrejtődnek, a `/api/projects` pedig `count: 0`-t ad — nincs üres rács,
  nincs törött kép, nincs hamis ígéret.
- A szekció szövegei (HU/EN) is ehhez igazodtak (`work.intro`, `work.empty*`).
- `tools/interact.mjs` mindkét állapotot kezeli: üres → az üres blokkra assertál,
  feltöltött → a szűrő működését ellenőrzi.
- Feltöltés: 1 WebP a `public/covers/` alá + 1 blokk a JSON-ba + `npm run build`.
  A kártyarács, a szűrők, a képoptimalizálás és az API automatikusan követi.
