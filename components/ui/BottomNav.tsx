"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, PlusSquare, BarChart3 } from "lucide-react";
import { C } from "@/lib/theme";
import { Avatar } from "@/components/ui/Avatar";

export function BottomNav({
  isAdmin,
  canPost,
  name,
}: {
  isAdmin: boolean;
  canPost: boolean;
  name: string;
}) {
  const pathname = usePathname();

  const tabs = [
    { href: "/feed", label: "الرئيسية", Icon: Home },
    ...(canPost ? [{ href: "/feed/new", label: "نشر", Icon: PlusSquare }] : []),
    { href: "/notifications", label: "الإشعارات", Icon: Heart },
    ...(isAdmin ? [{ href: "/admin", label: "الإدارة", Icon: BarChart3 }] : []),
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderTop: `1px solid ${C.border}`,
        background: C.surface,
        position: "sticky",
        bottom: 0,
      }}
    >
      {tabs.map((t) => {
        const active = pathname === t.href || (t.href !== "/feed/new" && pathname?.startsWith(t.href + "/"));
        return (
          <Link
            key={t.href}
            href={t.href}
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              padding: "12px 0",
              color: active ? C.text : C.textDim,
            }}
          >
            <t.Icon size={24} strokeWidth={active ? 2.2 : 1.7} fill={active && t.Icon === Heart ? C.text : "none"} />
          </Link>
        );
      })}
      <Link
        href="/profile"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "9px 0",
        }}
      >
        <div
          style={{
            borderRadius: "50%",
            border: pathname === "/profile" ? `2px solid ${C.text}` : "2px solid transparent",
            padding: 1,
          }}
        >
          <Avatar name={name} size={24} />
        </div>
      </Link>
    </div>
  );
}
