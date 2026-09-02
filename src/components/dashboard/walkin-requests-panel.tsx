"use client";

import { Check, QrCode, X } from "lucide-react";

import type { Appointment, Salon } from "@/lib/types";
import { useSalonWalkInRequests } from "@/lib/mock/walkin-store";
import { joinQueue } from "@/lib/services/queue-service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Live "Nouvelle demande sans rendez-vous" queue for QR walk-ins. The
 * customer already picked their service when scanning the salon's QR
 * code (see queue-status.tsx) — staff just confirm or refuse, they never
 * type the service in by hand. Confirming creates a real walk-in
 * appointment; nothing is added automatically before that.
 */
export function WalkInRequestsPanel({
  salon,
  onConfirmed,
}: {
  salon: Salon;
  onConfirmed: (appointment: Appointment) => void;
}) {
  const { pending, respond } = useSalonWalkInRequests(salon.id);

  function handleConfirm(requestId: string) {
    const request = pending.find((r) => r.id === requestId);
    if (!request) return;

    const service = salon.services.find((s) => s.id === request.serviceId);
    const ticket = joinQueue({ salon, serviceName: request.serviceName, clientName: request.clientName });
    respond(requestId, "confirmed", ticket.number);

    onConfirmed({
      id: `${salon.id}-walkin-${requestId}`,
      clientName: request.clientName,
      clientInitials: request.clientName.slice(0, 2).toUpperCase(),
      service: request.serviceName,
      staff: request.staffName ?? "Non assigné",
      time: request.requestedAt,
      durationMin: service?.durationMin ?? 30,
      price: service?.price ?? 0,
      status: "arrivée",
      type: "walk-in",
    });
  }

  function handleRefuse(requestId: string) {
    respond(requestId, "refused");
  }

  if (pending.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
        Aucune demande sans rendez-vous en attente.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {pending.map((request) => (
        <Card key={request.id} className="gap-2.5 border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <QrCode className="size-4" />
            </span>
            <Badge variant="warning" className="font-normal">Nouvelle demande</Badge>
            <span className="ml-auto text-xs text-muted-foreground">{request.requestedAt}</span>
          </div>
          <div className="text-sm">
            <p className="font-medium">{request.clientName}</p>
            <p className="text-muted-foreground">
              {request.serviceName}
              {request.staffName ? ` · ${request.staffName}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => handleConfirm(request.id)}>
              <Check className="size-3.5" />
              Confirmer
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => handleRefuse(request.id)}>
              <X className="size-3.5" />
              Refuser
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
