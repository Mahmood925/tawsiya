"use client";

import { C } from "@/lib/theme";

export function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 600,
        fontFamily: "var(--font-ibm-plex), sans-serif",
        border: `1px solid ${active ? C.gold : C.border}`,
        background: active ? C.goldSoft : "transparent",
        color: active ? C.gold : C.textDim,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}
