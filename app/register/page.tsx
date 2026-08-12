"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Lock } from "lucide-react";
import { C } from "@/lib/theme";
import { TopBar } from "@/components/ui/TopBar";
import { Field } from "@/components/ui/Field";
import { GoldButton } from "@/components/ui/GoldButton";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "حدث خطأ");
      return;
    }
    router.push("/pending");
  }

  return (
    <div className="app-shell-bg">
      <div className="app-frame">
        <TopBar title="إنشاء حساب" backHref="/login" />
        <form onSubmit={submit} style={{ padding: "20px 20px", maxWidth: 420, margin: "0 auto", width: "100%" }}>
          <Field icon={User} placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} required />
          <Field icon={Phone} placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Field icon={Mail} placeholder="البريد الإلكتروني" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field icon={Lock} placeholder="كلمة المرور" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Field icon={Lock} placeholder="تأكيد كلمة المرور" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

          {error && <div style={{ color: C.coral, fontSize: 12.5, marginBottom: 12 }}>{error}</div>}

          <div style={{ marginTop: 8 }}>
            <GoldButton type="submit" disabled={loading}>
              {loading ? "جارٍ الإنشاء..." : "إنشاء الحساب"}
            </GoldButton>
          </div>
        </form>
      </div>
    </div>
  );
}
