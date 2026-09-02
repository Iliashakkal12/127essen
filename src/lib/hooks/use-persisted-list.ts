"use client";

/**
 * Generic browser-local persistence for a list of records, keyed by an
 * arbitrary storage key (typically salon-scoped, e.g. one key per salon
 * per resource type).
 *
 * This is the fix for "I add an employee/expense and it disappears after
 * refresh" — the seed catalog in src/data/salons.ts is a static, read-only
 * demo dataset, so anything the salon owner adds/edits in the dashboard
 * has to live somewhere else. Until Part 2's real database exists, that
 * "somewhere else" is localStorage: it genuinely survives a refresh on the
 * same browser (unlike component state), it's real persisted data driving
 * every derived number (not a frontend-only display change), and reads
 * are synchronous so every consumer stays consistent within one tab.
 *
 * What this does NOT do: sync across devices or browsers. That requires
 * a real backend — see AUDIT.md / ARCHITECTURE.md for the production
 * replacement (this hook's call sites don't change, only what backs them).
 */

import { useCallback, useEffect, useState } from "react";

export function usePersistedList<T>(
  storageKey: string,
  seed: T[]
): [T[], (updater: T[] | ((prev: T[]) => T[])) => void] {
  const [items, setItemsState] = useState<T[]>(seed);

  useEffect(() => {
    // Reading localStorage during render would break SSR (no `window` on
    // the server) and mismatch hydration, so persisted data can only be
    // applied after mount — same justified pattern as salon-context.tsx.
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as T[];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItemsState(parsed);
      }
    } catch {
      // localStorage unavailable/corrupt — keep the seed data.
    }
  }, [storageKey]);

  const setItems = useCallback(
    (updater: T[] | ((prev: T[]) => T[])) => {
      setItemsState((prev) => {
        const next = typeof updater === "function" ? (updater as (p: T[]) => T[])(prev) : updater;
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore write failures (private browsing, quota, etc.)
        }
        return next;
      });
    },
    [storageKey]
  );

  return [items, setItems];
}
