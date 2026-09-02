"use client";

import { CalendarDays, TrendingUp, UserPlus, Wallet, XCircle } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { PlanningView } from "@/components/dashboard/planning-view";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { QueueManagement } from "@/components/dashboard/queue-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalonWorkspace } from "@/lib/salon-context";
import { getSalonOperations } from "@/lib/mock/salon-operations";
import { formatLongDateFR, todayISO } from "@/lib/date";

export default function DashboardOverviewPage() {
  const { salon } = useSalonWorkspace();
  const ops = getSalonOperations(salon);
  const { todayAppointments, queueTickets } = ops;

  const walkIns = todayAppointments.filter((a) => a.type === "walk-in").length;
  const cancellations = todayAppointments.filter((a) => a.status === "annulée").length;
  const revenueToday = todayAppointments
    .filter((a) => a.status !== "annulée")
    .reduce((sum, a) => sum + a.price, 0);

  return (
    <DashboardShell
      key={salon.id}
      title="Vue d'ensemble"
      description={`${salon.name} · ${formatLongDateFR(todayISO())}`}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={CalendarDays} label="Rendez-vous aujourd'hui" value={String(todayAppointments.length)} changePercent={ops.todayAppointmentsChangePercent} tone="primary" />
        <StatCard icon={UserPlus} label="Walk-ins" value={String(walkIns)} changePercent={ops.walkInsChangePercent} />
        <StatCard icon={Wallet} label="Revenu du jour" value={`${revenueToday} MAD`} changePercent={ops.financeSummary.dailyRevenueChangePercent} tone="primary" />
        <StatCard icon={XCircle} label="Annulations" value={String(cancellations)} changePercent={-cancellations} tone="destructive" />
        <StatCard icon={TrendingUp} label="File d'attente" value={String(queueTickets.filter((t) => t.status !== "terminé").length)} tone="warning" />
      </div>

      <div className="mt-6">
        <Card className="p-0">
          <CardHeader className="pt-5">
            <CardTitle className="font-display text-lg">Planning du jour</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            {todayAppointments.length > 0 ? (
              <PlanningView appointments={todayAppointments} />
            ) : (
              <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                Aucun rendez-vous prévu aujourd&apos;hui pour {salon.name}.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="p-0 xl:col-span-2">
          <CardHeader className="pt-5">
            <CardTitle className="font-display text-lg">Rendez-vous &amp; walk-ins</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            {todayAppointments.length > 0 ? (
              <AppointmentsTable initialAppointments={todayAppointments} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">Aucun rendez-vous.</p>
            )}
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardHeader className="pt-5">
            <CardTitle className="font-display text-lg">File d&apos;attente QR</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <QueueManagement initialTickets={queueTickets} />
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
