import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BottomNav } from "@/components/ui/BottomNav";
import { C } from "@/lib/theme";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.status === "PENDING") redirect("/pending");
  if (session.status === "REJECTED") redirect("/login");

  return (
    <div style={{ display: "flex", justifyContent: "center", background: C.bg, minHeight: "100vh" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          minHeight: "100vh",
          background: C.surface,
          borderInline: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          color: C.text,
        }}
      >
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
