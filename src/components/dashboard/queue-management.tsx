"use client";

import { useState } from "react";
import { Bell, Check, Hourglass, X } from "lucide-react";

import type { QueueTicket } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusVariant: Record<QueueTicket["status"], "outline" | "warning" | "success" | "secondary"> = {
  "en attente": "outline",
  "bientôt votre tour": "warning",
  "prêt": "success",
  "terminé": "secondary",
};

export function QueueManagement({ initialTickets }: { initialTickets: QueueTicket[] }) {
  const [tickets, setTickets] = useState(initialTickets);

  function callNext(id: string) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: "prêt", peopleAhead: 0 } : t)));
  }

  function complete(id: string) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: "terminé" } : t)));
  }

  function remove(id: string) {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }

  const active = tickets.filter((t) => t.status !== "terminé");

  return (
    <div className="space-y-3">
      {active.length === 0 && (
        <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
          Aucun client dans la file d&apos;attente.
        </p>
      )}
      {active.map((ticket) => (
        <Card key={ticket.id} className="flex-row items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary font-display text-sm font-semibold">
              {ticket.number}
            </span>
            <div>
              <p className="text-sm font-medium">{ticket.clientName}</p>
              <p className="text-xs text-muted-foreground">
                {ticket.service} · arrivé à {ticket.joinedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={statusVariant[ticket.status]} className="hidden sm:inline-flex">
              {ticket.status}
            </Badge>
            <span className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
              <Hourglass className="size-3.5" />
              {ticket.peopleAhead} devant · ~{ticket.estimatedWaitMin} min
            </span>
            <div className="flex gap-1.5">
              {ticket.status !== "prêt" && (
                <Button size="icon-sm" variant="outline" onClick={() => callNext(ticket.id)}>
                  <Bell className="size-3.5" />
                </Button>
              )}
              <Button size="icon-sm" variant="outline" onClick={() => complete(ticket.id)}>
                <Check className="size-3.5" />
              </Button>
              <Button size="icon-sm" variant="outline" onClick={() => remove(ticket.id)}>
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
