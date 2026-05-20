# Deployment — Spider Mobiles

The repo builds **two separate apps from one codebase**, decided by the `VITE_BUILD_TARGET` env var:

| Target | Domain | What ships | Output dir |
|---|---|---|---|
| `site`  | `spidermobiles.co.uk`        | Customer marketing + e-commerce | `dist-site/` |
| `admin` | `admin.spidermobiles.co.uk`  | Hybrid Repair Suite back-office | `dist-admin/` |
| *(unset)* | n/a — local development only | Both apps in one bundle         | `dist/` |

Each target lives on its **own domain**, has its **own deploy**, its **own cookies**, and its **own response headers**. That's the security boundary — see [ADR-001](#) for the trade-off analysis.

## Local development

```bash
npm install

# Single-app dev (customer site at :5173)
npm run dev

# Two servers, two ports, two targets — closest to production
npm run dev:both
#   → http://localhost:5173/      (customer site)
#   → http://localhost:5180/admin (admin dashboard)
```

`dev:both` runs each target with the right `--mode` flag so `VITE_BUILD_TARGET` is loaded from `.env.site` / `.env.admin`.

## Production builds

```bash
npm run build:site    # → dist-site/
npm run build:admin   # → dist-admin/
npm run build:both    # both, sequentially
```

Smoke-test a build locally before deploying:

```bash
npm run build:admin
npx serve dist-admin -l 5180
```

## Vercel (recommended) — two projects, one repo

The same GitHub repo (`nabeelnasir165-crypto/Spider-Mobile`) backs two Vercel projects. Each project sets its own build command and lives on its own domain.

### Project 1 — Customer site

| | |
|---|---|
| **Project name** | `spider-mobiles-site` |
| **Framework preset** | Vite |
| **Build command** | `npm run build:site` |
| **Output directory** | `dist-site` |
| **Production domain** | `spidermobiles.co.uk` + `www.spidermobiles.co.uk` (force www → apex) |
| **Env vars (production)** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

### Project 2 — Admin dashboard

| | |
|---|---|
| **Project name** | `spider-mobiles-admin` |
| **Framework preset** | Vite |
| **Build command** | `npm run build:admin` |
| **Output directory** | `dist-admin` |
| **Production domain** | `admin.spidermobiles.co.uk` |
| **Env vars (production)** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

> **Both projects share the same Supabase project**, so the env vars are identical. Set them in each Vercel project's Settings → Environment Variables.

### DNS

In your domain registrar (or Cloudflare):

```
spidermobiles.co.uk         A      → Vercel
www.spidermobiles.co.uk     CNAME  → cname.vercel-dns.com
admin.spidermobiles.co.uk   CNAME  → cname.vercel-dns.com
```

Vercel verifies each domain in its own project. SSL is auto-provisioned.

### Admin-only response headers (recommended)

In the admin Vercel project, add `vercel.json` to apply hardening headers to every response:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Robots-Tag", "value": "noindex, nofollow, noarchive" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "no-referrer" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

The build already injects `<meta name="robots" content="noindex, nofollow, noarchive">` into the admin HTML — the HTTP header above is an additional layer for non-HTML responses (e.g. JSON API endpoints, assets).

### SPA fallback (both projects)

React Router needs every unknown path to fall back to `index.html`. Vercel does this automatically for Vite projects. If you ever switch hosts, add this rewrite rule.

## Netlify (alternative)

Same idea — two sites, one repo. In each site's settings:

| Setting | Site value | Admin value |
|---|---|---|
| Build command | `npm run build:site` | `npm run build:admin` |
| Publish directory | `dist-site` | `dist-admin` |

Add `_redirects` in `public/` (or write `netlify.toml`) for SPA fallback:

```
/*  /index.html  200
```

Apply admin headers via `netlify.toml` on the admin site:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Robots-Tag = "noindex, nofollow, noarchive"
    X-Frame-Options = "DENY"
```

## Optional hardening — IP allowlist on admin

If you want only your shop's IP range to reach the admin dashboard:

- **Vercel Pro**: Project Settings → Firewall → IP Blocking → allow only your IPs
- **Cloudflare** (any host): Access policy on `admin.spidermobiles.co.uk` requiring email + IP match

Skip this until you're sure you'll always log in from the same network — easy to lock yourself out of the dashboard when travelling.

## Cookies & auth across the two subdomains

Out of the box, Supabase sets the auth cookie scoped to the *exact* origin — so logging in at `admin.spidermobiles.co.uk` does **not** sign you in at `spidermobiles.co.uk` and vice versa. **This is the intended behaviour** — keep it. Admins log into the admin app; customers log into the customer app.

If you ever want a single sign-on, point both projects at the same Supabase URL and add a cookie domain config of `.spidermobiles.co.uk`. We're explicitly *not* doing that — separating the cookie scopes is half the point of splitting the apps.

## Branch → preview deploys

Both Vercel projects watch the same GitHub repo. Each branch pushed gets two preview URLs (one per project). PRs get both URLs commented automatically — useful for QA both targets before merging.

## Switching back to a single deploy

If you ever need to merge them again, set neither env var and use `npm run build`. It bundles everything (`dist/`) and serves `/` as customer + `/admin/*` as admin from the same domain — that's the path-prefix layout from before this split. Reversible at any time.

## Bundle-size note

Both `build:site` and `build:admin` currently emit ~225 KB gzipped each — slightly larger than necessary because static `import` statements keep both code paths bundled even when their routes aren't rendered. The **security boundary** (cookies / robots / routes) is enforced regardless. Real DCE (code-split via `React.lazy()`) is a follow-up; the user-facing trade-off is ~70 KB of extra JS on each domain — negligible vs. the security and operational wins.
