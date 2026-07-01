import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <Star
        className={cn(
          "fill-accent text-accent",
          size === "sm" ? "size-3.5" : "size-4"
        )}
      />
      <span className={cn("font-medium", size === "sm" ? "text-sm" : "text-base")}>
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="text-muted-foreground text-sm">({count})</span>
      )}
    </span>
  );
}
