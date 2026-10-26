# BYzone construction

Marketing site for BYzone construction — handyman work, windows and doors
installation, and home renovation in the Ottawa area.

- Live: https://avergeichik.github.io/BYzone/
- Target domain: byzoneconstruction.ca (transfer pending)

## Stack

- **Vite 5** + **React 18**, Tailwind CSS 3
- **vite-prerender-plugin** renders the page to static HTML at build time, so
  crawlers get real content from a static host
- **react-helmet-async** owns the `<head>` tags
- Deployed to **GitHub Pages** from the `gh-pages` branch
- The quote form posts to a **Cloudflare Worker** (`worker/`) that forwards
  each request to the workers' Telegram group and to email via Resend

## Local development

```bash
npm install
cp .env.example .env    # then fill it in, see below
npm start               # http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build into dist/
npm run preview    # serve dist/ exactly as it will be published
npm run images     # regenerate the web-sized photos in public/ from photos/
```

There is no test suite.

## Deployment

Pushing to `main` deploys. The workflow in `.github/workflows/deploy.yml` builds
the site and publishes it to GitHub Pages. There is no deploy command to run by
hand and nothing is ever published from a working tree. It can also be started
from the Actions tab by anyone with write access to the repository.

Build-time values come from repository variables, under
Settings -> Secrets and variables -> Actions: `VITE_BASE`,
`VITE_GOOGLE_PLACE_ID` and `VITE_API_URL` — the same names `.env` uses
locally. They are variables rather than secrets because each one ends up in
the built bundle where anyone can read it. Nothing that needs protecting is
built into the site: the Places key lives in the Worker.


The build fails if the asset paths it produces do not match `VITE_BASE`, so a
base-path mistake stops the deploy instead of shipping a blank page.

## Environment

All values are read from `.env`, which is git-ignored. `.env.example` lists
them.

| Variable | Purpose |
|---|---|
| `VITE_BASE` | Path the site is served from. `/BYzone/` for the GitHub Pages project URL, `/` for the custom domain. Getting this wrong leaves the page unable to load its own assets. |
| `VITE_GOOGLE_PLACE_ID` | The business's Google place ID. Only used to build the "see all reviews" link; not a credential. |
| `VITE_API_URL` | Absolute URL of the Worker. **Required** — the quote form posts to `/quote` and the reviews section reads `/reviews`. Without it the form refuses to submit and says so rather than posting into the void, and the reviews section hides itself. |


## Layout

```
index.html                     Vite template. Its <title> and <meta> are
                               placeholders — Helmet overwrites them.
src/index.jsx                  Client entry plus the prerender() export
src/App.jsx                    Shell: nav, routed content, footer
src/routes/Home.jsx            The only page; owns the real <head> tags
src/components/sections/       One file per section of the page
public/                        Copied verbatim into the build
worker/                        Cloudflare Worker behind the quote form,
                               deployed separately — see worker/README.md
```

## Things that will trip you up

**The `<head>` lives in `Home.jsx`, not `index.html`.** The prerender replaces
the template's `<title>` and meta tags with Helmet's, and hydration does it
again in the browser. Editing `index.html` alone changes nothing a visitor
sees. Keep the two in step anyway so the template is not misleading.

**`VITE_BASE` must match where the site is served.** The build writes absolute
asset paths. A build made for `/` and published to `/BYzone/` loads its HTML
and then 404s on every script and stylesheet — a blank page with no error.

**Anything the site serves has to live in `public/`.** The deploy publishes
exactly what the build produces, so a file that exists only on the live site —
a `CNAME`, say — is gone the next time the workflow runs unless `public/` has
it too.

**Photos are served from `public/` with their original names.** The gallery
lists them explicitly in `GallerySection.jsx`; the folder name contains a
space and the extensions are mixed case, both of which the URLs must match
exactly, since Pages is case-sensitive.
