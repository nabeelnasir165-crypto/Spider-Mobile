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

Create these in **Supabase → Authentication → Users → Add user** (email + password, "Auto-confirm" enabled). The admin role grant uses one SQL line.

### Customer
```
Email:    demo-customer@spidermobiles.co.uk
Password: SpiderDemo2026!
```

### Admin
```
Email:    demo-admin@spidermobiles.co.uk
Password: SpiderDemoAdmin2026!
```

After creating the admin user, run this once in **Supabase → SQL Editor** to grant the role:

```sql
update public.profiles
   set role = 'admin'
 where id = (select id from auth.users where email = 'demo-admin@spidermobiles.co.uk');
```

---

## 3. Customer golden-path script (≈3 min)

1. **Home** — point at the hero scroll-video as you scroll: the rendered frame changes with scroll position. WhatsApp floating button is the green pill bottom-right.
2. **Refurbished** — filter by Brand → Apple. Each card carries a real specs block (storage, display, chip) + Excellent / Very Good / Good condition pill + 12-month warranty pill.
3. Click **Add to bag** on an iPhone — the cart drawer slides in from the right with a live subtotal.
4. **Checkout** → 4 steps:
   - **Contact** — pre-fills from the signed-in profile.
   - **Delivery** — Collect (free), UK Standard (free over £100), UK Express (£9.99).
   - **Payment** — Card via Stripe / Cash on collection (only available with Collect). Stripe banner clearly marks "Demo mode" until a Stripe key is added.
   - **Review** — single button places the order.
5. **Order confirmation** — branded order-ref panel, items, delivery + payment summary, contact info. The customer's order is saved to localStorage + Supabase (`orders` table with RLS).
6. **Book a repair** — `/book` → 5-step wizard: Brand → Model (60 individual models across 6 brands, scrollable) → Issue → When → Confirm. Booking is persisted to Supabase `bookings`; the customer sees it on `/track` and `/account`.
7. **Mobile** — resize the browser to 375px or open on a phone. The navbar collapses into a focus-trapped drawer, the cart drawer becomes full-width, checkout stacks. The Book Repair sticky CTA auto-hides on form pages so it doesn't cover the submit button.

---

## 4. Admin golden-path script (≈3 min)

Login at `/login` as **demo-admin** → redirects to **/admin**.

1. **Dashboard** — today's repairs, revenue, pending payments, ready-for-pickup, new bookings; alert card for overdue invoices.
2. **Repairs** — full ticket table with search, status/payment/date filters, CSV export. Click any row → ticket detail with status timeline + notes thread.
3. **Customers** — searchable database; customer cards stack on mobile.
4. **Bookings** — website bookings (from the booking wizard above). One-click **Convert to Ticket** pre-fills the New Ticket form with the customer + device.
5. **Pricing** — repair price book across ~42 models × Screen / Battery / Charging Port / Back Glass. Edits save live to Supabase `device_pricing` (admin-only RLS).
6. **CMS** — edit homepage hero copy, FAQs, promo banner, contact, inventory, app settings. All sections persist to Supabase `cms_content`.
7. **Payments / Warranty / Staff / Settings** — sample data, fully editable.
8. **New Repair Ticket** — `+ New Repair` in the sidebar opens the same form. Issue chips toggle blue; saves to `tickets` + writes a first note.
9. **Mobile** — collapse to 375px. The sidebar becomes a hamburger drawer; tables horizontal-scroll inside their cards; the top bar compresses (title trims, profile loses label).

---

## 5. What's stubbed (and how to switch on)

| Feature                  | Current state                                                                                        | Switch on by                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Stripe checkout**      | Order saved; UI shows "Demo mode — we'll email you a payment link"                                   | Add `VITE_STRIPE_PUBLISHABLE_KEY` (client) + `STRIPE_SECRET_KEY` (Supabase secret) + deploy a `create-checkout-session` Edge Function; `placeOrder()` already detects the key. |
| **WhatsApp number**      | Placeholder `+44 7700 900000`                                                                        | Edit one line in `src/components/WhatsAppButton.jsx` (constant `WA_NUMBER`).                                 |
| **Order email receipts** | Skipped (Supabase Edge Function exists but SMTP not configured)                                      | Configure SMTP in Supabase Auth settings (Resend, SendGrid or own SMTP) — Edge Function already wired.       |
| **Admin profile photo**  | Placeholder Google avatar URL in TopNavBar                                                           | Replace `src="https://lh3..."` in `src/components/Layout.jsx` (TopNavBar) with the real user's avatar.       |
| **Phone number on site** | `01332 000 000` placeholder in Navbar + Footer; real one (`01332 986446`) in CMS contact section.    | Update the navbar/footer phone or sync them from `cmsContent.contact.phone`.                                 |
| **Demo orders/bookings** | A few mock tickets / customers / bookings are seeded for the admin to feel populated.                | Real data flows in as soon as customers use `/book` and `/checkout`; mock entries can be deleted in Supabase. |

---

## 6. Known polish items (non-blocking)

- A few accessory product photos reuse the category image (e.g. all four cases share one shot) — fine for the demo; swap to product-specific shots later.
- The hero scroll-video first frame paints fast (~50 KB); the remaining 112 frames pre-cache in the background via `requestIdleCallback`.
- Customer signup goes through Supabase Auth — set "Confirm email" off in the project's Auth settings if the client wants the smoothest demo (no inbox round-trip).

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
