# DemoniX website

The main DemoniX website introduces the company and its first product, [AI Shield](https://github.com/suryathe44/AI_shield). The homepage has separate paths for individuals and banks/fintech teams and links to the AI Shield web demo, offline Chrome extension instructions, and source code.

The extension runs local scans after a user click. The web demo has separate optional API, logging, and OCR workflows; the site describes that distinction. AI Shield is an advisory pilot, not a production security guarantee, and Chrome Web Store publication is pending.

The homepage includes a guided feedback form. It does not store or send answers to DemoniX. After a visitor chooses a feedback category and clarity rating, it opens a prefilled GitHub issue draft for the visitor to review and submit. A GitHub account is required. Visitors are asked not to include private messages or personal and financial details.

## Run locally

Run `npm start` and visit `http://127.0.0.1:5175`. The server serves only the homepage, stylesheet, and browser script.

## Deploy

The site is deployed on Render at [demonix.site](https://demonix.site). For a Render web service, use `npm start` as the start command. The server listens on Render's `PORT` and on `0.0.0.0`. Point the custom domain at the Render service using the DNS records Render specifies for that service. Deploying this site is separate from publishing the AI Shield Chrome extension to the Chrome Web Store.
