import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { timeAgo } from "@/lib/posts";
import { C } from "@/lib/theme";
import { TopBar } from "@/components/ui/TopBar";
import { TrendingUp, MessageCircle, Heart, ShieldCheck, ShieldX } from "lucide-react";

const ICON_MAP: Record<string, { Icon: typeof TrendingUp; color: string; bg: string }> = {
  NEW_POST: { Icon: TrendingUp, color: C.teal, bg: C.tealSoft },
  NEW_COMMENT: { Icon: MessageCircle, color: "#2F6FE0", bg: "rgba(47,111,224,0.10)" },
  NEW_LIKE: { Icon: Heart, color: C.coral, bg: C.coralSoft },
  ACCOUNT_APPROVED: { Icon: ShieldCheck, color: C.gold, bg: C.goldSoft },
  ACCOUNT_REJECTED: { Icon: ShieldX, color: C.coral, bg: C.coralSoft },
};

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
  if (unreadIds.length > 0) {
    await prisma.notification.updateMany({ where: { id: { in: unreadIds } }, data: { read: true } });
  }

  return (
    <div>
      <TopBar title="الإشعارات" backHref="/feed" />
      <div style={{ padding: "14px 16px" }}>
        {notifications.map((n) => {
          const m = ICON_MAP[n.type] || ICON_MAP.NEW_POST;
          const content = (
            <div
              style={{
                display: "flex",
                gap: 11,
                background: C.surface,
                border: `1px solid ${unreadIds.includes(n.id) ? C.gold + "55" : C.border}`,
                borderRadius: 13,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: m.bg,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <m.Icon size={16} color={m.color} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3, fontFamily: "var(--font-almarai), sans-serif" }}>
                  {n.title}
                </div>
                <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.6, marginBottom: 4 }}>{n.body}</div>
                <div style={{ fontSize: 10.5, color: C.textDim, opacity: 0.7 }}>{timeAgo(n.createdAt.toISOString())}</div>
              </div>
            </div>
          );
          return n.link ? (
            <a key={n.id} href={n.link} style={{ display: "block" }}>
              {content}
            </a>
          ) : (
            <div key={n.id}>{content}</div>
          );
        })}
        {notifications.length === 0 && (
          <div style={{ textAlign: "center", color: C.textDim, fontSize: 13, padding: "40px 0" }}>
            لا توجد إشعارات
          </div>
        )}
      </div>
    </div>
  );
}
