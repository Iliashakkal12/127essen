# Wagti — Marketplace & operating platform for salons

Wagti is a marketplace and light operating platform for barbers, salons,
spas and beauty institutes in Casablanca: customers discover salons and
book appointments in a few taps, or join a salon's virtual walk-in queue
by scanning its QR code. Salons get a workspace ("Espace salon") to manage
appointments, employees, services, the walk-in queue and finances — and
the Wagti team gets a private, platform-wide admin view.

This repository is a **prototype**: there is no database and no real
authentication provider. See [`AUDIT.md`](./AUDIT.md) for a full audit of
what was found, what was fixed, and exactly what a production backend
needs to replace. Read that file for the "why"; this one is the "how to
run it".

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4
- Hand-written shadcn/ui-style primitives in `src/components/ui`
- Recharts for dashboard charts, `qrcode.react` for QR codes
- No database — deterministic mock data generated per salon (see
  `src/lib/mock/salon-operations.ts`)

## Getting started

```bash
npm install
cp .env.example .env.local   # set WAGTI_ADMIN_CODE, see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & typecheck

```bash
npm run build   # next build — runs the TypeScript check as part of the build
npm run lint    # eslint
```

`npm run build` succeeds without `WAGTI_ADMIN_CODE` set — it's only read at
request time by the login route, not at build time. You do need it set,
though, for the `/admin` login to actually work once the app is running —
set it in `.env.local` for `next dev`, and as a real environment variable
on Vercel (see below) for the deployed app.

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Purpose |
| --- | --- | --- |
| `WAGTI_ADMIN_CODE` | yes | Server-side-only code that gates `/admin`. Never exposed to the client — checked in `src/app/api/admin/login/route.ts`, never read outside server code. |

## Admin access

`/admin` is the private, platform-owner-only dashboard — it is **not**
linked anywhere in the public site. To reach it:

1. Set `WAGTI_ADMIN_CODE` (see above).
2. Visit `/admin` — you'll be redirected to `/admin/login`.
3. Enter the code. On success the server sets a short-lived, HttpOnly,
   HMAC-signed session cookie (`wagti_admin_session`, 12h) and you're
   redirected back to `/admin`.
4. `src/proxy.ts` (Next's middleware convention) protects every route
   under `/admin/**` except `/admin/login`.

This is intentionally simple for a prototype — see AUDIT.md for what a
production auth setup should look like.

## Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this from the
   repo).
2. Import the project on [vercel.com/new](https://vercel.com/new).
3. Framework preset: Next.js (auto-detected). No custom build command
   needed — `next build` / `next start` work as-is.
4. Add the `WAGTI_ADMIN_CODE` environment variable in Project Settings →
   Environment Variables (Production **and** Preview) before the first
   deploy that needs `/admin` to work.
5. Deploy. There is no database to provision — everything runs from the
   in-repo mock data layer.

## Key routes

**Marketplace / customer**
- `/` — Landing page (no queue ticket is ever shown here — see AUDIT.md §1)
- `/recherche` — Marketplace search: category, neighborhood, price, rating, "open today" filters
- `/salons/[slug]` — Salon page: services → compatible employees → date/time → confirm
- `/reservation/confirmation` — Booking confirmation + appointment QR code
- `/file-attente/[id]` — Virtual walk-in queue. Requires an explicit "Rejoindre la file d'attente" action — no ticket is ever created just by opening the page

**Salon workspace ("Espace salon")**
- `/dashboard` — Overview: today's appointments, planning, walk-in queue, quick stats
- `/dashboard/finances` — Revenue, expenses, commissions, estimated profit
- `/dashboard/employes` — Team & performance
- `/dashboard/services` — Service catalog, per-service employee assignment
- A salon switcher in the sidebar/topbar lets one session manage any of the
  demo salons — switching updates every number on every page (see
  `src/lib/salon-context.tsx`)

**Platform admin (private, owner-only)**
- `/admin/login` — Code-gated login
- `/admin` — Platform-wide KPIs, revenue trend, category mix, business model config, salon list
- `/admin/salons/[id]` — Drill into one salon's platform-level data

## Project structure

```
src/
  app/                       routes (App Router)
    (site)/                  public marketing + marketplace + booking + queue
    dashboard/               salon workspace, wrapped in SalonWorkspaceProvider
    admin/                   private platform-owner area (login + protected dashboard group)
    api/admin/               login/logout route handlers (server-only)
  components/
    ui/                      shadcn/ui-style primitives
    layout/                  header, footer, dashboard shell (+ salon switcher)
    marketing/                landing page sections
    marketplace/              salon card, search
    salon/                    salon page, booking widget, service/staff lists
    booking/                   QR ticket component
    queue/                    virtual queue join + status flow
    dashboard/, finance/      salon workspace widgets
    admin/                    platform admin widgets
  data/
    salons.ts                 seed catalog: 8 salons, each with its own services/staff/reviews
    admin.ts                   legacy/placeholder SaaS pricing tiers (see AUDIT.md §business model)
    testimonials.ts
  lib/
    types.ts                   shared domain types
    date.ts                    Casablanca-aware date helpers, seeded RNG for deterministic mock data
    platform-config.ts         single source of truth for the per-transaction business model
    salon-context.tsx          "Espace salon" active-salon context (client, localStorage-persisted)
    mock/salon-operations.ts   deterministic per-salon appointments/queue/finance generator
    services/                  BookingService, QueueService, SalonService, AdminService
    server/admin-session.ts    signed admin session token helpers (server + middleware only)
  proxy.ts                     Next.js middleware — protects /admin/**
```

## What's real vs. mock

Everything renders from code in this repo; nothing calls an external API.
Per-salon operational numbers (appointments, queue, revenue, commissions,
expenses) are generated deterministically from each salon's real services
and staff (see `src/lib/mock/salon-operations.ts`) so the same salon always
shows the same numbers, and switching salons shows genuinely different,
internally-consistent numbers — but none of it is persisted. Reloading
resets any state a component held locally (e.g. appointment status changes
in the dashboard table). See `AUDIT.md` for the production data model this
is designed to be swapped onto.
