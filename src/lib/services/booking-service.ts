/**
 * BookingService — centralized appointment-availability logic.
 *
 * Before this module existed, `time-slots.tsx` rendered one hardcoded
 * array of 18 slots with a fixed `Set` of "unavailable" indexes, identical
 * for every salon, every service, every employee, and every day. This is
 * the single place that computes bookable slots so the UI never
 * special-cases availability itself.
 *
 * A production availability engine additionally needs: employee working
 * hours & breaks, days off/holidays, a real appointments table (to avoid
 * double-booking), buffer time between services, and queue state. Those
 * inputs are marked below as TODO — the function signature already takes
 * a `date` and a specific `staffId` so wiring them in later doesn't change
 * any call site.
 */

import type { Salon, Service, Staff, TimeSlot } from "@/lib/types";
import { isoDateFor, seededRandom, timeToMinutes, todayISO } from "@/lib/date";

const SLOT_STEP_MIN = 30;

function parseOpeningHours(openingHours: string): { openMin: number; closeMin: number } {
  const match = openingHours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!match) return { openMin: 9 * 60, closeMin: 20 * 60 };
  const [, oh, om, ch, cm] = match;
  return {
    openMin: Number(oh) * 60 + Number(om),
    closeMin: Number(ch) * 60 + Number(cm),
  };
}

export interface AvailabilityInput {
  salon: Salon;
  service: Service;
  /** null = "no preference", any compatible staff member accepted */
  staffId: string | null;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  /** current time as "HH:mm", used to hide past slots for today */
  nowTime?: string;
}

/**
 * Computes bookable time slots for a service at a salon, honoring:
 * - salon opening hours
 * - service duration (a slot must leave room before closing)
 * - a deterministic mock "busy" pattern per salon+staff+date (stands in for
 *   existing appointments / employee breaks until a real appointments store
 *   exists)
 * - slots already in the past, when `date` is today
 */
export function getAvailableSlots(input: AvailabilityInput): TimeSlot[] {
  const { salon, service, staffId, date } = input;
  const { openMin, closeMin } = parseOpeningHours(salon.openingHours);
  const latestStart = closeMin - service.durationMin;

  if (latestStart < openMin) return [];

  const seed = `${salon.id}:${staffId ?? "any"}:${date}:${service.id}`;
  const rand = seededRandom(seed);
  const isToday = date === todayISO();
  const nowMinutes = input.nowTime ? timeToMinutes(input.nowTime) : -1;

  const slots: TimeSlot[] = [];
  for (let minutes = openMin; minutes <= latestStart; minutes += SLOT_STEP_MIN) {
    const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

    if (isToday && minutes <= nowMinutes + 30) {
      // Need at least 30 min lead time to book "today".
      continue;
    }

    // Deterministic mock busy-ness: ~35% of remaining slots are taken.
    const available = rand() > 0.35;
    slots.push({ time, available });
  }

  return slots;
}

export function getAvailableDates(
  count = 2
): { value: "today" | "tomorrow"; date: string; label: string }[] {
  const all: { value: "today" | "tomorrow"; date: string; label: string }[] = [
    { value: "today", date: todayISO(), label: "Aujourd'hui" },
    { value: "tomorrow", date: isoDateFor(1), label: "Demain" },
  ];
  return all.slice(0, count);
}

export function hasAnyAvailability(slots: TimeSlot[]): boolean {
  return slots.some((s) => s.available);
}

/** Staff eligible for a service, "no preference" resolves to any compatible staff. */
export function resolveEligibleStaff(salon: Salon, service: Service): Staff[] {
  return salon.staff.filter((member) => service.staffIds.includes(member.id));
}

export function buildBookingReference(serviceId: string, date: string, time: string): string {
  return `WG-${serviceId.toUpperCase()}-${date.replace(/-/g, "")}-${time.replace(":", "")}`;
}
