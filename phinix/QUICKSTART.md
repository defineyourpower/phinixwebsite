# PHINIX — gyors útmutató (a lényeg egy oldalon)

## Indítás

```bash
cd phinix
npm install
npm run dev        # http://localhost:3000  →  /hu
```

## A 3 hely, amit módosítani fogsz

1. **`src/config/site.ts`** — domain, e-mail, telefon, város, social linkek.
2. **`src/data/dictionary.ts`** — minden szöveg, magyarul és angolul.
3. **`content/projects.json`** + `public/covers/` — a munkáid. A lista most **üres** (szándékosan): a Munkák szekció „hamarosan" állapotot mutat, amíg fel nem töltesz.

## A 4 API

- `POST /api/contact` — űrlap (validáció, spam-szűrés, rate limit, e-mail vagy helyi mentés)
- `GET  /api/projects` — portfólió JSON
- `GET  /api/health` — uptime
- `POST /api/revalidate` — CMS webhookból azonnali újragenerálás

## Mért eredmények

| | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 |
| Mobile (lassú 4G, 4× CPU) | 96–99 | 100 | 100 | 100 |

CLS = 0 · TBT = 30–100 ms · FCP ≈ 1 s · LCP ≈ 2,6 s (szimulált), ~1,6 s valós mobilon.

## Szükséges env változók (mind opcionális, kivéve az elsőt élesben)

```
NEXT_PUBLIC_SITE_URL="https://phinix.hu"
RESEND_API_KEY=""            # e-mail küldéshez
CONTACT_TO_EMAIL="phinixwebsite@gmail.com"
NEXT_PUBLIC_GA_ID=""         # analitika csak hozzájárulás után
REVALIDATE_SECRET="..."      # /api/revalidate-höz
```

## Amit még tegyél meg élesítéskor

- Töltsd ki a valós cégadatokat (`impresszum`, adatvédelmi sablon) — jogásszal egyeztetve.
- Cseréld le a bemutató projekteket a saját munkáidra.
- Search Console: sitemap beküldése (`/sitemap.xml`).
- Google Business Profile (Magyarország) + 2–3 releváns backlink.

Részletes dokumentáció: **README.md**
