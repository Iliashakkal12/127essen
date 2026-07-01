"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Users,
  ListChecks,
  Menu,
  ArrowLeft,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Scissors,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/finances", label: "Finances", icon: Wallet },
  { href: "/dashboard/employes", label: "Employés", icon: Users },
  { href: "/dashboard/services", label: "Services", icon: ListChecks },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Scissors className="size-4.5" />
        </span>
        <div>
          <p className="font-display text-base font-semibold leading-tight">Barber Lounge</p>
          <p className="text-xs text-sidebar-foreground/60">Maarif, Casablanca</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <ArrowLeft className="size-4.5" />
          Retour au site
        </Link>
      </div>
    </div>
  );
}

export function DashboardShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed h-screen w-64">
          <SidebarContent />
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar border-sidebar-border">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
            {description && (
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                {description}
              </p>
            )}
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4.5" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-2.5 hover:bg-secondary">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    BL
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">Barber Lounge</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">Barber Lounge Maarif</p>
                <p className="text-xs text-muted-foreground">proprietaire@barberlounge.ma</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="size-4" />
                Paramètres du salon
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="size-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-1 flex items-center gap-2 lg:hidden">
              <Badge variant="gold">Démo</Badge>
              <p className="text-xs text-muted-foreground">Données fictives</p>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
