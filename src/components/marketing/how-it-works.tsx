import { Search, CalendarCheck2, QrCode, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Cherchez un salon",
    description:
      "Filtrez par quartier, service, prix ou disponibilité à Casablanca : Maarif, Gauthier, Ain Diab et plus.",
  },
  {
    icon: CalendarCheck2,
    title: "Réservez un créneau",
    description:
      "Choisissez le service, le professionnel et l'heure qui vous arrange, même pendant votre pause.",
  },
  {
    icon: QrCode,
    title: "Arrivez à l'heure ou scannez",
    description:
      "Présentez-vous au bon moment, ou rejoignez la file d'attente virtuelle en scannant le QR code du salon.",
  },
  {
    icon: Sparkles,
    title: "Profitez, sans attendre",
    description:
      "Recevez votre service dès votre arrivée et repartez sans avoir perdu une minute en salle d'attente.",
  },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Comment ça marche
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Réservé en 4 étapes, prêt en un rendez-vous
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-ink-foreground">
                  <step.icon className="size-5" />
                </span>
                <span className="font-display text-3xl font-semibold text-border">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
