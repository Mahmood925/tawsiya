import { BarChart3, Newspaper } from "lucide-react";
import { C } from "@/lib/theme";

const MAP: Record<string, { label: string; color: string; bg: string; Icon: typeof Newspaper }> = {
  analysis: { label: "تحليل", color: "#2F6FE0", bg: "rgba(47,111,224,0.10)", Icon: BarChart3 },
  news: { label: "خبر", color: C.amber, bg: C.amberSoft, Icon: Newspaper },
};

export function TypeBadge({ category }: { category: string }) {
  const m = MAP[category] || MAP.news;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        color: m.color,
        background: m.bg,
        borderRadius: 7,
        padding: "3px 8px",
        fontFamily: "var(--font-ibm-plex), sans-serif",
      }}
    >
      <m.Icon size={11} /> {m.label}
    </span>
  );
}
