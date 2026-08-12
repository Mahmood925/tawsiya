import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { C } from "@/lib/theme";
import { TopBar } from "@/components/ui/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { LogoutButton } from "@/components/ui/LogoutButton";

const ROLE_LABEL: Record<string, string> = {
  USER: "متداول",
  COACH: "كوتش",
  ADMIN: "إدارة",
};

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div>
      <TopBar title="الملف الشخصي" backHref="/feed" />
      <div style={{ padding: "24px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <Avatar name={session.name} size={68} ring />
          </div>
          <div style={{ fontFamily: "var(--font-almarai), sans-serif", fontWeight: 800, fontSize: 17, color: C.text }}>
            {session.name}
          </div>
          <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>{ROLE_LABEL[session.role]}</div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
