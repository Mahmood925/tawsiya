"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { C } from "@/lib/theme";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      style={{
        width: "100%",
        marginTop: 16,
        padding: "13px",
        borderRadius: 12,
        cursor: "pointer",
        background: C.coralSoft,
        border: `1px solid ${C.coral}44`,
        color: C.coral,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontWeight: 700,
        fontSize: 13.5,
        fontFamily: "var(--font-almarai), sans-serif",
      }}
    >
      <LogOut size={15} /> تسجيل الخروج
    </button>
  );
}
