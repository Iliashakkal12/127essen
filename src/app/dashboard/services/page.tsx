"use client";

import { useState } from "react";
import { Clock, Pencil, Plus, Trash2 } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useSalonWorkspace } from "@/lib/salon-context";
import type { Salon, Service } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const emptyForm = { name: "", category: "", durationMin: "30", price: "" };

export default function ServicesPage() {
  const { salon } = useSalonWorkspace();
  // Keying by salon.id remounts this subtree (and resets its local state)
  // whenever the active salon changes, instead of syncing state via effect.
  return <ServicesWorkspace key={salon.id} salon={salon} />;
}

function ServicesWorkspace({ salon }: { salon: Salon }) {
  const { setServices } = useSalonWorkspace();
  const services = salon.services;
  const assignableStaff = salon.staff.filter((s) => s.active !== false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [staffIds, setStaffIds] = useState<string[]>([]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setStaffIds([]);
    setOpen(true);
  }

  function openEdit(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      category: service.category,
      durationMin: String(service.durationMin),
      price: String(service.price),
    });
    setStaffIds(service.staffIds);
    setOpen(true);
  }

  function handleDelete(id: string) {
    if (confirm("Supprimer ce service ?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  }

  function toggleStaff(id: string) {
    setStaffIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function handleSave() {
    if (!form.name.trim()) return;

    if (editingId) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: form.name,
                category: form.category || "Autre",
                durationMin: Number(form.durationMin) || 30,
                price: Number(form.price) || 0,
                staffIds,
              }
            : s
        )
      );
    } else {
      setServices((prev) => [
        ...prev,
        {
          id: `${salon.id}-custom-${Date.now()}`,
          name: form.name,
          category: form.category || "Autre",
          durationMin: Number(form.durationMin) || 30,
          price: Number(form.price) || 0,
          staffIds,
        },
      ]);
    }
    setOpen(false);
  }

  return (
    <DashboardShell
      title="Services"
      description={`Prestations proposées par ${salon.name}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{services.length} services actifs</p>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) {
              setEditingId(null);
              setForm(emptyForm);
              setStaffIds([]);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              Ajouter un service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier le service" : "Ajouter un service"}</DialogTitle>
              <DialogDescription>
                Renseignez les informations du service. (Maquette de démonstration)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="svc-name">Nom du service</Label>
                <Input
                  id="svc-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex. Coupe + barbe"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="svc-category">Catégorie</Label>
                  <Input
                    id="svc-category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="Ex. Coupe"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="svc-duration">Durée (min)</Label>
                  <Input
                    id="svc-duration"
                    type="number"
                    value={form.durationMin}
                    onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="svc-price">Prix (MAD)</Label>
                <Input
                  id="svc-price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="Ex. 100"
                />
              </div>
              <div className="space-y-2">
                <Label>Employés assignés</Label>
                <div className="space-y-2 rounded-xl border border-border p-3">
                  {assignableStaff.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Aucun employé actif — ajoutez d&apos;abord un employé.
                    </p>
                  )}
                  {assignableStaff.map((member) => (
                    <label key={member.id} className="flex items-center gap-2.5 text-sm">
                      <Checkbox
                        checked={staffIds.includes(member.id)}
                        onCheckedChange={() => toggleStaff(member.id)}
                      />
                      {member.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={handleSave}>{editingId ? "Enregistrer" : "Ajouter le service"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Employés</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">{service.category}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {service.durationMin} min
                  </span>
                </TableCell>
                <TableCell className="font-medium">{service.price} MAD</TableCell>
                <TableCell className="text-muted-foreground">
                  {service.staffIds.length > 0
                    ? salon.staff
                        .filter((m) => service.staffIds.includes(m.id))
                        .map((m) => m.name.split(" ")[0])
                        .join(", ")
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button size="icon-sm" variant="outline" onClick={() => openEdit(service)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="outline" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </DashboardShell>
  );
}
