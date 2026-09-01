# Ledger — AI back office for freelance consultants & coaches

MVP: AI-drafted proposals, Stripe invoicing, a public booking page, and
Gumroad license gating. Built with Next.js (App Router), Supabase (Postgres
+ auth), the Claude API, and Stripe.

## 1. Local setup

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

## 2. Create the database (Supabase)

1. Go to [supabase.com](https://supabase.com) → New project.
2. Once created, open **SQL Editor → New query**, paste the contents of
   `supabase/schema.sql`, and run it. This creates all five tables plus
   Row Level Security policies so each user only ever sees their own data.
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server-only)

## 3. Get an Anthropic API key

1. [console.anthropic.com](https://console.anthropic.com) → API Keys → Create key.
2. Put it in `ANTHROPIC_API_KEY`.

## 4. Set up Stripe

1. [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API keys → copy the **Secret key** into `STRIPE_SECRET_KEY`.
2. Developers → Webhooks → Add endpoint → URL: `https://YOUR_DOMAIN/api/webhooks/stripe`, event: `checkout.session.completed`. Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

## 5. Set up Gumroad licensing

1. Create your product on Gumroad, and under **Content**, enable
   **"Generate a unique license key per sale"** (this is the exact setting
   that's easy to miss — check it's toggled on).
2. Go to **Settings → Advanced → Ping** and set the URL to:
   `https://YOUR_DOMAIN/api/webhooks/gumroad`
   This fires on every sale, refund, and dispute.
3. Copy your product's ID and permalink into `GUMROAD_PRODUCT_ID` and
   `GUMROAD_PRODUCT_PERMALINK` (find these on the product's Gumroad edit page).

## 6. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Ledger MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 7. Deploy on Vercel

1. [vercel.com/new](https://vercel.com/new) → Import your GitHub repo.
2. In **Environment Variables**, paste in everything from your `.env.local`
   (all the same keys — Vercel needs its own copy, it doesn't read your local file).
3. Deploy. Vercel builds and hosts the Next.js app; Supabase remains your
   database (Vercel itself is stateless — nothing is stored on Vercel between
   requests, so Supabase is where all your data actually lives).
4. Once deployed, go back and update the Stripe and Gumroad webhook URLs
   above to your real `*.vercel.app` domain (or custom domain).

## What's built vs. what's next

**Built (MVP):**
- AI proposal drafting (Claude API) → saved to Supabase
- Stripe payment link generation per invoice, with webhook to mark paid
- Public booking page at `/book/[your-slug]`
- Gumroad license webhook + manual verification endpoint
- Dashboard shell: overview, clients, proposals, invoices, bookings, settings

**Not yet wired up (intentionally left for you, since scope/priority is
your call):**
- **Auth** — pages currently take a raw `user_id` in a text field as a
  placeholder. Wire up Supabase Auth (`@supabase/ssr` is already installed)
  so `user_id` comes from the signed-in session instead.
- **PDF export & e-signature** for proposals — you've already built this
  once; the `content` field on `proposals` is plain text ready to feed into
  a PDF generator.
- **AI follow-up email drafting** — same pattern as the proposal drafting
  route, different system prompt.
- Free vs. Pro feature gating in the UI based on `users.license_status`.
