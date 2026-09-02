import { AdminTopbar } from "@/components/admin/admin-topbar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminTopbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
