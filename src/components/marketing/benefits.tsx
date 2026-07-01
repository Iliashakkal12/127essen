import {
  Clock,
  QrCode,
  CalendarRange,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const clientBenefits = [
  {
    icon: Clock,
    title: "Zéro temps d'attente",
    description:
      "Réservez pendant votre pause et arrivez pile à l'heure. Le salon vous attend, pas l'inverse.",
  },
  {
    icon: QrCode,
    title: "File d'attente par QR code",
    description:
      "Pas envie de réserver à l'avance ? Scannez le QR code sur place et suivez votre position en temps réel.",
  },
  {
    icon: CalendarRange,
    title: "Choisissez votre expert",
    description:
      "Sélectionnez le salon, le service et le professionnel qui vous correspond, en quelques secondes.",
  },
];

const ownerBenefits = [
  {
    icon: TrendingUp,
    title: "Pilotez votre chiffre d'affaires",
    description:
      "Suivi des revenus quotidiens, hebdomadaires et mensuels, par service et par employé, en un coup d'œil.",
  },
  {
    icon: Users,
    title: "Gérez votre équipe simplement",
    description:
      "Performances, commissions et charge de travail de chaque employé centralisées dans un seul tableau de bord.",
  },
  {
    icon: Wallet,
    title: "Estimez votre rentabilité",
    description:
      "Revenus, dépenses et commissions consolidés pour connaître votre profit réel, sans tableur Excel.",
  },
];

function BenefitGrid({
  items,
}: {
  items: { icon: React.ElementType; title: string; description: string }[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.title} className="gap-3 p-6">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <item.icon className="size-5" />
          </span>
          <h3 className="font-display text-lg font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}

export function Benefits() {
  return (
    <section id="avantages" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Pourquoi Wagti
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Pensé pour les clients pressés, conçu pour les salons ambitieux
        </h2>
      </div>

      <div className="space-y-10">
        <div>
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
            Pour les clients
          </h3>
          <BenefitGrid items={clientBenefits} />
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
            Pour les salons
          </h3>
          <BenefitGrid items={ownerBenefits} />
        </div>
      </div>
    </section>
  );
}
