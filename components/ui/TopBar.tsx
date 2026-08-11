import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { C } from "@/lib/theme";

export function TopBar({ title, backHref }: { title: string; backHref?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div style={{ width: 28 }}>
        {backHref && (
          <Link href={backHref} style={{ display: "flex" }}>
            <ChevronRight size={20} color={C.text} />
          </Link>
        )}
      </div>
      <div
        style={{
          fontFamily: "var(--font-almarai), sans-serif",
          fontWeight: 800,
          fontSize: 15.5,
          color: C.text,
        }}
      >
        {title}
      </div>
      <div style={{ width: 28 }} />
    </div>
  );
}
