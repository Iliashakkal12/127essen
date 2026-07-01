import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center text-ink-foreground sm:px-16">
        <div className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <h2 className="relative font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Prêt à ne plus jamais attendre en salon ?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-ink-foreground/70">
          Rejoignez des milliers de Casablancais qui réservent leur rendez-vous
          beauté en quelques secondes.
        </p>
        <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="gold">
            <Link href="/recherche">
              Réserver un service
              <ArrowRight className="size-4.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-ink-foreground hover:bg-white/10 hover:text-ink-foreground"
          >
            <Link href="/dashboard">Inscrire mon salon</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
