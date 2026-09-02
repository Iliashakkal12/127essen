# Wagti — Code Audit & Reconstruction

This document is the audit trail for the reconstruction work done on this
repository: what was broken, why, what was changed, and what is still
missing before this could run as a real product. It complements
`README.md` (how to run/deploy) — this file is the "why".

---

## 1. Diagnosis — the most important problems found

### P0 — critical product-logic bugs

1. **The virtual queue could appear as if it were already active.**
   The landing page hero rendered a floating card reading "Ticket A-014 · 0
   personne devant vous · Prêt" unconditionally, on every page load, with
   no relation to any real action by the visitor. Separately,
   `/file-attente/[id]` (`QueueStatus`) initialized `peopleAhead` to a
   hardcoded `3` and displayed a hardcoded ticket number `A-018` **on
   mount** — a customer who simply opened that page (e.g. by scanning a
   salon's QR code out of curiosity) was shown an active-looking queue
   ticket they never asked for. This directly violated the product's most
   important rule.

2. **Booking and queue were the same flow in places.** The booking
   confirmation page ended with a primary "Suivre la file d'attente en
   direct" button linking straight to `/file-attente/{salonId}` — implying
   a customer who just booked an appointment should also join the
   walk-in queue, conflating two flows that must stay independent.

3. **Any employee could be booked for any service.** `StaffList` always
   rendered every member of `salon.staff`, regardless of the selected
   service. The `Service.staffIds` / `Staff.serviceIds` compatibility data
   already existed in `src/data/salons.ts` — it was never read by the
   booking UI.

4. **Availability was one hardcoded array, identical for every salon,
   service, employee, and day.** `time-slots.tsx` exported a fixed
   `ALL_SLOTS` array and a fixed `Set` of "unavailable" indexes at module
   scope. Every salon, every service, every staff member, "today" and
   "tomorrow" all showed the exact same 18 slots with the exact same 6
   unavailable ones.

5. **"Espace salon" was hardcoded to Barber Lounge.** All four dashboard
   pages (`dashboard/page.tsx`, `finances/page.tsx`, `employes/page.tsx`,
   `services/page.tsx`) imported `salons[0]` directly, and
   `DashboardShell`'s sidebar/header had the literal strings "Barber
   Lounge" / "BL" baked in. There was no salon selector anywhere. The
   requirement that "Espace salon" let a session manage *any* of the
   catalog's salons, with every number on every page following the
   selection, did not exist at all.

6. **All salon-workspace appointment/finance data was for one salon,
   globally.** `src/data/appointments.ts` and `src/data/finance.ts`
   exported one fixed day of appointments and one fixed month of
   revenue/expenses/commissions, name-checked to Barber Lounge's specific
   staff (`Yassine El Amrani`, `Karim Bensaid`, `Othmane Raji`). Every
   salon's dashboard — had the switcher existed — would have shown Barber
   Lounge's numbers under a different name.

7. **`/admin` had no authentication at all**, and the public site footer
   linked to it directly ("Démo plateforme (admin)"), so any visitor could
   find and open the platform-owner dashboard.

8. **Stale hardcoded date.** The booking confirmation page computed the
   appointment date from `new Date("2026-07-01T00:00:00")` — a date that
   was already two months in the past relative to the environment's actual
   current date (2026-09-02) and would keep drifting further out of sync
   with reality on every subsequent day the app is used.

### Architecture problems

- **Business data lived directly in components/route files**, not behind
  any service layer (`salons[0]` imported straight into four different
  page components; finance/queue components imported `expenses`,
  `revenueByService`, etc. as module-level constants rather than props).
  There was no single place computing "available slots" or "platform
  revenue" — logic was duplicated or simply absent where needed.
- **No business-model configuration.** The 2 MAD / 2 MAD / volume-relief
  model described for Wagti did not exist anywhere in code. The only
  pricing artifact was three generic SaaS tiers (299/599/1290 MAD/month)
  presented as the product's live pricing, with "Essayer {plan}" buttons
  linking into `/dashboard` as if subscribing.
- **No role/authorization model in the type system** — nothing
  distinguished a salon staff member's access from the platform owner's,
  even conceptually.

### UX / correctness issues

- Selecting "Demain" instead of "Aujourd'hui" (or a different employee, or
  a different service) never changed the rendered time slots — they were
  the same static array regardless of any selection.
- No empty/error states for: no compatible employee for a service, no
  available time slots, empty queue on a salon with no walk-ins, missing
  salon/appointment id. Several of these existed for the salon-not-found
  case (`notFound()`) but nothing else did.
- No global `not-found.tsx` / `error.tsx` — an unhandled render error
  would show Next's default, unbranded error screen.

### Security

- `/admin` was fully public (see P0 #7).
- No secret, credential, or admin bypass was ever hardcoded into the
  source in the original codebase — that part was clean. The gap was the
  *absence* of any gate, not a leaked one.

### Technical quality

- The app otherwise used the App Router, server/client component
  boundaries, and TypeScript correctly; `npm run build` and `npm run lint`
  both passed cleanly on the original code. The problems here were product
  logic and architecture, not framework misuse.

---

## 2. Fixes implemented

All of the below are actual code changes in this repository, not just
recommendations.

### Queue vs. booking separated, opt-in enforced

- `src/components/marketing/hero.tsx`: the floating "Ticket A-014" card is
  gone. Replaced with a QR/"Déjà sur place ?" teaser card that makes no
  claim about an active ticket, and the sample booking card is now driven
  by real seed data (the first `featured` salon) instead of a hardcoded
  name.
- `src/components/queue/queue-status.tsx`: fully rewritten as a two-step
  client component. Step one ("landing") shows the salon, the current
  queue snapshot, and a service picker — **no ticket exists yet**. A
  ticket is created only inside `handleJoin()`, a click handler on
  "Rejoindre la file d'attente" — never on mount, never in an effect.
  Step two renders the ticket once it exists.
- `src/lib/services/queue-service.ts` (new): `joinQueue()` is the single
  place that computes a new ticket. It is a pure function called from a
  click handler, documented as such, so this invariant is easy to keep.
- `src/components/salon/salon-detail-client.tsx`: added a distinct
  "Déjà sur place, sans rendez-vous ?" card next to the booking widget
  linking to `/file-attente/{salonId}` — the queue is presented as an
  explicitly separate path from booking, per the product spec's flow
  diagram.
- `src/app/(site)/reservation/confirmation/page.tsx`: removed the
  "Suivre la file d'attente en direct" button; replaced with "Voir le
  salon". Booking confirmation no longer funnels into the queue.

### Service ↔ employee compatibility

- `src/lib/services/salon-service.ts` (new): `getCompatibleStaff(salon,
  serviceId)` / `getCompatibleServices(salon, staffId)` read the existing
  `staffIds` / `serviceIds` relations from the seed data.
- `src/components/salon/salon-detail-client.tsx`: the "Équipe" tab now
  renders only staff compatible with the selected service. If the
  currently-selected employee becomes incompatible after a service change,
  they're deselected immediately in the same event handler (no effect
  needed, no stale/inconsistent booking possible).
- `src/components/salon/staff-list.tsx`: added an empty state ("Aucun
  employé disponible pour cette prestation").

### Centralized availability engine

- `src/lib/services/booking-service.ts` (new): `getAvailableSlots({salon,
  service, staffId, date, nowTime})` is the single function that computes
  bookable slots — it reads the salon's real opening hours (parsed from
  `salon.openingHours`), respects the service's duration (a slot can't
  start if the service wouldn't finish before closing), hides slots inside
  a 30-minute lead time for "today", and produces a deterministic but
  salon+staff+date+service-seeded pattern of taken slots (stands in for a
  real appointments table — see §4).
- `src/components/salon/time-slots.tsx` and `booking-widget.tsx`: now take
  the computed slot list as a prop instead of owning a hardcoded array;
  changing service, employee, or day now visibly changes availability, and
  a "complet" message appears when nothing is available.
- `src/app/(site)/reservation/confirmation/page.tsx`: date label now comes
  from `src/lib/date.ts` (`isoDateFor` / `formatLongDateFR`), which reads
  the real current date — the stale `2026-07-01` literal is gone.

### "Espace salon" multi-salon switching

- `src/lib/salon-context.tsx` (new): `SalonWorkspaceProvider` +
  `useSalonWorkspace()`. Holds the active salon id, persisted to
  `localStorage` (prototype-only — see §4 for the production replacement),
  defaulting to the first salon.
- `src/app/dashboard/layout.tsx` (new): wraps every `/dashboard/**` route
  in the provider.
- `src/components/layout/dashboard-shell.tsx`: added a `SalonSwitcher`
  dropdown (sidebar + topbar) listing every salon in the catalog; the
  hardcoded "Barber Lounge" / "BL" strings are gone, replaced by the
  active salon from context.
- All four dashboard pages (`dashboard/page.tsx`, `finances/page.tsx`,
  `employes/page.tsx`, `services/page.tsx`) now read `salon` from
  `useSalonWorkspace()` instead of `salons[0]`, and title/description
  strings interpolate the real salon name.
- Components that held local state seeded from initial props
  (`AppointmentsTable`, `QueueManagement`) are remounted via `key={salon.id}`
  on `DashboardShell` when the salon changes, so switching salons doesn't
  leave stale, previous-salon state behind. `ServicesPage` uses the same
  `key`-based remount pattern internally for its own local service list.

### Per-salon operational data (replaces the single hardcoded dataset)

- `src/lib/mock/salon-operations.ts` (new): `getSalonOperations(salon)`
  deterministically generates, **from that salon's actual services and
  staff**, a full day of appointments, a walk-in queue snapshot, a week/
  month of revenue, revenue-by-service, revenue-by-employee (derived
  directly from the staff's own `commissionPercent` /
  `revenueGeneratedMonth` fields — no duplicated numbers), a month of
  expenses, and a finance summary + estimated profit. Seeded by salon id
  (`src/lib/date.ts#seededRandom`) so numbers are stable across renders
  but genuinely different per salon.
- `src/data/appointments.ts` and `src/data/finance.ts` (Barber-Lounge-only,
  globally-shared data) were deleted; every former consumer now goes
  through `getSalonOperations`.
- Finance components (`revenue-chart.tsx`, `revenue-by-service.tsx`,
  `revenue-by-employee.tsx`, `expenses-table.tsx`) were converted from
  "import global data" to "accept data as props", so they render whatever
  salon's numbers the parent page passes in.

### Business model configuration

- `src/lib/platform-config.ts` (new): single source of truth —
  `customerFeePerBooking`, `salonFeePerService`, `volumeThreshold`,
  `thresholdPeriodDays`, plus `estimatePlatformRevenue()` and
  `salonFeeForService()` helpers implementing the volume-threshold relief.
  Nothing else hardcodes these numbers.
- The legacy 299/599/1290 MAD "SaaS plan" cards remain in
  `src/data/admin.ts` but are now clearly labelled "Bientôt disponible" /
  not active, their CTA buttons are disabled, and the pricing section's
  headline and copy now lead with the real per-transaction model, reading
  live from `platformConfig`.
- `src/app/admin/(dashboard)/page.tsx` surfaces the business model
  (fee amounts, volume threshold, window) directly from the same config.

### Platform admin: private, protected, and data-driven

- `src/lib/server/admin-session.ts` (new): stateless, HMAC-signed session
  tokens (Web Crypto, works in both the Node route handler and Edge/Node
  middleware runtimes). `WAGTI_ADMIN_CODE` is read only in
  `src/app/api/admin/login/route.ts` (server-only route handler) and never
  sent to the client; the cookie holds a signed expiry, not the code
  itself.
- `src/app/api/admin/login/route.ts`, `src/app/api/admin/logout/route.ts`
  (new): login sets an HttpOnly, `SameSite=Lax`, 12h-lived cookie on
  success; logout clears it.
- `src/proxy.ts` (new — Next 16's current convention, replacing the
  deprecated `middleware.ts` name): gates every route under `/admin/**`
  except `/admin/login`, redirecting unauthenticated requests to
  `/admin/login?from=...`.
- `src/app/admin/login/page.tsx` + `src/components/admin/admin-login-form.tsx`
  (new): a plain code-entry form, no salon or customer styling, clearly
  labelled "Réservé au propriétaire de la plateforme".
- The admin dashboard moved from `src/app/(site)/admin/page.tsx` (inside
  the public marketing layout, with the public header/footer) to
  `src/app/admin/(dashboard)/page.tsx`, its own isolated layout
  (`AdminTopbar`, logout button, no public nav).
- `src/components/layout/site-footer.tsx`: removed the "Démo plateforme
  (admin)" link — there is now no public path to `/admin` anywhere in the
  site.
- `src/lib/services/admin-service.ts` (new): `getPlatformKpis()`,
  `getAdminSalonRows()`, `getCategoryDistribution()`,
  `getPlatformWeeklyRevenueTrend()` all aggregate the **same** per-salon
  mock data every salon dashboard uses (`getSalonOperations`), instead of
  a second, disconnected set of static numbers. The old
  `src/data/admin.ts` `platformMetrics` / `platformGrowth` / `topSalons` /
  `categoryDistribution` exports (a fabricated "214 salons, 38,460
  bookings" narrative unrelated to the 8 actual demo salons) were removed.
- `src/app/admin/(dashboard)/salons/[id]/page.tsx` (new): drill-down into
  one salon's platform-level view (team, services, today's appointments,
  estimated platform fees) — the "inspect an individual salon" requirement.

### Roles (documented in the type system)

- `src/lib/types.ts`: added `UserRole = "CUSTOMER" | "STAFF" |
  "SALON_MANAGER" | "SALON_OWNER" | "PLATFORM_OWNER"` with a comment
  explaining the separation, so the distinction the product spec requires
  is explicit even though there's no real auth backend yet to enforce it
  for salon-level roles (only the platform-owner boundary is actually
  enforced today, via the admin session cookie).

### Error / empty states

- `src/app/not-found.tsx`, `src/app/(site)/not-found.tsx`,
  `src/app/error.tsx` (new): branded 404 and runtime-error fallbacks.
- Empty states added: no compatible employees for a service, no available
  time slots ("Complet pour aujourd'hui/demain"), no services to join a
  queue for, no appointments today, no queue tickets (pre-existing, kept).
- `reservation/confirmation` and the queue page already used `notFound()`
  for a missing salon id/slug; confirmation now also 404s if the salon has
  no services at all rather than silently falling back to `salons[0]`.

### Hardcoded-data sweep

Searched the repository for `Barber Lounge`, fixed `2026-0X-XX` dates,
`salons[0]`, and fixed ticket numbers outside the seed data. Found and
fixed one remaining leftover after the main pass:
`dashboard/services/page.tsx`'s `DashboardShell` description was still the
literal string "Prestations proposées par Barber Lounge Maarif" — now
interpolates the active salon's real name. Remaining occurrences of
"Barber Lounge Maarif" are legitimate: it's one of the 8 real seed salons
in `src/data/salons.ts`.

### Technical/build quality

- Renamed `middleware.ts` → `proxy.ts` (Next 16.2's current, non-deprecated
  convention) and the exported function `middleware` → `proxy`.
- Fixed a `useSearchParams()`-without-`Suspense` build failure on
  `/admin/login` by splitting it into a page + a client form component
  wrapped in `<Suspense>`.
- Fixed `react-hooks/set-state-in-effect` lint errors by moving two
  service/salon compatibility resets out of `useEffect` and into the
  event handler that actually causes them (no effect needed at all), and
  by remounting `ServicesWorkspace` via `key={salon.id}` instead of
  effect-driven state syncing. The one remaining legitimate
  effect-set-state (hydrating the persisted salon id from `localStorage`
  after mount, since `window` doesn't exist during SSR) is explicitly
  annotated and `eslint-disable`d with a comment explaining why.
- `npm run build` and `npm run lint` both pass cleanly (see §6).

---

## 3. Resulting architecture

```
Customer-facing marketplace/booking  →  BookingService / SalonService / QueueService
Salon workspace ("Espace salon")     →  SalonWorkspaceProvider (active salon)
                                          + SalonService + getSalonOperations()
Platform admin (private)             →  AdminService (aggregates every salon's
                                          getSalonOperations()) + admin-session (auth)
```

- **`src/data/`** — the raw seed catalog only (`salons.ts`: 8 salons, each
  with its own services/staff/reviews; `admin.ts`: placeholder SaaS plans;
  `testimonials.ts`).
- **`src/lib/mock/`** — deterministic derived operational data
  (appointments, queue, finance) computed *from* the seed catalog, not
  hand-authored per salon.
- **`src/lib/services/`** — the four requested services
  (`BookingService`, `QueueService`, `SalonService`, `AdminService`), each
  a plain function module. Components never reach into `src/data/*`
  directly for anything beyond simple listing; business logic (slot
  availability, compatibility, queue joining, platform aggregation) is
  centralized here so a real backend can replace the *inside* of these
  modules without touching a single UI component.
- **`src/lib/platform-config.ts`** — the business model, in one place.
- **`src/lib/salon-context.tsx`** — the only place that knows "which salon
  is this session managing"; every dashboard page reads it instead of
  hardcoding a salon.
- **`src/lib/server/`** + **`src/proxy.ts`** — the platform-owner auth
  boundary, isolated from both the salon-workspace context and the
  customer-facing code (neither of which can read `WAGTI_ADMIN_CODE` or
  the session cookie's signing logic).

## 4. Product flows (final)

**Customer booking**
```
/ (marketplace teaser, no queue)
  → /recherche (search/filter salons)
  → /salons/[slug] → pick service
                    → pick compatible employee (or "sans préférence")
                    → pick date → pick real available time
                    → "Confirmer la réservation"
  → /reservation/confirmation (appointment QR, real date, no queue link)
```

**Virtual queue (separate, opt-in)**
```
/salons/[slug] "Déjà sur place ?" card, or a salon's own QR code
  → /file-attente/[salonId]  — landing: current queue size, pick a service
    → "Rejoindre la file d'attente" (explicit click)
  → ticket screen: number, people ahead, ETA, status
```

**Salon workspace**
```
/dashboard → salon switcher (any of the 8 catalog salons)
  → switching updates: name, services, staff, today's appointments,
    walk-in queue, revenue/expenses/commissions/profit — together,
    on every /dashboard/* page, because they all read the same
    useSalonWorkspace() + getSalonOperations(salon)
```

**Platform admin**
```
/admin → redirected to /admin/login if no valid session cookie
/admin/login → WAGTI_ADMIN_CODE check (server-only) → HttpOnly session cookie
/admin → platform KPIs, revenue trend, category mix, business model panel,
         full salon list
/admin/salons/[id] → one salon's platform-level detail
```

## 5. Implemented in prototype vs. requires real backend

**Implemented in prototype**
- Full customer booking flow with real service/employee compatibility and
  a centralized (if mock) availability engine.
- Fully separated, opt-in-only virtual queue flow.
- Multi-salon marketplace search/filter (already existed, kept).
- "Espace salon" salon switching with every page following the selection.
- Private, code-gated `/admin` with signed session cookies, isolated from
  customer/salon code paths.
- Centralized business-model configuration driving both the admin panel
  and the marketing pricing section.
- Service-layer architecture (`BookingService`, `QueueService`,
  `SalonService`, `AdminService`) ready to have its internals swapped for
  real data access.
- Branded 404/error states; assorted empty states.

**Requires a real backend/database before production**
- **Persistence.** Nothing here is saved. Every "confirm booking", "join
  queue", "mark appointment completed", "add employee/service" action only
  mutates in-memory React state for the current tab. A real system needs
  the tables sketched in the product brief (`users`, `salons`,
  `salon_members`, `employees`, `services`, `service_employees`,
  `appointments`, `appointment_status_history`, `queue_tickets`,
  `expenses`, `commissions`, `payments`, `reviews`, `notifications`) and
  real CRUD behind `BookingService` / `QueueService` / `SalonService`.
- **Real availability.** `getAvailableSlots()` currently fakes "busy"
  slots with a seeded PRNG. Production needs it to read: employee working
  hours & breaks, days off/holidays, existing appointments (to prevent
  double-booking), buffer time between services, and current queue state
  — the function signature already accepts salon/service/staff/date so
  this is a body swap, not an API change.
- **Real authentication.** Customers have no accounts at all right now
  (booking asks for nothing — by design, to keep booking fast — but that
  also means there's no "my appointments" view). Salon staff have no
  login; `useSalonWorkspace()` lets *anyone* who opens `/dashboard`
  manage *any* salon, which is fine for a demo and not fine for
  production — it needs to become a `salon_members`-backed permission
  check. The platform-admin gate is a single shared code, not per-owner
  accounts.
- **Real payments/commission settlement.** `platformConfig` computes fee
  *estimates*; there's no payment processor, invoicing, or reconciliation
  wired to it.
- **Notifications.** SMS/email/WhatsApp are referenced in copy
  ("Un SMS et un e-mail de confirmation ont été envoyés") but never sent —
  there's no provider integration.
- **Real-time queue.** The queue view has no live updates; the "Simuler
  l'avancée de la file" button is a manual demo control, not a
  subscription to real changes made by salon staff.
- **`salon_members`-backed salon switching.** Today's `localStorage`-based
  "which salon am I managing" is explicitly a prototype stand-in — see the
  doc comment in `src/lib/salon-context.tsx` for the intended replacement
  (server-verified membership, active salon kept in a signed
  session/cookie).
- **Rate limiting / brute-force protection on `/api/admin/login`** — the
  code-based login has no attempt throttling. Fine for a single shared
  prototype secret, not for production.

## 6. Build result

```
npm install
npm run build   →  passes (Next.js 16.2.9, Turbopack; TypeScript check included)
npm run lint    →  passes, zero errors/warnings
```

Verified manually (dev server) for this audit:
- Homepage renders with no queue-ticket markup present anywhere in the HTML.
- `/admin` redirects to `/admin/login` when unauthenticated (307); a wrong
  code returns 401; the correct code sets a cookie that then grants `/admin`
  access (200).
- `/file-attente/[id]` renders the "Rejoindre la file d'attente" landing
  step with no ticket markup on first load.
- `/reservation/confirmation` renders the real current date (verified
  against the container's system date), not the old hardcoded
  `2026-07-01`.

## 7. Deployment readiness

- Repo root has `package.json`, `next.config.ts`, `tsconfig.json`,
  `src/`, `public/` — standard Next.js App Router layout, no manual build
  steps required.
- No native/binary dependencies beyond what `next`/`sharp`-adjacent
  tooling installs automatically; `npm install` completed without
  requiring any interactive script-approval step in this environment.
- Only required environment variable: `WAGTI_ADMIN_CODE` (server-side,
  see `.env.example` and README's "Environment variables" section) — must
  be set in Vercel's Project Settings before the first deploy that needs
  `/admin` to work; the rest of the app functions without it.

---

## 8. Round 2 — Mockup V2 corrections (post-launch testing)

A second pass, driven by issues found actually clicking through the
deployed Mockup V2 rather than by code review. Each item below was
reproduced first, then fixed at the root cause — not patched at the
symptom.

1. **Queue teaser on the homepage read as a normal marketplace feature.**
   The hero section had a floating "Déjà sur place ?" card sitting right
   next to the sample salon card — still visually implying the queue is
   part of the default browsing experience. Removed entirely from the
   homepage; the queue is now only ever introduced on a salon's own page.
   `src/components/marketing/hero.tsx`.
2. **Homepage value proposition was generic booking-app copy.** Rewritten
   around Wagti's actual differentiator — "Votre temps compte", covering
   both "book ahead" and "skip the wait if you're already there" — instead
   of a one-line description of what any booking platform does.
3. **Salon page image/badge collision.** Root-caused precisely: the
   overlapping info card relied on CSS stacking order matching DOM order,
   but had no explicit `z-index`, so on some viewports the cover image's
   decorative icon could paint over the category/availability badges.
   Fixed by giving the info card an explicit stacking context
   (`relative z-10`) instead of guessing at margins, and by shrinking/
   re-insetting the decorative icon so it no longer overflows the cover's
   bounds. `salon-header.tsx`, `salon-cover.tsx`.
4. **Sticky booking bar intermittently covered the queue CTA while
   scrolling.** Root-caused via actual DOM/CSS measurement (see below),
   not guesswork: `position: sticky` promotes an element into its own
   stacking context that paints above plain static siblings regardless of
   DOM order, and CSS grid's default `align-items: stretch` was giving the
   sticky widget's containing block far more scroll "runway" than its own
   content needed. Fixing only the stretch (`self-start`) shrank the
   overlap window but didn't eliminate it — the two elements could still
   occupy the same screen region for part of the scroll range. The actual
   fix: moved the "Déjà sur place" card out of the sticky column entirely
   into its own full-width block below the two-column grid, so it never
   shares a containing block with anything sticky. Verified with a
   Playwright script that swept eleven scroll positions and checked real
   hit-testing (`document.elementFromPoint`), not just visual inspection.
   `salon-detail-client.tsx`.
5. **"8 salons partenaires" rendered as "8salons partenaires".** Root
   cause confirmed by diffing actual rendered HTML: React inserts an
   `<!-- -->` hydration marker between a JSX expression and adjacent
   text, and in this specific case (text spanning to a line break before
   the closing tag) the leading space was dropped by JSX's whitespace
   handling. Fixed by folding the whole phrase into one template-literal
   expression, which is immune to this class of bug. Then swept every
   other page's rendered HTML for the same `<!-- -->`-adjacent-to-a-
   non-space-character pattern — no other instance found; everything else
   was either a correct explicit space or a correct no-space case (e.g.
   `40%`, `salon` + `s`).
6. **Appointment status had one ambiguous action instead of explicit
   per-state verbs.** `AppointmentStatus` extended to a full lifecycle
   (`en attente → confirmée → arrivée → en cours → terminée`, plus
   `annulée`/`absence` as terminal branches), each with its own obvious
   button(s) in `appointments-table.tsx` instead of one generic control.
7. **QR walk-in flow auto-created a ticket instead of asking the salon.**
   This was the most substantial change. Redesigned `/file-attente/[id]`
   so selecting a service **submits a request**, not a ticket; the salon
   sees it live in a new "Demandes sans rendez-vous" panel
   (`walkin-requests-panel.tsx`) and must explicitly Confirm or Refuse.
   Confirming creates a real walk-in appointment in the salon's
   operational appointments list and turns the customer's waiting screen
   into the (unchanged, per the brief) queue ticket view — automatically,
   without the customer refreshing.
   - Mechanism: `src/lib/mock/walkin-store.ts` uses `localStorage` plus
     the native `storage` event, which fires in *other* tabs on the same
     origin when localStorage changes. This is genuinely live — verified
     with a two-tab Playwright test (customer tab + salon dashboard tab,
     shared browser context) — not a simulation dressed up as one. The
     one honest limit, stated in the module's own doc comment: it
     synchronizes tabs on the *same browser*, not a customer's phone with
     a salon's separate device. That needs Part 2's real backend
     (WebSocket/polling against a shared database) — the call sites
     (`submit`, `respond`) don't change when that lands, only what's
     behind them.
8. **Adding an employee did nothing — the dialog's "Ajouter" button
   just closed itself.** This was a real, confirmed bug: the form had no
   handler wiring it to any state at all. Fixed properly rather than
   patched: built a small persistence layer
   (`src/lib/hooks/use-persisted-list.ts` + `src/lib/mock/salon-overrides.ts`)
   that overlays localStorage-backed employee/service edits onto the seed
   salon data, wired into `useSalonWorkspace()` so every dashboard page —
   and the customer-facing salon page, via the same overlay — sees the
   same live data. Verified end-to-end with Playwright: add an employee,
   hard-reload, still there; the employee also appears (once assigned to
   a service) as a selectable professional in the customer booking flow,
   in the same browser. Employees are deactivated (`active: false`),
   never destructively deleted, so historical appointments and finance
   rows keep their staff reference — matching the "prefer ACTIVE/INACTIVE"
   requirement.
9. **Expenses were read-only; the estimated profit was a static seed-time
   number.** Added full add/edit/delete for expenses
   (`expenses-table.tsx` + `src/lib/mock/finance-store.ts`, same
   persistence layer as employees/services). `totalExpensesMonth` and
   `estimatedProfit` are now computed live from the actual expenses state
   on every render — verified with Playwright: adding a 500 MAD expense
   moved both numbers by exactly 500, and the new expense survived a hard
   reload.

**What "persists" means right now, precisely:** everything above that
needs to survive a refresh does, today, via `localStorage` — genuinely
read back and re-rendered, not a display-only illusion. What it does
*not* do is sync across two different browsers or devices, which is an
honest architectural limit of client-side storage, not a shortcut taken to
look finished. That gap is exactly what Part 2's real database closes,
and every one of these modules (`salon-overrides.ts`, `finance-store.ts`,
`walkin-store.ts`) was written so that closing it is a change to what's
*behind* `usePersistedList`/the store functions, not to any component
that calls them.

## `/admin` login gate: history

For a short window on 2026-09-02, `src/proxy.ts` was set to skip the
`WAGTI_ADMIN_CODE` session check entirely, by explicit request, so the
owner could check `/admin` without re-logging in on every new preview URL
during solo development. That has since been reverted — the gate is back
to enforcing the signed session cookie as described in §2, and `/admin`
requires the code again. Noted here so this doesn't get raised as a fresh
finding later.

## 9. Part 2 — transition to a real V1

Not started as of this pass — see the conversation for the proposed
technical foundation (Next.js + PostgreSQL + Prisma/Drizzle + real auth)
and the one decision that requires the product owner: which hosted
Postgres to provision (e.g. Vercel Postgres/Neon, or Supabase) before a
real persistence layer, multi-tenant data isolation, real availability
engine, and platform-wide auth/roles can be built. This section will be
filled in once that work begins.
