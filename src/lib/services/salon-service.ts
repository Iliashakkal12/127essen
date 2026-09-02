/**
 * SalonService — read access to the salon marketplace catalog.
 *
 * Thin wrapper around src/data/salons.ts today; a database-backed
 * implementation can replace the bodies of these functions without any
 * caller needing to change (all consumers go through this module rather
 * than importing `salons` directly for anything beyond simple listing).
 */

import { salons, categories, neighborhoods } from "@/data/salons";
import type { Salon, Service, Staff } from "@/lib/types";

export function listSalons(): Salon[] {
  return salons;
}

export function getSalonById(id: string): Salon | undefined {
  return salons.find((s) => s.id === id);
}

export function getSalonBySlug(slug: string): Salon | undefined {
  return salons.find((s) => s.slug === slug);
}

export function listCategories() {
  return categories;
}

export function listNeighborhoods() {
  return neighborhoods;
}

/** Staff members of a salon who are able to perform the given service. */
export function getCompatibleStaff(salon: Salon, serviceId: string | null): Staff[] {
  if (!serviceId) return salon.staff;
  const service = salon.services.find((s) => s.id === serviceId);
  if (!service) return [];
  return salon.staff.filter((member) => service.staffIds.includes(member.id));
}

/** Services a given staff member is able to perform at this salon. */
export function getCompatibleServices(salon: Salon, staffId: string | null): Service[] {
  if (!staffId) return salon.services;
  return salon.services.filter((service) => service.staffIds.includes(staffId));
}

export function isStaffCompatibleWithService(
  salon: Salon,
  staffId: string,
  serviceId: string
): boolean {
  const service = salon.services.find((s) => s.id === serviceId);
  return Boolean(service?.staffIds.includes(staffId));
}
