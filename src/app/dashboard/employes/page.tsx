"use client";

import { useState } from "react";
import { Pencil, Plus, Power, PowerOff, Star, TrendingUp, Users, Wallet } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useSalonWorkspace } from "@/lib/salon-context";
import type { Salon, Staff } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const COLOR_PAIRS = [
  ["from-amber-400", "to-orange-500"],
  ["from-stone-400", "to-stone-600"],
  ["from-orange-400", "to-amber-600"],
  ["from-rose-400", "to-fuchsia-500"],
  ["from-emerald-400", "to-teal-500"],
  ["from-sky-400", "to-cyan-500"],
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "??";
}

const emptyForm = { name: "", role: "", commission: "30" };

export default function EmployeesPage() {
  const { salon } = useSalonWorkspace();
  return <EmployeesWorkspace key={salon.id} salon={salon} />;
}

function EmployeesWorkspace({ salon }: { salon: Salon }) {
  const { setStaff } = useSalonWorkspace();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const activeStaff = salon.staff.filter((s) => s.active !== false);
  const maxRevenue = Math.max(1, ...salon.staff.map((s) => s.revenueGeneratedMonth));

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(member: Staff) {
    setEditingId(member.id);
    setForm({ name: member.name, role: member.role, commission: String(member.commissionPercent) });
    setOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;

    if (editingId) {
      setStaff((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? {
                ...m,
                name: form.name,
                role: form.role || m.role,
                commissionPercent: Number(form.commission) || m.commissionPercent,
                initials: initialsOf(form.name),
              }
            : m
        )
      );
    } else {
      const colorIndex = salon.staff.length % COLOR_PAIRS.length;
      const [colorFrom, colorTo] = COLOR_PAIRS[colorIndex];
      const newMember: Staff = {
        id: `${salon.id}-custom-${Date.now()}`,
        name: form.name,
        role: form.role || "Employé",
        initials: initialsOf(form.name),
        colorFrom,
        colorTo,
        rating: 5,
        specialties: [],
        commissionPercent: Number(form.commission) || 30,
        clientsServedMonth: 0,
        revenueGeneratedMonth: 0,
        serviceIds: [],
        active: true,
      };
      setStaff((prev) => [...prev, newMember]);
    }
    setOpen(false);
  }

  function toggleActive(id: string) {
    setStaff((prev) => prev.map((m) => (m.id === id ? { ...m, active: m.active === false } : m)));
  }

  return (
    <DashboardShell
      title="Employés"
      description={`Équipe, performance et commissions de ${salon.name}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {activeStaff.length} employé{activeStaff.length > 1 ? "s" : ""} actif
          {activeStaff.length > 1 ? "s" : ""} ce mois-ci
          {salon.staff.length > activeStaff.length && (
            <> · {salon.staff.length - activeStaff.length} inactif{salon.staff.length - activeStaff.length > 1 ? "s" : ""}</>
          )}
        </p>
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
              Ajouter un employé
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier l'employé" : "Ajouter un employé"}</DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Les prestations assignées se gèrent depuis la page Services."
                  : "Le nouvel employé sera immédiatement visible dans l'équipe et sélectionnable pour la réservation."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="emp-name">Nom complet</Label>
                <Input
                  id="emp-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex. Sofia Bennani"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-role">Rôle</Label>
                <Input
                  id="emp-role"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Ex. Barbière"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-commission">Commission (%)</Label>
                <Input
                  id="emp-commission"
                  type="number"
                  value={form.commission}
                  onChange={(e) => setForm((f) => ({ ...f, commission: e.target.value }))}
                  placeholder="35"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={handleSave}>{editingId ? "Enregistrer" : "Ajouter l'employé"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {salon.staff.map((member) => {
          const services = salon.services.filter((s) => s.staffIds.includes(member.id));
          const performance = Math.round((member.revenueGeneratedMonth / maxRevenue) * 100);
          const isActive = member.active !== false;

          return (
            <Card key={member.id} className={cn("gap-4 p-5", !isActive && "opacity-60")}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className={cn("bg-gradient-to-br text-white", member.colorFrom, member.colorTo)}>
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {!isActive && <Badge variant="secondary" className="font-normal">Inactif</Badge>}
                  <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Star className="size-3.5 fill-accent text-accent" />
                    {member.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {member.specialties.length > 0 ? (
                  member.specialties.map((s) => (
                    <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Aucune spécialité renseignée</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl bg-secondary/60 p-3.5 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <div>
                    <p className="font-semibold">{member.clientsServedMonth}</p>
                    <p className="text-xs text-muted-foreground">clients</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="size-4 text-primary" />
                  <div>
                    <p className="font-semibold">{member.revenueGeneratedMonth.toLocaleString("fr-FR")} MAD</p>
                    <p className="text-xs text-muted-foreground">revenu généré</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Commission</span>
                <span className="font-semibold">{member.commissionPercent}%</span>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><TrendingUp className="size-3.5" /> Performance équipe</span>
                  <span>{performance}%</span>
                </div>
                <Progress value={performance} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {services.length} prestation{services.length > 1 ? "s" : ""} assignée{services.length > 1 ? "s" : ""}
                </span>
                <div className="flex gap-1.5">
                  <Button size="icon-sm" variant="outline" onClick={() => openEdit(member)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button size="icon-sm" variant="outline" onClick={() => toggleActive(member.id)}>
                    {isActive ? <PowerOff className="size-3.5" /> : <Power className="size-3.5" />}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-0">
        <CardContent className="grid grid-cols-2 gap-5 py-5 sm:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-semibold">{activeStaff.length}</p>
            <p className="text-sm text-muted-foreground">Employés actifs</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold">
              {salon.staff.reduce((s, e) => s + e.clientsServedMonth, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Clients servis (mois)</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold">
              {salon.staff.reduce((s, e) => s + e.revenueGeneratedMonth, 0).toLocaleString("fr-FR")} MAD
            </p>
            <p className="text-sm text-muted-foreground">Revenu généré (mois)</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold">
              {activeStaff.length > 0
                ? (activeStaff.reduce((s, e) => s + e.rating, 0) / activeStaff.length).toFixed(1)
                : "—"}
            </p>
            <p className="text-sm text-muted-foreground">Note moyenne équipe</p>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
