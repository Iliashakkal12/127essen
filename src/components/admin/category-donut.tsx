"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function CategoryDonut({ data }: { data: { category: string; count: number; color: string }[] }) {
  const total = data.reduce((s, c) => s + c.count, 0) || 1;

  return (
    <div className="flex items-center gap-6">
      <div className="h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} salons`, name]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2.5">
        {data.map((c) => (
          <div key={c.category} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-muted-foreground">{c.category}</span>
            <span className="font-medium">{Math.round((c.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
