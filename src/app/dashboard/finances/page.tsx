"use client";

import { CalendarRange, PiggyBank, TrendingUp, Wallet } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/finance/revenue-chart";
import { RevenueByService } from "@/components/finance/revenue-by-service";
import { RevenueByEmployee } from "@/components/finance/revenue-by-employee";
import { ExpensesTable } from "@/components/finance/expenses-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalonWorkspace } from "@/lib/salon-context";
import { getSalonOperations } from "@/lib/mock/salon-operations";

export default function FinanceDashboardPage() {
  const { salon } = useSalonWorkspace();
  const ops = getSalonOperations(salon);
  const { financeSummary, estimatedProfit } = ops;

  return (
    <DashboardShell
      key={salon.id}
      title="Finances"
      description={`Revenus, dépenses et rentabilité de ${salon.name}`}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Revenu du jour" value={`${financeSummary.dailyRevenue.toLocaleString("fr-FR")} MAD`} changePercent={financeSummary.dailyRevenueChangePercent} tone="primary" />
        <StatCard icon={CalendarRange} label="Revenu de la semaine" value={`${financeSummary.weeklyRevenue.toLocaleString("fr-FR")} MAD`} changePercent={financeSummary.weeklyRevenueChangePercent} />
        <StatCard icon={TrendingUp} label="Revenu du mois" value={`${financeSummary.monthlyRevenue.toLocaleString("fr-FR")} MAD`} changePercent={financeSummary.monthlyRevenueChangePercent} tone="primary" />
        <StatCard icon={PiggyBank} label="Profit estimé (mois)" value={`${estimatedProfit.toLocaleString("fr-FR")} MAD`} tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="p-0 xl:col-span-2">
          <CardHeader className="pt-5">
            <CardTitle className="font-display text-lg">Évolution du chiffre d&apos;affaires</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <RevenueChart weekRevenue={ops.weekRevenue} monthRevenue={ops.monthRevenue} />
          </CardContent>
        </Card>

        <Card className="p-0">
          <CardHeader className="pt-5">
            <CardTitle className="font-display text-lg">Revenu par service</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <RevenueByService revenueByService={ops.revenueByService} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="p-0">
          <CardHeader className="pt-5">
            <CardTitle className="font-display text-lg">Revenu &amp; commissions par employé</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <RevenueByEmployee revenueByEmployee={ops.revenueByEmployee} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="p-0 xl:col-span-2">
          <CardHeader className="pt-5">
            <CardTitle className="font-display text-lg">Dépenses du mois</CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <ExpensesTable expenses={ops.expenses} />
          </CardContent>
        </Card>

        <Card className="gap-4 p-6">
          <CardTitle className="font-display text-lg">Estimation du profit</CardTitle>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Revenu du mois</span>
              <span className="font-medium">{financeSummary.monthlyRevenue.toLocaleString("fr-FR")} MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Commissions dues</span>
              <span className="font-medium text-destructive">
                − {financeSummary.totalCommissionsMonth.toLocaleString("fr-FR")} MAD
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dépenses</span>
              <span className="font-medium text-destructive">
                − {financeSummary.totalExpensesMonth.toLocaleString("fr-FR")} MAD
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-3">
              <span className="font-semibold">Profit net estimé</span>
              <span className="font-display text-xl font-semibold text-success">
                {estimatedProfit.toLocaleString("fr-FR")} MAD
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Estimation basée sur les revenus, commissions et dépenses enregistrées ce mois-ci pour {salon.name}.
          </p>
        </Card>
      </div>
    </DashboardShell>
  );
}
