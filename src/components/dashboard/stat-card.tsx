import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  changePercent,
  tone = "default",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  changePercent?: number;
  tone?: "default" | "primary" | "warning" | "destructive";
}) {
  const toneClasses: Record<string, string> = {
    default: "bg-secondary text-foreground",
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className={cn("flex size-10 items-center justify-center rounded-xl", toneClasses[tone])}>
          <Icon className="size-5" />
        </span>
        {changePercent !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              changePercent >= 0 ? "text-success" : "text-destructive"
            )}
          >
            {changePercent >= 0 ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {Math.abs(changePercent)}%
          </span>
        )}
      </div>
      <div>
        <p className="font-display text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
