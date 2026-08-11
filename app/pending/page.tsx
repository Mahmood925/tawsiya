import Link from "next/link";
import { Clock } from "lucide-react";
import { C } from "@/lib/theme";

export default function PendingPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: C.amberSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          border: `1px solid ${C.amber}55`,
        }}
      >
        <Clock size={26} color={C.amber} />
      </div>
      <div style={{ fontFamily: "var(--font-almarai), sans-serif", fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 8 }}>
        طلبك قيد المراجعة
      </div>
      <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.8, maxWidth: 260 }}>
        تم إرسال طلب التسجيل إلى إدارة المعهد. سيتم إشعارك فور قبول حسابك.
      </div>
      <Link
        href="/login"
        style={{
          marginTop: 26,
          width: "100%",
          maxWidth: 300,
          padding: "13px",
          borderRadius: 11,
          background: `linear-gradient(135deg, ${C.gold}, #B8934C)`,
          color: "#1A1206",
          fontWeight: 800,
          fontSize: 14,
          fontFamily: "var(--font-almarai), sans-serif",
          textAlign: "center",
        }}
      >
        رجوع لتسجيل الدخول
      </Link>
    </div>
  );
}
