import { notFound } from "next/navigation";

import { getSalonBySlug, salons } from "@/data/salons";
import { SalonDetailClient } from "@/components/salon/salon-detail-client";

export function generateStaticParams() {
  return salons.map((s) => ({ slug: s.slug }));
}

export default async function SalonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const salon = getSalonBySlug(slug);

  if (!salon) notFound();

  return <SalonDetailClient salon={salon} />;
}
