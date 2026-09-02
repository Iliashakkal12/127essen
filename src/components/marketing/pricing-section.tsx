import { Check } from "lucide-react";

import { pricingPlans } from "@/data/admin";
import { platformConfig } from "@/lib/platform-config";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="tarifs" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Modèle économique
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Wagti est gratuit à l&apos;usage, financé à la réservation
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Pas d&apos;abonnement obligatoire : {platformConfig.customerFeePerBooking} MAD côté client et{" "}
          {platformConfig.salonFeePerService} MAD côté salon par prestation. Au-delà de{" "}
          {platformConfig.volumeThreshold} prestations sur {platformConfig.thresholdPeriodDays} jours, le frais
          salon est suspendu pour le reste du mois.
        </p>
      </div>

      {!platformConfig.legacySaasPlansActive && (
        <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-center text-sm text-muted-foreground">
          Les formules ci-dessous sont un aperçu de plans d&apos;abonnement optionnels
          <span className="font-medium text-foreground"> à venir</span> pour des besoins avancés
          (multi-établissements, statistiques comparatives). Elles ne sont pas actives et ne remplacent
          pas le modèle par prestation ci-dessus.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative gap-6 p-7",
              plan.highlighted && "border-primary shadow-lg ring-1 ring-primary"
            )}
          >
            <Badge variant={plan.highlighted ? "gold" : "outline"} className="absolute -top-3 left-7">
              {plan.highlighted ? "Bientôt · le plus demandé" : "Bientôt disponible"}
            </Badge>
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

            <Button variant="outline" className="mt-auto" disabled>
              Pas encore disponible
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
