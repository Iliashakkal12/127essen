/**
 * QueueService — the virtual walk-in queue, kept deliberately separate from
 * BookingService.
 *
 * Critical product rule: nothing in this module runs unless a customer
 * explicitly opts in ("Rejoindre la file d'attente"). No ticket is ever
 * created as a side effect of loading a page. UI code must call
 * `joinQueue(...)` from a click handler, never from a render or an effect
 * that fires on mount without user action.
 */

import type { QueueTicket, Salon } from "@/lib/types";
import { getSalonOperations } from "@/lib/mock/salon-operations";
import { nowTimeHHmm } from "@/lib/date";

const AVG_SERVICE_MIN = 12;

/** Current queue state for a salon (staff-facing view / "how busy is it right now"). Read-only, does not create anything. */
export function getQueueSnapshot(salon: Salon): QueueTicket[] {
  return getSalonOperations(salon).queueTickets;
}

export interface JoinQueueInput {
  salon: Salon;
  serviceName: string;
  clientName?: string;
}

/**
 * Creates a new queue ticket for a customer who has explicitly asked to
 * join. Pure function — the caller (client component) owns the resulting
 * ticket in its own state; this only computes what the ticket should look
 * like given the current (mock) queue snapshot.
 */
export function joinQueue({ salon, serviceName, clientName = "Vous" }: JoinQueueInput): QueueTicket {
  const current = getQueueSnapshot(salon);
  const peopleAhead = current.filter((t) => t.status !== "terminé").length;
  const lastNumber = current.reduce((max, t) => {
    const n = Number(t.number.replace(/\D/g, ""));
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 10);

  return {
    id: `${salon.id}-you-${Date.now()}`,
    number: `A-0${lastNumber + 1}`,
    clientName,
    service: serviceName,
    joinedAt: nowTimeHHmm(),
    estimatedWaitMin: peopleAhead * AVG_SERVICE_MIN,
    peopleAhead,
    status: peopleAhead === 0 ? "prêt" : peopleAhead === 1 ? "bientôt votre tour" : "en attente",
  };
}

export function statusFromPeopleAhead(peopleAhead: number): QueueTicket["status"] {
  if (peopleAhead <= 0) return "prêt";
  if (peopleAhead === 1) return "bientôt votre tour";
  return "en attente";
}
