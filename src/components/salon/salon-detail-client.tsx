"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { QrCode } from "lucide-react";

import type { Salon } from "@/lib/types";
import { getCompatibleStaff } from "@/lib/services/salon-service";
import { SalonHeader } from "@/components/salon/salon-header";
import { ServiceList } from "@/components/salon/service-list";
import { StaffList } from "@/components/salon/staff-list";
import { ReviewsSection } from "@/components/salon/reviews-section";
import { BookingWidget } from "@/components/salon/booking-widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SalonDetailClient({ salon }: { salon: Salon }) {
  const router = useRouter();
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

        <div className="space-y-5 lg:col-span-1">
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

          <Card className="gap-2.5 border-dashed p-5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <QrCode className="size-4 text-primary" />
              Déjà sur place, sans rendez-vous ?
            </p>
            <p className="text-xs text-muted-foreground">
              Scannez le QR code à l&apos;accueil ou rejoignez la file d&apos;attente virtuelle
              directement depuis votre téléphone.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-1 w-full">
              <Link href={`/file-attente/${salon.id}`}>Rejoindre la file d&apos;attente</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
