"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { C } from "@/lib/theme";

const DISMISS_KEY = "tawsiya_notif_dismissed";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function NotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
    if (!supported) return;
    if (Notification.permission === "granted" || Notification.permission === "denied") return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    setVisible(true);
  }, []);

  async function enable() {
    setBusy(true);
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) return;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setVisible(false);
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setVisible(false);
    } finally {
      setBusy(false);
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: C.goldSoft,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <Bell size={18} color={C.gold} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>
        فعّل الإشعارات عشان توصلك التوصيات الجديدة فوراً على هاتفك
      </div>
      <button
        onClick={enable}
        disabled={busy}
        style={{
          background: C.gold,
          color: "#1A1206",
          border: "none",
          borderRadius: 8,
          padding: "7px 12px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          flexShrink: 0,
          fontFamily: "var(--font-almarai), sans-serif",
        }}
      >
        {busy ? "..." : "تفعيل"}
      </button>
      <button
        onClick={dismiss}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
      >
        <X size={16} color={C.textDim} />
      </button>
    </div>
  );
}
