"use client";

import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  Coins,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

import { getAdminSalonRows, getCategoryDistribution, getPlatformKpis, getPlatformWeeklyRevenueTrend } from "@/lib/services/admin-service";
import { platformConfig } from "@/lib/platform-config";
import { StatCard } from "@/components/dashboard/stat-card";
import { GrowthChart } from "@/components/admin/growth-chart";
import { CategoryDonut } from "@/components/admin/category-donut";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rating } from "@/components/shared/rating";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboardPage() {
  const kpis = getPlatformKpis();
  const rows = getAdminSalonRows();
  const categoryData = getCategoryDistribution();
  const revenueTrend = getPlatformWeeklyRevenueTrend();

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge variant="gold" className="mb-2">Plateforme Wagti — accès privé</Badge>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Tableau de bord administrateur
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Vue globale de la plateforme, tous établissements confondus.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Building2} label="Salons partenaires" value={kpis.totalSalons.toString()} tone="primary" />
          <StatCard icon={CalendarCheck} label="Réservations aujourd'hui" value={kpis.totalBookingsToday.toString()} tone="default" />
          <StatCard icon={Coins} label="Revenu plateforme (mois)" value={`${kpis.platformRevenueMonth.toLocaleString("fr-FR")} MAD`} tone="primary" />
          <StatCard icon={Users} label="Clients servis (estimé, mois)" value={kpis.totalCustomersEstimate.toLocaleString("fr-FR")} tone="warning" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={TrendingUp} label="Files d'attente actives" value={kpis.activeQueues.toString()} />
          <StatCard icon={CalendarCheck} label="Prestations terminées (jour)" value={kpis.completedBookingsToday.toString()} />
          <StatCard icon={XCircle} label="Annulations (jour)" value={kpis.cancelledBookingsToday.toString()} tone="destructive" />
          <StatCard icon={Building2} label="Salons ouverts aujourd'hui" value={`${kpis.activeSalonsToday}/${kpis.totalSalons}`} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <Card className="p-0 xl:col-span-2">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Revenu plateforme — 7 derniers jours</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <GrowthChart data={revenueTrend} />
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Salons par catégorie</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <CategoryDonut data={categoryData} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="gap-4 p-6">
            <CardTitle className="font-display text-lg">Modèle économique</CardTitle>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-secondary/60 p-4">
                <p className="text-xs text-muted-foreground">Frais client / réservation</p>
                <p className="font-display text-xl font-semibold">+{platformConfig.customerFeePerBooking} MAD</p>
              </div>
              <div className="rounded-xl bg-secondary/60 p-4">
                <p className="text-xs text-muted-foreground">Frais salon / prestation</p>
                <p className="font-display text-xl font-semibold">+{platformConfig.salonFeePerService} MAD</p>
              </div>
              <div className="rounded-xl bg-secondary/60 p-4">
                <p className="text-xs text-muted-foreground">Seuil volume (exonération)</p>
                <p className="font-display text-xl font-semibold">{platformConfig.volumeThreshold} prestations</p>
              </div>
              <div className="rounded-xl bg-secondary/60 p-4">
                <p className="text-xs text-muted-foreground">Fenêtre du seuil</p>
                <p className="font-display text-xl font-semibold">{platformConfig.thresholdPeriodDays} jours</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Au-delà de {platformConfig.volumeThreshold} prestations réalisées sur une fenêtre glissante de{" "}
              {platformConfig.thresholdPeriodDays} jours, le frais côté salon n&apos;est plus prélevé pour le
              reste du mois en cours. Configuration centrale : <code>src/lib/platform-config.ts</code>.
              {!platformConfig.legacySaasPlansActive && (
                <> Les anciennes formules d&apos;abonnement mensuel (299 / 599 / 1290 MAD) sont désactivées et affichées comme optionnelles sur la page tarifs.</>
              )}
            </p>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="p-0">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Salons de la plateforme</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto pb-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salon</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Quartier</TableHead>
                    <TableHead>RDV aujourd&apos;hui</TableHead>
                    <TableHead>File active</TableHead>
                    <TableHead>Revenu (mois)</TableHead>
                    <TableHead className="text-right">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.salon.id}>
                      <TableCell>
                        <Link
                          href={`/admin/salons/${row.salon.id}`}
                          className="font-medium text-foreground hover:text-primary hover:underline"
                        >
                          {row.salon.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">{row.salon.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.salon.neighborhood}</TableCell>
                      <TableCell className="text-muted-foreground">{row.bookingsToday}</TableCell>
                      <TableCell className="text-muted-foreground">{row.activeQueue}</TableCell>
                      <TableCell className="font-medium">{row.monthlyRevenue.toLocaleString("fr-FR")} MAD</TableCell>
                      <TableCell className="text-right">
                        <Rating value={row.salon.rating} className="justify-end" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Données générées de façon déterministe pour la démonstration à partir des {rows.length} salons
          du catalogue prototype — pas de backend ni de base de données réelle derrière ces chiffres.
        </p>
      </div>
    </div>
  );
}
