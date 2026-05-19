# Contributing

How to make changes to Spider Mobiles Derby.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run lint     # eslint
```

Live preview, hot-reload, and source maps are enabled in dev.

## Branch & PR workflow

We **don't push directly to `main`** anymore. Every change goes through a pull request.

```bash
git checkout main
git pull
git checkout -b feat/your-feature
# … make changes …
git add .
git commit -m "feat: short imperative description"
git push -u origin feat/your-feature
```

Then open a PR against `main`:

- **Title:** under 70 chars, imperative tense (`Add cookie banner`, not `Added cookie banner`)
- **Body:** what changed, why, and any reviewer notes (screenshots help for UI changes)
- **Wait for the Build check** to go green before merging
- Prefer **Squash & merge** to keep `main` linear

## Branch naming

| Prefix | For |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `chore/` | Tooling, deps, config |
| `docs/` | Documentation only |
| `refactor/` | Internal refactor with no behaviour change |
| `perf/` | Performance |

## Commit messages

Short imperative subject (no period). Optionally followed by a blank line and a body explaining *why*.

```
feat: add mobile-number field to signup

Customers need to provide a UK mobile so we can send SMS status
updates. Validated client-side and normalised to +44 on save.
```

## CI

[`.github/workflows/build.yml`](.github/workflows/build.yml) runs `npm ci` + `npm run build` on every PR. **A red build blocks merging.**

## Secrets — never commit

- `.env.local` — Supabase URL/anon key
- SMTP credentials — live in Supabase secrets, not the repo
- OAuth client secrets — in Supabase Auth dashboard

`.gitignore` already excludes `.env*`. Double-check before you commit.

## Reviewing checklist

- [ ] Build is green
- [ ] Lighthouse score didn't regress (run on the deploy preview)
- [ ] No new console errors in dev
- [ ] Mobile layout checked at 375px
- [ ] No hardcoded secrets / API keys
