import type { Appointment } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const START_HOUR = 9;
const END_HOUR = 19;
const SLOT_COUNT = (END_HOUR - START_HOUR) * 2;
const ROW_HEIGHT = 34;

function timeToRow(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h - START_HOUR) * 2 + (m >= 30 ? 1 : 0);
}

const statusStyles: Record<Appointment["status"], string> = {
  "confirmée": "bg-primary/10 border-primary/40",
  "en attente": "bg-warning/15 border-warning/50",
  "terminée": "bg-success/15 border-success/50",
  "annulée": "bg-muted border-border line-through opacity-60",
};

export function PlanningView({ appointments }: { appointments: Appointment[] }) {
  const staffNames = Array.from(new Set(appointments.map((a) => a.staff)));
  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => {
    const hour = START_HOUR + Math.floor(i / 2);
    const min = i % 2 === 0 ? "00" : "30";
    return `${String(hour).padStart(2, "0")}:${min}`;
  });

  return (
    <Card className="overflow-x-auto p-4">
      <div className="flex min-w-[640px]">
        <div className="w-14 shrink-0">
          <div className="h-8" />
          {slots.map((time) => (
            <div
              key={time}
              style={{ height: ROW_HEIGHT }}
              className="border-t border-border/60 pr-2 text-right text-[11px] text-muted-foreground"
            >
              {time.endsWith(":00") && <span className="-translate-y-2 block">{time}</span>}
            </div>
          ))}
        </div>

        {staffNames.map((name) => (
          <div key={name} className="flex-1 border-l border-border/60">
            <div className="flex h-8 items-center justify-center text-xs font-semibold text-muted-foreground">
              {name}
            </div>
            <div className="relative">
              {slots.map((time) => (
                <div key={time} style={{ height: ROW_HEIGHT }} className="border-t border-border/60" />
              ))}

              {appointments
                .filter((a) => a.staff === name)
                .map((a) => {
                  const row = timeToRow(a.time);
                  const span = Math.max(1, Math.round(a.durationMin / 30));
                  return (
                    <div
                      key={a.id}
                      className={cn(
                        "absolute inset-x-1 overflow-hidden rounded-lg border px-2 py-1 text-[11px] leading-tight",
                        statusStyles[a.status]
                      )}
                      style={{
                        top: `${row * ROW_HEIGHT + 2}px`,
                        height: `${span * ROW_HEIGHT - 4}px`,
                      }}
                    >
                      <p className="truncate font-medium">{a.time} · {a.clientName}</p>
                      <p className="truncate opacity-80">{a.service}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
