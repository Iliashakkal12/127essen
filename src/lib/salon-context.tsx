"use client";

/**
 * "Espace salon" workspace context.
 *
 * Holds which salon the current staff/owner session is currently managing
 * and persists it (localStorage, prototype-only) across navigation inside
 * /dashboard. Every dashboard page must read the active salon from here
 * instead of importing `salons[0]` directly — that was the root cause of
 * "Espace salon" always showing Barber Lounge regardless of the intended
 * establishment.
 *
 * Production replacement: this should become a server-verified
 * `salon_members` lookup (which salons the authenticated user may manage),
 * with the active salon id kept in a signed session/cookie instead of
 * localStorage. The hook API below (`useSalonWorkspace`) is written so that
 * swap does not require touching any dashboard page.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { salons } from "@/data/salons";
import type { Salon } from "@/lib/types";

const STORAGE_KEY = "wagti.dashboard.activeSalonId";

interface SalonWorkspaceContextValue {
  salon: Salon;
  salonId: string;
  salons: Salon[];
  setSalonId: (id: string) => void;
}

const SalonWorkspaceContext = createContext<SalonWorkspaceContextValue | null>(null);

export function SalonWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [salonId, setSalonIdState] = useState<string>(salons[0].id);

  useEffect(() => {
    // Reading localStorage during render would break SSR (no `window` on the
    // server) and mismatch hydration, so the persisted salon can only be
    // applied after mount — the textbook case for syncing from an external
    // store in an effect.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && salons.some((s) => s.id === stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSalonIdState(stored);
      }
    } catch {
      // localStorage unavailable (SSR/private mode) — fall back to default salon.
    }
  }, []);

  const setSalonId = useCallback((id: string) => {
    setSalonIdState(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore write failures
    }
  }, []);

  const salon = useMemo(
    () => salons.find((s) => s.id === salonId) ?? salons[0],
    [salonId]
  );

  const value = useMemo(
    () => ({ salon, salonId: salon.id, salons, setSalonId }),
    [salon, setSalonId]
  );

  return (
    <SalonWorkspaceContext.Provider value={value}>
      {children}
    </SalonWorkspaceContext.Provider>
  );
}

export function useSalonWorkspace(): SalonWorkspaceContextValue {
  const ctx = useContext(SalonWorkspaceContext);
  if (!ctx) {
    throw new Error("useSalonWorkspace must be used within a SalonWorkspaceProvider");
  }
  return ctx;
}
