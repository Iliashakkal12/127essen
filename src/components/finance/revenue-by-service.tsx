import type { RevenueByServiceEntry } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

export function RevenueByService({ revenueByService }: { revenueByService: RevenueByServiceEntry[] }) {
  const max = Math.max(1, ...revenueByService.map((s) => s.revenue));

  return (
    <div className="space-y-4">
      {revenueByService.map((s) => (
        <div key={s.service}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium">{s.service}</span>
            <span className="text-muted-foreground">
              {s.revenue.toLocaleString("fr-FR")} MAD · {s.count} prestations
            </span>
          </div>
          <Progress value={(s.revenue / max) * 100} />
        </div>
      ))}
    </div>
  );
}
