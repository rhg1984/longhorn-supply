# Longhorn Supply & Provision

Marketing and quote-request website for **Longhorn Supply & Provision** — a Texas-based supplier of research-grade peptides, amino acids, and laboratory consumables.

> ⚠ All products are sold **for laboratory and research use only — not for human consumption.** The site implements an age gate, persistent compliance bar, and per-product disclaimers. Get the site copy reviewed by a lawyer with experience in the research-chemical / supplements industry before launch.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Astro](https://astro.build) 5 (static site generation) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3 + `@astrojs/tailwind` |
| Content | Astro Content Collections (markdown frontmatter in `src/content/products/`) |
| Forms | [Netlify Forms](https://docs.netlify.com/forms/setup/) (no backend needed) |
| Hosting | Netlify, sourced from GitHub |
| Node | Latest LTS (20.x) |
| Package manager | npm |

There is **no payment processor**. Research peptides are a high-risk merchant category that standard processors (Stripe, PayPal, Square) will not service. The site is a quote-request flow — orders are confirmed and paid out-of-band. See the `TODO` in `src/pages/quote-request.astro` for where to wire in a high-risk processor (NMI, Authorize.net, or crypto checkout) once one is secured.

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:4321
```

Useful scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with HMR |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

---

## Project Structure

```
longhorn-supply/
├── public/
│   ├── logo.png              copied from longhorn-logo-2048px.png
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AgeGate.astro       full-screen 21+ / qualified-researcher gate
│   │   ├── DisclaimerBar.astro persistent "research use only" bar
│   │   ├── Header.astro        logo, nav, quote-list count
│   │   ├── Footer.astro
│   │   ├── ProductCard.astro
│   │   ├── ProductDetail.astro size selector + quote buttons
│   │   ├── QuoteButton.astro   localStorage-backed quote-list interactions
│   │   └── ComplianceBlock.astro boxed product-page disclaimer
│   ├── content/
│   │   ├── config.ts           Zod schema for products
│   │   └── products/           8 seed markdown files
│   ├── layouts/
│   │   └── BaseLayout.astro    SEO meta, JSON-LD, header + footer + age gate
│   ├── pages/
│   │   ├── index.astro, about, contact, quality, shipping, terms, privacy, 404
│   │   ├── shop/index.astro, [slug].astro
│   │   └── quote-request.astro + quote-request/thanks.astro
│   └── styles/global.css
├── astro.config.mjs
├── tailwind.config.mjs         brand colors + fonts (Oswald / Inter)
├── netlify.toml
└── package.json
```

---

## How to Add a New Product

Drop a new markdown file into `src/content/products/`:

```yaml
---
name: "Product Name"
slug: "product-slug"                          # optional, defaults to filename
category: "peptides"                          # peptides | amino-acids | supplies | glassware
cas: "000-00-0"                               # optional
molecularFormula: "C00H00N00O00"              # optional
molecularWeight: 0.00                         # optional, number
purity: "≥98%"
sizes:
  - size: "5 mg / vial"
    sku: "LSP-XYZ-5"
  - size: "10 mg / vial"
    sku: "LSP-XYZ-10"
description: "Short, research-use-only description. Avoid medical, therapeutic, or dosing language."
storage: "Storage instructions."
coaUrl: ""                                    # optional URL to a COA PDF
featured: false                               # show on homepage
inStock: true
---

## Research Applications

Optional longer-form copy in markdown body.
```

The file will be picked up automatically on next build. Stick to **research-use language only** — no medical or therapeutic claims, no dosing.

### Compliance copy rules

- ✅ "studied for its role in…", "used in research on…", "supplied as a reference compound for…"
- ❌ "helps with…", "treats…", "improves…", "good for…"
- ❌ Never include human dosing information, even as an example.
- ❌ Never reference "subjects" or "participants" in a way that implies human use.

---

## Updating the Age Gate or Disclaimers

- **Persistent disclaimer bar:** `src/components/DisclaimerBar.astro` — change the copy in the `<div>` body.
- **Age gate modal:** `src/components/AgeGate.astro` — modal markup + acceptance is persisted under the localStorage key `lsp:age-gate:v1`. To force every visitor to re-accept (e.g. after a terms update), bump the version: change `lsp:age-gate:v1` to `lsp:age-gate:v2`.
- **Product-page disclaimer block:** `src/components/ComplianceBlock.astro` — two variants (`full` and `compact`).
- **Footer micro-disclaimer:** `src/components/Footer.astro`.

---

## Viewing Netlify Form Submissions

Two forms are wired up:

- `contact` — used by `/contact`.
- `quote-request` — used by `/quote-request` (writes the localStorage quote list into a `quote_items` hidden field).

After deploying to Netlify, submissions show up under **Site settings → Forms** in the Netlify dashboard. To get notified by email when a submission arrives:

1. Netlify dashboard → **Forms → Form notifications**.
2. Add an **Email notification** targeting your `orders@longhornsupply.com` address (or whichever inbox you use).
3. Optionally add a **Slack notification** and/or **outgoing webhook** for CRM integration.

To **test** Netlify Forms locally, Netlify Forms only activate after deployment — local form submissions will not show up in the dashboard.

---

## Customizing Brand Colors / Fonts

Edit `tailwind.config.mjs`:

```js
colors: {
  cream: '#EBE5D5',
  charcoal: '#2C3338',
  copper: '#B08355',
  rope: '#8B6F4E',
  ink: '#1A1D20',
},
fontFamily: {
  display: ['Oswald', ...],
  body: ['Inter', ...],
},
```

Fonts are loaded via Google Fonts in `src/styles/global.css`. Swap the import URL if you change the font choice.

---

## Deploying to Netlify

The repo is set up to be imported directly into Netlify via GitHub:

1. **Push** this repo to GitHub.
2. Netlify dashboard → **Add new site → Import an existing project**.
3. Authorize GitHub and pick the `longhorn-supply` repo.
4. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy**.
6. After the first successful deploy:
   - Set a custom domain (e.g. `longhornsupply.com`) under **Site settings → Domain management**.
   - Enable Forms email notifications (see above).

---

## TODO — Future Integrations

- [ ] **High-risk payment processor.** Replace the quote-only flow with a checkout. Candidates: NMI, Authorize.net (with a high-risk acquirer), CCBill, Square (selectively), or crypto (Coinbase Commerce, BitPay). The TODO comment in `src/pages/quote-request.astro` marks the right place to integrate.
- [ ] **Real COA PDFs.** Upload per-lot COAs to a CDN or to `public/coa/`; populate `coaUrl` on each product's frontmatter.
- [ ] **Analytics.** Add Plausible, Fathom, or GA4 in `src/layouts/BaseLayout.astro` `<head>`. Update the CSP in `netlify.toml` if you add third-party scripts.
- [ ] **Expanded JSON-LD.** Add `AggregateRating`, `Brand`, and `Offer` price ranges once pricing is published. Add `BreadcrumbList` schema on product pages.
- [ ] **Account login.** If recurring institutional customers want saved addresses, add Netlify Identity or an auth-only side service.
- [ ] **Search.** Add Pagefind or a small client-side index over the product collection.
- [ ] **Favicons.** Generate full favicon set (`.ico`, multiple PNG sizes, `apple-touch-icon.png`) from `public/logo.png`; right now `logo.png` is reused as the favicon.

---

## License

All rights reserved. The logo and brand are property of Longhorn Supply & Provision.
