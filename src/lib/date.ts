/**
 * Centralized date/time helpers for Wagti.
 *
 * All "today" logic must go through here instead of hardcoding a date
 * literal — the prototype previously shipped with a stale
 * `new Date("2026-07-01T00:00:00")` baked into the booking confirmation
 * page, which silently drifted out of sync with the real current date.
 *
 * Wagti operates in Casablanca (Africa/Casablanca, no DST since 2018,
 * UTC+1 year-round), so all "business day" computations are pinned to
 * that timezone regardless of the visitor's or server's local timezone.
 */

export const WAGTI_TIMEZONE = "Africa/Casablanca";

/** Returns a Date representing "now" — the single source of truth for "today". */
export function now(): Date {
  return new Date();
}

/** YYYY-MM-DD for a given date, in Casablanca local time. */
export function toISODate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: WAGTI_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Today's date key (YYYY-MM-DD) in Casablanca time. */
export function todayISO(): string {
  return toISODate(now());
}

/** Adds N days to a date and returns a new Date (UTC-safe, no DST issues in Morocco). */
export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function isoDateFor(dayOffset: number): string {
  return toISODate(addDays(now(), dayOffset));
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  timeZone: WAGTI_TIMEZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** Human-readable French date label, e.g. "mercredi 2 septembre". */
export function formatLongDateFR(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return WEEKDAY_FORMATTER.format(date);
}

const SHORT_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  timeZone: WAGTI_TIMEZONE,
  day: "numeric",
  month: "short",
});

export function formatShortDateFR(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return SHORT_FORMATTER.format(date);
}

/** Current time as "HH:mm" in Casablanca time. */
export function nowTimeHHmm(): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: WAGTI_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now());
}

/** Minutes since midnight for an "HH:mm" string. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Simple deterministic string hash (djb2), used to seed reproducible mock data. */
export function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

/** Deterministic pseudo-random generator (mulberry32), seeded by a string. */
export function seededRandom(seed: string): () => number {
  let a = hashString(seed) || 1;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
