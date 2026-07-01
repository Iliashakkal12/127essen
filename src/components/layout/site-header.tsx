"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, CalendarCheck, LayoutDashboard } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/recherche", label: "Rechercher un salon" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/#tarifs", label: "Tarifs salons" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  pathname === link.href && "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <LayoutDashboard className="size-4" />
              Espace salon
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/recherche">
              <CalendarCheck className="size-4" />
              Réserver un service
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] sm:w-80">
            <SheetHeader>
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-2 p-4">
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link href="/dashboard">
                  <LayoutDashboard className="size-4" />
                  Espace salon
                </Link>
              </Button>
              <Button asChild onClick={() => setOpen(false)}>
                <Link href="/recherche">
                  <CalendarCheck className="size-4" />
                  Réserver un service
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
