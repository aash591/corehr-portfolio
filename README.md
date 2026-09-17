# Core HR Management — website

A single-file, dependency-free marketing site. `index.html` contains all the
markup, styles and behaviour. Local WebP photographs and brand assets are stored
alongside it; no external image service is needed.
It is a static site, so every free host below works without a build step.

```
index.html          the site
assets/config.js    site settings — contact details and form delivery (edit this)
logo.webp           brand lockup (the header crops the emblem out of it)
404.html            not-found page
robots.txt          crawler rules  ← update the Sitemap host before launch
sitemap.xml         sitemap        ← update <loc> before launch
_headers            security + cache headers (Cloudflare Pages / Netlify)
vercel.json         the same, for Vercel
.nojekyll           stops GitHub Pages running the files through Jekyll
favicon.ico         16/32/48 icons, cropped from logo.webp
icon-*.png          the same at 16 / 32 / 192 / 512
apple-touch-icon.png  180px home-screen icon
tools/              local helper, not published — see "Favicon & share image"
```

---

## 1. Before you launch — the five-minute checklist

Everything configurable sits in **`assets/config.js`**. It is loaded before
`assets/site.js`, and no other file needs to change.

| Setting | What it does |
|---|---|
| `contact.phone` | Shown on the Call link as written; the `tel:` link uses its digits |
| `contact.whatsapp` | Digits with country code, no `+`. Blank removes the WhatsApp link |
| `contact.whatsappMessage` | Prefilled text when the WhatsApp chat opens |
| `contact.email` | Shown on the Email link, used for the email fallback, and the inbox for `formsubmit` |
| `form.provider` | `web3forms` / `formsubmit` / `formspree` / `custom` / `''` |
| `form.web3formsKey` | Your Web3Forms access key — see step 2 |
| `form.formspreeId` | Formspree form id |
| `form.endpoint` | Your own endpoint URL for `custom` |
| `form.fromName` | Sender name shown in the inbox (Web3Forms) |
| `form.extraFields` | Extra key/values added to every submission |

The contact links in `index.html` keep their own copy of the phone, WhatsApp
and email so they work without JavaScript; the script overwrites them from
`config.js` on load. `config.js` is public like every file on a static site —
the Web3Forms key is meant to be public, but never put real secrets there.

Then update these, which are **not** in `config.js` because search engines read
them from the raw HTML:

- `<link rel="canonical">` and `og:url` in `<head>` — set to your real domain
- `og:image` / `twitter:image` — point at your `og-cover.png` (step 4)
- `sitemap.xml` `<loc>` and the `Sitemap:` line in `robots.txt`

---

## 2. Free email enquiries

The form posts JSON directly from the browser, so you need no server. Pick one
provider and paste one value.

### Web3Forms — recommended

Free tier is 250 submissions/month, no account needed beyond an email address.

1. Go to <https://web3forms.com>, enter the inbox address, and copy the access key.
2. In `assets/config.js`, inside `form`:
   ```js
   provider: 'web3forms',
   web3formsKey: 'paste-your-access-key-here',
   ```
3. Deploy, submit a test enquiry, and confirm it lands in the inbox.

### FormSubmit — no signup at all

```js
form:    { provider: 'formsubmit', ... },
contact: { email: 'your@address.com', ... },
```
The first submission triggers a one-time confirmation email from FormSubmit —
click the link in it, and everything after that is delivered silently.

### Formspree

Free tier is 50 submissions/month.

```js
provider: 'formspree',
formspreeId: 'xdorwkyz',   // the part after /f/ in your form URL
```

### Your own endpoint

```js
provider: 'custom',
endpoint: 'https://your-worker.example.workers.dev/enquiry',
```
It receives a JSON `POST` with the form fields plus `subject` and `page`.

### If nothing is configured, or delivery fails

The form never dead-ends. If no provider is configured or delivery fails, it
shows a link to a **prefilled email** to `contact.email` carrying the whole
enquiry. So a misconfigured key costs you a click, not a lead.

### The service picker

The form asks *"What do you need? (tick all that apply)"* rather than offering a
single dropdown, because most enquiries span more than one service. The ticked
boxes are joined into one `service` field, so a submission arrives as
`Payroll processing, PF & ESI, Compliance audit`.

Every "Discuss …" button on the page carries a `data-service` attribute. Clicking
one ticks the matching box on the way down to the form. **The attribute value must
match a checkbox `value` exactly** — if you rename a service, update both:

```html
<input type="checkbox" name="service" value="Compliance audit">   <!-- the picker -->
<a href="#contact" data-service="Compliance audit">…</a>          <!-- every CTA -->
```

At least one box is required; the picker validates as a unit rather than
field by field.

### Spam

There is a hidden honeypot field, plus Web3Forms' own `botcheck`. No captcha,
so nothing to slow real visitors down. If spam ever becomes a problem, enable
hCaptcha in the Web3Forms dashboard.

---

## 3. Hosting — pick one

All three are free for a site this size, serve over HTTPS, and support a custom
domain at no cost.

### GitHub Pages

```bash
git init
git add .
git commit -m "Core HR Management website"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
Live at `https://<you>.github.io/<repo>/` in a minute or two.

- `.nojekyll` is already present, so files are served exactly as committed.
- For the custom domain, add a `CNAME` file containing just `corehrmanagement.in`,
  then point DNS at GitHub Pages: four `A` records for the apex
  (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) and a `CNAME`
  record for `www` pointing at `aash591.github.io`.
  **Add the CNAME file only once DNS resolves** — GitHub starts redirecting
  the `github.io` URL to the custom domain as soon as the file lands, so an
  unconfigured domain takes the site offline until DNS catches up.
- Note that GitHub Pages ignores `_headers` and `vercel.json`.

### Cloudflare Pages — best free tier of the three

1. Push to GitHub as above.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build command: *leave empty*. Build output directory: `/`.

`_headers` is applied automatically. Unlimited bandwidth, and the fastest CDN
of the three inside India.

### Vercel

```bash
npx vercel        # then: npx vercel --prod
```
Or import the repo at <https://vercel.com/new>. `vercel.json` is picked up
automatically. Framework preset: **Other**.

---

## 4. Favicon & share image

**The favicons are already generated and wired up.** They were cropped from
`logo.webp` at its measured emblem bounds (x 265–1014, y 92–773 of the 1254px
square), centred on white, and exported at every size browsers ask for —
including a `favicon.ico` holding 16/32/48 for the bare `/favicon.ico` request.
Nothing to do unless the logo changes.

**Still outstanding: `og-cover.png`** — the 1200×630 card WhatsApp and LinkedIn
show when someone shares the link. `<head>` already points at it, so until you
create it, shared links show no preview image.

`tools/brand-export.html` is a local helper — open it directly in a browser from
inside the project folder. It reads `logo.webp` and exports `og-cover.png`, plus
the icons again if the logo ever changes. Save whatever it produces into the
project root.

The tool also previews the header logo crop at every size it's used, with
sliders — if the emblem ever looks off-centre, adjust there and paste the
generated CSS over the `.brand-logo img` rule.

**If you replace `logo.webp`**, the crop numbers move. Re-measure with the tool,
update `.brand-logo img` in `index.html`, and re-export the icons.

Do not publish `tools/` — or leave it, it's harmless and marked `noindex`.

---
