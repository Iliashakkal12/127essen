import Link from "next/link";
import { Camera, Globe, MapPin, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo dark />
            <p className="mt-4 max-w-xs text-sm text-ink-foreground/70">
              La marketplace beauté &amp; bien-être de Casablanca. Réservez sans
              attendre, gérez votre salon sans effort.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Camera className="size-4" />
              </Link>
              <Link
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Globe className="size-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-foreground">Plateforme</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-foreground/70">
              <li><Link href="/recherche" className="hover:text-ink-foreground">Rechercher un salon</Link></li>
              <li><Link href="/#comment-ca-marche" className="hover:text-ink-foreground">Comment ça marche</Link></li>
              <li><Link href="/#avantages" className="hover:text-ink-foreground">Avantages</Link></li>
              <li><Link href="/#temoignages" className="hover:text-ink-foreground">Témoignages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-foreground">Espace pro</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-foreground/70">
              <li><Link href="/dashboard" className="hover:text-ink-foreground">Tableau de bord</Link></li>
              <li><Link href="/dashboard/finances" className="hover:text-ink-foreground">Finances</Link></li>
              <li><Link href="/dashboard/employes" className="hover:text-ink-foreground">Employés</Link></li>
              <li><Link href="/#tarifs" className="hover:text-ink-foreground">Tarifs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-foreground">Contact</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-foreground/70">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" /> Casablanca, Maroc</li>
              <li className="flex items-center gap-2"><Phone className="size-4 shrink-0" /> 05 22 00 00 00</li>
              <li className="flex items-center gap-2"><Mail className="size-4 shrink-0" /> contact@wagti.ma</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-ink-foreground/60 sm:flex-row">
          <p>&copy; 2026 Wagti. Tous droits réservés. Maquette de démonstration.</p>
          <p>Fait à Casablanca 🇲🇦</p>
        </div>
      </div>
    </footer>
  );
}
