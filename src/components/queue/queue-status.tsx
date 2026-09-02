"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Hourglass,
  Loader2,
  MapPin,
  PartyPopper,
  RefreshCcw,
  Scissors,
  ThumbsDown,
  Users,
} from "lucide-react";

import type { QueueTicket, Salon } from "@/lib/types";
import { getQueueSnapshot, statusFromPeopleAhead } from "@/lib/services/queue-service";
import { useWalkInRequest } from "@/lib/mock/walkin-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * The virtual walk-in queue. Never creates a ticket on mount, and — since
 * the last revision — never creates one on a simple customer click either:
 * selecting a service SUBMITS A REQUEST that the salon must confirm (see
 * the "Demandes sans rendez-vous" panel on the dashboard). Only after
 * that confirmation does a real queue ticket appear here. This is the fix
 * for "the salon should decide, not the QR code."
 */
export function QueueStatus({ salon }: { salon: Salon }) {
  const { request, submit } = useWalkInRequest(salon.id);
  const [serviceId, setServiceId] = useState<string | null>(salon.services[0]?.id ?? null);

  const currentQueue = useMemo(() => getQueueSnapshot(salon), [salon]);
  const peopleCurrentlyWaiting = currentQueue.filter((t) => t.status !== "terminé").length;

  function handleSubmit() {
    const service = salon.services.find((s) => s.id === serviceId) ?? salon.services[0];
    if (!service) return;
    submit({ serviceId: service.id, serviceName: service.name });
  }

  if (request?.status === "confirmed") {
    return <JoinedQueueView salon={salon} peopleAheadAtConfirm={peopleCurrentlyWaiting} request={request} />;
  }

  if (request?.status === "pending") {
    return <PendingRequestView salon={salon} serviceName={request.serviceName} />;
  }

  if (request?.status === "refused") {
    return <RefusedRequestView salon={salon} />;
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <Card className="overflow-hidden">
        <div className="bg-ink px-6 py-8 text-center text-ink-foreground">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-white/10">
            <Scissors className="size-6" />
          </span>
          <p className="text-sm text-ink-foreground/60">{salon.name}</p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink-foreground/50">
            <MapPin className="size-3.5" /> {salon.neighborhood}, {salon.city}
          </p>
          <h1 className="mt-5 font-display text-2xl font-semibold">
            Déjà sur place, sans rendez-vous ?
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-foreground/70">
            Envoyez une demande au salon pour être pris en charge sans patienter debout.
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

              <Button className="w-full" size="lg" onClick={handleSubmit} disabled={!serviceId}>
                Envoyer ma demande au salon
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Le salon doit confirmer votre demande avant qu&apos;un ticket ne soit créé.
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

function PendingRequestView({ salon, serviceName }: { salon: Salon; serviceName: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Loader2 className="size-6 animate-spin" />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold">En attente de confirmation</h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Votre demande pour <span className="font-medium text-foreground">{serviceName}</span> a
              été envoyée à {salon.name}. Cette page se met à jour automatiquement dès que le salon
              répond.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RefusedRequestView({ salon }: { salon: Salon }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ThumbsDown className="size-6" />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold">Demande non acceptée</h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {salon.name} n&apos;a pas pu accepter votre demande pour le moment — le salon est
              probablement complet. Vous pouvez réserver un créneau à l&apos;avance à la place.
            </p>
          </div>
          <Button asChild className="mt-2">
            <Link href={`/salons/${salon.slug}`}>Voir le salon</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function JoinedQueueView({
  salon,
  request,
  peopleAheadAtConfirm,
}: {
  salon: Salon;
  request: { ticketNumber?: string; serviceName: string; requestedAt: string };
  peopleAheadAtConfirm: number;
}) {
  const [peopleAhead, setPeopleAhead] = useState(peopleAheadAtConfirm);
  const initialPeopleAhead = useState(peopleAheadAtConfirm)[0];
  const status = statusFromPeopleAhead(peopleAhead);

  const progressPercent =
    initialPeopleAhead === 0
      ? 100
      : Math.round(((initialPeopleAhead - peopleAhead) / initialPeopleAhead) * 100);

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

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <Card className="overflow-hidden">
        <div className="bg-ink px-6 py-8 text-center text-ink-foreground">
          <p className="text-sm text-ink-foreground/60">{salon.name}</p>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink-foreground/50">
            <MapPin className="size-3.5" /> {salon.neighborhood}, {salon.city}
          </p>

          <p className="mt-6 text-xs uppercase tracking-widest text-ink-foreground/50">
            Demande confirmée · Votre ticket
          </p>
          <p className="font-display text-6xl font-semibold tracking-tight">
            {request.ticketNumber ?? "—"}
          </p>
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
              <p className="font-display text-2xl font-semibold">{peopleAhead}</p>
              <p className="text-xs text-muted-foreground">personne(s) devant vous</p>
            </div>
            <div className="rounded-2xl bg-secondary/60 p-4 text-center">
              <Clock className="mx-auto mb-1.5 size-5 text-primary" />
              <p className="font-display text-2xl font-semibold">
                {status === "prêt" ? "0" : `~${peopleAhead * 12}`} min
              </p>
              <p className="text-xs text-muted-foreground">temps d&apos;attente estimé</p>
            </div>
          </div>

          <div>
            <Progress value={progressPercent} className="h-2.5" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Confirmé à {request.requestedAt}</span>
              <span>C&apos;est à vous</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
            <span className="text-muted-foreground">Service demandé</span>
            <span className="font-medium">{request.serviceName}</span>
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
              disabled={peopleAhead === 0}
              onClick={() => setPeopleAhead((p) => Math.max(0, p - 1))}
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
