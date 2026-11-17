# MASTER BUILD PROMPT — Lexium Consulting Website (MERN, local, CachyOS)

> Paste this whole file into your AI coding agent (Claude Code or similar) at the root of an empty project folder. It is self-contained. The source of truth is the document **"Lexium — Website Information Architecture and Developer Wireframe" (dated 21 October 2026)**. Every page, section order, headline, label, colour, font, rule and behaviour below comes from that document. Where the document gives the exact wording, use it **character for character**. Do not add sections, rename labels, reorder content or "improve" the copy.

---

## 0. ROLE, GOAL AND GROUND RULES

You are a senior full-stack engineer and front-end designer. Build the complete redesigned **Lexium Consulting** website as a **local MERN application** (MongoDB, Express, React, Node) running on **CachyOS (Arch-based Linux)**. You have permission to install every system package, npm package, font and tool listed here (and anything else you genuinely need), and to download free stock images.

**Build objective (from the document):** Create an international consulting website that positions Lexium at the intersection of strategy, regulated markets, manufacturing, transactions and capital.

**Primary audience:** Promoters, CEOs, boards, investors and international businesses seeking India or global growth in healthcare and regulated consumer sectors.

**Design direction:** Editorial, confident and minimal. White space, strong typography, restrained imagery, Lexium orange and grey, and selective deep navy for contrast.

**Developer outcome:** A responsive, CMS-driven, fast and conversion-oriented site with reusable page components and clearly measurable enquiry journeys.

**Core positioning statement (use on Home meta, footer positioning line source, About):**
"Lexium helps ambitious healthcare and regulated consumer businesses move from opportunity to execution—through strategy, market entry, regulation, manufacturing, mergers and acquisitions, and capital advisory."

### Non-negotiable rules
1. **Exact wording.** Every headline, CTA, tab label, list item, section label and disclaimer listed in Section 9 (Content Appendix) must be reproduced exactly, including punctuation such as the em dash (—), arrows (→) and the CTA arrow (↗).
2. **No pharmaceuticals.** Pharmaceuticals are excluded from Lexium's industry positioning (Nexiom owns that). Never add a pharma industry page, card, filter or keyword.
3. **Naming.** Use "Mergers and Acquisitions" (not "Transactions") and "Fundraising and IPO Advisory" (never the single word "Capital" in primary navigation). "M&A" and "Capital" are allowed only where the document itself uses them (Insights filters, CRM tags, sub-labels).
4. **Logo.** Use the latest approved lowercase Lexium wordmark (orange x and orange dot on the i). **Do not recreate, redraw, trace or substitute the logo.** Build a `<Logo />` component that loads `/client/public/brand/lexium-logo.svg` (plus `lexium-logo-white.svg` for dark backgrounds). Until the real files are dropped in, render a neutral grey dashed box with the text "LOGO — supply approved SVG" so it is obvious. Do NOT generate a lookalike.
5. **No invented claims.** Do not invent client names, quantified results, statistics, office locations, team members or credentials. Numbers appear only where the document provides them (30+ years, 1000+ project exposure, 50+ countries — phrased as leadership experience) or where a source and date can be shown.
6. **Missing copy.** Where the document gives only a structure (e.g. "50–70 word introduction"), write concise, plain-language copy that obeys the content limits in Section 5.6, uses the document's vocabulary, and is stored in the CMS with `status: "review"` and `copyOrigin: "drafted"` so Lexium can approve it. Copy given by the document is stored with `copyOrigin: "document"`.
7. **Original identity.** The design must be distinctive to Lexium and must not imitate the visual identity, proprietary layouts or language of another consulting firm.
8. **One connected platform.** "The website must feel like one connected consulting platform, not seven unrelated service brochures." Use reusable components, concise content and strong cross-linking (services ↔ industries ↔ insights).

---

## 1. ENVIRONMENT SETUP ON CACHYOS

CachyOS defaults to the **fish** shell. All scripts you write must be **bash** scripts with a `#!/usr/bin/env bash` shebang; run them with `bash script.sh`. Do not write fish-incompatible one-liners into the user's interactive instructions — prefer `bash -c '...'` when chaining.

### 1.1 System packages
```bash
sudo pacman -Syu --needed base-devel git curl wget unzip jq nodejs-lts-jod npm mkcert nss imagemagick libavif libwebp
# Node 22 LTS ("jod"). Verify: node -v (>= 22), npm -v
```
If `nodejs-lts-jod` is not available, install `fnm` (`sudo pacman -S fnm`) and run `fnm install 22 && fnm use 22`.

### 1.2 MongoDB (local) — from the AUR via paru (paru ships with CachyOS)
```bash
paru -S --needed mongodb-bin mongosh-bin mongodb-tools-bin
sudo systemctl enable --now mongodb
systemctl status mongodb --no-pager
mongosh --eval 'db.runCommand({ ping: 1 })'
```
Fallback if the AUR build fails: `sudo pacman -S docker docker-compose && sudo systemctl enable --now docker` and run `docker run -d --name lexium-mongo -p 27017:27017 -v lexium-mongo:/data/db mongo:8`.
Database name: **`lexium`**. Connection string: `mongodb://127.0.0.1:27017/lexium`.

### 1.3 Local email catcher (for enquiry routing tests)
```bash
paru -S --needed mailpit-bin   # or: docker run -d --name mailpit -p 8025:8025 -p 1025:1025 axllent/mailpit
```
SMTP on `127.0.0.1:1025`, web inbox on `http://127.0.0.1:8025`.

### 1.4 Local HTTPS (the document requires HTTPS)
```bash
mkcert -install
mkdir -p certs && mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 lexium.local
echo "127.0.0.1 lexium.local" | sudo tee -a /etc/hosts
```
The site must run at `https://lexium.local:5173` (dev) and `https://lexium.local:8443` (production build served by Express).

---

## 2. PROJECT STRUCTURE

npm workspaces monorepo:
```
lexium/
├─ package.json            (workspaces: client, server; scripts below)
├─ .env.example
├─ certs/                  (mkcert output, git-ignored)
├─ scripts/
│  ├─ fetch-images.sh      (downloads stock images, see §7)
│  ├─ optimise-images.mjs  (sharp → AVIF + WebP, responsive sizes)
│  ├─ seed.mjs             (seeds ALL content from §9)
│  ├─ backup.sh            (mongodump to ./backups/YYYY-MM-DD)
│  └─ restore.sh
├─ client/                 (React 19 + Vite)
│  ├─ public/brand/        (logo slot — real files supplied by Lexium)
│  ├─ public/images/       (optimised stock images)
│  └─ src/
│     ├─ styles/tokens.css
│     ├─ components/       (component library, §6)
│     ├─ templates/        (ServicePage, IndustryPage, ArticlePage…)
│     ├─ pages/            (route entries)
│     ├─ admin/            (CMS UI)
│     ├─ lib/analytics.js, lib/api.js, lib/consent.js
│     └─ content/image-credits.json
└─ server/                 (Node 22 + Express 5)
   └─ src/
      ├─ models/           (Mongoose schemas, §8)
      ├─ routes/           (public API, admin API, forms, events, seo)
      ├─ middleware/       (auth, validation, rate limit, bot control, redirects)
      ├─ jobs/             (node-cron: scheduled publishing)
      ├─ mail/             (nodemailer templates + lead routing)
      └─ seo/              (sitemap.xml, robots.txt, JSON-LD helpers)
```

Root scripts: `dev` (concurrently runs server + client), `build`, `start` (Express serves `client/dist` over HTTPS), `seed`, `images`, `test`, `test:e2e`, `test:a11y`, `lighthouse`, `backup`.

---

## 3. PACKAGES TO INSTALL

**Client**
- `react`, `react-dom`, `react-router-dom` (v7, data router)
- `vite`, `@vitejs/plugin-react`, `vite-plugin-mkcert` (or point Vite `server.https` at `/certs`)
- `tailwindcss` v4 + `@tailwindcss/vite` (tokens defined as CSS variables, §5)
- `@fontsource-variable/manrope`, `@fontsource-variable/inter`, `@fontsource-variable/source-serif-4` (self-hosted fonts — no Google Fonts CDN)
- `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-visually-hidden` (accessible primitives)
- `motion` (Framer Motion) — restrained, honours `prefers-reduced-motion`
- `react-simple-maps` + `world-atlas` (local TopoJSON for the region map; no tile servers)
- `react-hook-form`, `zod`, `@hookform/resolvers`
- `react-helmet-async` (title, meta, canonical, OG, JSON-LD)
- `@tanstack/react-query`
- `lucide-react` (thin-stroke icons only, used sparingly; `ArrowUpRight` for ↗, `ArrowRight` for →)
- Admin: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `react-easy-crop` (focal point picker), `date-fns`
- Dev: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`, `eslint`, `prettier`, `eslint-plugin-jsx-a11y`

**Server**
- `express` v5, `mongoose` v8, `dotenv`, `helmet`, `cors`, `compression`, `cookie-parser`, `express-rate-limit`, `zod`
- `argon2` (password hashing), `jsonwebtoken` (httpOnly cookie sessions)
- `multer` + `sharp` (image uploads → AVIF/WebP, responsive widths 480/768/1200/1600/2400)
- `nodemailer` (lead routing to Mailpit locally)
- `node-cron` (scheduled publishing every minute)
- `slugify`, `sanitize-html`, `reading-time`
- `sitemap` (XML sitemap generation)
- Dev: `nodemon`, `supertest`, `vitest`, `mongodb-memory-server`

---

## 4. ROUTES AND SITEMAP (exact URLs)

| Level | Page | URL |
|---|---|---|
| 1 | Home | `/` |
| 1 | What We Do | `/services/` |
| 2 | Strategy Consulting | `/services/strategy-consulting/` |
| 2 | India Market Entry | `/services/india-market-entry/` |
| 2 | Global Market Entry | `/services/global-market-entry/` |
| 2 | Regulatory and Licences | `/services/regulatory-licences/` |
| 2 | Manufacturing Advisory | `/services/manufacturing-advisory/` |
| 2 | Mergers and Acquisitions | `/services/mergers-acquisitions/` |
| 2 | Fundraising and IPO Advisory | `/services/fundraising-ipo-advisory/` |
| 1 | Industries | `/industries/` |
| 2 | Medical Devices and Diagnostics | `/industries/medical-devices-diagnostics/` |
| 2 | Healthcare and Digital Health | `/industries/healthcare-digital-health/` |
| 2 | Cosmetics and Personal Care | `/industries/cosmetics-personal-care/` |
| 2 | Food, Nutrition and Beverages | `/industries/food-nutrition-beverages/` |
| 2 | Consumer Health and Wellness | `/industries/consumer-health-wellness/` |
| 1 | Insights | `/insights/` (article detail: `/insights/:slug/`) |
| 1 | About Lexium | `/about/` |
| 1 | Contact | `/contact/` |

Also: `/privacy/`, `/terms/` (P1 — legal review required; mark content as placeholder awaiting legal), `/admin/*` (CMS, `noindex`), custom 404.
All URLs use trailing slashes; Express 301-redirects non-slash variants. Redirect rules stored in Mongo (`Redirect` collection) are applied server-side before the SPA fallback.

---

## 5. DESIGN SYSTEM (exact)

### 5.1 Colour tokens — `client/src/styles/tokens.css`
```css
:root {
  --lx-orange:   #F36F21; /* CTAs, active states, short emphasis and fine rules */
  --lx-navy:     #092744; /* Hero fields, footer and high-contrast sections */
  --lx-graphite: #243746; /* Body text and interface labels */
  --lx-midgrey:  #66717C; /* Secondary copy and metadata */
  --lx-palegrey: #F3F5F6; /* Section backgrounds and quiet cards */
  --lx-white:    #FFFFFF; /* Primary canvas and negative space */
}
```
Register these as Tailwind v4 theme colours (`@theme { --color-lx-orange: var(--lx-orange); … }`). No other brand colours. Derived tints only for hover/focus states and must be documented.

**Colour usage rules**
- Orange is for interaction and emphasis, **not** a large background on every screen. The orange CTA band is one of three CTA band variants, used sparingly.
- **Never** use orange for small body text on white without contrast validation. #F36F21 on white is ~3.0:1 — allowed only for large text (≥24 px, or ≥18.66 px bold), rules, icons and button fills with navy or white text that passes. Orange buttons use **navy text (#092744)** or white text only at sizes that pass; verify with axe.
- Navy is used selectively for contrast: dark hero fields, the footer, high-contrast sections and the primary header CTA (the document allows "CTA in deep navy or orange").

### 5.2 Typography
| Role | Font | Specification |
|---|---|---|
| Display | **Manrope Variable** (modern grotesk; Plus Jakarta Sans is the permitted alternative) | 52–96 px desktop, 42–58 px mobile; use `clamp()` |
| Body | **Inter Variable** | 18–20 px lead copy; 16–18 px body; minimum 14 px labels |
| Editorial accent | **Source Serif 4 Variable**, italic | One phrase only per page; never for regulatory or technical body copy |
| Numbers | Tabular figures | `font-variant-numeric: tabular-nums` for financial models, diagnostics and statistics |

Suggested scale: `--fs-display: clamp(2.625rem, 1.6rem + 3.6vw, 6rem)`; `--fs-h2: clamp(2rem, 1.4rem + 2vw, 3.5rem)`; `--fs-lead: clamp(1.125rem, 1rem + .3vw, 1.25rem)`; `--fs-body: clamp(1rem, .95rem + .2vw, 1.125rem)`; `--fs-label: .875rem`. Tight display tracking (−0.02em), line-height 1.05 for display, 1.6 for body.

### 5.3 Layout and surfaces
- 8 px spacing system (`--space-1: 8px` … multiples only).
- Maximum content width ≈ 1280–1440 px (`--container: 1360px`).
- Grids: desktop ≥1200 px 12 columns, generous margins, split-screen heroes where appropriate; tablet 768–1199 px 8 columns, two-column cards, simplified hero ratios; mobile 360–767 px single column, 20–24 px side padding, images cropped for meaning.
- Square or nearly square corners (`border-radius: 0` or `2px` max). Avoid excessive rounded cards.
- Do not wrap every paragraph in a box. Sections rely on typography, spacing and **fine rules** (1 px graphite at low opacity, or 2 px orange for emphasis).
- Section labels styled like the document: small uppercase eyebrow, letter-spaced, often with an orange number (e.g. "01", "SECTION 01" style).

### 5.4 Image direction
- One strong image per major page; one strong hero image per industry page, composed with clean negative space for copy.
- Prefer authentic products, facilities, laboratories, leadership and market environments over generic handshake imagery.
- Bright, precise and minimally styled. **No orange colour overlays on photographs.**
- Where multiple images appear together (e.g. industry cards), apply monochrome or subtle desaturation (`filter: grayscale(1)` → colour on hover/focus reveal, or `saturate(.6)`).
- Meaningful alt text on all content images; decorative images use `alt=""`.
- Strategy Consulting page: subtle charts or geometric visuals rather than multiple stock images.

### 5.5 Motion
Restrained motion: 200–400 ms transitions, soft reveal on first scroll, tab changes and deliberate hover states. Respect `prefers-reduced-motion` (disable reveals and transitions). No parallax. No autoplay background video.

### 5.6 Content limits (enforce in CMS validation and in seed copy)
| Element | Desktop | Mobile |
|---|---|---|
| Hero headline | Max 9–12 words; 2–3 lines | Max 4 lines |
| Hero introduction | Max 70 words | Max 55 words (store an optional `introMobile` field) |
| Capability summary | 40–60 words | 35–45 words (optional `summaryMobile`) |
| Card title | Max 6 words | Max 6 words |
| Card body | Max 35 words | Max 30 words |

The admin editor shows live word counts and blocks publish when a limit is exceeded.

---

## 6. COMPONENT LIBRARY (build each with all listed states)

| Component | Purpose | Key states |
|---|---|---|
| Global header | Navigation and primary CTA | Top, scrolled, mega-menu open, mobile drawer |
| Editorial hero | Page positioning | Light image, dark field (navy), split layout |
| Capability tabs | Reveal service detail | Default, active, hover, keyboard focus |
| Accordion | Regulatory and detailed content | Collapsed, expanded, deep-linked (`#hash` opens the item) |
| Industry card | Route to industry page | Default, hover, image reveal |
| Insight card | Article discovery | Featured, standard, compact related |
| Process steps | Show method or journey | Desktop horizontal, mobile vertical |
| Region selector | Market entry exploration | Selected region and keyboard focus |
| Diagnostic | Investor-readiness interaction | Question, progress, result, lead capture |
| CTA band | Conversion | Orange, navy and minimal white versions |
| Form | Qualified enquiry | Default, validation, loading, success, error |
| Footer | Navigation and trust | Desktop columns, mobile accordions |

Additional reusable pieces: `ServiceCard` (number 01–07, title, outcome line, three capabilities, "Explore service →" link), `StatementBlock` (large editorial statement / client question), `TensionList` (3–4 market tensions; numbers only with source + date), `EngagementCard` (situation, Lexium role, result type), `ChipList` (subsectors, audiences, mandate types), `Matrix` (market selection matrix), `DocumentStack` (stacked-file visual), `Disclaimer`, `ReviewedDate`, `Breadcrumbs`, `SkipLink`, `ConsentBanner`, `SEO`.

### 6.1 Global header (every page)
- Desktop 1440 px: `Logo | What We Do | Industries | Insights | About | Discuss your ambition ↗`
- Sticky after the first scroll. White background with subtle bottom rule. CTA in deep navy or orange.
- Becomes compact after approximately 80 px of scroll (reduce height, logo scales down, 200–300 ms transition).
- **Mega menu:** two-column services list, industries list, and one featured insight (pull latest featured Insight from the API). Opens on **click and keyboard focus, not hover only**. Closes with **Escape** and on outside click; focus returns to trigger.
- Current section and page must be visually indicated (orange 2 px underline + `aria-current="page"`).
- Do **not** place phone numbers in the primary navigation.
- Mobile 390 px: `Logo  Menu`, 64–72 px high. Drawer with accordion navigation; Services and Industries expand independently; each group includes **"View all"**; persistent contact action ("Discuss your ambition") inside the expanded drawer. Focus trapped in drawer, Escape closes.

### 6.2 Global footer (every page)
1. **LEXIUM** — short positioning line and primary enquiry email (`info@lexiumconsulting.com`).
2. **SERVICES | INDUSTRIES | COMPANY** — three compact link columns (Company = About, Leadership, Insights, Contact).
3. **INDIA | GLOBAL MARKETS** — office location (CMS field, placeholder "Approved office address — to be confirmed"), operating regions and contact details.
4. **LinkedIn | Privacy | Terms | Copyright** — final legal row (`© {currentYear} Lexium Consulting`).
Navy background, white/pale grey text, orange fine rule at top. Mobile: columns become accordions.

### 6.3 Mobile rules (all templates)
- Hero copy appears before decorative imagery when they cannot coexist clearly.
- Capability tabs become an accordion or an accessible horizontally scrollable tab list with clear affordance.
- No horizontal page scroll at 320 px viewport width.
- Touch targets at least 44 × 44 CSS px.
- Sticky elements must not obscure headings, form fields or anchor destinations (`scroll-margin-top` on all anchored sections).
- Forms use correct keyboard types (`type="email"`, `type="tel"`, `inputmode="numeric"`).
- Content priority: keep early — headline, outcome, CTA; capabilities and proof; contact path. Move lower — long methodology, related insights, detailed credentials. Remove or simplify — decorative motion, secondary background imagery, non-essential map labels.

---

## 7. FREE STOCK IMAGES

Source only from **Unsplash** (Unsplash License) and **Pexels** (Pexels License) — both free for commercial use without attribution, but record credits anyway in `client/src/content/image-credits.json` (`{ file, source, photographer, pageUrl, license, downloadedAt }`) and show them on an admin "Image credits" screen.

`scripts/fetch-images.sh`: use the Unsplash API (`UNSPLASH_ACCESS_KEY` in `.env`) and/or the Pexels API (`PEXELS_API_KEY`); if no keys are present, prompt the user to create free keys or to download the listed images manually into `client/public/images/raw/`. Then run `scripts/optimise-images.mjs` (sharp) to output AVIF + WebP at 480/768/1200/1600/2400 widths plus a mobile crop, and a 20 px blurred placeholder. Use `<picture>` with `srcset`/`sizes`, explicit `width`/`height`, `loading="lazy"` except the hero (`fetchpriority="high"`).

Selection criteria for every image: bright, precise, minimally styled, clean negative space for copy, no visible brand logos, no handshakes, no orange tint, no pharmaceutical pills/blister packs (keeps clear of Nexiom's position), not generic factory stock.

| Slot | Search terms | Notes |
|---|---|---|
| Home hero | "minimal architecture daylight", "modern office atrium white" | Restrained, abstract, copy space left |
| Services hub hero | "abstract geometric architecture white" | Or use a geometric SVG instead |
| Strategy Consulting | — | **No photo**: build a subtle SVG chart / geometric visual |
| India Market Entry | "Mumbai skyline daylight", "India business district" | Market environment |
| Global Market Entry | "container port aerial", "world map minimal" | |
| Regulatory and Licences | "laboratory documents quality inspection", "clean lab bench" | Subtle |
| Manufacturing Advisory | "cleanroom manufacturing", "medical device production line clean" | Clean, modern manufacturing |
| Mergers and Acquisitions | "boardroom table minimal", "glass building reflection" | No handshakes |
| Fundraising and IPO | "financial charts screen minimal", "stock exchange abstract" | |
| Medical Devices and Diagnostics | "medical device manufacturing", "diagnostic laboratory analyser" | Sophisticated device or diagnostic manufacturing |
| Healthcare and Digital Health | "digital health tablet clinician", "connected care monitoring" | Connected care or digital clinical workflow |
| Cosmetics and Personal Care | "unbranded skincare bottles laboratory", "cosmetic formulation science" | Unbranded premium skincare and formulation science, copy space |
| Food, Nutrition and Beverages | "functional beverage laboratory glass", "nutrition powder ingredients" | Functional beverage, nutrition format, ingredients and laboratory glass |
| Consumer Health and Wellness | "wellness products smartwatch", "self-care products minimal" | Wellness products, subtle connected-health device and science cues |
| 2–3 support images | "quality control inspection", "regulatory documentation" | For manufacturing/regulatory |
| 6 insight images | one per content pillar (§9.14) | Editorial |
| Leadership portrait | **Do not use stock.** | Neutral silhouette placeholder labelled "Current executive portrait — to be supplied" |

---

## 8. BACKEND, CMS AND DATA MODEL

### 8.1 Mongoose models (all have `status`, `seo`, timestamps, audit)
Common sub-schemas:
- `seo`: `{ title (50–60 chars, service/industry first, Lexium second), metaDescription (140–160 chars), canonical, ogImage, noindex }` — the admin shows a live Google-style SEO preview and social card preview.
- `image`: `{ src, alt, decorative:Boolean, focalPoint:{x,y}, credit }`.
- `workflow`: `status: 'draft'|'review'|'published'|'scheduled'|'archived'`, `approver` (named User), `approvedAt`, `publishAt`, `copyOrigin: 'document'|'drafted'`, `verificationRequired:Boolean`, `claimOwner`, `claimSource`.

| Model | Core fields | Relationships |
|---|---|---|
| Service | number (01–07), title, slug, eyebrow, hero{headline, intro, introMobile, image}, outcomeLine, threeCapabilities[3], clientQuestion(s), tensions[], capabilities[{title, outcome, summary, summaryMobile, deliverables[3–5]}], customSections[] (typed blocks for page-specific modules), methodology[4], engagements[3], ctaQuestion, disclaimers[], seo | industries[], insights[], people[] |
| Industry | title, slug, order, isAnchor, hero, proposition (one line), positioning, tensions, subsectors[], clientTypes[], decisions[], capabilityModules[], challenges[4], approach[4], customSections[], cta, seo | services[], insights[] |
| Insight | title, slug, category (Strategy/Markets/Regulation/Manufacturing/M&A/Capital/Industry), type (Article/Market perspective/Regulatory update/Founder viewpoint), standfirst, author, date, publishAt, body (TipTap JSON → sanitised HTML), keyTakeaways[3], image, sources[{label,url,date}], readingTime (auto), featured, seo | services[], industries[], author(Person) |
| Person | name, role, biography, image, linkedin, expertise[], experienceClaims[{text, claimOwner, source}] | insights[], services[] |
| Region | name, overview, capabilities[], status ('active'|'hidden'), verificationRequired, contactRoute, mapCodes[] | services[], insights[] |
| RegulatoryItem | jurisdiction, topic, summary, detail (expandable; form numbers live here), reviewedDate (**required**), disclaimer | regulatory page, insights[] |
| CaseJourney | title, situation, lexiumRole, resultType, approvalStatus | services[], industries[] |
| Enquiry | name, company, workEmail, phone?, country, industry, serviceInterest, message, consent, routedTo, crmTag, sourcePage, utm, createdAt | — |
| DiagnosticResult | answers (stored server-side only), score, band, email? (only if user opts in after summary), sourcePage | — |
| Event | name, params (no PII, no message text), page, sessionId (random, consent-gated), ts | — |
| Redirect | from, to, code (301/302) | — |
| SiteSettings | email, website, officeAddress, phone (footer/contact only), linkedin, footerPositioningLine, operatingRegions[] | — |
| User | name, email, passwordHash (argon2), role ('editor'|'approver'|'admin') | — |

### 8.2 Editorial controls (must work)
- Draft → review → publish workflow with **named approver** (only `approver`/`admin` roles can publish; approver name stored and shown in history).
- **Scheduled publishing for insights** (`node-cron` job each minute flips `scheduled` → `published` when `publishAt <= now`).
- **Mandatory reviewed date** for regulatory content (schema-level required; the page displays "Reviewed: {date}").
- SEO preview fields and social image fields.
- Image focal point (react-easy-crop picker → CSS `object-position`) and alternative text fields (alt required unless "decorative" ticked).
- Redirect management screen; when a slug changes, auto-create a 301 from the old URL.
- Admin dashboard: content needing review, items with `verificationRequired`, regulatory items whose reviewed date is older than 6 months, enquiries by CRM tag, analytics events and conversion counts.

### 8.3 API
Public (read-only, published content only): `GET /api/services`, `/api/services/:slug`, `/api/industries`, `/api/industries/:slug`, `/api/insights?category=&page=&limit=`, `/api/insights/:slug`, `/api/insights/related?service=&industry=&exclude=` (three dynamically selected articles by shared relationships, then recency), `/api/regions`, `/api/regulatory`, `/api/settings`.
Forms: `POST /api/enquiries`, `POST /api/diagnostic` (returns score + band + summary), `POST /api/diagnostic/:id/email`.
Analytics: `POST /api/events` (consent-gated, batched with `navigator.sendBeacon`).
SEO: `GET /sitemap.xml`, `GET /robots.txt` (disallow `/admin`).
Admin (JWT httpOnly cookie, CSRF token): full CRUD for every model, uploads, workflow actions.

### 8.4 Lead routing (exact)
| Form selection | Internal owner | Required CRM tag |
|---|---|---|
| Regulatory and Licences | Regulatory lead | REGULATORY |
| Manufacturing Advisory | Plant setup lead | MANUFACTURING |
| Market Entry | Strategy and markets lead | MARKET ENTRY |
| Mergers and Acquisitions | Transaction lead | M&A |
| Fundraising and IPO Advisory | Capital advisory lead | CAPITAL |
| General | Central business development | GENERAL |
Owner email addresses configurable in `.env` (`LEAD_REGULATORY=…` etc.). On submit: validate server-side with zod, store `Enquiry` with `crmTag`, send an email to the owner via nodemailer (Mailpit locally) and a short acknowledgement to the visitor. Strategy Consulting selections route to "Strategy and markets lead" with tag MARKET ENTRY unless Lexium configures otherwise — make this mapping editable in SiteSettings.

### 8.5 Security and privacy
- HTTPS (mkcert locally), `helmet` with a strict CSP (self-hosted fonts and images only), HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Non-intrusive bot controls: hidden honeypot field + minimum time-to-submit (≥3 s) + `express-rate-limit` per IP. No CAPTCHA.
- Server-side validation and HTML sanitisation for every input.
- Collect only necessary personal data; privacy notice page; consent checkbox on forms (unticked by default).
- Consent banner for non-essential analytics (Accept / Reject / Manage, equal prominence). No analytics events fire before consent.
- `npm audit` in CI script; `scripts/backup.sh` (mongodump) documented as the managed backup process.
- Never expose confidential client, mandate or regulatory dossier information.

---

## 9. CONTENT APPENDIX — PAGE-BY-PAGE (exact wording; seed all of this)

Notation: **"quoted text"** = use exactly. *[Draft]* = write copy within limits, store `copyOrigin:'drafted'`, `status:'review'`.

### 9.1 Home `/` — content order (do not change)
1. **Header** — global navigation and **"Discuss your ambition"** CTA.
2. **Hero** — Headline: **"Strategy to scale for healthcare and regulated consumer markets"**. Supporting copy: **"Lexium connects market opportunity, regulatory pathways, manufacturing decisions, transactions and capital."** Primary CTA: **"Explore our capabilities"** (→ `/services/`). Secondary CTA: **"Speak with an advisor"** (→ `/contact/`).
   Store hero variants in the CMS so Lexium can switch: Recommended — "Strategy to scale for healthcare and regulated consumer markets" (Clear, broad and credible.); Alternative — "Turn regulated-market complexity into commercial advantage" (More assertive and regulation-led.); Alternative — "Where strategy, regulation and capital converge" (Shorter but more abstract.). Default = Recommended.
3. **Credential strip** — **"India expertise | Global market access | Regulatory depth | Manufacturing execution | Capital readiness"** (five items, separated by fine vertical rules).
4. **Market tension** — large editorial statement explaining why growth across regulated markets requires connected decisions, not isolated advisers. *[Draft]*, e.g. a 1–2 sentence statement; one phrase may use the serif italic accent.
5. **Six capability tabs** — **"Strategy | Market Entry | Regulatory | Manufacturing | Mergers and Acquisitions | Fundraising and IPO Advisory"**. Click changes the adjacent message and deliverables. Each tab panel: the matching service outcome line (§9.2) + 3–5 deliverables drawn from that service's capability list + "Explore service →". Market Entry panel links to both India and Global pages. Fire `service_tab_select`.
6. **Industries** — five large cards with a one-line sector proposition and image reveal on hover (images desaturated by default, reveal colour/zoom on hover and focus). Card titles = the five industry names; proposition = each industry hero headline (§9.10–9.14).
7. **India and Global** — interactive map or region selector: **"India | Africa | MENA | CIS | South Asia | selected global markets"**. Selecting a region shows its overview and links to India or Global Market Entry. Avoid unsupported office claims (no "offices in…"). Fire `region_select`.
8. **How we work** — **"Frame the ambition | Find the advantage | Design the pathway | Mobilise execution"** (Process steps, horizontal desktop / vertical mobile).
9. **Insights** — three latest articles with category, title, date and reading time.
10. **Leadership proof** — founder profile, **30+ years of sector experience, 1000+ project exposure across 50+ countries**. Phrase as leadership experience, e.g. "Leadership experience: 30+ years in the sector, exposure to 1000+ projects across 50+ countries." — not as Lexium project history. Name/portrait from Person record (placeholder until supplied; `verificationRequired:true`).
11. **CTA band** — **"What could your next growth chapter look like?"** + button "Discuss your ambition".
12. **Footer**.

### 9.2 Services hub `/services/`
- Hero headline: **"Decisions that move businesses forward."** Intro: **"From growth strategy to funding, Lexium connects the choices required to enter, build and scale regulated businesses."**
- Connected advisory model — horizontal journey: **"Decide → Enter → Comply → Build → Transact → Fund → Scale"**.
- Seven service cards (reusable ServiceCard: two-digit number, plain-language title, one-sentence outcome line, three short concrete non-technical capabilities, "Explore service" with arrow):
  - **01 Strategy Consulting — choose where to play and how to win**
  - **02 India Market Entry — convert India opportunity into revenue**
  - **03 Global Market Entry — build compliant, partner-led expansion**
  - **04 Regulatory and Licences — navigate approval with commercial context**
  - **05 Manufacturing Advisory — design the operating platform for scale**
  - **06 Mergers and Acquisitions — identify, assess and realise strategic value**
  - **07 Fundraising and IPO Advisory — build an investable and market-ready business**
  - Three capabilities per card: take the first three items from each service's capability list below.
- Cross-service case journeys: **"Global manufacturer entering India | Indian company going global | Founder preparing to raise capital"** — each shows the sequence of services involved (e.g. India Market Entry → Regulatory and Licences → Manufacturing Advisory). No client names or results.
- CTA: **"Discuss the decision in front of you"**.

### 9.3 Reusable service page template (all seven pages, in this order)
01 Hero (eyebrow + outcome-led headline + 50–70 word introduction + primary enquiry CTA + one subtle image or abstract business visual) → 02 Client question (large statement) → 03 Why it matters (three or four market tensions; numbers only with source and date) → 04 Capabilities (four to seven accordion or tab modules; each with an outcome, 40–60 words and 3–5 deliverables) → 05 Typical engagements (three cards: situation, Lexium role, result type; no client names or quantified results) → 06 How we work (four-stage methodology adapted to the service) → 07 Related industries (two to five links) → 08 Related insights (three dynamically selected) → 09 CTA (question-led, service-specific).
Page-specific modules from the sections below are inserted in the most logical position within this structure (store as typed `customSections`). Hero CTA opens `/contact/?service={slug}` pre-selecting Service interest.

### 9.4 Strategy Consulting `/services/strategy-consulting/`
Feel: senior advisory offer, restrained imagery, strong decision-oriented language.
- Hero: **"Make the choices that create durable growth."** Intro: **"Lexium helps leadership teams translate market ambition into a focused portfolio, operating agenda and executable plan."** (extend to 50–70 words *[Draft]* only if needed; keep this sentence first).
- Client questions: **"Where should we play? How will we win? What must change to deliver the ambition?"**
- Capabilities: **"Growth strategy | Portfolio strategy | Market and competitor intelligence | Business plan | Operating model | Transformation roadmap"**.
- Decision model: **"Opportunity → Advantage → Economics → Execution"**.
- Typical engagements: **"Five-year growth strategy | New-category assessment | Business model redesign"**.
- CTA: **"Clarify your next strategic move"**.
- Copy themes: lead with choices and outcomes, not lengthy process descriptions; show that financial modelling supports strategic decisions but never present Lexium as an audit or accounting firm; use subtle charts or geometric SVG visuals rather than multiple stock images.

### 9.5 India Market Entry `/services/india-market-entry/`
- Hero: **"Enter India with clarity and control."** Audience line: international manufacturers, brands and investors.
- India opportunity: market attractiveness, category dynamics and the regulatory-commercial interface (three blocks, *[Draft]*, no unsourced stats).
- Capabilities: **"Market assessment | Entry strategy | India authorised agent | Regulatory pathway | Distributor or partner search | Pricing and launch | Local manufacturing assessment"**.
- Entry routes: **"Export | Distributor | Subsidiary | Joint venture | Acquisition | Local manufacturing"**.
- 90 to 180 day roadmap: **"Diagnose → Select route → Build partner pipeline → Prepare launch"**.
- CTA: **"Build your India entry plan"**.

### 9.6 Global Market Entry `/services/global-market-entry/`
- Hero: **"Expand globally with a market-by-market advantage."** Audience: Indian and regional businesses pursuing exports or overseas establishment.
- Region selector: **"Africa | MENA | CIS | South Asia | ASEAN | Latin America"** — only regions with `status:'active'` render ("Only publish regions with real delivery capability"). Seed all six as active with `verificationRequired:true`.
- Capabilities: **"Market prioritisation | Country screening | Regulatory route | Distributor search | Partner due diligence | Commercial launch | Localisation"**.
- Market selection matrix: **"Demand | Regulation | Competition | Channel access | Pricing | Investment requirement"** (six-criteria matrix visual).
- CTA: **"Identify your next priority market"**.

### 9.7 Regulatory and Licences `/services/regulatory-licences/`
Presented as commercially informed regulatory strategy, not a list of forms.
- Hero: **"Build regulatory confidence into every growth decision."** Intro connects approval strategy with launch timing, investment and market access *[Draft]*.
- Pathway selector: **"India | European Union | United States | United Kingdom | Brazil | Australia | Canada | Saudi Arabia"** (tabs; each shows RegulatoryItem summary + reviewed date).
- Service groups: **"Medical device licences | ISO and quality systems | CE MDR | US FDA | BIS | Cosmetics | Food and nutrition | Digital health and SaMD"**.
- India licence navigator: **"Manufacture | Import | Test or evaluation | Clinical investigation | Authorised agent"** — accordion; form numbers only inside expandable detail, never in the first view.
- Deliverables: **"Classification | Gap assessment | Dossier | Query response | Audit readiness | Post-approval changes"**.
- FAQ (accordion, deep-linkable): timelines, applicant responsibilities, government fees, testing and evidence requirements. Include disclaimer.
- CTA: **"Discuss your regulatory pathway"**.
- Governance (enforced): show a reviewed date; no absolute timeline promises — state that timelines depend on authority review, product complexity and document readiness; note that professional fees are separate from government, testing, certification body and out-of-pocket costs in proposals; disclaimer: "Website content is general information and not a regulatory determination."

### 9.8 Manufacturing Advisory `/services/manufacturing-advisory/`
End-to-end plant setup capability for medical devices and selected regulated consumer sectors, without overlapping Nexiom's pharmaceutical positioning.
- Hero: **"Build the manufacturing platform behind your growth."** Clean, modern manufacturing imagery, not generic factory stock.
- Investment questions: **"What to make | Where to locate | Which technology | What capacity | Which approvals | How to de-risk execution"**.
- Capability stack: **"Feasibility | Product and technology selection | Business plan | Facility concept | Regulatory plan | Equipment partners | Validation and launch readiness"**.
- Delivery journey: **"Concept → Feasibility → Design basis → Partner selection → Setup → Qualification → Commercial readiness"**.
- Document stack visual: **"URS | Layouts | Specifications | Quality system | Validation plan | Licensing dossier"** — build a layered stacked-file visual (offset sheets with fine rules, orange tab on the active sheet, reveal on scroll).
- Sector applications: **"Medical devices | Diagnostics | Cosmetics | Nutrition and beverages | Consumer health"**.
- CTA: **"Assess your manufacturing opportunity"**.
- Boundary: Lexium owns market feasibility, regulatory pathway, product or technology partnerships, business planning and program advisory. Do **not** mention Nexiom publicly (cross-referral only after management approves) — keep a hidden CMS field `nexiomReferralApproved:false`.

### 9.9 Mergers and Acquisitions `/services/mergers-acquisitions/`
- Hero: **"Find the right deal. Create the right value."** Supporting copy covers acquisitions, divestments, joint ventures and strategic partnerships *[Draft]*.
- Audience: **"Promoters | Strategic buyers | Investors | International entrants | Founder-led businesses"**.
- Capabilities: **"M&A strategy | Target screening | Commercial due diligence | Market and regulatory diligence | Valuation support | Deal coordination | Integration and value creation"**.
- Deal journey: **"Strategic intent → Screen → Assess → Structure → Execute → Integrate"**.
- Mandate types: **"Buy-side | Sell-side | Joint venture | Strategic partnership | Technology transfer"**.
- Confidentiality note: never publish active mandates or identifiable deal information (editorial rule; show a short public line such as "All conversations are held in confidence." *[Draft]*).
- CTA: **"Discuss a transaction in confidence"**.

### 9.10 Fundraising and IPO Advisory `/services/fundraising-ipo-advisory/`
- Hero: **"Build the business investors want to back."** Intro connects strategic choices, financial credibility, governance and the equity story *[Draft]*.
- Readiness statement: **"Capital is an outcome of business readiness—not merely a pitch deck."**
- Seven interactive modules (tabs/accordion): **"Growth strategy | Business plan | Financial model | Governance | Fundraise | Investor materials | SME IPO readiness"**.
- **Investor readiness diagnostic** (component "Diagnostic"): five scored questions, response format **Yes / Partly / No** (Yes=2, Partly=1, No=0; max 10):
  - Growth — "Is the three-year growth thesis supported by market evidence?"
  - Economics — "Does the financial model reconcile revenue drivers, cash and funding need?"
  - Governance — "Are statutory, board and management controls documented?"
  - Narrative — "Can management explain the use of funds and value creation clearly?"
  - Diligence — "Is a structured data room substantially ready?"
  Result bands: **Foundation** (0–4) | **Investor-readying** (5–7) | **Market-ready** (8–10). States: question (one per screen), progress ("2 of 5" + bar, not colour-only), result, lead capture. Show a useful summary (band + per-area strengths/gaps) **before** asking for email; email capture optional with consent. Fire `diagnostic_start` and `diagnostic_complete` (band only, no answers). Use tabular figures for scores.
- Capital journey: **"Prepare → Position → Engage → Diligence → Close → Govern"**.
- Investor materials: **"Teaser | Information memorandum | Pitch deck | Financial model | Data-room index | Management Q&A"**.
- Disclaimer: **"Lexium provides advisory support and coordinates with SEBI-registered or otherwise licensed intermediaries where legally required."**
- CTA: **"Assess your capital readiness"**.

### 9.11 Industries hub `/industries/`
- Hero: **"Sector expertise where regulation, markets and capital converge."**
- Positioning: **"Lexium advises businesses across medical technology, healthcare and regulated consumer markets—from strategy and market entry to manufacturing, transactions and fundraising."**
- Anchor industry: **Medical Devices and Diagnostics** — largest card, strongest proof, broadest capability coverage.
- Industry 02 Healthcare and Digital Health · 03 Cosmetics and Personal Care · 04 Food, Nutrition and Beverages · 05 Consumer Health and Wellness.
- Cross-sector themes: **"Localisation | Regulatory change | Digital models | Manufacturing resilience | Capital"**.
- CTA: **"Discuss your sector opportunity"**.
- Card rules: one industry-specific image (no collage); state client types served and decisions Lexium supports; show related services dynamically (from relationships) rather than all seven; never list sectors without a credible delivery proposition.

### 9.12 Medical Devices and Diagnostics `/industries/medical-devices-diagnostics/`
Deepest proof, regulatory breadth and manufacturing credibility.
- Hero: **"Move medical technology from approval to adoption."** Sophisticated device or diagnostic manufacturing image.
- Subsectors: **"Capital equipment | Disposables | IVD | Implants | Digital health and SaMD | Hospital equipment"**.
- Client questions: **"How do we enter India? Which licence applies? Should we localise? Which partner can deliver? How do we fund scale?"**
- Connected capabilities: **"Strategy | India and global entry | Regulatory | Manufacturing | M&A | Fundraising"** (each links to the service page).
- Regulatory reach: **"CDSCO | EU MDR | US FDA | BIS | ISO 13485 | selected international authorities"**.
- Use-case cards: **"Foreign manufacturer entering India | Indian manufacturer expanding globally | New manufacturing platform | Investor diligence"**.
- CTA: **"Discuss your medical technology growth plan"**.

### 9.13 Healthcare and Digital Health `/industries/healthcare-digital-health/`
Connect care delivery, technology, regulation and scalable business models — never present Lexium as a hospital engineering company.
- Hero: **"Build healthcare models that scale with trust."** Imagery: connected care or digital clinical workflow.
- Subsectors: **"Care platforms | Diagnostics networks | Digital therapeutics | SaMD | Remote monitoring | Specialty care"**.
- Market tensions: **"Access | Affordability | Clinical evidence | Regulation | Adoption | Reimbursement"**.
- Capabilities: **"Growth strategy | Market entry | Regulatory model | Partnership design | Commercial diligence | Capital readiness"**.
- Business model view: **"B2C | B2B | B2B2C | Provider partnerships | Employer health | Subscription"**.
- CTA: **"Shape your healthcare growth model"**.

### 9.14 Cosmetics and Personal Care `/industries/cosmetics-personal-care/`
Premium and science-led; serves beauty brands, manufacturers, ingredient companies and investors.
- Hero: **"From promising product to global brand."** Visual: unbranded premium skincare and formulation science, with copy space.
- Market tension: **"Beauty markets are expanding. Complexity is expanding faster."**
- Subsectors: **"Skin and dermal care | Hair and scalp care | Personal care | Ingredients and manufacturing"**.
- Interactive capabilities: **"Growth strategy | Market entry | Regulatory and claims | Manufacturing | M&A | Fundraising and IPO"**.
- Four challenges: **"Local relevance | Regulatory confidence | Scalable operations | Investment readiness"**.
- Approach: **"Frame the ambition | Find the advantage | Design the pathway | Mobilise execution"**.
- CTA: **"Explore your next beauty growth platform"**.

### 9.15 Food, Nutrition and Beverages `/industries/food-nutrition-beverages/`
Functional foods, specialised nutrition, supplements and beverages — not commodity food or restaurant consulting.
- Hero: **"From changing tastes to lasting growth."** Visual: functional beverage, nutrition format, ingredients and laboratory glass.
- Market tension: **"Demand is changing fast. Winning requires sharper choices."**
- Subsectors: **"Functional food | Nutrition and supplements | Functional beverages | Ingredients and manufacturing"**.
- Interactive capabilities: **"Growth strategy | Market entry | Regulatory | Manufacturing | M&A | Fundraising and IPO"**.
- Four challenges: **"Consumer relevance | Regulatory confidence | Scalable operations | Investment readiness"**.
- Regulatory context: FSSAI and relevant international pathways, claims, ingredients, labels and product categories (with reviewed date + disclaimer).
- CTA: **"Identify your next nutrition growth opportunity"**.

### 9.16 Consumer Health and Wellness `/industries/consumer-health-wellness/`
Distinct from nutrition and cosmetics: preventive health, self-care and connected wellness models.
- Hero: **"Turn healthier choices into healthier growth."** Visual: wellness products, subtle connected-health device and science cues.
- Market tension: **"Health is becoming personal. Trust is becoming decisive."**
- Subsectors: **"Preventive wellness | Self-care and OTC | Women and healthy ageing | Digital wellness"**.
- Interactive capabilities: **"Growth strategy | Market entry | Regulatory and claims | Operations | M&A | Fundraising and IPO"**.
- Four challenges: **"Consumer trust | Regulatory clarity | Connected experience | Scalable economics"**.
- Approach: **"Human insight | Evidence | Business model | Execution"**.
- CTA: **"Build your next consumer-health platform"**.

### 9.17 Insights `/insights/`
- Hero: **"Perspectives on growth in regulated markets."**
- Filters: **"All | Strategy | Markets | Regulation | Manufacturing | M&A | Capital | Industry"** (URL query `?category=`, accessible toggle buttons with `aria-pressed`).
- Featured insight: large image, category, title, summary, author and date.
- Article grid: three columns desktop, one column mobile; **Load more** (with page fallback links).
- Newsletter: build the component but keep it **disabled by default** (setting `newsletterEnabled:false`) — "Optional only when a genuine email cadence and consent process are ready."
- Navigation sub-types (mega menu): Articles | Market perspectives | Regulatory updates | Founder viewpoints.

**Article page** `/insights/:slug/`: Article header (Category | Title | Standfirst | Author | Date | Reading time) → Hero image (one strong editorial image) → Body (readable 680–760 px column, H2/H3 hierarchy, charts or sources where relevant) → Key takeaways (three concise conclusions within the body, not a decorative overlay) → Author (leadership profile and LinkedIn link) → Related insights (three contextual articles) → CTA **"Discuss what this means for your business"**. Fire `insight_read` at 50% and 90% scroll depth.

**Seed six substantive articles** (one per content pillar), status `review`, ~700–900 words each, no invented statistics (or cite real public sources with dates), each with three key takeaways and related services/industries:
1. India as a market and manufacturing platform
2. Global South healthcare access and local manufacturing
3. Medical-device localisation and regulatory strategy
4. Scaling regulated consumer brands across markets
5. Capital readiness for founder-led businesses
6. M&A and partnership opportunities in healthcare and consumer sectors

### 9.18 About `/about/`
- Hero: **"Senior advice. Practical execution. Global ambition."**
- Firm story: **Founded in 2018.** Explain the evolution from regulatory and market entry into an integrated advisory platform *[Draft]*, short — not a long corporate history.
- Why Lexium: **"Sector depth | Connected capabilities | India advantage | Execution orientation"**.
- Leadership: professional profile, experience and selected areas of expertise; current executive portrait (placeholder until supplied).
- Global experience: map and narrative; attribute prior career or leadership experience precisely.
- Values: **"Clarity | Integrity | Evidence | Ownership"**.
- CTA: **"Work with Lexium"**.
- Sub-anchors for nav: Firm `#firm`, Leadership `#leadership`, Global reach `#global-reach`, Why Lexium `#why-lexium`.

### 9.19 Contact `/contact/`
- Intro: **"Tell us the decision or opportunity you are working through."**
- Enquiry form fields (in order): **Name | Company | Work email | Phone (optional) | Country | Industry | Service interest | Brief message | Consent**. Industry options = the five industries + "Other". Service interest options = Strategy Consulting, Market Entry (India), Market Entry (Global), Regulatory and Licences, Manufacturing Advisory, Mergers and Acquisitions, Fundraising and IPO Advisory, General. States: default, validation (inline, `aria-describedby`, error summary on submit), loading, success, error. Fire `form_start` on first field interaction and `form_submit` on success (service, industry, country — never message text).
- Contact details: **info@lexiumconsulting.com** | website | approved office address (CMS, placeholder) | LinkedIn. `mailto:` links fire `email_click`.
- Success state: thank the visitor, confirm the expected response window (CMS setting, e.g. "We aim to respond within two business days." *[Draft]*), and provide an Insights link.

---

## 10. SEO

- Title tag: unique, ~50–60 characters, service or industry first, Lexium second (e.g. "India Market Entry Advisory | Lexium"). Meta description: unique, outcome-led, ~140–160 characters. Admin warns when out of range.
- One H1 per page; logical H2/H3; no headings used only for styling.
- Self-referencing canonical URLs.
- JSON-LD: `Organization` (site-wide), `BreadcrumbList` (all non-home pages), `Article` (insights), `Person` (leadership/author) — only where valid.
- Internal links services ↔ industries ↔ insights with descriptive anchor text (never "click here").
- Images: AVIF/WebP, responsive sizes, explicit dimensions, meaningful filenames (`medical-device-cleanroom-manufacturing.avif`), alt text.
- `sitemap.xml` generated from published content; `robots.txt`.
- Because this is a React SPA, add **build-time prerendering** of all public routes (e.g. `vite-plugin-prerender` or a Playwright-based prerender script in `scripts/prerender.mjs`) so each route ships complete HTML with its meta tags; React hydrates on load.
- Priority topic clusters to cross-link: India Market Entry (authorised agent, distributor search, local manufacturing, regulatory pathway, entry model); Medical Device Regulatory (CDSCO licences, import, manufacturing, test licences, SaMD, BIS, ISO 13485); Medical Device Plant Setup (feasibility, technology transfer, equipment, facility concept, validation, localisation); Fundraising and IPO (business plan, financial model, investor materials, governance, data room, SME IPO readiness); Regulated Consumer Markets (cosmetics, wellness, nutrition, claims, market entry and manufacturing).

---

## 11. ACCESSIBILITY (WCAG 2.2 AA — part of the build, not post-launch)

- Visible keyboard focus (2 px orange outline + 2 px offset, also visible on navy), logical tab order, skip-to-content link.
- Sufficient contrast everywhere; validate orange usage (see §5.1).
- All form fields have associated labels; programmatic error messages (`aria-invalid`, `aria-describedby`, live region).
- Never rely on colour alone for selected states, scores or errors (use underline, weight, icons, text).
- Tabs follow WAI-ARIA tabs pattern (arrow keys); accordions use buttons with `aria-expanded`; mega menu and drawer close with Escape.
- Support 200% browser text enlargement and `prefers-reduced-motion`.
- Region map: every region is also a focusable button in a list (map is enhancement only).

---

## 12. PERFORMANCE BUDGETS

| Measure | Target |
|---|---|
| Largest Contentful Paint | ≤ 2.5 s (p75) |
| Interaction to Next Paint | ≤ 200 ms (p75) |
| Cumulative Layout Shift | ≤ 0.1 |
| Initial page weight | < 1.5 MB on standard content pages |
| Hero image | Responsive AVIF or WebP; no autoplay background video |

Techniques: route-level code splitting (`React.lazy`), preload the hero image and the display font subset, `font-display: swap`, compression (brotli/gzip) in Express, long-cache headers for hashed assets, no heavy map libraries on pages that don't use them, images lazy-loaded below the fold.

---

## 13. ANALYTICS (local, consent-gated, stored in MongoDB)

`lib/analytics.js` exports `track(name, params)`; queues and sends via `sendBeacon` to `/api/events` only after consent.
| Event | Trigger | Key parameters |
|---|---|---|
| cta_click | Primary or secondary CTA | page, CTA label, service, industry |
| service_tab_select | Capability tab interaction | page, selected capability |
| region_select | Market region selected | region, page |
| form_start | First enquiry field interaction | form type, source page |
| form_submit | Successful enquiry | service, industry, country (exclude message text) |
| diagnostic_start | Readiness diagnostic begins | source page |
| diagnostic_complete | Result displayed | result band (no sensitive answers) |
| insight_read | Meaningful article depth | article, category, scroll threshold |
| email_click | Email link selected | page and placement |

Admin "Conversions" dashboard shows the primary goals: qualified consultation enquiry; regulatory or market-entry enquiry routed to the correct team; manufacturing opportunity discussion; confidential M&A or fundraising conversation; investor-readiness diagnostic completion followed by an enquiry (join DiagnosticResult → Enquiry by session).

---

## 14. BUILD ORDER (follow these phases; report at the end of each)

1. **Setup** — install everything in §1 and §3, scaffold §2, `.env.example`, HTTPS dev server, Mongo connection health check at `/api/health`.
2. **Design system** — tokens, fonts, type scale, grid, buttons (primary orange, primary navy, text-link with arrow), fine rules, focus styles. Build a hidden `/admin/styleguide` page showing every component state from §6.
3. **Components** — header (all four states), footer, hero variants, tabs, accordion, cards, process steps, region selector, diagnostic, CTA bands, form, document stack, matrix.
4. **Backend + CMS** — models, auth, admin UI, workflow, scheduling, uploads, redirects, settings, lead routing, events.
5. **Seed** — `scripts/seed.mjs` writes ALL content in §9 (exact strings) + an admin user (credentials printed once from `.env`).
6. **Images** — fetch, optimise, credit, wire focal points and alt text.
7. **Pages** — Home, Services hub, seven service pages, Industries hub, five industry pages, Insights listing + article, About, Contact, Privacy, Terms, 404.
8. **SEO + prerender + analytics + consent**.
9. **QA** — run the checks in §15 and fix every failure.
10. **Handover** — `README.md` with: CachyOS install steps, how to start (`npm run dev`, `npm start`), admin guide (editing, review/publish, scheduling, redirects, image focal points), backup/restore, where to drop the real logo, list of all `[Draft]` and `verificationRequired` items for Lexium to approve, and the asset checklist below.

---

## 15. ACCEPTANCE TESTS (definition of done for the local build)

- [ ] Every URL in §4 resolves (Playwright crawl); non-slash URLs 301 to slash versions; CMS redirects work.
- [ ] A script `scripts/verify-copy.mjs` asserts that every bold quoted string in §9 appears verbatim on its page (fail the build otherwise).
- [ ] No "pharmaceutical"/"pharma" wording anywhere in public pages.
- [ ] No placeholder, duplicated or unsupported claims remain **in published content** (drafts may hold placeholders; the README lists them).
- [ ] Forms route to the correct owner with the correct CRM tag (one Playwright test per row of §8.4, verified in Mailpit API); success and error states tested; honeypot and rate limiting tested.
- [ ] Diagnostic: scoring bands correct for 0, 4, 5, 7, 8, 10; summary shown before email request.
- [ ] Desktop 1440, tablet 1024/768, mobile 390/360/320 screenshots captured; no horizontal scroll at 320 px; touch targets ≥ 44 px.
- [ ] `@axe-core/playwright` on every template: zero critical or serious issues; keyboard-only walkthrough of header, mega menu, drawer, tabs, accordion, region selector, diagnostic and form.
- [ ] Lighthouse CI on Home, one service, one industry, one article: LCP ≤ 2.5 s, CLS ≤ 0.1, TBT low; page weight < 1.5 MB.
- [ ] Reduced-motion mode disables reveals.
- [ ] Every regulatory item shows a reviewed date and disclaimer.
- [ ] Header compacts at ~80 px scroll; current page indicated; menus close with Escape; no phone number in primary nav.
- [ ] Analytics events fire only after consent and contain no message text or diagnostic answers.

---

## 16. ASSET CHECKLIST FOR LEXIUM (surface in README and admin)

- Latest approved lowercase Lexium logo in SVG, PDF and transparent PNG → drop into `client/public/brand/`.
- Brand colour and typography licences or approved open-source alternatives (Manrope, Inter, Source Serif 4 are OFL — confirm).
- Leadership portrait in high resolution.
- Five industry hero images with wide and mobile crops (stock used until replaced).
- Two or three manufacturing and regulatory support images.
- Approved office address, email, telephone and LinkedIn URL.
- Verified credentials, numbers and jurisdictions with claim owner and source.
- Legal review of Privacy, Terms, disclaimers and cookie requirements.

---

**Final instruction (from the document):** The website must feel like one connected consulting platform, not seven unrelated service brochures. Use reusable components, concise content and strong cross-linking to show how strategy, market entry, regulation, manufacturing, M&A and capital work together for each industry. Preserve white space and message clarity throughout. The design should be distinctive to Lexium and should not imitate the visual identity, proprietary layouts or language of another consulting firm.

Start with Phase 1 now. After each phase, summarise what was built, what was verified, and anything that needs Lexium's input.
