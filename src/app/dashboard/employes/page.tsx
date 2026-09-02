"use client";

import { useState } from "react";
import { Plus, Star, TrendingUp, Users, Wallet } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useSalonWorkspace } from "@/lib/salon-context";
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

export default function EmployeesPage() {
  const { salon } = useSalonWorkspace();
  const [open, setOpen] = useState(false);
  const maxRevenue = Math.max(1, ...salon.staff.map((s) => s.revenueGeneratedMonth));

  return (
    <DashboardShell
      key={salon.id}
      title="Employés"
      description={`Équipe, performance et commissions de ${salon.name}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {salon.staff.length} employés actifs ce mois-ci
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-4" />
              Ajouter un employé
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un employé</DialogTitle>
              <DialogDescription>
                Renseignez les informations du nouvel employé. (Maquette de démonstration)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="emp-name">Nom complet</Label>
                <Input id="emp-name" placeholder="Ex. Sofia Bennani" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-role">Rôle</Label>
                <Input id="emp-role" placeholder="Ex. Barbière" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emp-commission">Commission (%)</Label>
                <Input id="emp-commission" type="number" placeholder="35" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={() => setOpen(false)}>Ajouter l&apos;employé</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {salon.staff.map((member) => {
          const services = salon.services.filter((s) => s.staffIds.includes(member.id));
          const performance = Math.round((member.revenueGeneratedMonth / maxRevenue) * 100);

          return (
            <Card key={member.id} className="gap-4 p-5">
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
                <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <Star className="size-3.5 fill-accent text-accent" />
                  {member.rating.toFixed(1)}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {member.specialties.map((s) => (
                  <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                ))}
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

              <div className="text-xs text-muted-foreground">
                {services.length} prestation{services.length > 1 ? "s" : ""} assignée{services.length > 1 ? "s" : ""}
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-0">
        <CardContent className="grid grid-cols-2 gap-5 py-5 sm:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-semibold">{salon.staff.length}</p>
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
              {(salon.staff.reduce((s, e) => s + e.rating, 0) / salon.staff.length).toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">Note moyenne équipe</p>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
