# Spider Mobiles · Client Demo Guide

A short, self-contained walkthrough you can share with the client. Covers what's live, what's stubbed, demo credentials, and the golden-path scripts for the customer site and the Hybrid Repair Suite admin.

---

## 1. URLs

| Surface          | URL                                              | Auth                          |
| ---------------- | ------------------------------------------------ | ----------------------------- |
| Customer site    | `https://spider-mobile.vercel.app/` (Vercel `site` project) | Open; signup creates an account |
| Admin dashboard  | `https://spider-mobile-admin.vercel.app/admin` (Vercel `admin` project) | Requires admin role           |
| Supabase project | `https://vhdavoqorjtuvnlrinsg.supabase.co`       | RLS-protected                 |
| GitHub repo      | `https://github.com/nabeelnasir165-crypto/Spider-Mobile` | Auto-deploys to Vercel on `main` |

> Local dev: `npm run dev` → http://localhost:5173

---

## 2. Demo accounts

Both accounts are **already provisioned** in Supabase Auth with `email_confirm: true` (no inbox round-trip). Just sign in.

### Customer
```
Email:    demo-customer@spidermobiles.co.uk
Password: SpiderDemo2026!
```

### Admin (full Hybrid Repair Suite access)
```
Email:    demo-admin@spidermobiles.co.uk
Password: SpiderDemoAdmin2026!
```

The admin's role is granted via `public.customer_profiles.is_admin = true`; the SECURITY DEFINER `is_admin()` function gates every write policy in the dashboard.

---

## 3. Customer golden-path script (≈4 min)

1. **Home** — point at the hero scroll-video as you scroll: the rendered frame changes with scroll position. Headline copy ("Fast. Trusted. Repairs.") is editable in the admin CMS — see §4.6 for the live edit moment. WhatsApp floating button is the green pill bottom-right.
2. **Refurbished** — filter by Brand → Apple. Each card carries a real specs block (storage, display, chip) + Excellent / Very Good / Good condition pill + 12-month warranty pill. Breadcrumb `Home > Refurbished` sits under the navbar.
3. Click **Add to bag** on an iPhone — the cart drawer slides in from the right with a live subtotal.
4. **Checkout** → 4 steps (open to guests, no signup required):
   - **Contact** — pre-fills from the signed-in profile if any.
   - **Delivery** — Collect (free), UK Standard (free over £100), UK Express (£9.99).
   - **Payment** — Card via Stripe / Cash on collection (Collect only). Stripe banner marks "Demo mode" until a key is added; flipping it to live is one config change (see §5).
   - **Review** — single button places the order.
5. **Order confirmation** — branded order-ref panel, items, delivery + payment summary. Order persisted to localStorage + Supabase `orders` (RLS-scoped to the buyer).
6. **Book a repair** — `/book` is open to guests too. 5-step wizard: Brand → Model (60 individual models, scrollable) → Issue → When → Confirm. Guests fill in name/email/phone inline at Confirm; signed-in users skip it. Booking persists to Supabase `bookings`; the customer sees it on `/track` and `/account`.
7. **Account** (signed-in) — `/account` shows two history sections: **bookings** (with status pill + progress bar) and **orders** (with item preview pills + payment status). Edit profile inline on the right.
8. **FAQ** — `/repairs` has an animated accordion FAQ at the bottom, content driven by Supabase `cms_content.faqs` so the admin can edit it.
9. **Mobile** — resize to 375px or open on a phone. The navbar collapses into a focus-trapped drawer, the cart drawer becomes full-width, checkout stacks. Book Repair sticky CTA auto-hides on form pages.

---

## 4. Admin golden-path script (≈3 min)

Login at `/login` as **demo-admin** → redirects to **/admin**.

1. **Dashboard** — today's repairs, revenue, pending payments, ready-for-pickup, new bookings; alert card for overdue invoices.
2. **Repairs** — full ticket table with search, status/payment/date filters, CSV export. Click any row → ticket detail with status timeline + notes thread.
3. **Customers** — searchable database; customer cards stack on mobile. Skeleton loader while the Supabase query resolves.
4. **Bookings** — website bookings (from the booking wizard above). Skeleton table rows while loading. One-click **Convert to Ticket** pre-fills the New Ticket form with the customer + device.
5. **Pricing** — repair price book across ~42 models × Screen / Battery / Charging Port / Back Glass. Skeleton cards while loading. Edits save live to Supabase `device_pricing`.
6. **CMS — the magic moment** — edit `Homepage Hero` → change `Headline · top line` from "Fast. Trusted." to anything → Save → refresh the public homepage in another tab — it updates live. Same for the gradient `Headline · accent`, status pill, subheading and CTA label. FAQs / promotions / contact / inventory all persist similarly.
7. **Payments / Warranty / Staff / Settings** — sample data, fully editable.
8. **New Repair Ticket** — `+ New Repair` in the sidebar opens the same form. Issue chips toggle blue; saves to `tickets` + writes a first note.
9. **Profile chip (top-right)** — gradient initials derived from the signed-in user's name + the user's display name. Clean, no placeholder avatar URL.
10. **Mobile** — collapse to 375px. The sidebar becomes a hamburger drawer; tables horizontal-scroll inside their cards; the top bar compresses (title trims, profile loses label).

---

## 5. What's stubbed (and how to switch on)

| Feature                  | Current state                                                                                        | Switch on by                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Stripe checkout**      | Code wired + Edge Function written (`supabase/functions/create-checkout-session`). UI shows "Demo mode — we'll email you a payment link" until activated. | 1) `supabase functions deploy create-checkout-session --no-verify-jwt` <br> 2) Set `STRIPE_SECRET_KEY` in Supabase secrets <br> 3) Set `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel + redeploy. `placeOrder()` auto-detects the key and switches to live redirect. |
| **WhatsApp number**      | Placeholder `+44 7700 900000`                                                                        | Edit one line in `src/components/WhatsAppButton.jsx` (constant `WA_NUMBER`).                                 |
| **Order email receipts** | Skipped (Supabase Edge Function `send-booking-email` exists but SMTP not configured).                | Configure SMTP in Supabase Auth settings (Resend, SendGrid or own SMTP) — Edge Function already wired.       |
| **Analytics**            | `<Analytics />` component scaffolded but inactive (env var unset, 0 scripts injected).               | Set `VITE_ANALYTICS_DOMAIN=spidermobiles.co.uk` in Vercel (optionally `VITE_ANALYTICS_SRC` for self-hosted). Plausible loader auto-injects + fires SPA pageviews on route change. |
| **Social media links**   | Footer Instagram / Facebook / X icons disabled with "Coming soon" tooltip.                           | Edit `src/components/Footer.jsx` — replace the disabled `<span>` triple with real anchor `<a>` tags.         |
| **Demo orders/bookings** | A few mock tickets / customers / bookings are seeded for the admin to feel populated.                | Real data flows in as soon as customers use `/book` and `/checkout`; mock entries can be deleted in Supabase. |

---

## 6. Known polish items (non-blocking)

- A few accessory product photos reuse the category image (e.g. all four cases share one shot) — fine for the demo; swap to product-specific shots later.
- The hero scroll-video first frame paints fast (~50 KB); the remaining 112 frames pre-cache in the background via `requestIdleCallback`.
- Customer signup goes through Supabase Auth — set "Confirm email" off in the project's Auth settings if the client wants the smoothest demo (no inbox round-trip).

## 6b. SEO and discovery

- **Per-page `<title>` + `description`** for every route in `src/components/SEO.jsx`.
- **og:image** — 1200×630 PNG at `public/og-image.png` (referenced from social meta tags) so previews work on LinkedIn / WhatsApp / Slack.
- **LocalBusiness JSON-LD** auto-injected on every page (name, address, phone, hours, geo, aggregate rating 4.9). Validates in Google's Rich Results Test.
- **BreadcrumbList JSON-LD** emitted per page by `<Breadcrumbs />` so search engines render breadcrumb trails.

---

## 7. Architecture cheat-sheet (one screen)

```
┌────────────── Vercel ──────────────┐      ┌────────── Supabase ─────────┐
│  spider-mobile          (apex)      │      │  Auth (RLS-aware)            │
│  └─ dist-site/            'site'     │ ──→  │  Postgres                    │
│  spider-mobile-admin   (subdomain)  │      │    profiles, bookings,       │
│  └─ dist-admin/         'admin'      │      │    tickets, ticket_notes,    │
└────────────────────────────────────┘      │    device_pricing, staff,    │
                                              │    cms_content, orders        │
                                              │  Edge Functions               │
                                              │    send-booking-email         │
                                              └─────────────────────────────┘
```

- Two Vercel projects, both built from the same monorepo: one with `VITE_BUILD_TARGET=site`, one with `VITE_BUILD_TARGET=admin`. Routes are conditionally bundled so the site bundle doesn't include admin code (or vice versa).
- Each route is `React.lazy()` code-split; vendor splits (`react-vendor`, `motion-vendor`, `supabase-vendor`, `icons-vendor`) cache long-term.
- Admin RLS gates writes behind a SECURITY DEFINER `is_admin()` function; customers can only read their own bookings / orders.

---

## 8. Useful runtime data

- Mock seed data lives in `src/data/admin.js` (used when Supabase fetch fails or returns 0 rows).
- Live order data shape: see `src/pages/Checkout.jsx` `buildOrder()` + `supabase/migrations/20260523_orders.sql`.
- Build commands:
  - `npm run dev`           — combined local dev server (port 5173)
  - `npm run build:site`    — produces `dist-site/`
  - `npm run build:admin`   — produces `dist-admin/`
