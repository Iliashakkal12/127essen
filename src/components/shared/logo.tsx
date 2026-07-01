import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Sparkles className="size-4.5" />
      </span>
      <span
        className={cn(
          "font-display text-xl font-semibold tracking-tight",
          dark ? "text-ink-foreground" : "text-foreground"
        )}
      >
        Wagti
      </span>
    </Link>
  );
}
