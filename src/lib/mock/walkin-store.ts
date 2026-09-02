"use client";

/**
 * QR walk-in request/response, shared across browser tabs via
 * localStorage + the native `storage` event.
 *
 * Product rule this exists to satisfy: scanning a salon's QR code must
 * NOT create a confirmed appointment or queue ticket by itself. It
 * submits a *request*; the salon explicitly confirms or refuses it, and
 * only a confirmation turns it into a real walk-in.
 *
 * `storage` events fire in every OTHER tab/window on the same origin
 * when localStorage changes — not in the tab that made the write. That's
 * exactly the primitive needed here: a customer's tab and a salon
 * owner's dashboard tab, open in the same browser, see each other's
 * writes live. This is a genuine, working mechanism, not a simulation —
 * with one honest limit: it only works within one browser. Syncing a
 * customer's phone to a salon's separate till/tablet needs a real
 * backend (see AUDIT.md / ARCHITECTURE.md) — this module's call sites
 * don't change when that lands, only what's behind read()/write().
 */

import { useCallback, useEffect, useState } from "react";
import type { WalkInRequest, WalkInRequestStatus } from "@/lib/types";

function keyFor(salonId: string) {
  return `wagti.salon.${salonId}.walkinRequests`;
}

function read(salonId: string): WalkInRequest[] {
  try {
    const raw = window.localStorage.getItem(keyFor(salonId));
    return raw ? (JSON.parse(raw) as WalkInRequest[]) : [];
  } catch {
    return [];
  }
}

function write(salonId: string, requests: WalkInRequest[]) {
  try {
    window.localStorage.setItem(keyFor(salonId), JSON.stringify(requests));
  } catch {
    // ignore write failures (private browsing, quota, etc.)
  }
}

/** Customer side: submit a request and track its live status. */
export function useWalkInRequest(salonId: string) {
  const [request, setRequestState] = useState<WalkInRequest | null>(null);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== keyFor(salonId) || !request) return;
      const updated = read(salonId).find((r) => r.id === request.id);
      if (updated) setRequestState(updated);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [salonId, request]);

  const submit = useCallback(
    (input: {
      serviceId: string;
      serviceName: string;
      staffId?: string | null;
      staffName?: string | null;
      clientName?: string;
    }) => {
      const newRequest: WalkInRequest = {
        id: `wr-${salonId}-${Date.now()}`,
        salonId,
        serviceId: input.serviceId,
        serviceName: input.serviceName,
        staffId: input.staffId ?? null,
        staffName: input.staffName ?? null,
        clientName: input.clientName ?? "Client sur place",
        requestedAt: new Intl.DateTimeFormat("fr-FR", {
          timeZone: "Africa/Casablanca",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
        status: "pending",
      };
      write(salonId, [...read(salonId), newRequest]);
      setRequestState(newRequest);
      return newRequest;
    },
    [salonId]
  );

  return { request, submit };
}

/** Salon side: see and respond to every pending request for this salon, live. */
export function useSalonWalkInRequests(salonId: string) {
  const [requests, setRequests] = useState<WalkInRequest[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRequests(read(salonId));
    function onStorage(e: StorageEvent) {
      if (e.key === keyFor(salonId)) {
        setRequests(read(salonId));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [salonId]);

  const respond = useCallback(
    (requestId: string, status: WalkInRequestStatus, ticketNumber?: string) => {
      const next = read(salonId).map((r) => (r.id === requestId ? { ...r, status, ticketNumber } : r));
      write(salonId, next);
      setRequests(next);
    },
    [salonId]
  );

  const pending = requests.filter((r) => r.status === "pending");

  return { pending, respond };
}
