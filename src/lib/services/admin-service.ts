/**
 * AdminService — platform-wide aggregation for the private Wagti owner
 * dashboard (/admin). Never imported by customer- or salon-facing code.
 *
 * Aggregates the same per-salon mock operations every salon workspace uses
 * (src/lib/mock/salon-operations.ts) instead of maintaining a second,
 * disconnected set of "platform" numbers — that duplication is exactly
 * what let the old /admin page show static figures (214 salons, 38,460
 * bookings) that had no relationship to the 8 actual demo salons or their
 * dashboards.
 */

import { listSalons } from "@/lib/services/salon-service";
import { getSalonOperations } from "@/lib/mock/salon-operations";
import { estimatePlatformRevenue, platformConfig } from "@/lib/platform-config";
import type { Salon } from "@/lib/types";

export interface AdminSalonRow {
  salon: Salon;
  bookingsToday: number;
  activeQueue: number;
  monthlyRevenue: number;
  completedServicesMonth: number;
  employeeCount: number;
  serviceCount: number;
  platformFees: number;
}

export function getAdminSalonRows(): AdminSalonRow[] {
  return listSalons().map((salon) => {
    const ops = getSalonOperations(salon);
    const fees = estimatePlatformRevenue(ops.financeSummary.completedServicesMonth);
    return {
      salon,
      bookingsToday: ops.todayAppointments.filter((a) => a.status !== "annulée").length,
      activeQueue: ops.queueTickets.filter((t) => t.status !== "terminé").length,
      monthlyRevenue: ops.financeSummary.monthlyRevenue,
      completedServicesMonth: ops.financeSummary.completedServicesMonth,
      employeeCount: salon.staff.length,
      serviceCount: salon.services.length,
      platformFees: fees.total,
    };
  });
}

export interface PlatformKpis {
  totalSalons: number;
  activeSalonsToday: number;
  totalCustomersEstimate: number;
  totalBookingsToday: number;
  completedBookingsToday: number;
  cancelledBookingsToday: number;
  activeQueues: number;
  salonRevenueMonth: number;
  platformRevenueMonth: number;
}

export function getPlatformKpis(): PlatformKpis {
  const salons = listSalons();
  const rows = getAdminSalonRows();

  const allOps = salons.map((s) => getSalonOperations(s));

  const completedBookingsToday = allOps.reduce(
    (sum, ops) => sum + ops.todayAppointments.filter((a) => a.status === "terminée").length,
    0
  );
  const cancelledBookingsToday = allOps.reduce(
    (sum, ops) => sum + ops.todayAppointments.filter((a) => a.status === "annulée").length,
    0
  );
  const totalBookingsToday = allOps.reduce((sum, ops) => sum + ops.todayAppointments.length, 0);

  const activeQueues = rows.reduce((sum, r) => sum + r.activeQueue, 0);
  const salonRevenueMonth = rows.reduce((sum, r) => sum + r.monthlyRevenue, 0);
  const platformRevenueMonth = rows.reduce((sum, r) => sum + r.platformFees, 0);
  const totalCustomersEstimate = allOps.reduce(
    (sum, ops) => sum + ops.revenueByEmployee.reduce((s, e) => s + e.clients, 0),
    0
  );

  return {
    totalSalons: salons.length,
    activeSalonsToday: salons.filter((s) => s.openToday).length,
    totalCustomersEstimate,
    totalBookingsToday,
    completedBookingsToday,
    cancelledBookingsToday,
    activeQueues,
    salonRevenueMonth,
    platformRevenueMonth,
  };
}

export function getPlatformBusinessModel() {
  return platformConfig;
}

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

/** Real category breakdown across the salons actually in this prototype (never a fabricated "214 salons" figure). */
export function getCategoryDistribution() {
  const rows = getAdminSalonRows();
  const counts = new Map<string, number>();
  for (const row of rows) {
    counts.set(row.salon.category, (counts.get(row.salon.category) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([category, count], i) => ({
    category,
    count,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));
}

/** Platform-wide revenue trend, summed from every salon's own (per-salon deterministic) weekly revenue. */
export function getPlatformWeeklyRevenueTrend() {
  const allOps = listSalons().map((s) => getSalonOperations(s));
  const dayCount = allOps[0]?.weekRevenue.length ?? 0;

  return Array.from({ length: dayCount }, (_, i) => ({
    day: allOps[0]?.weekRevenue[i]?.day ?? "",
    label: allOps[0]?.weekRevenue[i]?.label ?? "",
    revenue: allOps.reduce((sum, ops) => sum + (ops.weekRevenue[i]?.revenue ?? 0), 0),
  }));
}
