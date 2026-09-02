import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Page introuvable</h1>
      <p className="text-muted-foreground">Cette page n&apos;existe pas.</p>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
