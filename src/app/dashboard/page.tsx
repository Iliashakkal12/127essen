"use client";

import { useState } from "react";
import { CalendarDays, TrendingUp, UserPlus, Wallet, XCircle } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { PlanningView } from "@/components/dashboard/planning-view";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { QueueManagement } from "@/components/dashboard/queue-management";
import { WalkInRequestsPanel } from "@/components/dashboard/walkin-requests-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalonWorkspace } from "@/lib/salon-context";
import { getSalonOperations } from "@/lib/mock/salon-operations";
import { formatLongDateFR, todayISO } from "@/lib/date";
import type { Appointment, AppointmentStatus, Salon } from "@/lib/types";

export default function DashboardOverviewPage() {
  const { salon } = useSalonWorkspace();
  // Keying by salon.id remounts the content below (and its lifted
  // appointments state) whenever the active salon changes, instead of
  // syncing state via effect.
  return <DashboardOverviewContent key={salon.id} salon={salon} />;
}

function DashboardOverviewContent({ salon }: { salon: Salon }) {
  const ops = getSalonOperations(salon);
  const [appointments, setAppointments] = useState<Appointment[]>(ops.todayAppointments);
  const { queueTickets } = ops;

  function updateAppointmentStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  function handleWalkInConfirmed(appointment: Appointment) {
    setAppointments((prev) => [...prev, appointment]);
  }

  const walkIns = appointments.filter((a) => a.type === "walk-in").length;
  const cancellations = appointments.filter((a) => a.status === "annulée").length;
  const revenueToday = appointments
    .filter((a) => a.status !== "annulée" && a.status !== "absence")
    .reduce((sum, a) => sum + a.price, 0);

  return (
    <DashboardShell
      title="Vue d'ensemble"
      description={`${salon.name} · ${formatLongDateFR(todayISO())}`}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={CalendarDays} label="Rendez-vous aujourd'hui" value={String(appointments.length)} changePercent={ops.todayAppointmentsChangePercent} tone="primary" />
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
            {appointments.length > 0 ? (
              <PlanningView appointments={appointments} />
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
            {appointments.length > 0 ? (
              <AppointmentsTable appointments={appointments} onUpdateStatus={updateAppointmentStatus} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">Aucun rendez-vous.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-0">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Demandes sans rendez-vous</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <WalkInRequestsPanel salon={salon} onConfirmed={handleWalkInConfirmed} />
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
      </div>
    </DashboardShell>
  );
}
