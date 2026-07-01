"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { weekRevenue, monthRevenue } from "@/data/finance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{payload[0].value.toLocaleString("fr-FR")} MAD</p>
    </div>
  );
}

export function RevenueChart() {
  return (
    <Tabs defaultValue="week">
      <TabsList>
        <TabsTrigger value="week">Cette semaine</TabsTrigger>
        <TabsTrigger value="month">Ce mois</TabsTrigger>
      </TabsList>

      <TabsContent value="week" className="mt-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekRevenue} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" width={44} />
              <Tooltip cursor={{ fill: "var(--secondary)" }} content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="var(--primary)" maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="month" className="mt-4">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthRevenue} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" width={44} />
              <Tooltip cursor={{ fill: "var(--secondary)" }} content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} fill="var(--accent)" maxBarSize={64} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
}
