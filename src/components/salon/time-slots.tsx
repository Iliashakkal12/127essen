import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ALL_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

const UNAVAILABLE_INDEXES = new Set([2, 5, 8, 9, 13, 16]);

export function TimeSlots({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (time: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
      {ALL_SLOTS.map((time, index) => {
        const disabled = UNAVAILABLE_INDEXES.has(index);
        const active = selected === time;
        return (
          <Button
            key={time}
            type="button"
            disabled={disabled}
            variant={active ? "default" : "outline"}
            size="sm"
            className={cn("font-normal", disabled && "line-through")}
            onClick={() => onSelect(time)}
          >
            {time}
          </Button>
        );
      })}
    </div>
  );
}
