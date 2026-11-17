# Lexium Consulting — website (MERN, local)

Redesigned Lexium Consulting site, built from *Lexium — Website Information Architecture and Developer Wireframe (21 October 2026)* via `LEXIUM_MERN_BUILD_PROMPT.md`.

- **Client:** React 19 + Vite 8, Tailwind v4 tokens, React Router 7, TanStack Query, Radix primitives, self-hosted Manrope / Inter / Source Serif 4
- **Server:** Node 24 + Express 5, Mongoose 8 (MongoDB `lexium`), HTTPS via mkcert, Nodemailer → Mailpit, node-cron scheduler
- **CMS:** `/admin/` — draft → review → publish with named approver, scheduling, SEO/social preview, focal points, redirects, lead routing, dashboard
- **SEO:** every public route is prerendered to complete HTML (meta, canonical, JSON-LD) at build time; `sitemap.xml`, `robots.txt`

---

## 1. Install on CachyOS

What's already on this machine: Node 24, MongoDB 8 (systemd `mongodb`), Docker, ImageMagick, paru. `mkcert` and `mailpit` were installed as user binaries in `~/.local/bin` (no sudo).

**One-time steps that need sudo** (run in a terminal; these could not be done automatically):

```bash
mkcert -install                                         # trust the local CA so browsers accept https://lexium.local
echo "127.0.0.1 lexium.local" | sudo tee -a /etc/hosts  # enables https://lexium.local:5173 / :8443
```

Until you do this, use `https://localhost:5173` / `https://localhost:8443` and accept the certificate warning.

Fresh machine (from the build prompt):

```bash
sudo pacman -Syu --needed base-devel git curl wget unzip jq nodejs-lts-jod npm mkcert nss imagemagick
paru -S --needed mongodb-bin mongosh-bin mongodb-tools-bin mailpit-bin
sudo systemctl enable --now mongodb
mkdir -p certs && mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 lexium.local
npm install && npx playwright install chromium
cp .env.example .env    # then edit secrets
npm run seed            # prints the admin login once
```

## 2. Run

| Command | What it does |
|---|---|
| `mailpit` | Local mail catcher — inbox at http://127.0.0.1:8025 (start before testing forms) |
| `npm run dev` | API (https://…:4000) + Vite (https://lexium.local:5173) with hot reload |
| `npm run build` | Client build + prerender all public routes into `client/dist` |
| `npm start` | Production server — https://lexium.local:8443 (serves the build, compression, CSP, HSTS) |
| `npm run seed` | Reseed all content (`-- --all` also wipes enquiries/events/redirects) |
| `npm run images` | Download and optimise stock images (needs a free API key, see §5) |
| `npm test` | API tests (Vitest + Supertest, `lexium_test` DB) + client unit tests |
| `npm run test:e2e` | Playwright: routes, header, components, forms → Mailpit, consent, responsive, axe, admin |
| `npm run test:a11y` | axe-core on every template at 1440 and 390 px |
| `npm run verify:copy` | Fails if any bold quoted string from §9 is missing from its page, or "pharma" appears (needs `npm start`) |
| `npm run lighthouse` | Lighthouse CI budgets on 4 pages (needs `npm start`) |
| `npm run backup` / `bash scripts/restore.sh backups/<date>` | mongodump (+ uploads) / restore |
| `npm run review-report` | Regenerates `REVIEW_ITEMS.md` |
| `npm run audit` | `npm audit` of production dependencies |

`.env` → `CONTENT_PREVIEW=true` shows items with status *review* on the public site (with a "Preview build" ribbon). **Set it to `false` for launch** — only *published* content is then served, sitemapped and prerendered.

## 3. Admin guide (`/admin/`)

- **Roles:** editor (edit, submit for review) · approver (publish, schedule, unpublish) · admin (also users, deletes). The approver's name and date are recorded in each item's history.
- **Editing:** Basics, Hero (live word counts against §5.6 limits), SEO title/description with live search and social previews, verification fields, and an *Advanced (JSON)* panel for capabilities, tensions, engagements, methodology, custom sections and relationships. Publishing is **blocked** while any content limit is exceeded; SEO lengths only warn.
- **Insights:** rich-text body (TipTap), three key takeaways, featured flag; **Schedule** sets a date/time and the minute-by-minute job publishes it.
- **Regulatory items:** a reviewed date is mandatory (schema-level); the dashboard flags items older than six months. Form numbers belong only in *Detail*.
- **Images:** set an image path or upload (AVIF + WebP at 480–2400 px generated automatically). Drag the image in the focal-point picker to set `object-position`. Alt text is required unless *Decorative* is ticked.
- **Redirects:** add manually, or change a slug — a 301 from the old URL is created automatically.
- **Settings:** home hero variant (Recommended / two alternatives), contact details, office address, response window, newsletter (off by default), lead routing (service interest → owner/CRM tag; owner emails in `.env` `LEAD_*`).
- **Dashboard:** content needing review, verification-required claims, stale regulatory items, enquiries by CRM tag, consented analytics events and the five conversion goals.
- **Styleguide:** `/admin/styleguide` shows every component state (noindex).

## 4. Logo

Drop the approved files into `client/public/brand/` as `lexium-logo.svg` and `lexium-logo-white.svg`, then `npm run build`. The site never recreates the wordmark — it shows a dashed "LOGO — supply approved SVG" box until the files exist.

## 5. Images

No stock images are downloaded yet (no API key was available). Create a free key at https://unsplash.com/developers or https://www.pexels.com/api/, add `UNSPLASH_ACCESS_KEY=` or `PEXELS_API_KEY=` to `.env`, then run `npm run images` and `npm run build`. Slots and search terms are listed in `scripts/image-slots.json`. Credits are recorded in `client/src/content/image-credits.json` and shown under *Admin → Image credits*. **Review every image** against the criteria (no logos, handshakes, orange tint or pills/blister packs) before publishing. You can also place files manually in `client/public/images/raw/<slot>.jpg` and run `node scripts/optimise-images.mjs`. Until then, pages show neutral placeholders.

## 6. Content awaiting Lexium approval

**All 58 seeded records are in status *review*.** Every page includes some drafted copy (copy given in the document is reproduced verbatim; the rest is drafted within the §5.6 limits). See **`REVIEW_ITEMS.md`** for the full list. Key items:

- **Drafted copy:** service introductions beyond the document sentence, capability summaries and deliverables, market tensions, typical engagements, methodology descriptions, industry intros, challenge descriptions, the home market-tension statement, region overviews, About firm story, Contact intro, response window, footer line, the six insight articles, privacy/terms text.
- **`verificationRequired: true`:** founder record and the "30+ years / 1000+ projects / 50+ countries" claims (claim owner: Lexium leadership), all 8 regions (delivery capability to be confirmed), all 20 regulatory items (pathways, India licence navigator form numbers, FAQ, FSSAI context — reviewed date set to 17 Nov 2026 pending the regulatory lead's check).
- **Nexiom:** `nexiomReferralApproved:false` on Manufacturing Advisory; Nexiom is not mentioned publicly.

## 7. Asset checklist for Lexium

- [ ] Latest approved lowercase Lexium logo — SVG, PDF and transparent PNG → `client/public/brand/`
- [ ] Brand colour and typography licences, or confirmation of the open-source fonts (Manrope, Inter, Source Serif 4 — all SIL OFL)
- [ ] Leadership portrait in high resolution (+ founder name, role, biography, LinkedIn)
- [ ] Five industry hero images with wide and mobile crops (stock used until replaced)
- [ ] Two or three manufacturing and regulatory support images
- [ ] Approved office address, email, telephone and LinkedIn URL
- [ ] Verified credentials, numbers and jurisdictions with claim owner and source
- [ ] Legal review of Privacy, Terms, disclaimers and cookie requirements

## 8. Implementation notes

- **Prerendering:** `scripts/prerender.mjs` renders each route in headless Chromium and saves the HTML plus the query cache. On load the client fetches the route's code first, then renders over the prerendered markup in a single commit with identical output (no flash, CLS ≈ 0). This replaces a true `hydrateRoot`, which mismatches on DOM snapshots.
- **Colour:** #F36F21 on white is ≈ 2.96:1, which fails as text at any size. Orange is therefore used for rules, fills, icons and on navy; small numerals use navy with an orange rule. Navy text on orange buttons (≈ 5:1).
- **Security:** strict CSP (self only, no inline scripts; data blocks for JSON-LD/state), HSTS, Referrer- and Permissions-Policy; argon2 + httpOnly JWT cookie + double-submit CSRF; honeypot + 3-second minimum + per-IP rate limit; zod validation and HTML stripping server-side; analytics only after consent and scrubbed of message/answer/contact fields.
- **Results at handover:** 34 API tests, 6 client tests, 53 Playwright tests (including axe on 12 templates × 2 widths: zero critical/serious), 105 verbatim copy checks, Lighthouse 100/100/100/100 on the four budget pages (LCP ≈ 0.3–0.4 s, CLS ≤ 0.008, ≤ 473 KB).
