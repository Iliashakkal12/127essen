import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "@/lib/types";

export function TimeSlots({
  slots,
  selected,
  onSelect,
}: {
  slots: TimeSlot[];
  selected: string | null;
  onSelect: (time: string) => void;
}) {
  if (slots.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
        Aucun créneau disponible pour cette sélection.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
      {slots.map(({ time, available }) => {
        const active = selected === time;
        return (
          <Button
            key={time}
            type="button"
            disabled={!available}
            variant={active ? "default" : "outline"}
            size="sm"
            className={cn("font-normal", !available && "line-through")}
            onClick={() => onSelect(time)}
          >
            {time}
          </Button>
        );
      })}
    </div>
  );
}
