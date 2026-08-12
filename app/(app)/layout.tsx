import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BottomNav } from "@/components/ui/BottomNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.status === "PENDING") redirect("/pending");
  if (session.status === "REJECTED") redirect("/login");

  return (
    <div className="app-shell-bg">
      <div className="app-frame">
        <div style={{ flex: 1 }}>{children}</div>
        <BottomNav
          isAdmin={session.role === "ADMIN"}
          canPost={session.role === "COACH" || session.role === "ADMIN"}
          name={session.name}
        />
      </div>
    </div>
  );
}
