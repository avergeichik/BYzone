# Site API

A Cloudflare Worker, the only piece of the system that can hold a secret —
the site itself is static.

| Route | |
|---|---|
| `POST /quote` | A quote request. Goes to the workers' Telegram group and to email, in parallel; one channel failing does not lose the other. |
| `GET /reviews` | The Google reviews the page shows, cached for six hours. |

The Telegram bot token must never reach a browser: it grants full control of
the bot. The Places key is here for a different reason — in the browser it was
public and every visitor spent a billed API call on it.

Hosting does not change. The site stays on GitHub Pages; only these two calls
come here.

## One-time setup

From this directory.

**1. Sign in to Cloudflare**

```bash
npx wrangler login
```

**2. Find the group's chat ID**

Add the bot to the group, send any message there, then open this in a browser
with your own token substituted in:

```
https://api.telegram.org/bot<TOKEN>/getUpdates
```

Look for `"chat":{"id":-1001234567890` — group IDs are negative, and that whole
number including the minus sign is the chat ID.

**3. Store the secrets**

Each command prompts for the value and stores it encrypted at Cloudflare. None
of them is written to this repository.

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put GOOGLE_PLACES_API_KEY
```

The Places key is restricted by HTTP referrer in a Google Cloud project we do
not own, so the worker sends `SITE_ORIGIN` as the `Referer` — otherwise Google
rejects a request that has no referrer of its own.

**4. Deploy**

```bash
npx wrangler deploy
```

It prints the URL, something like
`https://byzone-quote.<your-subdomain>.workers.dev`.

**5. Point the site at it**

Add that URL as a repository variable named `VITE_API_URL`, with no trailing
slash, under Settings -> Secrets and variables -> Actions, then re-run the
deploy workflow. Put the same line in your local `.env` to test from
`npm start`.

## Redeploying

```bash
npx wrangler deploy
```

Secrets persist; only the code is replaced.

## Configuration

`wrangler.toml` holds the non-secret settings: who the mail goes to, who it is
from, and which origins may call the endpoint.

## The Resend limitation

Until a domain is verified in Resend, it will only deliver to the address the
Resend account was registered with, and only from `onboarding@resend.dev`.
Anything else comes back as `403 You can only send testing emails to your own
email address`.

So `QUOTE_TO_EMAIL` has to stay as the Resend account's own address for now.
Once byzoneconstruction.ca transfers, verify it in Resend, change
`QUOTE_FROM_EMAIL` to an address on that domain, and `QUOTE_TO_EMAIL` can
become any comma-separated list.

Telegram has no such restriction, which is the stronger reason to treat the
group as the primary channel and email as the written record.

## Behaviour worth knowing

- **Both channels are tried in parallel.** One failing does not stop the other.
- **Success means at least one channel worked.** A visitor is only told the
  request failed when it genuinely reached nobody.
- **A filled honeypot returns success without sending anything**, so a bot
  cannot tell its submission was dropped.
- **Failures are logged**, visible with `npx wrangler tail`.
