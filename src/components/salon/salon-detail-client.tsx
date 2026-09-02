"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QrCode } from "lucide-react";

import type { Salon } from "@/lib/types";
import { getCompatibleStaff } from "@/lib/services/salon-service";
import { forBooking, useSalonOverrides } from "@/lib/mock/salon-overrides";
import { SalonHeader } from "@/components/salon/salon-header";
import { ServiceList } from "@/components/salon/service-list";
import { StaffList } from "@/components/salon/staff-list";
import { ReviewsSection } from "@/components/salon/reviews-section";
import { BookingWidget } from "@/components/salon/booking-widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SalonDetailClient({ salon: baseSalon }: { salon: Salon }) {
  const router = useRouter();
  // Overlays any employee/service edits made in the dashboard (same
  // browser, localStorage-backed — see salon-overrides.ts) and hides
  // deactivated staff from booking entirely.
  const { salon: overriddenSalon } = useSalonOverrides(baseSalon);
  const salon = forBooking(overriddenSalon);
  const [serviceId, setServiceId] = useState<string | null>(salon.services[0]?.id ?? null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const [time, setTime] = useState<string | null>(null);

  const compatibleStaff = getCompatibleStaff(salon, serviceId);

  function handleServiceSelect(id: string) {
    // A barber who can't perform the newly selected service must never stay
    // selected — that was the "book anyone for anything" bug.
    const stillCompatible = getCompatibleStaff(salon, id).some((member) => member.id === staffId);
    if (staffId && !stillCompatible) {
      setStaffId(null);
    }
    setServiceId(id);
    setTime(null);
  }

  function handleStaffSelect(id: string | null) {
    setStaffId(id);
    setTime(null);
  }

  function handleDayChange(nextDay: "today" | "tomorrow") {
    setDay(nextDay);
    setTime(null);
  }

  function handleConfirm() {
    const params = new URLSearchParams({
      salon: salon.slug,
      service: serviceId ?? "",
      staff: staffId ?? "",
      day,
      time: time ?? "",
    });
    router.push(`/reservation/confirmation?${params.toString()}`);
  }

  return (
    <div className="pb-20">
      <SalonHeader salon={salon} />

      <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-8 lg:col-span-2">
          <Tabs defaultValue="services">
            <TabsList>
              <TabsTrigger value="services">Prestations</TabsTrigger>
              <TabsTrigger value="equipe">Équipe</TabsTrigger>
              <TabsTrigger value="avis">Avis ({salon.reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-5">
              <ServiceList
                services={salon.services}
                selectedId={serviceId}
                onSelect={handleServiceSelect}
              />
            </TabsContent>

            <TabsContent value="equipe" className="mt-5">
              {serviceId && (
                <p className="mb-3 text-xs text-muted-foreground">
                  Employés pouvant réaliser « {salon.services.find((s) => s.id === serviceId)?.name} »
                </p>
              )}
              <StaffList staff={compatibleStaff} selectedId={staffId} onSelect={handleStaffSelect} />
            </TabsContent>

            <TabsContent value="avis" className="mt-5">
              <ReviewsSection reviews={salon.reviews} />
            </TabsContent>
          </Tabs>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold">À propos</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {salon.longDescription}
            </p>
          </div>
        </div>

        {/*
          lg:self-start: without it, CSS grid's default align-items:stretch
          makes this column as tall as the (much taller) services column,
          giving BookingWidget's sticky containing block far more "runway"
          than it needs.
        */}
        <div className="lg:col-span-1 lg:self-start">
          <BookingWidget
            salon={salon}
            serviceId={serviceId}
            staffId={staffId}
            day={day}
            time={time}
            onDayChange={handleDayChange}
            onTimeChange={setTime}
            onConfirm={handleConfirm}
          />
        </div>
      </div>

      {/*
        Deliberately OUTSIDE the two-column grid above, not stacked under
        the sticky BookingWidget in the same column: a sticky element's
        containing block always keeps some "stuck" runway past its own
        natural height, during which it paints above plain siblings
        regardless of DOM order — so anything placed directly below it in
        that column risks being intermittently covered while scrolling.
        Living in its own full-width block sidesteps that entirely rather
        than fighting it with z-index.
      */}
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="flex-row items-center gap-4 border-dashed p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
            <QrCode className="size-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">Déjà sur place, sans rendez-vous ?</p>
            <p className="text-xs text-muted-foreground">
              Scannez le QR code à l&apos;accueil, ou rejoignez la file d&apos;attente
              directement depuis votre téléphone.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={`/file-attente/${salon.id}`}>Voir la file d&apos;attente</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
