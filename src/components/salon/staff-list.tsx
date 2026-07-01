import { Star } from "lucide-react";

import type { Staff } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function StaffList({
  staff,
  selectedId,
  onSelect,
}: {
  staff: Staff[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Card
        onClick={() => onSelect(null)}
        className={cn(
          "cursor-pointer flex-row items-center gap-3 p-4 transition-colors hover:border-primary/50",
          selectedId === null && "border-primary bg-primary/5 ring-1 ring-primary"
        )}
      >
        <Avatar className="size-11">
          <AvatarFallback className="bg-secondary text-secondary-foreground">?</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Sans préférence</p>
          <p className="text-xs text-muted-foreground">Premier disponible</p>
        </div>
      </Card>

      {staff.map((member) => {
        const active = member.id === selectedId;
        return (
          <Card
            key={member.id}
            onClick={() => onSelect(member.id)}
            className={cn(
              "cursor-pointer flex-row items-center gap-3 p-4 transition-colors hover:border-primary/50",
              active && "border-primary bg-primary/5 ring-1 ring-primary"
            )}
          >
            <Avatar className="size-11">
              <AvatarFallback className={cn("bg-gradient-to-br text-white", member.colorFrom, member.colorTo)}>
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">{member.role}</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3 fill-accent text-accent" />
                {member.rating.toFixed(1)}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
