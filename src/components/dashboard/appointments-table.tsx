"use client";

import { Check, LogIn, MoreHorizontal, Play, UserX, X } from "lucide-react";

import type { Appointment, AppointmentStatus } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusVariant: Record<AppointmentStatus, "success" | "warning" | "outline" | "destructive" | "secondary"> = {
  "en attente": "warning",
  "confirmée": "outline",
  "arrivée": "outline",
  "en cours": "warning",
  "terminée": "success",
  "annulée": "destructive",
  "absence": "destructive",
};

/**
 * The explicit action(s) for each status — one obvious verb per state
 * instead of one ambiguous "manage" control. See AppointmentStatus in
 * lib/types.ts for the full lifecycle this mirrors.
 */
function PrimaryActions({
  appointment,
  onUpdate,
}: {
  appointment: Appointment;
  onUpdate: (id: string, status: AppointmentStatus) => void;
}) {
  const { id, status } = appointment;

  switch (status) {
    case "en attente":
      return (
        <>
          <Button size="sm" variant="outline" onClick={() => onUpdate(id, "confirmée")}>
            <Check className="size-3.5" />
            Confirmer
          </Button>
          <Button size="icon-sm" variant="outline" onClick={() => onUpdate(id, "annulée")}>
            <X className="size-3.5" />
          </Button>
        </>
      );
    case "confirmée":
      return (
        <>
          <Button size="sm" variant="outline" onClick={() => onUpdate(id, "arrivée")}>
            <LogIn className="size-3.5" />
            Marquer comme arrivé
          </Button>
          <Button size="icon-sm" variant="outline" onClick={() => onUpdate(id, "annulée")}>
            <X className="size-3.5" />
          </Button>
        </>
      );
    case "arrivée":
      return (
        <Button size="sm" variant="outline" onClick={() => onUpdate(id, "en cours")}>
          <Play className="size-3.5" />
          Démarrer
        </Button>
      );
    case "en cours":
      return (
        <Button size="sm" onClick={() => onUpdate(id, "terminée")}>
          <Check className="size-3.5" />
          Terminer
        </Button>
      );
    default:
      return null;
  }
}

function OverflowActions({
  appointment,
  onUpdate,
}: {
  appointment: Appointment;
  onUpdate: (id: string, status: AppointmentStatus) => void;
}) {
  const { id, status } = appointment;
  const canMarkNoShow = status === "confirmée" || status === "arrivée";
  if (!canMarkNoShow) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="ghost">
          <MoreHorizontal className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onUpdate(id, "absence")}>
          <UserX className="size-4" />
          Marquer absent (no-show)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppointmentsTable({
  appointments,
  onUpdateStatus,
}: {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Employé</TableHead>
          <TableHead>Heure</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Prix</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((a) => (
          <TableRow key={a.id}>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-secondary text-xs">{a.clientInitials}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{a.clientName}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{a.service}</TableCell>
            <TableCell className="text-muted-foreground">{a.staff}</TableCell>
            <TableCell className="font-medium">{a.time}</TableCell>
            <TableCell>
              <Badge variant={a.type === "walk-in" ? "secondary" : "outline"} className="font-normal">
                {a.type}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{a.price} MAD</TableCell>
            <TableCell>
              <Badge variant={statusVariant[a.status]} className="capitalize">
                {a.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1.5">
                <PrimaryActions appointment={a} onUpdate={onUpdateStatus} />
                <OverflowActions appointment={a} onUpdate={onUpdateStatus} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
