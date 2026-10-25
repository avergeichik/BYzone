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
- The quote form posts to an **AWS Lambda** (`api/send-quote.js`, deployed with
  Serverless Framework) that emails submissions through SES

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
npm run deploy     # build, then force-push dist/ to the gh-pages branch
```

There is no test suite.

## Environment

All values are read from `.env`, which is git-ignored. `.env.example` lists
them.

| Variable | Purpose |
|---|---|
| `VITE_BASE` | Path the site is served from. `/BYzone/` for the GitHub Pages project URL, `/` for the custom domain. Getting this wrong leaves the page unable to load its own assets. |
| `VITE_GOOGLE_PLACES_API_KEY` | Google Places key for the live reviews. Ends up in the built bundle, so restrict it by HTTP referrer. |
| `VITE_GOOGLE_PLACE_ID` | The business's Google place ID. |
| `VITE_QUOTE_API_URL` | Absolute URL of the quote-form endpoint. Required in production: the default `/api/send-quote` only works behind a server that proxies it. |

## Layout

```
index.html                     Vite template. Its <title> and <meta> are
                               placeholders — Helmet overwrites them.
src/index.jsx                  Client entry plus the prerender() export
src/App.jsx                    Shell: nav, routed content, footer
src/routes/Home.jsx            The only page; owns the real <head> tags
src/components/sections/       One file per section of the page
public/                        Copied verbatim into the build
api/send-quote.js              Lambda handler for the quote form
serverless.yml                 Its deployment config
```

## Things that will trip you up

**The `<head>` lives in `Home.jsx`, not `index.html`.** The prerender replaces
the template's `<title>` and meta tags with Helmet's, and hydration does it
again in the browser. Editing `index.html` alone changes nothing a visitor
sees. Keep the two in step anyway so the template is not misleading.

**`VITE_BASE` must match where the site is served.** The build writes absolute
asset paths. A build made for `/` and published to `/BYzone/` loads its HTML
and then 404s on every script and stylesheet — a blank page with no error.

**`npm run deploy` replaces the `gh-pages` branch wholesale.** It builds from
the working tree, not from what is committed, and `gh-pages -d dist` removes
anything in the branch that is not in `dist/`. So: commit first, pull first,
and remember that a file only present in the branch (a `CNAME`, say) is gone
after the next deploy unless it also lives in `public/`.

**Photos are served from `public/` with their original names.** The gallery
lists them explicitly in `GallerySection.jsx`; the folder name contains a
space and the extensions are mixed case, both of which the URLs must match
exactly, since Pages is case-sensitive.
