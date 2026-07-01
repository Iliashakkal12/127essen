import Link from "next/link";
import {
  CheckCircle2,
  Scissors,
  User,
  CalendarDays,
  Clock,
  MapPin,
  Bell,
  Home,
  QrCode,
} from "lucide-react";

import { getSalonBySlug, salons } from "@/data/salons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { QrTicket } from "@/components/booking/qr-ticket";

function formatDate(day: string) {
  const date = new Date("2026-07-01T00:00:00");
  if (day === "tomorrow") date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const salon = getSalonBySlug(params.salon ?? "") ?? salons[0];
  const service = salon.services.find((s) => s.id === params.service) ?? salon.services[0];
  const staff = salon.staff.find((s) => s.id === params.staff);
  const time = params.time || "14:00";
  const day = params.day === "tomorrow" ? "tomorrow" : "today";
  const dateLabel = formatDate(day);
  const reference = `WG-${service.id.toUpperCase()}-${time.replace(":", "")}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-9" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
          Réservation confirmée !
        </h1>
        <p className="mt-2 text-muted-foreground">
          Un SMS et un e-mail de confirmation ont été envoyés. Référence {reference}.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-5">
        <Card className="sm:col-span-3">
          <CardHeader>
            <CardTitle className="font-display text-lg">Récapitulatif du rendez-vous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{salon.name}</p>
              <Badge variant="success">Confirmé</Badge>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-primary" />
              {salon.address}
            </p>

            <Separator />

            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Scissors className="size-4 text-primary" /> Service
                </dt>
                <dd className="font-medium">{service.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <User className="size-4 text-primary" /> Professionnel
                </dt>
                <dd className="font-medium">{staff ? staff.name : "Sans préférence"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4 text-primary" /> Date
                </dt>
                <dd className="font-medium capitalize">{dateLabel}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4 text-primary" /> Heure
                </dt>
                <dd className="font-medium">{time} · {service.durationMin} min</dd>
              </div>
            </dl>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total à payer sur place</span>
              <span className="font-display text-2xl font-semibold">{service.price} MAD</span>
            </div>
          </CardContent>
        </Card>

        <Card className="items-center justify-center sm:col-span-2">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 font-display text-lg">
              <QrCode className="size-4.5 text-primary" />
              Votre QR code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3 text-center">
            <QrTicket value={`WAGTI|${salon.slug}|${reference}`} />
            <p className="text-xs text-muted-foreground">
              Présentez ce code à l&apos;accueil pour un enregistrement instantané.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4">
        <Bell className="mt-0.5 size-5 shrink-0 text-warning-foreground" />
        <p className="text-sm text-warning-foreground">
          Rappel : arrivez à l&apos;heure exacte de votre créneau. En cas de retard de plus de
          10 minutes, votre place peut être proposée à un autre client.
        </p>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={`/file-attente/${salon.id}`}>
            Suivre la file d&apos;attente en direct
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <Home className="size-4.5" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
