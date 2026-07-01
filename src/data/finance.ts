export const weekRevenue = [
  { day: "Lun", label: "Lun 22", revenue: 3200 },
  { day: "Mar", label: "Mar 23", revenue: 2850 },
  { day: "Mer", label: "Mer 24", revenue: 3600 },
  { day: "Jeu", label: "Jeu 25", revenue: 3100 },
  { day: "Ven", label: "Ven 26", revenue: 4900 },
  { day: "Sam", label: "Sam 27", revenue: 6200 },
  { day: "Dim", label: "Dim 28", revenue: 2400 },
];

export const monthRevenue = [
  { label: "Semaine 1", revenue: 19800 },
  { label: "Semaine 2", revenue: 21400 },
  { label: "Semaine 3", revenue: 24600 },
  { label: "Semaine 4", revenue: 26250 },
];

export const revenueByService = [
  { service: "Dégradé + barbe", revenue: 15600, count: 120 },
  { service: "Coupe + barbe + soin", revenue: 12100, count: 55 },
  { service: "Coupe homme classique", revenue: 9840, count: 123 },
  { service: "Rasage traditionnel", revenue: 5760, count: 64 },
  { service: "Soin visage homme", revenue: 4650, count: 31 },
  { service: "Taille de barbe", revenue: 3900, count: 65 },
];

export const revenueByEmployee = [
  { name: "Yassine El Amrani", initials: "YE", revenue: 18400, commissionPercent: 40, commissionOwed: 7360, clients: 186 },
  { name: "Othmane Raji", initials: "OR", revenue: 15100, commissionPercent: 35, commissionOwed: 5285, clients: 121 },
  { name: "Karim Bensaid", initials: "KB", revenue: 13200, commissionPercent: 35, commissionOwed: 4620, clients: 142 },
];

export const expenses = [
  { id: "e1", label: "Loyer local", category: "Fixe", amount: 12000, date: "2026-06-01" },
  { id: "e2", label: "Produits de coiffage", category: "Consommables", amount: 3200, date: "2026-06-05" },
  { id: "e3", label: "Électricité & eau", category: "Fixe", amount: 1450, date: "2026-06-06" },
  { id: "e4", label: "Salaires fixes équipe", category: "Personnel", amount: 9000, date: "2026-06-28" },
  { id: "e5", label: "Abonnement Wagti Pro", category: "Logiciel", amount: 499, date: "2026-06-01" },
  { id: "e6", label: "Marketing réseaux sociaux", category: "Marketing", amount: 1800, date: "2026-06-12" },
  { id: "e7", label: "Entretien matériel", category: "Maintenance", amount: 650, date: "2026-06-18" },
];

export const financeSummary = {
  dailyRevenue: 4900,
  dailyRevenueChangePercent: 12.4,
  weeklyRevenue: 26250,
  weeklyRevenueChangePercent: 8.1,
  monthlyRevenue: 92050,
  monthlyRevenueChangePercent: 15.6,
  totalExpensesMonth: expenses.reduce((sum, e) => sum + e.amount, 0),
  totalCommissionsMonth: revenueByEmployee.reduce((sum, e) => sum + e.commissionOwed, 0),
};

export const estimatedProfit =
  financeSummary.monthlyRevenue -
  financeSummary.totalExpensesMonth -
  financeSummary.totalCommissionsMonth;
