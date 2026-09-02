"use client";

import { useMemo } from "react";
import { CalendarClock, Scissors, User } from "lucide-react";

import type { Salon } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TimeSlots } from "@/components/salon/time-slots";
import { getAvailableSlots, hasAnyAvailability } from "@/lib/services/booking-service";
import { isoDateFor, nowTimeHHmm } from "@/lib/date";

export function BookingWidget({
  salon,
  serviceId,
  staffId,
  day,
  time,
  onDayChange,
  onTimeChange,
  onConfirm,
}: {
  salon: Salon;
  serviceId: string | null;
  staffId: string | null;
  day: "today" | "tomorrow";
  time: string | null;
  onDayChange: (day: "today" | "tomorrow") => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
}) {
  const service = salon.services.find((s) => s.id === serviceId) ?? null;
  const staff = staffId ? salon.staff.find((s) => s.id === staffId) ?? null : null;

  const slots = useMemo(() => {
    if (!service) return [];
    return getAvailableSlots({
      salon,
      service,
      staffId,
      date: isoDateFor(day === "tomorrow" ? 1 : 0),
      nowTime: day === "today" ? nowTimeHHmm() : undefined,
    });
  }, [salon, service, staffId, day]);

  const canConfirm = Boolean(service && time);

  return (
    <Card className="sticky top-24 gap-4 py-5 shadow-md">
      <CardHeader>
        <CardTitle className="font-display text-lg">Réserver un créneau</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2.5 text-sm">
          <Scissors className="mt-0.5 size-4 shrink-0 text-primary" />
          {service ? (
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-xs text-muted-foreground">
                {service.durationMin} min · {service.price} MAD
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">Choisissez une prestation ci-contre</p>
          )}
        </div>

        <div className="flex items-start gap-2.5 text-sm">
          <User className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className={staff ? "font-medium" : "text-muted-foreground"}>
            {staff ? staff.name : "Sans préférence de professionnel"}
          </p>
        </div>

        <Separator />

        <div>
          <div className="mb-3 flex items-center gap-2">
            <CalendarClock className="size-4 text-primary" />
            <div className="flex gap-1.5 rounded-full bg-secondary p-1">
              <button
                onClick={() => onDayChange("today")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  day === "today" ? "bg-card shadow-sm" : "text-muted-foreground"
                }`}
              >
                Aujourd&apos;hui
              </button>
              <button
                onClick={() => onDayChange("tomorrow")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  day === "tomorrow" ? "bg-card shadow-sm" : "text-muted-foreground"
                }`}
              >
                Demain
              </button>
            </div>
          </div>
          {service ? (
            <TimeSlots slots={slots} selected={time} onSelect={onTimeChange} />
          ) : (
            <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
              Sélectionnez une prestation pour voir les créneaux disponibles.
            </p>
          )}
          {service && !hasAnyAvailability(slots) && slots.length > 0 && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Complet pour {day === "today" ? "aujourd'hui" : "demain"}, essayez un autre jour.
            </p>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-display text-xl font-semibold">
            {service ? `${service.price} MAD` : "—"}
          </span>
        </div>

        <Button className="w-full" size="lg" disabled={!canConfirm} onClick={onConfirm}>
          Confirmer la réservation
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Aucun paiement en ligne requis. Paiement sur place.
        </p>
      </CardContent>
    </Card>
  );
}
