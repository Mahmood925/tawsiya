import { redirect } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getFeedPosts, timeAgo } from "@/lib/posts";
import { Header } from "@/components/ui/Header";
import { FeedFilters } from "@/components/ui/FeedFilters";
import { PostCard } from "@/components/ui/PostCard";
import { NotificationPrompt } from "@/components/ui/NotificationPrompt";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const [posts, unreadCount] = await Promise.all([
    getFeedPosts(session.sub, searchParams.category),
    prisma.notification.count({ where: { userId: session.sub, read: false } }),
  ]);

  return (
    <div>
      <Header unreadCount={unreadCount} />
      <NotificationPrompt />
      <FeedFilters />
      <div>
        {posts.length === 0 && (
          <EmptyState icon={TrendingUp} title="لا توجد منشورات بعد" hint="ستظهر هنا أحدث التوصيات والتحليلات فور نشرها" />
        )}
        {posts.map((p) => (
          <PostCard key={p.id} post={p} timeLabel={timeAgo(p.createdAt)} />
        ))}
      </div>
    </div>
  );
}
