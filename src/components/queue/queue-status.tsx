"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Hourglass,
  MapPin,
  PartyPopper,
  QrCode,
  RefreshCcw,
  Scissors,
  Users,
} from "lucide-react";

import type { QueueTicket, Salon } from "@/lib/types";
import { getQueueSnapshot, joinQueue, statusFromPeopleAhead } from "@/lib/services/queue-service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * The virtual walk-in queue. Renders in two distinct steps and NEVER
 * creates a ticket on mount — only `handleJoin` (a click handler) does
 * that. This is the fix for the product's most critical bug: a customer
 * simply opening this page (or the homepage) must never see an active
 * queue ticket that they never asked for.
 */
export function QueueStatus({ salon }: { salon: Salon }) {
  const [ticket, setTicket] = useState<QueueTicket | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(salon.services[0]?.id ?? null);

  const currentQueue = useMemo(() => getQueueSnapshot(salon), [salon]);
  const peopleCurrentlyWaiting = currentQueue.filter((t) => t.status !== "terminé").length;

  function handleJoin() {
    const service = salon.services.find((s) => s.id === serviceId) ?? salon.services[0];
    if (!service) return;
    setTicket(joinQueue({ salon, serviceName: service.name }));
  }

  if (!ticket) {
    return (
      <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
        <Card className="overflow-hidden">
          <div className="bg-ink px-6 py-8 text-center text-ink-foreground">
            <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-white/10">
              <QrCode className="size-6" />
            </span>
            <p className="text-sm text-ink-foreground/60">{salon.name}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink-foreground/50">
              <MapPin className="size-3.5" /> {salon.neighborhood}, {salon.city}
            </p>
            <h1 className="mt-5 font-display text-2xl font-semibold">
              Déjà sur place, sans rendez-vous ?
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-foreground/70">
              Rejoignez la file d&apos;attente virtuelle pour être servi sans patienter debout.
            </p>
          </div>

          <CardContent className="space-y-5 pt-6">
            {salon.services.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                Ce salon ne propose actuellement aucun service disponible pour la file d&apos;attente.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl bg-secondary/60 p-4 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="size-4 text-primary" />
                    Personnes actuellement en attente
                  </span>
                  <span className="font-display text-lg font-semibold">{peopleCurrentlyWaiting}</span>
                </div>

                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Scissors className="size-4 text-primary" />
                    Quel service souhaitez-vous ?
                  </p>
                  <div className="space-y-2">
                    {salon.services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setServiceId(service.id)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                          serviceId === service.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span>
                          <span className="block font-medium">{service.name}</span>
                          <span className="text-xs text-muted-foreground">{service.durationMin} min</span>
                        </span>
                        <span className="font-semibold">{service.price} MAD</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={handleJoin} disabled={!serviceId}>
                  Rejoindre la file d&apos;attente
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Aucun ticket n&apos;est créé tant que vous n&apos;avez pas confirmé.
                </p>
              </>
            )}

            <div className="flex flex-col gap-2.5 border-t border-border pt-4 sm:flex-row">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/salons/${salon.slug}`}>Retour au salon</Link>
              </Button>
              <Button asChild variant="ghost" className="flex-1">
                <Link href={`/salons/${salon.slug}`}>Réserver un créneau à l&apos;avance</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <JoinedQueueView salon={salon} ticket={ticket} onUpdate={setTicket} />;
}

function JoinedQueueView({
  salon,
  ticket,
  onUpdate,
}: {
  salon: Salon;
  ticket: QueueTicket;
  onUpdate: (ticket: QueueTicket) => void;
}) {
  const status = ticket.status;
  const initialPeopleAhead = useState(ticket.peopleAhead)[0];

  const progressPercent =
    initialPeopleAhead === 0
      ? 100
      : Math.round(((initialPeopleAhead - ticket.peopleAhead) / initialPeopleAhead) * 100);

  const statusConfig: Record<
    QueueTicket["status"],
    { label: string; icon: React.ElementType; badge: "outline" | "warning" | "success" | "secondary" }
  > = {
    "en attente": { label: "En attente", icon: Hourglass, badge: "outline" },
    "bientôt votre tour": { label: "Bientôt votre tour", icon: Clock, badge: "warning" },
    prêt: { label: "C'est à vous !", icon: PartyPopper, badge: "success" },
    terminé: { label: "Terminé", icon: CheckCircle2, badge: "secondary" },
  };

  const current = statusConfig[status];

  function advance() {
    const nextPeopleAhead = Math.max(0, ticket.peopleAhead - 1);
    onUpdate({
      ...ticket,
      peopleAhead: nextPeopleAhead,
      estimatedWaitMin: nextPeopleAhead * 12,
      status: statusFromPeopleAhead(nextPeopleAhead),
    });
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <Card className="overflow-hidden">
        <div className="bg-ink px-6 py-8 text-center text-ink-foreground">
          <p className="text-sm text-ink-foreground/60">{salon.name}</p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink-foreground/50">
            <MapPin className="size-3.5" /> {salon.neighborhood}, {salon.city}
          </p>

          <p className="mt-6 text-xs uppercase tracking-widest text-ink-foreground/50">
            Votre ticket
          </p>
          <p className="font-display text-6xl font-semibold tracking-tight">{ticket.number}</p>
        </div>

        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-center">
            <Badge variant={current.badge} className="gap-1.5 px-4 py-1.5 text-sm">
              <current.icon className="size-4" />
              {current.label}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-secondary/60 p-4 text-center">
              <Users className="mx-auto mb-1.5 size-5 text-primary" />
              <p className="font-display text-2xl font-semibold">{ticket.peopleAhead}</p>
              <p className="text-xs text-muted-foreground">personne(s) devant vous</p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4 text-center">
              <Clock className="mx-auto mb-1.5 size-5 text-primary" />
              <p className="font-display text-2xl font-semibold">
                {status === "prêt" ? "0" : `~${ticket.estimatedWaitMin}`} min
              </p>
              <p className="text-xs text-muted-foreground">temps d&apos;attente estimé</p>
            </div>
          </div>

          <div>
            <Progress value={progressPercent} className="h-2.5" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Ticket rejoint · {ticket.joinedAt}</span>
              <span>C&apos;est à vous</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
            <span className="text-muted-foreground">Service demandé</span>
            <span className="font-medium">{ticket.service}</span>
          </div>

          {status === "prêt" ? (
            <div className="flex items-start gap-2.5 rounded-xl bg-success/10 p-4 text-sm text-success">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
              C&apos;est votre tour ! Présentez-vous à l&apos;accueil du salon maintenant.
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
              <Hourglass className="mt-0.5 size-5 shrink-0 text-primary" />
              Vous serez notifié dès que ce sera bientôt votre tour. Vous pouvez patienter où vous voulez.
            </div>
          )}

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              disabled={ticket.peopleAhead === 0}
              onClick={advance}
            >
              <RefreshCcw className="size-4" />
              Simuler l&apos;avancée de la file
            </Button>
            <Button asChild className="flex-1">
              <Link href={`/salons/${salon.slug}`}>Retour au salon</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
