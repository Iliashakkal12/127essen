import { SalonWorkspaceProvider } from "@/lib/salon-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <SalonWorkspaceProvider>{children}</SalonWorkspaceProvider>;
}
