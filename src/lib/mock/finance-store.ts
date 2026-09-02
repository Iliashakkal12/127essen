"use client";

/**
 * Per-salon expense persistence, seeded from the deterministic mock
 * expenses in getSalonOperations() and then editable (add/edit/delete)
 * with real localStorage persistence — see use-persisted-list.ts for why
 * this is a real (if browser-local) data layer, not a frontend-only
 * number.
 */

import { usePersistedList } from "@/lib/hooks/use-persisted-list";
import type { Expense } from "@/lib/types";

export const EXPENSE_CATEGORIES = [
  "Loyer",
  "Électricité",
  "Produits",
  "Matériel",
  "Salaires",
  "Marketing",
  "Entretien",
  "Autre",
] as const;

function expensesKey(salonId: string) {
  return `wagti.salon.${salonId}.expenses`;
}

export function useSalonExpenses(salonId: string, seed: Expense[]) {
  return usePersistedList<Expense>(expensesKey(salonId), seed);
}
