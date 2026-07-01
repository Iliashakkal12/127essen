# Wagti — Marketplace beauté & bien-être (maquette)

Maquette front-end cliquable d'une plateforme SaaS de type marketplace pour
barbershops, salons de coiffure, instituts de beauté et spas à Casablanca.
Aucun backend réel : toutes les données proviennent de `src/data/*.ts`.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Composants shadcn/ui (Radix UI + CVA) écrits à la main dans `src/components/ui`
- Lucide icons
- Recharts pour les graphiques du tableau de bord
- `qrcode.react` pour les QR codes de démonstration

## Démarrer

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Pages

**Côté client**
- `/` — Landing page
- `/recherche` — Marketplace avec filtres
- `/salons/[slug]` — Fiche salon + flux de réservation
- `/reservation/confirmation` — Confirmation + QR code
- `/file-attente/[id]` — File d'attente virtuelle

**Côté salon**
- `/dashboard` — Vue d'ensemble, planning, rendez-vous, file d'attente
- `/dashboard/finances` — Revenus, dépenses, commissions, profit estimé
- `/dashboard/employes` — Équipe et performance
- `/dashboard/services` — Gestion des prestations

**Plateforme**
- `/admin` — Démo tableau de bord administrateur

## Structure

```
src/
  app/            routes (App Router)
  components/
    ui/           primitives shadcn/ui
    layout/       header, footer, dashboard shell
    marketing/    sections de la landing page
    marketplace/  carte salon, recherche
    salon/        fiche salon, réservation
    booking/      confirmation, QR code
    queue/        file d'attente virtuelle
    dashboard/    stats, planning, tables
    finance/      graphiques et tableaux financiers
    admin/        graphiques plateforme
  data/           données mockées (JSON/TS)
  lib/            types partagés et utilitaires
```
