# Threat model

Scope: a static single-page application (React, built by Vite) served by
nginx or Netlify. It makes no network requests of its own, holds no user data
and has no accounts. The interesting surface is what it loads and how it is
served.

## What it holds

Nothing. All data is generated in the browser at page load. There are no
secrets in the repository (CI checks that no `.env` is tracked and runs
gitleaks on history).

## Threats

### T1 — Third-party resources at runtime *(was open)*

The grain overlay was fetched from `grainy-gradients.vercel.app` on every
page load: an unrelated site that could change the asset, go away, or log
visitors. **Controls.** The texture is an inline SVG data URI. CI fails if the
built bundle references any host other than Google Fonts. **Residual.** The
fonts still come from `fonts.googleapis.com`/`fonts.gstatic.com`; self-host
them to remove the last external dependency.

### T2 — Missing browser hardening headers

A static host serves whatever it is told. **Controls.** `nginx.conf` and
`netlify.toml` set `Content-Security-Policy` (scripts `'self'` only, no
`connect-src` beyond `'self'`, `frame-ancestors 'none'`),
`X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy`; the
container job checks two of them. **Residual.** `style-src 'unsafe-inline'`
remains for the inline styles motion libraries and Tailwind arbitrary values
produce.

### T3 — Vulnerable build toolchain

`npm audit` reported 10 high advisories in the committed lockfile. **Controls.**
`npm audit fix` and the move to Vite 6 for the esbuild dev-server advisory;
CI runs `npm audit --audit-level=high` and fails on new ones. **Residual.**
Advisories in dev tooling do not reach the served bundle, but the audit is
kept blocking so the lockfile does not rot again.

### T4 — Container runs as root

**Controls.** The image is `nginx-unprivileged` with `USER 10001`; the
container job asserts the uid. Nothing in the image needs to write.

## Not addressed

- Nothing here authenticates, stores or transmits user data, so the usual
  web-app threats (injection, session handling, access control) have no
  surface yet. They will the moment a real `DataSource` talks to a backend;
  that backend needs its own model.
