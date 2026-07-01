"use client";

import { useState } from "react";
import { Check, X, CheckCheck, MoreHorizontal } from "lucide-react";

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

const statusVariant: Record<AppointmentStatus, "success" | "warning" | "outline" | "destructive"> = {
  "confirmée": "outline",
  "en attente": "warning",
  "terminée": "success",
  "annulée": "destructive",
};

export function AppointmentsTable({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);

  function updateStatus(id: string, status: AppointmentStatus) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

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
                {a.status === "en attente" && (
                  <Button size="icon-sm" variant="outline" onClick={() => updateStatus(a.id, "confirmée")}>
                    <Check className="size-3.5" />
                  </Button>
                )}
                {a.status === "confirmée" && (
                  <Button size="icon-sm" variant="outline" onClick={() => updateStatus(a.id, "terminée")}>
                    <CheckCheck className="size-3.5" />
                  </Button>
                )}
                {(a.status === "en attente" || a.status === "confirmée") && (
                  <Button size="icon-sm" variant="outline" onClick={() => updateStatus(a.id, "annulée")}>
                    <X className="size-3.5" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon-sm" variant="ghost">
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateStatus(a.id, "confirmée")}>
                      Marquer confirmée
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(a.id, "terminée")}>
                      Marquer terminée
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(a.id, "annulée")}>
                      Annuler
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
