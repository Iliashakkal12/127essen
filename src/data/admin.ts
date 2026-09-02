/**
 * Legacy/placeholder monthly SaaS pricing plans.
 *
 * These are NOT part of Wagti's active business model (see
 * src/lib/platform-config.ts for the real per-transaction fee model:
 * customerFeePerBooking + salonFeePerService with a volume-threshold
 * relief). They're kept here, clearly labelled as optional/future in the
 * UI (see marketing/pricing-section.tsx), in case a subscription tier is
 * introduced later alongside the transaction fees.
 */
export const pricingPlans = [
  {
    name: "Essentiel",
    price: 299,
    period: "/ mois",
    description: "Pour les salons individuels qui démarrent.",
    features: [
      "Agenda & réservations en ligne",
      "File d'attente QR code",
      "Jusqu'à 3 employés",
      "Support par email",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: 599,
    period: "/ mois",
    description: "Pour les salons établis avec équipe.",
    features: [
      "Tout Essentiel",
      "Jusqu'à 10 employés",
      "Tableau de bord financier complet",
      "Gestion des commissions",
      "Support prioritaire",
    ],
    highlighted: true,
  },
  {
    name: "Réseau",
    price: 1290,
    period: "/ mois",
    description: "Pour les chaînes multi-salons.",
    features: [
      "Tout Pro",
      "Employés illimités",
      "Multi-établissements",
      "Statistiques comparatives",
      "Account manager dédié",
    ],
    highlighted: false,
  },
];
