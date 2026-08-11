import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { TopBar } from "@/components/ui/TopBar";
import { AdminDashboard } from "@/components/ui/AdminDashboard";

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/feed");

  return (
    <div>
      <TopBar title="لوحة تحكم الإدارة" backHref="/feed" />
      <AdminDashboard />
    </div>
  );
}
