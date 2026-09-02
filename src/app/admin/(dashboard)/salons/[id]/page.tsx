import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Users, Wallet } from "lucide-react";

import { getSalonById } from "@/lib/services/salon-service";
import { getSalonOperations, getSalonPlatformFees } from "@/lib/mock/salon-operations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/shared/rating";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminSalonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const salon = getSalonById(id);
  if (!salon) notFound();

  const ops = getSalonOperations(salon);
  const fees = getSalonPlatformFees(salon);

  return (
    <div className="py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href="/admin">
            <ArrowLeft className="size-4" />
            Retour à la plateforme
          </Link>
        </Button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{salon.category}</Badge>
              {salon.openToday ? (
                <Badge variant="success">Ouvert aujourd&apos;hui</Badge>
              ) : (
                <Badge variant="outline">Fermé aujourd&apos;hui</Badge>
              )}
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{salon.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {salon.address}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="size-4" /> {salon.phone}
            </p>
          </div>
          <Rating value={salon.rating} count={salon.reviewCount} size="md" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Revenu (mois)" value={`${ops.financeSummary.monthlyRevenue.toLocaleString("fr-FR")} MAD`} tone="primary" />
          <StatCard icon={Users} label="Employés" value={String(salon.staff.length)} />
          <StatCard icon={Wallet} label="Frais plateforme (mois, estimé)" value={`${fees.total.toLocaleString("fr-FR")} MAD`} tone="warning" />
          <StatCard icon={Users} label="Prestations réalisées (mois)" value={String(ops.financeSummary.completedServicesMonth)} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-0">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Équipe</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead className="text-right">Revenu généré</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salon.staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-muted-foreground">{member.role}</TableCell>
                      <TableCell className="text-right font-medium">
                        {member.revenueGeneratedMonth.toLocaleString("fr-FR")} MAD
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Services</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead className="text-right">Prix</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salon.services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="text-muted-foreground">{service.durationMin} min</TableCell>
                      <TableCell className="text-right font-medium">{service.price} MAD</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="p-0">
            <CardHeader className="pt-5">
              <CardTitle className="font-display text-lg">Rendez-vous du jour</CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              {ops.todayAppointments.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Aucun rendez-vous aujourd&apos;hui.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Employé</TableHead>
                      <TableHead>Heure</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ops.todayAppointments.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.clientName}</TableCell>
                        <TableCell className="text-muted-foreground">{a.service}</TableCell>
                        <TableCell className="text-muted-foreground">{a.staff}</TableCell>
                        <TableCell>{a.time}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize font-normal">{a.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Données de démonstration générées pour {salon.name} — vue platform-owner uniquement.
        </p>
      </div>
    </div>
  );
}
