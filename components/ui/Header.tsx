import Link from "next/link";
import { Heart } from "lucide-react";
import { C } from "@/lib/theme";
import { LogoLockup } from "@/components/ui/Logo";

export function Header({ unreadCount }: { unreadCount: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 14px",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <LogoLockup mark={30} word={17} gap={8} />
      <Link href="/notifications" style={{ position: "relative", display: "flex" }}>
        <Heart size={23} strokeWidth={1.7} color={C.text} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -2,
              left: -2,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: C.coral,
              border: `1.5px solid ${C.surface}`,
            }}
          />
        )}
      </Link>
    </div>
  );
}
