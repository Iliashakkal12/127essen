import Link from "next/link";
import { Check } from "lucide-react";

import { pricingPlans } from "@/data/admin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="tarifs" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Tarifs salons
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Un abonnement pensé pour chaque taille de salon
        </h2>
        <p className="mt-3 text-muted-foreground">
          Sans engagement. Changez de formule à tout moment.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative gap-6 p-7",
              plan.highlighted && "border-primary shadow-lg ring-1 ring-primary"
            )}
          >
            {plan.highlighted && (
              <Badge variant="gold" className="absolute -top-3 left-7">
                Le plus populaire
              </Badge>
            )}
            <div>
              <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold">{plan.price} MAD</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>

            <ul className="space-y-2.5 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>

            <Button asChild variant={plan.highlighted ? "default" : "outline"} className="mt-auto">
              <Link href="/dashboard">Essayer {plan.name}</Link>
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
