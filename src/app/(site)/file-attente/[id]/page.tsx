import { notFound } from "next/navigation";

import { salons } from "@/data/salons";
import { QueueStatus } from "@/components/queue/queue-status";

export function generateStaticParams() {
  return salons.map((s) => ({ id: s.id }));
}

export default async function QueuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const salon = salons.find((s) => s.id === id);

  if (!salon) notFound();

  return <QueueStatus salon={salon} />;
}
