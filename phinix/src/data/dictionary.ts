/**
 * All copy for the landing page and global chrome, in both languages.
 * Keeping it in one typed module means: no i18n runtime cost, fully static
 * rendering, and every string is crawlable in the initial HTML.
 */

const hu = {
  meta: {
    home: {
      title: 'Webfejlesztő stúdió — egyedi weboldal, webshop és SEO | PHINIX',
      description:
        'PHINIX webfejlesztő stúdió: egyedi, villámgyors és keresőoptimalizált weboldalak, webshopok és webalkalmazások React és Next.js alapokon. Ingyenes konzultáció, fix ár, mérhető eredmény.',
    },
    privacy: {
      title: 'Adatvédelmi tájékoztató | PHINIX',
      description:
        'Hogyan kezeli a PHINIX a személyes adatokat: milyen adatokat gyűjtünk, miért, meddig tároljuk, és milyen jogaid vannak.',
    },
    legal: {
      title: 'Impresszum | PHINIX',
      description: 'A PHINIX webfejlesztő stúdió impresszuma, elérhetőségei és nyilatkozatai.',
    },
    notFound: {
      title: 'Az oldal nem található | PHINIX',
      description: 'A keresett oldal nem létezik vagy elköltözött.',
    },
  },
  nav: {
    services: 'Szolgáltatások',
    work: 'Munkák',
    process: 'Folyamat',
    about: 'Rólunk',
    faq: 'GYIK',
    contact: 'Kapcsolat',
    cta: 'Ajánlatot kérek',
    menuOpen: 'Menü megnyitása',
    menuClose: 'Menü bezárása',
    skipToContent: 'Ugrás a tartalomra',
  },
  hero: {
    eyebrow: 'Webfejlesztő stúdió · Magyarország',
    titleA: 'Weboldal, ami a Google ',
    accent: 'élvonalába visz.',
    titleB: '',
    shortClaim: 'Weboldalak, amelyek a Google élvonalába visznek.',
    subtitle:
      'Egyedi, villámgyors és keresőoptimalizált weboldalak — stratégiától a forgalomig. React, Next.js és három dimenzióban gondolkodó dizájn, mérhető üzleti eredménnyel.',
    primaryCta: 'Kezdjük el a projektedet',
    secondaryCta: 'Munkáim megtekintése',
    scrollHint: 'Görgess',
    stats: [
      { value: '9+', label: 'év tapasztalat' },
      { value: '40+', label: 'leszállított projekt' },
      { value: '98+', label: 'átlag Lighthouse pont' },
      { value: '100%', label: 'egyedi dizájn' },
    ],
    globeBadge: 'Élőben, a világ minden pontján',
    globeCaption: '99,9% rendelkezésre állás · globális elérés',
    globeHint: 'Húzd el a földgömböt — vagy hagyd, hogy forogjon.',
  },
  marquee: {
    label: 'Technológiák, amelyekkel dolgozom',
    items: [
      'NEXT.JS',
      'REACT',
      'TYPESCRIPT',
      'THREE.JS',
      'NODE.JS',
      'POSTGRES',
      'SANITY',
      'STRIPE',
      'VERCEL',
      'CORE WEB VITALS',
    ],
  },
  services: {
    eyebrow: 'Szolgáltatások',
    title: 'Minden, ami a digitális jelenlétedhez kell.',
    intro:
      'Egy kézből: stratégia, dizájn, fejlesztés és keresőoptimalizálás. Nincs alvállalkozó, nincs elveszett információ — csak egy stúdió, ami végigviszi a projektet.',
    more: 'Részletek',
    items: [
      {
        id: 'web',
        title: 'Egyedi weboldal',
        desc: 'Bemutatkozó, céges és portfólióoldalak, amelyek a márkádat képviselik — nem sablonból, hanem nulláról tervezve.',
        bullets: ['Egyedi UX/UI dizájn', 'React + Next.js', '95+ Lighthouse pontszám'],
        eta: '3–6 hét',
      },
      {
        id: 'shop',
        title: 'Webshop',
        desc: 'Gyors, konverzióra tervezett webáruház: terméklapok, kosár, fizetés, szállítás és admin felület.',
        bullets: ['Stripe / Barion fizetés', 'Készletkezelés', 'Konverziós analitika'],
        eta: '5–9 hét',
      },
      {
        id: 'app',
        title: 'Webalkalmazás',
        desc: 'Egyedi belső rendszerek, ügyfélportálok és SaaS MVP-k React alapon — a folyamataidra szabva.',
        bullets: ['API-vezérelt architektúra', 'Szerepkör-alapú hozzáférés', 'Skálázható felhő hosting'],
        eta: '8+ hét',
      },
      {
        id: 'seo',
        title: 'SEO & tartalom',
        desc: 'Technikai SEO, tartalomstratégia és mérés: hogy ne csak szép legyen az oldal, hanem megtalálható is.',
        bullets: ['Technikai audit', 'Kulcsszó- és tartalomterv', 'Strukturált adatok (JSON-LD)'],
        eta: '2–4 hét',
      },
      {
        id: 'design',
        title: 'UX/UI & arculat',
        desc: 'Dizájnrendszer, logó és vizuális identitás — egységes megjelenés minden felületen, mobiltól a nagyképernyőig.',
        bullets: ['Design system', 'Prototípus', 'Reszponzív minden felbontásra'],
        eta: '2–5 hét',
      },
      {
        id: 'int',
        title: 'Integrációk & automatizáció',
        desc: 'Fizetés, foglalás, CRM, hírlevél, AI- és harmadik féls API-k — összekötve, hogy a rendszereid együtt lélegezzenek.',
        bullets: ['REST / GraphQL API-k', 'Fizetési és naptárintegráció', 'Automatizált munkafolyamatok'],
        eta: '1–4 hét',
      },
    ],
    bulletsLabel: 'Amit tartalmaz',
    etaLabel: 'Jellemző átfutás',
  },
  work: {
    eyebrow: 'Kiválasztott munkák',
    title: 'Munkák, amelyekre büszke vagyok.',
    intro:
      'Valós ügyfélmunkák, egyedi dizájnnal és mérhető eredménnyel. A portfólió most épül — az első referenciák hamarosan itt.',
    viewCase: 'Esettanulmány',
    placeholderBadge: 'Bemutató projekt',
    resultsLabel: 'Eredmény',
    allWork: 'Hamarosan: teljes portfólió',
    emptyEyebrow: 'Portfólió · feltöltés alatt',
    emptyTitle: 'Az első referencia-munkák hamarosan itt.',
    emptyText:
      'Új stúdióként most építem a portfóliót: a feltöltött munkák ide kerülnek, egyedi borítóval és mérhető eredménnyel. Addig is szívesen megmutatom, hogyan épül fel egy oldal — kérésre élő példát is mutatok.',
    emptyCta: 'Beszéljük meg a projektedet',
  },
  projects: [],
  process: {
    eyebrow: 'Folyamat',
    title: 'Öt lépés a gondolattól a működő oldalig.',
    intro:
      'Átlátható, kiszámítható folyamat — tudod, hol tartunk, mi jön következőként, és mi az, ami tőled kell. Nincs meglepetés, nincs csúszás.',
    items: [
      {
        title: 'Megismerés & audit',
        desc: 'Átbeszéljük a céljaidat, a közönségedet és a jelenlegi helyzetet. Ha van meglévő oldal, technikai és SEO-auditot készítek.',
        deliverables: ['Discovery workshop', 'Verseny- és SEO-audit'],
      },
      {
        title: 'Stratégia & információarchitektúra',
        desc: 'Felépítem az oldal vázát: oldalak, tartalom, felhasználói utak és mérési terv, ami az üzleti célt szolgálja.',
        deliverables: ['Sitemap', 'Tartalomterv', 'Mérési terv'],
      },
      {
        title: 'Dizájn',
        desc: 'Egyedi, a márkádhoz illő felület — először irányok, majd végleges design minden képernyőmérethez.',
        deliverables: ['Moodboard & irány', 'High-fidelity UI', 'Design system'],
      },
      {
        title: 'Fejlesztés',
        desc: 'Tiszta React és Next.js kód, kiemelt figyelemmel a sebességre, akadálymentességre és a keresőkre.',
        deliverables: ['Fejlesztés', 'SEO-alapok', 'Tesztelés eszközökön'],
      },
      {
        title: 'Indítás & növekedés',
        desc: 'Élesítés, Search Console és analitika beállítása, majd mérés és iteráció: az oldal a launch után kezd igazán dolgozni.',
        deliverables: ['Deploy', 'Analitika', 'Havi riport (opcionális)'],
      },
    ],
    stepLabel: 'Lépés',
  },
  about: {
    eyebrow: 'Rólunk',
    title: 'Kis stúdió. Nagy odafigyelés.',
    paragraphs: [
      'A PHINIX név a főnixből jön: a megújulásból. Hiszem, hogy egy jó weboldal nem csak megjelenik a neten — újjászüli a vállalkozásod digitális jelenlétét, és láthatóbbá teszi a munkádat, mint eddig bármi.',
      'Minden projektet személyesen viszek végig: a stratégiát, a dizájnt és a kódot is. Nincs üzenetekben eltűnő közvetítő, nincs sablon. Csak egy ember, aki komolyan veszi a vállalkozásodat — és egy stúdió, ami mögötte áll.',
    ],
    valuesTitle: 'Amiben hiszek',
    values: [
      {
        title: 'Kézműves minőség',
        desc: 'Minden pixel, minden sor kód szándékkal készül. Inkább kevesebb projekt, de mindegyik kiváló legyen.',
      },
      {
        title: 'Mérhető eredmény',
        desc: 'Látogatók, konverziók, sebesség — azt mérjük, ami számít, nem azt, ami jól néz ki a riportban.',
      },
      {
        title: 'Őszinte kommunikáció',
        desc: 'Nincs zsargon és nincs ígérgetés. Világos határidők, átlátható árak, valódi szakmai tanács.',
      },
      {
        title: 'Hosszú távú partnerség',
        desc: 'A launch nem a vége. Az oldalad velem együtt fejlődik, ahogy a vállalkozásod növekszik.',
      },
    ],
    facts: [
      { label: 'Alapítva', value: '2017' },
      { label: 'Munkavégzés', value: '100% távoli' },
      { label: 'Ügyfelek', value: 'HU · EU · globális' },
      { label: 'Válaszidő', value: '24 órán belül' },
    ],
    founderRole: 'Alapító & fejlesztő',
    founderNote:
      '„A legjobb projekt nem az, ami a legtöbbet hozza — hanem amelyre az ügyfél évekkel később is büszke.”',
  },
  faq: {
    eyebrow: 'GYIK',
    title: 'Gyakori kérdések.',
    intro: 'Amit a legtöbben kérdeznek, mielőtt belevágunk. Ha a tiéd nincs itt, írj — 24 órán belül válaszolok.',
    items: [
      {
        q: 'Mennyibe kerül egy weboldal?',
        a: 'Bemutatóoldal 450 000 Ft-tól, céges weboldal 890 000 Ft-tól, webshop 1 500 000 Ft-tól indul. Minden ajánlat fix árú, tételes és a projekt megkezdése előtt kapod meg — nincsenek utólagos meglepetések. A pontos ár az oldal méretétől, a funkcióktól és a tartalom mennyiségétől függ.',
      },
      {
        q: 'Mennyi idő alatt készül el az oldal?',
        a: 'Egy bemutatóoldal jellemzően 3–4 hét, egy céges weboldal 4–6 hét, egy webshop 5–9 hét. A határidőt a projekt elején rögzítjük, és a folyamat közben folyamatosan látod, hol tartunk.',
      },
      {
        q: 'Garantálod, hogy első lesz az oldalam a Google-ben?',
        a: 'Őszinte válasz: senki sem garantálhat konkrét első helyezést, és aki mégis ezt ígéri, az félrevezet. Amit garantálok: technikailag kifogástalan, gyors, strukturált adatokkal ellátott oldal, tiszta SEO-alapok, tartalomstratégia és mérés. Ez az a kombináció, amivel a legtöbb ügyfél 3–6 hónapon belül az első oldalra kerül.',
      },
      {
        q: 'Ki írja a tartalmat?',
        a: 'Az alap szövegstruktúrát és a SEO-kulcsszavakat én adom. A részletes tartalmat közösen véglegesítjük — ha kell, segítek megírni vagy lektorálni, hogy ne csak szép, hanem hatékony is legyen.',
      },
      {
        q: 'Átadod a kódot és a hozzáféréseket?',
        a: 'Igen, mindig. A projekt végén a teljes kód, a domain és minden fiók (hosting, Search Console, analitika) a tiéd lesz. Nem leszel hozzám kötve — bár a legtöbb ügyfél marad.',
      },
      {
        q: 'Mi van a launch után?',
        a: '30 nap teljes körű javítási garanciát adok. Utána választható havi karbantartási csomag: frissítések, biztonsági mentések, tartalomfrissítés és havi teljesítményriport.',
      },
      {
        q: 'Meglévő weboldalamat is optimalizálod?',
        a: 'Igen. Kezdünk egy technikai és SEO-audittal, majd javaslatot adok: elég-e az optimalizálás, vagy érdemes az oldalt újratervezni. A döntést közösen hozzuk meg, számokkal alátámasztva.',
      },
      {
        q: 'Nem Magyarországon élek — dolgozunk együtt?',
        a: 'Igen, a stúdió 100%-ban távolról dolgozik, magyar és angol nyelven. Európai és Európán kívüli ügyfelekkel is van tapasztalatom, az időzóna-különbség nem akadály.',
      },
    ],
  },
  cta: {
    eyebrow: 'Következő lépés',
    title: 'Készen állsz, hogy a Google is megtaláljon?',
    subtitle:
      'Egy 30 perces, ingyenes konzultáción átbeszéljük a céljaidat, és kapsz egy konkrét, járható tervet — kötelezettség nélkül.',
    button: 'Ingyenes konzultáció',
    secondary: 'Írj e-mailt',
  },
  contact: {
    eyebrow: 'Kapcsolat',
    title: 'Mesélj a projektedről.',
    intro:
      'Pár sor is elég: min dolgozol, mit szeretnél elérni, és mi a határidő. 24 órán belül válaszolok egy konkrét tervvel.',
    labels: {
      name: 'Név',
      email: 'E-mail',
      projectType: 'Projekt típusa',
      budget: 'Tervezett büdzsé',
      message: 'Üzenet',
      messagePlaceholder: 'Pár szó a projektedről, a célodról és arról, mire van szükséged…',
      consent: 'Elfogadom, hogy a PHINIX a megadott adataimat a megkeresésem megválaszolásához felhasználja.',
      consentLink: 'Adatvédelmi tájékoztató',
      submit: 'Üzenet küldése',
      sending: 'Küldés…',
      optional: 'nem kötelező',
      required: 'kötelező',
    },
    projectTypeOptions: [
      'Weboldal',
      'Webshop',
      'Webalkalmazás',
      'SEO / teljesítmény optimalizálás',
      'Újratervezés',
      'Egyéb',
    ],
    budgetOptions: [
      '450 000 Ft alatt',
      '450 000 – 900 000 Ft',
      '900 000 – 1 800 000 Ft',
      '1 800 000 Ft felett',
      'Még nem tudom',
    ],
    selectPlaceholder: 'Válassz…',
    successTitle: 'Megkaptam, köszönöm!',
    successText: 'Hamarosan jelentkezem e-mailben — addig is érdemes körbenézni a munkáim között.',
    successAgain: 'Új üzenet írása',
    errorTitle: 'Valami félrecsúszott.',
    errorText: 'Kérlek, próbáld újra, vagy írj közvetlenül e-mailben.',
    validation: {
      name: 'Kérlek, add meg a neved (legalább 2 karakter).',
      email: 'Kérlek, adj meg egy érvényes e-mail címet.',
      message: 'Írj legalább 10 karaktert a projektedről.',
      consent: 'Az üzenet küldéséhez el kell fogadnod az adatkezelést.',
      projectType: 'Válaszd ki a projekt típusát.',
    },
    directTitle: 'Vagy írj közvetlenül',
    emailLabel: 'E-mail',
    phoneLabel: 'Telefon',
    responseLabel: 'Válaszidő',
    locationLabel: 'Helyszín',
    availability: 'Jelenleg új projekteket vállalok',
    calm:
      'Nincs sales nyomás, nincs automatizált körlevél — a leveledet én olvasom, és én is válaszolok.',
  },
  footer: {
    blurb:
      'PHINIX — egyedi weboldalak és webalkalmazások, amelyek gyorsak, szépek és megtalálhatók. Készült React & Next.js alapokon.',
    columns: {
      explore: 'Felfedezés',
      contact: 'Kapcsolat',
      follow: 'Kövess',
    },
    legal: 'Minden jog fenntartva.',
    privacy: 'Adatvédelmi tájékoztató',
    impresszum: 'Impresszum',
    buildNote: 'Készült React & Next.js-szel · 100/100 Lighthouse',
    backToTop: 'Vissza a tetejére',
    languageLabel: 'Nyelv',
  },
  legal: {
    privacyTitle: 'Adatvédelmi tájékoztató',
    privacyUpdated: 'Utolsó frissítés: 2026. január',
    legalTitle: 'Impresszum',
    legalUpdated: 'Utolsó frissítés: 2026. január',
    backHome: 'Vissza a főoldalra',
    templateNote:
      'Megjegyzés: ez a szöveg sablon, amely a GDPR főbb pontjait követi. Élesítés előtt érdemes jogásszal ellenőriztetni, és a cégadatokat kitölteni.',
    privacySections: [
      {
        h: 'Ki kezeli az adataidat?',
        p: 'Az adatkezelő a PHINIX (a továbbiakban: „mi”), elérhetőség: phinixwebsite@gmail.com. A weboldal használatával kapcsolatos adatkezelésünk részleteit az alábbiakban foglaljuk össze.',
      },
      {
        h: 'Milyen adatokat gyűjtünk?',
        p: 'Kapcsolatfelvételkor a nevedet, e-mail címedet, opcionálisan a projekted típusát, büdzséjét és az üzenetedet. Szerveroldali naplókban a látogatás technikai adatai (IP-cím, böngésző, időpont) rövid ideig tárolódhatnak a biztonság érdekében.',
      },
      {
        h: 'Miért és meddig?',
        p: 'Az adatokat kizárólag a megkeresésed megválaszolására, ajánlatadásra használjuk, legfeljebb 24 hónapig, vagy amíg visszavonod a hozzájárulásodat. Jogalap: az érintett hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont).',
      },
      {
        h: 'Kinek adjuk át?',
        p: 'Adataidat nem adjuk el. Kizárólag tárhely- és e-mail-szolgáltatónk (adatfeldolgozó) férhet hozzá a szolgáltatás működtetéséhez szükséges mértékben, velük adatfeldolgozói szerződésünk van.',
      },
      {
        h: 'Jogaid',
        p: 'Bármikor kérheted az adataidhoz való hozzáférést, azok helyesbítését, törlését, az adatkezelés korlátozását, és tiltakozhatsz az adatkezelés ellen. Kérésedet a phinixwebsite@gmail.com címen tudod jelezni; panasszal a NAIH-hoz (Nemzeti Adatvédelmi és Információszabadság Hatóság) fordulhatsz.',
      },
      {
        h: 'Sütik',
        p: 'Ez az oldal alapértelmezés szerint nem használ marketingsütiket, és nem tölt be külső követőkódot. Analitika csak a hozzájárulásod után, anonimizáltan aktiválódik.',
      },
    ],
    legalSections: [
      {
        h: 'Üzemeltető',
        p: 'PHINIX Web Studio — weboldal- és webfejlesztés. Székhely: Magyarország. E-mail: phinixwebsite@gmail.com. Telefon: +36 20 548 2486.',
      },
      {
        h: 'Cégadatok',
        p: 'Adószám / nyilvántartási szám: [kitöltendő]. Kamarai tagság: [kitöltendő]. Tárhelyszolgáltató: [kitöltendő].',
      },
      {
        h: 'Szerzői jog',
        p: 'Az oldalon található tartalom, arculat és kód a PHINIX tulajdona. Az itt bemutatott ügyfélprojektek esettanulmányként, az érintett felek engedélyével szerepelnek.',
      },
    ],
  },
  notFound: {
    code: '404',
    title: 'Ez az oldal eltévedt.',
    text: 'A keresett tartalom nem létezik, elköltözött, vagy még el sem készült. De a főoldalon minden a helyén van.',
    home: 'Vissza a főoldalra',
    contact: 'Kapcsolatfelvétel',
  },
  a11y: {
    switchLanguage: 'Nyelv váltása',
    currentLanguage: 'Jelenlegi nyelv',
    externalLink: 'külső hivatkozás',
  },
} as const

const en = {
  meta: {
    home: {
      title: 'Web development studio — custom websites, shops & SEO | PHINIX',
      description:
        'PHINIX is a web development studio crafting custom, blazing-fast and search-optimised websites, shops and web apps with React and Next.js. Free consultation, fixed pricing, measurable results.',
    },
    privacy: {
      title: 'Privacy policy | PHINIX',
      description:
        'How PHINIX handles personal data: what we collect, why, how long we keep it, and what your rights are.',
    },
    legal: {
      title: 'Imprint | PHINIX',
      description: 'Imprint, contact details and legal statements of the PHINIX web studio.',
    },
    notFound: {
      title: 'Page not found | PHINIX',
      description: 'The page you are looking for does not exist or has moved.',
    },
  },
  nav: {
    services: 'Services',
    work: 'Work',
    process: 'Process',
    about: 'About',
    faq: 'FAQ',
    contact: 'Contact',
    cta: 'Get a quote',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    skipToContent: 'Skip to content',
  },
  hero: {
    eyebrow: 'Web development studio · Hungary',
    titleA: 'Websites that put you at the ',
    accent: 'top of Google.',
    titleB: '',
    shortClaim: 'Websites that put you at the top of Google.',
    subtitle:
      'Custom, blazing-fast and search-optimised websites — from strategy to traffic. React, Next.js and design that thinks in three dimensions, with measurable business results.',
    primaryCta: 'Start your project',
    secondaryCta: 'See my work',
    scrollHint: 'Scroll',
    stats: [
      { value: '9+', label: 'years of experience' },
      { value: '40+', label: 'projects delivered' },
      { value: '98+', label: 'avg. Lighthouse score' },
      { value: '100%', label: 'custom design' },
    ],
    globeBadge: 'Live, anywhere on the planet',
    globeCaption: '99.9% uptime · global reach',
    globeHint: 'Drag the globe — or let it spin.',
  },
  marquee: {
    label: 'Technologies I work with',
    items: [
      'NEXT.JS',
      'REACT',
      'TYPESCRIPT',
      'THREE.JS',
      'NODE.JS',
      'POSTGRES',
      'SANITY',
      'STRIPE',
      'VERCEL',
      'CORE WEB VITALS',
    ],
  },
  services: {
    eyebrow: 'Services',
    title: 'Everything your digital presence needs.',
    intro:
      'One pair of hands: strategy, design, development and search optimisation. No subcontractors, no lost information — just one studio seeing the project through.',
    more: 'Details',
    items: [
      {
        id: 'web',
        title: 'Custom website',
        desc: 'Presentation, corporate and portfolio sites that represent your brand — designed from zero, never from a template.',
        bullets: ['Custom UX/UI design', 'React + Next.js', '95+ Lighthouse score'],
        eta: '3–6 weeks',
      },
      {
        id: 'shop',
        title: 'Online store',
        desc: 'A fast, conversion-focused shop: product pages, cart, payments, shipping and an admin dashboard.',
        bullets: ['Stripe / Barion payments', 'Inventory management', 'Conversion analytics'],
        eta: '5–9 weeks',
      },
      {
        id: 'app',
        title: 'Web application',
        desc: 'Custom internal tools, client portals and SaaS MVPs built with React — tailored to your workflows.',
        bullets: ['API-driven architecture', 'Role-based access', 'Scalable cloud hosting'],
        eta: '8+ weeks',
      },
      {
        id: 'seo',
        title: 'SEO & content',
        desc: 'Technical SEO, content strategy and measurement: so your site is not just beautiful, but findable.',
        bullets: ['Technical audit', 'Keyword & content plan', 'Structured data (JSON-LD)'],
        eta: '2–4 weeks',
      },
      {
        id: 'design',
        title: 'UX/UI & brand',
        desc: 'Design systems, logos and visual identity — one consistent look across every surface, from phone to widescreen.',
        bullets: ['Design system', 'Prototype', 'Responsive at every resolution'],
        eta: '2–5 weeks',
      },
      {
        id: 'int',
        title: 'Integrations & automation',
        desc: 'Payments, booking, CRM, newsletters, AI and third-party APIs — connected so your systems breathe together.',
        bullets: ['REST / GraphQL APIs', 'Payment & calendar integrations', 'Automated workflows'],
        eta: '1–4 weeks',
      },
    ],
    bulletsLabel: 'What’s included',
    etaLabel: 'Typical timeline',
  },
  work: {
    eyebrow: 'Selected work',
    title: 'Work I am proud of.',
    intro:
      'Real client work, custom design and measurable results. The portfolio is being built right now — the first case studies land here soon.',
    viewCase: 'Case study',
    placeholderBadge: 'Showcase project',
    resultsLabel: 'Result',
    allWork: 'Coming soon: the full portfolio',
    emptyEyebrow: 'Portfolio · being filled',
    emptyTitle: 'The first client work lands here soon.',
    emptyText:
      'As a new studio I am building the portfolio right now: uploaded work appears here, with a custom cover and a measurable result. Until then I am happy to walk you through how a site is built — I can show a live example on request.',
    emptyCta: "Let's talk about your project",
  },
  projects: [],
  process: {
    eyebrow: 'Process',
    title: 'Five steps from idea to a working website.',
    intro:
      'A transparent, predictable process — you always know where we are, what comes next and what we need from you. No surprises, no delays.',
    items: [
      {
        title: 'Discovery & audit',
        desc: 'We talk through your goals, audience and current situation. If you have an existing site, I run a technical and SEO audit.',
        deliverables: ['Discovery workshop', 'Competitor & SEO audit'],
      },
      {
        title: 'Strategy & information architecture',
        desc: 'I build the skeleton: pages, content, user journeys and a measurement plan that serves the business goal.',
        deliverables: ['Sitemap', 'Content plan', 'Measurement plan'],
      },
      {
        title: 'Design',
        desc: 'A custom interface that fits your brand — first directions, then final designs for every screen size.',
        deliverables: ['Moodboard & direction', 'High-fidelity UI', 'Design system'],
      },
      {
        title: 'Development',
        desc: 'Clean React and Next.js code, with speed, accessibility and search engines front of mind.',
        deliverables: ['Build', 'SEO foundations', 'Cross-device testing'],
      },
      {
        title: 'Launch & growth',
        desc: 'Go live, set up Search Console and analytics, then measure and iterate: the site starts really working after launch.',
        deliverables: ['Deploy', 'Analytics', 'Monthly report (optional)'],
      },
    ],
    stepLabel: 'Step',
  },
  about: {
    eyebrow: 'About',
    title: 'A small studio. Total focus.',
    paragraphs: [
      'The name PHINIX comes from the phoenix: rebirth. I believe a great website does more than exist online — it renews your business’s digital presence and makes your work more visible than ever before.',
      'I personally take every project from start to finish: strategy, design and code. No middleman lost in message threads, no templates. Just one person who takes your business seriously — and a studio standing behind them.',
    ],
    valuesTitle: 'What I believe in',
    values: [
      {
        title: 'Craftsmanship',
        desc: 'Every pixel and every line of code is made with intent. Fewer projects, each of them excellent.',
      },
      {
        title: 'Measurable results',
        desc: 'Visitors, conversions, speed — we measure what matters, not what looks good in a report.',
      },
      {
        title: 'Honest communication',
        desc: 'No jargon, no overpromising. Clear deadlines, transparent pricing, real professional advice.',
      },
      {
        title: 'Long-term partnership',
        desc: 'Launch is not the end. Your site evolves with me as your business grows.',
      },
    ],
    facts: [
      { label: 'Founded', value: '2017' },
      { label: 'Working style', value: '100% remote' },
      { label: 'Clients', value: 'HU · EU · global' },
      { label: 'Response time', value: 'within 24 hours' },
    ],
    founderRole: 'Founder & developer',
    founderNote:
      '“The best project is not the one that earns the most — it’s the one the client is still proud of years later.”',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Frequently asked questions.',
    intro: 'What most people ask before we start. If yours is missing, write to me — I reply within 24 hours.',
    items: [
      {
        q: 'How much does a website cost?',
        a: 'Landing pages start at €1,200, corporate websites at €2,400 and online stores at €4,000. Every quote is fixed-price, itemised and delivered before the project starts — no surprises later. The exact price depends on the size of the site, features and the amount of content.',
      },
      {
        q: 'How long does it take?',
        a: 'A landing page usually takes 3–4 weeks, a corporate website 4–6 weeks and an online store 5–9 weeks. We lock the deadline at kickoff and you can see exactly where we are throughout the process.',
      },
      {
        q: 'Can you guarantee my site will rank first on Google?',
        a: 'Honest answer: nobody can guarantee a specific first position, and anyone who promises it is misleading you. What I do guarantee: a technically flawless, fast site with structured data, clean SEO foundations, a content strategy and measurement. That combination is what puts most clients on page one within 3–6 months.',
      },
      {
        q: 'Who writes the content?',
        a: 'I provide the content structure and SEO keywords. We finalise the detailed copy together — and I can help write or edit it so the site is not just beautiful but effective.',
      },
      {
        q: 'Do I own the code and the accounts?',
        a: 'Yes, always. At the end of the project the full codebase, domain and every account (hosting, Search Console, analytics) are yours. You are never locked in — though most clients stay.',
      },
      {
        q: 'What happens after launch?',
        a: 'I give a 30-day all-inclusive bug-fix warranty. After that, an optional monthly care plan covers updates, backups, content changes and a performance report.',
      },
      {
        q: 'Can you optimise my existing website?',
        a: 'Yes. We start with a technical and SEO audit, then I recommend whether optimisation is enough or a redesign is worth it. We decide together, backed by numbers.',
      },
      {
        q: 'I live outside Hungary — can we still work together?',
        a: 'Absolutely. The studio works 100% remotely in Hungarian and English, and I have experience with clients across and beyond Europe. Time zones are not a problem.',
      },
    ],
  },
  cta: {
    eyebrow: 'Next step',
    title: 'Ready to be found on Google?',
    subtitle:
      'On a free 30-minute call we go through your goals and you get a concrete, workable plan — with no obligation.',
    button: 'Free consultation',
    secondary: 'Send an email',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Tell me about your project.',
    intro:
      'A few lines are enough: what you’re working on, what you want to achieve and your deadline. I reply within 24 hours with a concrete plan.',
    labels: {
      name: 'Name',
      email: 'Email',
      projectType: 'Project type',
      budget: 'Planned budget',
      message: 'Message',
      messagePlaceholder: 'A few words about your project, your goal and what you need…',
      consent: 'I agree that PHINIX may use the details I provide to respond to my enquiry.',
      consentLink: 'Privacy policy',
      submit: 'Send message',
      sending: 'Sending…',
      optional: 'optional',
      required: 'required',
    },
    projectTypeOptions: [
      'Website',
      'Online store',
      'Web application',
      'SEO / performance optimisation',
      'Redesign',
      'Other',
    ],
    budgetOptions: [
      'Under €1,200',
      '€1,200 – €2,400',
      '€2,400 – €4,800',
      'Over €4,800',
      'Not sure yet',
    ],
    selectPlaceholder: 'Choose…',
    successTitle: 'Got it — thank you!',
    successText: 'I’ll be in touch by email shortly. In the meantime, have a look around my work.',
    successAgain: 'Write another message',
    errorTitle: 'Something went wrong.',
    errorText: 'Please try again, or email me directly.',
    validation: {
      name: 'Please enter your name (at least 2 characters).',
      email: 'Please enter a valid email address.',
      message: 'Tell me at least 10 characters about your project.',
      consent: 'You need to accept the privacy policy to send a message.',
      projectType: 'Please choose a project type.',
    },
    directTitle: 'Or reach out directly',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    responseLabel: 'Response time',
    locationLabel: 'Location',
    availability: 'Currently taking on new projects',
    calm:
      'No sales pressure, no automated mailers — I read your message and I answer it myself.',
  },
  footer: {
    blurb:
      'PHINIX — custom websites and web apps that are fast, beautiful and findable. Built with React & Next.js.',
    columns: {
      explore: 'Explore',
      contact: 'Contact',
      follow: 'Follow',
    },
    legal: 'All rights reserved.',
    privacy: 'Privacy policy',
    impresszum: 'Imprint',
    buildNote: 'Built with React & Next.js · 100/100 Lighthouse',
    backToTop: 'Back to top',
    languageLabel: 'Language',
  },
  legal: {
    privacyTitle: 'Privacy policy',
    privacyUpdated: 'Last updated: January 2026',
    legalTitle: 'Imprint',
    legalUpdated: 'Last updated: January 2026',
    backHome: 'Back to home',
    templateNote:
      'Note: this text is a template covering the main GDPR points. Have it reviewed by a lawyer before going live and fill in the company details.',
    privacySections: [
      {
        h: 'Who processes your data?',
        p: 'The data controller is PHINIX (“we”), contact: phinixwebsite@gmail.com. Below is a summary of how we handle data in connection with this website.',
      },
      {
        h: 'What data do we collect?',
        p: 'When you contact us: your name, email address, optionally your project type, budget and your message. Server logs may briefly store technical data about your visit (IP address, browser, timestamp) for security purposes.',
      },
      {
        h: 'Why and for how long?',
        p: 'We use your data only to respond to your enquiry and prepare a quote, for a maximum of 24 months or until you withdraw consent. Legal basis: consent of the data subject (GDPR Art. 6(1)(a)).',
      },
      {
        h: 'Who do we share it with?',
        p: 'We never sell your data. Only our hosting and email providers (processors) access it to the extent needed to run the service, under data processing agreements.',
      },
      {
        h: 'Your rights',
        p: 'You may request access, rectification, erasure or restriction of your data at any time, and object to processing. Contact phinixwebsite@gmail.com; you may also lodge a complaint with the Hungarian Data Protection Authority (NAIH).',
      },
      {
        h: 'Cookies',
        p: 'By default this site uses no marketing cookies and loads no third-party trackers. Analytics only activates with your consent, in anonymised form.',
      },
    ],
    legalSections: [
      {
        h: 'Operator',
        p: 'PHINIX Web Studio — website design and development. Registered address: Hungary. Email: phinixwebsite@gmail.com. Phone: +36 20 548 2486.',
      },
      {
        h: 'Company details',
        p: 'Tax / registration number: [to be filled]. Chamber membership: [to be filled]. Hosting provider: [to be filled].',
      },
      {
        h: 'Copyright',
        p: 'All content, branding and code on this site are the property of PHINIX. Client projects are featured as case studies with the parties’ permission.',
      },
    ],
  },
  notFound: {
    code: '404',
    title: 'This page got lost.',
    text: 'The content you are looking for does not exist, has moved, or hasn’t been built yet. Everything else is right where it should be on the home page.',
    home: 'Back to home',
    contact: 'Get in touch',
  },
  a11y: {
    switchLanguage: 'Switch language',
    currentLanguage: 'Current language',
    externalLink: 'external link',
  },
} as const

export const dictionaries = { hu, en } as const
export type Dict = (typeof dictionaries)[keyof typeof dictionaries]
