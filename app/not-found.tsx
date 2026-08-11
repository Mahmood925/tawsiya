import Link from "next/link";
import { C } from "@/lib/theme";
import { LogoMark } from "@/components/ui/Logo";

export default function NotFound() {
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
      <div style={{ marginBottom: 18 }}>
        <LogoMark size={56} />
      </div>
      <div style={{ fontFamily: "var(--font-almarai), sans-serif", fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 8 }}>
        الصفحة غير موجودة
      </div>
      <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
        الرابط الذي حاولت الوصول إليه غير موجود أو تم حذفه.
      </div>
      <Link
        href="/feed"
        style={{
          padding: "12px 28px",
          borderRadius: 11,
          background: `linear-gradient(135deg, ${C.gold}, #B8934C)`,
          color: "#1A1206",
          fontWeight: 800,
          fontSize: 14,
          fontFamily: "var(--font-almarai), sans-serif",
        }}
      >
        رجوع للرئيسية
      </Link>
    </div>
  );
}
