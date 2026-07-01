import { Clock, Flame } from "lucide-react";

import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function ServiceList({
  services,
  selectedId,
  onSelect,
}: {
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      {services.map((service) => {
        const active = service.id === selectedId;
        return (
          <Card
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={cn(
              "cursor-pointer flex-row items-center justify-between gap-4 p-4 transition-colors hover:border-primary/50",
              active && "border-primary bg-primary/5 ring-1 ring-primary"
            )}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium">{service.name}</p>
                {service.popular && (
                  <span className="flex items-center gap-1 text-xs font-medium text-accent-foreground">
                    <Flame className="size-3 fill-accent text-accent" />
                    Populaire
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                {service.durationMin} min · {service.category}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-display text-base font-semibold">{service.price} MAD</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
