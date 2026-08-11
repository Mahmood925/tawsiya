"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { C } from "@/lib/theme";
import { Field } from "@/components/ui/Field";
import { GoldButton } from "@/components/ui/GoldButton";
import { LogoMark } from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      if (data.status === "PENDING") router.push("/pending");
      else setError(data.error || "حدث خطأ");
      return;
    }
    router.push("/feed");
    router.refresh();
  }

  return (
    <form onSubmit={submit} style={{ padding: "40px 20px 20px", maxWidth: 420, margin: "0 auto" }}>
      <div style={{ textAlign: "center", margin: "18px 0 26px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <LogoMark size={56} />
        </div>
        <div style={{ fontFamily: "var(--font-almarai), sans-serif", fontWeight: 800, fontSize: 19, color: C.text }}>
          مرحباً بعودتك
        </div>
        <div style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>سجّل دخولك لمتابعة التوصيات والتحليلات</div>
      </div>

      <Field icon={Mail} placeholder="البريد الإلكتروني" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Field icon={Lock} placeholder="كلمة المرور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      {error && <div style={{ color: C.coral, fontSize: 12.5, marginBottom: 12 }}>{error}</div>}

      <GoldButton type="submit" disabled={loading}>
        {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
      </GoldButton>

      <div style={{ textAlign: "center", marginTop: 18, fontSize: 12.5, color: C.textDim }}>
        ليس لديك حساب؟{" "}
        <Link href="/register" style={{ color: C.gold, fontWeight: 700 }}>
          سجل الآن
        </Link>
      </div>
    </form>
  );
}
