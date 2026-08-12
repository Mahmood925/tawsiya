"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Chip } from "@/components/ui/Chip";

const FILTERS = [
  { key: "all", label: "الكل" },
  { key: "news", label: "أخبار" },
  { key: "analysis", label: "تحليل" },
];

export function FeedFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "all";

  function setFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") params.delete("category");
    else params.set("category", key);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="chip-row" style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto" }}>
      {FILTERS.map((f) => (
        <Chip key={f.key} active={active === f.key} onClick={() => setFilter(f.key)}>
          {f.label}
        </Chip>
      ))}
    </div>
  );
}
