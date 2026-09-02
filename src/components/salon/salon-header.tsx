import { Clock, MapPin, Phone } from "lucide-react";

import type { Salon } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/shared/rating";
import { SalonCover } from "@/components/shared/salon-cover";

export function SalonHeader({ salon }: { salon: Salon }) {
  return (
    <div>
      <SalonCover
        gradient={salon.gradient}
        category={salon.category}
        className="h-52 w-full sm:h-64 lg:h-72"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:-mt-8 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{salon.category}</Badge>
                {salon.openToday ? (
                  <Badge variant="success">Disponible aujourd&apos;hui</Badge>
                ) : (
                  <Badge variant="outline">Complet aujourd&apos;hui</Badge>
                )}
              </div>
              <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {salon.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {salon.description}
              </p>
            </div>
            <Rating value={salon.rating} count={salon.reviewCount} size="md" />
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0 text-primary" />
              {salon.address}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0 text-primary" />
              {salon.openingHours}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-4 shrink-0 text-primary" />
              {salon.phone}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {salon.amenities.map((a) => (
              <Badge key={a} variant="outline" className="font-normal">
                {a}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
