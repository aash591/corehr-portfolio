# Core HR Management — website

A single-file, dependency-free marketing site. `index.html` contains all the
markup, styles and behaviour; the only other runtime asset is `logo.webp`.
It is a static site, so every free host below works without a build step.

```
index.html          the site
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

Everything configurable sits in one `CONFIG` block near the bottom of
`index.html` (search for `SITE CONFIG`).

| Setting | What it does |
|---|---|
| `phone` | Shown on the contact card, and used for tap-to-call in the mobile bar |
| `whatsapp` | Digits with country code, no `+`. Blank hides every WhatsApp button |
| `email` | Where enquiries go, and the address behind the fallback email link |
| `formProvider` | `web3forms` / `formsubmit` / `formspree` / `custom` / `''` |
| `web3formsKey` | Your Web3Forms access key — see step 2 |
| `mapsEmbedUrl` | Empty by default, which hides the map card entirely. Paste a Google Maps embed URL to show it — see below |

Then update these, which are **not** in `CONFIG` because search engines read
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
2. In `index.html`:
   ```js
   formProvider: 'web3forms',
   web3formsKey: 'paste-your-access-key-here',
   ```
3. Deploy, submit a test enquiry, and confirm it lands in the inbox.

### FormSubmit — no signup at all

```js
formProvider: 'formsubmit',
email: 'your@address.com',
```
The first submission triggers a one-time confirmation email from FormSubmit —
click the link in it, and everything after that is delivered silently.

### Formspree

Free tier is 50 submissions/month.

```js
formProvider: 'formspree',
formspreeId: 'xdorwkyz',   // the part after /f/ in your form URL
```

### Your own endpoint

```js
formProvider: 'custom',
formEndpoint: 'https://your-worker.example.workers.dev/enquiry',
```
It receives a JSON `POST` with the form fields plus `subject` and `page`.

### If nothing is configured, or delivery fails

The form never dead-ends. It falls back to a **prefilled email** (and a
prefilled WhatsApp message when `whatsapp` is set) carrying the whole enquiry,
and keeps a copy in the visitor's `localStorage`. So a misconfigured key
costs you a click, not a lead.

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

### The office map

It is switched off. The card is in the HTML but carries `hidden`, and the script
only reveals it when `mapsEmbedUrl` has a value. To turn it back on, paste this
into `CONFIG` and edit the `q=` value:

```js
mapsEmbedUrl: 'https://www.google.com/maps?q=Edappally%2C%20Ernakulam%2C%20Kerala%20682024&z=14&output=embed'
```

That keyless form needs no API key or billing account. It loads a Google frame
that may set its own cookies — the privacy dialog already accounts for that.

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
- For a custom domain, add a `CNAME` file containing just `www.corehrmanagement.com`,
  and point a `CNAME` DNS record at `<you>.github.io`.
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

## 5. Photography

Five photos are loaded from the Unsplash CDN. They are free to use
commercially with no attribution required under the
[Unsplash licence](https://unsplash.com/license), and hotlinking their CDN is
explicitly permitted.

Each photo sits in a `.media` box over a designed placeholder, is served at
three widths via `srcset`, and lazy-loads. **If a URL ever fails, the
placeholder shows instead** — no broken-image icons.

To use your own photography instead, drop files into `assets/img/` and replace
the `src`/`srcset` on the relevant `<img data-photo>`:

```html
<img src="assets/img/office.jpg" alt="…" width="1440" height="960"
     loading="lazy" decoding="async" data-photo>
```

Own photos of your actual office and team will always outperform stock. Note
that the people in the current photos are stock models — the copy is written
so that none of them is presented as a Core HR employee or client, and it
should stay that way.

---

## 6. The statutory scheme marks

The "Statutory coverage" section uses **our own typographic labels** (PF, ESI,
PT, LWF, S&E, APP) — not the official EPFO, ESIC or State Labour Department
logos.

That is deliberate. Government emblems and department logos are protected, and
reproducing them on a private firm's site implies an official affiliation or
accreditation that does not exist. The section therefore carries a visible
notice stating that Core HR Management is an independent provider, and the
disclaimer dialog says the same.

**Keep that notice in place.** If you later obtain written permission to use a
particular authority's logo, swap the mark inside `.auth-mark` and keep the
notice — permission to display a logo still is not endorsement.

---

## 7. Content that needs a real decision before launch

A few things are written as commitments. Make sure you can honour them, or
edit them:

- **"usually within one working day"** — the contact section and FAQ both say
  enquiries are answered within one working day.
- **"a free 30-minute review call"** — the engagement section and FAQ promise a
  free scoping call with a written scope afterwards.
- **Office hours** — "Monday–Saturday, 9:30am–6:30pm IST" on the contact card.
- **The legal dialogs** (Privacy, Terms, Disclaimer) are sensible template
  copy, not reviewed advice. Have someone check them before launch.

There are deliberately **no testimonials, client counts or years-in-business
claims** anywhere on the page, because inventing them for a new firm is both
dishonest and easy to catch. Add them as they become real — the Industries
marquee and the "Why Core HR" grid are the natural places.

---

## 8. Editing notes

- **One file.** No build, no npm, no framework. Open `index.html`, edit, refresh.
- **Sections are numbered** in their eyebrow labels (`03 · Statutory coverage`).
  If you insert a section, renumber the ones after it, and add it to both navs
  (desktop `.nav` and `.mm-links`) and the scroll-spy array in the script.
- **Motion** is all CSS, and the whole page respects
  `prefers-reduced-motion: reduce` — animations switch off for visitors who ask
  their OS for less movement. Test it before changing motion.
- **WhatsApp** appears in exactly one place in the contact card — the green
  button under the phone and email rows. Blanking `whatsapp` in `CONFIG` removes
  it, and the mobile bar's WhatsApp button, together.
- **Mobile.** Below 860px a fixed action bar (Call / WhatsApp / Enquire)
  appears after the hero and hides over the contact form. Its buttons are
  generated from `CONFIG`, so a blank `phone` simply removes that button.
- **Accessibility.** Every interactive element is keyboard-reachable, the
  mobile menu traps focus and closes on Escape, form errors are announced via
  `aria-live`, and photos carry real alt text. Keep that when editing.
