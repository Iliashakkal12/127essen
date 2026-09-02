"use client";

/**
 * Per-salon employee/service overrides on top of the static seed catalog
 * (src/data/salons.ts), persisted via usePersistedList.
 *
 * This is what makes "Ajouter un employé" and service editing actually
 * stick: every dashboard page reads the active salon through
 * useSalonWorkspace() (see salon-context.tsx), which now returns the
 * seed salon with these overrides merged in — so adding an employee here
 * makes them show up everywhere the active salon's staff/services are
 * read (team list, service assignment, professional selection), and they
 * survive a refresh because they're read back from localStorage on mount.
 *
 * The customer-facing salon page (outside the dashboard) applies the same
 * overlay via useSalonOverrides so it sees the same data within one
 * browser — see salon-detail-client.tsx.
 */

import { useMemo } from "react";

import type { RevenueByEmployeeEntry, Salon, Service, Staff } from "@/lib/types";
import { usePersistedList } from "@/lib/hooks/use-persisted-list";

function employeesKey(salonId: string) {
  return `wagti.salon.${salonId}.employees`;
}

function servicesKey(salonId: string) {
  return `wagti.salon.${salonId}.services`;
}

export function useSalonOverrides(baseSalon: Salon) {
  const [staff, setStaff] = usePersistedList<Staff>(employeesKey(baseSalon.id), baseSalon.staff);
  const [services, setServices] = usePersistedList<Service>(servicesKey(baseSalon.id), baseSalon.services);

  const salon = useMemo<Salon>(
    () => ({ ...baseSalon, staff, services }),
    [baseSalon, staff, services]
  );

  return { salon, staff, setStaff, services, setServices };
}

/** Staff eligible to be booked/assigned going forward. Deactivated staff are hidden here but kept in `staff` for history (finance, past appointments). */
export function activeStaff(staff: Staff[]): Staff[] {
  return staff.filter((member) => member.active !== false);
}

/** A salon view suitable for customer-facing booking: inactive staff excluded from selection entirely. */
export function forBooking(salon: Salon): Salon {
  return { ...salon, staff: activeStaff(salon.staff) };
}

/**
 * getSalonOperations()'s revenueByEmployee is a cached, seed-time
 * snapshot (deterministic mock "this month's activity"), so a staff
 * member added after that snapshot was generated wouldn't appear in it —
 * they just have no history yet, which is correct. This appends a
 * zero-stat row for any live staff missing from the cached list, and
 * keeps deactivated staff's historical rows intact (finance is a
 * historical record, not a "who's currently available" view).
 */
export function mergeRevenueByEmployee(
  cached: RevenueByEmployeeEntry[],
  liveStaff: Staff[]
): RevenueByEmployeeEntry[] {
  const known = new Set(cached.map((e) => e.id));
  const additions: RevenueByEmployeeEntry[] = liveStaff
    .filter((member) => !known.has(member.id))
    .map((member) => ({
      id: member.id,
      name: member.name,
      initials: member.initials,
      revenue: 0,
      commissionPercent: member.commissionPercent,
      commissionOwed: 0,
      clients: 0,
    }));
  return [...cached, ...additions];
}
