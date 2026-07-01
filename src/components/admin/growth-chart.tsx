"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { platformGrowth } from "@/data/admin";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-muted-foreground">
          {p.dataKey === "bookings" ? "Réservations" : "Salons"}: {p.value.toLocaleString("fr-FR")}
        </p>
      ))}
    </div>
  );
}

export function GrowthChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={platformGrowth}>
          <defs>
            <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="salonsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
          <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" width={44} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="bookings" stroke="var(--primary)" fill="url(#bookingsGradient)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="salons" stroke="var(--chart-3)" fill="url(#salonsGradient)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
