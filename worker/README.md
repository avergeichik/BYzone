# Quote form endpoint

A Cloudflare Worker that receives quote requests from the site and sends them
to the workers' Telegram group and to email, in parallel. It exists because the
site is static: this is the only place that can hold a secret, and the Telegram
bot token must never reach a browser.

Hosting does not change. The site stays on GitHub Pages; only the form posts
here.

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
```

**4. Deploy**

```bash
npx wrangler deploy
```

It prints the URL, something like
`https://byzone-quote.<your-subdomain>.workers.dev`.

**5. Point the site at it**

Add that URL as a repository variable named `VITE_QUOTE_API_URL`, under
Settings -> Secrets and variables -> Actions, then re-run the deploy workflow.
Put the same line in your local `.env` to test from `npm start`.

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
