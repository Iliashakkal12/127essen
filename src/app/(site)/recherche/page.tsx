"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { salons, neighborhoods, categories } from "@/data/salons";
import { SalonCard } from "@/components/marketplace/salon-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const priceRanges = [
  { label: "Tous les prix", value: "all" },
  { label: "Moins de 100 MAD", value: "0-100" },
  { label: "100 – 300 MAD", value: "100-300" },
  { label: "Plus de 300 MAD", value: "300-999999" },
];

const ratings = [
  { label: "Toutes les notes", value: "0" },
  { label: "4.5 et plus", value: "4.5" },
  { label: "4.0 et plus", value: "4.0" },
];

export default function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [neighborhood, setNeighborhood] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState("0");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = useMemo(() => {
    const [minPrice, maxPrice] = priceRange === "all" ? [0, Infinity] : priceRange.split("-").map(Number);

    return salons.filter((s) => {
      if (query && !s.name.toLowerCase().includes(query.toLowerCase()) && !s.description.toLowerCase().includes(query.toLowerCase())) return false;
      if (neighborhood !== "all" && s.neighborhood !== neighborhood) return false;
      if (category !== "all" && s.category !== category) return false;
      if (s.priceFrom > maxPrice || s.priceTo < minPrice) return false;
      if (s.rating < Number(minRating)) return false;
      if (availableOnly && !s.openToday) return false;
      return true;
    });
  }, [query, neighborhood, category, priceRange, minRating, availableOnly]);

  const activeFilterCount = [
    neighborhood !== "all",
    category !== "all",
    priceRange !== "all",
    minRating !== "0",
    availableOnly,
  ].filter(Boolean).length;

  function resetFilters() {
    setNeighborhood("all");
    setCategory("all");
    setPriceRange("all");
    setMinRating("0");
    setAvailableOnly(false);
  }

  return (
    <div className="bg-secondary/30">
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Trouvez votre prochain rendez-vous à Casablanca
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {`${salons.length} salons partenaires · Barbershops, salons de coiffure, instituts de beauté & spas`}
          </p>

          <div className="relative mt-6">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un salon, un quartier ou un service..."
              className="h-12 rounded-full pl-11 text-base"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-full" size="sm">
                <SelectValue placeholder="Type de service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={neighborhood} onValueChange={setNeighborhood}>
              <SelectTrigger className="rounded-full" size="sm">
                <SelectValue placeholder="Quartier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les quartiers</SelectItem>
                {neighborhoods.map((n) => (
                  <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="rounded-full" size="sm">
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger className="rounded-full" size="sm">
                <SelectValue placeholder="Note" />
              </SelectTrigger>
              <SelectContent>
                {ratings.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 rounded-full border border-input px-3.5 py-1.5">
              <Switch id="available" checked={availableOnly} onCheckedChange={setAvailableOnly} />
              <Label htmlFor="available" className="text-sm font-normal text-foreground">
                Disponible aujourd&apos;hui
              </Label>
            </div>

            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                <X className="size-3.5" />
                Réinitialiser ({activeFilterCount})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="size-4" />
            {filtered.length} salon{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
            <Badge variant="secondary" className="mb-3">Aucun résultat</Badge>
            <p className="text-lg font-medium">Aucun salon ne correspond à votre recherche</p>
            <p className="mt-1 text-sm text-muted-foreground">Essayez d&apos;élargir vos filtres.</p>
            <Button variant="outline" className="mt-5" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
