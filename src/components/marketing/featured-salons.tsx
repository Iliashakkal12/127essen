import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { salons } from "@/data/salons";
import { SalonCard } from "@/components/marketplace/salon-card";
import { Button } from "@/components/ui/button";

export function FeaturedSalons() {
  const featured = salons.filter((s) => s.featured);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Sélection Wagti
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Salons à la une à Casablanca
          </h2>
        </div>
        <Button asChild variant="ghost">
          <Link href="/recherche">
            Voir tous les salons
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((salon) => (
          <SalonCard key={salon.id} salon={salon} />
        ))}
      </div>
    </section>
  );
}
