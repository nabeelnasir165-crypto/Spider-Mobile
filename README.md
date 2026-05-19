# Spider Mobiles Derby

A premium, fully-responsive marketing & e-commerce front-end for **Spider Mobiles Derby** — a UK mobile-repair, refurbished-phone and accessories business.

Apple × Tesla-inspired UI. Mobile-first. Scroll-driven hero. Built with React + Vite + Tailwind + Framer Motion.

## ✨ Features

- **Scroll-driven hero video** — canvas-based playback of 113 frames synced to scroll position
- **Instant Quote engine** — 4-step Brand → Model → Issue → Quote flow with live pricing & ETA
- **Refurbished phone store** — filterable grid by brand, condition and price band
- **Accessories store** — category-filtered with URL state
- **Repair tracker** — animated timeline status (try IDs `SM-2451`, `SM-2469`, `07700900111`)
- **About, Contact, Privacy, Terms** — full informational pages
- **Custom 404 page** — branded, on-route
- **SEO ready** — per-route titles, Open Graph, Twitter Cards, JSON-LD schema, sitemap.xml, robots.txt
- **Accessibility** — visible focus rings, skip-to-content link, ARIA labels, honeypot anti-spam
- **Cookie consent banner** — GDPR-ready, localStorage-backed
- **Premium animations** — Framer Motion page transitions, scroll reveals, marquee reviews

## 🧰 Tech stack

| | |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v3 + custom design tokens |
| Animation | Framer Motion |
| Icons | Lucide React |
| Routing | React Router v7 |

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve production build
```

## 📁 Structure

```
src/
├── components/    # Navbar, Footer, Layout, PageHeader, SEO, CookieBanner, Section
├── sections/      # Homepage sections (HeroScroll, InstantQuote, ServicesGrid, …)
├── pages/         # Top-level route pages
├── data/          # Mock data — products, repairs, track, reviews
public/
├── hero-frames/   # 113 scroll-video frames
├── favicon.svg
├── og-image.svg
├── robots.txt
└── sitemap.xml
```

## 📋 Pre-launch checklist status

See [Website Launch Checklist](https://github.com/nabeelnasir165-crypto/Spider-Mobile) — current score 57 / 73, remaining items require deployment (custom domain, SSL, GA4, form backend).

## 📝 License

Private — Spider Mobiles Derby.
