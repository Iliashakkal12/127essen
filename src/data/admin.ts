export const platformMetrics = {
  totalSalons: 214,
  totalSalonsChangePercent: 18.2,
  totalBookings: 38460,
  totalBookingsChangePercent: 24.7,
  revenueEstimateMAD: 3120000,
  revenueEstimateChangePercent: 21.3,
  activeUsers: 15840,
  activeUsersChangePercent: 32.5,
  avgQueueTimeSavedMin: 22,
};

export const platformGrowth = [
  { month: "Jan", salons: 128, bookings: 18200 },
  { month: "Fév", salons: 142, bookings: 20100 },
  { month: "Mar", salons: 156, bookings: 23400 },
  { month: "Avr", salons: 171, bookings: 27800 },
  { month: "Mai", salons: 190, bookings: 32600 },
  { month: "Jun", salons: 214, bookings: 38460 },
];

export const topSalons = [
  { name: "Barber Lounge Maarif", neighborhood: "Maarif", bookings: 1240, revenue: 92050, rating: 4.8 },
  { name: "Ocean Spa Ain Diab", neighborhood: "Ain Diab", bookings: 860, revenue: 128400, rating: 4.9 },
  { name: "Bourgogne Barber Club", neighborhood: "Bourgogne", bookings: 1085, revenue: 74200, rating: 4.7 },
  { name: "Gauthier Coiffure Prestige", neighborhood: "Gauthier", bookings: 690, revenue: 105300, rating: 4.6 },
  { name: "CIL Wellness Spa", neighborhood: "CIL", bookings: 520, revenue: 88900, rating: 4.8 },
];

export const categoryDistribution = [
  { category: "Barbershop", count: 78, color: "var(--chart-1)" },
  { category: "Salon de coiffure", count: 64, color: "var(--chart-2)" },
  { category: "Institut de beauté", count: 45, color: "var(--chart-3)" },
  { category: "Spa & bien-être", count: 27, color: "var(--chart-4)" },
];

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
