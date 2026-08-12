import type { LucideIcon } from "lucide-react";
import { C } from "@/lib/theme";

export function EmptyState({ icon: Icon, title, hint }: { icon: LucideIcon; title: string; hint?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "56px 24px" }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: C.goldSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 14px",
        }}
      >
        <Icon size={24} color={C.gold} strokeWidth={1.6} />
      </div>
      <div style={{ fontFamily: "var(--font-almarai), sans-serif", fontWeight: 700, fontSize: 14, color: C.text }}>{title}</div>
      {hint && <div style={{ fontSize: 12, color: C.textDim, marginTop: 5, lineHeight: 1.7 }}>{hint}</div>}
    </div>
  );
}
