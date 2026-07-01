import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcon: Record<string, string> = {
  Barbershop: "✂️",
  "Salon de coiffure": "💇",
  "Institut de beauté": "💅",
  "Spa & bien-être": "🧖",
};

export function SalonCover({
  gradient,
  category,
  className,
}: {
  gradient: string;
  category: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div className="bg-noise absolute inset-0 opacity-40" />
      <span className="relative text-4xl drop-shadow-sm" aria-hidden>
        {categoryIcon[category] ?? "✨"}
      </span>
      <Scissors className="absolute -bottom-3 -right-3 size-16 text-white/20" />
    </div>
  );
}
