import { Quote } from "lucide-react";

import { testimonials } from "@/data/testimonials";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Rating } from "@/components/shared/rating";

export function TestimonialsSection() {
  return (
    <section id="temoignages" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Ils utilisent Wagti
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Clients et salons témoignent
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <Card key={t.name} className="gap-4 p-6">
              <Quote className="size-6 text-primary/40" />
              <p className="text-sm text-foreground/90">&laquo; {t.quote} &raquo;</p>
              <Rating value={t.rating} />
              <div className="mt-auto flex items-center gap-3 pt-2">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
