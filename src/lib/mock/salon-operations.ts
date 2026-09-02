/**
 * Deterministic per-salon mock operational data (appointments, queue,
 * revenue, expenses, commissions).
 *
 * The original prototype hardcoded a single day's worth of appointments and
 * a single month of finance numbers for "Barber Lounge" only
 * (src/data/appointments.ts, src/data/finance.ts). Every salon in the
 * marketplace showed those exact same numbers under a different name once
 * "Espace salon" existed. This module replaces that: given any `Salon`, it
 * generates a self-consistent operational snapshot seeded by the salon's
 * id, so the numbers are stable across renders/switches but differ per
 * salon and use that salon's *actual* services/staff/prices.
 *
 * This is still mock data — see AUDIT.md for what a real implementation
 * (Postgres tables: appointments, queue_tickets, expenses, commissions...)
 * looks like. The point of centralizing it here is that swapping this
 * module for real database queries later requires touching exactly one
 * file, not every dashboard page.
 */

import type {
  Appointment,
  AppointmentStatus,
  Expense,
  FinanceSummary,
  MonthRevenuePoint,
  QueueTicket,
  RevenueByEmployeeEntry,
  RevenueByServiceEntry,
  Salon,
  SalonOperations,
  Service,
  Staff,
  WeekRevenuePoint,
} from "@/lib/types";
import {
  addDays,
  minutesToTime,
  nowTimeHHmm,
  seededRandom,
  timeToMinutes,
  toISODate,
} from "@/lib/date";
import { estimatePlatformRevenue } from "@/lib/platform-config";

const CLIENT_NAME_POOL = [
  "Adil Mansouri", "Hamza Tazi", "Younes Kadiri", "Ilyas Berrada", "Nabil Ouazzani",
  "Tarik Haddad", "Karim Doukkali", "Sami Regragui", "Reda Chraibi", "Bilal Moussaoui",
  "Sanae Bouzid", "Ghita Lahlou", "Rim Alami", "Nadia Fassi", "Amine Chraibi",
  "Widad El Amrani", "Fadwa Naciri", "Lina Sabri", "Omar Jebli", "Yasmina Perron",
  "Meryem Idrissi", "Zakaria Ammor", "Yassine Bakkali", "Siham Rifai", "Anas Kabbaj",
  "Salma Zniber", "Houda Amrani", "Mehdi Alaoui", "Imane Fassi", "Othmane Sabri",
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function parseOpeningHours(openingHours: string): { openMin: number; closeMin: number } {
  const match = openingHours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!match) return { openMin: 9 * 60, closeMin: 20 * 60 };
  const [, oh, om, ch, cm] = match;
  return {
    openMin: Number(oh) * 60 + Number(om),
    closeMin: Number(ch) * 60 + Number(cm),
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function weightedStatus(
  slotMinutes: number,
  nowMinutes: number,
  rand: () => number
): AppointmentStatus {
  if (rand() < 0.08) return "annulée";
  if (slotMinutes + 30 < nowMinutes) return "terminée";
  if (slotMinutes <= nowMinutes) return rand() < 0.7 ? "confirmée" : "terminée";
  return rand() < 0.75 ? "confirmée" : "en attente";
}

function generateTodayAppointments(salon: Salon, rand: () => number): Appointment[] {
  const { openMin, closeMin } = parseOpeningHours(salon.openingHours);
  const nowMinutes = timeToMinutes(nowTimeHHmm());
  const appointments: Appointment[] = [];
  let idCounter = 1;

  for (const staff of salon.staff) {
    const compatibleServices = salon.services.filter((s) => s.staffIds.includes(staff.id));
    if (compatibleServices.length === 0) continue;

    const count = 3 + Math.floor(rand() * 3); // 3-5 appointments per staff member today
    let cursor = openMin + Math.floor(rand() * 4) * 15;

    for (let i = 0; i < count && cursor < closeMin - 20; i++) {
      const service = pick(compatibleServices, rand);
      const isWalkIn = rand() < 0.18;
      const client = isWalkIn ? "Walk-in" : pick(CLIENT_NAME_POOL, rand);

      appointments.push({
        id: `${salon.id}-a${idCounter++}`,
        clientName: client,
        clientInitials: isWalkIn ? "WI" : initialsOf(client),
        service: service.name,
        staff: staff.name,
        time: minutesToTime(cursor),
        durationMin: service.durationMin,
        price: service.price,
        status: weightedStatus(cursor, nowMinutes, rand),
        type: isWalkIn ? "walk-in" : "réservation",
      });

      cursor += service.durationMin + 15 + Math.floor(rand() * 30);
    }
  }

  return appointments.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}

function generateQueueTickets(salon: Salon, rand: () => number): QueueTicket[] {
  const activeCount = Math.floor(rand() * 4); // 0-3 people currently waiting
  const tickets: QueueTicket[] = [];
  const baseNumber = 10 + Math.floor(rand() * 20);
  const nowMinutes = timeToMinutes(nowTimeHHmm());

  for (let i = 0; i < activeCount; i++) {
    const service = pick(salon.services, rand);
    const peopleAhead = i;
    const status: QueueTicket["status"] =
      peopleAhead === 0 ? "prêt" : peopleAhead === 1 ? "bientôt votre tour" : "en attente";

    tickets.push({
      id: `${salon.id}-q${i + 1}`,
      number: `A-0${baseNumber + i}`,
      clientName: pick(CLIENT_NAME_POOL, rand),
      service: service.name,
      joinedAt: minutesToTime(Math.max(0, nowMinutes - (activeCount - i) * 8)),
      estimatedWaitMin: peopleAhead * 12,
      peopleAhead,
      status,
    });
  }

  return tickets;
}

function generateRevenueByEmployee(salon: Salon): RevenueByEmployeeEntry[] {
  return salon.staff.map((member: Staff) => ({
    id: member.id,
    name: member.name,
    initials: member.initials,
    revenue: member.revenueGeneratedMonth,
    commissionPercent: member.commissionPercent,
    commissionOwed: Math.round(member.revenueGeneratedMonth * (member.commissionPercent / 100)),
    clients: member.clientsServedMonth,
  }));
}

function generateRevenueByService(salon: Salon, rand: () => number): RevenueByServiceEntry[] {
  return salon.services
    .map((service: Service) => {
      const count = 15 + Math.floor(rand() * 110);
      return {
        service: service.name,
        revenue: service.price * count,
        count,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

function generateWeekRevenue(salon: Salon, rand: () => number): WeekRevenuePoint[] {
  const dayLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const avgTicket = (salon.priceFrom + salon.priceTo) / 2;
  const baseDailyRevenue = avgTicket * (6 + rand() * 10);

  const today = new Date();
  const mondayOffset = ((today.getDay() + 6) % 7) * -1; // days since Monday
  const monday = addDays(today, mondayOffset);

  return dayLabels.map((day, i) => {
    const date = addDays(monday, i);
    const weekendBoost = i === 5 ? 1.6 : i === 6 ? 0.65 : 1;
    const revenue = Math.round(baseDailyRevenue * weekendBoost * (0.8 + rand() * 0.4));
    return {
      day,
      label: `${day} ${date.getDate()}`,
      revenue,
    };
  });
}

function generateMonthRevenue(weekRevenue: WeekRevenuePoint[], rand: () => number): MonthRevenuePoint[] {
  const weeklyTotal = weekRevenue.reduce((sum, d) => sum + d.revenue, 0);
  return [1, 2, 3, 4].map((week) => ({
    label: `Semaine ${week}`,
    revenue: Math.round(weeklyTotal * (0.85 + rand() * 0.35)),
  }));
}

const EXPENSE_TEMPLATE: { label: string; category: string; weight: number }[] = [
  { label: "Loyer local", category: "Fixe", weight: 0.22 },
  { label: "Produits & consommables", category: "Consommables", weight: 0.06 },
  { label: "Électricité & eau", category: "Fixe", weight: 0.03 },
  { label: "Salaires fixes équipe", category: "Personnel", weight: 0.18 },
  { label: "Abonnement Wagti", category: "Logiciel", weight: 0.01 },
  { label: "Marketing réseaux sociaux", category: "Marketing", weight: 0.035 },
  { label: "Entretien matériel", category: "Maintenance", weight: 0.015 },
];

function generateExpenses(salon: Salon, monthlyRevenue: number, rand: () => number): Expense[] {
  const monthStart = new Date();
  monthStart.setDate(1);

  return EXPENSE_TEMPLATE.map((tpl, i) => {
    const amount = Math.max(150, Math.round((monthlyRevenue * tpl.weight) / 10) * 10);
    const day = 1 + Math.floor(rand() * 27);
    const date = addDays(monthStart, day - 1);
    return {
      id: `${salon.id}-e${i + 1}`,
      label: tpl.label,
      category: tpl.category,
      amount,
      date: toISODate(date),
    };
  });
}

const cache = new Map<string, SalonOperations>();

export function getSalonOperations(salon: Salon): SalonOperations {
  const cached = cache.get(salon.id);
  if (cached) return cached;

  const rand = seededRandom(`${salon.id}:ops`);

  const todayAppointments = generateTodayAppointments(salon, rand);
  const queueTickets = generateQueueTickets(salon, rand);
  const revenueByEmployee = generateRevenueByEmployee(salon);
  const revenueByService = generateRevenueByService(salon, rand);
  const weekRevenue = generateWeekRevenue(salon, rand);
  const monthRevenue = generateMonthRevenue(weekRevenue, rand);
  const monthlyRevenue = monthRevenue.reduce((sum, w) => sum + w.revenue, 0);
  const expenses = generateExpenses(salon, monthlyRevenue, rand);

  const dailyRevenue = todayAppointments
    .filter((a) => a.status !== "annulée")
    .reduce((sum, a) => sum + a.price, 0);
  const weeklyRevenue = weekRevenue.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpensesMonth = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCommissionsMonth = revenueByEmployee.reduce((sum, e) => sum + e.commissionOwed, 0);
  const completedServicesMonth = revenueByEmployee.reduce((sum, e) => sum + e.clients, 0);

  const financeSummary: FinanceSummary = {
    dailyRevenue,
    dailyRevenueChangePercent: Math.round((rand() * 24 - 6) * 10) / 10,
    weeklyRevenue,
    weeklyRevenueChangePercent: Math.round((rand() * 18 - 4) * 10) / 10,
    monthlyRevenue,
    monthlyRevenueChangePercent: Math.round((rand() * 22 - 3) * 10) / 10,
    totalExpensesMonth,
    totalCommissionsMonth,
    completedServicesMonth,
  };

  const estimatedProfit = monthlyRevenue - totalExpensesMonth - totalCommissionsMonth;

  const operations: SalonOperations = {
    salonId: salon.id,
    todayAppointments,
    queueTickets,
    weekRevenue,
    monthRevenue,
    revenueByService,
    revenueByEmployee,
    expenses,
    financeSummary,
    estimatedProfit,
    todayAppointmentsChangePercent: Math.round(rand() * 20 - 4),
    walkInsChangePercent: Math.round(rand() * 16 - 5),
  };

  cache.set(salon.id, operations);
  return operations;
}

/** Platform-side fee estimate for this salon this month, from the shared business model config. */
export function getSalonPlatformFees(salon: Salon) {
  const ops = getSalonOperations(salon);
  return estimatePlatformRevenue(ops.financeSummary.completedServicesMonth);
}
