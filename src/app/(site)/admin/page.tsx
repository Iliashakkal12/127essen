import { Building2, CalendarCheck, TrendingUp, Users } from "lucide-react";

import { platformMetrics, topSalons } from "@/data/admin";
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

export default function AdminDemoPage() {
  return (
    <div className="bg-secondary/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge variant="gold" className="mb-2">Démo plateforme</Badge>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Tableau de bord administrateur
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Vue globale de la plateforme Wagti à Casablanca
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Building2}
            label="Salons partenaires"
            value={platformMetrics.totalSalons.toString()}
            changePercent={platformMetrics.totalSalonsChangePercent}
            tone="primary"
          />
          <StatCard
            icon={CalendarCheck}
            label="Réservations totales"
            value={platformMetrics.totalBookings.toLocaleString("fr-FR")}
            changePercent={platformMetrics.totalBookingsChangePercent}
          />
          <StatCard
            icon={TrendingUp}
            label="Revenu généré (estimé)"
            value={`${(platformMetrics.revenueEstimateMAD / 1_000_000).toFixed(2)} M MAD`}
            changePercent={platformMetrics.revenueEstimateChangePercent}
            tone="primary"
          />
          <StatCard
            icon={Users}
            label="Utilisateurs actifs"
            value={platformMetrics.activeUsers.toLocaleString("fr-FR")}
            changePercent={platformMetrics.activeUsersChangePercent}
            tone="warning"
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <Card className="p-0 xl:col-span-2">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Croissance de la plateforme</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <GrowthChart />
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Salons par catégorie</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <CategoryDonut />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="p-0">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Salons les plus performants</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salon</TableHead>
                    <TableHead>Quartier</TableHead>
                    <TableHead>Réservations</TableHead>
                    <TableHead>Revenu généré</TableHead>
                    <TableHead className="text-right">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSalons.map((s, i) => (
                    <TableRow key={s.name}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                            {i + 1}
                          </span>
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{s.neighborhood}</TableCell>
                      <TableCell className="text-muted-foreground">{s.bookings.toLocaleString("fr-FR")}</TableCell>
                      <TableCell className="font-medium">{s.revenue.toLocaleString("fr-FR")} MAD</TableCell>
                      <TableCell className="text-right">
                        <Rating value={s.rating} className="justify-end" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Toutes les données affichées sont fictives et destinées à des fins de démonstration.
        </p>
      </div>
    </div>
  );
}
