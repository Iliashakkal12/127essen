"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Hourglass,
  MapPin,
  PartyPopper,
  RefreshCcw,
  Users,
} from "lucide-react";

import type { Salon } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Status = "en attente" | "bientôt votre tour" | "prêt";

function statusFromPeopleAhead(peopleAhead: number): Status {
  if (peopleAhead <= 0) return "prêt";
  if (peopleAhead === 1) return "bientôt votre tour";
  return "en attente";
}

export function QueueStatus({ salon }: { salon: Salon }) {
  const [peopleAhead, setPeopleAhead] = useState(3);
  const initialPeopleAhead = 3;
  const status = statusFromPeopleAhead(peopleAhead);
  const estimatedWait = peopleAhead * 12;
  const progressPercent = useMemo(
    () => Math.round(((initialPeopleAhead - peopleAhead) / initialPeopleAhead) * 100),
    [peopleAhead]
  );

  const statusConfig: Record<Status, { label: string; icon: React.ElementType; badge: "outline" | "warning" | "success" }> = {
    "en attente": { label: "En attente", icon: Hourglass, badge: "outline" },
    "bientôt votre tour": { label: "Bientôt votre tour", icon: Clock, badge: "warning" },
    prêt: { label: "C'est à vous !", icon: PartyPopper, badge: "success" },
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
            Votre ticket
          </p>
          <p className="font-display text-6xl font-semibold tracking-tight">A-018</p>
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
                {status === "prêt" ? "0" : `~${estimatedWait}`} min
              </p>
              <p className="text-xs text-muted-foreground">temps d&apos;attente estimé</p>
            </div>
          </div>

          <div>
            <Progress value={progressPercent} className="h-2.5" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Ticket rejoint</span>
              <span>C&apos;est à vous</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
            <span className="text-muted-foreground">Service demandé</span>
            <span className="font-medium">{salon.services[0]?.name}</span>
          </div>

          {status === "prêt" ? (
            <div className="flex items-start gap-2.5 rounded-xl bg-success/10 p-4 text-sm text-success">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
              C&apos;est votre tour ! Présentez-vous à l&apos;accueil du salon maintenant.
            </div>
          ) : (
            <div className={cn("flex items-start gap-2.5 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground")}>
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
