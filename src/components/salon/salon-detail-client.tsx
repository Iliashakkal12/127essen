"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Salon } from "@/lib/types";
import { SalonHeader } from "@/components/salon/salon-header";
import { ServiceList } from "@/components/salon/service-list";
import { StaffList } from "@/components/salon/staff-list";
import { ReviewsSection } from "@/components/salon/reviews-section";
import { BookingWidget } from "@/components/salon/booking-widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SalonDetailClient({ salon }: { salon: Salon }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState<string | null>(salon.services[0]?.id ?? null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const [time, setTime] = useState<string | null>(null);

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
                onSelect={setServiceId}
              />
            </TabsContent>

            <TabsContent value="equipe" className="mt-5">
              <StaffList staff={salon.staff} selectedId={staffId} onSelect={setStaffId} />
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

        <div className="lg:col-span-1">
          <BookingWidget
            salon={salon}
            serviceId={serviceId}
            staffId={staffId}
            day={day}
            time={time}
            onDayChange={setDay}
            onTimeChange={setTime}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
}
