// The site is static, so this worker is everything behind it.
//
//   POST /quote    a quote request, fanned out to Telegram and email in
//                  parallel; one failing does not lose the other.
//   GET  /reviews  the Google reviews the page shows, fetched here so the
//                  API key stays out of the browser and so Google is called
//                  a few times a day rather than once per visitor.
//
// The site is static, so this is the only piece of the system that can hold a
// secret. The Telegram bot token in particular must never reach the browser —
// it grants full control of the bot.

const LIMITS = {
  name: 100,
  phone: 40,
  email: 150,
  service: 80,
  message: 2000,
  preferredContact: 20,
};

const MAX_BODY_BYTES = 16 * 1024;

const json = (status, body, headers) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    // Echo the origin only when we recognise it; otherwise send back the first
    // allowed one, which makes the browser block the response.
    'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0] || 'null',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function validate(payload) {
  const fields = {
    name: clean(payload.name, LIMITS.name),
    phone: clean(payload.phone, LIMITS.phone),
    email: clean(payload.email, LIMITS.email),
    service: clean(payload.service, LIMITS.service),
    message: clean(payload.message, LIMITS.message),
    preferredContact: clean(payload.preferredContact, LIMITS.preferredContact),
  };

  if (!fields.name) return { error: 'name is required' };
  if (!fields.email) return { error: 'email is required' };
  // Deliberately loose: the point is to catch typos, not to adjudicate RFC 5322.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return { error: 'email looks invalid' };

  return { fields };
}

async function sendTelegram(fields, env) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    throw new Error('Telegram is not configured');
  }

  const lines = [
    '<b>New quote request</b>',
    '',
    `<b>Name:</b> ${escapeHtml(fields.name)}`,
    fields.phone ? `<b>Phone:</b> ${escapeHtml(fields.phone)}` : null,
    `<b>Email:</b> ${escapeHtml(fields.email)}`,
    fields.service ? `<b>Service:</b> ${escapeHtml(fields.service)}` : null,
    fields.preferredContact ? `<b>Prefers:</b> ${escapeHtml(fields.preferredContact)}` : null,
    '',
    escapeHtml(fields.message || '(no message)'),
  ].filter((line) => line !== null);

  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      text: lines.join('\n'),
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram ${response.status}: ${await response.text()}`);
  }
}

async function sendEmail(fields, env) {
  if (!env.RESEND_API_KEY) throw new Error('Resend is not configured');

  const row = (label, value) =>
    `<tr><td style="padding:8px 0;color:#6b7280;width:160px;">${label}</td>` +
    `<td style="padding:8px 0;font-weight:600;">${escapeHtml(value)}</td></tr>`;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;color:#111827;">
      <h2 style="color:#1B3A6B;margin:0 0 16px;">New quote request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        ${row('Name', fields.name)}
        ${fields.phone ? row('Phone', fields.phone) : ''}
        ${row('Email', fields.email)}
        ${fields.service ? row('Service', fields.service) : ''}
        ${fields.preferredContact ? row('Preferred contact', fields.preferredContact) : ''}
      </table>
      <p style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:12px 16px;
                margin:16px 0 0;white-space:pre-wrap;font-size:15px;">${escapeHtml(
                  fields.message || '(no message)'
                )}</p>
    </div>
  `.trim();

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.QUOTE_FROM_EMAIL,
      to: (env.QUOTE_TO_EMAIL || '').split(',').map((s) => s.trim()).filter(Boolean),
      reply_to: fields.email,
      subject: `New quote request — ${fields.name}${fields.service ? ` (${fields.service})` : ''}`,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
}

// How long a fetched set of reviews is reused. Reviews change a few times a
// year, so hours of staleness cost nothing and save every visitor a call to
// a billed Google API.
const REVIEWS_TTL_MS = 6 * 60 * 60 * 1000;

// Module scope: shared by every request an isolate handles, lost when the
// isolate is recycled. That is enough to collapse per-visitor traffic into a
// handful of calls a day. A worker on a custom domain rather than workers.dev
// could use the edge cache and do better still.
let reviewsCache = { at: 0, body: null };

async function loadReviews(env) {
  if (!env.GOOGLE_PLACES_API_KEY || !env.GOOGLE_PLACE_ID) {
    throw new Error("Places is not configured");
  }

  const response = await fetch(`https://places.googleapis.com/v1/places/${env.GOOGLE_PLACE_ID}`, {
    headers: {
      "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      // The key is restricted to this site's referrers, in a Google Cloud
      // project we do not own. A worker sends no Referer of its own, so
      // without this the request is rejected outright. This says the same
      // thing the browser used to say.
      Referer: env.SITE_ORIGIN,
    },
  });

  if (!response.ok) {
    throw new Error(`Places ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  return {
    rating: data.rating ?? null,
    total: data.userRatingCount ?? 0,
    reviews: (data.reviews || []).map((review) => ({
      name: review.authorAttribution?.displayName ?? "Google Reviewer",
      date: review.relativePublishTimeDescription ?? "",
      rating: review.rating ?? 5,
      text: review.text?.text ?? "",
    })),
  };
}

async function reviewsResponse(env, cors) {
  const fresh = Date.now() - reviewsCache.at < REVIEWS_TTL_MS;

  if (!fresh || !reviewsCache.body) {
    try {
      reviewsCache = { at: Date.now(), body: await loadReviews(env) };
    } catch (error) {
      console.error("reviews failed:", error);
      // Serve the last good copy rather than blanking the section over one
      // bad response.
      if (!reviewsCache.body) {
        return json(502, { error: "Could not load reviews" }, cors);
      }
    }
  }

  return json(200, reviewsCache.body, {
    ...cors,
    // Repeat visitors do not even reach the worker.
    "Cache-Control": "public, max-age=1800",
  });
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    if (pathname === '/reviews') {
      if (request.method !== 'GET') return json(405, { error: 'Method not allowed' }, cors);
      return reviewsResponse(env, cors);
    }

    if (request.method !== 'POST') return json(405, { error: 'Method not allowed' }, cors);

    const body = await request.text();
    if (body.length > MAX_BODY_BYTES) return json(413, { error: 'Payload too large' }, cors);

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      return json(400, { error: 'Invalid JSON' }, cors);
    }

    // Second honeypot check. The form does this too, but the form is not the
    // only thing that can post here.
    if (payload.company) return json(200, { ok: true }, cors);

    const { error, fields } = validate(payload);
    if (error) return json(400, { error }, cors);

    const [telegram, email] = await Promise.allSettled([
      sendTelegram(fields, env),
      sendEmail(fields, env),
    ]);

    for (const [channel, result] of [['telegram', telegram], ['email', email]]) {
      if (result.status === 'rejected') console.error(`${channel} failed:`, result.reason);
    }

    // One channel is enough for the enquiry to reach someone. Only report
    // failure when the request has genuinely gone nowhere.
    const delivered = telegram.status === 'fulfilled' || email.status === 'fulfilled';
    if (!delivered) return json(502, { error: 'Could not deliver the request' }, cors);

    return json(200, {
      ok: true,
      delivered: { telegram: telegram.status === 'fulfilled', email: email.status === 'fulfilled' },
    }, cors);
  },
};
