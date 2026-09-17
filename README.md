# Core HR Management — website

A static marketing site — no build step, no framework. Open `index.html`,
edit, refresh.

```
index.html          the site
assets/config.js    contact details & enquiry-form delivery (edit this)
assets/site.css     styles
assets/site.js      behaviour
logo.webp           brand lockup (the header crops the emblem out of it)
404.html            not-found page
robots.txt          crawler rules  ← update the Sitemap host before launch
sitemap.xml         sitemap        ← update <loc> before launch
_headers            security + cache headers (Cloudflare Pages / Netlify)
vercel.json         the same, for Vercel
favicon.ico, icon-*.png, apple-touch-icon.png   generated icons
tools/              local helper, not published — see "Favicon & share image"
```

---

## 1. Configure

Contact details and enquiry-form delivery live in **`assets/config.js`** —
every setting is commented there. `index.html`'s contact links carry the same
values as a no-JS fallback; `config.js` overwrites them on load.

Then update these directly in the HTML, since search engines read them raw:

- `<link rel="canonical">` and `og:url` in `<head>` — your real domain
- `og:image` / `twitter:image` — point at `og-cover.png` (see §3)
- `sitemap.xml` `<loc>` and the `Sitemap:` line in `robots.txt`

---

## 2. Enquiry form

The form posts JSON straight from the browser — no server needed. Set
`form.provider` in `config.js` to one of:

- **`web3forms`** (recommended) — free, 250/month, no account beyond an
  inbox address. Get a key at <https://web3forms.com>, paste it into
  `form.web3formsKey`.
- **`formsubmit`** — no signup. Just set `contact.email`; confirm the
  one-time email FormSubmit sends on the first real submission.
- **`formspree`** — free, 50/month. Paste the id from your form's URL
  (`formspree.io/f/<id>`) into `form.formspreeId`.
- **`custom`** — paste your own endpoint into `form.endpoint`. It receives a
  JSON `POST` with the form fields plus `subject` and `page`.

If nothing is configured, or delivery fails, the form falls back to a
prefilled `mailto:` link to `contact.email` — a misconfigured key costs a
click, not a lead.

**Spam:** a hidden honeypot field plus Web3Forms' own `botcheck`, no captcha.
Turn on hCaptcha in the Web3Forms dashboard if it ever becomes a problem.

**Service picker:** checkboxes, not a dropdown, since most enquiries span
more than one service — ticked boxes join into one `service` field. Every
"Discuss …" button carries a `data-service` attribute that ticks the
matching box on the way to the form, so its value must match a checkbox
`value` exactly:

```html
<input type="checkbox" name="service" value="Compliance audit">   <!-- the picker -->
<a href="#contact" data-service="Compliance audit">…</a>          <!-- every CTA -->
```

---

## 3. Deploy — pick one

All three are free for a site this size, serve HTTPS, and support a custom
domain at no cost.

**GitHub Pages**
```bash
git init && git add . && git commit -m "Core HR Management website"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
Then **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
For a custom domain, add a `CNAME` file with just `corehrmanagement.in`, then
point DNS at GitHub Pages — four apex `A` records (`185.199.108.153`, `.109.153`,
`.110.153`, `.111.153`) and a `www` `CNAME` to `aash591.github.io`. Add the
`CNAME` file only once DNS resolves, or the site goes offline until it catches
up. Note: GitHub Pages ignores `_headers` and `vercel.json`.

**Cloudflare Pages** — best free tier of the three. Push to GitHub, then
**Workers & Pages → Create → Pages → Connect to Git**. Leave the build command
empty; output directory `/`. `_headers` is picked up automatically.

**Vercel**
```bash
npx vercel        # then: npx vercel --prod
```
Or import the repo at <https://vercel.com/new> (framework preset: **Other**).
`vercel.json` is picked up automatically.

---

## 4. Favicon & share image

Favicons are already generated from `logo.webp` and wired up — nothing to do
unless the logo changes.

**Still outstanding:** `og-cover.png`, the 1200×630 image WhatsApp/LinkedIn
show when the link is shared. `<head>` already points at it; until it exists,
shared links show no preview. Generate it (and re-cut the icons, if the logo
changed) with `tools/brand-export.html` — open it directly in a browser and
save its output into the project root. It also previews the header logo crop
at every size used, with sliders to fix it if the emblem looks off-centre.

Don't publish `tools/`, though it's harmless if you do — it's marked `noindex`.
