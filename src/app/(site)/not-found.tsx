import Link from "next/link";
import { CalendarSearch, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SiteNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <span className="mb-5 flex size-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <CalendarSearch className="size-8" />
      </span>
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        Page introuvable
      </h1>
      <p className="mt-2 text-muted-foreground">
        Ce salon, ce rendez-vous ou cette page n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/recherche">Rechercher un salon</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="size-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
