# Care1st Dental Institute

Official marketing website for **Care1st Dental Institute** — a professional dental training and education facility in Carrollton, Texas.

This is a full rebuild of the previous Express/vanilla site. The prior implementation is preserved in [`_legacy/`](_legacy/) for comparison.

## Stack

- Next.js (App Router) + TypeScript
- CSS Modules + shared design tokens
- Resend for inquiry form email delivery
- Deployable on Vercel

## Local development

```bash
npm install
cp .env.example .env.local
# Add RESEND_API_KEY and set ADMIN_EMAIL=meetdrlee@gmail.com
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Environment variables

See [`.env.example`](.env.example).

- `RESEND_API_KEY` — required for the inquiry form
- `ADMIN_EMAIL` — destination for inquiries (default: meetdrlee@gmail.com)
- `NEXT_PUBLIC_SITE_URL` — canonical site URL for metadata
- `RESEND_FROM_EMAIL` — optional verified sender address

## Site structure

- `/` — Home (About, Training, Facility, Events, Gallery, Inquiry)
- `/privacy` — Privacy notice for the inquiry form
- Custom `not-found` page

## Contact (canonical)

- Phone: (972) 315-2345
- Email: meetdrlee@gmail.com
- Instagram: https://www.instagram.com/care1stdental/
- Facebook: https://www.facebook.com/care1stdental/
- Address: 1548 Valwood Pkwy Ste 100, Carrollton, TX 75006

## Content verification

See [`CONTENT_LEDGER.md`](CONTENT_LEDGER.md) for verified, inferred, and omitted facts.

## Deployment (Vercel)

1. Push this repository to GitHub.
2. In the Vercel project, set **Framework Preset** to **Next.js** (Project Settings → General). Clear any custom **Output Directory** left over from the old Express deploy.
3. Set environment variables from `.env.example` (`RESEND_API_KEY`, `ADMIN_EMAIL`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy. `vercel.json` pins the framework to Next.js; Vercel runs `next build` automatically.

The previous Express rewrite config lives only under `_legacy/vercel.json` and is not used.

## Legacy site

The outdated HTML/CSS/Express implementation lives in `_legacy/`. Do not delete it until you no longer need a side-by-side comparison.
