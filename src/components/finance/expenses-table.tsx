"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import type { Expense } from "@/lib/types";
import { EXPENSE_CATEGORIES } from "@/lib/mock/finance-store";
import { todayISO } from "@/lib/date";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const emptyForm = { label: "", date: todayISO(), category: EXPENSE_CATEGORIES[0] as string, amount: "" };

export function ExpensesTable({
  expenses,
  onChange,
}: {
  expenses: Expense[];
  onChange: (updater: Expense[] | ((prev: Expense[]) => Expense[])) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditingId(expense.id);
    setForm({
      label: expense.label,
      date: expense.date,
      category: expense.category,
      amount: String(expense.amount),
    });
    setOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Supprimer cette dépense ?")) {
      onChange((prev) => prev.filter((e) => e.id !== id));
    }
  }

  function handleSave() {
    if (!form.label.trim() || !form.amount) return;
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;

    if (editingId) {
      onChange((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, label: form.label, date: form.date, category: form.category, amount }
            : e
        )
      );
    } else {
      onChange((prev) => [
        ...prev,
        { id: `custom-${Date.now()}`, label: form.label, date: form.date, category: form.category, amount },
      ]);
    }
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{expenses.length} dépense{expenses.length > 1 ? "s" : ""}</p>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setEditingId(null);
              setForm(emptyForm);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              Ajouter une dépense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier la dépense" : "Ajouter une dépense"}</DialogTitle>
              <DialogDescription>
                Cette dépense sera immédiatement prise en compte dans le résultat estimé.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="exp-label">Nom / libellé</Label>
                <Input
                  id="exp-label"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="Ex. Produits de coiffage"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="exp-date">Date</Label>
                  <Input
                    id="exp-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="exp-category">Catégorie</Label>
                  <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                    <SelectTrigger id="exp-category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exp-amount">Montant (MAD)</Label>
                <Input
                  id="exp-amount"
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="Ex. 500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={handleSave}>{editingId ? "Enregistrer" : "Ajouter la dépense"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dépense</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                Aucune dépense enregistrée ce mois-ci.
              </TableCell>
            </TableRow>
          )}
          {expenses.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium">{e.label}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">{e.category}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(`${e.date}T00:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </TableCell>
              <TableCell className="text-right font-medium">{e.amount.toLocaleString("fr-FR")} MAD</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  <Button size="icon-sm" variant="outline" onClick={() => openEdit(e)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="icon-sm" variant="outline" onClick={() => handleDelete(e.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
