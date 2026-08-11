import { prisma } from "@/lib/db";
import type { PostCardData } from "@/components/ui/PostCard";

const ALLOWED_CATEGORIES = ["analysis", "news"];

export async function getFeedPosts(userId: string | null, category?: string | null): Promise<PostCardData[]> {
  const posts = await prisma.post.findMany({
    where: category && ALLOWED_CATEGORIES.includes(category) ? { category } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: { select: { id: true, name: true } },
      images: true,
      _count: { select: { likes: true, comments: true } },
      likes: userId ? { where: { userId }, select: { id: true } } : false,
    },
  });

  return posts.map((p) => ({
    id: p.id,
    category: p.category,
    title: p.title,
    body: p.body,
    createdAt: p.createdAt.toISOString(),
    author: p.author,
    images: p.images.map((i) => ({ id: i.id, url: i.url })),
    likeCount: p._count.likes,
    commentCount: p._count.comments,
    likedByMe: userId ? p.likes.length > 0 : false,
  }));
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "أمس";
  return `منذ ${days} يوم`;
}
