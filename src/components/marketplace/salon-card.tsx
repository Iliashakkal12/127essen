import Link from "next/link";
import { MapPin, Zap } from "lucide-react";

import type { Salon } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/shared/rating";
import { SalonCover } from "@/components/shared/salon-cover";

export function SalonCard({ salon }: { salon: Salon }) {
  return (
    <Link href={`/salons/${salon.slug}`} className="group block">
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-lg">
        <div className="relative">
          <SalonCover
            gradient={salon.gradient}
            category={salon.category}
            className="h-40 w-full"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="bg-white/90 text-foreground shadow-sm">
              {salon.category}
            </Badge>
          </div>
          {salon.openToday && (
            <div className="absolute right-3 top-3">
              <Badge variant="success" className="bg-white/95 shadow-sm">
                <Zap className="size-3" />
                Dispo aujourd&apos;hui
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-4 pt-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-tight text-foreground group-hover:text-primary">
              {salon.name}
            </h3>
            <Rating value={salon.rating} className="shrink-0" />
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">
              {salon.neighborhood}, {salon.city} · {salon.distanceKm} km
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Dès <span className="font-semibold text-foreground">{salon.priceFrom} MAD</span>
            </p>
            <p className="text-xs text-muted-foreground">{salon.reviewCount} avis</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
