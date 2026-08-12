import { C } from "@/lib/theme";

export function Avatar({ name, size = 34, ring = false }: { name: string; size?: number; ring?: boolean }) {
  const letter = name?.trim()?.slice(-1) || "؟";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: C.goldSoft,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: C.gold,
        fontWeight: 800,
        fontFamily: "var(--font-almarai), sans-serif",
        fontSize: size * 0.42,
        flexShrink: 0,
        boxShadow: ring ? `0 0 0 3px ${C.surface}, 0 0 0 5px ${C.gold}` : "none",
      }}
    >
      {letter}
    </div>
  );
}
