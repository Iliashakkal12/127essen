import Link from "next/link";
import { ArrowRight, CalendarCheck, MapPin, QrCode, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { salons } from "@/data/salons";

export function Hero() {
  const featuredSalon = salons.find((s) => s.featured) ?? salons[0];
  const previewServices = featuredSalon.services.filter((s) => s.popular).slice(0, 2);

  return (
    <section className="relative overflow-hidden bg-secondary/50">
      <div className="bg-noise absolute inset-0 opacity-[0.35]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] size-[32rem] rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-[-10%] size-[28rem] rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:py-24">
        <div>
          <Badge variant="gold" className="mb-5">
            <MapPin className="size-3" />
            Casablanca · Barbershops, salons, spas &amp; instituts
          </Badge>

          <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
            Réservez votre rendez-vous beauté{" "}
            <span className="text-primary">sans attendre</span>.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-foreground text-balance">
            Trouvez un salon près de vous, réservez un créneau ou rejoignez la file
            d&apos;attente virtuelle par QR code. Arrivez à l&apos;heure exacte,
            profitez du service, repartez sans perdre une minute.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/recherche">
                <CalendarCheck className="size-4.5" />
                Réserver un service
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">
                Pour les salons
                <ArrowRight className="size-4.5" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div>
              <span className="font-display text-2xl font-semibold text-foreground">214+</span>
              <p>salons partenaires</p>
            </div>
            <div>
              <span className="font-display text-2xl font-semibold text-foreground">38k+</span>
              <p>réservations gérées</p>
            </div>
            <div>
              <span className="font-display text-2xl font-semibold text-foreground">22 min</span>
              <p>d&apos;attente économisées</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <Card className="border-border/70 p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-11">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {featuredSalon.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{featuredSalon.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="size-3 fill-accent text-accent" /> {featuredSalon.rating} ·{" "}
                    {featuredSalon.neighborhood}, {featuredSalon.city}
                  </p>
                </div>
              </div>
              <Badge variant="success">Dispo aujourd&apos;hui</Badge>
            </div>

            <div className="mt-5 space-y-2.5">
              {previewServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-3.5 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.durationMin} min</p>
                  </div>
                  <p className="text-sm font-semibold">{service.price} MAD</p>
                </div>
              ))}
            </div>

            <Button className="mt-5 w-full" asChild>
              <Link href={`/salons/${featuredSalon.slug}`}>Voir ce salon</Link>
            </Button>
          </Card>

          <Card className="absolute -bottom-8 -left-8 hidden w-56 gap-2 p-4 shadow-xl sm:flex sm:flex-col">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <QrCode className="size-3.5 text-primary" />
              Déjà sur place, sans rendez-vous ?
            </div>
            <p className="text-sm font-medium leading-snug">
              Scannez le QR code du salon pour rejoindre la file d&apos;attente virtuelle.
            </p>
            <p className="text-xs text-muted-foreground">Optionnel · aucun ticket créé automatiquement</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
