# The Triple Helix at JHU — website

Static site for The Triple Helix at Johns Hopkins University: an undergraduate journal and forum where frontier science meets public affairs.

- `index.html`: home page (two dialogues, collaborators, people, mailing list)
- `assets/join.js`: mailing-list form; posts sign-ups to a Google Apps Script web app (`apps-script/Code.gs`) that appends them to the "TTH at JHU — Mailing List" Google Sheet, then redirects to `/thanks`
- `thanks.html`: thank-you page shown after subscribing
- `assets/tth-logo.png`: logo and favicon

No build step. Deploys on Vercel as a static site (Framework preset: Other). Custom domain: tthjhu.com.
