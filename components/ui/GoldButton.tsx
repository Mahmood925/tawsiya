"use client";

import { C } from "@/lib/theme";

export function GoldButton({
  children,
  onClick,
  type = "button",
  disabled,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "13px",
        borderRadius: 11,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        background: `linear-gradient(135deg, ${C.gold}, #B8934C)`,
        color: "#1A1206",
        fontWeight: 800,
        fontSize: 14,
        fontFamily: "var(--font-almarai), sans-serif",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
